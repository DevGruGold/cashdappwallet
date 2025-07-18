
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { WagmiProvider, createConfig } from 'wagmi';
import { arbitrum, mainnet } from 'viem/chains';
import { http } from 'viem';
import Index from "./pages/Index";
import BuyCrypto from "./pages/BuyCrypto";
import Bridge from "./pages/Bridge";
import Settings from "./pages/Settings";
import { Layout } from "./components/Layout";

const projectId = '6054bd6688c6860ed806775db1c24f15';
const metadata = {
  name: 'CashDapp',
  description: 'Web3 Financial Application',
  url: 'https://cashdapp.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const chains = [mainnet, arbitrum] as const;

const config = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
  },
});

const queryClient = new QueryClient();

createWeb3Modal({
  wagmiConfig: config,
  projectId,
});

const App = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route
                element={<Layout><Index /></Layout>}
                path="/"
              />
              <Route
                element={<Layout><BuyCrypto /></Layout>}
                path="/buy"
              />
              <Route
                element={<Layout><Bridge /></Layout>}
                path="/bridge"
              />
              <Route
                element={<Layout><Settings /></Layout>}
                path="/settings"
              />
              <Route
                element={<Layout><div>Profile Page (To be implemented)</div></Layout>}
                path="/profile"
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
