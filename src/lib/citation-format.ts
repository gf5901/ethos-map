/** Human-readable label for a stored citation `type` (e.g. `case-law` → "Case law"). */
export function formatCitationSourceType(type: string): string {
  return type
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
