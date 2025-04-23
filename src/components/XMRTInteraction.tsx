
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useXMRTContract } from "@/hooks/useXMRTContract";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { Coins, ArrowRightLeft } from "lucide-react";

export const XMRTInteraction = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { balance, handleWrapMonero, handleUnwrapMonero, handleOnRampFiat, handleOffRampFiat } = useXMRTContract();
  const [amount, setAmount] = useState<string>("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  return (
    <Card className="p-6 bg-cashdapp-gray mt-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Coins className="w-5 h-5 text-cashdapp-green" />
        <h2 className="text-xl font-semibold">XMRT Token</h2>
      </div>

      {isConnected ? (
        <>
          <div className="bg-cashdapp-light-gray rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-400 mb-1">Your XMRT Balance</p>
            <p className="text-2xl font-bold">{Number(balance).toFixed(4)} XMRT</p>
          </div>

          <Tabs defaultValue="wrap" className="w-full">
            <TabsList className="w-full bg-cashdapp-light-gray">
              <TabsTrigger value="wrap" className="flex-1">
                Wrap Monero
              </TabsTrigger>
              <TabsTrigger value="unwrap" className="flex-1">
                Unwrap Monero
              </TabsTrigger>
              <TabsTrigger value="onramp" className="flex-1">
                On-Ramp Fiat
              </TabsTrigger>
              <TabsTrigger value="offramp" className="flex-1">
                Off-Ramp Fiat
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="wrap" className="mt-4">
              <div className="space-y-4">
                <div className="bg-cashdapp-light-gray rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Amount (XMR)</p>
                  <input 
                    type="text" 
                    placeholder="0.0"
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full bg-cashdapp-gray p-3 rounded-lg text-sm font-medium outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-2">Bridge Fee: 0.1%</p>
                </div>

                <Button 
                  onClick={() => {
                    if (amount) handleWrapMonero(amount);
                    setAmount("");
                  }}
                  className="w-full bg-cashdapp-green text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
                  disabled={!amount || Number(amount) <= 0}
                >
                  Wrap Monero to XMRT
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="unwrap" className="mt-4">
              <div className="space-y-4">
                <div className="bg-cashdapp-light-gray rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Amount (XMRT)</p>
                  <input 
                    type="text" 
                    placeholder="0.0"
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full bg-cashdapp-gray p-3 rounded-lg text-sm font-medium outline-none"
                  />
                </div>

                <Button 
                  onClick={() => {
                    if (amount) handleUnwrapMonero(amount);
                    setAmount("");
                  }}
                  className="w-full bg-cashdapp-green text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
                  disabled={!amount || Number(amount) <= 0 || Number(amount) > Number(balance)}
                >
                  Unwrap XMRT to Monero
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="onramp" className="mt-4">
              <div className="space-y-4">
                <div className="bg-cashdapp-light-gray rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Amount (USD)</p>
                  <input 
                    type="text" 
                    placeholder="0.0"
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full bg-cashdapp-gray p-3 rounded-lg text-sm font-medium outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-2">On-Ramp Fee: 0.5%</p>
                </div>

                <Button 
                  onClick={() => {
                    if (amount) handleOnRampFiat(amount);
                    setAmount("");
                  }}
                  className="w-full bg-cashdapp-green text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
                  disabled={!amount || Number(amount) <= 0}
                >
                  Convert USD to XMRT
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="offramp" className="mt-4">
              <div className="space-y-4">
                <div className="bg-cashdapp-light-gray rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Amount (XMRT)</p>
                  <input 
                    type="text" 
                    placeholder="0.0"
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full bg-cashdapp-gray p-3 rounded-lg text-sm font-medium outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-2">Off-Ramp Fee: 0.5%</p>
                </div>

                <Button 
                  onClick={() => {
                    if (amount) handleOffRampFiat(amount);
                    setAmount("");
                  }}
                  className="w-full bg-cashdapp-green text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
                  disabled={!amount || Number(amount) <= 0 || Number(amount) > Number(balance)}
                >
                  Convert XMRT to USD
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="mb-4">Connect your wallet to interact with XMRT token</p>
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
