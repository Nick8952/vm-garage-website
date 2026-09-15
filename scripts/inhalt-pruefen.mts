/**
 * Prüft die lokalen Inhaltsdateien (data/) auf Vollständigkeit – läuft ohne Sanity.
 *   npm run inhalt:pruefen
 * Meldet fehlende Bilder, fehlende Alt-Texte, doppelte Slugs/_keys, unbekannte Bausteine,
 * unbekannte Leistungs-IDs, fehlende Rechtstexte und interne Links auf nicht vorhandene Seiten.
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const DATA = path.resolve(process.cwd(), "data");
const json = async <T,>(p: string): Promise<T> => JSON.parse(await readFile(path.join(DATA, p), "utf8")) as T;
const fehler: string[] = [];
const bilder = await json<Record<string, unknown>>("bilder.json");
const BAUSTEINE = new Set(["textBaustein", "leistungenBaustein", "faktenBaustein", "spaltenBaustein", "bildBaustein", "kontaktBaustein", "aufrufBaustein", "rechtstextBaustein"]);
const GRUPPEN = new Set(["werkstatt", "carrosserie", "handel"]);
// Gleiche Regel wie lib/assets.ts#istErlaubtesLinkziel
const linkErlaubt = (z: string) => /^\/(?!\/)/.test(z) || /^(https?:\/\/[^\s]+|mailto:[^\s]+|tel:\+?[\d\s()-]+)$/.test(z);

function bildPruefen(ref: { bild?: string; alt?: string } | undefined, ort: string) {
  if (!ref) return;
  if (!ref.bild || !bilder[ref.bild]) fehler.push(`${ort}: Bild «${ref.bild}» fehlt in bilder.json`);
  if (typeof ref.alt !== "string") fehler.push(`${ort}: Alt-Text fehlt`);
}

const leistungen = await json<{ id: string; titel: string; kurz: string; gruppe: string; reihenfolge: number }[]>("leistungen.json");
const leistungsIds = new Set<string>();
for (const l of leistungen) {
  if (leistungsIds.has(l.id)) fehler.push(`Leistung ${l.id}: doppelte ID`);
  leistungsIds.add(l.id);
  if (!GRUPPEN.has(l.gruppe)) fehler.push(`Leistung ${l.id}: unbekannte Gruppe «${l.gruppe}»`);
  if (!l.titel || !l.kurz) fehler.push(`Leistung ${l.id}: Titel/Kurztext fehlt`);
  if (typeof l.reihenfolge !== "number") fehler.push(`Leistung ${l.id}: Reihenfolge fehlt`);
}

const seiten = (await readdir(path.join(DATA, "seiten"))).filter((f) => f.endsWith(".json"));
const slugs = new Set<string>();
const interneLinks: [string, string][] = [];
const linkSammeln = (ziel: unknown, ort: string) => {
  if (typeof ziel !== "string") return;
  if (!linkErlaubt(ziel)) fehler.push(`${ort}: unzulässiges Linkziel «${ziel}»`);
  if (ziel.startsWith("/")) interneLinks.push([ziel.replace(/\/$/, "").split("?")[0] || "/", ort]);
};
const pflicht = (b: Record<string, unknown>, felder: string[], ort: string) => {
  for (const f of felder) if (b[f] === undefined || b[f] === null || b[f] === "") fehler.push(`${ort}: Pflichtfeld «${f}» fehlt`);
};
function richTextLinks(inhalt: unknown, ort: string) {
  for (const block of (inhalt as { markDefs?: { href?: string }[] }[]) ?? []) for (const m of block.markDefs ?? []) linkSammeln(m.href, ort);
}

for (const f of seiten) {
  const s = await json<Record<string, unknown>>(`seiten/${f}`);
  const slug = s.slug as string;
  if (slugs.has(slug)) fehler.push(`Doppelter Slug: ${slug}`);
  slugs.add(slug);
  if (`${slug}.json` !== f) fehler.push(`${f}: Dateiname passt nicht zum Slug «${slug}»`);
  if (!s.titel) fehler.push(`${slug}: Titel fehlt`);
  const hero = s.hero as Record<string, unknown> | undefined;
  if (hero) for (const k of ["knopf", "zweiterKnopf"]) linkSammeln((hero[k] as { ziel?: string } | undefined)?.ziel, `${slug} hero`);
  const keys = new Set<string>();
  for (const b of (s.bausteine as Record<string, unknown>[]) ?? []) {
    const ort = `${slug} › ${b._key}`;
    if (!BAUSTEINE.has(b._type as string)) fehler.push(`${ort}: unbekannter Baustein «${b._type}»`);
    if (!b._key) fehler.push(`${slug}: Baustein ohne _key`);
    if (keys.has(b._key as string)) fehler.push(`${ort}: doppelter _key`);
    keys.add(b._key as string);
    if ("bild" in b) bildPruefen(b.bild as never, ort);
    if ("inhalt" in b) richTextLinks(b.inhalt, ort);
    if (b._type === "textBaustein") pflicht(b, ["inhalt"], ort);
    if (b._type === "bildBaustein") pflicht(b, ["bild"], ort);
    if (b._type === "aufrufBaustein") pflicht(b, ["knopf"], ort);
    if (b._type === "kontaktBaustein" && typeof b.mitFormular !== "boolean") fehler.push(`${ort}: mitFormular muss true/false sein`);
    if (b._type === "leistungenBaustein" && !["blatt", "kompakt"].includes(b.darstellung as string)) fehler.push(`${ort}: darstellung muss «blatt» oder «kompakt» sein`);
    if (b._type === "spaltenBaustein") {
      const spalten = (b.spalten as { _key?: string; titel?: string; inhalt?: unknown }[] | undefined) ?? [];
      if (!spalten.length || spalten.length > 3) fehler.push(`${ort}: 1–3 Spalten nötig`);
      const sk = new Set<string>();
      for (const sp of spalten) {
        if (!sp._key || sk.has(sp._key)) fehler.push(`${ort}: Spalten-_key fehlt oder doppelt`);
        sk.add(sp._key ?? "");
        if (!sp.titel || !sp.inhalt) fehler.push(`${ort}: Spalte ohne Titel/Inhalt`);
        richTextLinks(sp.inhalt, ort);
      }
    }
    if (b._type === "faktenBaustein") {
      const fk = new Set<string>();
      for (const f of (b.fakten as { _key?: string; bezeichnung?: string; wert?: string }[] | undefined) ?? []) {
        if (!f._key || fk.has(f._key)) fehler.push(`${ort}: Fakten-_key fehlt oder doppelt`);
        fk.add(f._key ?? "");
        if (!f.bezeichnung || !f.wert) fehler.push(`${ort}: Faktum ohne Bezeichnung/Wert`);
      }
    }
    if (b._type === "leistungenBaustein") for (const id of (b.leistungen as string[]) ?? []) if (!leistungsIds.has(id)) fehler.push(`${ort}: Leistung «${id}» existiert nicht`);
    if (b._type === "faktenBaustein" && !((b.fakten as unknown[])?.length)) fehler.push(`${ort}: keine Fakten`);
    for (const k of ["knopf", "zweiterKnopf", "weiterLink"]) linkSammeln((b[k] as { ziel?: string } | undefined)?.ziel, ort);
    if (b._type === "rechtstextBaustein") {
      try { await readFile(path.join(DATA, `rechtstexte/${b.rechtstext}.json`)); } catch { fehler.push(`${ort}: Rechtstext «${b.rechtstext}» fehlt`); }
    }
  }
}
const e = await json<Record<string, unknown>>("einstellungen.json");
bildPruefen((e.seo as { bild?: never }).bild, "Einstellungen SEO-Bild");
for (const k of ["firmenname", "kurzname", "telefon"]) if (!e[k]) fehler.push(`Einstellungen: ${k} fehlt`);
for (const l of [...(e.navigation as { ziel: string }[]), ...(e.rechtslinks as { ziel: string }[])]) linkSammeln(l.ziel, "Einstellungen");
for (const t of await readdir(path.join(DATA, "rechtstexte"))) richTextLinks((await json<{ inhalt: unknown }>(`rechtstexte/${t}`)).inhalt, `Rechtstext ${t}`);

for (const [ziel, ort] of interneLinks) {
  const slug = ziel === "/" ? "start" : ziel.slice(1).split("#")[0];
  if (!slugs.has(slug)) fehler.push(`${ort}: interner Link «${ziel}» zeigt auf keine Seite`);
}

if (fehler.length) {
  console.error(`✗ ${fehler.length} Problem(e):\n` + fehler.map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}
console.log(`✓ Inhalte in Ordnung: ${seiten.length} Seiten, ${leistungen.length} Leistungen, ${Object.keys(bilder).length} Bild(er), ${interneLinks.length} interne Links geprüft.`);
