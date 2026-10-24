import Link from "next/link";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";
import { PlateLabel } from "@/components/ui/panel";
import type { PagerLink } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

export function DocsPager({
  locale,
  prev,
  next,
}: {
  locale: Locale;
  prev: PagerLink | null;
  next: PagerLink | null;
}) {
  const dict = getDictionary(locale);

  if (!prev && !next) return null;

  return (
    <nav
      className="docs-pager"
      aria-label={`${dict.docs.prev} / ${dict.docs.next}`}
      data-pagefind-ignore
    >
      {prev ? (
        <Link href={prev.href} className="pager-link pager-prev">
          <PlateLabel>
            <ArrowLeftIcon size={12} /> {dict.docs.prev}
          </PlateLabel>
          <span className="pager-title">{prev.title}</span>
        </Link>
      ) : (
        <span className="pager-link pager-empty" aria-hidden="true" />
      )}

      {next ? (
        <Link
          href={next.href}
          className={cn("pager-link", "pager-next")}
        >
          <PlateLabel>
            {dict.docs.next} <ArrowRightIcon size={12} />
          </PlateLabel>
          <span className="pager-title">{next.title}</span>
        </Link>
      ) : (
        <span className="pager-link pager-empty" aria-hidden="true" />
      )}
    </nav>
  );
}
