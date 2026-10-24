"use client";

import { useEffect, useState } from "react";

import type { TocItem } from "@/lib/content/toc";
import { cn } from "@/lib/utils";

export function DocsToc({
  items,
  label,
}: {
  items: TocItem[];
  label: string;
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          );

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-96px 0px -62% 0px",
        threshold: [0, 1],
      },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav
      className="docs-toc"
      aria-label={label}
      data-pagefind-ignore
    >
      <div className="toc-head">
        <span className="plate-label">[ {label} ]</span>
      </div>
      <ul>
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li
              key={item.id}
              className={cn(
                "toc-item",
                `toc-depth-${item.depth}`,
                active && "is-active",
              )}
            >
              <a
                href={`#${item.id}`}
                aria-current={active ? "location" : undefined}
              >
                <span className="toc-tick" aria-hidden="true" />
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
