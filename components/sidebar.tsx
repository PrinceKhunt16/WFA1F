"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Database,
  FileBarChart,
  LayoutDashboard,
  Settings,
  Wind,
  X,
} from "lucide-react";

const items = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Forecast analysis", href: "/forecast-analysis", icon: Activity },
  { label: "Actual generation", href: "/actual-generation", icon: Wind },
  { label: "Accuracy reports", href: "/accuracy-reports", icon: FileBarChart },
  { label: "Data sources", href: "/data-sources", icon: Database },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ collapsed, mobileOpen, onToggle, onClose }: { collapsed: boolean; mobileOpen: boolean; onToggle: () => void; onClose: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {mobileOpen && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-ink/30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-line bg-white transition-all duration-200 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} ${collapsed ? "w-[76px]" : "w-[252px]"}`}>
        <div className={`flex h-[84px] items-center border-b border-line px-5 ${collapsed ? "justify-center" : "justify-between"}`}>
          <Link href="/" className="flex items-center gap-3" onClick={onClose}>
            <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-pine text-white"><Wind size={20} /></span>
            {!collapsed && <span><span className="block text-sm font-bold tracking-tight text-ink">Wind Analytics</span><span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-muted">GB operations</span></span>}
          </Link>
          <button aria-label="Close navigation" className="text-muted lg:hidden" onClick={onClose}><X size={19} /></button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-6">
          {!collapsed && <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Workspace</p>}
          {items.map(({ label, href, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return <Link key={href} href={href} title={collapsed ? label : undefined} onClick={onClose} className={`group flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-semibold transition-colors ${collapsed ? "justify-center" : ""} ${active ? "bg-[#e6f3ee] text-pine" : "text-muted hover:bg-cloud hover:text-ink"}`}><Icon size={18} strokeWidth={active ? 2.4 : 2} /><span className={collapsed ? "sr-only" : ""}>{label}</span></Link>;
          })}
        </nav>
        <div className="border-t border-line p-3">
          {!collapsed && <div className="mb-3 rounded-sm bg-cloud p-3"><div className="flex items-center gap-2 text-xs font-bold text-ink"><CircleHelp size={15} className="text-pine" /> Need help?</div><p className="mt-1 text-[11px] leading-4 text-muted">Review source coverage before making a decision.</p></div>}
          <button onClick={onToggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="hidden w-full items-center justify-center rounded-sm border border-line py-2 text-muted transition hover:bg-cloud hover:text-ink lg:flex">{collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}</button>
        </div>
      </aside>
    </>
  );
}
