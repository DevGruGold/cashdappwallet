import { Bell, Settings } from "lucide-react";

export const Header = () => {
  return (
    <header className="flex justify-between items-center py-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-cashdapp-green rounded-full flex items-center justify-center">
          <span className="text-black font-bold text-xl">$</span>
        </div>
        <h1 className="text-2xl font-bold">CashDapp</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-cashdapp-light-gray rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-cashdapp-light-gray rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 bg-cashdapp-light-gray rounded-full"></div>
      </div>
    </header>
  );
};