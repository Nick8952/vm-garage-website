import type { Baustein, Einstellungen, Leistung } from "@/lib/content/types";
import { Abschnitt } from "../Abschnitt";
import { Auftragsblatt } from "../Auftragsblatt";
import { Bewertungen } from "../Bewertungen";
import { Bild } from "../Bild";
import { Kontakt } from "../Kontakt";
import { RichText } from "../RichText";
import { SmartLink } from "../SmartLink";
import { PfeilIcon, RouteIcon, TelefonIcon } from "../Icons";

interface Props {
  bausteine: Baustein[];
  e: Einstellungen;
  /** Für den Anfrage-Assistenten (Auswahlliste) */
  leistungen: Leistung[];
}

/** Rendert die Bausteinliste einer Seite. Neue Bausteine: Typ in lib/content/types.ts, Schema in sanity/schemas/bausteine, Fall hier. */
export function Bausteine({ bausteine, e, leistungen }: Props) {
  return (
    <>
      {bausteine.map((b, i) => {
        const grund = i % 2 === 1 ? "weiss" : "beton";
        switch (b._type) {
          case "textBaustein":
            return (
              <Abschnitt key={b._key} kurzzeile={b.kurzzeile} titel={b.titel} grund={grund} breite={b.breite === "normal" ? "normal" : "schmal"}>
                <RichText inhalt={b.inhalt} className="erscheinen" />
              </Abschnitt>
            );
          case "leistungenBaustein":
            return (
              <Abschnitt key={b._key} kurzzeile={b.kurzzeile} titel={b.titel} einleitung={b.einleitung} grund={grund}>
                <Auftragsblatt leistungen={b.leistungen} darstellung={b.darstellung} weiterLink={b.weiterLink} />
              </Abschnitt>
            );
          case "faktenBaustein":
            return (
              <Abschnitt key={b._key} kurzzeile={b.kurzzeile} titel={b.titel} grund={grund}>
                <dl className="erscheinen grid overflow-hidden rounded-md border-l border-t border-linie bg-weiss sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))]">
                  {b.fakten.map((f) => (
                    <div key={f._key} className="border-b border-r border-linie p-5">
                      <dt className="etikett">{f.bezeichnung}</dt>
                      <dd className="font-display mt-2 text-xl font-bold leading-tight">{f.wert}</dd>
                    </div>
                  ))}
                </dl>
              </Abschnitt>
            );
          case "bewertungenBaustein":
            return (
              <Abschnitt key={b._key} kurzzeile={b.kurzzeile} titel={b.titel} einleitung={b.einleitung} grund={grund}>
                <Bewertungen b={b} />
              </Abschnitt>
            );
          case "spaltenBaustein":
            return (
              <Abschnitt key={b._key} kurzzeile={b.kurzzeile} titel={b.titel} grund={grund}>
                <div className={`grid gap-10 ${b.spalten.length > 1 ? "md:grid-cols-2" : ""} ${b.spalten.length > 2 ? "lg:grid-cols-3" : ""}`}>
                  {b.spalten.map((sp) => (
                    <div key={sp._key} className="erscheinen border-t-2 border-tinte pt-5">
                      <h3 className="text-display-md">{sp.titel}</h3>
                      <RichText inhalt={sp.inhalt} className="mt-4" />
                    </div>
                  ))}
                </div>
              </Abschnitt>
            );
          case "bildBaustein":
            return (
              <Abschnitt key={b._key} kurzzeile={b.kurzzeile} titel={b.titel} grund={grund}>
                <figure className="erscheinen grid gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-end">
                  {/* Archivbild ist nur 400 px breit – nicht über die Originalgrösse hinaus vergrössern */}
                  <div className="overflow-hidden rounded-md border border-linie bg-weiss p-2" style={{ maxWidth: `${b.bild.breite + 18}px` }}>
                    <Bild bild={b.bild} sizes={`(min-width: 48rem) ${b.bild.breite}px, 100vw`} className="h-auto w-full rounded-[3px]" />
                  </div>
                  <figcaption>
                    {b.text && <p className="text-lead">{b.text}</p>}
                    {b.bild.bildunterschrift && <p className="etikett mt-4">{b.bild.bildunterschrift}</p>}
                  </figcaption>
                </figure>
              </Abschnitt>
            );
          case "kontaktBaustein":
            return (
              <Abschnitt key={b._key} kurzzeile={b.kurzzeile} titel={b.titel} einleitung={b.einleitung} grund={grund}>
                <Kontakt b={b} e={e} leistungen={leistungen} />
              </Abschnitt>
            );
          case "aufrufBaustein":
            // Bewusst kein zweites rotes Band: Rot bleibt Hero und Footer vorbehalten. Der Aufruf ist ein
            // «Zettel» mit rotem Kopfstreifen – wie ein Auftragsblatt, das auf dem Tresen liegt.
            return (
              <Abschnitt key={b._key} grund={grund}>
                <div className="blatt erscheinen overflow-hidden">
                  <div className="h-2 bg-rot" aria-hidden="true" />
                  <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                    <div>
                      {b.kurzzeile && <p className="etikett mb-3">{b.kurzzeile}</p>}
                      {b.titel && <h2 className="text-display-md max-w-[24ch]">{b.titel}</h2>}
                      {b.text && <p className="mt-4 max-w-[40rem] text-stahl">{b.text}</p>}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <SmartLink href={b.knopf.ziel} extern={b.knopf.extern} className="knopf knopf-rot">
                        {b.knopf.ziel.startsWith("tel:") ? <TelefonIcon /> : <PfeilIcon />}
                        {b.knopf.titel}
                      </SmartLink>
                      {b.zweiterKnopf && (
                        <SmartLink href={b.zweiterKnopf.ziel} extern={b.zweiterKnopf.extern} className="knopf knopf-hell">
                          {/maps/i.test(b.zweiterKnopf.ziel) ? <RouteIcon /> : <PfeilIcon />}
                          {b.zweiterKnopf.titel}
                        </SmartLink>
                      )}
                    </div>
                  </div>
                </div>
              </Abschnitt>
            );
          case "rechtstextBaustein":
            return (
              <Abschnitt key={b._key} grund="weiss" breite="schmal">
                {b.rechtstext.stand && <p className="etikett mb-6">Stand {new Date(b.rechtstext.stand).toLocaleDateString("de-CH", { day: "numeric", month: "long", year: "numeric" })}</p>}
                <RichText inhalt={b.rechtstext.inhalt} />
              </Abschnitt>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
