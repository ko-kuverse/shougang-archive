import Link from "next/link";

import { FieldImage } from "@/components/ui/field-image";
import { PlateLabel } from "@/components/ui/panel";
import { tagLabel } from "@/config/tags";
import type { DocMeta } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/config";
import { docsPath } from "@/lib/i18n/paths";
import { cn } from "@/lib/utils";

export function ChapterCard({
  locale,
  doc,
  className,
}: {
  locale: Locale;
  doc: DocMeta;
  className?: string;
}) {
  const href = docsPath(locale, doc.slugSegments);

  return (
    <Link href={href} className={cn("chapter-card", className)}>
      <div className="chapter-card-cover">
        {doc.cover ? (
          <FieldImage
            src={doc.cover}
            alt={doc.coverAlt ?? doc.title}
            className="chapter-card-image"
          />
        ) : (
          <span className="chapter-card-placeholder" aria-hidden="true">
            {doc.chapter ?? "—"}
          </span>
        )}
        <span className="chapter-card-number">
          {doc.chapter ?? "—"}
        </span>
      </div>

      <div className="chapter-card-body">
        <PlateLabel>{doc.part ?? "调研档案"}</PlateLabel>
        <h3>{doc.title}</h3>
        <p>{doc.description}</p>
        <div className="chapter-card-tags">
          {doc.tags.slice(0, 2).map((tag) => (
            <span key={tag}>#{tagLabel(tag, locale)}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
