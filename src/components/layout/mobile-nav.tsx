"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (dialogRef.current?.open) {
      dialogRef.current.close();
    }
  }, [pathname]);

  function openMenu() {
    setOpen(true);
    dialogRef.current?.showModal();
  }

  function closeMenu() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        className="icon-button mobile-only"
        onClick={openMenu}
        aria-label={dict.nav.menu}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <MenuIcon size={18} />
      </button>

      <dialog
        ref={dialogRef}
        className="mobile-menu"
        aria-label={dict.nav.menu}
        onClose={() => setOpen(false)}
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

          <nav className="mobile-menu-nav" aria-label={dict.nav.primary}>
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
      </dialog>
    </>
  );
}
