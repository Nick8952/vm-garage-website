import type { BewertungenBaustein } from "@/lib/content/types";
import { SternIcon } from "./Icons";

/**
 * Zeigt wörtliche Kundenzitate als Kärtchen im Auftragsblatt-Stil (weiss, Linienraster).
 * Sterne sind reine Anzeige des jeweils gepflegten Werts – nie erfunden, nie aggregiert.
 * Jede Karte nennt Quelle (+ optionalen Link), damit die Aussage nachprüfbar bleibt.
 */
export function Bewertungen({ b }: { b: BewertungenBaustein }) {
  if (!b.bewertungen.length) return null;
  return (
    <div className="erscheinen grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {b.bewertungen.map((r) => (
        <figure key={r.id} className="blatt flex flex-col gap-3 p-6">
          <div className="flex items-center gap-1 text-rot" aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => (
              <SternIcon key={i} gefuellt={i < r.sterne} />
            ))}
          </div>
          <span className="sr-only">{r.sterne} von 5 Sternen</span>
          <blockquote className="flex-1 text-[0.97rem] leading-relaxed text-tinte">
            <p>«{r.text}»</p>
          </blockquote>
          <figcaption className="etikett flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-stahl">
            <span className="font-semibold not-italic text-tinte">{r.autor}</span>
            <span aria-hidden="true">·</span>
            {r.quellUrl ? (
              <a href={r.quellUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                {r.quelle}
              </a>
            ) : (
              <span>{r.quelle}</span>
            )}
            {r.datum && (
              <>
                <span aria-hidden="true">·</span>
                <span>{r.datum}</span>
              </>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
