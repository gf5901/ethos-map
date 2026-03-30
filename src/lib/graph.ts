import type { CompiledGraph, GraphEdge } from "./types";

export type Adjacency = {
  parents: Map<string, string[]>;
  children: Map<string, string[]>;
};

export function buildAdjacency(edges: { from: string; to: string }[]): Adjacency {
  const parents = new Map<string, string[]>();
  const children = new Map<string, string[]>();

  const add = (m: Map<string, string[]>, k: string, v: string) => {
    if (!m.has(k)) m.set(k, []);
    m.get(k)!.push(v);
  };

  for (const e of edges) {
    add(parents, e.to, e.from);
    add(children, e.from, e.to);
  }
  return { parents, children };
}

/** All ancestor node ids walking up parent edges (includes start). */
export function collectAncestors(
  startId: string,
  parents: Map<string, string[]>
): Set<string> {
  const out = new Set<string>();
  const q = [startId];
  while (q.length) {
    const id = q.shift()!;
    if (out.has(id)) continue;
    out.add(id);
    for (const p of parents.get(id) ?? []) q.push(p);
  }
  return out;
}

/** All descendant node ids walking down child edges (includes start). */
export function collectDescendants(
  startId: string,
  children: Map<string, string[]>
): Set<string> {
  const out = new Set<string>();
  const q = [startId];
  while (q.length) {
    const id = q.shift()!;
    if (out.has(id)) continue;
    out.add(id);
    for (const c of children.get(id) ?? []) q.push(c);
  }
  return out;
}

/** Other nodes that share at least one parent with `nodeId` (same-depth alternatives). */
export function collectSiblingIds(
  nodeId: string,
  parents: Map<string, string[]>,
  children: Map<string, string[]>
): string[] {
  const sibs = new Set<string>();
  for (const p of parents.get(nodeId) ?? []) {
    for (const c of children.get(p) ?? []) {
      if (c !== nodeId) sibs.add(c);
    }
  }
  return [...sibs];
}

/** Breadth-first order from immediate parents upward (roots last), excluding `nodeId`. */
export function orderedAncestorsExcludingSelf(
  nodeId: string,
  parents: Map<string, string[]>
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  let frontier = [...(parents.get(nodeId) ?? [])];
  while (frontier.length) {
    const next: string[] = [];
    for (const id of frontier) {
      if (seen.has(id)) continue;
      seen.add(id);
      out.push(id);
      for (const p of parents.get(id) ?? []) next.push(p);
    }
    frontier = next;
  }
  return out;
}

/** Breadth-first order into descendants (children first), excluding `nodeId`. */
export function orderedDescendantsExcludingSelf(
  nodeId: string,
  children: Map<string, string[]>
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  let frontier = [...(children.get(nodeId) ?? [])];
  while (frontier.length) {
    const next: string[] = [];
    for (const id of frontier) {
      if (seen.has(id)) continue;
      seen.add(id);
      out.push(id);
      for (const c of children.get(id) ?? []) next.push(c);
    }
    frontier = next;
  }
  return out;
}

export function getAxiomNodeIds(graph: CompiledGraph): string[] {
  return graph.nodes.filter((n) => n.data.type === "axiom").map((n) => n.id);
}

export function rawEdgesFromCompiled(graph: CompiledGraph): GraphEdge[] {
  return graph.edges.map((e) => ({
    id: e.id,
    from: e.source,
    to: e.target,
    type: e.data.edgeType,
    strength: e.data.strength,
  }));
}

/** Node ids with no incoming parent edges (DAG roots). */
export function findRootIds(nodeIds: string[], parents: Map<string, string[]>): string[] {
  return nodeIds.filter((id) => {
    const ps = parents.get(id);
    return !ps || ps.length === 0;
  });
}

/** Stable sort by display name, then id. */
export function sortIdsByName(ids: string[], nameById: Map<string, string>): string[] {
  return [...ids].sort((a, b) => {
    const na = nameById.get(a) ?? a;
    const nb = nameById.get(b) ?? b;
    const cmp = na.localeCompare(nb, undefined, { sensitivity: "base" });
    if (cmp !== 0) return cmp;
    return a.localeCompare(b);
  });
}
