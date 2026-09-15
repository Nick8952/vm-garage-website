import Link from "next/link";
import type { ComponentProps } from "react";
import { istExternerLink, sichererLink } from "@/lib/assets";

type Props = Omit<ComponentProps<"a">, "href"> & { href: string; extern?: boolean };

/** Interner Link → next/link (mit Unterpfad); extern/tel/mailto → normales <a>. */
export function SmartLink({ href: roh, extern, children, ...rest }: Props) {
  const href = sichererLink(roh);
  if (istExternerLink(href)) {
    const neuerTab = extern ?? href.startsWith("http");
    return (
      <a href={href} {...(neuerTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
