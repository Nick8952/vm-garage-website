import Link from "next/link";
import type { Einstellungen } from "@/lib/content/types";
import { telefonInternational } from "@/lib/seo";
import { Wortmarke } from "./Wortmarke";
import { MobilMenue } from "./MobilMenue";
import { TelefonIcon } from "./Icons";

export function Kopfzeile({ e }: { e: Einstellungen }) {
  const tel = telefonInternational(e.telefon);
  return (
    <header className="sticky top-0 z-40 border-b border-linie bg-weiss/95 backdrop-blur-sm">
      <a href="#inhalt" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-tinte focus:px-3 focus:py-2 focus:text-weiss">
        Zum Inhalt springen
      </a>
      <div className="container-seite flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Wortmarke kurzname={e.kurzname} firmenname={e.firmenname} />
        <nav aria-label="Hauptnavigation" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {e.navigation.map((l) => (
              <li key={l.ziel}>
                <Link href={l.ziel} className="inline-flex min-h-11 items-center rounded px-3 font-semibold text-tinte transition-colors hover:text-rot">
                  {l.titel}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a href={`tel:${tel}`} className="knopf knopf-rot hidden min-h-11 py-2 sm:inline-flex" aria-label={`Anrufen: ${e.telefon}`}>
            <TelefonIcon />
            <span>{e.telefon}</span>
          </a>
          <a href={`tel:${tel}`} className="knopf knopf-rot min-h-11 w-11 px-0 sm:hidden" aria-label={`Anrufen: ${e.telefon}`}>
            <TelefonIcon />
          </a>
          <MobilMenue navigation={e.navigation} rechtslinks={e.rechtslinks} telefon={e.telefon} tel={tel} kurzname={e.kurzname} firmenname={e.firmenname} />
        </div>
      </div>
    </header>
  );
}
