import type { EthosNode } from "@/lib/types";
import { FoundationGauge } from "./FoundationGauge";

type Props = {
  node: Pick<EthosNode, "foundationStrength" | "foundationStrengthRationale">;
};

export function FoundationStrengthBlock({ node }: Props) {
  const hasGauge = typeof node.foundationStrength === "number";
  const hasRationale = Boolean(node.foundationStrengthRationale?.trim());
  if (!hasGauge && !hasRationale) return null;

  return (
    <div className="space-y-3">
      {hasGauge ? (
        <div className="max-w-sm">
          <FoundationGauge value={node.foundationStrength!} />
        </div>
      ) : null}
      {hasRationale ? (
        <div>
          <p className="text-label text-slate-500">Why this rating</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {node.foundationStrengthRationale}
          </p>
        </div>
      ) : null}
    </div>
  );
}
