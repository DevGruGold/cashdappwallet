
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useXMRTContract } from "@/hooks/useXMRTContract";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { Send, Users } from "lucide-react";
import { isAddress } from "viem";
import { useToast } from "@/components/ui/use-toast";

export const UserToUserTransfer = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { balance, handleTransferToUser } = useXMRTContract();
  const { toast } = useToast();
  
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isValidAddress, setIsValidAddress] = useState<boolean>(true);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRecipientAddress(value);
    if (value === "" || isAddress(value)) {
      setIsValidAddress(true);
    } else {
      setIsValidAddress(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  const handleTransfer = () => {
    if (!isAddress(recipientAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address",
        variant: "destructive",
      });
      return;
    }

    if (Number(amount) <= 0 || Number(amount) > Number(balance)) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    handleTransferToUser(recipientAddress as `0x${string}`, amount);
    setAmount("");
    setRecipientAddress("");
  };

  return (
    <Card className="p-6 bg-cashdapp-gray mt-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-cashdapp-green" />
        <h2 className="text-xl font-semibold">User-to-User Transfer</h2>
      </div>

      {isConnected ? (
        <div className="space-y-4">
          <div className="bg-cashdapp-light-gray rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Your XMRT Balance</p>
            <p className="text-2xl font-bold">{Number(balance).toFixed(4)} XMRT</p>
          </div>
          
          <div className="bg-cashdapp-light-gray rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-2">Recipient Address</p>
            <Input
              type="text"
              value={recipientAddress}
              onChange={handleAddressChange}
              placeholder="0x..."
              className={`w-full bg-cashdapp-gray p-3 rounded-lg text-sm font-medium outline-none ${!isValidAddress ? 'border-red-500' : ''}`}
            />
            {!isValidAddress && (
              <p className="text-xs text-red-500 mt-1">Please enter a valid Ethereum address</p>
            )}
          </div>
          
          <div className="bg-cashdapp-light-gray rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-2">Amount (XMRT)</p>
            <Input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.0"
              className="w-full bg-cashdapp-gray p-3 rounded-lg text-sm font-medium outline-none"
            />
          </div>
          
          <Button
            onClick={handleTransfer}
            className="w-full bg-cashdapp-green text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
            disabled={!isValidAddress || !recipientAddress || !amount || Number(amount) <= 0 || Number(amount) > Number(balance)}
          >
            <Send className="mr-2 h-4 w-4" />
            Transfer XMRT
          </Button>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="mb-4">Connect your wallet to transfer XMRT to other users</p>
          <Button 
            onClick={() => open()}
            className="bg-cashdapp-green text-black hover:bg-cashdapp-green/90"
          >
            Connect Wallet
          </Button>
        </div>
      )}
    </Card>
  );
};
