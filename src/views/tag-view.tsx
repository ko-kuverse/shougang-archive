import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import { PlateLabel } from "@/components/ui/panel";
import {
  isTagKey,
  tagDescription,
  tagLabel,
} from "@/config/tags";
import {
  getDocSectionTitle,
  getDocsByTag,
} from "@/lib/content/docs";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { docsPath, tagsPath } from "@/lib/i18n/paths";
import { formatDate } from "@/lib/utils";

export function TagView({
  locale,
  tag,
}: {
  locale: Locale;
  tag: string;
}) {
  if (!isTagKey(tag)) {
    notFound();
  }

  const dict = getDictionary(locale);
  const docs = getDocsByTag(locale, tag);

  return (
    <main id="main" className="page-shell">
      <div className="page-header blueprint-grid">
        <Link href={tagsPath(locale)} className="back-link">
          <ArrowLeftIcon size={14} />
          {dict.tags.title}
        </Link>
        <PlateLabel>[ TAG / {tag.toUpperCase()} ]</PlateLabel>
        <h1>#{tagLabel(tag, locale)}</h1>
        <p>{tagDescription(tag, locale)}</p>
        <p className="page-header-meta">
          {dict.tags.count(docs.length)}
        </p>
      </div>

      <section className="page-section">
        {docs.length === 0 ? (
          <p className="empty-state">{dict.tags.empty}</p>
        ) : (
          <div className="doc-list">
            {docs.map((doc, index) => (
              <Link
                key={doc.slug}
                href={docsPath(locale, doc.slugSegments)}
                className="doc-row"
              >
                <span className="doc-row-index">
                  {String(index + 1).padStart(3, "0")}
                </span>
                <span className="doc-row-copy">
                  <span className="doc-row-title">
                    {doc.title}
                  </span>
                  <span className="doc-row-description">
                    {doc.description}
                  </span>
                  <span className="doc-row-meta">
                    <span>
                      {getDocSectionTitle(locale, doc) ||
                        dict.docs.overview}
                    </span>
                    <span aria-hidden="true">/</span>
                    <time dateTime={doc.updated}>
                      {formatDate(doc.updated, locale)}
                    </time>
                    {doc.isFallback ? (
                      <span className="badge-zh">ZH</span>
                    ) : null}
                  </span>
                </span>
                <ArrowRightIcon size={16} className="doc-row-arrow" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
