import Link from "next/link";
import { GRUPPEN_TITEL, type Leistung, type LeistungsGruppe, type Link as LinkTyp } from "@/lib/content/types";
import { RichText } from "./RichText";
import { PfeilIcon } from "./Icons";

interface Props {
  leistungen: Leistung[];
  darstellung: "blatt" | "kompakt";
  weiterLink?: LinkTyp;
}

/**
 * Leistungen als Werkstatt-Auftragsblatt: Positionen mit Kästchen und Linienraster.
 * «Anfragen» übergibt die Position an den Anfrage-Assistenten (/kontakt?anliegen=…).
 * Kompakt (Startseite): eine Liste; Blatt: nach Gruppen mit ausführlichem Text.
 */
export function Auftragsblatt({ leistungen, darstellung, weiterLink }: Props) {
  const gruppen = (["werkstatt", "carrosserie", "handel"] as LeistungsGruppe[]).map((g) => ({ g, liste: leistungen.filter((l) => l.gruppe === g) })).filter((x) => x.liste.length);
  const kompakt = darstellung === "kompakt";

  return (
    <div className="blatt erscheinen px-5 py-2 sm:px-8">
      <div className="flex items-center justify-between gap-4 py-4">
        <span className="etikett">Position</span>
        <span className="etikett hidden sm:inline">Auftragsblatt · alle Marken</span>
      </div>
      {kompakt ? (
        <ol className="m-0 list-none p-0">
          {leistungen.map((l) => (
            <Zeile key={l.id} leistung={l} kompakt />
          ))}
        </ol>
      ) : (
        gruppen.map(({ g, liste }) => (
          <section key={g} aria-labelledby={`gruppe-${g}`} className="border-t-2 border-tinte">
            <h3 id={`gruppe-${g}`} className="etikett py-3 text-tinte">
              {GRUPPEN_TITEL[g]}
            </h3>
            <ol className="m-0 list-none p-0">
              {liste.map((l) => (
                <Zeile key={l.id} leistung={l} />
              ))}
            </ol>
          </section>
        ))
      )}
      {weiterLink && (
        <div className="border-t border-linie py-5">
          <Link href={weiterLink.ziel} className="inline-flex min-h-11 items-center gap-2 font-bold text-rot-dunkel underline-offset-4 hover:underline">
            {weiterLink.titel}
            <PfeilIcon />
          </Link>
        </div>
      )}
    </div>
  );
}

function Zeile({ leistung, kompakt = false }: { leistung: Leistung; kompakt?: boolean }) {
  const kennung = leistung.id.replace(/^leistung-/, "");
  return (
    <li className="blatt-zeile -mx-5 px-5 sm:-mx-8 sm:px-8" id={kompakt ? undefined : kennung}>
      <span className="kaestchen" aria-hidden="true" />
      <div className="min-w-0">
        <p className="font-display text-xl font-bold leading-tight sm:text-2xl">{leistung.titel}</p>
        <p className="mt-1 text-stahl">{leistung.kurz}</p>
        {!kompakt && leistung.inhalt && <RichText inhalt={leistung.inhalt} className="mt-3 text-[0.97rem]" />}
      </div>
      <Link
        href={`/kontakt?anliegen=${encodeURIComponent(kennung)}`}
        className="col-start-2 inline-flex min-h-11 items-center gap-1 self-start font-mono text-sm font-medium uppercase tracking-wider text-rot-dunkel underline-offset-4 hover:underline sm:col-start-3"
        aria-label={`${leistung.titel} anfragen`}
      >
        Anfragen
        <PfeilIcon />
      </Link>
    </li>
  );
}
