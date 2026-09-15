/**
 * Einziger Ort, an dem der GitHub-Pages-Unterpfad vor Datei-URLs gesetzt wird.
 * `next/link` erledigt das für Seitenlinks selbst; Bilder, Downloads und
 * CSS-Hintergründe brauchen diesen Helfer. Absolute URLs (Sanity-CDN) bleiben unverändert.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetUrl(pfad: string): string {
  if (/^(https?:)?\/\//.test(pfad) || pfad.startsWith("data:")) return pfad;
  if (!pfad.startsWith("/")) return `${basePath}/${pfad}`;
  return `${basePath}${pfad}`;
}

/** Interne Links: «/» und «/kontakt» bleiben; externe/Sonder-Links werden erkannt. */
export function istExternerLink(ziel: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(ziel);
}
