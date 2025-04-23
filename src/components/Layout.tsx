
import { Header } from "@/components/Header";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => (
  <div className="min-h-screen bg-black text-white">
    <div className="container mx-auto px-4 max-w-5xl">
      <Header />
      <main className="py-6">{children}</main>
    </div>
  </div>
);

