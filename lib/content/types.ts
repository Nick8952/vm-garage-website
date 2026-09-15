/**
 * Gemeinsame Inhaltsstruktur der Website «V & M Garage GmbH».
 *
 * Diese Typen sind die Schnittstelle zwischen Inhaltsquelle und Darstellung:
 * - lib/content/local.ts  liefert sie aus data/*.json (GitHub-Pages-Demo, JETZT)
 * - lib/content/sanity.ts liefert sie aus Sanity (SPÄTER, Vercel)
 * Seitenkomponenten kennen nur diese Typen, nie die Quelle.
 *
 * Feldnamen sind deutsch und decken sich 1:1 mit den Sanity-Schemas in sanity/schemas/.
 */
import type { PortableTextBlock } from "@portabletext/types";

export type RichText = PortableTextBlock[];

/** Fertig aufbereitetes Bild – beide Provider liefern dieselbe Form. */
export interface Bild {
  /** Stabile Kennung (lokal: Schlüssel in data/bilder.json; Sanity: Asset-ID) */
  id: string;
  alt: string;
  breite: number;
  hoehe: number;
  /** Sichtbare Bildunterschrift, z. B. Herkunft/Jahr eines Archivbilds */
  bildunterschrift?: string;
  /** Renditions aufsteigend nach Breite; `url` ist absolut (Sanity) oder wurzelrelativ ohne Unterpfad (lokal). */
  quellen: { breite: number; url: string }[];
}

export interface Link {
  titel: string;
  /** Interner Pfad («/kontakt»), externe URL (https://…), tel: oder mailto: */
  ziel: string;
  extern?: boolean;
}

export interface Adresse {
  strasse: string;
  plz: string;
  ort: string;
  land?: string;
}

/** Ein Eintrag der Öffnungszeiten – bleibt in der Demo leer, weil keine aktuellen Zeiten belegt sind. */
export interface Oeffnungszeit {
  _key: string;
  tage: string;
  zeiten: string;
}

export interface Einstellungen {
  firmenname: string;
  /** Kurzform für Kopfzeile / Browser-Titel */
  kurzname: string;
  /** Kurze Positionierung unter dem Namen (Kopfzeile, Open Graph) */
  claim?: string;
  geschaeftsfuehrung?: string;
  gegruendet?: number;
  adresse: Adresse;
  telefon: string;
  /** Nur setzen, wenn die Adresse verifiziert ist – dann wechselt das Anfrageformular auf «E-Mail vorbereiten». */
  email?: string;
  uid?: string;
  /** Leer = «Öffnungszeiten bitte telefonisch erfragen» */
  oeffnungszeiten: Oeffnungszeit[];
  /** Externer Routenlink (z. B. Google Maps) – wird nur als Link geöffnet, nie eingebettet. */
  routenlink?: string;
  navigation: Link[];
  rechtslinks: Link[];
  seo: { titelZusatz: string; beschreibung: string; bild?: Bild };
  /** Hinweis auf jeder Seite, dass es sich um eine Demo handelt */
  demoHinweis?: string;
}

export type LeistungsGruppe = "werkstatt" | "carrosserie" | "handel";

export const GRUPPEN_TITEL: Record<LeistungsGruppe, string> = {
  werkstatt: "Werkstatt",
  carrosserie: "Carrosserie",
  handel: "Handel & Teile",
};

export interface Leistung {
  id: string;
  titel: string;
  /** Ein Satz, was die Leistung umfasst */
  kurz: string;
  /** Ausführlicher Text für die Leistungsseite (optional) */
  inhalt?: RichText;
  gruppe: LeistungsGruppe;
  reihenfolge: number;
}

export interface Rechtstext {
  id: string;
  art: "impressum" | "datenschutz";
  titel: string;
  stand?: string;
  inhalt: RichText;
}

/* ------------------------------------------------------------------ */
/* Seitenbausteine (Page-Builder)                                       */
/* ------------------------------------------------------------------ */

interface BausteinBasis {
  _key: string;
  /** Kleine Zeile über dem Titel (Etikett) */
  kurzzeile?: string;
  titel?: string;
}

export interface TextBaustein extends BausteinBasis {
  _type: "textBaustein";
  inhalt: RichText;
  breite?: "schmal" | "normal";
}

export interface LeistungenBaustein extends BausteinBasis {
  _type: "leistungenBaustein";
  einleitung?: string;
  /** «blatt» = vollständiges Auftragsblatt mit Gruppen; «kompakt» = Kurzliste (Startseite) */
  darstellung: "blatt" | "kompakt";
  /** Leer = alle Leistungen */
  leistungen: Leistung[];
  weiterLink?: Link;
}

export interface FaktenBaustein extends BausteinBasis {
  _type: "faktenBaustein";
  fakten: { _key: string; bezeichnung: string; wert: string }[];
}

export interface SpaltenBaustein extends BausteinBasis {
  _type: "spaltenBaustein";
  spalten: { _key: string; titel: string; inhalt: RichText }[];
}

export interface BildBaustein extends BausteinBasis {
  _type: "bildBaustein";
  bild: Bild;
  text?: string;
}

export interface KontaktBaustein extends BausteinBasis {
  _type: "kontaktBaustein";
  einleitung?: string;
  /** Anfrage-Assistent anzeigen (bereitet nur Text vor, versendet nichts) */
  mitFormular: boolean;
  formularHinweis?: string;
}

export interface AufrufBaustein extends BausteinBasis {
  _type: "aufrufBaustein";
  text?: string;
  knopf: Link;
  zweiterKnopf?: Link;
}

export interface RechtstextBaustein extends BausteinBasis {
  _type: "rechtstextBaustein";
  rechtstext: Rechtstext;
}

export type Baustein =
  | TextBaustein
  | LeistungenBaustein
  | FaktenBaustein
  | SpaltenBaustein
  | BildBaustein
  | KontaktBaustein
  | AufrufBaustein
  | RechtstextBaustein;

export const BAUSTEIN_TYPEN: Baustein["_type"][] = [
  "textBaustein",
  "leistungenBaustein",
  "faktenBaustein",
  "spaltenBaustein",
  "bildBaustein",
  "kontaktBaustein",
  "aufrufBaustein",
  "rechtstextBaustein",
];

export interface Hero {
  kurzzeile?: string;
  /** Text auf dem roten Schriftband */
  titel: string;
  text?: string;
  knopf?: Link;
  zweiterKnopf?: Link;
}

export interface Seite {
  id: string;
  /** «start» für die Startseite, sonst URL-Segment */
  slug: string;
  titel: string;
  /** Kurze Einleitung unter dem Seitentitel (Unterseiten) */
  einleitung?: string;
  seoTitel?: string;
  seoBeschreibung?: string;
  /** Nur Startseite: Schriftband-Hero */
  hero?: Hero;
  bausteine: Baustein[];
}

/** Vertrag, den jede Inhaltsquelle erfüllt. Alle Funktionen sind asynchron, damit Sanity später ohne Umbau passt. */
export interface Inhaltsquelle {
  getEinstellungen(): Promise<Einstellungen>;
  getSeite(slug: string): Promise<Seite | null>;
  getAlleSeitenSlugs(): Promise<string[]>;
  getLeistungen(): Promise<Leistung[]>;
  getRechtstext(art: Rechtstext["art"]): Promise<Rechtstext | null>;
}
