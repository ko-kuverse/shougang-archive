import type { Metadata } from "next";

import "@/app/globals.css";

import { BrandMark } from "@/components/ui/brand-mark";
import { siteConfig } from "@/config/site";
import { withBasePath } from "@/lib/base-path";
import { fontClassName } from "@/lib/fonts";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const metadata: Metadata = {
  title: "404 — 档案缺页",
  description: "请求的档案页面不存在。",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const dict = getDictionary("zh");

  return (
    <html lang="zh" className={fontClassName} suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var s=localStorage.getItem('shougang-archive-theme');var d=s==='dark'||((!s||s==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');}}catch(e){}})();",
          }}
        />
        <main className="not-found-page">
          <div className="not-found-panel">
            <div className="not-found-top">
              <span className="brand">
                <BrandMark className="brand-mark" />
                <span className="brand-text">
                  <span className="brand-name">{siteConfig.name}</span>
                  <span className="brand-sub">{siteConfig.nameZh}</span>
                </span>
              </span>
              <span className="plate-label">[ ERR / 404 ]</span>
            </div>

            <p className="not-found-code">404</p>
            <h1 className="not-found-title">{dict.notFound.title}</h1>
            <p className="not-found-description">
              {dict.notFound.description}
            </p>

            <div className="not-found-actions">
              <a
                href={withBasePath("/")}
                className="link-plate link-plate-solid"
              >
                {dict.notFound.backHome} →
              </a>
              <a
                href={withBasePath("/archive/")}
                className="link-plate link-plate-ghost"
              >
                {dict.notFound.browseDocs}
              </a>
              <a
                href={withBasePath("/gallery/")}
                className="link-plate link-plate-ghost"
              >
                实地图集 →
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
