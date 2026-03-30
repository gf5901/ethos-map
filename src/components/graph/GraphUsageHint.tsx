"use client";

import { Lightbulb, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "ethos-graph-hint-dismissed";

export function GraphUsageHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(localStorage.getItem(STORAGE_KEY) !== "1");
    } catch {
      setVisible(true);
    }
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-auto absolute bottom-4 left-1/2 z-10 max-w-md -translate-x-1/2 px-4">
      <div className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)]/95 px-3 py-2 text-xs text-slate-700 shadow-lg backdrop-blur dark:text-slate-200">
        <Lightbulb
          className="mt-0.5 size-4 shrink-0 text-amber-500 dark:text-amber-400"
          aria-hidden
        />
        <p className="min-w-0 flex-1 leading-relaxed">
          <span className="font-medium text-slate-900 dark:text-slate-50">Tip:</span> Drag
          to pan, scroll or pinch to zoom, and click a node to read details. Use search
          (top) to jump anywhere.
        </p>
        <button
          type="button"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:text-slate-400 dark:hover:bg-slate-800"
          onClick={dismiss}
          aria-label="Dismiss map tip"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
