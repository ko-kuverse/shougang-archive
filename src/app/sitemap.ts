import type { MetadataRoute } from "next";

import {
  getAllDocs,
  getAllTags,
} from "@/lib/content/docs";
import { docBasePath } from "@/lib/i18n/paths";
import { absolutePageUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const chapters = getAllDocs("zh").filter((doc) => doc.slug !== "");

  const staticPages = [
    { path: "/", priority: 1 },
    { path: "/archive", priority: 0.9 },
    { path: "/gallery", priority: 0.7 },
    { path: "/timeline", priority: 0.7 },
    { path: "/route", priority: 0.7 },
    { path: "/team", priority: 0.6 },
    { path: "/sources", priority: 0.6 },
    { path: "/tags", priority: 0.5 },
  ];

  for (const page of staticPages) {
    entries.push({
      url: absolutePageUrl("zh", page.path),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: page.priority,
    });
  }

  for (const chapter of chapters) {
    entries.push({
      url: absolutePageUrl("zh", docBasePath(chapter.slugSegments)),
      lastModified: chapter.updated,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  for (const tag of getAllTags("zh")) {
    entries.push({
      url: absolutePageUrl("zh", `/tags/${tag.key}`),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return entries;
}
