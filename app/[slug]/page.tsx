import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { inhaltsquelle } from "@/lib/content";
import { seitenMetadata } from "@/lib/seo";
import { Seitenkopf } from "@/components/Seitenkopf";
import { Schriftband } from "@/components/Schriftband";
import { Bausteine } from "@/components/bausteine/Bausteine";

/**
 * Alle Unterseiten kommen aus dem Inhaltsmodell «seite». Im statischen Export werden sie
 * über generateStaticParams vollständig aufgezählt (dynamicParams = false → unbekannte Slugs
 * enden auf der 404-Seite). Neue Seiten brauchen im Export einen Rebuild; auf Vercel siehe
 * docs/UMSTELLUNG-VERCEL.md.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await (await inhaltsquelle()).getAlleSeitenSlugs();
  return slugs.filter((s) => s !== "start").map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const q = await inhaltsquelle();
  const [seite, e] = await Promise.all([q.getSeite(slug), q.getEinstellungen()]);
  return seite ? seitenMetadata(seite, e) : {};
}

export default async function Unterseite({ params }: Props) {
  const { slug } = await params;
  if (slug === "start") notFound();
  const q = await inhaltsquelle();
  const [seite, e, leistungen] = await Promise.all([q.getSeite(slug), q.getEinstellungen(), q.getLeistungen()]);
  if (!seite) notFound();
  return (
    <>
      {seite.hero ? <Schriftband hero={seite.hero} /> : <Seitenkopf titel={seite.titel} einleitung={seite.einleitung} />}
      <Bausteine bausteine={seite.bausteine} e={e} leistungen={leistungen} />
    </>
  );
}
