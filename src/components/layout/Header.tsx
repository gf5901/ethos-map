"use client";

import { LayoutGrid, ListTree, Map as MapIcon } from "lucide-react";
import Link from "next/link";
import { AxiomSetSelector } from "@/components/axiom-sets/AxiomSetSelector";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SearchBar } from "@/components/search/SearchBar";

export function Header({ viewMode = "graph" }: { viewMode?: "graph" | "browse" }) {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50"
        >
          <MapIcon
            className="size-5 shrink-0 text-sky-600 dark:text-sky-400"
            aria-hidden
          />
          EthosMap
        </Link>
        <nav
          aria-label="View mode"
          className="flex shrink-0 items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-sm dark:border-slate-700 dark:bg-slate-900/80"
        >
          <Link
            href="/"
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors ${
              viewMode === "graph"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-50"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            }`}
            aria-current={viewMode === "graph" ? "page" : undefined}
          >
            <LayoutGrid className="size-4 shrink-0" aria-hidden />
            Map
          </Link>
          <Link
            href="/?mode=browse"
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors ${
              viewMode === "browse"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-50"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            }`}
            aria-current={viewMode === "browse" ? "page" : undefined}
          >
            <ListTree className="size-4 shrink-0" aria-hidden />
            Browse
          </Link>
        </nav>
        <span className="hidden text-sm text-slate-500 lg:inline">
          Law & ethics as a tech tree
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-3">
          <AxiomSetSelector />
          <SearchBar />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
