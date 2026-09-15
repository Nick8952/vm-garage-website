# Übergabe – vm-garage-website

## Links

- Demo (GitHub Pages, noindex): https://nick8952.github.io/vm-garage-website/
- Repository: https://github.com/Nick8952/vm-garage-website
- Verantwortlich für die Demo: Nick Holzbecher (Impressum); dargestelltes Unternehmen: V & M Garage GmbH, Weststrasse 117/119, 8003 Zürich

## Was fertig ist

- Statische Demo mit Start, Leistungen, Über uns, Kontakt, Impressum, Datenschutzerklärung, 404; Datenschutz-Einstellungen im Footer.
- Nur belegte Inhalte (docs/INHALTSINVENTUR.md). Keine Cookies, kein Speicher, keine externen Requests (docs/PRUEFBERICHT.md).
- Sanity-Schemas, Sanity-Adapter, Studio-Konfiguration, Seed-Skript, Vercel-Routen: **vorbereitet, nicht angeschlossen**.

## Offene Unternehmensangaben (beim Kunden abfragen)

1. Hausnummer am Eingang: 117, 119 oder 117/119?
2. Aktuelle **Öffnungszeiten** (2013: Mo–Fr 07:30–12:00, 13:00–17:30, Sa nach Vereinbarung – unbestätigt).
3. Eine funktionierende **E-Mail-Adresse** (info@vm-garage.ch ist technisch tot). Dann `email` in den Einstellungen setzen.
4. Bestätigung des **Leistungsumfangs** (Abgaswartung, Lenkgeometrie, Occasionen, Ersatzwagen) und ggf. Ergänzungen (Klimaservice, MFK-Vorbereitung o. ä. nur, wenn wirklich angeboten).
5. **Fotos** (Werkstatt, Team, Fahrzeuge) und ein Logo, falls vorhanden; Rechte am Archivfoto.
6. Gehört die Domain **vm-garage.ch** noch dem Kunden? Sonst neue Domain.
7. Wer soll im Impressum stehen (Firma, Geschäftsführer, E-Mail)? Registerangaben bestätigen (Stand SHAB 03.12.2019).

## Rechtlich zu prüfen (nicht anwaltlich geprüft)

- Impressum: für die Demo nur Name + E-Mail der verantwortlichen Person (keine Postadresse). Beim Go-Live vollständige Angaben des Unternehmens.
- Datenschutzerklärung: GitHub-Pages-Hosting (USA), Rechtsgrundlage «berechtigtes Interesse», Betroffenenrechte nach DSG/DSGVO,
  Speicherfristen bewusst nicht behauptet. Beim Umzug auf Vercel/Sanity neu fassen (docs/UMSTELLUNG-VERCEL.md).
- Urheberrecht am Archivfoto (alte Website des Kunden) vor Go-Live klären.

## Unabhängige Übergabe an den Kunden

- **Code**: Repository übertragen (GitHub → Settings → Transfer) oder als ZIP; alles Nötige liegt im Repo, keine Geheimnisse.
- **Inhalte**: heute `data/*.json` (Backup = Git-Historie). Nach Sanity-Einrichtung: `npx sanity@latest dataset export production`
  regelmässig als Backup; Kunde als Sanity-Editor, Projekt übertragbar.
- **Hosting**: GitHub Pages (kostenlos, statisch) oder später Vercel (Hobby-Plan kostenlos für nicht-kommerzielle Nutzung – für die
  Firma Pro-Plan prüfen) mit Kundendomain.
- **Wartung**: `npm outdated` / `npm update` quartalsweise; Next.js-Major-Updates gezielt mit Build + Prüfskripten. Node ≥ 20.9.
  Prüfbefehle: `npm run inhalt:pruefen && npm run lint && npm run typecheck && npm run build:pages && npm run export:pruefen`.

## Nur vorbereitet – erst nach Einrichtung überprüfbar

Sanity Studio (`/studio`), GROQ-Abfragen, Draft-Vorschau/Visual Editing, Webhook-Revalidierung, Seed-Upload, Sanity-CDN-Bilder,
Vercel-Build in der Cloud.
