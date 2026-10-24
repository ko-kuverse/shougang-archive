import type { Metadata } from "next";

import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildPageMetadata } from "@/lib/seo";
import { ArchiveView } from "@/views/archive-view";

const dict = getDictionary("zh");

export const metadata: Metadata = buildPageMetadata({
  locale: "zh",
  title: dict.archive.title,
  description: dict.archive.description,
  path: "/archive",
});

export default function ZhArchivePage() {
  return <ArchiveView locale="zh" />;
}
