import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Balance = () => {
  return (
    <Card className="p-6 bg-cashdapp-gray animate-fade-in">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-sm text-gray-400">Your Balance</h2>
          <p className="text-4xl font-bold mt-1">$1,234.56</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-cashdapp-green text-black font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            <ArrowUpRight className="w-4 h-4" />
            Send
          </button>
          <button className="flex items-center gap-2 bg-white text-black font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            <ArrowDownLeft className="w-4 h-4" />
            Receive
          </button>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1 bg-cashdapp-light-gray rounded-lg p-4">
          <p className="text-sm text-gray-400">24h Change</p>
          <p className="text-xl font-semibold text-green-400">+2.14%</p>
        </div>
        <div className="flex-1 bg-cashdapp-light-gray rounded-lg p-4">
          <p className="text-sm text-gray-400">Portfolio Value</p>
          <p className="text-xl font-semibold">$5,678.90</p>
        </div>
      </div>
    </Card>
  );
};