"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatMetric } from "@/lib/format";
import type { ComparisonPoint } from "@/types/api";

const tooltipStyle = { borderRadius: 10, border: "1px solid #e3e8eb", fontSize: 12 };

function chartValue(value: unknown): string {
  return typeof value === "number" ? `${formatMetric(value, 0)} MW` : "Unavailable";
}

type ChartRow = ComparisonPoint & { label: string; index: number };

function rows(records: ComparisonPoint[]): ChartRow[] {
  return records.map((record, index) => ({
    ...record,
    label: new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" }).format(new Date(record.delivery_time)),
    index,
  }));
}

export function ForecastActualChart({ records, compact = false }: { records: ComparisonPoint[]; compact?: boolean }) {
  const data = rows(records);
  return (
    <div className={compact ? "h-[270px]" : "h-[340px]"}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 4 }}>
          <CartesianGrid stroke="#edf0f2" vertical={false} />
          <XAxis dataKey="label" axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}k`} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value: unknown, name?: string | number) => [chartValue(value), name === "forecast_generation" ? "Forecast" : "Actual"]} labelFormatter={(label) => `Delivery ${label} UK time`} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} formatter={(value) => value === "forecast_generation" ? "Forecast" : "Actual"} />
          <Line type="monotone" dataKey="forecast_generation" stroke="#197c61" strokeWidth={2.5} dot={false} connectNulls={false} />
          <Line type="monotone" dataKey="actual_generation" stroke="#34495a" strokeWidth={2.5} dot={false} connectNulls={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ErrorChart({ records }: { records: ComparisonPoint[] }) {
  const data = rows(records);
  return (
    <div className="h-[270px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 4 }}>
          <CartesianGrid stroke="#edf0f2" vertical={false} />
          <XAxis dataKey="label" axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}k`} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value: unknown) => [chartValue(value), "Error"]} />
          <ReferenceLine y={0} stroke="#9aa7b0" strokeDasharray="4 4" />
          <Line type="monotone" dataKey="error" stroke="#c85b59" strokeWidth={2} dot={false} connectNulls={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AccuracyTrendChart({ records }: { records: Array<{ label: string; mae: number | null; rmse: number | null }> }) {
  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={records} margin={{ top: 8, right: 12, left: -18, bottom: 4 }}>
          <CartesianGrid stroke="#edf0f2" vertical={false} />
          <XAxis dataKey="label" axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value: unknown) => [chartValue(value), ""]} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
          <Line type="monotone" dataKey="mae" name="MAE" stroke="#197c61" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="rmse" name="RMSE" stroke="#b67a23" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
