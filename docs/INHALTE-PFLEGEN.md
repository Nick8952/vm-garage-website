# Lokale Demo-Inhalte pflegen (ohne Sanity)

Alle Inhalte der GitHub-Pages-Demo liegen in `data/`. Nach jeder Änderung: `npm run inhalt:pruefen`, dann `git push` (der
Workflow baut und veröffentlicht automatisch). Lokal ansehen: `npm run dev` → http://localhost:3000/vm-garage-website/

| Datei | Inhalt |
|---|---|
| `data/einstellungen.json` | Firmenname, Adresse, Telefon, **E-Mail** (leer lassen, bis bestätigt), UID, Geschäftsführung, Öffnungszeiten (leer = «telefonisch erfragen»), Routenlink, Navigation, Footer-Links, SEO-Standardtexte, Demo-Hinweis |
| `data/leistungen.json` | Leistungen: `id` (stabil, Präfix `leistung-`), `titel`, `kurz` (ein Satz), optional `inhalt` (Portable Text), `gruppe` (`werkstatt` / `carrosserie` / `handel`), `reihenfolge` |
| `data/seiten/<slug>.json` | Eine Datei pro Seite; `slug` = Dateiname; `start` ist die Startseite. `hero` nur auf der Startseite (Text auf dem Schriftband), `einleitung` für Unterseiten. `bausteine` in Anzeigereihenfolge |
| `data/rechtstexte/impressum.json`, `datenschutz.json` | Rechtstexte (Portable Text) mit `stand` |
| `data/bilder.json` | **generiert** durch `npm run bilder` – nicht von Hand bearbeiten |

## Bausteine (`_type`)

`textBaustein` (inhalt, breite), `leistungenBaustein` (darstellung `blatt`/`kompakt`, leistungen = IDs oder `[]` für alle,
weiterLink), `faktenBaustein` (fakten: bezeichnung/wert), `spaltenBaustein` (1–3 Spalten mit Titel + inhalt),
`bildBaustein` (bild-Referenz + text), `kontaktBaustein` (mitFormular, formularHinweis), `aufrufBaustein` (titel, text, knopf,
zweiterKnopf), `rechtstextBaustein` (rechtstext = `impressum`/`datenschutz`). Jeder Baustein braucht einen eindeutigen `_key`.

## Rich Text (Portable Text)

Längere Texte in Markdown schreiben und umwandeln:

```bash
npm run text:konvertieren -- pfad/zum/text.md   # gibt Portable Text (JSON) aus → in `inhalt` einsetzen
```

Unterstützt: Absätze, `##`/`###`, `-` Listen, `1.` Listen, **fett**, *kursiv*, [Links](https://…). Zeilenumbrüche innerhalb
eines Absatzes bleiben erhalten (z. B. Adresszeilen).

## Bilder

1. Original nach `assets/originale/` legen und in `assets/originale/HERKUNFT.md` Herkunft + Freigabe notieren.
2. In `scripts/bilder-optimieren.mjs` unter `BILDER` eine Kennung eintragen (`"werkstatt-innen": { datei: "werkstatt.jpg" }`).
3. `npm run bilder` → erzeugt `public/images/*.webp` (480/960/1600 px, Inhalts-Hash im Namen) und `data/bilder.json`.
4. In den Inhalten referenzieren: `{ "bild": "werkstatt-innen", "alt": "…", "bildunterschrift": "…" }` – Alt-Text ist Pflicht.

## Öffnungszeiten und E-Mail freischalten

Sobald der Kunde die Angaben bestätigt: in `data/einstellungen.json` `oeffnungszeiten` füllen
(`[{ "_key": "z1", "tage": "Montag – Freitag", "zeiten": "07.30 – 12.00 und 13.00 – 17.30 Uhr" }]`) und `email` setzen.
Der Anfrage-Assistent zeigt dann «E-Mail vorbereiten» (mailto) statt «Text kopieren»; JSON-LD nimmt die Zeiten auf.

## Prüfen

```bash
npm run inhalt:pruefen   # Inhalte
npm run build:pages && npm run export:pruefen   # Export unter dem Unterpfad, noindex, keine externen Ressourcen
npm run vorschau:pages   # http://localhost:4321/vm-garage-website/
```
