import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const DashboardLayout = ({ children, title, subtitle }: DashboardLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <main className="lg:pl-64 transition-all duration-300">
        <Header
          title={title}
          subtitle={subtitle}
          onMobileMenuToggle={() => setMobileOpen((v) => !v)}
        />
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
};
