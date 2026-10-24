"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isActivePath } from "@/lib/i18n/paths";
import { getSiteLinks } from "@/lib/i18n/site-links";
import { cn } from "@/lib/utils";

export function MobileNav({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const links = getSiteLinks(locale);
  const pathname = usePathname() || "/";
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const menuButton = menuButtonRef.current;
    const panel = panelRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("aria-hidden"));

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      menuButton?.focus();
    };
  }, [open]);

  function openMenu() {
    setOpen(true);
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <button
        ref={menuButtonRef}
        type="button"
        className="icon-button mobile-only"
        onClick={openMenu}
        aria-label={dict.nav.menu}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-haspopup="dialog"
      >
        <MenuIcon size={18} />
      </button>

      {open
        ? createPortal(
            <div className="mobile-menu-layer">
              <button
                type="button"
                className="mobile-menu-backdrop"
                tabIndex={-1}
                aria-label={dict.nav.close}
                onClick={closeMenu}
              />

              <div
                ref={panelRef}
                id="mobile-menu"
                className="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-label={dict.nav.menu}
                tabIndex={-1}
              >
                <div className="mobile-menu-inner">
                  <div className="mobile-menu-head">
                    <span className="plate-label">[ NAV / 01 ]</span>
                    <button
                      type="button"
                      className="icon-button"
                      onClick={closeMenu}
                      aria-label={dict.nav.close}
                    >
                      <CloseIcon size={18} />
                    </button>
                  </div>

                  <nav
                    className="mobile-menu-nav"
                    aria-label={dict.nav.primary}
                  >
                    {links.map((link, index) => {
                      const active = isActivePath(pathname, link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={closeMenu}
                          className={cn(
                            "mobile-menu-link",
                            active && "is-active",
                          )}
                          aria-current={active ? "page" : undefined}
                        >
                          <span className="mobile-menu-index">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>{link.label}</span>
                          <span aria-hidden="true">→</span>
                        </Link>
                      );
                    })}
                  </nav>

                  <div className="mobile-menu-controls">
                    <div className="mobile-menu-control-label">
                      {dict.theme.label}
                    </div>
                    <ThemeToggle locale={locale} />
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
