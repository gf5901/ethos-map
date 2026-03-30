import fs from "node:fs";
import path from "node:path";
import Ajv2020, { type ErrorObject } from "ajv/dist/2020";
import addFormats from "ajv-formats";

const ROOT = path.resolve(__dirname, "..");

function loadJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function listJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(dir, f));
}

function formatAjvErrors(errors: ErrorObject[] | null | undefined, file: string): string {
  if (!errors?.length) return "";
  return errors.map((e) => `${file}: ${e.instancePath || "/"} ${e.message}`).join("\n");
}

type RawNode = {
  id: string;
  type: string;
  pros?: { citations: string[] }[];
  cons?: { citations: string[] }[];
  citations: Record<string, unknown>;
  jurisdictions?: { id: string }[];
};

type RawEdge = { id: string; from: string; to: string };
type EdgeFile = { edges: RawEdge[] };

function main(): void {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);

  const nodeSchema = loadJson(path.join(ROOT, "data/schema/node.schema.json"));
  const edgeSchema = loadJson(path.join(ROOT, "data/schema/edge.schema.json"));
  const axiomSetSchema = loadJson(path.join(ROOT, "data/schema/axiom-set.schema.json"));
  const jurisdictionSchema = loadJson(
    path.join(ROOT, "data/schema/jurisdiction.schema.json")
  );

  const validateNode = ajv.compile(nodeSchema);
  const validateEdge = ajv.compile(edgeSchema);
  const validateAxiomSet = ajv.compile(axiomSetSchema);
  const validateJurisdiction = ajv.compile(jurisdictionSchema);

  const errors: string[] = [];

  const nodeFiles = listJsonFiles(path.join(ROOT, "data/nodes"));
  const nodesById = new Map<string, RawNode>();

  for (const file of nodeFiles) {
    const data = loadJson(file) as RawNode;
    const base = path.basename(file, ".json");
    if (data.id !== base) {
      errors.push(`${file}: id "${data.id}" must match filename "${base}"`);
    }
    if (!validateNode(data)) {
      errors.push(formatAjvErrors(validateNode.errors, file));
    }
    if (nodesById.has(data.id)) {
      errors.push(`Duplicate node id: ${data.id}`);
    }
    nodesById.set(data.id, data);
  }

  const jurisdictionFiles = listJsonFiles(path.join(ROOT, "data/jurisdictions"));
  const jurisdictionIds = new Set<string>();
  for (const file of jurisdictionFiles) {
    const data = loadJson(file) as { id: string };
    const base = path.basename(file, ".json");
    if (data.id !== base) {
      errors.push(`${file}: id "${data.id}" must match filename "${base}"`);
    }
    if (!validateJurisdiction(data)) {
      errors.push(formatAjvErrors(validateJurisdiction.errors, file));
    }
    jurisdictionIds.add(data.id);
  }

  const axiomSetFiles = listJsonFiles(path.join(ROOT, "data/axiom-sets"));
  const axiomSets: { id: string; axiomIds: string[] }[] = [];
  for (const file of axiomSetFiles) {
    const data = loadJson(file) as { id: string; axiomIds: string[] };
    const base = path.basename(file, ".json");
    if (data.id !== base) {
      errors.push(`${file}: id "${data.id}" must match filename "${base}"`);
    }
    if (!validateAxiomSet(data)) {
      errors.push(formatAjvErrors(validateAxiomSet.errors, file));
    }
    axiomSets.push(data);
  }

  const edgesPath = path.join(ROOT, "data/edges/edges.json");
  if (!fs.existsSync(edgesPath)) {
    errors.push("Missing data/edges/edges.json");
  } else {
    const edgeFile = loadJson(edgesPath) as EdgeFile;
    if (!validateEdge(edgeFile)) {
      errors.push(formatAjvErrors(validateEdge.errors, edgesPath));
    } else {
      const { edges } = edgeFile;
      const edgeIds = new Set<string>();
      for (const e of edges) {
        if (edgeIds.has(e.id)) errors.push(`Duplicate edge id: ${e.id}`);
        edgeIds.add(e.id);
        if (!nodesById.has(e.from)) {
          errors.push(`Edge ${e.id}: from "${e.from}" is not a known node id`);
        }
        if (!nodesById.has(e.to)) {
          errors.push(`Edge ${e.id}: to "${e.to}" is not a known node id`);
        }
      }

      // DAG: Kahn topological sort on directed edges from -> to (dependency flows parent -> child)
      const indegree = new Map<string, number>();
      const adj = new Map<string, string[]>();
      for (const id of nodesById.keys()) {
        indegree.set(id, 0);
        adj.set(id, []);
      }
      for (const e of edges) {
        indegree.set(e.to, (indegree.get(e.to) ?? 0) + 1);
        adj.get(e.from)?.push(e.to);
      }
      const queue: string[] = [];
      for (const [id, d] of indegree) {
        if (d === 0) queue.push(id);
      }
      let visited = 0;
      while (queue.length) {
        const n = queue.shift()!;
        visited++;
        for (const w of adj.get(n) ?? []) {
          const next = (indegree.get(w) ?? 0) - 1;
          indegree.set(w, next);
          if (next === 0) queue.push(w);
        }
      }
      if (visited !== nodesById.size) {
        errors.push(
          "Graph validation failed: cycle detected or disconnected nodes not reachable from roots (expected DAG)."
        );
      }
    }
  }

  for (const [id, node] of nodesById) {
    if (node.type !== "axiom") {
      const pros = node.pros ?? [];
      const cons = node.cons ?? [];
      if (pros.length < 1 || cons.length < 1) {
        errors.push(
          `Node ${id}: non-axiom nodes must have at least one pro and one con (found pros=${pros.length}, cons=${cons.length}).`
        );
      }
    }

    const citeKeys = new Set(Object.keys(node.citations ?? {}));
    const checkArgs = (label: string, args?: { citations: string[] }[]) => {
      for (const a of args ?? []) {
        for (const k of a.citations) {
          if (!citeKeys.has(k)) {
            errors.push(`Node ${id}: ${label} cites unknown key "${k}" in citations`);
          }
        }
      }
    };
    checkArgs("pro", node.pros);
    checkArgs("con", node.cons);

    for (const j of node.jurisdictions ?? []) {
      if (!jurisdictionIds.has(j.id)) {
        errors.push(
          `Node ${id}: jurisdiction id "${j.id}" has no matching jurisdiction file`
        );
      }
    }

    if (
      node.type === "statute" &&
      !(node.jurisdictions && node.jurisdictions.length > 0)
    ) {
      errors.push(`Node ${id}: statute nodes must list at least one jurisdiction entry`);
    }
  }

  for (const set of axiomSets) {
    for (const axiomId of set.axiomIds) {
      const n = nodesById.get(axiomId);
      if (!n) {
        errors.push(`Axiom set ${set.id}: axiom id "${axiomId}" does not exist`);
      } else if (n.type !== "axiom") {
        errors.push(
          `Axiom set ${set.id}: "${axiomId}" must refer to a node of type "axiom"`
        );
      }
    }
  }

  if (errors.length) {
    console.error(`Validation failed:\n${errors.filter(Boolean).join("\n")}`);
    process.exit(1);
  }
  console.log("Data validation passed.");
}

main();
