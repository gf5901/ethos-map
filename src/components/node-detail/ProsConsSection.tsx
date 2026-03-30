"use client";

import { ExternalLink, ThumbsDown, ThumbsUp } from "lucide-react";
import { formatCitationSourceType } from "@/lib/citation-format";
import type { EthosNode } from "@/lib/types";

function ArgumentCitationList({
  keys,
  citations,
  tone,
}: {
  keys: string[];
  citations: EthosNode["citations"];
  tone: "for" | "against";
}) {
  if (!keys.length) return null;
  const border =
    tone === "for"
      ? "border-emerald-200/80 dark:border-emerald-900/80"
      : "border-rose-200/80 dark:border-rose-900/80";
  return (
    <ul
      className={`mt-2 space-y-1 border-t ${border} pt-2`}
      aria-label="Sources for this argument"
    >
      {keys.map((k) => {
        const ref = citations[k];
        const label = ref?.title ?? k;
        return (
          <li key={k} className="text-xs text-slate-600 dark:text-slate-400">
            {ref?.url ? (
              <a
                className="inline-flex items-center gap-1 rounded-sm font-medium text-sky-600 outline-none hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:text-sky-400"
                href={ref.url}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="size-3 shrink-0" aria-hidden />
                {label}
                {ref.year !== undefined ? ` (${ref.year})` : ""}
              </a>
            ) : (
              <span>
                {label}
                {ref?.year !== undefined ? ` (${ref.year})` : ""}
              </span>
            )}
            {ref?.type ? (
              <span className="text-slate-500">
                {" "}
                · {formatCitationSourceType(ref.type)}
              </span>
            ) : !ref ? (
              <span className="text-slate-500">{` · Key "${k}" not in citations map`}</span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function ProsConsSection({ node }: { node: EthosNode }) {
  if (node.type === "axiom") {
    return (
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Axioms are roots of the graph and do not carry structured pros/cons in this
        dataset.
      </p>
    );
  }

  const citations = node.citations;

  return (
    <div className="space-y-6">
      <section aria-labelledby="arguments-for-heading">
        <h2
          id="arguments-for-heading"
          className="flex items-center gap-2 text-lg font-semibold text-emerald-800 dark:text-emerald-300"
        >
          <ThumbsUp className="size-4 shrink-0" aria-hidden />
          Arguments for
        </h2>
        <ul className="mt-2 space-y-3">
          {(node.pros ?? []).map((p, i) => (
            <li
              key={i}
              className="rounded-lg border border-emerald-200/80 bg-emerald-50/60 p-3 text-sm dark:border-emerald-900 dark:bg-emerald-950/30"
            >
              <p className="font-medium text-slate-900 dark:text-slate-50">{p.claim}</p>
              <p className="mt-1 text-slate-700 dark:text-slate-300">{p.evidence}</p>
              <ArgumentCitationList keys={p.citations} citations={citations} tone="for" />
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="arguments-against-heading">
        <h2
          id="arguments-against-heading"
          className="flex items-center gap-2 text-lg font-semibold text-rose-800 dark:text-rose-300"
        >
          <ThumbsDown className="size-4 shrink-0" aria-hidden />
          Arguments against
        </h2>
        <ul className="mt-2 space-y-3">
          {(node.cons ?? []).map((c, i) => (
            <li
              key={i}
              className="rounded-lg border border-rose-200/80 bg-rose-50/60 p-3 text-sm dark:border-rose-900 dark:bg-rose-950/30"
            >
              <p className="font-medium text-slate-900 dark:text-slate-50">{c.claim}</p>
              <p className="mt-1 text-slate-700 dark:text-slate-300">{c.evidence}</p>
              <ArgumentCitationList
                keys={c.citations}
                citations={citations}
                tone="against"
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
