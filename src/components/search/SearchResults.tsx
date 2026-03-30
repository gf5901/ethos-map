"use client";

import type { FuseResult } from "fuse.js";
import { Keyboard, SearchX } from "lucide-react";
import { NODE_TYPE_LABEL } from "@/lib/constants";
import type { SearchIndexRecord } from "@/lib/types";

export function SearchResults({
  id,
  results,
  activeIndex,
  queryTooShort,
  onSelect,
}: {
  id?: string;
  results: FuseResult<SearchIndexRecord>[];
  activeIndex: number;
  queryTooShort: boolean;
  onSelect: (id: string) => void;
}) {
  if (queryTooShort) {
    return (
      <p className="flex max-w-sm flex-col items-center gap-2 px-3 py-6 text-center text-sm text-slate-500">
        <Keyboard className="size-8 opacity-50" aria-hidden />
        <span>Type at least two characters to search.</span>
      </p>
    );
  }

  if (!results.length) {
    return (
      <p className="flex max-w-sm flex-col items-center gap-2 px-3 py-6 text-center text-sm text-slate-500">
        <SearchX className="size-8 opacity-50" aria-hidden />
        <span>No matching nodes.</span>
        <span className="text-xs text-slate-400">
          Try a different term or open browse to explore the tree.
        </span>
      </p>
    );
  }

  return (
    <div
      id={id}
      role="listbox"
      aria-label="Search results"
      className="max-h-80 overflow-auto py-1"
    >
      {results.map((r, i) => (
        <button
          key={r.item.id}
          type="button"
          className={`flex w-full flex-col gap-0.5 px-3 py-2 text-left text-sm hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-inset dark:hover:bg-slate-800 ${
            i === activeIndex ? "bg-slate-100 dark:bg-slate-800" : ""
          }`}
          onClick={() => onSelect(r.item.id)}
          role="option"
          aria-selected={i === activeIndex}
        >
          <span className="font-medium text-slate-900 dark:text-slate-50">
            {r.item.name}
          </span>
          <span className="text-xs text-slate-500">
            {NODE_TYPE_LABEL[r.item.type]}
            {r.item.jurisdictionNames?.length
              ? ` · ${r.item.jurisdictionNames.join(", ")}`
              : ""}
          </span>
          <span className="line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
            {r.item.plainSummary ?? r.item.description}
          </span>
        </button>
      ))}
    </div>
  );
}
