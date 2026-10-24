import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

import { ExternalLinkIcon } from "@/components/ui/icons";
import type { Locale } from "@/lib/i18n/config";

type MdxLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href?: string;
  children?: ReactNode;
  locale?: Locale;
};

function localizeHref(href: string, locale?: Locale): string {
  if (!locale || locale === "zh") return href;
  if (href === "/en" || href.startsWith("/en/")) return href;
  return href === "/" ? "/en" : `/en${href}`;
}

export function MdxLink({
  href = "",
  children,
  locale,
  ...props
}: MdxLinkProps) {
  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  if (href.startsWith("/")) {
    return (
      <Link href={localizeHref(href, locale)} {...props}>
        {children}
      </Link>
    );
  }

  const isExternal = /^https?:\/\//i.test(href);

  return (
    <a
      href={href}
      {...props}
      {...(isExternal
        ? { target: "_blank", rel: "noreferrer noopener" }
        : {})}
    >
      {children}
      {isExternal ? (
        <ExternalLinkIcon
          size={12}
          className="ml-1 inline-block align-baseline"
        />
      ) : null}
    </a>
  );
}
