import type { Locale } from "./config";
import type { TagKey } from "@/config/tags";

export function localePath(locale: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === "zh") return clean;
  if (clean === "/") return "/en";
  return `/en${clean}`;
}

export function docBasePath(slug: string[] = []): string {
  return slug.length ? `/archive/${slug.join("/")}` : "/archive";
}

export function docsPath(locale: Locale, slug: string[] = []): string {
  return localePath(locale, docBasePath(slug));
}

export function tagsPath(locale: Locale): string {
  return localePath(locale, "/tags");
}

export function tagPath(locale: Locale, tag: TagKey): string {
  return localePath(locale, `/tags/${tag}`);
}

export function archivePath(locale: Locale): string {
  return localePath(locale, "/archive");
}

export function stripBasePath(pathname: string): string {
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
  if (!basePath) return pathname || "/";
  if (pathname === basePath) return "/";
  if (pathname.startsWith(`${basePath}/`)) {
    return pathname.slice(basePath.length) || "/";
  }
  return pathname || "/";
}

export function isActivePath(pathname: string, href: string): boolean {
  const clean = stripBasePath(pathname) || "/";
  if (href === "/") return clean === "/";
  if (href === "/en") return clean === "/en" || clean === "/en/";
  const normalizedHref = href.replace(/\/$/, "");
  const normalizedClean = clean.replace(/\/$/, "");
  return (
    normalizedClean === normalizedHref ||
    normalizedClean.startsWith(`${normalizedHref}/`)
  );
}

