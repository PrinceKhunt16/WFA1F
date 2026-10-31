"use client";

import { Menu, RefreshCw, SlidersHorizontal } from "lucide-react";

export function Topbar({ title, onMenu, onRefresh }: { title: string; onMenu: () => void; onRefresh: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex min-h-[84px] items-center justify-between border-b border-line bg-cloud/95 px-5 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button aria-label="Open navigation" className="rounded-sm p-2 text-muted hover:bg-white hover:text-ink lg:hidden" onClick={onMenu}><Menu size={21} /></button>
        <div><p className="hidden text-xs text-muted md:block">Wind Analytics / Operations</p><h1 className="text-xl font-bold tracking-[-0.03em] text-ink">{title}</h1></div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden items-center gap-2 rounded-sm border border-line bg-white px-3 py-2 text-xs font-semibold text-muted sm:flex"><SlidersHorizontal size={15} className="text-pine" /> Jan 2026</div>
        <button aria-label="Refresh data" onClick={onRefresh} className="rounded-sm border border-line bg-white p-2.5 text-muted transition hover:border-pine hover:text-pine"><RefreshCw size={17} /></button>
      </div>
    </header>
  );
}
