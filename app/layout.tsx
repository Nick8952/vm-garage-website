import type { Metadata, Viewport } from "next";
import "./globals.css";
import { inhaltsquelle } from "@/lib/content";
import { Kopfzeile } from "@/components/Kopfzeile";
import { Fusszeile } from "@/components/Fusszeile";
import { VorschauWerkzeuge } from "@/lib/vorschau/VorschauWerkzeuge";
import { siteUrl } from "@/lib/deploy-ziel";
import { betriebJsonLd, indexierungErlaubt, jsonLdSicher } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const e = await (await inhaltsquelle()).getEinstellungen();
  return {
    metadataBase: new URL(siteUrl),
    title: { default: e.kurzname, template: `%s | ${e.seo.titelZusatz}` },
    description: e.seo.beschreibung,
    robots: indexierungErlaubt ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export const viewport: Viewport = { themeColor: "#c4301f", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const e = await (await inhaltsquelle()).getEinstellungen();
  return (
    <html lang="de-CH" className="h-full">
      <body className="flex min-h-full flex-col">
        <Kopfzeile e={e} />
        <main id="inhalt" className="flex-1">
          {children}
        </main>
        <Fusszeile e={e} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdSicher(betriebJsonLd(e)) }} />
        <VorschauWerkzeuge />
      </body>
    </html>
  );
}
