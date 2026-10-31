"use client";

import { Download, FileBarChart, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getAccuracy, getComparison } from "@/lib/api";
import { formatMetric, formatPercent, signedMetric } from "@/lib/format";
import type { AccuracyResponse, ComparisonPoint } from "@/types/api";
import { AccuracyTrendChart } from "@/components/charts";
import { DataTable } from "@/components/data-table";
import { DateFilter } from "@/components/date-filter";
import { KpiCard } from "@/components/kpi-card";
import { EmptyState, ErrorState, LoadingState, Panel, SectionHeading } from "@/components/ui";

const initialStart = "2026-01-01";
const initialEnd = "2026-01-31";

export function AccuracyReports() {
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);
  const [accuracy, setAccuracy] = useState<AccuracyResponse | null>(null);
  const [records, setRecords] = useState<ComparisonPoint[]>([]);
  const [dailyTrend, setDailyTrend] = useState<Array<{ label: string; mae: number | null; rmse: number | null }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const dates = dateRange(startDate, endDate);
    Promise.all([getAccuracy(startDate, endDate), ...dates.map((date) => getComparison(date))])
      .then(([nextAccuracy, ...comparisons]) => {
        if (!active) return;
        const allRecords = comparisons.flatMap((comparison) => comparison.records);
        setAccuracy(nextAccuracy);
        setRecords(allRecords);
        setDailyTrend(comparisons.map((comparison) => {
          const valid = comparison.records.filter((row) => row.error !== null);
          const errors = valid.map((row) => row.error as number);
          const mae = errors.length ? errors.reduce((sum, value) => sum + Math.abs(value), 0) / errors.length : null;
          const rmse = errors.length ? Math.sqrt(errors.reduce((sum, value) => sum + value ** 2, 0) / errors.length) : null;
          return { label: comparison.date.slice(5), mae, rmse };
        }));
      })
      .catch((reason: Error) => active && setError(reason.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [endDate, startDate]);

  const changeRange = (key: "start" | "end", value: string) => key === "start" ? setStartDate(value) : setEndDate(value);
  const downloadCsv = () => {
    if (!records.length) return;
    const columns = ["delivery_time", "forecast_generation", "actual_generation", "error", "absolute_error", "forecast_publication_time", "status"];
    const csv = [columns.join(","), ...records.map((row) => columns.map((column) => JSON.stringify(row[column as keyof ComparisonPoint] ?? "")).join(","))].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = `wind-accuracy-${startDate}-${endDate}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const validErrors = useMemo(() => records.map((row) => row.error).filter((value): value is number => value !== null), [records]);
  const overforecast = validErrors.filter((value) => value > 0).length;
  const underforecast = validErrors.filter((value) => value < 0).length;
  return <div className="mx-auto max-w-[1500px] space-y-7"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-pine">Decision support report</p><h2 className="text-3xl font-bold tracking-[-0.04em] text-ink md:text-4xl">Accuracy with the context intact.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-muted">Measure the forecasts that were eligible at the purchasing cutoff, with missing coverage kept visible.</p></div><DateFilter startDate={startDate} endDate={endDate} onRangeChange={changeRange} /></div>{error && <ErrorState message={error} />}{loading ? <LoadingState label="Calculating range accuracy..." /> : accuracy ? <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><KpiCard label="MAE" value={accuracy.mae} unit="MW" icon={FileBarChart} /><KpiCard label="RMSE" value={accuracy.rmse} unit="MW" icon={TrendingUp} tone="warning" /><KpiCard label="Bias" value={accuracy.bias} unit="MW" icon={TrendingDown} tone={accuracy.bias && accuracy.bias > 0 ? "negative" : "positive"} /><KpiCard label="Coverage" value={accuracy.coverage_percentage} icon={FileBarChart} tone="positive" isPercent /><KpiCard label="Matched intervals" value={accuracy.matched_intervals} icon={FileBarChart} /></div><div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]"><Panel className="p-5 md:p-6"><SectionHeading eyebrow="Daily movement" title="MAE and RMSE trend" />{dailyTrend.length ? <AccuracyTrendChart records={dailyTrend} /> : <EmptyState title="No trend data" message="No daily comparison records were returned for this range." />}</Panel><Panel className="p-5 md:p-6"><SectionHeading eyebrow="Directional error" title="Forecast direction" /><div className="space-y-5"><Direction label="Overforecasting" count={overforecast} total={validErrors.length} tone="negative" /><Direction label="Underforecasting" count={underforecast} total={validErrors.length} tone="positive" /><div className="border-t border-line pt-4 text-sm text-muted"><p>Reported bias</p><p className={`mt-1 text-2xl font-bold ${accuracy.bias && accuracy.bias > 0 ? "text-coral" : "text-pine"}`}>{signedMetric(accuracy.bias, 1)} MW</p></div><p className="text-xs leading-5 text-muted">Positive bias means overforecasting. Metrics exclude intervals that cannot be matched reliably.</p></div></Panel></div><Panel className="p-5 md:p-6"><SectionHeading eyebrow="Exported report data" title="Evaluated intervals" action={<button type="button" onClick={downloadCsv} disabled={!records.length} aria-label="Download evaluated intervals as CSV" title="Download CSV" className="rounded-sm border border-line p-2 text-muted transition hover:border-pine hover:text-pine disabled:cursor-not-allowed disabled:opacity-40"><Download size={17} /></button>} /><DataTable records={records} /></Panel><Panel className="p-5 md:p-6"><SectionHeading eyebrow="Limitations" title="Coverage notes" /><ul className="space-y-2 text-sm leading-6 text-muted">{accuracy.limitations.map((item) => <li key={item} className="border-l-2 border-amber pl-3">{item}</li>)}</ul></Panel></> : <EmptyState title="No accuracy response" message="The backend returned no report payload." />}</div>;
}

function dateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const cursor = new Date(`${start}T12:00:00Z`);
  const last = new Date(`${end}T12:00:00Z`);
  while (cursor <= last && dates.length <= 31) { dates.push(cursor.toISOString().slice(0, 10)); cursor.setUTCDate(cursor.getUTCDate() + 1); }
  return dates;
}

function Direction({ label, count, total, tone }: { label: string; count: number; total: number; tone: "positive" | "negative" }) { const percentage = total ? (count / total) * 100 : 0; return <div><div className="mb-2 flex justify-between text-sm"><span className="font-semibold text-ink">{label}</span><span className="text-muted">{count} intervals</span></div><div className="h-2 overflow-hidden rounded-full bg-cloud"><div className={`h-full rounded-full ${tone === "positive" ? "bg-pine" : "bg-coral"}`} style={{ width: `${percentage}%` }} /></div></div>; }
