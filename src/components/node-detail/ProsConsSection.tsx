"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import type { EthosNode } from "@/lib/types";

export function ProsConsSection({ node }: { node: EthosNode }) {
  if (node.type === "axiom") {
    return (
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Axioms are roots of the graph and do not carry structured pros/cons in this
        dataset.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
          <ThumbsUp className="size-4 shrink-0" aria-hidden />
          Arguments for
        </h3>
        <ul className="mt-2 space-y-3">
          {(node.pros ?? []).map((p, i) => (
            <li
              key={i}
              className="rounded-lg border border-emerald-200/80 bg-emerald-50/60 p-3 text-sm dark:border-emerald-900 dark:bg-emerald-950/30"
            >
              <p className="font-medium text-slate-900 dark:text-slate-50">{p.claim}</p>
              <p className="mt-1 text-slate-700 dark:text-slate-300">{p.evidence}</p>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-rose-800 dark:text-rose-300">
          <ThumbsDown className="size-4 shrink-0" aria-hidden />
          Arguments against
        </h3>
        <ul className="mt-2 space-y-3">
          {(node.cons ?? []).map((c, i) => (
            <li
              key={i}
              className="rounded-lg border border-rose-200/80 bg-rose-50/60 p-3 text-sm dark:border-rose-900 dark:bg-rose-950/30"
            >
              <p className="font-medium text-slate-900 dark:text-slate-50">{c.claim}</p>
              <p className="mt-1 text-slate-700 dark:text-slate-300">{c.evidence}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
