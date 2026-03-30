"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { NODE_TYPE_LABEL, NODE_TYPE_STYLES } from "@/lib/constants";
import type { EthosNode } from "@/lib/types";
import { useAppStore } from "@/store/appStore";

export type EthosFlowData = EthosNode & {
  jurisdictionNames: string[];
  lod?: "macro" | "meso" | "micro";
};

function FoundationBar({ value }: { value: number }) {
  const filled = Math.round(Math.max(1, Math.min(5, value)));
  return (
    <div className="mt-1 flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 flex-1 rounded-sm ${i < filled ? "bg-slate-600 dark:bg-slate-300" : "bg-slate-200 dark:bg-slate-700"}`}
        />
      ))}
    </div>
  );
}

export function NodeCard({ id, data, selected }: NodeProps) {
  const d = data as EthosFlowData;
  const zoomBand = useAppStore((s) => s.zoomBand);
  const lod = d.lod ?? zoomBand;
  const styles = NODE_TYPE_STYLES[d.type];

  if (lod === "macro") {
    return (
      <>
        <Handle type="target" position={Position.Top} className="!bg-slate-400" />
        <div
          className={`h-3 w-3 rounded-full border-2 ${styles.card}`}
          title={d.name}
          aria-label={`${NODE_TYPE_LABEL[d.type]}: ${d.name}`}
        />
        <Handle type="source" position={Position.Bottom} className="!bg-slate-400" />
      </>
    );
  }

  if (lod === "meso") {
    return (
      <>
        <Handle type="target" position={Position.Top} className="!bg-slate-400" />
        <div
          className={`min-w-[120px] max-w-[200px] rounded-lg border px-2 py-1 text-xs shadow-sm ${styles.card}`}
        >
          <div className="truncate font-medium text-slate-900 dark:text-slate-100">
            {d.name}
          </div>
          <div className="text-[10px] text-slate-600 dark:text-slate-400">
            {NODE_TYPE_LABEL[d.type]}
          </div>
        </div>
        <Handle type="source" position={Position.Bottom} className="!bg-slate-400" />
      </>
    );
  }

  return (
    <>
      <Handle type="target" position={Position.Top} className="!h-2 !w-2 !bg-slate-500" />
      <div
        className={`w-[260px] rounded-xl border-2 p-3 shadow-md transition-shadow ${styles.card} ${
          selected ? "ring-2 ring-sky-500 ring-offset-2 dark:ring-offset-slate-950" : ""
        }`}
        role="article"
        aria-labelledby={`node-title-${id}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              id={`node-title-${id}`}
              className="text-sm font-semibold leading-snug text-slate-900 dark:text-slate-50"
            >
              {d.name}
            </p>
            <span
              className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${styles.chip}`}
            >
              {NODE_TYPE_LABEL[d.type]}
            </span>
          </div>
        </div>
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          {d.plainSummary ?? d.description}
        </p>
        {typeof d.foundationStrength === "number" ? (
          <div className="mt-2">
            <div className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
              Foundation strength
            </div>
            <FoundationBar value={d.foundationStrength} />
          </div>
        ) : null}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !bg-slate-500"
      />
    </>
  );
}
