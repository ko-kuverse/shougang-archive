import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";
import { SourcesView } from "@/views/sources-view";

export const metadata: Metadata = buildPageMetadata({
  locale: "zh",
  title: "参考资料",
  description: "调研报告参考文献、证据分级与图片说明。",
  path: "/sources",
});

export default function SourcesPage() {
  return <SourcesView />;
}
