import type { Metadata } from "next";

import {
  isTagKey,
  tagDescription,
  tagLabel,
} from "@/config/tags";
import { getAllTags } from "@/lib/content/docs";
import { buildPageMetadata } from "@/lib/seo";
import { TagView } from "@/views/tag-view";

export const dynamicParams = false;

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

export function generateStaticParams() {
  return getAllTags("zh").map((tag) => ({ tag: tag.key }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  if (!isTagKey(tag)) return {};

  return buildPageMetadata({
    locale: "zh",
    title: `#${tagLabel(tag, "zh")}`,
    description: tagDescription(tag, "zh"),
    path: `/tags/${tag}`,
  });
}

export default async function ZhTagPage({ params }: TagPageProps) {
  const { tag } = await params;
  return <TagView locale="zh" tag={tag} />;
}
