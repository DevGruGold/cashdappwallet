
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useXMRTContract } from "@/hooks/useXMRTContract";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { Coins, ArrowRightLeft } from "lucide-react";

export const Staking = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { balance, handleStake, handleUnstake, handleGetReward } = useXMRTContract();
  
  const [amount, setAmount] = useState<string>("");
  const [tierLevel, setTierLevel] = useState<string>("1");

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
        <h2 className="text-xl font-semibold">XMRT Staking</h2>
      </div>

      {isConnected ? (
        <>
          <div className="bg-cashdapp-light-gray rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-400 mb-1">Your XMRT Balance</p>
            <p className="text-2xl font-bold">{Number(balance).toFixed(4)} XMRT</p>
          </div>

          <Tabs defaultValue="stake" className="w-full">
            <TabsList className="w-full bg-cashdapp-light-gray">
              <TabsTrigger value="stake" className="flex-1">
                Stake
              </TabsTrigger>
              <TabsTrigger value="unstake" className="flex-1">
                Unstake
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex-1">
                Rewards
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="stake" className="mt-4">
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
                  <p className="text-sm text-gray-400 mb-2">Staking Tier</p>
                  <Select value={tierLevel} onValueChange={setTierLevel}>
                    <SelectTrigger className="w-full bg-cashdapp-gray p-3 rounded-lg text-sm font-medium">
                      <SelectValue placeholder="Select Tier" />
                    </SelectTrigger>
                    <SelectContent className="bg-cashdapp-gray border-cashdapp-light-gray">
                      <SelectItem value="1">Tier 1 (30 days)</SelectItem>
                      <SelectItem value="2">Tier 2 (60 days)</SelectItem>
                      <SelectItem value="3">Tier 3 (90 days)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-400 mt-2">Higher tiers offer better rewards but longer lock periods</p>
                </div>

                <Button 
                  onClick={() => {
                    handleStake(amount, parseInt(tierLevel));
                    setAmount("");
                  }}
                  className="w-full bg-cashdapp-green text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
                  disabled={!amount || Number(amount) <= 0 || Number(amount) > Number(balance)}
                >
                  Stake XMRT
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="unstake" className="mt-4">
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
                  <p className="text-xs text-gray-400 mt-2">Note: Early unstaking may incur penalties</p>
                </div>

                <Button 
                  onClick={() => {
                    handleUnstake(amount);
                    setAmount("");
                  }}
                  className="w-full bg-cashdapp-green text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
                  disabled={!amount || Number(amount) <= 0}
                >
                  Unstake XMRT
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="rewards" className="mt-4">
              <div className="space-y-4">
                <div className="bg-cashdapp-light-gray rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Available Rewards</p>
                  <p className="text-xl font-bold">Calculating...</p>
                  <p className="text-xs text-gray-400 mt-2">Rewards accrue based on your staking tier and duration</p>
                </div>

                <Button 
                  onClick={() => handleGetReward()}
                  className="w-full bg-cashdapp-green text-black font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Claim Rewards
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="mb-4">Connect your wallet to stake XMRT and earn rewards</p>
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
