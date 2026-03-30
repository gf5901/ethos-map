"use client";

import { Anchor } from "lucide-react";

export function FoundationGauge({ value }: { value: number }) {
  const v = Math.round(Math.max(1, Math.min(5, value)));
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
        <Anchor className="size-3.5 shrink-0" aria-hidden />
        Foundation strength
      </div>
      <div
        className="flex gap-1"
        role="meter"
        aria-valuemin={1}
        aria-valuemax={5}
        aria-valuenow={v}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`h-2 flex-1 rounded ${i < v ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`}
          />
        ))}
      </div>
      <p className="text-xs text-slate-500">{v} / 5</p>
    </div>
  );
}
