import type { Hero } from "@/lib/content/types";
import { SmartLink } from "./SmartLink";
import { PfeilIcon, RouteIcon, TelefonIcon } from "./Icons";

function KnopfIcon({ ziel }: { ziel: string }) {
  if (ziel.startsWith("tel:")) return <TelefonIcon />;
  if (/maps|route/i.test(ziel)) return <RouteIcon />;
  return <PfeilIcon />;
}

/**
 * Hero «Schriftband»: der rote Balken zieht über die volle Breite – wie die Beschriftung
 * über den Werkstattfenstern an der Weststrasse. Beim Laden fährt das Band von links ein.
 */
export function Schriftband({ hero }: { hero: Hero }) {
  return (
    <section aria-labelledby="hero-titel" className="relative overflow-hidden pb-abschnitt pt-10 md:pt-16">
      <div className="container-seite">
        {hero.kurzzeile && <p className="etikett auftauchen mb-5">{hero.kurzzeile}</p>}
      </div>
      <div className="schriftband band-einfahren auf-rot">
        <div className="container-seite py-[clamp(1.5rem,1rem+2.5vw,3rem)]">
          <h1 id="hero-titel" className="band-text text-band max-w-[14ch]">
            {hero.titel}
          </h1>
        </div>
      </div>
      <div className="container-seite mt-8 grid gap-8 md:mt-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        {hero.text && <p className="auftauchen auftauchen-2 max-w-[38rem] text-lead text-tinte">{hero.text}</p>}
        {(hero.knopf || hero.zweiterKnopf) && (
          <div className="auftauchen auftauchen-3 flex flex-wrap gap-3">
            {hero.knopf && (
              <SmartLink href={hero.knopf.ziel} extern={hero.knopf.extern} className="knopf knopf-tinte">
                <KnopfIcon ziel={hero.knopf.ziel} />
                {hero.knopf.titel}
              </SmartLink>
            )}
            {hero.zweiterKnopf && (
              <SmartLink href={hero.zweiterKnopf.ziel} extern={hero.zweiterKnopf.extern} className="knopf knopf-hell">
                <KnopfIcon ziel={hero.zweiterKnopf.ziel} />
                {hero.zweiterKnopf.titel}
              </SmartLink>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
