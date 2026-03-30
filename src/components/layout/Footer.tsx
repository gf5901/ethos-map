import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-4 text-center text-xs text-slate-500 dark:border-slate-800">
      <span className="inline-flex items-center justify-center gap-1.5">
        <BookOpen className="size-3.5 shrink-0 opacity-80" aria-hidden />
        EthosMap — open knowledge graph. Data: CC BY-SA 4.0 (editorial content).
      </span>
    </footer>
  );
}
