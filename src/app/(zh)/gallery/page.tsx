import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";
import { GalleryView } from "@/views/gallery-view";

export const metadata: Metadata = buildPageMetadata({
  locale: "zh",
  title: "实地图集",
  description: "首钢园实地调研照片：工业构筑、生态细节与在场的人。",
  path: "/gallery",
});

export default function GalleryPage() {
  return <GalleryView />;
}
