import { Construction } from "lucide-react";

import { Panel } from "@/components/ui";

export function EmptyPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto max-w-4xl">
      <Panel className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
        <span className="rounded-sm bg-[#e7f2ef] p-4 text-pine"><Construction size={28} /></span>
        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-pine">Workspace view</p>
        <h1 className="mt-2 text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted">{description}</p>
      </Panel>
    </div>
  );
}
