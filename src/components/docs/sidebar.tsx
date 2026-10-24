"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  ChevronDownIcon,
  CloseIcon,
  MenuIcon,
} from "@/components/ui/icons";
import type { NavNode } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { docsPath, tagsPath } from "@/lib/i18n/paths";
import { cn } from "@/lib/utils";

export function DocsSidebar({
  locale,
  tree,
  currentSlug,
}: {
  locale: Locale;
  tree: NavNode[];
  currentSlug: string;
}) {
  const dict = getDictionary(locale);
  const pathname = usePathname() || "/";
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (dialogRef.current?.open) dialogRef.current.close();
  }, [pathname]);

  function toggleSection(slug: string) {
    setCollapsed((previous) => {
      const next = new Set(previous);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function closeDrawer() {
    if (dialogRef.current?.open) dialogRef.current.close();
  }

  function openDrawer() {
    setOpen(true);
    dialogRef.current?.showModal();
  }

  function renderNodes(nodes: NavNode[], depth = 0) {
    return nodes.map((node, index) => {
      if (node.type === "doc") {
        const active = node.slug === currentSlug;
        return (
          <li key={node.slug || `doc-${index}`} className="sidebar-item">
            <Link
              href={node.href}
              onClick={closeDrawer}
              className={cn("sidebar-link", active && "is-active")}
              aria-current={active ? "page" : undefined}
              style={{ paddingLeft: `${8 + depth * 14}px` }}
            >
              {depth === 0 ? (
                <span className="sidebar-doc-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
              ) : (
                <span className="sidebar-tick" aria-hidden="true" />
              )}
              <span className="sidebar-text">{node.title}</span>
              {node.isFallback ? (
                <span className="badge-zh">ZH</span>
              ) : null}
            </Link>
          </li>
        );
      }

      const sectionOpen = !collapsed.has(node.slug);
      const active = node.slug === currentSlug;

      return (
        <li key={node.slug} className="sidebar-section">
          <div
            className="sidebar-section-row"
            style={{ paddingLeft: `${8 + depth * 14}px` }}
          >
            {depth === 0 ? (
              <span className="sidebar-sec-index">
                {String(index + 1).padStart(2, "0")}
              </span>
            ) : null}
            <Link
              href={node.href}
              onClick={closeDrawer}
              className={cn(
                "sidebar-section-link",
                active && "is-active",
              )}
              aria-current={active ? "page" : undefined}
            >
              {node.title}
              {node.isFallback ? (
                <span className="badge-zh">ZH</span>
              ) : null}
            </Link>
            {node.children.length > 0 ? (
              <button
                type="button"
                className="sidebar-toggle"
                onClick={() => toggleSection(node.slug)}
                aria-expanded={sectionOpen}
                aria-label={`${dict.docs.sidebar}: ${node.title}`}
              >
                <ChevronDownIcon
                  size={14}
                  className={cn(!sectionOpen && "is-collapsed")}
                />
              </button>
            ) : null}
          </div>

          {sectionOpen && node.children.length > 0 ? (
            <ul className="sidebar-children">
              {renderNodes(node.children, depth + 1)}
            </ul>
          ) : null}
        </li>
      );
    });
  }

  const navigation = (
    <nav className="docs-sidebar-nav" aria-label={dict.docs.sidebar}>
      <Link
        href={docsPath(locale, [])}
        onClick={closeDrawer}
        className={cn(
          "sidebar-home-link",
          currentSlug === "" && "is-active",
        )}
        aria-current={currentSlug === "" ? "page" : undefined}
      >
        <span className="sidebar-tick" aria-hidden="true" />
        {dict.docs.overview}
      </Link>
      <ul className="sidebar-root">{renderNodes(tree)}</ul>
      <div className="sidebar-extras">
        <Link href={tagsPath(locale)} onClick={closeDrawer}>
          {dict.nav.tags}
        </Link>
        <Link href="/sources" onClick={closeDrawer}>
          {dict.nav.sources}
        </Link>
      </div>
    </nav>
  );

  return (
    <>
      <aside
        className="docs-sidebar"
        aria-label={dict.docs.sidebar}
        data-pagefind-ignore
      >
        <div className="sidebar-head">
          <span className="plate-label">
            [ {dict.docs.sidebar} ]
          </span>
          <span className="sidebar-head-count">
            {String(tree.length).padStart(2, "0")} FILES
          </span>
        </div>
        {navigation}
      </aside>

      <div className="docs-mobile-bar">
        <button
          type="button"
          className="docs-mobile-trigger"
          onClick={openDrawer}
          aria-label={dict.docs.openSidebar}
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <MenuIcon size={16} />
          <span>{dict.docs.sidebar}</span>
          <span className="docs-mobile-trigger-arrow" aria-hidden="true">
            ↓
          </span>
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className="docs-drawer"
        aria-label={dict.docs.sidebar}
        onClose={() => setOpen(false)}
        data-pagefind-ignore
      >
        <div className="docs-drawer-inner">
          <div className="docs-drawer-head">
            <span className="plate-label">
              [ {dict.docs.sidebar} ]
            </span>
            <button
              type="button"
              className="icon-button"
              onClick={closeDrawer}
              aria-label={dict.docs.close}
            >
              <CloseIcon size={18} />
            </button>
          </div>
          {navigation}
        </div>
      </dialog>
    </>
  );
}
