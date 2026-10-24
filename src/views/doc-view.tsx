import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/docs/breadcrumbs";
import { DocMeta } from "@/components/docs/doc-meta";
import { DocsPager } from "@/components/docs/pager";
import { DocsSidebar } from "@/components/docs/sidebar";
import { TagList } from "@/components/docs/tag-list";
import { DocsToc } from "@/components/docs/toc";
import { FieldImage } from "@/components/ui/field-image";
import { PlateLabel } from "@/components/ui/panel";
import {
  getBreadcrumbs,
  getDocsTree,
  getPagerLinks,
  resolveDoc,
} from "@/lib/content/docs";
import { extractToc } from "@/lib/content/toc";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { renderMdx } from "@/lib/mdx/render";
import {
  buildDocJsonLd,
  serializeJsonLd,
} from "@/lib/seo";
import { getReadingTime } from "@/lib/utils";

export async function DocView({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string[];
}) {
  const resolved = resolveDoc(locale, slug);

  if (!resolved) {
    notFound();
  }

  const { doc } = resolved;
  const dict = getDictionary(locale);
  const tree = getDocsTree(locale);
  const toc = extractToc(doc.content);
  const pager = getPagerLinks(locale, doc.slug);
  const readingTime = getReadingTime(doc.content);
  const content = await renderMdx(doc.content, locale);
  const breadcrumbs = getBreadcrumbs(
    locale,
    slug,
    doc.title,
    dict.docs.overview,
  );
  const sectionTitle = doc.part ?? dict.docs.overview;

  return (
    <div className="docs-layout">
      <DocsSidebar
        locale={locale}
        tree={tree}
        currentSlug={doc.slug}
      />

      <main id="main" className="docs-main">
        <Breadcrumbs
          items={breadcrumbs}
          label={dict.docs.breadcrumb}
        />

        <article
          className="doc-article"
          data-pagefind-body=""
          data-pagefind-filter="language:zh"
        >
          <header className="doc-header">
            <div className="doc-eyebrow">
              <PlateLabel>[ {sectionTitle} ]</PlateLabel>
              <span className="doc-header-rule" aria-hidden="true" />
            </div>
            <h1 data-pagefind-meta="title">{doc.title}</h1>
            {doc.description ? (
              <p className="doc-description">{doc.description}</p>
            ) : null}
            <DocMeta
              locale={locale}
              doc={doc}
              readingTime={readingTime}
            />
          </header>

          {doc.cover ? (
            <figure className="doc-cover">
              <FieldImage
                src={doc.cover}
                alt={doc.coverAlt ?? doc.title}
                eager
                className="doc-cover-image"
              />
              <figcaption>
                <span>FIG. {doc.chapter ?? "—"}</span>
              </figcaption>
            </figure>
          ) : null}

          <div className="prose prose-industrial">{content}</div>

          <TagList locale={locale} tags={doc.tags} />
        </article>

        <DocsPager locale={locale} prev={pager.prev} next={pager.next} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(buildDocJsonLd(locale, doc)),
          }}
        />
      </main>

      <DocsToc items={toc} label={dict.docs.onThisPage} />
    </div>
  );
}
