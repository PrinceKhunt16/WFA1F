import type { ReactNode } from "react";

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-sm border border-line bg-white shadow-panel ${className}`}>{children}</section>;
}

export function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-pine">{eyebrow}</p>}
        <h2 className="text-lg font-bold tracking-[-0.02em] text-ink">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center rounded-sm border border-dashed border-line bg-cloud px-6 text-center">
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-1 max-w-md text-sm text-muted">{message}</p>
    </div>
  );
}

export function LoadingState({ label = "Loading verified analytics..." }: { label?: string }) {
  return (
    <div className="flex min-h-44 items-center justify-center rounded-sm border border-line bg-cloud text-sm text-muted">
      <span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-line border-t-pine" />
      {label}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-sm border border-[#f1cdcd] bg-[#fff8f8] px-5 py-4 text-sm text-coral">
      <p className="font-bold">Unable to load this view</p>
      <p className="mt-1 text-[#9e5151]">{message}</p>
    </div>
  );
}
