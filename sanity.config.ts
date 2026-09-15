"use client";
/**
 * Sanity Studio – wird unter /studio eingebettet, sobald DEPLOY_TARGET=vercel gesetzt ist
 * (siehe server-routes/app/studio). In der GitHub-Pages-Demo ist das Studio nicht enthalten.
 * Status: vorbereitet, nicht gegen ein echtes Projekt getestet.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool, defineLocations } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { apiVersion, dataset, projectId, studioUrl } from "./sanity/env";
import { deDELocale } from "@sanity/locale-de-de";

export default defineConfig({
  name: "vm-garage",
  title: "V & M Garage – Inhalte",
  basePath: studioUrl,
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    deDELocale(),
    structureTool({
      structure: (S) =>
        S.list()
          .title("Inhalte")
          .items([
            S.listItem().title("Website-Einstellungen").id("einstellungen").child(S.document().schemaType("einstellungen").documentId("einstellungen")),
            S.divider(),
            S.documentTypeListItem("seite").title("Seiten"),
            S.documentTypeListItem("leistung").title("Leistungen"),
            S.documentTypeListItem("bewertung").title("Bewertungen"),
            S.documentTypeListItem("rechtstext").title("Rechtstexte"),
          ]),
    }),
    presentationTool({
      previewUrl: {
        previewMode: { enable: "/api/vorschau/aktivieren", disable: "/api/vorschau/beenden" },
      },
      resolve: {
        mainDocuments: [
          { route: "/:slug", filter: `_type == "seite" && slug.current == $slug` },
          { route: "/", filter: `_type == "seite" && slug.current == "start"` },
        ],
        locations: {
          seite: defineLocations({
            select: { titel: "titel", slug: "slug.current" },
            resolve: (doc) => ({ locations: [{ title: doc?.titel ?? "Seite", href: doc?.slug === "start" ? "/" : `/${doc?.slug ?? ""}` }] }),
          }),
          leistung: defineLocations({
            select: { titel: "titel" },
            resolve: (doc) => ({ locations: [{ title: `${doc?.titel ?? "Leistung"} – Leistungen`, href: "/leistungen" }, { title: "Startseite", href: "/" }] }),
          }),
          bewertung: defineLocations({
            select: { autor: "autor" },
            resolve: (doc) => ({ locations: [{ title: `Bewertung von ${doc?.autor ?? "?"}`, href: "/ueber-uns" }] }),
          }),
          rechtstext: defineLocations({
            select: { art: "art", titel: "titel" },
            resolve: (doc) => ({ locations: [{ title: doc?.titel ?? "Rechtstext", href: `/${doc?.art ?? "impressum"}` }] }),
          }),
          einstellungen: defineLocations({ message: "Einstellungen wirken auf allen Seiten.", locations: [{ title: "Startseite", href: "/" }, { title: "Kontakt", href: "/kontakt" }] }),
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    // Einstellungen sind ein Einzeldokument: nicht duplizieren/löschen.
    actions: (prev, ctx) => (ctx.schemaType === "einstellungen" ? prev.filter((a) => !["duplicate", "delete", "unpublish"].includes(a.action ?? "")) : prev),
  },
});
