import type { NodeType } from "./types";

export const NODE_TYPE_LABEL: Record<NodeType, string> = {
  axiom: "Axiom",
  principle: "Principle",
  "legal-concept": "Legal concept",
  statute: "Statute",
  "proposed-law": "Proposed law",
};

/** Tailwind-oriented palette tokens (bg / border) */
export const NODE_TYPE_STYLES: Record<NodeType, { card: string; chip: string }> = {
  axiom: {
    card: "border-amber-400/80 bg-amber-50 dark:bg-amber-950/40",
    chip: "bg-amber-200 text-amber-950 dark:bg-amber-900/60 dark:text-amber-100",
  },
  principle: {
    card: "border-blue-400/80 bg-blue-50 dark:bg-blue-950/40",
    chip: "bg-blue-200 text-blue-950 dark:bg-blue-900/60 dark:text-blue-100",
  },
  "legal-concept": {
    card: "border-emerald-400/80 bg-emerald-50 dark:bg-emerald-950/40",
    chip: "bg-emerald-200 text-emerald-950 dark:bg-emerald-900/60 dark:text-emerald-100",
  },
  statute: {
    card: "border-slate-400/80 bg-slate-50 dark:bg-slate-900/40",
    chip: "bg-slate-200 text-slate-950 dark:bg-slate-800 dark:text-slate-100",
  },
  "proposed-law": {
    card: "border-violet-400/80 bg-violet-50 dark:bg-violet-950/40",
    chip: "bg-violet-200 text-violet-950 dark:bg-violet-900/60 dark:text-violet-100",
  },
};
