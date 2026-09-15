# Prüfbericht – vm-garage-website (Stand 15.09.2026)

Alle Browser-Tests sind **Geräte-Emulation** (Chrome headless via puppeteer-core, Viewports 360/390/768/1440, `isMobile` + `hasTouch`
bei < 500 px). **Keine Tests auf echten Geräten und keinem echten Screenreader** – offen.

## Build und Export

| Prüfung | Ergebnis |
|---|---|
| `npm run typecheck`, `npm run lint` | fehlerfrei |
| `npm run inhalt:pruefen` | 6 Seiten, 7 Leistungen, 1 Bild, 8 interne Links – in Ordnung |
| `npm run build:pages` ohne jede Env-Variable | 9 HTML-Dateien (6 Seiten, 404, _not-found, icon) |
| `npm run export:pruefen` | 279 interne Verweise unter `/vm-garage-website`, keine fehlenden Ziele, keine externen Ressourcen, noindex überall |
| `npm run seed -- --probe` | 16 Dokumente + 1 Bild ohne Schreibzugriff zusammengestellt |
| `npm run build:vercel` (Platzhalter-Projekt-ID, lokale Inhalte) | kompiliert: `/api/revalidate`, `/api/vorschau/*` (dynamisch), `/studio/[[...tool]]` (statisch) – nur lokal, nicht auf Vercel |

## GitHub Pages (live)

- Workflow `.github/workflows/pages.yml` (Prüfungen → Build → Export-Check → Deploy) erfolgreich; Pages über Actions aktiviert.
- Direktaufruf + Reload: `/`, `/leistungen/`, `/ueber-uns/`, `/kontakt/`, `/impressum/`, `/datenschutz/` → 200; `/gibtsnicht/` → 404 mit gestalteter
  404-Seite; `/kontakt/?anliegen=abgaswartung` → 200, Auswahl vorbelegt.
- Auf der Live-Seite geladene Hosts: **nur `nick8952.github.io`**. Cookies 0, localStorage/sessionStorage 0. Schriften lokal geladen
  (Familjen Grotesk, Karla, JetBrains Mono).
- Ohne GitHub-Login öffnbar (public Repo, öffentliche Pages-Site).

## Layout (360 / 390 / 768 / 1440)

- Kein horizontales Scrollen, keine Elemente über den Viewport hinaus (`scrollWidth` = `clientWidth`, Bounding-Box-Audit) auf allen 7 Seiten × 4 Breiten.
- Touch-Ziele: alle Knöpfe/Navigationslinks ≥ 44 × 44 px. Ausnahmen (bewusst, WCAG-Inline-Ausnahme): Links im Fliesstext der Rechtstexte
  (E-Mail, Telefon, GitHub-Datenschutzerklärung) und der Skip-Link (nur bei Fokus sichtbar).
- Screenshots (Scratchpad) visuell geprüft; behobene Befunde: zwei rote Bänder direkt übereinander (Aufruf + Footer) → Aufruf jetzt Zettel mit
  rotem Streifen; Fakten-Raster mit leerer grauer Zelle bei 5 Einträgen; Archivbild wurde über 400 px hinaus vergrössert; Datenschutz-Dialog
  ragte auf 390 px über den Viewport hinaus (jetzt scrollbar); Footer-Band bei 768 px zu eng (Zweispaltigkeit erst ab `lg`).

## Funktionen

| Funktion | Ergebnis |
|---|---|
| Mobilmenü (`<dialog>`) | öffnet per Knopf, Fokus im Dialog, Esc schliesst, Fokus kehrt zu «Menü öffnen» zurück, schliesst bei Seitenwechsel |
| Anfrage-Assistent | Pflichtfeld «Anliegen» ohne Auswahl → Fehlermeldung (`role=alert`), `aria-invalid`, Fokus auf Select; mit Angaben → Text wird zusammengestellt; Knöpfe «Text kopieren» + «Anrufen» (kein «Absenden», keine Erfolgsmeldung); `?anliegen=pneuservice` belegt die Auswahl vor |
| Datenschutz-Einstellungen (`<dialog>`) | öffnet, Fokus auf Schliessen-Knopf, Esc schliesst, Fokus zurück zum Footer-Knopf |
| Telefon-/Routen-/E-Mail-Links | `tel:+41444504373`, Google-Maps-Route (neuer Tab, `rel="noopener noreferrer"`), `mailto:` nur im Impressum/Datenschutz (Demo-Betreiber) |
| Alle internen Links | 13 Ziele auf 6 Seiten gesammelt, alle → 200 |
| Tastatur | Tab-Reihenfolge: Skip-Link → Wortmarke → Navigation → Telefon → Hero-Knöpfe; sichtbarer Fokus (3 px Outline) auf jedem Ziel |
| Reduzierte Bewegung | mit `prefers-reduced-motion: reduce`: `animation: none`, kein `clip-path`; ohne: Band-Einfahren + `animation-timeline: view()` aktiv |
| Konsole | keine Fehler ausser dem erwarteten 404 bei `/gibtsnicht/` |

