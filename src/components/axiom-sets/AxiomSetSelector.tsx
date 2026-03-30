"use client";

import { Layers } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useAppStore } from "@/store/appStore";

type AxiomSetMeta = { id: string; name: string; description: string };

export function AxiomSetSelector({ compact = false }: { compact?: boolean }) {
  const [sets, setSets] = useState<AxiomSetMeta[]>([]);
  const selectedAxiomSetId = useAppStore((s) => s.selectedAxiomSetId);
  const setSelectedAxiomSetId = useAppStore((s) => s.setSelectedAxiomSetId);
  const descriptionId = useId();

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
  const selectTitle = selected?.description ?? undefined;

  if (compact) {
    return (
      <div className="flex min-w-0 max-w-[min(100%,14rem)] items-center gap-2 text-sm">
        <label
          htmlFor="ethos-axiom-set-select-compact"
          className="inline-flex shrink-0 items-center gap-1.5 text-label text-slate-500"
        >
          <Layers className="size-3.5 shrink-0" aria-hidden />
          Axiom set
        </label>
        <select
          id="ethos-axiom-set-select-compact"
          className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-sm"
          value={selectedAxiomSetId ?? ""}
          onChange={(e) => setSelectedAxiomSetId(e.target.value || null)}
          aria-describedby={selected ? descriptionId : undefined}
          title={selectTitle}
        >
          <option value="">None (full graph)</option>
          {sets.map((s) => (
            <option key={s.id} value={s.id} title={s.description}>
              {s.name}
            </option>
          ))}
        </select>
        {selected ? (
          <span id={descriptionId} className="sr-only">
            {selected.description}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex max-w-xs flex-col gap-1 text-sm">
      <label className="flex flex-col gap-1" htmlFor="ethos-axiom-set-select-full">
        <span className="inline-flex items-center gap-1.5 text-label text-slate-500">
          <Layers className="size-3.5 shrink-0" aria-hidden />
          Axiom set
        </span>
        <select
          id="ethos-axiom-set-select-full"
          className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-sm"
          value={selectedAxiomSetId ?? ""}
          onChange={(e) => setSelectedAxiomSetId(e.target.value || null)}
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
