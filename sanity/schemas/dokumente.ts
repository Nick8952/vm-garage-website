import { defineField, defineType, defineArrayMember } from "sanity";
import { bausteinMitglieder } from "./bausteine";

const RESERVIERTE_SLUGS = ["studio", "api", "images", "fonts", "_next"];

export const einstellungenTyp = defineType({
  name: "einstellungen",
  title: "Website-Einstellungen",
  type: "document",
  groups: [
    { name: "betrieb", title: "Betrieb", default: true },
    { name: "kontakt", title: "Kontakt & Öffnungszeiten" },
    { name: "navigation", title: "Navigation & Footer" },
    { name: "seo", title: "Suchmaschinen" },
  ],
  fields: [
    defineField({ name: "firmenname", title: "Firmenname", type: "string", group: "betrieb", validation: (r) => r.required() }),
    defineField({ name: "kurzname", title: "Kurzname", type: "string", group: "betrieb", description: "Für Kopfzeile und Browser-Tab, z. B. «V & M Garage».", validation: (r) => r.required().max(40) }),
    defineField({ name: "claim", title: "Kurzbeschreibung", type: "string", group: "betrieb", description: "Ein kurzer Satz unter dem Namen, z. B. «Werkstatt für alle Marken».", validation: (r) => r.max(80) }),
    defineField({ name: "geschaeftsfuehrung", title: "Geschäftsführung", type: "string", group: "betrieb" }),
    defineField({ name: "gegruendet", title: "Gründungsjahr", type: "number", group: "betrieb", validation: (r) => r.integer().min(1900).max(2100) }),
    defineField({ name: "uid", title: "UID", type: "string", group: "betrieb", description: "z. B. CHE-123.456.789", validation: (r) => r.regex(/^CHE-\d{3}\.\d{3}\.\d{3}$/, { name: "UID", invert: false }).warning("Format: CHE-123.456.789") }),
    defineField({ name: "adresse", title: "Adresse", type: "adresse", group: "kontakt", validation: (r) => r.required() }),
    defineField({ name: "telefon", title: "Telefon", type: "string", group: "kontakt", validation: (r) => r.required() }),
    defineField({ name: "email", title: "E-Mail", type: "string", group: "kontakt", description: "Nur eintragen, wenn die Adresse aktiv ist – der Anfrage-Assistent bietet dann «E-Mail vorbereiten» an.", validation: (r) => r.email() }),
    defineField({ name: "routenlink", title: "Routenlink", type: "url", group: "kontakt", description: "Link zu einem Kartendienst (wird nur verlinkt, nicht eingebettet)." }),
    defineField({
      name: "oeffnungszeiten",
      title: "Öffnungszeiten",
      type: "array",
      group: "kontakt",
      of: [defineArrayMember({ type: "oeffnungszeit" })],
      description: "Leer lassen, solange keine verbindlichen Zeiten bekannt sind – die Website zeigt dann «bitte telefonisch erfragen».",
    }),
    defineField({ name: "navigation", title: "Hauptnavigation", type: "array", group: "navigation", of: [defineArrayMember({ type: "link" })], validation: (r) => r.required().min(1).max(6) }),
    defineField({ name: "rechtslinks", title: "Links im Footer (Rechtliches)", type: "array", group: "navigation", of: [defineArrayMember({ type: "link" })] }),
    defineField({ name: "demoHinweis", title: "Demo-Hinweis", type: "string", group: "navigation", description: "Kurzer Hinweis am Seitenende, solange die Website eine Demo ist. Leer = kein Hinweis." }),
    defineField({
      name: "seo",
      title: "Suchmaschinen",
      type: "object",
      group: "seo",
      fields: [
        defineField({ name: "titelZusatz", title: "Zusatz im Browser-Titel", type: "string", validation: (r) => r.required() }),
        defineField({ name: "beschreibung", title: "Standard-Beschreibung", type: "text", rows: 3, validation: (r) => r.required().max(160) }),
        defineField({ name: "bild", title: "Vorschaubild (Teilen in sozialen Medien)", type: "bild" }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Website-Einstellungen" }) },
});

export const seiteTyp = defineType({
  name: "seite",
  title: "Seite",
  type: "document",
  groups: [
    { name: "inhalt", title: "Inhalt", default: true },
    { name: "kopf", title: "Seitenanfang" },
    { name: "seo", title: "Suchmaschinen" },
  ],
  fields: [
    defineField({ name: "titel", title: "Titel", type: "string", group: "inhalt", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "URL-Segment",
      type: "slug",
      group: "inhalt",
      description: "«start» ist die Startseite. Sonst z. B. «leistungen» → /leistungen/",
      options: { source: "titel", maxLength: 60 },
      validation: (r) =>
        r.required().custom((slug) => {
          const wert = slug?.current ?? "";
          if (RESERVIERTE_SLUGS.includes(wert)) return `«${wert}» ist reserviert.`;
          if (!/^[a-z0-9-]+$/.test(wert)) return "Nur Kleinbuchstaben, Ziffern und Bindestriche.";
          return true;
        }),
    }),
    defineField({ name: "einleitung", title: "Einleitung", type: "text", rows: 3, group: "kopf", description: "Kurzer Text unter dem Seitentitel (Unterseiten)." }),
    defineField({
      name: "hero",
      title: "Schriftband (nur Startseite)",
      type: "object",
      group: "kopf",
      fields: [
        defineField({ name: "kurzzeile", title: "Kurzzeile", type: "string" }),
        defineField({ name: "titel", title: "Text auf dem Band", type: "string", validation: (r) => r.required().max(90) }),
        defineField({ name: "text", title: "Text darunter", type: "text", rows: 3 }),
        defineField({ name: "knopf", title: "Knopf", type: "link" }),
        defineField({ name: "zweiterKnopf", title: "Zweiter Knopf", type: "link" }),
      ],
    }),
    defineField({ name: "bausteine", title: "Bausteine", type: "array", group: "inhalt", of: bausteinMitglieder }),
    defineField({ name: "seoTitel", title: "Seitentitel (Browser-Tab)", type: "string", group: "seo", validation: (r) => r.max(70).warning("Suchmaschinen kürzen Titel über ~70 Zeichen.") }),
    defineField({ name: "seoBeschreibung", title: "Beschreibung (Suchergebnis)", type: "text", rows: 3, group: "seo", validation: (r) => r.max(160).warning("Suchmaschinen zeigen meist nur ~160 Zeichen.") }),
  ],
  preview: { select: { title: "titel", subtitle: "slug.current" } },
});

export const leistungTyp = defineType({
  name: "leistung",
  title: "Leistung",
  type: "document",
  fields: [
    defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required() }),
    defineField({ name: "kurz", title: "Kurzbeschreibung", type: "string", description: "Ein Satz – erscheint auf dem Auftragsblatt.", validation: (r) => r.required().max(140) }),
    defineField({ name: "inhalt", title: "Ausführlicher Text", type: "richText", description: "Optional, für die Leistungsseite." }),
    defineField({
      name: "gruppe",
      title: "Gruppe",
      type: "string",
      options: { list: [{ title: "Werkstatt", value: "werkstatt" }, { title: "Carrosserie", value: "carrosserie" }, { title: "Handel & Teile", value: "handel" }], layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "reihenfolge", title: "Reihenfolge", type: "number", validation: (r) => r.required().integer() }),
  ],
  orderings: [{ title: "Reihenfolge", name: "reihenfolge", by: [{ field: "reihenfolge", direction: "asc" }] }],
  preview: { select: { title: "titel", subtitle: "gruppe" } },
});

export const rechtstextTyp = defineType({
  name: "rechtstext",
  title: "Rechtstext",
  type: "document",
  fields: [
    defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "art",
      title: "Art",
      type: "string",
      options: { list: [{ title: "Impressum", value: "impressum" }, { title: "Datenschutzerklärung", value: "datenschutz" }], layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "stand", title: "Stand (Datum)", type: "date" }),
    defineField({ name: "inhalt", title: "Inhalt", type: "richText", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "titel", subtitle: "stand" } },
});
