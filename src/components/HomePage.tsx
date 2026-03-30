"use client";

import { AlertCircle, Loader2, RotateCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { BrowseTree } from "@/components/browse/BrowseTree";
import { GraphCanvas } from "@/components/graph/GraphCanvas";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { NodeInspector } from "@/components/node-detail/NodeInspector";
import { useGraphBootstrap } from "@/hooks/useGraph";
import { useAppStore } from "@/store/appStore";

function HomePageContent() {
  const searchParams = useSearchParams();
  const viewMode = searchParams.get("mode") === "browse" ? "browse" : "graph";

  const { status, error, retry } = useGraphBootstrap();
  const graph = useAppStore((s) => s.graph);
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useAppStore((s) => s.setSelectedNodeId);
  const setHighlightedNodeIds = useAppStore((s) => s.setHighlightedNodeIds);

  const selected = graph?.nodes.find((n) => n.id === selectedNodeId)?.data ?? null;

  return (
    <div className="flex h-dvh min-h-0 flex-col">
      <Header viewMode={viewMode} />
      {status === "loading" || status === "idle" ? (
        <div
          id="main-content"
          className="flex min-h-0 flex-1 scroll-mt-16 flex-col items-center justify-center gap-3 text-slate-500"
          aria-live="polite"
          aria-busy="true"
        >
          <Loader2
            className="size-8 animate-spin text-sky-600 dark:text-sky-400"
            aria-hidden
          />
          <span>Loading graph data…</span>
        </div>
      ) : status === "error" ? (
        <div
          id="main-content"
          className="flex flex-1 scroll-mt-16 flex-col items-center justify-center gap-4 px-4 text-center text-red-600"
          role="alert"
        >
          <AlertCircle className="size-10 shrink-0" aria-hidden />
          <p className="max-w-md text-sm leading-relaxed">
            {error ?? "We couldn't load the graph. Check your connection and try again."}
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-red-300 bg-[var(--surface)] px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40"
            onClick={retry}
          >
            <RotateCcw className="size-4" aria-hidden />
            Retry
          </button>
        </div>
      ) : (
        <main
          id="main-content"
          className="relative flex h-0 min-h-0 flex-1 scroll-mt-16 flex-col overflow-hidden"
        >
          {viewMode === "graph" ? (
            <GraphCanvas />
          ) : graph ? (
            <BrowseTree graph={graph} />
          ) : null}
          {selected ? (
            <NodeInspector
              node={selected}
              graph={graph}
              onClose={() => setSelectedNodeId(null)}
              onNavigateToNode={setSelectedNodeId}
              onHighlightNodes={setHighlightedNodeIds}
            />
          ) : null}
        </main>
      )}
      <Footer />
    </div>
  );
}

function HomePageSuspenseFallback() {
  return (
    <div className="flex h-dvh min-h-0 flex-col">
      <div className="border-b border-[var(--border)] bg-[var(--surface)]/90 px-4 py-3 backdrop-blur dark:border-slate-800">
        <div className="mx-auto h-6 max-w-[1600px] animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
      <div
        id="main-content"
        className="flex min-h-0 flex-1 scroll-mt-16 flex-col items-center justify-center gap-3 text-slate-500"
        aria-live="polite"
        aria-busy="true"
      >
        <Loader2
          className="size-8 animate-spin text-sky-600 dark:text-sky-400"
          aria-hidden
        />
        <span>Loading…</span>
      </div>
    </div>
  );
}

export function HomePage() {
  return (
    <Suspense fallback={<HomePageSuspenseFallback />}>
      <HomePageContent />
    </Suspense>
  );
}
