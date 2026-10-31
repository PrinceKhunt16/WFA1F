import { Settings2 } from "lucide-react";

import { Panel } from "@/components/ui";

export default function SettingsPage() {
  return <div className="mx-auto max-w-4xl space-y-6"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-pine">Configuration</p><h2 className="text-3xl font-bold tracking-[-0.04em] text-ink">Settings</h2><p className="mt-2 text-sm leading-6 text-muted">Runtime controls are managed through the backend environment. This page keeps the active policy visible.</p></div><Panel className="p-6"><div className="flex items-start gap-4"><span className="rounded-sm bg-[#fff2d9] p-3 text-amber"><Settings2 size={22} /></span><div className="w-full"><h3 className="font-bold text-ink">Active evaluation policy</h3><div className="mt-5 grid gap-3 md:grid-cols-2"><Setting label="Decision cutoff" value="previous_day_11:00_europe_london" /><Setting label="Generation units" value="MW (verified by backend)" /><Setting label="API source" value="http://localhost:8000" /><Setting label="Missing value policy" value="Exclude, never zero-fill" /></div></div></div></Panel></div>;
}

function Setting({ label, value }: { label: string; value: string }) { return <div className="rounded-sm bg-cloud p-4"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">{label}</p><p className="mt-2 break-words text-sm font-semibold text-ink">{value}</p></div>; }
