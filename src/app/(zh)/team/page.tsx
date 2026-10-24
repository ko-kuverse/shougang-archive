import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";
import { TeamView } from "@/views/team-view";

export const metadata: Metadata = buildPageMetadata({
  locale: "zh",
  title: "团队",
  description: "两山实践调研队：课程背景、分工与现场记录。",
  path: "/team",
});

export default function TeamPage() {
  return <TeamView />;
}
