import type { Metadata } from "next";
import { inhaltsquelle } from "@/lib/content";
import { seitenMetadata } from "@/lib/seo";
import { Schriftband } from "@/components/Schriftband";
import { Seitenkopf } from "@/components/Seitenkopf";
import { Bausteine } from "@/components/bausteine/Bausteine";

export async function generateMetadata(): Promise<Metadata> {
  const q = await inhaltsquelle();
  const [seite, e] = await Promise.all([q.getSeite("start"), q.getEinstellungen()]);
  return seite ? seitenMetadata(seite, e) : {};
}

export default async function Startseite() {
  const q = await inhaltsquelle();
  const [seite, e, leistungen] = await Promise.all([q.getSeite("start"), q.getEinstellungen(), q.getLeistungen()]);
  if (!seite) throw new Error("Startseite (data/seiten/start.json bzw. Sanity-Dokument «start») fehlt.");
  return (
    <>
      {seite.hero ? <Schriftband hero={seite.hero} /> : <Seitenkopf titel={seite.titel} einleitung={seite.einleitung} />}
      <Bausteine bausteine={seite.bausteine} e={e} leistungen={leistungen} />
    </>
  );
}
