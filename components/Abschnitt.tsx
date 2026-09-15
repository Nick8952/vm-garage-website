import type { ReactNode } from "react";

interface Props {
  id?: string;
  kurzzeile?: string;
  titel?: string;
  einleitung?: string;
  /** Grund: Beton (Standard) oder Weiss */
  grund?: "beton" | "weiss";
  breite?: "schmal" | "normal";
  children: ReactNode;
  className?: string;
}

/** Einheitlicher Seitenabschnitt: Etikett + Titel + Inhalt, mit Scroll-Erscheinen. */
export function Abschnitt({ id, kurzzeile, titel, einleitung, grund = "beton", breite = "normal", children, className }: Props) {
  const Ueberschrift = titel ? "h2" : "div";
  return (
    <section id={id} className={`py-abschnitt ${grund === "weiss" ? "bg-weiss" : ""} ${className ?? ""}`}>
      <div className={`container-seite ${breite === "schmal" ? "max-w-3xl" : ""}`}>
        {(kurzzeile || titel || einleitung) && (
          <header className="erscheinen mb-10 max-w-3xl">
            {kurzzeile && <p className="etikett mb-3">{kurzzeile}</p>}
            {titel && <Ueberschrift className="text-display-lg">{titel}</Ueberschrift>}
            {einleitung && <p className="mt-4 text-lead text-stahl">{einleitung}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
