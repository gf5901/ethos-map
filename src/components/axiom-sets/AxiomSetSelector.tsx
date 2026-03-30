"use client";

import { Layers } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store/appStore";

type AxiomSetMeta = { id: string; name: string; description: string };

export function AxiomSetSelector() {
  const [sets, setSets] = useState<AxiomSetMeta[]>([]);
  const selectedAxiomSetId = useAppStore((s) => s.selectedAxiomSetId);
  const setSelectedAxiomSetId = useAppStore((s) => s.setSelectedAxiomSetId);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/data/axiom-sets.json");
        if (!res.ok) return;
        const data = (await res.json()) as AxiomSetMeta[];
        if (!cancelled) setSets(data);
      } catch {
        /* optional file */
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = sets.find((s) => s.id === selectedAxiomSetId) ?? null;

  return (
    <div className="flex max-w-xs flex-col gap-1 text-sm">
      <label className="flex flex-col gap-1">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
          <Layers className="size-3.5 shrink-0" aria-hidden />
          Axiom set
        </span>
        <select
          className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
          value={selectedAxiomSetId ?? ""}
          onChange={(e) => setSelectedAxiomSetId(e.target.value || null)}
          aria-label="Select axiom set worldview"
          aria-describedby="axiom-set-description"
        >
          <option value="">None (full graph)</option>
          {sets.map((s) => (
            <option key={s.id} value={s.id} title={s.description}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
      {selected ? (
        <p
          id="axiom-set-description"
          className="text-xs leading-snug text-slate-600 dark:text-slate-400"
        >
          {selected.description}
        </p>
      ) : (
        <p id="axiom-set-description" className="sr-only">
          No axiom set filter; the full graph is shown.
        </p>
      )}
    </div>
  );
}
