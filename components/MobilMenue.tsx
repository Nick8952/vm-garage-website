"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { Link as LinkTyp } from "@/lib/content/types";
import { MenueIcon, SchliessenIcon, TelefonIcon } from "./Icons";

interface Props {
  navigation: LinkTyp[];
  rechtslinks: LinkTyp[];
  telefon: string;
  tel: string;
  kurzname: string;
  firmenname: string;
}

/**
 * Mobile Navigation als natives <dialog> (modal): Fokusfang, Esc und Klick auf den Hintergrund
 * schliessen; der Fokus kehrt zum Menüknopf zurück. Schliesst beim Seitenwechsel.
 */
export function MobilMenue({ navigation, rechtslinks, telefon, tel, kurzname }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const pfad = usePathname();

  useEffect(() => {
    dialog.current?.close();
  }, [pfad]);

  const oeffnen = () => dialog.current?.showModal();
  const schliessen = () => dialog.current?.close();

  return (
    <div className="md:hidden">
      <button type="button" onClick={oeffnen} className="knopf knopf-hell min-h-11 w-11 px-0" aria-label="Menü öffnen" aria-haspopup="dialog">
        <MenueIcon />
      </button>
      <dialog
        ref={dialog}
        aria-label="Navigation"
        className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-beton text-tinte backdrop:bg-tinte/40"
        onClick={(ev) => {
          if (ev.target === dialog.current) schliessen();
        }}
      >
        <div className="flex h-full flex-col px-rand pb-8 pt-4">
          <div className="flex h-12 items-center justify-between">
            <span className="font-display text-xl font-bold">{kurzname}</span>
            <button type="button" onClick={schliessen} className="knopf knopf-hell min-h-11 w-11 px-0" aria-label="Menü schliessen">
              <SchliessenIcon />
            </button>
          </div>
          <nav aria-label="Hauptnavigation (mobil)" className="mt-8">
            <ul className="divide-y divide-linie border-y border-linie">
              {[{ titel: "Startseite", ziel: "/" }, ...navigation].map((l) => (
                <li key={l.ziel}>
                  <Link href={l.ziel} className="font-display flex min-h-14 items-center text-2xl font-bold" aria-current={pfad === l.ziel || (l.ziel !== "/" && pfad.startsWith(l.ziel)) ? "page" : undefined}>
                    {l.titel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <a href={`tel:${tel}`} className="knopf knopf-rot mt-8 w-full">
            <TelefonIcon />
            Anrufen {telefon}
          </a>
          <ul className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-8 text-sm text-stahl">
            {rechtslinks.map((l) => (
              <li key={l.ziel}>
                <Link href={l.ziel} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                  {l.titel}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </div>
  );
}
