"use client";

import { LayoutGrid, ListTree, Menu, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AxiomSetSelector } from "@/components/axiom-sets/AxiomSetSelector";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

type MobileNavProps = {
  variant: "home" | "node";
  viewMode: "graph" | "browse";
};

/** Browse vs Map lives in {@link Header} (TRD section 8.2 list/tree mode). */
export function MobileNav({ variant, viewMode }: MobileNavProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const open = useCallback(() => {
    const d = dialogRef.current;
    if (!d || d.open) return;
    d.showModal();
    setDialogOpen(true);
    requestAnimationFrame(() => {
      d.querySelector<HTMLElement>("[data-mobile-nav-close]")?.focus();
    });
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => {
      setDialogOpen(false);
      triggerRef.current?.focus();
    };
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  return (
    <div className="flex sm:hidden">
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex size-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:text-slate-100"
        onClick={open}
        aria-expanded={dialogOpen}
        aria-haspopup="dialog"
        aria-controls="ethos-mobile-nav-dialog"
      >
        <Menu className="size-5 shrink-0" aria-hidden />
        <span className="sr-only">Open menu</span>
      </button>

      <dialog
        ref={dialogRef}
        id="ethos-mobile-nav-dialog"
        className="fixed inset-0 z-[60] m-0 max-h-full max-w-full border-0 bg-transparent p-0 backdrop:bg-black/40"
        aria-labelledby="ethos-mobile-nav-title"
      >
        <div className="fixed inset-0 flex items-end justify-center">
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-black/40"
            aria-label="Close navigation"
            onClick={close}
          />
          <div
            className="ethos-mobile-nav-sheet-animate relative z-10 w-full max-h-[85vh] overflow-y-auto rounded-t-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
              <h2
                id="ethos-mobile-nav-title"
                className="text-base font-semibold text-slate-900 dark:text-slate-50"
              >
                Menu
              </h2>
              <button
                type="button"
                data-mobile-nav-close
                className="inline-flex size-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={close}
                aria-label="Close navigation"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <div className="flex flex-col gap-6 px-4 py-4">
              {variant === "home" ? (
                <nav aria-label="View mode" className="flex flex-col gap-2">
                  <span className="text-label text-slate-500">View</span>
                  <div className="flex items-center rounded-lg border border-[var(--border)] bg-slate-50 p-0.5 text-sm dark:bg-slate-900/80">
                    <Link
                      href="/"
                      className={`inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 py-2 font-medium transition-colors ${
                        viewMode === "graph"
                          ? "bg-[var(--surface)] text-slate-900 shadow-sm dark:text-slate-50"
                          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                      }`}
                      aria-current={viewMode === "graph" ? "page" : undefined}
                      onClick={close}
                    >
                      <LayoutGrid className="size-4 shrink-0" aria-hidden />
                      Map
                    </Link>
                    <Link
                      href="/?mode=browse"
                      className={`inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 py-2 font-medium transition-colors ${
                        viewMode === "browse"
                          ? "bg-[var(--surface)] text-slate-900 shadow-sm dark:text-slate-50"
                          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                      }`}
                      aria-current={viewMode === "browse" ? "page" : undefined}
                      onClick={close}
                    >
                      <ListTree className="size-4 shrink-0" aria-hidden />
                      Browse
                    </Link>
                  </div>
                </nav>
              ) : null}

              <div>
                <span className="text-label text-slate-500">Axiom set</span>
                <div className="mt-2">
                  <AxiomSetSelector />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Theme
                </span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}
