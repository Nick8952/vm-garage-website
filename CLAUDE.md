# vm-garage-website – Anweisungen für Claude Code

Verkaufs-Demo für die **V & M Garage GmbH, Weststrasse 117/119, 8003 Zürich** (Autowerkstatt für alle Marken – **keine Fahrschule**).
Auftraggeber der Demo: Nick Holzbecher. Inhalte ausschliesslich aus Handelsregister und altem Webauftritt (2013), siehe
`docs/INHALTSINVENTUR.md`. Die Next.js-Agent-Regeln aus `AGENTS.md` gelten zusätzlich:

@AGENTS.md

## Betriebsarten (eine Codebasis, zwei Ziele)

| | **GitHub Pages (JETZT)** | **Vercel + Sanity (SPÄTER)** |
|---|---|---|
| Build | `npm run build:pages` (= `npm run build`) | `npm run build:vercel` |
| Env | keine nötig | `DEPLOY_TARGET=vercel`, `CONTENT_SOURCE=sanity`, Sanity-Variablen (`.env.example`) |
| Ausgabe | `out/` statisch, Unterpfad `/vm-garage-website` | Server-Rendering, ISR, `/studio`, `/api/*` |
| Inhalte | `data/*.json` | Sanity Content Lake |
| Bilder | `public/images/*.webp` (vorgerechnet, Hash im Namen) | Sanity-CDN via `@sanity/image-url` |
| Status | **live, geprüft** | **vorbereitet, nicht angeschlossen** – erst nach Einrichtung prüfbar |

Umschaltung ausschliesslich über `lib/deploy-ziel.ts` und `next.config.ts`. Sanity-/Vercel-Projekte **nicht** anlegen und
keine Zugänge verlangen – das macht Nick selbst (`docs/SANITY-VERCEL-EINRICHTUNG.md`).

## Architektur

- **Next.js 16 App Router, TypeScript, Tailwind v4**, Node ≥ 20.9 (lokal Node 26, CI Node 24). Architektur-Ausgangspunkt war
  `maler-attinger-website` (Inhaltsschnittstelle, Skripte, Server-Routen) – Design und Komponenten sind eigenständig.
- Routen: `app/page.tsx` (Slug `start`), `app/[slug]/page.tsx` (`generateStaticParams`, `dynamicParams = false`), `app/not-found.tsx`.
- **Inhaltsschnittstelle `lib/content/`**: Komponenten importieren nur `lib/content` (Typen + `inhaltsquelle()`).
  `local.ts` liest `data/`, `sanity.ts` fragt GROQ ab – beide liefern dieselben Typen aus `types.ts`.
  `CONTENT_SOURCE=sanity` ohne Projekt-ID bricht den Build absichtlich ab.
- **Bausteine** (`components/bausteine/Bausteine.tsx`): text, leistungen (Auftragsblatt), fakten, bewertungen (Google-Zitate), spalten, bild, kontakt, aufruf,
  rechtstext. Sanity-Schemas in `sanity/schemas/` (deutsche Feldnamen, Hilfetexte, Validierung). Lokale JSON ist wie
  Sanity-Dokumente aufgebaut (`_type`, `_key`, Portable Text). Neuer Baustein = Typ + Schema + Fall im Renderer + `inhalt-pruefen`.
- **Bilder**: Originale in `assets/originale/` (Herkunft: `HERKUNFT.md`), `npm run bilder` → `public/images/` + `data/bilder.json`.
  Ausgabe über `components/Bild.tsx` (`<img srcset>`). Unterpfad nur über `lib/assets.ts#assetUrl`.
- **Server-Routen** (Studio, Webhook, Vorschau) in `server-routes/app/`, werden nur beim Vercel-Build nach `app/` kopiert
  (`scripts/vercel-routen.mjs`; `app/studio`, `app/api` in `.gitignore`).
- **Schriften** lokal aus `app/fonts/` (Familjen Grotesk, Karla, JetBrains Mono – alle OFL). Kein Google-Fonts-Request.
- **Kontakt**: keine verifizierte E-Mail → Anfrage-Assistent (`components/AnfrageAssistent.tsx`) bereitet nur Text vor
  («Text kopieren» + Anrufen). Sobald `email` in den Einstellungen steht, wird daraus «E-Mail vorbereiten» (mailto). Nie «Absenden».

## Befehle