## Datenschutztechnik (Requests, Cookies, Speicher)

Getestet in jedem Zustand, den die Website kennt – vor Interaktion, nach Öffnen/Schliessen des Datenschutz-Dialogs, nach Nutzung des
Anfrage-Assistenten, nach Neuladen: **0 externe Requests, 0 Cookies, 0 Einträge in localStorage/sessionStorage.** Es gibt keine
Einwilligungskategorien, weil es nichts Einwilligungspflichtiges gibt; «Zustimmen»/«Ablehnen»/«Widerruf» wären wirkungslose Schalter.
Deshalb Info-Dialog statt Banner (Begründung in `components/DatenschutzEinstellungen.tsx` und in der Datenschutzerklärung).
Externe Ziele erst nach Klick: Google Maps (Route), Telefon-App, GitHub-Datenschutzerklärung (Link im Rechtstext).

## Kontraste (berechnet)

Weiss auf Rot `#c4301f` 5.54:1 · Tinte `#17191b` auf Beton `#e9e6e0` 14.15:1 · Stahl `#5b5f65` auf Beton 5.16:1, auf Weiss 6.42:1 ·
Rot-dunkel `#9a2416` auf Weiss 7.96:1 · Formularrand `#7d7f84` auf Weiss 4.01:1 (≥ 3:1) · Fokus `#0f4fd1` auf Beton 5.51:1.
Befund aus der Codex-Review: Weiss mit 90 % Deckung auf Rot lag bei 4.02:1 → Footer-Adresse jetzt volles Weiss.

## Vercel-Modus (nur lokal kompiliert)

`npm run build:vercel` mit `CONTENT_SOURCE` leer (lokale Inhalte) und Platzhalter-Projekt-ID kompiliert erfolgreich (12 Routen). Nicht geprüft: Studio,
GROQ gegen echte Daten, Draft Mode, Webhook, Seed-Upload.

## Codex-Prüfung (unabhängige Zweitmeinung, nur Lesezugriff)

**Runde 1 – Architektur (vor der Umsetzung):** Kurzurteil «tragfähig». Übernommen: `dynamicParams = false`, Link-/Asset-Check auf
`out/` als CI-Schritt (`scripts/export-pruefen.mjs`), Bilddateinamen mit Inhalts-Hash, Kontakt ohne verifizierte E-Mail als
«Anrufen + Kopierhilfe, nie ‹Absenden›», Datenschutz-Inhalte (GitHub-Pages-Logs, Rechtsgrundlage, externe Links).

**Runde 2 – Implementierung (16 Punkte: 5 Muss, 9 Sollte, 2 Kann):** Codex prüfte Faktentreue, Code, Export/basePath, Sicherheit,
Barrierefreiheit, Datenschutztechnik und Doku; fand keine externen Requests/Cookies/Storage und bestätigte den Verzicht auf den Banner.
Umgesetzt (14): unbelegte Zusätze «unabhängig», «am schnellsten», «Ein Anruf genügt» entfernt; Seed setzt `_type: "adresse"`;
Link-Protokoll-Whitelist in Schema, `inhalt-pruefen` und `SmartLink` (`javascript:`/`//host` → `#`); Regex-Fehler im Export-Prüfer
behoben (Ressourcen-Tags werden jetzt tatsächlich geprüft, CSS-`@import` inklusive, fehlendes `out/` gibt eine klare Meldung);
`inhalt-pruefen` prüft Pflichtfelder, `darstellung`, verschachtelte `_key`s; `local.ts` fängt nur noch `ENOENT` ab; `--entfernen`
löscht `.next/types` (sonst bricht `tsc` nach einem Vercel-Lauf – reproduziert); Assistent: kurze Live-Ansage statt Live-Vorschau,
Fehler verschwindet bei Auswahl, `overflow-wrap`; Datenschutztext zum Assistenten präzisiert; «Betreiberin» → neutral «verantwortliche
Person»; Kontrastwerte korrigiert (dabei Weiss/90 % auf Rot mit 4.0:1 entdeckt → Footer-Adresse volles Weiss); Telefon-Normalisierung
für `0041`/`+41`; Impressum trennt neu verfasste Texte von übernommenen Firmenzitaten.
Nicht übernommen (1): «Seit 2006 an der Weststrasse» sei unbelegt – die SHAB-Neueintragung vom 01.03.2006 nennt bereits
Weststrasse 117/119 (in der Inventur ergänzt). Nicht ausführbar in der Codex-Sandbox: `next build`, `tsx`-Skripte.

## Offen

- Tests auf echten Geräten (iOS Safari, Android Chrome), echter Screenreader (VoiceOver/NVDA).
- Alles, was Sanity/Vercel betrifft (erst nach Einrichtung prüfbar).
- Inhalte, die der Kunde bestätigen muss (docs/UEBERGABE.md).
