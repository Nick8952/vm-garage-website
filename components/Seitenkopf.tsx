/** Kopf der Unterseiten: Etikett, grosser Titel, Einleitung – mit einem kurzen roten Strich als Zitat des Schriftbands. */
export function Seitenkopf({ titel, einleitung, kurzzeile }: { titel: string; einleitung?: string; kurzzeile?: string }) {
  return (
    <header className="container-seite pb-6 pt-12 md:pt-16">
      <div className="auftauchen mb-5 h-2 w-16 bg-rot" aria-hidden="true" />
      {kurzzeile && <p className="etikett auftauchen mb-3">{kurzzeile}</p>}
      <h1 className="auftauchen auftauchen-2 text-display-lg max-w-[20ch]">{titel}</h1>
      {einleitung && <p className="auftauchen auftauchen-3 mt-5 max-w-[40rem] text-lead text-stahl">{einleitung}</p>}
    </header>
  );
}
