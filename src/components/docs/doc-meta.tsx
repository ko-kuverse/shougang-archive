import { PlateLabel } from "@/components/ui/panel";
import type { DocMeta as DocMetaType } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { formatDate } from "@/lib/utils";

export function DocMeta({
  locale,
  doc,
  readingTime,
}: {
  locale: Locale;
  doc: DocMetaType;
  readingTime: number;
}) {
  const dict = getDictionary(locale);

  return (
    <div className="doc-meta-row" data-pagefind-ignore>
      {doc.chapter ? (
        <span className="doc-meta-item">
          <PlateLabel>CHAPTER</PlateLabel>
          <span>{doc.chapter}</span>
        </span>
      ) : null}
      <span className="doc-meta-item">
        <PlateLabel>{dict.docs.updated}</PlateLabel>
        <time dateTime={doc.updated}>
          {formatDate(doc.updated, locale)}
        </time>
      </span>
      <span className="doc-meta-item">
        <PlateLabel>READ</PlateLabel>
        <span>{dict.docs.readingTime(readingTime)}</span>
      </span>
    </div>
  );
}
