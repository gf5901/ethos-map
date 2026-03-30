"use client";

import { Search, X } from "lucide-react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchIndex } from "@/hooks/useSearch";
import { isApplePlatform } from "@/lib/platform";
import { useAppStore } from "@/store/appStore";
import { DrillToRootsButton } from "./DrillToRoots";
import { SearchResults } from "./SearchResults";

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl/⌘K");
  const inputRef = useRef<HTMLInputElement>(null);
  const fuse = useSearchIndex();
  const setSelectedNodeId = useAppStore((s) => s.setSelectedNodeId);

  const results = useMemo(() => {
    const query = q.trim();
    if (query.length < 2) return [];
    return fuse.search(query).slice(0, 20);
  }, [fuse, q]);

  const queryTooShort = q.trim().length > 0 && q.trim().length < 2;

  useEffect(() => {
    setShortcutLabel(isApplePlatform() ? "⌘K" : "Ctrl+K");
  }, []);

  useEffect(() => {
    setActiveIndex(results.length ? 0 : -1);
  }, [results]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      setQ("");
      setActiveIndex(-1);
    }
  }, [open]);

  const onSelect = useCallback(
    (id: string) => {
      setSelectedNodeId(id);
      setOpen(false);
      setQ("");
    },
    [setSelectedNodeId]
  );

  const onInputKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!results.length) return;
        setActiveIndex((i) => (i < 0 ? 0 : Math.min(i + 1, results.length - 1)));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!results.length) return;
        setActiveIndex((i) => Math.max(0, i - 1));
        return;
      }
      if (e.key === "Enter") {
        if (activeIndex >= 0 && results[activeIndex]) {
          e.preventDefault();
          onSelect(results[activeIndex].item.id);
        }
      }
    },
    [activeIndex, onSelect, results]
  );

  return (
    <>
      <button
        type="button"
        className="hidden w-64 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-left text-sm text-slate-600 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 sm:flex dark:text-slate-300"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <Search className="size-4 shrink-0 opacity-60" aria-hidden />
        <span className="min-w-0 flex-1 truncate">Search…</span>
        <kbd className="ml-auto shrink-0 rounded bg-slate-100 px-1 text-[10px] dark:bg-slate-800">
          {shortcutLabel}
        </kbd>
      </button>
      <button
        type="button"
        className="inline-flex min-h-11 min-w-11 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 sm:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open search"
      >
        <Search className="size-4 shrink-0" aria-hidden />
        Search
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ethos-search-field-label"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-black/40"
            aria-label="Close search"
            onClick={() => setOpen(false)}
          />
          <div
            className="relative z-10 w-full max-w-lg rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-2 top-2 z-20 rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              onClick={() => setOpen(false)}
              aria-label="Close search"
            >
              <X className="size-5" aria-hidden />
            </button>
            <div className="border-b border-[var(--border)] p-3 pr-12">
              <label
                id="ethos-search-field-label"
                htmlFor="ethos-search-input"
                className="mb-2 block text-label text-slate-500"
              >
                Search
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  ref={inputRef}
                  id="ethos-search-input"
                  className="w-full rounded-md border border-slate-300 bg-[var(--surface)] py-2 pl-9 pr-3 text-sm outline-none ring-sky-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] dark:border-slate-600"
                  placeholder="e.g. statute name, principle, concept"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={onInputKeyDown}
                  aria-controls="ethos-search-listbox"
                  aria-autocomplete="list"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {results[0] ? (
                  <DrillToRootsButton
                    nodeId={results[0].item.id}
                    onDone={() => setOpen(false)}
                  />
                ) : null}
              </div>
            </div>
            <SearchResults
              id="ethos-search-listbox"
              results={results}
              activeIndex={activeIndex}
              queryTooShort={queryTooShort}
              onSelect={onSelect}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
