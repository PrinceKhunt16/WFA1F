"use client";

import { GitCompareArrows, History, ListChecks } from "lucide-react";
import { useEffect, useState } from "react";

import { getComparison } from "@/lib/api";
import { formatDate, formatDateTime, formatMetric } from "@/lib/format";
import type { ComparisonResponse } from "@/types/api";
import { ForecastActualChart, ErrorChart } from "@/components/charts";
import { DataTable } from "@/components/data-table";
import { DateFilter } from "@/components/date-filter";
import { EmptyState, ErrorState, LoadingState, Panel, SectionHeading } from "@/components/ui";

export function ForecastAnalysis() {
  const [date, setDate] = useState("2026-01-15");
  const [data, setData] = useState<ComparisonResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => { let active = true; setLoading(true); setError(""); getComparison(date).then((value) => active && setData(value)).catch((reason: Error) => active && setError(reason.message)).finally(() => active && setLoading(false)); return () => { active = false; }; }, [date]);
  return <div className="mx-auto max-w-[1500px] space-y-7"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-pine">Revision-aware analysis</p><h2 className="text-3xl font-bold tracking-[-0.04em] text-ink">Inspect every delivery interval.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-muted">Review the forecast selected at the configured purchasing cutoff and compare it with actual wind output.</p></div><DateFilter date={date} onDateChange={setDate} /></div>{error && <ErrorState message={error} />}{loading ? <LoadingState /> : data ? <><div className="grid gap-4 md:grid-cols-3"><InfoCard icon={GitCompareArrows} label="Decision cutoff" value={formatDateTime(data.decision_cutoff)} /><InfoCard icon={History} label="Cutoff policy" value={data.cutoff_policy.replaceAll("_", " ")} /><InfoCard icon={ListChecks} label="Returned intervals" value={formatMetric(data.records.length)} /></div><div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]"><Panel className="p-5 md:p-6"><SectionHeading eyebrow={formatDate(date)} title="Forecast and actual output" />{data.records.length ? <ForecastActualChart records={data.records} /> : <EmptyState title="No interval data" message="No records were returned for this delivery date." />}</Panel><Panel className="p-5 md:p-6"><SectionHeading eyebrow="Error profile" title="Forecast error" />{data.records.length ? <ErrorChart records={data.records} /> : <EmptyState title="No error profile" message="No matched intervals are available." />}</Panel></div><Panel className="p-5 md:p-6"><SectionHeading eyebrow="Revision detail" title="Selected forecast records" /><DataTable records={data.records} /></Panel><Panel className="p-5 md:p-6"><SectionHeading eyebrow="Source notes" title="Interpretation notes" /><ul className="space-y-3 text-sm leading-6 text-muted">{data.limitations.map((item) => <li key={item} className="border-l-2 border-amber pl-3">{item}</li>)}<li className="border-l-2 border-pine pl-3">Forecast publication times are displayed in UK time; API comparisons remain timezone-aware UTC.</li></ul></Panel></> : <EmptyState title="No response" message="The backend returned no comparison payload." />}</div>;
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof GitCompareArrows; label: string; value: string }) { return <Panel className="flex items-center gap-4 p-4"><span className="rounded-sm bg-[#e6f3ee] p-2.5 text-pine"><Icon size={19} /></span><div><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">{label}</p><p className="mt-1 text-sm font-bold capitalize text-ink">{value}</p></div></Panel>; }
