"use client";

import { ArrowDownToLine, ArrowUpToLine, GitBranch, XCircle } from "lucide-react";
import Link from "next/link";
import {
  buildAdjacency,
  collectAncestors,
  collectDescendants,
  collectSiblingIds,
  orderedAncestorsExcludingSelf,
  orderedDescendantsExcludingSelf,
} from "@/lib/graph";
import type { CompiledGraph } from "@/lib/types";

function nameById(graph: CompiledGraph): Map<string, string> {
  return new Map(graph.nodes.map((n) => [n.id, n.data.name]));
}

function NavList({
  ids,
  nameMap,
  navigateMode,
  onNavigateToNode,
}: {
  ids: string[];
  nameMap: Map<string, string>;
  navigateMode: "graph" | "page";
  onNavigateToNode?: (id: string) => void;
}) {
  if (!ids.length) {
    return <p className="text-sm text-slate-500">None in this map</p>;
  }
  return (
    <ul className="space-y-1.5">
      {ids.map((id) => {
        const label = nameMap.get(id) ?? id;
        if (navigateMode === "page") {
          return (
            <li key={id}>
              <Link
                className="text-sky-600 hover:underline dark:text-sky-400"
                href={`/node/${id}`}
              >
                {label}
              </Link>
              <span className="ml-2 text-xs text-slate-400">{id}</span>
            </li>
          );
        }
        return (
          <li key={id}>
            <button
              type="button"
              className="text-left text-sky-600 hover:underline dark:text-sky-400"
              onClick={() => onNavigateToNode?.(id)}
            >
              {label}
            </button>
            <span className="ml-2 text-xs text-slate-400">{id}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function NodeGraphNavigation({
  graph,
  nodeId,
  navigateMode,
  onNavigateToNode,
  onHighlightNodes,
}: {
  graph: CompiledGraph;
  nodeId: string;
  navigateMode: "graph" | "page";
  onNavigateToNode?: (id: string) => void;
  onHighlightNodes?: (ids: string[] | null) => void;
}) {
  const edges = graph.edges.map((e) => ({ from: e.source, to: e.target }));
  const { parents, children } = buildAdjacency(edges);
  const nameMap = nameById(graph);

  const parentIds = parents.get(nodeId) ?? [];
  const childIds = children.get(nodeId) ?? [];
  const siblingIds = collectSiblingIds(nodeId, parents, children);

  const ancestorsUp = orderedAncestorsExcludingSelf(nodeId, parents);
  const descendantsDown = orderedDescendantsExcludingSelf(nodeId, children);

  const ancestorSet = collectAncestors(nodeId, parents);
  const descendantSet = collectDescendants(nodeId, children);

  const canHighlight = navigateMode === "graph" && onHighlightNodes;

  return (
    <div className="space-y-5 text-sm">
      {canHighlight ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            onClick={() => onHighlightNodes([...ancestorSet])}
          >
            <ArrowUpToLine className="size-3.5 shrink-0" aria-hidden />
            Show foundations on map
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            onClick={() => onHighlightNodes([...descendantSet])}
          >
            <ArrowDownToLine className="size-3.5 shrink-0" aria-hidden />
            Show what follows on map
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            onClick={() => onHighlightNodes(siblingIds)}
            disabled={!siblingIds.length}
            title={
              !siblingIds.length
                ? "No other entries share the same foundation in this map"
                : undefined
            }
          >
            <GitBranch className="size-3.5 shrink-0" aria-hidden />
            Show related ideas on map
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            onClick={() => onHighlightNodes(null)}
          >
            <XCircle className="size-3.5 shrink-0" aria-hidden />
            Clear map highlights
          </button>
        </div>
      ) : null}

      <section>
        <div className="text-label text-slate-500">What this builds on</div>
        <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
          Direct foundations—ideas this entry rests on in the map.
        </p>
        <div className="mt-1">
          <NavList
            ids={parentIds}
            nameMap={nameMap}
            navigateMode={navigateMode}
            onNavigateToNode={onNavigateToNode}
          />
        </div>
      </section>

      <section>
        <div className="text-label text-slate-500">Related ideas</div>
        <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
          Other entries that rest on the same foundation—alternative branches from the
          same starting point.
        </p>
        <div className="mt-1">
          <NavList
            ids={siblingIds}
            nameMap={nameMap}
            navigateMode={navigateMode}
            onNavigateToNode={onNavigateToNode}
          />
        </div>
      </section>

      <section>
        <div className="text-label text-slate-500">What builds on this</div>
        <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
          Direct next steps—ideas that this entry supports or leads to next in the map.
        </p>
        <div className="mt-1">
          <NavList
            ids={childIds}
            nameMap={nameMap}
            navigateMode={navigateMode}
            onNavigateToNode={onNavigateToNode}
          />
        </div>
      </section>

      {ancestorsUp.length ? (
        <section>
          <div className="text-label text-slate-500">Full path toward foundations</div>
          <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
            The whole chain back toward roots—closest foundations listed first.
          </p>
          <div className="mt-1">
            <NavList
              ids={ancestorsUp}
              nameMap={nameMap}
              navigateMode={navigateMode}
              onNavigateToNode={onNavigateToNode}
            />
          </div>
        </section>
      ) : null}

      {descendantsDown.length ? (
        <section>
          <div className="text-label text-slate-500">
            Everything that follows from this
          </div>
          <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
            The full chain forward—nearest consequences and laws first.
          </p>
          <div className="mt-1">
            <NavList
              ids={descendantsDown}
              nameMap={nameMap}
              navigateMode={navigateMode}
              onNavigateToNode={onNavigateToNode}
            />
          </div>
        </section>
      ) : null}

      {!parentIds.length &&
      !childIds.length &&
      !siblingIds.length &&
      !ancestorsUp.length &&
      !descendantsDown.length ? (
        <p className="text-sm text-slate-500">
          Nothing else in this map connects to this entry yet.
        </p>
      ) : null}
    </div>
  );
}
