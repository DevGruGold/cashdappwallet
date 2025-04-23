
import { useReadContract, useWriteContract, useAccount, useBlockNumber, useChainId } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { XMRT_CONTRACT_CONFIG } from '@/contracts/XMRTContract';
import { toast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';

export function useXMRTContract() {
  const { address, chainId: accountChainId } = useAccount();
  const chainId = useChainId();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [balance, setBalance] = useState<string>('0');
  
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
  const { writeContractAsync: wrapMonero } = useWriteContract();
  const { writeContractAsync: unwrapMonero } = useWriteContract();
  const { writeContractAsync: onRampFiat } = useWriteContract();
  const { writeContractAsync: offRampFiat } = useWriteContract();

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
      
      await wrapMonero({
        ...XMRT_CONTRACT_CONFIG,
        functionName: 'wrapMonero',
        args: [amountWei],
        value: bridgeFee,
        account: address,
        chain: chainId,
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
      
      await unwrapMonero({
        ...XMRT_CONTRACT_CONFIG,
        functionName: 'unwrapMonero',
        args: [amountWei],
        account: address,
        chain: chainId,
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
      
      await onRampFiat({
        ...XMRT_CONTRACT_CONFIG,
        functionName: 'onRampFiat',
        args: [amountWei],
        value: onRampFee,
        account: address,
        chain: chainId,
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
      
      await offRampFiat({
        ...XMRT_CONTRACT_CONFIG,
        functionName: 'offRampFiat',
        args: [amountWei],
        account: address,
        chain: chainId,
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

  return {
    tokenName,
    tokenSymbol,
    balance,
    handleWrapMonero,
    handleUnwrapMonero,
    handleOnRampFiat,
    handleOffRampFiat,
  };
}
