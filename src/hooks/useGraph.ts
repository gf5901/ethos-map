"use client";

import { useCallback, useEffect, useState } from "react";
import type { AxiomReachabilityMap, CompiledGraph, SearchIndexRecord } from "@/lib/types";
import { useAppStore } from "@/store/appStore";

type LoadState = "idle" | "loading" | "ready" | "error";

export function useGraphBootstrap() {
  const [status, setStatus] = useState<LoadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const setGraph = useAppStore((s) => s.setGraph);
  const setSearchRecords = useAppStore((s) => s.setSearchRecords);
  const setReachability = useAppStore((s) => s.setReachability);

  const retry = useCallback(() => setRetryKey((k) => k + 1), []);

  useEffect(() => {
    void retryKey;
    let cancelled = false;
    async function run() {
      setStatus("loading");
      setError(null);
      try {
        const [g, s, r] = await Promise.all([
          fetch("/data/graph.json").then((res) => {
            if (!res.ok) throw new Error(`graph.json: ${res.status}`);
            return res.json() as Promise<CompiledGraph>;
          }),
          fetch("/data/search-index.json").then((res) => {
            if (!res.ok) throw new Error(`search-index.json: ${res.status}`);
            return res.json() as Promise<SearchIndexRecord[]>;
          }),
          fetch("/data/axiom-reachability.json").then((res) => {
            if (!res.ok) throw new Error(`axiom-reachability.json: ${res.status}`);
            return res.json() as Promise<AxiomReachabilityMap>;
          }),
        ]);
        if (cancelled) return;
        setGraph(g);
        setSearchRecords(s);
        setReachability(r);
        setStatus("ready");
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load graph data");
        setStatus("error");
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [retryKey, setGraph, setSearchRecords, setReachability]);

  return { status, error, retry };
}
