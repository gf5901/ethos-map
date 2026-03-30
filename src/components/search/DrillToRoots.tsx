"use client";

import { Sparkles } from "lucide-react";
import { buildAdjacency, collectAncestors } from "@/lib/graph";
import { useAppStore } from "@/store/appStore";

export function DrillToRootsButton({
  nodeId,
  onDone,
}: {
  nodeId: string;
  onDone?: () => void;
}) {
  const graph = useAppStore((s) => s.graph);
  const setHighlightedNodeIds = useAppStore((s) => s.setHighlightedNodeIds);

  function handleClick() {
    if (!graph) return;
    const parents = buildAdjacency(
      graph.edges.map((e) => ({ from: e.source, to: e.target }))
    ).parents;
    const ancestors = collectAncestors(nodeId, parents);
    setHighlightedNodeIds([...ancestors]);
    onDone?.();
  }

  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
      onClick={handleClick}
    >
      <Sparkles className="size-3.5 shrink-0" aria-hidden />
      Trace to roots
    </button>
  );
}
