"use client";
import { useState } from "react";
import { HakenIcon, KopierenIcon } from "./Icons";

/** Kopiert die Adresse in die Zwischenablage; Rückmeldung per aria-live. Ohne Clipboard-API: Hinweis zum Markieren. */
export function AdresseKopieren({ adresse }: { adresse: string }) {
  const [zustand, setZustand] = useState<"bereit" | "kopiert" | "fehler">("bereit");
  async function kopieren() {
    try {
      await navigator.clipboard.writeText(adresse);
      setZustand("kopiert");
    } catch {
      setZustand("fehler");
    }
    setTimeout(() => setZustand("bereit"), 2500);
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button type="button" onClick={kopieren} className="knopf knopf-hell min-h-11 py-2 text-sm">
        {zustand === "kopiert" ? <HakenIcon /> : <KopierenIcon />}
        {zustand === "kopiert" ? "Kopiert" : "Adresse kopieren"}
      </button>
      <span role="status" aria-live="polite" className="text-sm text-stahl">
        {zustand === "fehler" ? "Kopieren nicht möglich – bitte Adresse markieren." : ""}
      </span>
    </span>
  );
}
