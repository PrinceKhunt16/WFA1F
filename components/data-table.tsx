"use client";

import { ArrowDownUp, ChevronLeft, ChevronRight, CircleAlert } from "lucide-react";
import { useMemo, useState } from "react";

import { formatDateTime, formatMetric } from "@/lib/format";
import type { ComparisonPoint } from "@/types/api";
import { EmptyState } from "@/components/ui";

const pageSize = 8;

export function DataTable({ records }: { records: ComparisonPoint[] }) {
  const [sortKey, setSortKey] = useState<keyof ComparisonPoint>("delivery_time");
  const [ascending, setAscending] = useState(true);
  const [page, setPage] = useState(0);
  const sorted = useMemo(() => [...records].sort((a, b) => {
    const left = a[sortKey] ?? "";
    const right = b[sortKey] ?? "";
    return (String(left).localeCompare(String(right), undefined, { numeric: true }) || 0) * (ascending ? 1 : -1);
  }), [ascending, records, sortKey]);
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const visible = sorted.slice(page * pageSize, page * pageSize + pageSize);
  const changeSort = (key: keyof ComparisonPoint) => { setPage(0); if (key === sortKey) setAscending((value) => !value); else { setSortKey(key); setAscending(true); } };

  if (!records.length) return <EmptyState title="No comparison records" message="There are no matched intervals for this selection. The backend has not substituted missing values." />;
  return <div>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead><tr className="border-b border-line text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
          {[["delivery_time", "Delivery"], ["forecast_generation", "Forecast"], ["actual_generation", "Actual"], ["error", "Error"], ["absolute_error", "Abs. error"], ["forecast_publication_time", "Published"], ["status", "Status"]].map(([key, label]) => <th key={key} className="whitespace-nowrap px-4 pb-3 first:pl-0"><button className="flex items-center gap-1.5 hover:text-ink" onClick={() => changeSort(key as keyof ComparisonPoint)}>{label}<ArrowDownUp size={12} /></button></th>)}
        </tr></thead>
        <tbody>{visible.map((row) => <tr key={`${row.delivery_time}-${row.forecast_publication_time}`} className="border-b border-line/70 last:border-0 hover:bg-cloud/70">
          <td className="whitespace-nowrap px-4 py-3.5 pl-0 font-semibold text-ink">{formatDateTime(row.delivery_time)}</td>
          <td className="px-4 py-3.5 text-ink">{formatMetric(row.forecast_generation, 0)}</td>
          <td className="px-4 py-3.5 text-ink">{formatMetric(row.actual_generation, 0)}</td>
          <td className={`px-4 py-3.5 font-semibold ${row.error === null ? "text-muted" : row.error > 0 ? "text-coral" : "text-pine"}`}>{row.error === null ? "Unavailable" : `${row.error > 0 ? "+" : ""}${formatMetric(row.error, 0)}`}</td>
          <td className="px-4 py-3.5 text-ink">{formatMetric(row.absolute_error, 0)}</td>
          <td className="whitespace-nowrap px-4 py-3.5 text-muted">{formatDateTime(row.forecast_publication_time)}</td>
          <td className="px-4 py-3.5"><StatusPill status={row.status} /></td>
        </tr>)}</tbody>
      </table>
    </div>
    <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-xs text-muted"><span>Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length}</span><div className="flex gap-1"><button disabled={page === 0} onClick={() => setPage((value) => value - 1)} className="rounded-sm border border-line p-1.5 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={15} /></button><button disabled={page >= pageCount - 1} onClick={() => setPage((value) => value + 1)} className="rounded-sm border border-line p-1.5 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={15} /></button></div></div>
  </div>;
}

function StatusPill({ status }: { status: string }) {
  const matched = status === "matched";
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${matched ? "bg-[#e3f3ed] text-pine" : "bg-[#fff2d9] text-amber"}`}>{matched ? "Matched" : <><CircleAlert size={12} /> {status.replaceAll("_", " ")}</>}</span>;
}
