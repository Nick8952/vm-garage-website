"use client";
import { useId, useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import type { Leistung } from "@/lib/content/types";
import { HakenIcon, KopierenIcon, MailIcon, TelefonIcon } from "./Icons";

interface Props {
  leistungen: Pick<Leistung, "id" | "titel">[];
  telefon: string;
  tel: string;
  /** Nur gesetzt, wenn eine verifizierte Adresse vorliegt – dann «E-Mail vorbereiten» statt Kopierhilfe. */
  email?: string;
  firmenname: string;
  hinweis?: string;
}

/**
 * Anfrage-Assistent: stellt aus wenigen Angaben einen Anfragetext zusammen.
 * Es wird NICHTS versendet oder gespeichert. Ergebnis: Text kopieren + anrufen,
 * oder – nur mit hinterlegter E-Mail-Adresse – ein vorbefüllter mailto-Entwurf.
 * `?anliegen=<kennung>` in der URL wählt die Leistung vor (Link «Anfragen» auf dem Auftragsblatt).
 * useSearchParams braucht eine Suspense-Grenze (Kontakt.tsx) – im statischen Export wird bis dorthin clientseitig gerendert.
 */
export function AnfrageAssistent({ leistungen, telefon, tel, email, firmenname, hinweis }: Props) {
  const id = useId();
  const params = useSearchParams();
  const vorwahl = params.get("anliegen");
  const [anliegen, setAnliegen] = useState(() => (vorwahl && leistungen.some((l) => l.id === `leistung-${vorwahl}`) ? `leistung-${vorwahl}` : ""));
  const [fahrzeug, setFahrzeug] = useState("");
  const [name, setName] = useState("");
  const [rueckruf, setRueckruf] = useState("");
  const [nachricht, setNachricht] = useState("");
  const [fertig, setFertig] = useState(false);
  const [kopiert, setKopiert] = useState<"nein" | "ja" | "fehler">("nein");
  const [fehler, setFehler] = useState<string | null>(null);

  const anliegenTitel = leistungen.find((l) => l.id === anliegen)?.titel ?? (anliegen === "sonstiges" ? "Sonstiges" : "");

  const text = useMemo(() => {
    const zeilen = [
      `Anfrage an ${firmenname}`,
      "",
      `Anliegen: ${anliegenTitel || "–"}`,
      `Fahrzeug: ${fahrzeug || "–"}`,
      `Name: ${name || "–"}`,
      `Rückruf unter: ${rueckruf || "–"}`,
    ];
    if (nachricht) zeilen.push("", nachricht);
    return zeilen.join("\n");
  }, [firmenname, anliegenTitel, fahrzeug, name, rueckruf, nachricht]);

  function pruefen(ev: FormEvent) {
    ev.preventDefault();
    if (!anliegen) {
      setFehler("Bitte wählen Sie ein Anliegen.");
      document.getElementById(`${id}-anliegen`)?.focus();
      return;
    }
    setFehler(null);
    setFertig(true);
    setKopiert("nein");
  }

  async function kopieren() {
    try {
      await navigator.clipboard.writeText(text);
      setKopiert("ja");
    } catch {
      setKopiert("fehler");
    }
  }

  const mailto = email ? `mailto:${email}?subject=${encodeURIComponent(`Anfrage: ${anliegenTitel}`)}&body=${encodeURIComponent(text)}` : undefined;

  return (
    <form onSubmit={pruefen} noValidate className="blatt p-5 sm:p-8" aria-labelledby={`${id}-titel`}>
      <p className="etikett">Anfrage-Assistent</p>
      <h3 id={`${id}-titel`} className="mt-2 text-display-md">
        Anfrage vorbereiten
      </h3>
      <p className="mt-3 text-stahl">
        {hinweis ?? "Der Assistent bereitet nur einen Text vor. Es wird nichts automatisch versendet und nichts gespeichert."}
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-anliegen`} className="mb-1.5 block font-semibold">
            Anliegen <span className="text-rot" aria-hidden="true">*</span>
          </label>
          <select id={`${id}-anliegen`} className="feld" value={anliegen} onChange={(e) => { setAnliegen(e.target.value); if (e.target.value) setFehler(null); }} required aria-required="true" aria-invalid={fehler ? "true" : undefined} aria-describedby={fehler ? `${id}-fehler` : undefined}>
            <option value="">Bitte wählen</option>
            {leistungen.map((l) => (
              <option key={l.id} value={l.id}>
                {l.titel}
              </option>
            ))}
            <option value="sonstiges">Sonstiges</option>
          </select>
          {fehler && (
            <p id={`${id}-fehler`} className="mt-1.5 text-sm font-semibold text-rot-dunkel" role="alert">
              {fehler}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${id}-fahrzeug`} className="mb-1.5 block font-semibold">
            Fahrzeug
          </label>
          <input id={`${id}-fahrzeug`} className="feld" value={fahrzeug} onChange={(e) => setFahrzeug(e.target.value)} placeholder="Marke, Modell, Jahrgang" autoComplete="off" />
        </div>
        <div>
          <label htmlFor={`${id}-name`} className="mb-1.5 block font-semibold">
            Ihr Name
          </label>
          <input id={`${id}-name`} className="feld" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </div>
        <div>
          <label htmlFor={`${id}-rueckruf`} className="mb-1.5 block font-semibold">
            Rückrufnummer
          </label>
          <input id={`${id}-rueckruf`} className="feld" type="tel" value={rueckruf} onChange={(e) => setRueckruf(e.target.value)} autoComplete="tel" inputMode="tel" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-nachricht`} className="mb-1.5 block font-semibold">
            Nachricht
          </label>
          <textarea id={`${id}-nachricht`} className="feld min-h-28" value={nachricht} onChange={(e) => setNachricht(e.target.value)} rows={4} placeholder="Was ist los, seit wann, Wunschtermin?" />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" className="knopf knopf-tinte">
          Text zusammenstellen
        </button>
      </div>

      {fertig && (
        <div className="mt-8 border-t border-linie pt-6" role="region" aria-label="Vorbereitete Anfrage">
          {/* Kurze Live-Ansage statt der ganzen (sich ändernden) Vorschau */}
          <p className="sr-only" role="status">Anfragetext zusammengestellt. Er wird nicht versendet.</p>
          <p className="etikett">Ihre Anfrage – nicht versendet</p>
          <pre className="mt-3 whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded border border-linie bg-beton-hell p-4 font-sans text-[0.97rem] leading-relaxed">{text}</pre>
          <div className="mt-4 flex flex-wrap gap-3">
            {mailto ? (
              <a href={mailto} className="knopf knopf-rot">
                <MailIcon />
                E-Mail vorbereiten
              </a>
            ) : (
              <button type="button" onClick={kopieren} className="knopf knopf-rot">
                {kopiert === "ja" ? <HakenIcon /> : <KopierenIcon />}
                {kopiert === "ja" ? "Text kopiert" : "Text kopieren"}
              </button>
            )}
            <a href={`tel:${tel}`} className="knopf knopf-hell">
              <TelefonIcon />
              Anrufen {telefon}
            </a>
          </div>
          <p className="mt-3 text-sm text-stahl" role="status">
            {mailto
              ? "Öffnet Ihr E-Mail-Programm mit einem Entwurf. Gesendet wird erst, wenn Sie dort auf «Senden» klicken."
              : kopiert === "fehler"
                ? "Kopieren nicht möglich – bitte den Text oben markieren und kopieren."
                : "Der Betrieb hat aktuell keine hinterlegte E-Mail-Adresse. Kopieren Sie den Text als Gedankenstütze und rufen Sie an."}
          </p>
        </div>
      )}
    </form>
  );
}
