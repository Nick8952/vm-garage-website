# Checkliste: GitHub Pages → Vercel (+ Sanity, Kundendomain)

Solange diese Punkte offen sind, läuft die Demo unverändert auf GitHub Pages.

## Konfiguration

- [ ] `DEPLOY_TARGET=vercel` → `next.config.ts` verzichtet automatisch auf `output: 'export'`, `basePath`, `trailingSlash`, Stub.
- [ ] `CONTENT_SOURCE=sanity` + Sanity-Variablen (docs/SANITY-VERCEL-EINRICHTUNG.md). Ohne Projekt-ID bricht der Build ab – gewollt.
- [ ] Build Command `npm run build:vercel`; `SITE_URL` auf die tatsächliche Domain (Canonical, Open Graph, JSON-LD `url`).

## Pfade und Assets

- [ ] Unterpfad entfällt: `assetUrl()` liefert wurzelrelative Pfade, `next/link` ohne Präfix – nichts im Code zu ändern.
- [ ] Bilder kommen mit `CONTENT_SOURCE=sanity` vom Sanity-CDN (`sanity/bild.ts`, Hotspot/Crop). `public/images/` kann bleiben.
- [ ] Optional `components/Bild.tsx` auf `next/image` mit Vercel-Optimierer (aktuell `<img srcset>`, läuft auf beiden Zielen).
- [ ] Link «Anfragen» auf dem Auftragsblatt nutzt `?anliegen=`; auf Vercel ohne `trailingSlash` weiterhin gültig.

## Domain

- [ ] Klären, ob `vm-garage.ch` noch dem Kunden gehört (Domain ohne DNS-Eintrag). Sonst neue Domain registrieren.
- [ ] Vercel → Domains: Apex + `www` hinzufügen; DNS beim Registrar (A/ALIAS + CNAME laut Vercel); Weiterleitung Apex ↔ www festlegen.
- [ ] Alte Baukasten-URLs (`/601.html`, `/652.html`, `/715.html`, `/736.html`) → 301 auf `/`, `/ueber-uns`, `/leistungen`, `/kontakt`
      in `next.config.ts` → `redirects()` (nur im Vercel-Modus möglich).
- [ ] GitHub-Pages-Demo danach abschalten oder als «umgezogen» stehen lassen (bleibt noindex).

## SEO

- [ ] `INDEXIERUNG=1` setzen → Meta-Robots `index, follow`; vorher **nicht**.
- [ ] `app/sitemap.ts` und `app/robots.ts` ergänzen (in der Demo bewusst nicht: robots.txt im Unterpfad wirkt auf GitHub Pages
      nicht, Sitemap für eine noindex-Seite wäre widersprüchlich). Sitemap aus `getAlleSeitenSlugs()`.
- [ ] Google Search Console, Google Business Profile (Adresse, Telefon, Website, Öffnungszeiten) abgleichen.
- [ ] JSON-LD `AutoRepair` (`lib/seo.ts`): `openingHoursSpecification` erscheint automatisch, sobald Öffnungszeiten gepflegt sind.

## Datenschutz und Rechtstexte

- [ ] **Impressum**: Demo-Betreiber-Abschnitt entfernen, V & M Garage GmbH als Betreiberin (Unternehmen), Angaben vom Kunden bestätigen lassen.
- [ ] **Datenschutzerklärung** neu fassen (Rechtstext im Studio): Verantwortliche = V & M Garage GmbH; Hosting **Vercel Inc.** (USA –
      Region/Logs/Übermittlung prüfen); **Sanity** (Content Lake + `cdn.sanity.io`: Browser rufen Bild-URLs direkt ab → IP-Adresse
      an Sanity); Studio-Login/Draft-Mode-Cookies nur für Redaktion; Kontaktweg; Betroffenenrechte; Stand.
- [ ] **Cookie-Banner** erst nötig, wenn ein einwilligungspflichtiger Dienst dazukommt (Analytics, Karteneinbettung, Video, externe
      Schriften). Dann echter Dialog («Alle akzeptieren» / «Nur notwendige» / «Einstellungen», gleichwertig, nichts vorausgewählt,
      Laden erst nach Einwilligung, Widerruf im Footer) anstelle von `components/DatenschutzEinstellungen.tsx`.
- [ ] Kontaktformular mit echtem Versand (Vercel Function + E-Mail-Dienst) → Datenschutzerklärung um Dienst, Spam-Schutz, Speicherung ergänzen.
- [ ] Aktuelle Prüfung aus dem Prüfbericht wiederholen: externe Requests, Cookies, Storage (jetzt Vercel + Sanity-CDN erwartet).

## Inhaltsaktualisierung

- [ ] Sanity-Webhook → `/api/revalidate` (Tag `inhalt`), Secret gesetzt.
- [ ] Neue Seiten: Deploy Hook oder `dynamicParams = true`.
- [ ] `data/*.json` bleibt als Backup/Ausgangszustand im Repo; nach dem Import ist Sanity die Quelle der Wahrheit.

## Nach dem Umzug testen

- [ ] Alle Seiten direkt aufrufen/neu laden, 404, Weiterleitungen, `?anliegen=`-Vorwahl.
- [ ] Studio-Login des Kunden, Publish → Website aktualisiert (Sekunden).
- [ ] Tastatur, Screenreader, Mobil auf echten Geräten.
