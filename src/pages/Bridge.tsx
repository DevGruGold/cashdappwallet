import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useWeb3Modal } from "@web3modal/wagmi/react";

const Bridge = () => {
  const navigate = useNavigate();
  const { open } = useWeb3Modal();
  const { toast } = useToast();

  const handleBridge = () => {
    toast({
      title: "Bridge Initiated",
      description: "Your bridge transaction is being processed.",
    });
    // In a real app, this would integrate with a bridge protocol
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 max-w-2xl py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2" />
          Back
        </Button>

        <Card className="p-6 bg-cashdapp-gray">
          <h1 className="text-2xl font-bold mb-6">Bridge Assets</h1>
          
          <div className="space-y-6">
            <div className="bg-cashdapp-light-gray rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">From Chain</p>
              <button 
                onClick={() => open({ view: 'Networks' })}
                className="w-full bg-cashdapp-gray hover:bg-opacity-80 transition-colors p-3 rounded-lg text-sm font-medium text-left"
              >
                Select Source Chain
              </button>
            </div>

            <div className="bg-cashdapp-light-gray rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">To Chain</p>
              <button 
                onClick={() => open({ view: 'Networks' })}
                className="w-full bg-cashdapp-gray hover:bg-opacity-80 transition-colors p-3 rounded-lg text-sm font-medium text-left"
              >
                Select Destination Chain
              </button>
            </div>

            <div className="bg-cashdapp-light-gray rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Amount</p>
              <input 
                type="number" 
                placeholder="Enter amount"
                className="w-full bg-cashdapp-gray p-3 rounded-lg text-sm font-medium outline-none"
              />
            </div>

            <Button 
              onClick={handleBridge}
              className="w-full bg-cashdapp-green text-black hover:bg-cashdapp-green/90"
            >
              Start Bridge
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Bridge;