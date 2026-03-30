/** Source node JSON shape (subset for app use) */
export type NodeType =
  | "axiom"
  | "principle"
  | "legal-concept"
  | "statute"
  | "proposed-law";

export type EthosNode = {
  id: string;
  type: NodeType;
  name: string;
  /** Plain-language summary; when set, UI shows this above `description`. */
  plainSummary?: string;
  /** Why this is a root (or why it matters); first-principles motivation in plain language. */
  whyRoot?: string;
  description: string;
  year?: number;
  tags: string[];
  foundationStrength?: number;
  foundationStrengthRationale?: string;
  pros?: {
    claim: string;
    evidence: string;
    citations: string[];
  }[];
  cons?: {
    claim: string;
    evidence: string;
    citations: string[];
  }[];
  jurisdictions?: {
    id: string;
    status: string;
    date?: string;
    citation?: string;
  }[];
  citations: Record<
    string,
    {
      title: string;
      type: string;
      year?: number;
      url?: string;
    }
  >;
  createdAt: string;
  updatedAt: string;
};

export type GraphEdge = {
  id: string;
  from: string;
  to: string;
  type: string;
  strength: string;
};

export type CompiledFlowNode = {
  id: string;
  type: "ethos";
  position: { x: number; y: number };
  data: EthosNode & { jurisdictionNames: string[] };
};

export type CompiledFlowEdge = {
  id: string;
  source: string;
  target: string;
  type: "ethos";
  data: { edgeType: string; strength: string };
};

export type CompiledGraph = {
  version: 1;
  generatedAt: string;
  nodes: CompiledFlowNode[];
  edges: CompiledFlowEdge[];
};

export type SearchIndexRecord = {
  id: string;
  name: string;
  description: string;
  plainSummary?: string;
  whyRoot?: string;
  type: NodeType;
  tags: string[];
  jurisdictionNames: string[];
};

export type AxiomReachabilityMap = Record<
  string,
  { reachable: string[]; tension: string[] }
>;
