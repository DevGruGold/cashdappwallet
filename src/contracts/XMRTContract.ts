
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
}

// ABI (abbreviated for core functions, expanded based on the full contract)
export const XMRT_ABI = [
  // Basic ERC20 functions
  { inputs: [], name: "name", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "symbol", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "totalSupply", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ internalType: "address", name: "account", type: "address" }], name: "balanceOf", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  
  // Monero Wrapping
  { inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }], name: "wrapMonero", outputs: [], stateMutability: "payable", type: "function" },
  { inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }], name: "unwrapMonero", outputs: [], stateMutability: "nonpayable", type: "function" },
  
  // Fiat On/Off Ramping
  { inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }], name: "onRampFiat", outputs: [], stateMutability: "payable", type: "function" },
  { inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }], name: "offRampFiat", outputs: [], stateMutability: "nonpayable", type: "function" },
  
  // CashDapp Info
  { inputs: [{ internalType: "address", name: "", type: "address" }], name: "cashDapps", outputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "uint256", name: "totalFiatOnRamped", type: "uint256" },
      { internalType: "uint256", name: "totalFiatOffRamped", type: "uint256" },
      { internalType: "uint256", name: "totalFeesCollected", type: "uint256" }
    ], stateMutability: "view", type: "function" }
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
