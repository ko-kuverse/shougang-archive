import type { Metadata } from "next";

import { getStaticSlugs } from "@/lib/content/docs";
import { buildDocMetadata } from "@/lib/seo";
import { DocView } from "@/views/doc-view";

export const dynamicParams = false;

type ChapterPageProps = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams() {
  return getStaticSlugs("zh").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ChapterPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildDocMetadata("zh", slug);
}

export default async function ZhChapterPage({
  params,
}: ChapterPageProps) {
  const { slug } = await params;
  return <DocView locale="zh" slug={slug} />;
}
