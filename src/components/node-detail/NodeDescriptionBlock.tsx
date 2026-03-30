import type { EthosNode } from "@/lib/types";

type Props = {
  node: Pick<EthosNode, "plainSummary" | "description" | "whyRoot" | "type">;
  leadClassName?: string;
  detailClassName?: string;
};

export function NodeDescriptionBlock({
  node,
  leadClassName = "text-sm leading-relaxed text-slate-700 dark:text-slate-300",
  detailClassName = "text-sm leading-relaxed text-slate-600 dark:text-slate-400",
}: Props) {
  const { plainSummary, description, whyRoot, type } = node;
  const sectionLabel = type === "axiom" ? "Why this is a root" : "Why this matters";

  if (!plainSummary) {
    if (!whyRoot) {
      return <p className={leadClassName}>{description}</p>;
    }
    return (
      <div className="space-y-3">
        <div>
          <p className="text-label text-slate-500">{sectionLabel}</p>
          <p className={`mt-1 ${leadClassName}`}>{whyRoot}</p>
        </div>
        <p className={detailClassName}>{description}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className={leadClassName}>{plainSummary}</p>
      {whyRoot ? (
        <div>
          <p className="text-label text-slate-500">{sectionLabel}</p>
          <p className={`mt-1 ${leadClassName}`}>{whyRoot}</p>
        </div>
      ) : null}
      <div>
        <p className="text-label text-slate-500">Details</p>
        <p className={`mt-1 ${detailClassName}`}>{description}</p>
      </div>
    </div>
  );
}
