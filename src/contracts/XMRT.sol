// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract XMRT is
    Initializable,
    ERC20Upgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.AddressSet;

    // Access Control Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant CEO_ROLE = keccak256("CEO_ROLE");
    bytes32 public constant CFO_ROLE = keccak256("CFO_ROLE");
    bytes32 public constant CTO_ROLE = keccak256("CTO_ROLE");
    bytes32 public constant COMPLIANCE_OFFICER_ROLE = keccak256("COMPLIANCE_OFFICER_ROLE");
    bytes32 public constant DAP_ROLE = keccak256("DAP_ROLE");
    bytes32 public constant CASH_DAPP_ROLE = keccak256("CASH_DAPP_ROLE");

    // Constants
    uint256 public constant MAX_SUPPLY = 21_000_000 * 10**18;
    uint256 public constant MAX_REWARD_RATE = 10000; // 100% in basis points
    uint256 public constant REWARDS_PRECISION = 1e12;
    uint256 public constant MIN_VOTING_PERIOD = 3 days;
    uint256 public constant MAX_VOTING_PERIOD = 14 days;
    uint256 public constant EMERGENCY_COOLDOWN = 1 days;
    uint256 public constant DAP_REVENUE_SHARE = 20; // 20% revenue share for DAP developers
    uint256 public constant KYC_THRESHOLD = 1000 * 10**18; // KYC required for transactions above 1000 XMRT
    uint256 public constant BRIDGE_FEE = 10; // 0.1% bridge fee
    uint256 public constant ON_RAMP_FEE = 50; // 0.5% on-ramp fee
    uint256 public constant OFF_RAMP_FEE = 50; // 0.5% off-ramp fee

    // State Variables
    uint256 public totalStaked;
    uint256 public insuranceFund;
    uint256 public treasuryBalance;
    uint256 public lastRewardBlock;
    uint256 public rewardPerTokenStored;
    uint256 public proposalCount;
    uint256 public quorumPercentage;
    bool private _emergencyUnstakeEnabled;
    uint256 private _lastEmergencyAction;
    uint256 public totalWrappedMonero; // Total XMR wrapped into XMRT
    address public cashDappOperator; // Address of the CashDapp operator

    // Structs
    struct StakingTier {
        uint256 lockupPeriod;
        uint256 rewardRate;
        uint256 minimumStake;
        bool active;
    }

    struct UserStake {
        uint256 amount;
        uint256 tierLevel;
        uint256 startTime;
        uint256 endTime;
        uint256 rewardDebt;
        uint256 lastUpdateBlock;
    }

    struct Proposal {
        address proposer;
        string description;
        uint256 startBlock;
        uint256 endBlock;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        bool canceled;
        bytes32 descriptionHash;
        ProposalState state;
    }

    struct Receipt {
        bool hasVoted;
        bool support;
        uint256 votes;
    }

    struct DAP {
        address developer;
        string name;
        uint256 revenueGenerated;
        uint256 lastPayout;
    }

    struct CashDapp {
        address operator; // Address of the CashDapp operator
        uint256 totalFiatOnRamped; // Total fiat on-ramped
        uint256 totalFiatOffRamped; // Total fiat off-ramped
        uint256 totalFeesCollected; // Total fees collected from on/off-ramping
    }

    struct HandwritingSample {
        bytes32 sampleHash;
        uint256 timestamp;
        bool verified;
    }

    enum ProposalState {
        Pending,
        Active,
        Canceled,
        Defeated,
        Succeeded,
        Queued,
        Expired,
        Executed
    }

    // Mappings
    mapping(uint256 => StakingTier) public stakingTiers;
    mapping(address => UserStake) public userStakes;
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => uint256) public votingPower;
    mapping(address => mapping(uint256 => Receipt)) public receipts;
    mapping(address => HandwritingSample) public handwritingSamples;
    mapping(address => uint256) public lastActivityBlock;
    mapping(address => address) public delegates;
    mapping(string => DAP) public daps;
    mapping(address => EnumerableSet.AddressSet) private _userApprovals;
    mapping(address => uint256) public wrappedMoneroBalances; // XMR wrapped into XMRT
    mapping(address => CashDapp) public cashDapps; // Registered CashDapps

    // Events
    event StakingTierAdded(uint256 indexed tierId, uint256 lockupPeriod, uint256 rewardRate, uint256 minimumStake);
    event Staked(address indexed user, uint256 amount, uint256 tierLevel);
    event Unstaked(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event ProposalCreated(uint256 indexed proposalId, address proposer, string description);
    event VoteCast(address indexed voter, uint256 indexed proposalId, bool support, uint256 votes);
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCanceled(uint256 indexed proposalId);
    event EmergencyUnstakeEnabled(bool enabled);
    event KYCStatusUpdated(address indexed user, bool status);
    event BridgeOperationProcessed(address indexed user, uint256 amount, string operationType);
    event SecurityIncident(string description, uint256 timestamp);
    event DelegateChanged(address indexed delegator, address indexed delegatee);
    event PublicMeetingScheduled(string topic, uint256 timestamp, string link);
    event DAPRegistered(string name, address developer);
    event DAPRevenueShared(string name, uint256 amount);
    event KYCAttempt(address indexed user, bool success, uint256 timestamp);
    event HandwritingSampleSubmitted(address indexed user, bytes32 sampleHash, uint256 timestamp);
    event MoneroWrapped(address indexed user, uint256 amount, uint256 xmrtMinted);
    event MoneroUnwrapped(address indexed user, uint256 amount, uint256 xmrtBurned);
    event CashDappRegistered(address indexed operator, string name);
    event FiatOnRamped(address indexed user, uint256 amount, uint256 fee);
    event FiatOffRamped(address indexed user, uint256 amount, uint256 fee);

    // Custom Errors
    error InsufficientStake(uint256 available, uint256 required);
    error VotingPeriodInvalid(uint256 min, uint256 max);
    error ProposalNotActive(uint256 proposalId);
    error AlreadyVoted(address voter, uint256 proposalId);
    error InvalidOracleData(int256 price, uint256 updatedAt);
    error DAPAlreadyRegistered(string name);
    error KYCRequired(uint256 amount);
    error KYCFailed(address user);
    error HandwritingSampleNotVerified(address user);
    error BridgeFeeNotPaid(uint256 requiredFee);
    error InvalidCashDappOperator(address operator);
    error CashDappAlreadyRegistered(address operator);

    // Initialization
    function initialize(
        address admin,
        address ceo,
        address cfo,
        address cto,
        address complianceOfficer,
        address cashDappOperatorAddress
    ) public initializer {
        __ERC20_init("XMRT Token", "XMRT");
        __AccessControl_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(CEO_ROLE, ceo);
        _setupRole(CFO_ROLE, cfo);
        _setupRole(CTO_ROLE, cto);
        _setupRole(COMPLIANCE_OFFICER_ROLE, complianceOfficer);
        _setupRole(CASH_DAPP_ROLE, cashDappOperatorAddress); // Admin can register CashDapps

        cashDappOperator = cashDappOperatorAddress;
        quorumPercentage = 4000; // 40%
        lastRewardBlock = block.number;
        _emergencyUnstakeEnabled = false;

        _mint(admin, MAX_SUPPLY); // Mint the total supply to the admin
    }

    // Monero Wrapping Process (Handled by CashDapp)
    function wrapMonero(uint256 amount) external payable nonReentrant {
        require(msg.value >= amount.mul(BRIDGE_FEE).div(10000), "Bridge fee not paid");
        require(hasRole(CASH_DAPP_ROLE, cashDappOperator), "Invalid CashDapp operator");

        // Mint XMRT to the user (1:1 wrapping ratio)
        _mint(msg.sender, amount);
        totalWrappedMonero += amount;
        wrappedMoneroBalances[msg.sender] += amount;

        emit MoneroWrapped(msg.sender, amount, amount);
    }

    function unwrapMonero(uint256 amount) external nonReentrant {
        require(wrappedMoneroBalances[msg.sender] >= amount, "Insufficient wrapped Monero");

        // Burn XMRT and release Monero (handled by CashDapp)
        _burn(msg.sender, amount);
        totalWrappedMonero -= amount;
        wrappedMoneroBalances[msg.sender] -= amount;

        emit MoneroUnwrapped(msg.sender, amount, amount);
    }

    // CashDapp Registration
    function registerCashDapp(address operator, string memory name) external onlyRole(CASH_DAPP_ROLE) {
        if (cashDapps[operator].operator != address(0)) revert CashDappAlreadyRegistered(operator);
        cashDapps[operator] = CashDapp({
            operator: operator,
            totalFiatOnRamped: 0,
            totalFiatOffRamped: 0,
            totalFeesCollected: 0
        });
        emit CashDappRegistered(operator, name);
    }

    // Fiat On-Ramping (Convert fiat to XMRT)
    function onRampFiat(uint256 amount) external payable nonReentrant {
        require(msg.value >= amount.mul(ON_RAMP_FEE).div(10000), "On-ramp fee not paid");

        // Mint XMRT to the user
        _mint(msg.sender, amount);

        // Update CashDapp state
        CashDapp storage cashDapp = cashDapps[msg.sender];
        cashDapp.totalFiatOnRamped += amount;
        cashDapp.totalFeesCollected += msg.value;

        emit FiatOnRamped(msg.sender, amount, msg.value);
    }

    // Fiat Off-Ramping (Convert XMRT to fiat)
    function offRampFiat(uint256 amount) external nonReentrant {
        require(balanceOf(msg.sender) >= amount, "Insufficient XMRT balance");

        // Burn XMRT from the user
        _burn(msg.sender, amount);

        // Update CashDapp state
        CashDapp storage cashDapp = cashDapps[msg.sender];
        cashDapp.totalFiatOffRamped += amount;
        cashDapp.totalFeesCollected += amount.mul(OFF_RAMP_FEE).div(10000);

        emit FiatOffRamped(msg.sender, amount, amount.mul(OFF_RAMP_FEE).div(10000));
    }

    // Upgrade Control
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(CTO_ROLE) {
        require(newImplementation != address(0), "Invalid implementation");
    }

    // Storage Gap for Future Upgrades
    uint256[50] private __gap;
}
