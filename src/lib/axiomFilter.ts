import type { AxiomReachabilityMap } from "./types";

export type NodeClassification = "reachable" | "unreachable" | "tension";

export function classifyNode(
  nodeId: string,
  setId: string | null,
  reachability: AxiomReachabilityMap
): NodeClassification {
  if (!setId) return "reachable";
  const entry = reachability[setId];
  if (!entry) return "reachable";
  if (entry.tension.includes(nodeId)) return "tension";
  if (entry.reachable.includes(nodeId)) return "reachable";
  return "unreachable";
}
