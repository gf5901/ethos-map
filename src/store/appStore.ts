import { create } from "zustand";
import type { AxiomReachabilityMap, CompiledGraph, SearchIndexRecord } from "@/lib/types";

export type ZoomBand = "macro" | "meso" | "micro";

type AppState = {
  graph: CompiledGraph | null;
  searchRecords: SearchIndexRecord[];
  reachability: AxiomReachabilityMap;
  selectedNodeId: string | null;
  selectedAxiomSetId: string | null;
  highlightedNodeIds: string[] | null;
  zoomBand: ZoomBand;
  theme: "light" | "dark";
  setGraph: (g: CompiledGraph) => void;
  setSearchRecords: (r: SearchIndexRecord[]) => void;
  setReachability: (r: AxiomReachabilityMap) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedAxiomSetId: (id: string | null) => void;
  setHighlightedNodeIds: (ids: string[] | null) => void;
  setZoomBand: (z: ZoomBand) => void;
  setTheme: (t: "light" | "dark") => void;
};

export const useAppStore = create<AppState>((set) => ({
  graph: null,
  searchRecords: [],
  reachability: {},
  selectedNodeId: null,
  selectedAxiomSetId: null,
  highlightedNodeIds: null,
  zoomBand: "meso",
  theme: "light",
  setGraph: (graph) => set({ graph }),
  setSearchRecords: (searchRecords) => set({ searchRecords }),
  setReachability: (reachability) => set({ reachability }),
  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
  setSelectedAxiomSetId: (selectedAxiomSetId) => set({ selectedAxiomSetId }),
  setHighlightedNodeIds: (highlightedNodeIds) => set({ highlightedNodeIds }),
  setZoomBand: (zoomBand) => set({ zoomBand }),
  setTheme: (theme) => set({ theme }),
}));
