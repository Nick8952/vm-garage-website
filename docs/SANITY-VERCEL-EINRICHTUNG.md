# Spätere Einrichtung: Sanity (CMS) und Vercel (Hosting)

Status: **vorbereitet, nicht eingerichtet.** Nichts in diesem Dokument wurde gegen ein echtes Sanity- oder Vercel-Projekt
getestet. Lokal geprüft: `npm run build:vercel` kompiliert mit Studio- und API-Routen (Platzhalter-Projekt-ID, lokale
Inhalte); `npm run seed -- --probe` stellt alle 16 Dokumente + 1 Bild zusammen (kein Schreibzugriff).

Voraussetzungen: Sanity-Konto, Vercel-Konto, Zugriff auf `Nick8952/vm-garage-website`. Sanity- und Vercel-Projekt legt Nick an,
sobald der Kunde Interesse zeigt – **eigenes Sanity-Projekt**, nicht das einer anderen Demo.

## 1. Sanity-Projekt anlegen

1. `npx sanity@latest login` (Browser-Login).
2. Projekt anlegen: https://www.sanity.io/manage → *Create project* → Name «V & M Garage», Dataset `production` (public genügt:
   nur veröffentlichte Website-Inhalte).
3. Projekt-ID notieren.
4. Tokens unter *API → Tokens*: `Viewer` → `SANITY_API_READ_TOKEN` (Vorschau); `Editor` → `SANITY_API_WRITE_TOKEN`
   (nur für den Import, danach löschen).
5. CORS unter *API → CORS origins*: `http://localhost:3000` (Allow credentials) und später die Vercel-/Kundendomain.

## 2. Lokal verbinden

```bash
cp .env.example .env.local
# DEPLOY_TARGET=vercel, CONTENT_SOURCE=sanity, NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET=production,
# SANITY_API_READ_TOKEN, SANITY_API_WRITE_TOKEN, SANITY_REVALIDATE_SECRET (frei wählen: openssl rand -hex 24)
```

## 3. Inhalte importieren

```bash
npm run seed -- --probe   # zeigt, was angelegt würde – zuerst ausführen
npm run seed              # legt nur fehlende Dokumente an, überschreibt nichts
npm run seed -- --force   # ersetzt die vom Skript verwalteten Dokumente (nur bewusst)
```

Deterministische IDs (`einstellungen`, `seite-<slug>`, `leistung-*`, `rechtstext-*`), `_key`-Werte unverändert aus `data/`.
Das Fassadenfoto wird als Asset hochgeladen (Sanity dedupliziert per Hash). Dokumente werden **direkt veröffentlicht**.

## 4. Studio lokal prüfen

```bash
npm run dev:vercel      # Studio: http://localhost:3000/studio
```

Prüfen: Website-Einstellungen (Einzeldokument, Gruppen Betrieb / Kontakt & Öffnungszeiten / Navigation / Suchmaschinen),
Seiten mit Bausteinen, Leistungen, Rechtstexte; deutsche Oberfläche (`@sanity/locale-de-de`).

## 5. Vercel-Projekt

1. https://vercel.com/new → Repo importieren (Next.js wird erkannt).
2. **Build Command**: `npm run build:vercel`.
3. Environment Variables (Production + Preview): `DEPLOY_TARGET=vercel`, `CONTENT_SOURCE=sanity`,
   `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION=2026-09-15`,
   `SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET`, `SITE_URL=https://<projekt>.vercel.app`.
   **Kein** `BASE_PATH`, **kein** `INDEXIERUNG` (bleibt noindex bis Go-Live).
4. Deploy; prüfen: alle Seiten, `/studio` (Login), `/api/revalidate` (POST ohne Signatur → 401).
5. Sanity-CORS um die Vercel-Domain ergänzen, sonst lädt das Studio nicht.

## 6. Vorschau und Visual Editing

- Presentation-Tool in `sanity.config.ts`, Draft Mode über `/api/vorschau/aktivieren` (Geheimnisprüfung durch next-sanity)
  und `/api/vorschau/beenden`. Entwürfe werden ungecacht mit Perspektive `drafts` gelesen (`lib/content/sanity.ts`).
- Overlay: `lib/vorschau/VorschauWerkzeuge.tsx` (nur Vercel + Draft Mode). Stega-Markierungen werden in Metadaten/JSON-LD entfernt.
- Im statischen Export wird `next-sanity/visual-editing` durch einen Stub ersetzt (`next.config.ts`, `turbopack.resolveAlias`).

## 7. Inhaltsaktualisierung (ISR + Webhook)

- Sanity → *API → Webhooks → Create*: URL `https://<domain>/api/revalidate`, Dataset `production`, Trigger Create/Update/Delete,
  Projection `{_type}`, POST, **Secret = `SANITY_REVALIDATE_SECRET`**. Der Handler invalidiert das Cache-Tag `inhalt`.
- **Neue Seiten (neue Slugs)**: `app/[slug]/page.tsx` hat `dynamicParams = false` (nötig für den Export). Auf Vercel erscheinen neue
  Slugs deshalb erst nach einem Rebuild → Vercel *Deploy Hook* als zweiten Sanity-Webhook (`_type == "seite"`) eintragen, oder
  `dynamicParams = true`, sobald der GitHub-Pages-Export nicht mehr gebraucht wird.

## 8. Zugriffsrechte

- Sanity → *Members*: Kunde als **Editor** einladen (Inhalte pflegen, keine Schemas/Tokens). Nick bleibt Administrator; für die
  endgültige Übergabe Projekt an eine Organisation des Kunden übertragen.
- Vercel: Kunde optional als Member; Domain siehe docs/UMSTELLUNG-VERCEL.md.

## 9. Erst nach der Einrichtung überprüfbar

GROQ-Abfragen gegen echte Daten, Studio-Validierungen, Presentation-Tool, Draft Mode, Webhook-Signaturprüfung, Seed-Upload
(nur `--probe` geprüft), Sanity-Bild-URLs (`sanity/bild.ts`).
