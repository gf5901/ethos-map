"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/appStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ethos-theme");
      if (stored === "dark" || stored === "light") setTheme(stored);
    } catch {
      /* ignore */
    }
  }, [setTheme]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem("ethos-theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  return <>{children}</>;
}
