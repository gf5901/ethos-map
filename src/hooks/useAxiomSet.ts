"use client";

import { useAppStore } from "@/store/appStore";

export function useAxiomSetSelection() {
  const selectedAxiomSetId = useAppStore((s) => s.selectedAxiomSetId);
  const setSelectedAxiomSetId = useAppStore((s) => s.setSelectedAxiomSetId);
  return { selectedAxiomSetId, setSelectedAxiomSetId };
}
