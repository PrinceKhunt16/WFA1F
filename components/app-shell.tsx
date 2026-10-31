"use client";

import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
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
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            border: "1px solid #f1cdcd",
            borderRadius: "3px",
            background: "#fff8f8",
            color: "#9e5151",
            boxShadow: "0 12px 32px rgba(24, 35, 47, 0.12)",
            fontSize: "14px",
          },
          error: {
            iconTheme: {
              primary: "#c85b59",
              secondary: "#fff8f8",
            },
          },
        }}
      />
      <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onToggle={() => setCollapsed((value) => !value)} onClose={() => setMobileOpen(false)} />
      <div className={`min-h-screen transition-[padding] duration-200 ${collapsed ? "lg:pl-[76px]" : "lg:pl-[252px]"}`}>
        <Topbar title={title} onMenu={() => setMobileOpen(true)} onRefresh={() => router.refresh()} />
        <main className="px-5 py-7 md:px-8 md:py-9">{children}</main>
      </div>
    </div>
  );
}
