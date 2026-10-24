import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";
import { RouteView } from "@/views/route-view";

export const metadata: Metadata = buildPageMetadata({
  locale: "zh",
  title: "调研路线",
  description: "首钢园五点位调研路线：三高炉、群明湖、大跳台、筒仓与高点。",
  path: "/route",
});

export default function RoutePage() {
  return <RouteView />;
}
