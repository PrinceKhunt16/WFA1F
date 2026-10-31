import type { LucideIcon } from "lucide-react";

import { formatMetric, formatPercent, signedMetric } from "@/lib/format";
import { Panel } from "@/components/ui";

export function KpiCard({
  label,
  value,
  unit,
  icon: Icon,
  tone = "neutral",
  detail,
  isPercent = false,
}: {
  label: string;
  value: number | null | undefined;
  unit?: string;
  icon: LucideIcon;
  tone?: "neutral" | "positive" | "negative" | "warning";
  detail?: string;
  isPercent?: boolean;
}) {
  const toneStyles = {
    neutral: "bg-[#eef3f5] text-ink",
    positive: "bg-[#e3f3ed] text-pine",
    negative: "bg-[#fbeaea] text-coral",
    warning: "bg-[#fff2d9] text-amber",
  };
  const display = isPercent ? formatPercent(value) : formatMetric(value, 1);

  return (
    <Panel className="p-5 transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{label}</p>
          <p className="mt-4 text-2xl font-bold tracking-[-0.03em] text-ink">
            {display}
            {value !== null && value !== undefined && unit && <span className="ml-1 text-sm font-medium text-muted">{unit}</span>}
          </p>
        </div>
        <span className={`rounded-sm p-2.5 ${toneStyles[tone]}`}><Icon size={18} strokeWidth={2} /></span>
      </div>
      {detail && <p className="mt-3 text-xs text-muted">{detail}</p>}
    </Panel>
  );
}

export function BiasBadge({ value }: { value: number | null }) {
  const tone = value === null ? "text-muted" : value > 0 ? "text-coral" : "text-pine";
  return <span className={`font-semibold ${tone}`}>{signedMetric(value, 1)} MW</span>;
}
