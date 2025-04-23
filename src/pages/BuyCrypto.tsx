
// No need to add Header or layout classes; those are handled by Layout.
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const BuyCrypto = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePurchase = () => {
    toast({
      title: "Purchase Initiated",
      description: "Your crypto purchase is being processed.",
    });
    // In a real app, this would integrate with a payment processor
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="mr-2" />
        Back
      </Button>

      <Card className="p-6 bg-cashdapp-gray">
        <h1 className="text-2xl font-bold mb-6">Buy Crypto</h1>
        
        <div className="space-y-6">
          <div className="bg-cashdapp-light-gray rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-2">Amount</p>
            <input 
              type="number" 
              placeholder="Enter amount"
              className="w-full bg-cashdapp-gray p-3 rounded-lg text-sm font-medium outline-none"
            />
          </div>

          <div className="bg-cashdapp-light-gray rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-2">Payment Method</p>
            <select className="w-full bg-cashdapp-gray p-3 rounded-lg text-sm font-medium outline-none">
              <option value="card">Credit Card</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          <Button 
            onClick={handlePurchase}
            className="w-full bg-cashdapp-green text-black hover:bg-cashdapp-green/90"
          >
            Confirm Purchase
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BuyCrypto;
