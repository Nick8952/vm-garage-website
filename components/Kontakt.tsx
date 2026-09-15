import { Suspense } from "react";
import type { Einstellungen, KontaktBaustein, Leistung } from "@/lib/content/types";
import { telefonInternational } from "@/lib/seo";
import { AnfrageAssistent } from "./AnfrageAssistent";
import { AdresseKopieren } from "./AdresseKopieren";
import { RouteIcon, TelefonIcon } from "./Icons";

/** Kontaktbereich: Adresse, Telefon, Route, Öffnungszeiten (oder Hinweis) und optional der Anfrage-Assistent. */
export function Kontakt({ b, e, leistungen }: { b: KontaktBaustein; e: Einstellungen; leistungen: Leistung[] }) {
  const tel = telefonInternational(e.telefon);
  const adresseText = `${e.firmenname}, ${e.adresse.strasse}, ${e.adresse.plz} ${e.adresse.ort}`;
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
      <div className="erscheinen">
        <dl className="divide-y divide-linie border-y border-linie">
          <div className="grid gap-1 py-5 sm:grid-cols-[7rem_1fr]">
            <dt className="etikett pt-1">Adresse</dt>
            <dd>
              <address className="not-italic">
                <span className="font-display text-xl font-bold">{e.firmenname}</span>
                <br />
                {e.adresse.strasse}
                <br />
                {e.adresse.plz} {e.adresse.ort}
              </address>
              <div className="mt-3 flex flex-wrap gap-2">
                {e.routenlink && (
                  <a href={e.routenlink} target="_blank" rel="noopener noreferrer" className="knopf knopf-hell min-h-11 py-2 text-sm">
                    <RouteIcon />
                    Route planen
                  </a>
                )}
                <AdresseKopieren adresse={adresseText} />
              </div>
            </dd>
          </div>
          <div className="grid gap-1 py-5 sm:grid-cols-[7rem_1fr]">
            <dt className="etikett pt-1">Telefon</dt>
            <dd>
              <a href={`tel:${tel}`} className="font-display inline-flex min-h-11 items-center gap-2 text-2xl font-bold text-tinte hover:text-rot">
                <TelefonIcon />
                {e.telefon}
              </a>
            </dd>
          </div>
          {e.email && (
            <div className="grid gap-1 py-5 sm:grid-cols-[7rem_1fr]">
              <dt className="etikett pt-1">E-Mail</dt>
              <dd>
                <a href={`mailto:${e.email}`} className="inline-flex min-h-11 items-center font-semibold text-rot-dunkel underline-offset-4 hover:underline">
                  {e.email}
                </a>
              </dd>
            </div>
          )}
          <div className="grid gap-1 py-5 sm:grid-cols-[7rem_1fr]">
            <dt className="etikett pt-1">Zeiten</dt>
            <dd>
              {e.oeffnungszeiten.length ? (
                <>
                  <ul>
                    {e.oeffnungszeiten.map((z) => (
                      <li key={z._key} className="flex flex-wrap gap-x-3">
                        <span className="font-semibold">{z.tage}</span>
                        <span>{z.zeiten}</span>
                      </li>
                    ))}
                  </ul>
                  {e.oeffnungszeitenHinweis && <p className="mt-2 text-sm text-stahl">{e.oeffnungszeitenHinweis}</p>}
                </>
              ) : (
                <p>
                  Öffnungszeiten und Termine bitte telefonisch erfragen.
                </p>
              )}
            </dd>
          </div>
        </dl>
        {e.routenlink && (
          <p className="mt-4 text-sm text-stahl">«Route planen» öffnet Google Maps in einem neuen Tab – erst mit dem Klick verlassen Sie diese Website.</p>
        )}
      </div>
      {b.mitFormular && (
        <div className="erscheinen">
          <Suspense fallback={<div className="blatt min-h-[32rem] p-8" aria-busy="true"><p className="etikett">Anfrage-Assistent</p></div>}>
          <AnfrageAssistent leistungen={leistungen.map(({ id, titel }) => ({ id, titel }))} telefon={e.telefon} tel={tel} email={e.email} firmenname={e.firmenname} hinweis={b.formularHinweis} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
