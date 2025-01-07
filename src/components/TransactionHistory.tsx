import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

const transactions = [
  {
    id: 1,
    type: "send",
    address: "0x1234...5678",
    amount: "-0.5 ETH",
    date: "2024-02-20",
    status: "completed"
  },
  {
    id: 2,
    type: "receive",
    address: "0x8765...4321",
    amount: "+1.2 ETH",
    date: "2024-02-19",
    status: "completed"
  },
  {
    id: 3,
    type: "send",
    address: "0x9876...1234",
    amount: "-0.3 ETH",
    date: "2024-02-18",
    status: "completed"
  }
];

export const TransactionHistory = () => {
  return (
    <Card className="p-6 bg-cashdapp-gray mt-6 animate-slide-up">
      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-4 bg-cashdapp-light-gray rounded-lg">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${tx.type === 'send' ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                {tx.type === 'send' ? (
                  <ArrowUpRight className="w-5 h-5 text-red-500" />
                ) : (
                  <ArrowDownLeft className="w-5 h-5 text-green-500" />
                )}
              </div>
              <div>
                <p className="font-semibold">{tx.type === 'send' ? 'Sent' : 'Received'}</p>
                <p className="text-sm text-gray-400">{tx.address}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${tx.type === 'send' ? 'text-red-500' : 'text-green-500'}`}>
                {tx.amount}
              </p>
              <p className="text-sm text-gray-400">{tx.date}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};