import { Header } from "@/components/Header";
import { Balance } from "@/components/Balance";
import { TransactionHistory } from "@/components/TransactionHistory";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <Header />
        <main className="py-6">
          <Balance />
          <TransactionHistory />
        </main>
      </div>
    </div>
  );
};

export default Index;