
import { Address, parseEther } from 'viem';

// XMRT Token Contract Interface
export interface XMRT {
  // Token Info
  name: () => Promise<string>;
  symbol: () => Promise<string>;
  totalSupply: () => Promise<bigint>;
  balanceOf: (owner: Address) => Promise<bigint>;
  
  // Monero Wrapping Functions
  wrapMonero: (amount: bigint) => Promise<void>;
  unwrapMonero: (amount: bigint) => Promise<void>;
  
  // Fiat On/Off Ramping
  onRampFiat: (amount: bigint) => Promise<void>;
  offRampFiat: (amount: bigint) => Promise<void>;
  
  // CashDapp Info
  cashDapps: (operator: Address) => Promise<{
    operator: Address;
    totalFiatOnRamped: bigint;
    totalFiatOffRamped: bigint;
    totalFeesCollected: bigint;
  }>;
  
  // Staking Functions
  stake: (amount: bigint, tierLevel: bigint) => Promise<void>;
  unstake: (amount: bigint) => Promise<void>;
  getReward: () => Promise<void>;
  
  // Governance Functions
  createProposal: (description: string, endBlock: bigint) => Promise<void>;
  castVote: (proposalId: bigint, support: boolean) => Promise<void>;
  
  // User-to-User Functions
  transfer: (to: Address, amount: bigint) => Promise<boolean>;
  transferFrom: (from: Address, to: Address, amount: bigint) => Promise<boolean>;
  approve: (spender: Address, amount: bigint) => Promise<boolean>;
  allowance: (owner: Address, spender: Address) => Promise<bigint>;
  
  // Cold Storage Functions
  transferToColdStorage: (amount: bigint, coldStorageAddress: Address) => Promise<void>;
  retrieveFromColdStorage: (amount: bigint, signature: string) => Promise<void>;
}

// ABI (expanded to include all functions from the contract)
export const XMRT_ABI = [
  // Basic ERC20 functions
  { inputs: [], name: "name", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "symbol", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "totalSupply", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "account", type: "address" }], name: "balanceOf", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  
  // ERC20 Transfer functions (User-to-User)
  { inputs: [{ internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "amount", type: "uint256" }], name: "transfer", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "address", name: "from", type: "address" }, { internalType: "address", name: "to", type: "address" }, { internalType: "uint256", name: "amount", type: "uint256" }], name: "transferFrom", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "address", name: "spender", type: "address" }, { internalType: "uint256", name: "amount", type: "uint256" }], name: "approve", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "address", name: "owner", type: "address" }, { internalType: "address", name: "spender", type: "address" }], name: "allowance", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  
  // Monero Wrapping
  { inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }], name: "wrapMonero", outputs: [], stateMutability: "payable", type: "function" },
  { inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }], name: "unwrapMonero", outputs: [], stateMutability: "nonpayable", type: "function" },
  
  // Fiat On/Off Ramping
  { inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }], name: "onRampFiat", outputs: [], stateMutability: "payable", type: "function" },
  { inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }], name: "offRampFiat", outputs: [], stateMutability: "nonpayable", type: "function" },
  
  // Staking Functions
  { inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }, { internalType: "uint256", name: "tierLevel", type: "uint256" }], name: "stake", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }], name: "unstake", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "getReward", outputs: [], stateMutability: "nonpayable", type: "function" },
  
  // Governance Functions
  { inputs: [{ internalType: "string", name: "description", type: "string" }, { internalType: "uint256", name: "endBlock", type: "uint256" }], name: "createProposal", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "uint256", name: "proposalId", type: "uint256" }, { internalType: "bool", name: "support", type: "bool" }], name: "castVote", outputs: [], stateMutability: "nonpayable", type: "function" },
  
  // CashDapp Info
  { inputs: [{ internalType: "address", name: "", type: "address" }], name: "cashDapps", outputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "uint256", name: "totalFiatOnRamped", type: "uint256" },
      { internalType: "uint256", name: "totalFiatOffRamped", type: "uint256" },
      { internalType: "uint256", name: "totalFeesCollected", type: "uint256" }
    ], stateMutability: "view", type: "function" },
  
  // Cold Storage Functions
  { inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }, { internalType: "address", name: "coldStorageAddress", type: "address" }], name: "transferToColdStorage", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }, { internalType: "bytes", name: "signature", type: "bytes" }], name: "retrieveFromColdStorage", outputs: [], stateMutability: "nonpayable", type: "function" }
];

// Contract configuration
export const XMRT_CONTRACT_CONFIG = {
  // This would be the address of the deployed XMRT contract
  address: '0x0000000000000000000000000000000000000000' as Address,
  abi: XMRT_ABI,
};

// Helper functions
export const formatXMRT = (amount: bigint): string => {
  const amountInEther = parseFloat(amount.toString()) / 10**18;
  return amountInEther.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
};
