"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

import { MonitorIcon, MoonIcon, SunIcon } from "@/components/ui/icons";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle({
  locale,
  compact = false,
  className,
}: {
  locale: Locale;
  compact?: boolean;
  className?: string;
}) {
  const dict = getDictionary(locale);
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const options = [
    { value: "system", label: dict.theme.auto, Icon: MonitorIcon },
    { value: "light", label: dict.theme.light, Icon: SunIcon },
    { value: "dark", label: dict.theme.dark, Icon: MoonIcon },
  ];

  if (!mounted) {
    return (
      <div
        className={cn(
          "theme-toggle",
          compact && "theme-toggle-compact",
          className,
        )}
        aria-hidden="true"
        data-placeholder="true"
      />
    );
  }

  const current = theme ?? "system";

  return (
    <div
      className={cn(
        "theme-toggle",
        compact && "theme-toggle-compact",
        className,
      )}
      role="group"
      aria-label={dict.theme.label}
    >
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          className={cn(
            "theme-option",
            current === value && "is-active",
          )}
          onClick={() => setTheme(value)}
          aria-pressed={current === value}
          title={label}
        >
          <Icon size={14} />
          <span className="theme-option-label">{label}</span>
        </button>
      ))}
    </div>
  );
}
