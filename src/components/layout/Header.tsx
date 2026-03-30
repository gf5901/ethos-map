"use client";

import { LayoutGrid, ListTree, Map as MapIcon } from "lucide-react";
import Link from "next/link";
import { AxiomSetSelector } from "@/components/axiom-sets/AxiomSetSelector";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SearchBar } from "@/components/search/SearchBar";

export function Header({
  viewMode = "graph",
  variant = "home",
}: {
  viewMode?: "graph" | "browse";
  variant?: "home" | "node";
}) {
  const isHome = variant === "home";

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur dark:bg-[var(--surface)]/90">
      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 shrink-0 items-center gap-3">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 rounded-md text-lg font-semibold tracking-tight text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:text-slate-50"
          >
            <MapIcon
              className="size-5 shrink-0 text-sky-600 dark:text-sky-400"
              aria-hidden
            />
            EthosMap
          </Link>
          {isHome ? (
            <span className="hidden text-sm text-slate-500 lg:inline">
              Law & ethics as a tech tree
            </span>
          ) : null}
        </div>

        {isHome ? (
          <nav
            aria-label="View mode"
            className="hidden shrink-0 items-center rounded-lg border border-[var(--border)] bg-slate-50 p-0.5 text-sm sm:flex dark:bg-slate-900/80"
          >
            <Link
              href="/"
              className={`inline-flex min-h-9 items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
                viewMode === "graph"
                  ? "bg-[var(--surface)] text-slate-900 shadow-sm dark:text-slate-50"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
              aria-current={viewMode === "graph" ? "page" : undefined}
            >
              <LayoutGrid className="size-4 shrink-0" aria-hidden />
              Map
            </Link>
            <Link
              href="/?mode=browse"
              className={`inline-flex min-h-9 items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
                viewMode === "browse"
                  ? "bg-[var(--surface)] text-slate-900 shadow-sm dark:text-slate-50"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
              aria-current={viewMode === "browse" ? "page" : undefined}
            >
              <ListTree className="size-4 shrink-0" aria-hidden />
              Browse
            </Link>
          </nav>
        ) : null}

        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-3 sm:flex-initial">
          {isHome ? (
            <div className="hidden min-w-0 sm:block sm:max-w-[14rem] lg:max-w-xs">
              <AxiomSetSelector compact />
            </div>
          ) : null}
          <SearchBar />
          <div className={isHome ? "hidden sm:flex" : "flex"}>
            <ThemeToggle />
          </div>
          {isHome ? <MobileNav variant={variant} viewMode={viewMode} /> : null}
        </div>
      </div>
    </header>
  );
}
