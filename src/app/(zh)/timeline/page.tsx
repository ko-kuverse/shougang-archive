import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";
import { TimelineView } from "@/views/timeline-view";

export const metadata: Metadata = buildPageMetadata({
  locale: "zh",
  title: "时间线",
  description: "首钢园百年时间线：从石景山炼厂到冬奥赛场与后冬奥城市更新。",
  path: "/timeline",
});

export default function TimelinePage() {
  return <TimelineView />;
}
