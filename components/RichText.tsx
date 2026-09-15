import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { RichText as RichTextTyp } from "@/lib/content/types";
import { SmartLink } from "./SmartLink";

const komponenten: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      return (
        <SmartLink href={href} extern={value?.extern}>
          {children}
        </SmartLink>
      );
    },
  },
  // Unbekannte Blocktypen nicht stumm verschlucken, sondern sichtbar ignorieren (Build-Log).
  unknownType: ({ value }) => {
    console.warn("Unbekannter Rich-Text-Block:", (value as { _type?: string })?._type);
    return null;
  },
};

export function RichText({ inhalt, className }: { inhalt: RichTextTyp; className?: string }) {
  return (
    <div className={`fliesstext ${className ?? ""}`}>
      <PortableText value={inhalt} components={komponenten} />
    </div>
  );
}
