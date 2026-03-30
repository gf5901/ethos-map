"use client";

import { MapPin } from "lucide-react";

export function JurisdictionBadges({ names }: { names: string[] }) {
  if (!names.length) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {names.map((n) => (
        <span
          key={n}
          className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-200"
        >
          <MapPin className="size-3 shrink-0 opacity-70" aria-hidden />
          {n}
        </span>
      ))}
    </div>
  );
}
