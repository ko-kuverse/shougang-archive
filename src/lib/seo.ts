import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import type { Doc } from "@/lib/content/types";
import { resolveDoc } from "@/lib/content/docs";
import {
  localeOpenGraph,
  type Locale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { docBasePath, localePath } from "@/lib/i18n/paths";

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export function absolutePageUrl(locale: Locale, path: string): string {
  const localized = localePath(locale, path);
  const withSlash = localized.endsWith("/") ? localized : `${localized}/`;
  return `${getSiteUrl()}${withSlash}`;
}

export function rootMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  const title = siteConfig.docsTitle;
  const description = dict.site.description;

  return {
    metadataBase: new URL(`${getSiteUrl()}/`),
    title: {
      default: title,
      template: `%s · ${siteConfig.docsTitle}`,
    },
    description,
    applicationName: siteConfig.name,
    authors: [{ name: "两山实践调研队" }],
    creator: siteConfig.name,
    openGraph: {
      type: "website",
      siteName: siteConfig.docsTitle,
      locale: localeOpenGraph[locale],
      title,
      description,
      url: absolutePageUrl(locale, "/"),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

type PageMetadataInput = {
  locale: Locale;
  title?: string;
  titleAbsolute?: boolean;
  description: string;
  /** Locale-agnostic page path, e.g. "/archive/why-shougang". */
  path: string;
  isArticle?: boolean;
  published?: string;
  updated?: string;
  tags?: string[];
};

export function buildPageMetadata({
  locale,
  title,
  titleAbsolute = false,
  description,
  path,
  isArticle = false,
  published,
  updated,
  tags,
}: PageMetadataInput): Metadata {
  const canonical = absolutePageUrl(locale, path);
  const languages = {
    zh: absolutePageUrl("zh", path),
    "x-default": absolutePageUrl("zh", path),
  };

  const openGraph: Metadata["openGraph"] = isArticle
    ? {
        type: "article",
        title,
        description,
        url: canonical,
        siteName: siteConfig.docsTitle,
        locale: localeOpenGraph[locale],
        publishedTime: published,
        modifiedTime: updated,
        authors: ["两山实践调研队"],
        tags,
      }
    : {
        type: "website",
        title,
        description,
        url: canonical,
        siteName: siteConfig.docsTitle,
        locale: localeOpenGraph[locale],
      };

  return {
    title:
      titleAbsolute && title ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      languages,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph,
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export function buildDocMetadata(locale: Locale, slug: string[]): Metadata {
  const resolved = resolveDoc(locale, slug);
  if (!resolved) return {};

  const { doc } = resolved;

  return buildPageMetadata({
    locale,
    title: doc.title,
    description: doc.description,
    path: docBasePath(slug),
    isArticle: true,
    published: doc.date,
    updated: doc.updated,
    tags: doc.tags,
  });
}

export function buildDocJsonLd(
  locale: Locale,
  doc: Doc,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: doc.title,
    description: doc.description,
    datePublished: doc.date,
    dateModified: doc.updated,
    inLanguage: "zh-CN",
    url: absolutePageUrl(locale, docBasePath(doc.slugSegments)),
    author: {
      "@type": "Organization",
      name: "两山实践调研队",
    },
    publisher: {
      "@type": "Organization",
      name: "两山实践调研队",
    },
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.docsTitle,
      url: `${getSiteUrl()}/`,
    },
    keywords: doc.tags.join(", "),
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
