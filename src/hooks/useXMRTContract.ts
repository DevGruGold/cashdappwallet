
import { useReadContract, useWriteContract, useAccount, useBlockNumber, useChainId } from 'wagmi';
import { parseEther, formatEther, Address } from 'viem';
import { XMRT_CONTRACT_CONFIG } from '@/contracts/XMRTContract';
import { toast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';
import { mainnet, arbitrum } from 'wagmi/chains';

export function useXMRTContract() {
  const { address, chainId: accountChainId } = useAccount();
  const chainId = useChainId();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [balance, setBalance] = useState<string>('0');
  
  // Helper function to get the chain object from chain ID
  const getChainById = (id: number) => {
    if (id === mainnet.id) return mainnet;
    if (id === arbitrum.id) return arbitrum;
    return mainnet; // Default to mainnet
  };
  
  // Read contract data
  const { data: tokenName } = useReadContract({
    ...XMRT_CONTRACT_CONFIG,
    functionName: 'name',
  });
  
  const { data: tokenSymbol } = useReadContract({
    ...XMRT_CONTRACT_CONFIG,
    functionName: 'symbol',
  });
  
  const { data: balanceData } = useReadContract({
    ...XMRT_CONTRACT_CONFIG,
    functionName: 'balanceOf',
    args: [address || '0x0'],
    query: {
      enabled: !!address,
    },
  });

  // Write contract functions
  const { writeContractAsync } = useWriteContract();

  // Parse balance whenever it changes
  useEffect(() => {
    if (balanceData) {
      setBalance(formatEther(balanceData as bigint));
    }
  }, [balanceData, blockNumber]);

  // Function to wrap Monero
  const handleWrapMonero = async (amount: string) => {
    try {
      const amountWei = parseEther(amount);
      const bridgeFee = amountWei * BigInt(10) / BigInt(10000); // 0.1% bridge fee
      
      await writeContractAsync({
        ...XMRT_CONTRACT_CONFIG,
        functionName: 'wrapMonero',
        args: [amountWei],
        value: bridgeFee,
        account: address,
        chain: getChainById(chainId),
      });
      
      toast({
        title: "Transaction Successful",
        description: `Successfully wrapped ${amount} XMR to XMRT`,
      });
    } catch (error) {
      console.error("Error wrapping Monero:", error);
      toast({
        title: "Transaction Failed",
        description: "Failed to wrap Monero. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to unwrap Monero
  const handleUnwrapMonero = async (amount: string) => {
    try {
      const amountWei = parseEther(amount);
      
      await writeContractAsync({
        ...XMRT_CONTRACT_CONFIG,
        functionName: 'unwrapMonero',
        args: [amountWei],
        account: address,
        chain: getChainById(chainId),
      });
      
      toast({
        title: "Transaction Successful",
        description: `Successfully unwrapped ${amount} XMRT to XMR`,
      });
    } catch (error) {
      console.error("Error unwrapping Monero:", error);
      toast({
        title: "Transaction Failed",
        description: "Failed to unwrap Monero. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to on-ramp fiat
  const handleOnRampFiat = async (amount: string) => {
    try {
      const amountWei = parseEther(amount);
      const onRampFee = amountWei * BigInt(50) / BigInt(10000); // 0.5% on-ramp fee
      
      await writeContractAsync({
        ...XMRT_CONTRACT_CONFIG,
        functionName: 'onRampFiat',
        args: [amountWei],
        value: onRampFee,
        account: address,
        chain: getChainById(chainId),
      });
      
      toast({
        title: "Transaction Successful",
        description: `Successfully on-ramped ${amount} fiat to XMRT`,
      });
    } catch (error) {
      console.error("Error on-ramping fiat:", error);
      toast({
        title: "Transaction Failed",
        description: "Failed to on-ramp fiat. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to off-ramp fiat
  const handleOffRampFiat = async (amount: string) => {
    try {
      const amountWei = parseEther(amount);
      
      await writeContractAsync({
        ...XMRT_CONTRACT_CONFIG,
        functionName: 'offRampFiat',
        args: [amountWei],
        account: address,
        chain: getChainById(chainId),
      });
      
      toast({
        title: "Transaction Successful",
        description: `Successfully off-ramped ${amount} XMRT to fiat`,
      });
    } catch (error) {
      console.error("Error off-ramping fiat:", error);
      toast({
        title: "Transaction Failed",
        description: "Failed to off-ramp fiat. Please try again.",
        variant: "destructive",
      });
    }
  };

  // User-to-User Testing Functions
  const handleTransferToUser = async (recipientAddress: Address, amount: string) => {
    try {
      const amountWei = parseEther(amount);
      
      await writeContractAsync({
        ...XMRT_CONTRACT_CONFIG,
        functionName: 'transfer',
        args: [recipientAddress, amountWei],
        account: address,
        chain: getChainById(chainId),
      });
      
      toast({
        title: "Transfer Successful",
        description: `Successfully transferred ${amount} XMRT to ${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`,
      });
    } catch (error) {
      console.error("Error transferring XMRT:", error);
      toast({
        title: "Transfer Failed",
        description: "Failed to transfer XMRT. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Staking Functions
  const handleStake = async (amount: string, tierLevel: number) => {
    try {
      const amountWei = parseEther(amount);
      
      await writeContractAsync({
        ...XMRT_CONTRACT_CONFIG,
        functionName: 'stake',
        args: [amountWei, BigInt(tierLevel)],
        account: address,
        chain: getChainById(chainId),
      });
      
      toast({
        title: "Stake Successful",
        description: `Successfully staked ${amount} XMRT at tier ${tierLevel}`,
      });
    } catch (error) {
      console.error("Error staking XMRT:", error);
      toast({
        title: "Stake Failed",
        description: "Failed to stake XMRT. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUnstake = async (amount: string) => {
    try {
      const amountWei = parseEther(amount);
      
      await writeContractAsync({
        ...XMRT_CONTRACT_CONFIG,
        functionName: 'unstake',
        args: [amountWei],
        account: address,
        chain: getChainById(chainId),
      });
      
      toast({
        title: "Unstake Successful",
        description: `Successfully unstaked ${amount} XMRT`,
      });
    } catch (error) {
      console.error("Error unstaking XMRT:", error);
      toast({
        title: "Unstake Failed",
        description: "Failed to unstake XMRT. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGetReward = async () => {
    try {
      await writeContractAsync({
        ...XMRT_CONTRACT_CONFIG,
        functionName: 'getReward',
        account: address,
        chain: getChainById(chainId),
      });
      
      toast({
        title: "Rewards Collected",
        description: "Successfully collected staking rewards",
      });
    } catch (error) {
      console.error("Error collecting rewards:", error);
      toast({
        title: "Collection Failed",
        description: "Failed to collect staking rewards. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Cold Storage Functions
  const handleTransferToColdStorage = async (amount: string, coldStorageAddress: Address) => {
    try {
      const amountWei = parseEther(amount);
      
      await writeContractAsync({
        ...XMRT_CONTRACT_CONFIG,
        functionName: 'transferToColdStorage',
        args: [amountWei, coldStorageAddress],
        account: address,
        chain: getChainById(chainId),
      });
      
      toast({
        title: "Cold Storage Transfer Successful",
        description: `Successfully transferred ${amount} XMRT to cold storage`,
      });
    } catch (error) {
      console.error("Error transferring to cold storage:", error);
      toast({
        title: "Cold Storage Transfer Failed",
        description: "Failed to transfer XMRT to cold storage. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRetrieveFromColdStorage = async (amount: string, signature: string) => {
    try {
      const amountWei = parseEther(amount);
      
      await writeContractAsync({
        ...XMRT_CONTRACT_CONFIG,
        functionName: 'retrieveFromColdStorage',
        args: [amountWei, signature],
        account: address,
        chain: getChainById(chainId),
      });
      
      toast({
        title: "Cold Storage Retrieval Successful",
        description: `Successfully retrieved ${amount} XMRT from cold storage`,
      });
    } catch (error) {
      console.error("Error retrieving from cold storage:", error);
      toast({
        title: "Cold Storage Retrieval Failed",
        description: "Failed to retrieve XMRT from cold storage. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    tokenName,
    tokenSymbol,
    balance,
    handleWrapMonero,
    handleUnwrapMonero,
    handleOnRampFiat,
    handleOffRampFiat,
    handleTransferToUser,
    handleStake,
    handleUnstake,
    handleGetReward,
    handleTransferToColdStorage,
    handleRetrieveFromColdStorage,
  };
}
