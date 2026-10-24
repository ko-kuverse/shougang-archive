import Link from "next/link";

import { ChapterCard } from "@/components/archive/chapter-card";
import { PlateLabel } from "@/components/ui/panel";
import { parts } from "@/data/parts";
import { getChapters } from "@/lib/content/docs";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { padNumber } from "@/lib/utils";

export function ArchiveView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const chapters = getChapters(locale);

  return (
    <main id="main" className="page-shell archive-index">
      <header className="page-header blueprint-grid archive-index-header">
        <PlateLabel>
          [ DOSSIERS / {padNumber(chapters.length)} ]
        </PlateLabel>
        <h1>{dict.archive.title}</h1>
        <p>{dict.archive.description}</p>
        <div className="archive-index-meta">
          <span>{dict.home.sectionsDescription}</span>
          <span>{dict.archive.bySection}</span>
        </div>
      </header>

      <div className="archive-index-body">
        {parts.map((part, partIndex) => {
          const items = chapters.filter((chapter) => chapter.part === part);
          if (items.length === 0) return null;

          return (
            <section className="archive-part" key={part}>
              <div className="archive-part-head">
                <span className="archive-part-index">
                  {padNumber(partIndex + 1)}
                </span>
                <h2>{part}</h2>
                <span className="archive-part-count">
                  {dict.tags.count(items.length)}
                </span>
              </div>

              <div className="chapter-grid">
                {items.map((chapter) => (
                  <ChapterCard
                    key={chapter.slug}
                    locale={locale}
                    doc={chapter}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="archive-index-footer">
        <Link href="/tags">
          {dict.nav.tags} →
        </Link>
        <Link href="/sources">
          {dict.nav.sources} →
        </Link>
      </div>
    </main>
  );
}
