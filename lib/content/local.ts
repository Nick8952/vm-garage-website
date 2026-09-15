import "server-only";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import type { Baustein, Bewertung, Bild, Einstellungen, Inhaltsquelle, Leistung, Rechtstext, Seite } from "./types";

/**
 * Lokale Inhaltsquelle: liest die JSON-Dateien in data/.
 *
 * Die Dateien sind bewusst wie Sanity-Dokumente aufgebaut (gleiche Feldnamen, Bausteine mit
 * _type/_key, Rich Text als Portable Text). Bilder werden per Kennung referenziert
 * (`{ "bild": "fassade-weststrasse", "alt": "…" }`) und über data/bilder.json aufgelöst,
 * das `npm run bilder` erzeugt.
 */

const DATA = path.resolve(process.cwd(), "data");

interface BildEintrag {
  id: string;
  breite: number;
  hoehe: number;
  quellen: { breite: number; url: string }[];
}
interface BildReferenz {
  bild: string;
  alt: string;
  bildunterschrift?: string;
}

async function json<T>(datei: string): Promise<T> {
  const text = await readFile(path.join(DATA, datei), "utf8");
  return JSON.parse(text) as T;
}
/** Nur «Datei fehlt» ist ein erwarteter Fall; kaputtes JSON soll den Build laut abbrechen. */
const fehltNur = (err: unknown) => (err as NodeJS.ErrnoException)?.code === "ENOENT";

let bilderCache: Record<string, BildEintrag> | undefined;
async function bilder(): Promise<Record<string, BildEintrag>> {
  bilderCache ??= await json<Record<string, BildEintrag>>("bilder.json");
  return bilderCache;
}

async function bild(ref: BildReferenz | undefined, kontext: string): Promise<Bild | undefined> {
  if (!ref) return undefined;
  const eintrag = (await bilder())[ref.bild];
  if (!eintrag) throw new Error(`Bild «${ref.bild}» (${kontext}) fehlt in data/bilder.json – \`npm run bilder\` ausführen?`);
  if (typeof ref.alt !== "string") throw new Error(`Bild «${ref.bild}» (${kontext}) hat keinen Alt-Text.`);
  return { id: eintrag.id, alt: ref.alt, breite: eintrag.breite, hoehe: eintrag.hoehe, bildunterschrift: ref.bildunterschrift, quellen: eintrag.quellen };
}
async function bildPflicht(ref: BildReferenz, kontext: string): Promise<Bild> {
  const b = await bild(ref, kontext);
  if (!b) throw new Error(`Pflichtbild fehlt: ${kontext}`);
  return b;
}

/* ---------- Rohformen der JSON-Dateien ---------- */
type RohEinstellungen = Omit<Einstellungen, "seo"> & { seo: Omit<Einstellungen["seo"], "bild"> & { bild?: BildReferenz } };
type RohBaustein =
  | (Omit<Extract<Baustein, { _type: "leistungenBaustein" }>, "leistungen"> & { leistungen?: string[] })
  | (Omit<Extract<Baustein, { _type: "bewertungenBaustein" }>, "bewertungen"> & { bewertungen?: string[] })
  | (Omit<Extract<Baustein, { _type: "bildBaustein" }>, "bild"> & { bild: BildReferenz })
  | (Omit<Extract<Baustein, { _type: "rechtstextBaustein" }>, "rechtstext"> & { rechtstext: Rechtstext["art"] })
  | Extract<Baustein, { _type: "textBaustein" | "faktenBaustein" | "spaltenBaustein" | "kontaktBaustein" | "aufrufBaustein" }>;
type RohSeite = Omit<Seite, "bausteine"> & { bausteine: RohBaustein[] };

async function leistungen(): Promise<Leistung[]> {
  const liste = await json<Leistung[]>("leistungen.json");
  return [...liste].sort((a, b) => a.reihenfolge - b.reihenfolge);
}

async function bewertungen(): Promise<Bewertung[]> {
  const liste = await json<Bewertung[]>("bewertungen.json");
  return [...liste].sort((a, b) => a.reihenfolge - b.reihenfolge);
}

async function rechtstext(art: Rechtstext["art"]): Promise<Rechtstext | null> {
  try {
    return await json<Rechtstext>(`rechtstexte/${art}.json`);
  } catch (err) {
    if (fehltNur(err)) return null;
    throw err;
  }
}

async function baustein(roh: RohBaustein, seite: string): Promise<Baustein> {
  const ort = `Seite ${seite}, Baustein ${roh._key}`;
  switch (roh._type) {
    case "leistungenBaustein": {
      const alle = await leistungen();
      const auswahl = roh.leistungen?.length ? alle.filter((l) => roh.leistungen!.includes(l.id)) : alle;
      return { ...roh, leistungen: auswahl };
    }
    case "bewertungenBaustein": {
      const alle = await bewertungen();
      const auswahl = roh.bewertungen?.length ? alle.filter((b) => roh.bewertungen!.includes(b.id)) : alle;
      return { ...roh, bewertungen: auswahl };
    }
    case "bildBaustein":
      return { ...roh, bild: await bildPflicht(roh.bild, ort) };
    case "rechtstextBaustein": {
      const text = await rechtstext(roh.rechtstext);
      if (!text) throw new Error(`Rechtstext «${roh.rechtstext}» fehlt (${ort}).`);
      return { ...roh, rechtstext: text };
    }
    default:
      return roh;
  }
}

export const lokaleQuelle: Inhaltsquelle = {
  async getEinstellungen() {
    const roh = await json<RohEinstellungen>("einstellungen.json");
    return { ...roh, seo: { ...roh.seo, bild: await bild(roh.seo.bild, "Einstellungen: SEO-Bild") } };
  },

  async getSeite(slug) {
    let roh: RohSeite;
    try {
      roh = await json<RohSeite>(`seiten/${slug}.json`);
    } catch (err) {
      if (fehltNur(err)) return null;
      throw err;
    }
    return { ...roh, bausteine: await Promise.all(roh.bausteine.map((b) => baustein(b, slug))) };
  },

  async getAlleSeitenSlugs() {
    const dateien = await readdir(path.join(DATA, "seiten"));
    return dateien.filter((d) => d.endsWith(".json")).map((d) => d.replace(/\.json$/, ""));
  },

  getLeistungen: leistungen,
  getBewertungen: bewertungen,
  getRechtstext: rechtstext,
};
