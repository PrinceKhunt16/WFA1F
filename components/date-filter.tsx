"use client";

import { CalendarDays } from "lucide-react";

export function DateFilter({ date, onDateChange, startDate, endDate, onRangeChange }: { date?: string; onDateChange?: (value: string) => void; startDate?: string; endDate?: string; onRangeChange?: (key: "start" | "end", value: string) => void }) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      {date && onDateChange && <label className="block"><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-muted">Delivery date</span><div className="relative"><CalendarDays size={15} className="pointer-events-none absolute left-3 top-3 text-pine" /><input type="date" value={date} onChange={(event) => onDateChange(event.target.value)} className="rounded-sm border border-line bg-white py-2.5 pl-9 pr-3 text-sm font-semibold text-ink outline-none transition focus:border-pine focus:ring-2 focus:ring-[#d7eee6]" /></div></label>}
      {startDate && endDate && onRangeChange && <><label className="block"><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-muted">From</span><input type="date" value={startDate} onChange={(event) => onRangeChange("start", event.target.value)} className="rounded-sm border border-line bg-white px-3 py-2.5 text-sm font-semibold text-ink outline-none focus:border-pine focus:ring-2 focus:ring-[#d7eee6]" /></label><label className="block"><span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-muted">To</span><input type="date" value={endDate} onChange={(event) => onRangeChange("end", event.target.value)} className="rounded-sm border border-line bg-white px-3 py-2.5 text-sm font-semibold text-ink outline-none focus:border-pine focus:ring-2 focus:ring-[#d7eee6]" /></label></>}
    </div>
  );
}
