import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";
import { PlateLabel } from "@/components/ui/panel";
import {
  tagDescription,
  tagLabel,
} from "@/config/tags";
import { getAllTags } from "@/lib/content/docs";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { tagPath } from "@/lib/i18n/paths";
import { padNumber } from "@/lib/utils";

export function TagsView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const tags = getAllTags(locale);

  return (
    <main id="main" className="page-shell">
      <div className="page-header blueprint-grid">
        <PlateLabel>[ INDEX / TAGS ]</PlateLabel>
        <h1>{dict.tags.title}</h1>
        <p>{dict.tags.description}</p>
      </div>

      <section className="page-section">
        <div className="tag-index-head">
          <PlateLabel>
            [ TAXONOMY / {padNumber(tags.length)} ]
          </PlateLabel>
        </div>

        {tags.length === 0 ? (
          <p className="empty-state">{dict.tags.empty}</p>
        ) : (
          <div className="tag-grid">
            {tags.map((tag, index) => (
              <Link
                key={tag.key}
                href={tagPath(locale, tag.key)}
                className="tag-card"
              >
                <div className="tag-card-top">
                  <PlateLabel>
                    TAG.{padNumber(index + 1)}
                  </PlateLabel>
                  <ArrowRightIcon size={16} />
                </div>
                <h3>#{tagLabel(tag.key, locale)}</h3>
                <p>{tagDescription(tag.key, locale)}</p>
                <span className="tag-card-count">
                  {dict.tags.count(tag.count)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
