import "server-only";
import { defineQuery } from "next-sanity";
import { client, vorschauClient } from "@/sanity/client";
import { sanityPruefen } from "@/sanity/env";
import { BILD_PROJEKTION, sanityBild, type SanityBildRoh } from "@/sanity/bild";
import { istVorschau } from "@/lib/vorschau/status";
import type { Baustein, Einstellungen, Inhaltsquelle, Leistung, Rechtstext, Seite } from "./types";

/**
 * Sanity-Inhaltsquelle (für Vercel). Liefert exakt dieselben Typen wie lib/content/local.ts.
 *
 * Cache-Strategie: veröffentlichte Inhalte werden mit dem Tag «inhalt» gecacht und per
 * Webhook (server-routes/app/api/revalidate) invalidiert – ein Tag für alles, weil Listen
 * (Leistungen auf der Startseite) von Einzeldokumenten abhängen. In der Entwurfsvorschau
 * (Draft Mode) wird ungecacht mit Perspektive «drafts» gelesen.
 *
 * Status: VORBEREITET – erst nach Anlegen eines Sanity-Projekts überprüfbar.
 */
export const INHALT_TAG = "inhalt";

async function abfrage<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  sanityPruefen();
  const vorschau = await istVorschau();
  const c = vorschau ? vorschauClient() : client;
  return c.fetch<T>(query, params, vorschau ? { cache: "no-store" } : { next: { revalidate: false, tags: [INHALT_TAG] } });
}

const LINK = `{ titel, ziel, extern }`;
const LEISTUNG = `{ "id": _id, titel, kurz, inhalt, gruppe, reihenfolge }`;
const RECHTSTEXT = `{ "id": _id, art, titel, stand, inhalt }`;

const BAUSTEINE = `bausteine[] {
  _key, _type, kurzzeile, titel,
  _type == "textBaustein" => { inhalt, breite },
  _type == "leistungenBaustein" => {
    einleitung, darstellung, weiterLink ${LINK},
    "leistungen": select(
      coalesce(count(leistungen), 0) > 0 => leistungen[]-> ${LEISTUNG},
      *[_type == "leistung"] | order(reihenfolge asc) ${LEISTUNG}
    )
  },
  _type == "faktenBaustein" => { fakten[] { _key, bezeichnung, wert } },
  _type == "spaltenBaustein" => { spalten[] { _key, titel, inhalt } },
  _type == "bildBaustein" => { text, bild ${BILD_PROJEKTION} },
  _type == "kontaktBaustein" => { einleitung, mitFormular, formularHinweis },
  _type == "aufrufBaustein" => { text, knopf ${LINK}, zweiterKnopf ${LINK} },
  _type == "rechtstextBaustein" => { rechtstext-> ${RECHTSTEXT} }
}`;

const EINSTELLUNGEN_QUERY = defineQuery(`*[_type == "einstellungen"][0] {
  firmenname, kurzname, claim, geschaeftsfuehrung, gegruendet, adresse, telefon, email, uid, routenlink, demoHinweis,
  oeffnungszeiten[] { _key, tage, zeiten },
  navigation[] ${LINK},
  rechtslinks[] ${LINK},
  seo { titelZusatz, beschreibung, bild ${BILD_PROJEKTION} }
}`);

const SEITE_QUERY = defineQuery(`*[_type == "seite" && slug.current == $slug][0] {
  "id": _id, "slug": slug.current, titel, einleitung, seoTitel, seoBeschreibung,
  hero { kurzzeile, titel, text, knopf ${LINK}, zweiterKnopf ${LINK} },
  ${BAUSTEINE}
}`);

type Roh = Record<string, unknown>;
const bildAus = (o: unknown, alt = "") => sanityBild(o as SanityBildRoh | undefined, alt);

function leistungAufbereiten(l: Roh): Leistung {
  return { ...(l as object), inhalt: (l.inhalt as Leistung["inhalt"]) ?? undefined } as Leistung;
}

function bausteinAufbereiten(b: Roh): Baustein {
  switch (b._type) {
    case "leistungenBaustein":
      // Wie lokal: Auswahl in globaler Reihenfolge, nicht in Auswahlreihenfolge
      return { ...(b as object), leistungen: ((b.leistungen as Roh[]) ?? []).map(leistungAufbereiten).sort((x, y) => x.reihenfolge - y.reihenfolge) } as Baustein;
    case "faktenBaustein":
      return { ...(b as object), fakten: (b.fakten as unknown[]) ?? [] } as Baustein;
    case "spaltenBaustein":
      return { ...(b as object), spalten: (b.spalten as unknown[]) ?? [] } as Baustein;
    case "bildBaustein": {
      const bild = bildAus(b.bild);
      if (!bild) throw new Error(`Sanity: bildBaustein ${b._key} ohne Bild.`);
      return { ...(b as object), bild } as Baustein;
    }
    case "kontaktBaustein":
      return { ...(b as object), mitFormular: Boolean(b.mitFormular) } as Baustein;
    case "rechtstextBaustein":
      if (!b.rechtstext) throw new Error(`Sanity: rechtstextBaustein ${b._key} ohne Rechtstext.`);
      return b as unknown as Baustein;
    default:
      return b as unknown as Baustein;
  }
}

export const sanityQuelle: Inhaltsquelle = {
  async getEinstellungen() {
    const e = await abfrage<Roh | null>(EINSTELLUNGEN_QUERY);
    if (!e) throw new Error("Sanity: Dokument «einstellungen» fehlt – `npm run seed` ausführen.");
    return {
      ...(e as object),
      oeffnungszeiten: (e.oeffnungszeiten as Einstellungen["oeffnungszeiten"]) ?? [],
      navigation: (e.navigation as Einstellungen["navigation"]) ?? [],
      rechtslinks: (e.rechtslinks as Einstellungen["rechtslinks"]) ?? [],
      seo: { ...((e.seo as object) ?? {}), bild: bildAus((e.seo as Roh | undefined)?.bild) },
    } as Einstellungen;
  },

  async getSeite(slug) {
    const s = await abfrage<Roh | null>(SEITE_QUERY, { slug });
    if (!s) return null;
    return { ...(s as object), hero: (s.hero as Seite["hero"]) ?? undefined, bausteine: ((s.bausteine as Roh[]) ?? []).map(bausteinAufbereiten) } as Seite;
  },

  async getAlleSeitenSlugs() {
    return abfrage<string[]>(`*[_type == "seite" && defined(slug.current)].slug.current`);
  },

  async getLeistungen() {
    return (await abfrage<Roh[]>(`*[_type == "leistung"] | order(reihenfolge asc) ${LEISTUNG}`)).map(leistungAufbereiten);
  },

  async getRechtstext(art) {
    return abfrage<Rechtstext | null>(`*[_type == "rechtstext" && art == $art][0] ${RECHTSTEXT}`, { art });
  },
};
