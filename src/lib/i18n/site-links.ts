import type { Locale } from "./config";
import { getDictionary } from "./dictionaries";
import { archivePath, localePath, tagsPath } from "./paths";

export function getSiteLinks(locale: Locale) {
  const dict = getDictionary(locale);

  return [
    { label: dict.nav.home, href: localePath(locale, "/") },
    { label: dict.nav.archive, href: archivePath(locale) },
    { label: dict.nav.timeline, href: localePath(locale, "/timeline") },
    { label: dict.nav.gallery, href: localePath(locale, "/gallery") },
    { label: dict.nav.route, href: localePath(locale, "/route") },
    { label: dict.nav.team, href: localePath(locale, "/team") },
    { label: dict.nav.sources, href: localePath(locale, "/sources") },
  ];
}

export function getFooterLinks(locale: Locale) {
  const dict = getDictionary(locale);

  return [
    { label: dict.nav.archive, href: archivePath(locale) },
    { label: dict.nav.timeline, href: localePath(locale, "/timeline") },
    { label: dict.nav.gallery, href: localePath(locale, "/gallery") },
    { label: dict.nav.route, href: localePath(locale, "/route") },
    { label: dict.nav.team, href: localePath(locale, "/team") },
    { label: dict.nav.sources, href: localePath(locale, "/sources") },
    { label: dict.nav.tags, href: tagsPath(locale) },
  ];
}
