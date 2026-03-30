"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { CompiledGraph } from "@/lib/types";
import { NodeGraphNavigation } from "./NodeGraphNavigation";

export function NodeGraphNavigationLoader({ nodeId }: { nodeId: string }) {
  const [graph, setGraph] = useState<CompiledGraph | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/graph.json")
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json() as Promise<CompiledGraph>;
      })
      .then((g) => {
        if (!cancelled) setGraph(g);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load graph data.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <p className="flex items-start gap-2 text-sm text-slate-500">
        <AlertCircle
          className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-500"
          aria-hidden
        />
        {error}
      </p>
    );
  }
  if (!graph) {
    return (
      <p className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
        Loading connections…
      </p>
    );
  }

  return <NodeGraphNavigation graph={graph} nodeId={nodeId} navigateMode="page" />;
}
