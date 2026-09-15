"use client";
import Link from "next/link";
import { useRef } from "react";
import { HakenIcon, SchliessenIcon } from "./Icons";

/**
 * «Datenschutz-Einstellungen» im Footer. Diese Website setzt keine Cookies, nutzt keinen
 * Browser-Speicher und lädt keine Inhalte von Drittanbietern – es gibt nichts, dem man
 * zustimmen oder widersprechen könnte. Statt eines irreführenden Banners mit wirkungslosen
 * Schaltern zeigt dieser Dialog den tatsächlichen Zustand. Natives <dialog>: Fokusfang, Esc,
 * Fokus kehrt zum Knopf zurück. Kommt später ein einwilligungspflichtiger Dienst dazu,
 * wird hier ein echter Banner mit Kategorien nötig (docs/UMSTELLUNG-VERCEL.md).
 */
export function DatenschutzEinstellungen() {
  const dialog = useRef<HTMLDialogElement>(null);
  const punkte = [
    ["Cookies", "Keine. Weder notwendige noch optionale."],
    ["Browser-Speicher", "Nichts wird in Local Storage, Session Storage oder IndexedDB abgelegt."],
    ["Statistik / Marketing", "Keine Analyse-, Werbe- oder Social-Media-Dienste."],
    ["Eingebettete Inhalte", "Keine Karten, Videos oder Schriften von fremden Servern – Schriften liegen lokal."],
    ["Anfrage-Assistent", "Läuft nur in Ihrem Browser; die Eingaben werden nicht übertragen und nicht gespeichert."],
    ["Externe Links", "«Route planen» (Google Maps) und Telefonlinks öffnen erst nach Ihrem Klick einen anderen Dienst."],
    ["Hosting", "GitHub Pages protokolliert beim Abruf Ihre IP-Adresse zu Sicherheitszwecken (siehe Datenschutzerklärung)."],
  ];
  return (
    <>
      <button type="button" onClick={() => dialog.current?.showModal()} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
        Datenschutz-Einstellungen
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="ds-titel"
        className="m-auto max-h-[calc(100dvh-2rem)] w-[min(100%-2rem,36rem)] overflow-y-auto rounded-md bg-weiss p-0 text-tinte shadow-2xl backdrop:bg-tinte/50"
        onClick={(ev) => {
          if (ev.target === dialog.current) dialog.current?.close();
        }}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="etikett">Datenschutz-Einstellungen</p>
              <h2 id="ds-titel" className="mt-2 text-display-md">
                Nichts zu wählen – und das ist so gewollt.
              </h2>
            </div>
            <button type="button" onClick={() => dialog.current?.close()} className="knopf knopf-hell min-h-11 w-11 flex-none px-0" aria-label="Dialog schliessen">
              <SchliessenIcon />
            </button>
          </div>
          <p className="mt-4 text-stahl">
            Diese Website verwendet keine Cookies und keine Dienste, die eine Einwilligung brauchen. Deshalb gibt es keine Schalter, die etwas an- oder abstellen könnten.
          </p>
          <ul className="mt-6 divide-y divide-linie border-y border-linie">
            {punkte.map(([titel, text]) => (
              <li key={titel} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr]">
                <span className="inline-flex items-center gap-2 font-semibold">
                  <span className="text-rot"><HakenIcon /></span>
                  {titel}
                </span>
                <span className="text-stahl">{text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => dialog.current?.close()} className="knopf knopf-tinte">
              Verstanden
            </button>
            <Link href="/datenschutz" className="inline-flex min-h-11 items-center font-semibold text-rot-dunkel underline-offset-4 hover:underline" onClick={() => dialog.current?.close()}>
              Zur Datenschutzerklärung
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
