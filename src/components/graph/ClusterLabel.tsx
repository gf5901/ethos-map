"use client";

import { Tag } from "lucide-react";

/** Placeholder for semantic cluster labels (TRD §4.3). */
export function ClusterLabel({ label }: { label: string }) {
  return (
    <div className="pointer-events-none inline-flex items-center gap-1 rounded-md bg-white/80 px-2 py-1 text-xs font-medium text-slate-600 shadow dark:bg-slate-900/80 dark:text-slate-300">
      <Tag className="size-3 shrink-0 opacity-70" aria-hidden />
      {label}
    </div>
  );
}
