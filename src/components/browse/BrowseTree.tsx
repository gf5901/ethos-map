"use client";

import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { classifyNode } from "@/lib/axiomFilter";
import { NODE_TYPE_LABEL, NODE_TYPE_STYLES } from "@/lib/constants";
import { buildAdjacency, findRootIds, sortIdsByName } from "@/lib/graph";
import type { AxiomReachabilityMap, CompiledFlowNode, CompiledGraph } from "@/lib/types";
import { useAppStore } from "@/store/appStore";

function nodeMaps(graph: CompiledGraph) {
  const byId = new Map<string, CompiledFlowNode>();
  const nameById = new Map<string, string>();
  for (const n of graph.nodes) {
    byId.set(n.id, n);
    nameById.set(n.id, n.data.name);
  }
  return { byId, nameById };
}

type TreeRowProps = {
  nodeId: string;
  reactKey: string;
  depth: number;
  childrenMap: Map<string, string[]>;
  byId: Map<string, CompiledFlowNode>;
  nameById: Map<string, string>;
  selectedNodeId: string | null;
  selectedAxiomSetId: string | null;
  reachability: AxiomReachabilityMap;
  onSelectNode: (id: string) => void;
};

function TreeRow({
  nodeId,
  reactKey,
  depth,
  childrenMap,
  byId,
  nameById,
  selectedNodeId,
  selectedAxiomSetId,
  reachability,
  onSelectNode,
}: TreeRowProps) {
  const flowNode = byId.get(nodeId);
  const childIds = sortIdsByName(childrenMap.get(nodeId) ?? [], nameById);
  const hasChildren = childIds.length > 0;
  const [expanded, setExpanded] = useState(depth === 0);

  const classification = classifyNode(nodeId, selectedAxiomSetId, reachability);
  const dimmed = classification === "unreachable";
  const tension = classification === "tension";
  const selected = selectedNodeId === nodeId;

  const toggleExpand = useCallback(() => {
    setExpanded((e) => !e);
  }, []);

  const onKeyDownRow = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelectNode(nodeId);
      }
    },
    [nodeId, onSelectNode]
  );

  const onKeyDownExpand = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleExpand();
      }
    },
    [toggleExpand]
  );

  if (!flowNode) {
    return null;
  }

  const type = flowNode.data.type;
  const chip = NODE_TYPE_STYLES[type].chip;

  const rowClass = [
    "flex min-h-10 w-full min-w-0 items-center gap-1 rounded-md border border-transparent px-1 py-0.5 text-left text-sm transition-colors",
    dimmed ? "opacity-40 grayscale" : "",
    tension ? "border-red-500/80 bg-red-50/50 dark:bg-red-950/30" : "",
    selected
      ? "bg-sky-50 ring-2 ring-sky-500 dark:bg-sky-950/40"
      : "hover:bg-slate-100 dark:hover:bg-slate-900/60",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      role="treeitem"
      tabIndex={0}
      aria-expanded={hasChildren ? expanded : undefined}
      className="list-none outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
    >
      <div className={rowClass}>
        {hasChildren ? (
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-slate-600 hover:bg-slate-200/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label={expanded ? "Collapse branch" : "Expand branch"}
            onClick={toggleExpand}
            onKeyDown={onKeyDownExpand}
          >
            {expanded ? (
              <ChevronDown className="size-4" aria-hidden />
            ) : (
              <ChevronRight className="size-4" aria-hidden />
            )}
          </button>
        ) : (
          <span className="inline-block w-8 shrink-0" aria-hidden />
        )}
        <button
          type="button"
          className="min-w-0 flex-1 truncate rounded-sm text-left font-medium text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:text-slate-50 dark:focus-visible:ring-offset-slate-950"
          onClick={() => onSelectNode(nodeId)}
          onKeyDown={onKeyDownRow}
        >
          {flowNode.data.name}
        </button>
        <span
          className={`hidden shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium sm:inline ${chip}`}
        >
          {NODE_TYPE_LABEL[type]}
        </span>
        <Link
          href={`/node/${nodeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded p-1.5 text-sky-600 outline-none hover:bg-sky-100 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:text-sky-400 dark:hover:bg-sky-950/50"
          aria-label={`Open full page for ${flowNode.data.name}`}
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="size-4" aria-hidden />
        </Link>
      </div>
      {hasChildren && expanded ? (
        <div role="group" className="ml-4 border-l border-[var(--border)] pl-2">
          {childIds.map((cid) => (
            <TreeRow
              key={`${reactKey}/${cid}`}
              reactKey={`${reactKey}/${cid}`}
              nodeId={cid}
              depth={depth + 1}
              childrenMap={childrenMap}
              byId={byId}
              nameById={nameById}
              selectedNodeId={selectedNodeId}
              selectedAxiomSetId={selectedAxiomSetId}
              reachability={reachability}
              onSelectNode={onSelectNode}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function BrowseTree({ graph }: { graph: CompiledGraph }) {
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useAppStore((s) => s.setSelectedNodeId);
  const selectedAxiomSetId = useAppStore((s) => s.selectedAxiomSetId);
  const reachability = useAppStore((s) => s.reachability);

  const onSelectNode = useCallback(
    (id: string) => {
      setSelectedNodeId(id);
    },
    [setSelectedNodeId]
  );

  const { roots, childrenMap, byId, nameById } = useMemo(() => {
    const edges = graph.edges.map((e) => ({ from: e.source, to: e.target }));
    const { parents, children } = buildAdjacency(edges);
    const nodeIds = graph.nodes.map((n) => n.id);
    const maps = nodeMaps(graph);
    const rootsSorted = sortIdsByName(findRootIds(nodeIds, parents), maps.nameById);
    return {
      roots: rootsSorted,
      childrenMap: children,
      byId: maps.byId,
      nameById: maps.nameById,
    };
  }, [graph]);

  if (roots.length === 0) {
    return (
      <div
        className="flex max-w-md flex-1 flex-col items-center justify-center gap-3 p-8 text-center text-sm text-slate-500"
        role="status"
      >
        <p>No nodes to display.</p>
        <p className="text-xs text-slate-400">
          Try{" "}
          <Link
            href="/"
            className="font-medium text-sky-600 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:text-sky-400"
          >
            returning to the map
          </Link>{" "}
          or reloading the page.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 flex-1 overflow-y-auto px-4 py-4">
      <div
        role="tree"
        aria-label="Browse nodes by dependency tree"
        className="space-y-0.5"
      >
        {roots.map((id) => (
          <TreeRow
            key={id}
            reactKey={id}
            nodeId={id}
            depth={0}
            childrenMap={childrenMap}
            byId={byId}
            nameById={nameById}
            selectedNodeId={selectedNodeId}
            selectedAxiomSetId={selectedAxiomSetId}
            reachability={reachability}
            onSelectNode={onSelectNode}
          />
        ))}
      </div>
    </div>
  );
}
