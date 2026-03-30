"use client";

import { ExternalLink, Link as LinkIcon, X } from "lucide-react";
import Link from "next/link";
import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { NODE_TYPE_LABEL } from "@/lib/constants";
import type { CompiledGraph, EthosNode } from "@/lib/types";
import { FoundationGauge } from "./FoundationGauge";
import { JurisdictionBadges } from "./JurisdictionBadges";
import { NodeDescriptionBlock } from "./NodeDescriptionBlock";
import { NodeGraphNavigation } from "./NodeGraphNavigation";
import { ProsConsSection } from "./ProsConsSection";

function githubEditUrl(nodeId: string): string | null {
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO;
  if (!repo) return null;
  return `https://github.com/${repo}/edit/main/data/nodes/${nodeId}.json`;
}

export function NodeInspector({
  node,
  graph,
  onClose,
  onNavigateToNode,
  onHighlightNodes,
}: {
  node: EthosNode & { jurisdictionNames: string[] };
  graph: CompiledGraph | null;
  onClose: () => void;
  onNavigateToNode?: (id: string) => void;
  onHighlightNodes?: (ids: string[] | null) => void;
}) {
  const editUrl = githubEditUrl(node.id);
  const panelRef = useRef<HTMLElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    prevFocusRef.current = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => panelRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    return () => {
      const el = prevFocusRef.current;
      if (el && typeof el.focus === "function") el.focus();
    };
  }, []);

  const onBackdropPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  return (
    <>
      <div
        className="fixed inset-0 z-30 bg-black/20 dark:bg-black/40"
        aria-hidden
        onPointerDown={onBackdropPointerDown}
      />
      <aside
        ref={panelRef}
        tabIndex={-1}
        className="fixed inset-y-0 right-0 z-40 w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white shadow-2xl outline-none dark:border-slate-800 dark:bg-slate-950"
        role="dialog"
        aria-modal="true"
        aria-label="Node details"
      >
        <div className="flex items-start justify-between gap-2 border-b border-slate-200 p-4 dark:border-slate-800">
          <div>
            <p className="text-label text-slate-500">{NODE_TYPE_LABEL[node.type]}</p>
            <h2 className="mt-1 text-lg font-semibold leading-snug text-slate-900 dark:text-slate-50">
              {node.name}
            </h2>
          </div>
          <button
            type="button"
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="space-y-4 p-4">
          <NodeDescriptionBlock node={node} />

          {typeof node.foundationStrength === "number" ? (
            <FoundationGauge value={node.foundationStrength} />
          ) : null}

          {node.foundationStrengthRationale ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {node.foundationStrengthRationale}
            </p>
          ) : null}

          <div>
            <div className="text-label text-slate-500">Jurisdictions</div>
            <div className="mt-1">
              <JurisdictionBadges names={node.jurisdictionNames} />
            </div>
          </div>

          <ProsConsSection node={node} />

          {graph ? (
            <div>
              <div className="text-label text-slate-500">Explore connections</div>
              <div className="mt-2">
                <NodeGraphNavigation
                  graph={graph}
                  nodeId={node.id}
                  navigateMode="graph"
                  onNavigateToNode={onNavigateToNode}
                  onHighlightNodes={onHighlightNodes}
                />
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            <Link
              className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:underline dark:text-sky-400"
              href={`/node/${node.id}`}
            >
              <LinkIcon className="size-4 shrink-0" aria-hidden />
              Open standalone page
            </Link>
            {editUrl ? (
              <a
                className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:underline dark:text-sky-400"
                href={editUrl}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="size-4 shrink-0" aria-hidden />
                Propose edit on GitHub
              </a>
            ) : (
              <p className="text-xs text-slate-500">
                Set{" "}
                <code className="rounded bg-slate-100 px-1 dark:bg-slate-900">
                  NEXT_PUBLIC_GITHUB_REPO
                </code>{" "}
                for edit links.
              </p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
