/** Client-only: call from useEffect or after mount to avoid hydration mismatch. */
export function isApplePlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  const p = navigator.platform ?? "";
  if (/Mac|iPhone|iPad|iPod/.test(p)) return true;
  return /Mac OS|Macintosh/.test(navigator.userAgent);
}
