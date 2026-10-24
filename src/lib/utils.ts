import type { Locale } from "@/lib/i18n/config";

export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getReadingTime(content: string): number {
  const cjk = content.match(/[㐀-鿿]/g)?.length ?? 0;
  const latin = content
    .replace(/[㐀-鿿]/g, " ")
    .match(/[A-Za-z0-9_]+/g)?.length ?? 0;

  const minutes = cjk / 350 + latin / 220;
  return Math.max(1, Math.round(minutes));
}

export function padNumber(value: number, length = 2): string {
  return String(value).padStart(length, "0");
}
