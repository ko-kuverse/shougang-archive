import type { Metadata } from "next";

import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildPageMetadata } from "@/lib/seo";
import { TagsView } from "@/views/tags-view";

const dict = getDictionary("zh");

export const metadata: Metadata = buildPageMetadata({
  locale: "zh",
  title: dict.tags.title,
  description: dict.tags.description,
  path: "/tags",
});

export default function ZhTagsPage() {
  return <TagsView locale="zh" />;
}
