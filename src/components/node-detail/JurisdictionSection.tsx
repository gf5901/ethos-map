import type { EthosNode } from "@/lib/types";

type Props = {
  node: EthosNode & { jurisdictionNames: string[] };
};

export function JurisdictionSection({ node }: Props) {
  const rows = node.jurisdictions?.map((j, i) => ({
    id: j.id,
    name: node.jurisdictionNames[i] ?? j.id,
    status: j.status,
    date: j.date,
    citation: j.citation,
  }));
  if (!rows?.length) return null;

  return (
    <section aria-labelledby="jurisdictions-heading">
      <h2 id="jurisdictions-heading" className="text-label text-slate-500">
        Jurisdictions
      </h2>
      <ul className="mt-3 divide-y divide-[var(--border)]">
        {rows.map((r, index) => (
          <li key={`${r.id}-${index}`} className="py-4 first:pt-1">
            <p className="font-medium text-slate-900 dark:text-slate-50">{r.name}</p>
            <dl className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
              {r.status ? (
                <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                  <dt className="shrink-0 text-slate-500 dark:text-slate-500">Status</dt>
                  <dd className="min-w-0">{r.status}</dd>
                </div>
              ) : null}
              {r.date ? (
                <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                  <dt className="shrink-0 text-slate-500 dark:text-slate-500">Date</dt>
                  <dd className="min-w-0">
                    <time dateTime={r.date}>{r.date}</time>
                  </dd>
                </div>
              ) : null}
              {r.citation ? (
                <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                  <dt className="shrink-0 text-slate-500 dark:text-slate-500">
                    Citation
                  </dt>
                  <dd className="min-w-0">{r.citation}</dd>
                </div>
              ) : null}
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}
