import Link from "next/link";
import type { Einstellungen } from "@/lib/content/types";
import { telefonInternational } from "@/lib/seo";
import { DatenschutzEinstellungen } from "./DatenschutzEinstellungen";
import { Wortmarke } from "./Wortmarke";
import { RouteIcon, TelefonIcon } from "./Icons";

/** Footer: das Schriftband kehrt unten wieder – mit Name, Adresse, Telefon. Darunter die Rechtslinks. */
export function Fusszeile({ e }: { e: Einstellungen }) {
  const tel = telefonInternational(e.telefon);
  return (
    <footer className="mt-auto">
      <div className="schriftband auf-rot">
        <div className="container-seite grid gap-8 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="band-text text-display-lg">{e.firmenname}</p>
            <address className="mt-4 not-italic text-weiss/90">
              {e.adresse.strasse}, {e.adresse.plz} {e.adresse.ort}
            </address>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${tel}`} className="knopf knopf-weiss">
              <TelefonIcon />
              {e.telefon}
            </a>
            {e.routenlink && (
              <a href={e.routenlink} target="_blank" rel="noopener noreferrer" className="knopf knopf-umriss-weiss">
                <RouteIcon />
                Route planen
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="bg-tinte text-beton">
        <div className="container-seite flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
          <Wortmarke kurzname={e.kurzname} firmenname={e.firmenname} hell />
          <nav aria-label="Rechtliches">
            <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              {e.navigation.map((l) => (
                <li key={l.ziel}>
                  <Link href={l.ziel} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                    {l.titel}
                  </Link>
                </li>
              ))}
              {e.rechtslinks.map((l) => (
                <li key={l.ziel}>
                  <Link href={l.ziel} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                    {l.titel}
                  </Link>
                </li>
              ))}
              <li>
                <DatenschutzEinstellungen />
              </li>
            </ul>
          </nav>
        </div>
        {e.demoHinweis && (
          <div className="border-t border-white/15">
            <p className="container-seite py-3 font-mono text-xs uppercase tracking-wider text-beton/70">{e.demoHinweis}</p>
          </div>
        )}
      </div>
    </footer>
  );
}
