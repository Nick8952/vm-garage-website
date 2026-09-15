import Link from "next/link";

/**
 * Typografische Wortmarke – es existiert kein Logo. Roter Block wie das Schriftband
 * an der Fassade, daneben der Firmenname.
 */
export function Wortmarke({ kurzname, firmenname, hell = false }: { kurzname: string; firmenname: string; hell?: boolean }) {
  return (
    <Link href="/" className={`inline-flex min-h-11 items-center gap-3 no-underline ${hell ? "text-weiss auf-rot" : "text-tinte"}`} aria-label={`${firmenname} – Startseite`}>
      <span
        aria-hidden="true"
        className={`font-display flex h-11 items-center rounded-[3px] px-2 text-[1.35rem] font-bold leading-none tracking-tight ${hell ? "bg-weiss text-rot" : "bg-rot text-weiss"}`}
      >
        V&amp;M
      </span>
      <span className="font-display text-[1.2rem] font-bold leading-none tracking-tight">{kurzname.replace(/^V ?& ?M ?/, "")}</span>
    </Link>
  );
}
