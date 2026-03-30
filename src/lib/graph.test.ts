import { describe, expect, it } from "vitest";
import {
  buildAdjacency,
  collectAncestors,
  collectDescendants,
  collectSiblingIds,
  findRootIds,
  orderedAncestorsExcludingSelf,
  orderedDescendantsExcludingSelf,
  sortIdsByName,
} from "./graph";

describe("buildAdjacency", () => {
  it("maps parents and children", () => {
    const { parents, children } = buildAdjacency([
      { from: "a", to: "b" },
      { from: "b", to: "c" },
    ]);
    expect(parents.get("b")).toEqual(["a"]);
    expect(children.get("a")).toEqual(["b"]);
    expect(parents.get("c")).toEqual(["b"]);
  });
});

describe("collectAncestors", () => {
  it("includes all ancestors", () => {
    const parents = new Map<string, string[]>([
      ["b", ["a"]],
      ["c", ["b"]],
    ]);
    const s = collectAncestors("c", parents);
    expect(s.has("c")).toBe(true);
    expect(s.has("b")).toBe(true);
    expect(s.has("a")).toBe(true);
  });
});

describe("collectDescendants", () => {
  it("includes all descendants", () => {
    const children = new Map<string, string[]>([
      ["a", ["b"]],
      ["b", ["c"]],
    ]);
    const s = collectDescendants("a", children);
    expect(s.has("a")).toBe(true);
    expect(s.has("b")).toBe(true);
    expect(s.has("c")).toBe(true);
  });
});

describe("collectSiblingIds", () => {
  it("returns other children of shared parents", () => {
    const { parents, children } = buildAdjacency([
      { from: "root", to: "a" },
      { from: "root", to: "b" },
    ]);
    expect(collectSiblingIds("a", parents, children)).toEqual(["b"]);
    expect(collectSiblingIds("b", parents, children)).toEqual(["a"]);
  });
});

describe("orderedAncestorsExcludingSelf", () => {
  it("orders breadth-first from parents toward roots", () => {
    const parents = new Map<string, string[]>([
      ["c", ["b"]],
      ["b", ["a"]],
    ]);
    expect(orderedAncestorsExcludingSelf("c", parents)).toEqual(["b", "a"]);
  });
});

describe("orderedDescendantsExcludingSelf", () => {
  it("orders breadth-first into the tree", () => {
    const children = new Map<string, string[]>([
      ["a", ["b"]],
      ["b", ["c"]],
    ]);
    expect(orderedDescendantsExcludingSelf("a", children)).toEqual(["b", "c"]);
  });
});

describe("findRootIds", () => {
  it("returns nodes with no parents", () => {
    const { parents } = buildAdjacency([
      { from: "a", to: "b" },
      { from: "c", to: "d" },
    ]);
    const roots = findRootIds(["a", "b", "c", "d", "orphan"], parents);
    expect(new Set(roots)).toEqual(new Set(["a", "c", "orphan"]));
  });
});

describe("sortIdsByName", () => {
  it("sorts by name then id", () => {
    const nameById = new Map([
      ["z", "Zebra"],
      ["a", "Apple"],
      ["m", "Apple"],
    ]);
    expect(sortIdsByName(["z", "a", "m"], nameById)).toEqual(["a", "m", "z"]);
  });
});
