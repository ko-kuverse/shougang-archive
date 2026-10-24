import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { Locale } from "@/lib/i18n/config";

export function RootShell({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <div className="site-shell" id="top">
      <a className="skip-link" href="#main">
        跳到正文
      </a>
      <SiteHeader locale={locale} />
      <div className="site-content">{children}</div>
      <SiteFooter locale={locale} />
      <div className="scanlines" aria-hidden="true" />
    </div>
  );
}
