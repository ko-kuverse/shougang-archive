"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isActivePath } from "@/lib/i18n/paths";
import { getSiteLinks } from "@/lib/i18n/site-links";
import { cn } from "@/lib/utils";

export function SiteNav({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const pathname = usePathname() || "/";
  const links = getSiteLinks(locale);

  return (
    <nav className="desktop-nav" aria-label={dict.nav.primary}>
      {links.map((link) => {
        const active = isActivePath(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn("nav-link", active && "is-active")}
            aria-current={active ? "page" : undefined}
          >
            <span className="nav-bracket" aria-hidden="true">
              [
            </span>
            {link.label}
            <span className="nav-bracket" aria-hidden="true">
              ]
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
