import type { Metadata } from "next";
import Link from "next/link";
import { inhaltsquelle } from "@/lib/content";
import { telefonInternational } from "@/lib/seo";
import { PfeilIcon, TelefonIcon } from "@/components/Icons";

export const metadata: Metadata = { title: "Seite nicht gefunden", robots: { index: false, follow: false } };

/** 404 im Stil des Auftragsblatts: Position nicht gefunden. Wird als out/404.html exportiert (GitHub Pages nutzt sie automatisch). */
export default async function NichtGefunden() {
  const e = await (await inhaltsquelle()).getEinstellungen();
  return (
    <section className="container-seite py-abschnitt">
      <div className="blatt mx-auto max-w-2xl p-6 sm:p-10">
        <p className="etikett">Fehler 404 · Position nicht gefunden</p>
        <h1 className="mt-3 text-display-lg">Diese Seite steht nicht auf dem Auftragsblatt.</h1>
        <p className="mt-4 text-lead text-stahl">Die Adresse ist falsch geschrieben oder die Seite wurde verschoben. Was wir anbieten, finden Sie hier:</p>
        <ul className="mt-6 divide-y divide-linie border-y border-linie">
          {[{ titel: "Startseite", ziel: "/" }, ...e.navigation].map((l) => (
            <li key={l.ziel}>
              <Link href={l.ziel} className="flex min-h-12 items-center justify-between gap-3 font-display text-xl font-bold hover:text-rot">
                {l.titel}
                <PfeilIcon />
              </Link>
            </li>
          ))}
        </ul>
        <a href={`tel:${telefonInternational(e.telefon)}`} className="knopf knopf-rot mt-8">
          <TelefonIcon />
          Anrufen {e.telefon}
        </a>
      </div>
    </section>
  );
}
