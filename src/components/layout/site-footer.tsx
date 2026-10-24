import Link from "next/link";

import { BrandMark } from "@/components/ui/brand-mark";
import { ArrowUpIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getFooterLinks } from "@/lib/i18n/site-links";

export function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const links = getFooterLinks(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" data-pagefind-ignore>
      <div className="site-footer-grid">
        <div className="footer-brand">
          <div className="footer-brand-row">
            <BrandMark className="footer-mark" />
            <div>
              <div className="footer-name">
                {siteConfig.name}
                <span className="footer-name-sub">{siteConfig.nameZh}</span>
              </div>
              <div className="footer-tagline">{dict.site.tagline}</div>
            </div>
          </div>
          <div className="footer-status">
            <span className="status-dot" aria-hidden="true" />
            <span>{dict.footer.status}</span>
            <span className="footer-sep" aria-hidden="true">
              /
            </span>
            <span>{siteConfig.version}</span>
            <span className="footer-sep" aria-hidden="true">
              /
            </span>
            <span>{siteConfig.location}</span>
          </div>
        </div>

        <nav className="footer-nav" aria-label={dict.nav.primary}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="footer-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="footer-meta">
          <div className="footer-school">
            {siteConfig.school} · {siteConfig.college}
          </div>
          <div className="footer-course">{siteConfig.course}</div>
          <div className="footer-team">{dict.footer.rights}</div>
          <Link href="/sources" className="footer-link">
            {dict.footer.source}
          </Link>
          <a href="#top" className="footer-top-link">
            <ArrowUpIcon size={14} />
            {dict.footer.backToTop}
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © {year} {dict.footer.rights}. {dict.footer.builtWith}
        </span>
        <span className="footer-build">
          BUILD / {siteConfig.version} / STATIC
        </span>
      </div>
    </footer>
  );
}
