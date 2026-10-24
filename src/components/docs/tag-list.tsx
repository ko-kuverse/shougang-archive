import Link from "next/link";

import { tagLabel, type TagKey } from "@/config/tags";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { tagPath } from "@/lib/i18n/paths";

export function TagList({
  locale,
  tags,
}: {
  locale: Locale;
  tags: TagKey[];
}) {
  const dict = getDictionary(locale);

  if (tags.length === 0) return null;

  return (
    <div className="tag-list" data-pagefind-ignore>
      <span className="tag-list-label">{dict.docs.tags}</span>
      {tags.map((tag) => (
        <Link key={tag} href={tagPath(locale, tag)} className="tag-chip">
          #{tagLabel(tag, locale)}
        </Link>
      ))}
    </div>
  );
}
