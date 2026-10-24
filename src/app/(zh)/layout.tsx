import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";

import { RootShell } from "@/components/layout/root-shell";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { fontClassName } from "@/lib/fonts";
import { localeHtmlLang } from "@/lib/i18n/config";
import { rootMetadata } from "@/lib/seo";

export const metadata: Metadata = rootMetadata("zh");

export default function ZhRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang={localeHtmlLang.zh}
      className={fontClassName}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <RootShell locale="zh">{children}</RootShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
