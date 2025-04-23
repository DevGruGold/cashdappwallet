
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useXMRTContract } from "@/hooks/useXMRTContract";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { Shield, ArrowRightLeft } from "lucide-react";
import { isAddress } from "viem";
import { useToast } from "@/components/ui/use-toast";

export const ColdStorage = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { balance, handleTransferToColdStorage, handleRetrieveFromColdStorage } = useXMRTContract();
  const { toast } = useToast();
  
  const [amount, setAmount] = useState<string>("");
  const [coldStorageAddress, setColdStorageAddress] = useState<string>("");
  const [retrievalSignature, setRetrievalSignature] = useState<string>("");
  const [isValidAddress, setIsValidAddress] = useState<boolean>(true);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColdStorageAddress(value);
    if (value === "" || isAddress(value)) {
      setIsValidAddress(true);
    } else {
      setIsValidAddress(false);
    }
  };

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRetrievalSignature(e.target.value);
  };

  const handleSendToColdStorage = () => {
    if (!isAddress(coldStorageAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid cold storage address",
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

    handleTransferToColdStorage(amount, coldStorageAddress as `0x${string}`);
    setAmount("");
    setColdStorageAddress("");
  };

  const handleRetrieveFromStorage = () => {
    if (!retrievalSignature) {
      toast({
        title: "Missing Signature",
        description: "Please provide a valid signature for retrieval",
        variant: "destructive",
      });
      return;
    }

    if (Number(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    handleRetrieveFromColdStorage(amount, retrievalSignature);
    setAmount("");
    setRetrievalSignature("");
  };

  return (
    <Card className="p-6 bg-cashdapp-gray mt-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-cashdapp-green" />
        <h2 className="text-xl font-semibold">Cold Storage</h2>
      </div>

      {isConnected ? (
        <>
          <div className="bg-cashdapp-light-gray rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-400 mb-1">Your XMRT Balance</p>
            <p className="text-2xl font-bold">{Number(balance).toFixed(4)} XMRT</p>
          </div>

          <Tabs defaultValue="deposit" className="w-full">
            <TabsList className="w-full bg-cashdapp-light-gray">
              <TabsTrigger value="deposit" className="flex-1">
                Deposit to Cold Storage
              </TabsTrigger>
              <TabsTrigger value="retrieve" className="flex-1">
                Retrieve from Cold Storage
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="deposit" className="mt-4">
              <div className="space-y-4">
                <div className="bg-cashdapp-light-gray rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Amount (XMRT)</p>
                  <Input
                    type="text"
                    placeholder="0.0"
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full bg-cashdapp-gray p-3 rounded-lg text-sm font-medium outline-none"
                  />
                </div>

                <div className="bg-cashdapp-light-gray rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Cold Storage Address</p>
                  <Input
                    type="text"
                    placeholder="0x..."
                    value={coldStorageAddress}
                    onChange={handleAddressChange}
                    className={`w-full bg-cashdapp-gray p-3 rounded-lg text-sm font-medium outline-none ${!isValidAddress ? 'border-red-500' : ''}`}
                  />
                  {!isValidAddress && (
                    <p className="text-xs text-red-500 mt-1">Please enter a valid Ethereum address</p>
                  )}
                </div>

                <Button 
                  onClick={handleSendToColdStorage}
                  className="w-full bg-cashdapp-green text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
                  disabled={!isValidAddress || !coldStorageAddress || !amount || Number(amount) <= 0 || Number(amount) > Number(balance)}
                >
                  Transfer to Cold Storage
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="retrieve" className="mt-4">
              <div className="space-y-4">
                <div className="bg-cashdapp-light-gray rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Amount (XMRT)</p>
                  <Input
                    type="text"
                    placeholder="0.0"
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full bg-cashdapp-gray p-3 rounded-lg text-sm font-medium outline-none"
                  />
                </div>

                <div className="bg-cashdapp-light-gray rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Retrieval Signature</p>
                  <Input
                    type="text"
                    placeholder="Enter signature..."
                    value={retrievalSignature}
                    onChange={handleSignatureChange}
                    className="w-full bg-cashdapp-gray p-3 rounded-lg text-sm font-medium outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Signature must be provided by the cold storage owner</p>
                </div>

                <Button 
                  onClick={handleRetrieveFromStorage}
                  className="w-full bg-cashdapp-green text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
                  disabled={!retrievalSignature || !amount || Number(amount) <= 0}
                >
                  Retrieve from Cold Storage
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="mb-4">Connect your wallet to use cold storage features</p>
          <Button 
            onClick={() => open()}
            className="bg-cashdapp-green text-black hover:bg-cashdapp-green/90"
          >
            <ArrowRightLeft className="mr-2" />
            Connect Wallet
          </Button>
        </div>
      )}
    </Card>
  );
};
