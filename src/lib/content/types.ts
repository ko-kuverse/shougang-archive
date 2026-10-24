import type { TagKey } from "@/config/tags";
import type { Locale } from "@/lib/i18n/config";

export type DocFrontmatter = {
  title: string;
  description: string;
  date: string;
  updated: string;
  tags: TagKey[];
  order: number;
  chapter?: string;
  part?: string;
  cover?: string;
  coverAlt?: string;
  coverCredit?: string;
};

export type DocMeta = DocFrontmatter & {
  /** Canonical slug without locale, e.g. "getting-started/installation". */
  slug: string;
  slugSegments: string[];
  locale: Locale;
  /** Locale the actual source text came from. */
  sourceLocale: Locale;
  /** Repo-relative path for diagnostics. */
  sourcePath: string;
  /** True when an English URL falls back to Chinese content. */
  isFallback: boolean;
};

export type Doc = DocMeta & {
  content: string;
};

export type SectionMeta = {
  title: string;
  description: string;
  order: number;
};

export type NavDocNode = {
  type: "doc";
  title: string;
  slug: string;
  href: string;
  order: number;
  isFallback: boolean;
};

export type NavSectionNode = {
  type: "section";
  title: string;
  description: string;
  slug: string;
  href: string;
  order: number;
  isFallback: boolean;
  hasIndex: boolean;
  children: NavNode[];
};

export type NavNode = NavDocNode | NavSectionNode;

export type SectionSummary = NavSectionNode & { count: number };

export type TagSummary = {
  key: TagKey;
  count: number;
};

export type ArchiveGroup = {
  year: string;
  docs: DocMeta[];
};

export type PagerLink = {
  title: string;
  href: string;
};
