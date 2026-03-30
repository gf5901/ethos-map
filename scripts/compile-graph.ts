import fs from "node:fs";
import path from "node:path";
import dagre from "dagre";
import type {
  AxiomReachabilityMap,
  CompiledFlowEdge,
  CompiledFlowNode,
  CompiledGraph,
  EthosNode,
  GraphEdge,
  SearchIndexRecord,
} from "../src/lib/types";

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public/data");

const NODE_W = 280;
const NODE_H = 120;

function loadJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function listJsonFiles(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(dir, f));
}

function buildJurisdictionNameMap(): Map<string, string> {
  const map = new Map<string, string>();
  const files = listJsonFiles(path.join(ROOT, "data/jurisdictions"));
  for (const f of files) {
    const j = loadJson<{ id: string; name: string }>(f);
    map.set(j.id, j.name);
  }
  return map;
}

function enrichNode(
  node: EthosNode,
  jurisdictionNames: Map<string, string>
): EthosNode & { jurisdictionNames: string[] } {
  const names = node.jurisdictions?.map((j) => jurisdictionNames.get(j.id) ?? j.id) ?? [];
  return { ...node, jurisdictionNames: names };
}

function computeReachability(
  axiomIds: string[],
  edges: GraphEdge[]
): { reachable: Set<string> } {
  const adj = new Map<string, string[]>();
  for (const e of edges) {
    if (!adj.has(e.from)) adj.set(e.from, []);
    adj.get(e.from)!.push(e.to);
  }
  const reachable = new Set<string>();
  const q = [...axiomIds];
  for (const id of axiomIds) reachable.add(id);
  while (q.length) {
    const n = q.shift()!;
    for (const w of adj.get(n) ?? []) {
      if (!reachable.has(w)) {
        reachable.add(w);
        q.push(w);
      }
    }
  }
  return { reachable };
}

function computeTension(reachable: Set<string>, edges: GraphEdge[]): Set<string> {
  const tension = new Set<string>();
  for (const e of edges) {
    if (e.type !== "contradicts") continue;
    if (reachable.has(e.from) && !reachable.has(e.to)) tension.add(e.to);
    if (reachable.has(e.to) && !reachable.has(e.from)) tension.add(e.from);
  }
  return tension;
}

function main(): void {
  const jurisdictionNames = buildJurisdictionNameMap();
  const nodeFiles = listJsonFiles(path.join(ROOT, "data/nodes"));
  const nodes: EthosNode[] = nodeFiles.map((f) => loadJson<EthosNode>(f));

  const edgeFile = loadJson<{ edges: GraphEdge[] }>(
    path.join(ROOT, "data/edges/edges.json")
  );
  const rawEdges = edgeFile.edges;

  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB", nodesep: 60, ranksep: 100, marginx: 40, marginy: 40 });
  g.setDefaultEdgeLabel(() => ({}));

  for (const n of nodes) {
    g.setNode(n.id, { width: NODE_W, height: NODE_H });
  }
  for (const e of rawEdges) {
    g.setEdge(e.from, e.to);
  }
  dagre.layout(g);

  const flowNodes: CompiledFlowNode[] = nodes.map((n) => {
    const pos = g.node(n.id);
    const x = pos.x - NODE_W / 2;
    const y = pos.y - NODE_H / 2;
    return {
      id: n.id,
      type: "ethos",
      position: { x, y },
      data: enrichNode(n, jurisdictionNames),
    };
  });

  const flowEdges: CompiledFlowEdge[] = rawEdges.map((e) => ({
    id: e.id,
    source: e.from,
    target: e.to,
    type: "ethos",
    data: { edgeType: e.type, strength: e.strength },
  }));

  const compiled: CompiledGraph = {
    version: 1,
    generatedAt: new Date().toISOString(),
    nodes: flowNodes,
    edges: flowEdges,
  };

  const searchRecords: SearchIndexRecord[] = nodes.map((n) => ({
    id: n.id,
    name: n.name,
    description: n.description,
    ...(n.plainSummary ? { plainSummary: n.plainSummary } : {}),
    ...(n.whyRoot ? { whyRoot: n.whyRoot } : {}),
    type: n.type,
    tags: n.tags,
    jurisdictionNames:
      n.jurisdictions?.map((j) => jurisdictionNames.get(j.id) ?? j.id) ?? [],
  }));

  const axiomSetFiles = listJsonFiles(path.join(ROOT, "data/axiom-sets"));
  const reachability: AxiomReachabilityMap = {};
  for (const f of axiomSetFiles) {
    const set = loadJson<{ id: string; axiomIds: string[] }>(f);
    const { reachable } = computeReachability(set.axiomIds, rawEdges);
    const tension = computeTension(reachable, rawEdges);
    reachability[set.id] = {
      reachable: [...reachable],
      tension: [...tension],
    };
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUT_DIR, "graph.json"),
    JSON.stringify(compiled, null, 0),
    "utf8"
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "search-index.json"),
    JSON.stringify(searchRecords, null, 0),
    "utf8"
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "axiom-reachability.json"),
    JSON.stringify(reachability, null, 0),
    "utf8"
  );

  const axiomSetMeta = axiomSetFiles.map((f) => {
    const j = loadJson<{ id: string; name: string; description: string }>(f);
    return { id: j.id, name: j.name, description: j.description };
  });
  fs.writeFileSync(
    path.join(OUT_DIR, "axiom-sets.json"),
    JSON.stringify(axiomSetMeta, null, 0),
    "utf8"
  );

  console.log(
    `Wrote ${compiled.nodes.length} nodes, ${compiled.edges.length} edges to ${OUT_DIR}`
  );
}

main();
