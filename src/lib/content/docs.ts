import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { tagKeys, type TagKey } from "@/config/tags";
import type { Locale } from "@/lib/i18n/config";
import { docsPath } from "@/lib/i18n/paths";

import type {
  ArchiveGroup,
  Doc,
  DocMeta,
  NavDocNode,
  NavNode,
  NavSectionNode,
  PagerLink,
  SectionMeta,
  SectionSummary,
  TagSummary,
} from "./types";
import {
  assertNoOrphanTranslations,
  humanizeSegment,
  normalizeFrontmatter,
} from "./validate";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const IS_DEV = process.env.NODE_ENV === "development";
const cache = new Map<string, unknown>();

type LocalizedText =
  | string
  | {
      zh?: string;
      en?: string;
    };

type RawSectionMeta = {
  title?: LocalizedText;
  description?: LocalizedText;
  order?: number;
};

type BreadcrumbItem = {
  label: string;
  href?: string;
};

function cached<T>(key: string, load: () => T): T {
  if (IS_DEV) return load();
  if (cache.has(key)) return cache.get(key) as T;
  const value = load();
  cache.set(key, value);
  return value;
}

function docsDir(locale: Locale): string {
  return path.join(CONTENT_ROOT, locale, "docs");
}

function listMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...listMdxFiles(fullPath));
    } else if (/\.(md|mdx)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

function slugSegmentsFromRelative(relativePath: string): string[] {
  const withoutExtension = relativePath.replace(/\.(md|mdx)$/i, "");
  const segments = withoutExtension.split("/").filter(Boolean);

  if (segments.at(-1) === "index") segments.pop();
  return segments;
}

function readDocFile(absolutePath: string, locale: Locale): Doc | null {
  const relativePath = path
    .relative(docsDir(locale), absolutePath)
    .split(path.sep)
    .join("/");
  const sourcePath = `content/${locale}/docs/${relativePath}`;
  const slugSegments = slugSegmentsFromRelative(relativePath);

  let parsed: ReturnType<typeof matter>;
  try {
    parsed = matter(fs.readFileSync(absolutePath, "utf8"));
  } catch (error) {
    throw new Error(
      `[content] Failed to parse ${sourcePath}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  const frontmatter = normalizeFrontmatter(
    parsed.data as Record<string, unknown>,
    sourcePath,
  );

  if (frontmatter.draft && process.env.INCLUDE_DRAFTS !== "true") {
    return null;
  }

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    updated: frontmatter.updated,
    tags: frontmatter.tags,
    order: frontmatter.order,
    chapter: frontmatter.chapter,
    part: frontmatter.part,
    cover: frontmatter.cover,
    coverAlt: frontmatter.coverAlt,
    coverCredit: frontmatter.coverCredit,
    slug: slugSegments.join("/"),
    slugSegments,
    locale,
    sourceLocale: locale,
    sourcePath,
    isFallback: false,
    content: parsed.content.trim(),
  };
}

function loadLocaleDocs(locale: Locale): Doc[] {
  return cached(`raw:${locale}`, () => {
    const files = listMdxFiles(docsDir(locale));
    const docs: Doc[] = [];
    const seen = new Map<string, string>();

    for (const file of files) {
      const doc = readDocFile(file, locale);
      if (!doc) continue;

      const previous = seen.get(doc.slug);
      if (previous) {
        throw new Error(
          `[content] Duplicate slug "${doc.slug}" in ${previous} and ${doc.sourcePath}.`,
        );
      }

      seen.set(doc.slug, doc.sourcePath);
      docs.push(doc);
    }

    if (docs.length === 0 && locale === "zh") {
      throw new Error(
        `[content] No documents found in content/${locale}/docs.`,
      );
    }

    return docs;
  });
}

function buildAllDocs(locale: Locale): Doc[] {
  const zhDocs = loadLocaleDocs("zh");

  if (locale === "zh") return zhDocs;

  const enDocs = loadLocaleDocs("en");
  assertNoOrphanTranslations(
    new Set(zhDocs.map((doc) => doc.slug)),
    enDocs,
  );

  const englishBySlug = new Map(enDocs.map((doc) => [doc.slug, doc]));

  return zhDocs.map(
    (zhDoc) =>
      englishBySlug.get(zhDoc.slug) ?? {
        ...zhDoc,
        locale: "en",
        isFallback: true,
        sourceLocale: "zh",
      },
  );
}

export function getAllDocs(locale: Locale): Doc[] {
  return cached(`docs:${locale}`, () => buildAllDocs(locale));
}

export function getDoc(locale: Locale, slugSegments: string[]): Doc | null {
  const slug = slugSegments.join("/");
  return getAllDocs(locale).find((doc) => doc.slug === slug) ?? null;
}

export function resolveDoc(
  locale: Locale,
  slugSegments: string[],
): { doc: Doc; isFallback: boolean } | null {
  const doc = getDoc(locale, slugSegments);
  return doc ? { doc, isFallback: doc.isFallback } : null;
}

export function getStaticSlugs(locale: Locale): string[][] {
  return getAllDocs(locale).map((doc) => doc.slugSegments);
}

function readMeta(locale: Locale, folder: string): RawSectionMeta {
  const file = path.join(
    docsDir(locale),
    ...folder.split("/").filter(Boolean),
    "_meta.json",
  );

  if (!fs.existsSync(file)) return {};

  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as RawSectionMeta;
  } catch (error) {
    throw new Error(
      `[content] Invalid _meta.json at ${path.relative(
        process.cwd(),
        file,
      )}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function pickLocalized(
  value: LocalizedText | undefined,
  locale: Locale,
): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value.trim();
  return value[locale]?.trim();
}

export function getSectionMeta(locale: Locale, folder: string): SectionMeta {
  return cached(`meta:${locale}:${folder}`, () => {
    const zhMeta = readMeta("zh", folder);
    const enMeta = locale === "en" ? readMeta("en", folder) : {};

    const title =
      locale === "en"
        ? (pickLocalized(enMeta.title, "en") ??
          pickLocalized(zhMeta.title, "en") ??
          pickLocalized(enMeta.title, "zh") ??
          pickLocalized(zhMeta.title, "zh"))
        : (pickLocalized(zhMeta.title, "zh") ??
          pickLocalized(zhMeta.title, "en"));

    const description =
      locale === "en"
        ? (pickLocalized(enMeta.description, "en") ??
          pickLocalized(zhMeta.description, "en") ??
          pickLocalized(enMeta.description, "zh") ??
          pickLocalized(zhMeta.description, "zh"))
        : (pickLocalized(zhMeta.description, "zh") ??
          pickLocalized(zhMeta.description, "en"));

    const rawOrder =
      locale === "en" ? (enMeta.order ?? zhMeta.order) : zhMeta.order;

    return {
      title:
        title ??
        humanizeSegment(folder.split("/").filter(Boolean).at(-1) ?? folder),
      description: description ?? "",
      order: Number.isFinite(rawOrder) ? Number(rawOrder) : 999,
    };
  });
}

type FolderNode = {
  name: string;
  pathSegments: string[];
  indexDoc?: Doc;
  docs: Doc[];
  folders: Map<string, FolderNode>;
};

function buildFolderTree(docs: Doc[]): FolderNode {
  const folderPaths = new Set<string>();

  for (const doc of docs) {
    for (let i = 1; i < doc.slugSegments.length; i += 1) {
      folderPaths.add(doc.slugSegments.slice(0, i).join("/"));
    }
  }

  const root: FolderNode = {
    name: "",
    pathSegments: [],
    docs: [],
    folders: new Map(),
  };

  function ensureFolder(segments: string[]): FolderNode {
    let node = root;

    for (let i = 0; i < segments.length; i += 1) {
      const segment = segments[i];
      let child = node.folders.get(segment);

      if (!child) {
        child = {
          name: segment,
          pathSegments: segments.slice(0, i + 1),
          docs: [],
          folders: new Map(),
        };
        node.folders.set(segment, child);
      }

      node = child;
    }

    return node;
  }

  for (const doc of docs) {
    if (doc.slugSegments.length === 0) continue;

    if (folderPaths.has(doc.slug)) {
      ensureFolder(doc.slugSegments).indexDoc = doc;
    } else {
      const parent = ensureFolder(doc.slugSegments.slice(0, -1));
      parent.docs.push(doc);
    }
  }

  return root;
}

function buildTree(locale: Locale): NavNode[] {
  const docs = getAllDocs(locale);
  const root = buildFolderTree(docs);
  const collator = new Intl.Collator(locale === "zh" ? "zh-CN" : "en");
  const typeRank: Record<NavNode["type"], number> = { doc: 0, section: 1 };

  function compare(a: NavNode, b: NavNode): number {
    return (
      a.order - b.order ||
      typeRank[a.type] - typeRank[b.type] ||
      collator.compare(a.title, b.title)
    );
  }

  function renderSection(folder: FolderNode): NavSectionNode {
    const pathKey = folder.pathSegments.join("/");
    const meta = getSectionMeta(locale, pathKey);
    const children = renderFolder(folder);
    const href = folder.indexDoc
      ? docsPath(locale, folder.indexDoc.slugSegments)
      : (children[0]?.href ?? docsPath(locale, folder.pathSegments));

    return {
      type: "section",
      title: meta.title,
      description: meta.description,
      slug: pathKey,
      href,
      order: meta.order,
      isFallback: folder.indexDoc?.isFallback ?? false,
      hasIndex: Boolean(folder.indexDoc),
      children,
    };
  }

  function renderFolder(folder: FolderNode): NavNode[] {
    const nodes: NavNode[] = folder.docs.map((doc) => ({
      type: "doc",
      title: doc.title,
      slug: doc.slug,
      href: docsPath(locale, doc.slugSegments),
      order: doc.order,
      isFallback: doc.isFallback,
    }));

    for (const child of folder.folders.values()) {
      nodes.push(renderSection(child));
    }

    return nodes.sort(compare);
  }

  return renderFolder(root);
}

export function getDocsTree(locale: Locale): NavNode[] {
  return cached(`tree:${locale}`, () => buildTree(locale));
}

export function flattenNav(nodes: NavNode[]): NavDocNode[] {
  const flat: NavDocNode[] = [];

  for (const node of nodes) {
    if (node.type === "doc") {
      flat.push(node);
      continue;
    }

    if (node.hasIndex) {
      flat.push({
        type: "doc",
        title: node.title,
        slug: node.slug,
        href: node.href,
        order: node.order,
        isFallback: node.isFallback,
      });
    }

    flat.push(...flattenNav(node.children));
  }

  return flat;
}

export function getDocSequence(locale: Locale): NavDocNode[] {
  const rootDoc = getDoc(locale, []);
  const rootNode: NavDocNode[] = rootDoc
    ? [
        {
          type: "doc",
          title: rootDoc.title,
          slug: "",
          href: docsPath(locale, []),
          order: -1,
          isFallback: rootDoc.isFallback,
        },
      ]
    : [];

  return [...rootNode, ...flattenNav(getDocsTree(locale))];
}

export function getPagerLinks(
  locale: Locale,
  slug: string,
): { prev: PagerLink | null; next: PagerLink | null } {
  const sequence = getDocSequence(locale);
  const index = sequence.findIndex((node) => node.slug === slug);

  if (index === -1) return { prev: null, next: null };

  const toLink = (node: NavDocNode | undefined): PagerLink | null =>
    node ? { title: node.title, href: node.href } : null;

  return {
    prev: toLink(sequence[index - 1]),
    next: toLink(sequence[index + 1]),
  };
}

export function getSectionSummaries(locale: Locale): SectionSummary[] {
  function count(node: NavNode): number {
    if (node.type === "doc") return 1;
    return (
      (node.hasIndex ? 1 : 0) +
      node.children.reduce((total, child) => total + count(child), 0)
    );
  }

  return getDocsTree(locale)
    .filter((node): node is NavSectionNode => node.type === "section")
    .map((node) => ({ ...node, count: count(node) }));
}

export function getAllTags(locale: Locale): TagSummary[] {
  const counts = new Map<TagKey, number>();

  for (const doc of getAllDocs(locale)) {
    for (const tag of doc.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return tagKeys
    .filter((key) => (counts.get(key) ?? 0) > 0)
    .map((key) => ({ key, count: counts.get(key) ?? 0 }));
}

export function getDocsByTag(locale: Locale, tag: TagKey): DocMeta[] {
  const collator = new Intl.Collator(locale === "zh" ? "zh-CN" : "en");

  return getAllDocs(locale)
    .filter((doc) => doc.tags.includes(tag))
    .sort(
      (a, b) =>
        b.updated.localeCompare(a.updated) ||
        collator.compare(a.title, b.title),
    );
}

export function getArchive(locale: Locale): ArchiveGroup[] {
  const collator = new Intl.Collator(locale === "zh" ? "zh-CN" : "en");
  const groups = new Map<string, DocMeta[]>();

  const docs = getAllDocs(locale)
    .filter((doc) => doc.slug !== "")
    .sort(
      (a, b) =>
        b.updated.localeCompare(a.updated) ||
        collator.compare(a.title, b.title),
    );

  for (const doc of docs) {
    const year = doc.updated.slice(0, 4);
    const group = groups.get(year) ?? [];
    group.push(doc);
    groups.set(year, group);
  }

  return [...groups.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, yearDocs]) => ({ year, docs: yearDocs }));
}

export function getLatestDocs(locale: Locale, limit = 4): DocMeta[] {
  const collator = new Intl.Collator(locale === "zh" ? "zh-CN" : "en");

  return getAllDocs(locale)
    .filter((doc) => doc.slug !== "")
    .sort(
      (a, b) =>
        b.updated.localeCompare(a.updated) ||
        collator.compare(a.title, b.title),
    )
    .slice(0, limit);
}

export function getDocCount(locale: Locale): number {
  return getAllDocs(locale).filter((doc) => doc.slug !== "").length;
}

export function getDocSectionTitle(locale: Locale, doc: DocMeta): string {
  if (doc.part) return doc.part;
  if (doc.slugSegments.length <= 1) {
    return getSectionMeta(locale, "").title;
  }
  return getSectionMeta(locale, doc.slugSegments[0]).title;
}

export function getChapters(locale: Locale): DocMeta[] {
  const collator = new Intl.Collator("zh-CN");

  return getAllDocs(locale)
    .filter((doc) => doc.slug !== "")
    .sort(
      (a, b) =>
        a.order - b.order ||
        collator.compare(a.title, b.title),
    );
}

export function getBreadcrumbs(
  locale: Locale,
  slugSegments: string[],
  pageTitle: string,
  overviewLabel: string,
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { label: overviewLabel, href: docsPath(locale, []) },
  ];

  for (let i = 1; i < slugSegments.length; i += 1) {
    const prefix = slugSegments.slice(0, i);
    const meta = getSectionMeta(locale, prefix.join("/"));
    const indexDoc = getDoc(locale, prefix);

    items.push({
      label: meta.title,
      href: indexDoc ? docsPath(locale, prefix) : undefined,
    });
  }

  if (slugSegments.length > 0) {
    items.push({ label: pageTitle });
  }

  return items;
}
