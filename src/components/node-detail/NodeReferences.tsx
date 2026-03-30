import { ExternalLink } from "lucide-react";
import { formatCitationSourceType } from "@/lib/citation-format";
import type { EthosNode } from "@/lib/types";

type Props = {
  citations: EthosNode["citations"];
};

export function NodeReferences({ citations }: Props) {
  const entries = Object.entries(citations).sort((a, b) =>
    (a[1].title ?? a[0]).localeCompare(b[1].title ?? b[0], undefined, {
      sensitivity: "base",
    })
  );
  if (!entries.length) return null;

  return (
    <section aria-labelledby="references-heading">
      <h2
        id="references-heading"
        className="text-lg font-semibold leading-snug text-slate-900 dark:text-slate-50"
      >
        Sources and references
      </h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Works cited for this entry. Links open in a new tab when a URL is available.
      </p>
      <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-slate-700 marker:text-slate-500 dark:text-slate-300 dark:marker:text-slate-500">
        {entries.map(([key, ref]) => (
          <li key={key} className="pl-1">
            {ref.url ? (
              <a
                className="inline-flex items-start gap-1.5 rounded-sm font-medium text-sky-600 underline-offset-2 outline-none hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:text-sky-400"
                href={ref.url}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>
                  {ref.title}
                  {typeof ref.year === "number" ? ` (${ref.year})` : ""}
                </span>
              </a>
            ) : (
              <span className="font-medium text-slate-900 dark:text-slate-50">
                {ref.title}
                {typeof ref.year === "number" ? ` (${ref.year})` : ""}
              </span>
            )}
            <span className="mt-1 block text-xs text-slate-500 dark:text-slate-500">
              {formatCitationSourceType(ref.type)}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
