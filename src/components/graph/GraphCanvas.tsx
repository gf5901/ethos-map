"use client";

import {
  Background,
  Controls,
  type Edge,
  MiniMap,
  type Node,
  type OnMoveEnd,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { Loader2, Maximize2 } from "lucide-react";
import { type MouseEvent, useCallback, useEffect, useMemo } from "react";
import "@xyflow/react/dist/style.css";
import { classifyNode } from "@/lib/axiomFilter";
import type { AxiomReachabilityMap, CompiledGraph } from "@/lib/types";
import type { ZoomBand } from "@/store/appStore";
import { useAppStore } from "@/store/appStore";
import { EdgeLine } from "./EdgeLine";
import { GraphUsageHint } from "./GraphUsageHint";
import { NodeCard } from "./NodeCard";

const nodeTypes = { ethos: NodeCard };
const edgeTypes = { ethos: EdgeLine };

function ResetViewButton() {
  const { fitView } = useReactFlow();
  const onReset = useCallback(() => {
    void fitView({ padding: 0.15, duration: 280 });
  }, [fitView]);

  return (
    <Panel position="top-right" className="m-2">
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        aria-label="Reset view to fit all nodes"
      >
        <Maximize2 className="size-4 shrink-0" aria-hidden />
        Reset view
      </button>
    </Panel>
  );
}

function zoomToBand(z: number): ZoomBand {
  if (z < 0.3) return "macro";
  if (z < 0.7) return "meso";
  return "micro";
}

function toFlowNodes(
  graph: CompiledGraph,
  opts: {
    zoomBand: ZoomBand;
    selectedAxiomSetId: string | null;
    reachability: AxiomReachabilityMap;
    highlightedNodeIds: string[] | null;
    selectedNodeId: string | null;
  }
): Node[] {
  const {
    zoomBand,
    selectedAxiomSetId,
    reachability,
    highlightedNodeIds,
    selectedNodeId,
  } = opts;
  const highlight = new Set(highlightedNodeIds ?? []);

  return graph.nodes.map((n) => {
    const classification = classifyNode(n.id, selectedAxiomSetId, reachability);
    const dimmed = classification === "unreachable";
    const tension = classification === "tension";
    const hl = highlight.has(n.id);

    return {
      id: n.id,
      type: "ethos",
      position: n.position,
      data: { ...n.data, lod: zoomBand },
      selected: selectedNodeId === n.id,
      style: {
        opacity: dimmed ? 0.2 : 1,
        filter: dimmed ? "grayscale(1)" : undefined,
        outline: tension
          ? "2px solid rgb(239 68 68)"
          : hl
            ? "2px solid rgb(14 165 233)"
            : undefined,
        outlineOffset: tension || hl ? 2 : 0,
      },
    };
  });
}

function toFlowEdges(graph: CompiledGraph): Edge[] {
  return graph.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: "ethos",
    data: e.data,
  }));
}

function GraphCanvasInner() {
  const graph = useAppStore((s) => s.graph);
  const selectedAxiomSetId = useAppStore((s) => s.selectedAxiomSetId);
  const reachability = useAppStore((s) => s.reachability);
  const highlightedNodeIds = useAppStore((s) => s.highlightedNodeIds);
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useAppStore((s) => s.setSelectedNodeId);
  const zoomBand = useAppStore((s) => s.zoomBand);
  const setZoomBand = useAppStore((s) => s.setZoomBand);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const snapshot = useMemo(
    () => ({
      selectedAxiomSetId,
      reachability,
      highlightedNodeIds,
      selectedNodeId,
      zoomBand,
    }),
    [selectedAxiomSetId, reachability, highlightedNodeIds, selectedNodeId, zoomBand]
  );

  useEffect(() => {
    if (!graph) return;
    setNodes(toFlowNodes(graph, { ...snapshot }));
    setEdges(toFlowEdges(graph));
  }, [graph, snapshot, setNodes, setEdges]);

  const onMoveEnd: OnMoveEnd = useCallback(
    (_, viewport) => {
      setZoomBand(zoomToBand(viewport.zoom));
    },
    [setZoomBand]
  );

  const onNodeClick = useCallback(
    (_: MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  if (!graph) {
    return (
      <div className="flex h-full min-h-0 flex-1 flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2
          className="size-8 animate-spin text-sky-600 dark:text-sky-400"
          aria-hidden
        />
        <span>Loading graph…</span>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col">
      <div className="relative h-full min-h-0 flex-1">
        <ReactFlow
          className="h-full w-full"
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onMoveEnd={onMoveEnd}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          minZoom={0.05}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          <ResetViewButton />
          <Controls />
          <MiniMap
            nodeStrokeWidth={3}
            zoomable
            pannable
            className="!bg-white/90 dark:!bg-slate-900/90"
          />
        </ReactFlow>
        <div className="pointer-events-none absolute inset-0">
          <GraphUsageHint />
        </div>
      </div>
    </div>
  );
}

export function GraphCanvas() {
  return (
    <ReactFlowProvider>
      <div className="flex h-full min-h-0 flex-1 flex-col">
        <GraphCanvasInner />
      </div>
    </ReactFlowProvider>
  );
}
