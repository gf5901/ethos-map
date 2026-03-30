import Fuse, { type IFuseOptions } from "fuse.js";
import type { SearchIndexRecord } from "./types";

export const fuseOptions: IFuseOptions<SearchIndexRecord> = {
  keys: [
    { name: "name", weight: 0.35 },
    { name: "plainSummary", weight: 0.1 },
    { name: "whyRoot", weight: 0.1 },
    { name: "description", weight: 0.25 },
    { name: "tags", weight: 0.2 },
    { name: "jurisdictionNames", weight: 0.15 },
  ],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
};

export function createSearch(records: SearchIndexRecord[]) {
  return new Fuse(records, fuseOptions);
}
