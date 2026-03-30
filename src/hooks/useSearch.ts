"use client";

import { useMemo } from "react";
import { createSearch } from "@/lib/search";
import { useAppStore } from "@/store/appStore";

export function useSearchIndex() {
  const records = useAppStore((s) => s.searchRecords);
  return useMemo(() => createSearch(records), [records]);
}
