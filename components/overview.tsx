"use client";

import { Activity, Gauge, LineChart as LineChartIcon, ShieldCheck, Target, Wind } from "lucide-react";
import { useEffect, useState } from "react";

import { getComparison, getSummary } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { ComparisonResponse, SummaryResponse } from "@/types/api";
import { AccuracyTrendChart, ErrorChart, ForecastActualChart } from "@/components/charts";
import { DataQuality } from "@/components/data-quality";
import { DataTable } from "@/components/data-table";
import { DateFilter } from "@/components/date-filter";
import { KpiCard } from "@/components/kpi-card";
import { EmptyState, ErrorState, LoadingState, Panel, SectionHeading } from "@/components/ui";

const DEFAULT_DATE = "2026-01-15";

export function Overview() {
  const [date, setDate] = useState(DEFAULT_DATE);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [comparison, setComparison] = useState<ComparisonResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    Promise.all([getSummary(), getComparison(date)])
      .then(([nextSummary, nextComparison]) => { if (active) { setSummary(nextSummary); setComparison(nextComparison); } })
      .catch((reason: Error) => { if (active) setError(reason.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [date]);

  const metrics = summary?.metrics;
  const trend = metrics ? [{ label: "Selected period", mae: metrics.mae, rmse: metrics.rmse }] : [];
  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-pine">Operational view</p>
          <h2 className="text-3xl font-bold tracking-[-0.04em] text-ink md:text-4xl">Forecast performance</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">A decision-focused view of verified wind forecasts, actual generation, and the intervals that still need attention.</p>
        </div>
        <DateFilter date={date} onDateChange={setDate} />
      </div>

      {error && <ErrorState message={error} />}
      {loading ? <LoadingState /> : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <KpiCard label="Mean absolute error" value={metrics?.mae} unit="MW" icon={Target} detail="Lower is better" />
            <KpiCard label="Root mean square error" value={metrics?.rmse} unit="MW" icon={Activity} tone="warning" detail="Penalises larger misses" />
            <KpiCard label="Forecast bias" value={metrics?.bias} unit="MW" icon={LineChartIcon} tone={metrics?.bias && metrics.bias > 0 ? "negative" : "positive"} detail={metrics?.bias && metrics.bias > 0 ? "Overforecasting" : "Underforecasting"} />
            <KpiCard label="Data coverage" value={metrics?.coverage_percentage} icon={ShieldCheck} tone="positive" isPercent detail="Matched delivery intervals" />
            <KpiCard label="Evaluated intervals" value={summary?.evaluated_intervals} icon={Gauge} detail="Valid comparisons" />
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.8fr)]">
            <Panel className="p-5 md:p-6">
              <SectionHeading eyebrow="Selected delivery date" title="Forecast vs actual generation" action={<span className="text-xs font-semibold text-muted">{formatDate(date)}</span>} />
              {comparison?.records.length ? <ForecastActualChart records={comparison.records} /> : <EmptyState title="No interval data" message="The backend returned no comparison records for this date." />}
            </Panel>
            <DataQuality accuracy={metrics ?? null} comparison={comparison} />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Panel className="p-5 md:p-6">
              <SectionHeading eyebrow="Error analysis" title="Overforecasting vs underforecasting" />
              {comparison?.records.length ? <ErrorChart records={comparison.records} /> : <EmptyState title="No error series" message="Error analysis appears when matched records are available." />}
            </Panel>
            <Panel className="p-5 md:p-6">
              <SectionHeading eyebrow="Period view" title="Accuracy trend" />
              {trend.length ? <AccuracyTrendChart records={trend} /> : <EmptyState title="No trend data" message="The accuracy endpoint did not return usable metrics." />}
            </Panel>
          </div>

          <Panel className="p-5 md:p-6">
            <SectionHeading eyebrow="Interval detail" title="Forecast data table" action={<span className="text-xs text-muted">UTC timestamps, UK display time</span>} />
            {comparison ? <DataTable records={comparison.records} /> : <EmptyState title="No records" message="Select a date to inspect interval-level data." />}
          </Panel>
        </>
      )}
    </div>
  );
}
