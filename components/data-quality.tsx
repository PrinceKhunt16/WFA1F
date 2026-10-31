import { CheckCircle2, CircleAlert, Database, Gauge, Layers3, Wind } from "lucide-react";

import { formatMetric, formatPercent } from "@/lib/format";
import type { AccuracyResponse, ComparisonResponse } from "@/types/api";
import { Panel, SectionHeading } from "@/components/ui";

export function DataQuality({ accuracy, comparison }: { accuracy: AccuracyResponse | null; comparison: ComparisonResponse | null }) {
  const rows = [
    ["Matched intervals", accuracy?.matched_intervals, ""],
    ["Expected intervals", accuracy?.expected_interval_count, ""],
    ["Missing forecasts", accuracy?.missing_forecast_count, ""],
    ["Missing actuals", accuracy?.missing_actual_count, ""],
  ];
  return <Panel className="p-5"><SectionHeading eyebrow="Integrity" title="Data quality" action={accuracy ? <span className="flex items-center gap-1.5 text-xs font-bold text-pine"><CheckCircle2 size={15} /> Coverage assessed</span> : <span className="flex items-center gap-1.5 text-xs font-bold text-amber"><CircleAlert size={15} /> Awaiting data</span>} /><div className="grid grid-cols-2 gap-3">{rows.map(([label, value, unit]) => <div key={label} className="rounded-sm bg-cloud p-3"><p className="text-[11px] font-semibold text-muted">{label}</p><p className="mt-1 text-lg font-bold text-ink">{formatMetric(value as number | null)}{unit}</p></div>)}<div className="rounded-sm bg-cloud p-3"><p className="text-[11px] font-semibold text-muted">Data coverage</p><p className="mt-1 text-lg font-bold text-pine">{formatPercent(accuracy?.coverage_percentage)}</p></div><div className="rounded-sm bg-cloud p-3"><p className="text-[11px] font-semibold text-muted">API status</p><p className="mt-1 flex items-center gap-1.5 text-lg font-bold text-pine"><span className="h-2 w-2 rounded-full bg-pine" /> Connected</p></div></div><div className="mt-5 space-y-3 border-t border-line pt-4 text-xs text-muted"><p className="flex items-center gap-2"><Database size={14} className="text-pine" /> Sources: {comparison?.source.dataset ?? "FUELHH + WINDFOR"}</p><p className="flex items-center gap-2"><Gauge size={14} className="text-pine" /> Units: MW where verified by the backend</p><p className="flex items-center gap-2"><Layers3 size={14} className="text-pine" /> Forecast revisions selected before the decision cutoff</p><p className="flex items-center gap-2"><Wind size={14} className="text-pine" /> No missing values are treated as zero</p></div></Panel>;
}
