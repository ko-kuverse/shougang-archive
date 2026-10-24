import Link from "next/link";

import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteNav } from "@/components/layout/site-nav";
import { Search } from "@/components/search/search";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { BrandMark } from "@/components/ui/brand-mark";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/paths";

export function SiteHeader({ locale }: { locale: Locale }) {
  return (
    <header className="site-header" data-pagefind-ignore>
      <div className="site-header-inner">
        <Link
          href={localePath(locale, "/")}
          className="brand"
          aria-label={`${siteConfig.name} — ${siteConfig.docsTitle}`}
        >
          <BrandMark className="brand-mark" />
          <span className="brand-text">
            <span className="brand-name">{siteConfig.name}</span>
            <span className="brand-sub">{siteConfig.nameZh}</span>
          </span>
          <span className="brand-version">{siteConfig.version}</span>
        </Link>

        <SiteNav locale={locale} />

        <div className="header-actions">
          <Search locale={locale} />
          <ThemeToggle locale={locale} compact className="desktop-only" />
          <MobileNav locale={locale} />
        </div>
      </div>
      <div className="header-hazard" aria-hidden="true" />
    </header>
  );
}
