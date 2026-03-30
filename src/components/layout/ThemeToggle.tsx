"use client";

import { Moon, Sun } from "lucide-react";
import { useAppStore } from "@/store/appStore";

export function ThemeToggle() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  return (
    <button
      type="button"
      className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-md border border-slate-300 bg-[var(--surface)] px-3 py-1.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-slate-600"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="size-4 text-amber-500" aria-hidden />
      ) : (
        <Moon className="size-4 text-slate-600 dark:text-slate-300" aria-hidden />
      )}
    </button>
  );
}
