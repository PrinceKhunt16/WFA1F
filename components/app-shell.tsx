"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

const titles: Record<string, string> = {
  "/": "Overview",
  "/forecast-analysis": "Forecast analysis",
  "/actual-generation": "Actual generation",
  "/accuracy-reports": "Accuracy reports",
  "/data-sources": "Data sources",
  "/settings": "Settings",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = titles[pathname] ?? "Wind Analytics";

  return (
    <div className="min-h-screen bg-cloud">
      <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onToggle={() => setCollapsed((value) => !value)} onClose={() => setMobileOpen(false)} />
      <div className={`min-h-screen transition-[padding] duration-200 ${collapsed ? "lg:pl-[76px]" : "lg:pl-[252px]"}`}>
        <Topbar title={title} onMenu={() => setMobileOpen(true)} onRefresh={() => router.refresh()} />
        <main className="px-5 py-7 md:px-8 md:py-9">{children}</main>
      </div>
    </div>
  );
}
