import type { CSSProperties } from "react";
import type { Bild as BildTyp } from "@/lib/content/types";
import { assetUrl } from "@/lib/assets";

interface Props {
  bild: BildTyp;
  /** `sizes`-Angabe für den Browser, z. B. "(min-width: 64rem) 50vw, 100vw" */
  sizes: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
}

/**
 * Bildausgabe ohne Server: `srcset` aus den vorbereiteten Varianten (lokal: public/images,
 * Sanity: Bild-CDN). Breite/Höhe sind gesetzt, damit nichts springt (CLS).
 */
export function Bild({ bild, sizes, className, style, priority }: Props) {
  const quellen = bild.quellen;
  const groesste = quellen[quellen.length - 1];
  return (
    // eslint-disable-next-line @next/next/no-img-element -- bewusst: statischer Export ohne Bild-Optimierer
    <img
      src={assetUrl(groesste.url)}
      srcSet={quellen.map((q) => `${assetUrl(q.url)} ${q.breite}w`).join(", ")}
      sizes={sizes}
      width={bild.breite}
      height={bild.hoehe}
      alt={bild.alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      className={className}
      style={style}
    />
  );
}
