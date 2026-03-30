"use client";

import { Moon, Sun } from "lucide-react";
import { useAppStore } from "@/store/appStore";

export function ThemeToggle() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
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