```bash
npm run dev              # Entwicklung (lokale Inhalte, http://localhost:3000/vm-garage-website/)
npm run build:pages      # statischer Export nach out/
npm run export:pruefen   # out/ prüfen: Unterpfad, fehlende Ziele, externe Ressourcen, noindex
npm run vorschau:pages   # out/ wie GitHub Pages ausliefern (Port 4321; PORT=… falls belegt)
npm run typecheck && npm run lint && npm run inhalt:pruefen   # vor jedem Commit
npm run bilder           # Bildvarianten + data/bilder.json
npm run build:vercel     # Vercel-Modus (kopiert server-routes → app/)
npm run seed -- --probe  # Import nach Sanity nur simulieren
```

Browser-Prüfung: puppeteer-core im Scratchpad gegen den Vorschau-Server (Ablauf in `docs/PRUEFBERICHT.md`).
Für fullPage-Screenshots `prefers-reduced-motion: reduce` emulieren, sonst wirken Scroll-Reveals wie fehlender Inhalt.

## Designregeln («Schriftband»)

- Herkunft: das rote Schriftband mit weisser Schrift über den Werkstattfenstern (einziges echtes Markenzeichen; kein Logo).
- Farben (`app/globals.css`, `@theme static`): Rot `#c4301f` (Band), Beton `#e9e6e0` / Weiss als Grund, Tinte `#17191b`, Stahl `#5b5f65`,
  Fokus `#0f4fd1`. Weiss auf Rot 5.5:1, Stahl auf Beton 5.2:1, Fokus auf Beton 5.5:1.
- Schriften: Familjen Grotesk (Band, Titel), Karla (Lesetext), JetBrains Mono (Etiketten, Auftragsblatt).
- Signatur: **das rote Band nur im Hero und im Footer**; der Aufruf-Baustein ist ein Zettel mit rotem Kopfstreifen, nie ein zweites Band.
  Leistungen als **Auftragsblatt** (Kästchen, Linienraster, «Anfragen» → `/kontakt?anliegen=`). Nichts davon in anderen Demos wiederverwenden.
- Bewegung: Band fährt beim Laden ein (`clip-path`), Abschnitte erscheinen per `animation-timeline: view()`; `prefers-reduced-motion` schaltet alles ab.
- Touch-Ziele ≥ 44 px (Ausnahme: Links im Fliesstext), sichtbarer Fokus, keine Emojis als Icons (Inline-SVG in `components/Icons.tsx`).
- Keine erfundenen Öffnungszeiten, Preise, Bewertungen, Markenpartner, Zertifikate, Teamnamen. Öffnungszeiten und Bewertungen stammen
  vom öffentlichen Google-Eintrag (nicht vom Unternehmen bestätigt) – Herkunft immer sichtbar (`oeffnungszeitenHinweis`, «Google-Rezension»
  mit Datum/Link), nie als geprüfte Fakten dargestellt. `Oeffnungszeit` trägt neben dem sichtbaren Text optionale strukturierte Felder
  (`wochentag`/`von`/`bis`/`geschlossen`), aus denen `lib/seo.ts` ein echtes `openingHoursSpecification` (`dayOfWeek`/`opens`/`closes`,
  geschlossene Tage ausgelassen) baut. JSON-LD bekommt diese Zeiten, aber bewusst **kein** `aggregateRating`/`review`.

## Datenschutz-Technik (Demo)

Keine Cookies, kein Browser-Speicher, keine externen Requests (Puppeteer-Request-Log). Deshalb **kein Cookie-Banner**, sondern
der Dialog «Datenschutz-Einstellungen» im Footer ohne wirkungslose Schalter. Externe Links: Google-Maps-Route (neuer Tab), tel:.
Kommt ein einwilligungspflichtiger Dienst dazu: `docs/UMSTELLUNG-VERCEL.md`, Abschnitt Datenschutz.

## SEO

Alle Seiten `noindex` (Demo). `robots.txt` erlaubt das Crawlen, damit der Hinweis gelesen wird. Indexierung erst mit
`INDEXIERUNG=1` + `SITE_URL` auf der Kundendomain. JSON-LD `AutoRepair` nur mit belegten Angaben, keine Bewertungen.

## Deployment GitHub Pages

`.github/workflows/pages.yml`: Push auf `main` → Prüfungen → `build:pages` → `export:pruefen` → Pages. Repo `Nick8952/vm-garage-website`
(public). Demo-URL: https://nick8952.github.io/vm-garage-website/

## Dokumentation

`docs/INHALTSINVENTUR.md` · `docs/INHALTE-PFLEGEN.md` · `docs/SANITY-VERCEL-EINRICHTUNG.md` · `docs/UMSTELLUNG-VERCEL.md` ·
`docs/UEBERGABE.md` · `docs/PRUEFBERICHT.md`. Keine Zugangsdaten in Dateien; Secrets nur in `.env.local` (ignoriert) bzw. Vercel-Env.
