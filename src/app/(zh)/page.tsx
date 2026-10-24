import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildPageMetadata } from "@/lib/seo";
import { HomeView } from "@/views/home-view";

const dict = getDictionary("zh");

export const metadata: Metadata = buildPageMetadata({
  locale: "zh",
  title: siteConfig.docsTitle,
  titleAbsolute: true,
  description: dict.site.description,
  path: "/",
});

export default function ZhHomePage() {
  return <HomeView locale="zh" />;
}
