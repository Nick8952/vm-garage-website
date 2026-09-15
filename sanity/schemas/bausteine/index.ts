import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Seitenbausteine – ein begrenzter Satz, mit dem der Kunde später Seiten zusammenstellt.
 * Jeder Baustein hat optional Kurzzeile + Titel; gestalterische Werte (Farben, Abstände)
 * sind bewusst nicht editierbar.
 */
const kopf = [
  defineField({ name: "kurzzeile", title: "Kurzzeile", type: "string", description: "Kleine Zeile über dem Titel, z. B. «Werkstatt»." }),
  defineField({ name: "titel", title: "Titel", type: "string" }),
];

export const textBaustein = defineType({
  name: "textBaustein",
  title: "Text",
  type: "object",
  fields: [
    ...kopf,
    defineField({ name: "inhalt", title: "Inhalt", type: "richText", validation: (r) => r.required() }),
    defineField({
      name: "breite",
      title: "Breite",
      type: "string",
      options: { list: [{ title: "Schmal (gut lesbar)", value: "schmal" }, { title: "Normal", value: "normal" }], layout: "radio" },
      initialValue: "schmal",
    }),
  ],
  preview: { select: { title: "titel", subtitle: "kurzzeile" }, prepare: ({ title, subtitle }) => ({ title: title || "Text", subtitle }) },
});

export const leistungenBaustein = defineType({
  name: "leistungenBaustein",
  title: "Leistungen (Auftragsblatt)",
  type: "object",
  fields: [
    ...kopf,
    defineField({ name: "einleitung", title: "Einleitung", type: "text", rows: 2 }),
    defineField({
      name: "darstellung",
      title: "Darstellung",
      type: "string",
      options: { list: [{ title: "Vollständiges Auftragsblatt (mit Gruppen)", value: "blatt" }, { title: "Kompakte Kurzliste", value: "kompakt" }], layout: "radio" },
      initialValue: "blatt",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "leistungen",
      title: "Auswahl",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "leistung" }] })],
      description: "Leer lassen = alle Leistungen in ihrer Reihenfolge.",
    }),
    defineField({ name: "weiterLink", title: "Link am Ende", type: "link", description: "z. B. «Alle Leistungen» → /leistungen" }),
  ],
  preview: { select: { title: "titel", darstellung: "darstellung" }, prepare: ({ title, darstellung }) => ({ title: title || "Leistungen", subtitle: darstellung === "kompakt" ? "Kurzliste" : "Auftragsblatt" }) },
});

export const faktenBaustein = defineType({
  name: "faktenBaustein",
  title: "Fakten (Betriebsdaten)",
  type: "object",
  description: "Kurze, belegte Angaben wie Gründungsjahr, Rechtsform oder Standort.",
  fields: [
    ...kopf,
    defineField({
      name: "fakten",
      title: "Fakten",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faktum",
          fields: [
            defineField({ name: "bezeichnung", title: "Bezeichnung", type: "string", validation: (r) => r.required() }),
            defineField({ name: "wert", title: "Wert", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "bezeichnung", subtitle: "wert" } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: { select: { title: "titel" }, prepare: ({ title }) => ({ title: title || "Fakten" }) },
});

export const bewertungenBaustein = defineType({
  name: "bewertungenBaustein",
  title: "Bewertungen",
  type: "object",
  description: "Zeigt wörtliche Kundenzitate aus dem Dokumenttyp «Bewertung» (nie hier neu erfinden – Zitate im jeweiligen Dokument pflegen).",
  fields: [
    ...kopf,
    defineField({ name: "einleitung", title: "Einleitung", type: "text", rows: 2 }),
    defineField({
      name: "bewertungen",
      title: "Auswahl",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "bewertung" }] })],
      description: "Leer lassen = alle Bewertungen in ihrer Reihenfolge.",
    }),
  ],
  preview: { select: { title: "titel" }, prepare: ({ title }) => ({ title: title || "Bewertungen" }) },
});

export const spaltenBaustein = defineType({
  name: "spaltenBaustein",
  title: "Spalten",
  type: "object",
  fields: [
    ...kopf,
    defineField({
      name: "spalten",
      title: "Spalten",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "spalte",
          fields: [
            defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required() }),
            defineField({ name: "inhalt", title: "Inhalt", type: "richText", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "titel" } },
        }),
      ],
      validation: (r) => r.required().min(1).max(3),
    }),
  ],
  preview: { select: { title: "titel" }, prepare: ({ title }) => ({ title: title || "Spalten" }) },
});

export const bildBaustein = defineType({
  name: "bildBaustein",
  title: "Bild",
  type: "object",
  fields: [
    ...kopf,
    defineField({ name: "bild", title: "Bild", type: "bild", validation: (r) => r.required() }),
    defineField({ name: "text", title: "Begleittext", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "titel", media: "bild" }, prepare: ({ title, media }) => ({ title: title || "Bild", media }) },
});

export const kontaktBaustein = defineType({
  name: "kontaktBaustein",
  title: "Kontakt",
  type: "object",
  description: "Adresse, Telefon, Route und optional der Anfrage-Assistent. Die Angaben kommen aus den Website-Einstellungen.",
  fields: [
    ...kopf,
    defineField({ name: "einleitung", title: "Einleitung", type: "text", rows: 2 }),
    defineField({ name: "mitFormular", title: "Anfrage-Assistent anzeigen", type: "boolean", initialValue: true, description: "Bereitet nur einen Text vor (Kopieren bzw. E-Mail); es wird nichts automatisch versendet." }),
    defineField({ name: "formularHinweis", title: "Hinweis beim Assistenten", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "titel" }, prepare: ({ title }) => ({ title: title || "Kontakt" }) },
});

export const aufrufBaustein = defineType({
  name: "aufrufBaustein",
  title: "Handlungsaufforderung",
  type: "object",
  fields: [
    ...kopf,
    defineField({ name: "text", title: "Text", type: "text", rows: 2 }),
    defineField({ name: "knopf", title: "Knopf", type: "link", validation: (r) => r.required() }),
    defineField({ name: "zweiterKnopf", title: "Zweiter Knopf", type: "link" }),
  ],
  preview: { select: { title: "titel", subtitle: "knopf.titel" }, prepare: ({ title, subtitle }) => ({ title: title || "Handlungsaufforderung", subtitle }) },
});

export const rechtstextBaustein = defineType({
  name: "rechtstextBaustein",
  title: "Rechtstext",
  type: "object",
  fields: [defineField({ name: "rechtstext", title: "Rechtstext", type: "reference", to: [{ type: "rechtstext" }], validation: (r) => r.required() })],
  preview: { select: { title: "rechtstext.titel" }, prepare: ({ title }) => ({ title: title || "Rechtstext" }) },
});

export const bausteine = [textBaustein, leistungenBaustein, faktenBaustein, bewertungenBaustein, spaltenBaustein, bildBaustein, kontaktBaustein, aufrufBaustein, rechtstextBaustein];
export const bausteinMitglieder = bausteine.map((b) => defineArrayMember({ type: b.name }));
