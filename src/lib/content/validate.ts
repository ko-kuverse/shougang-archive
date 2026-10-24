import { isTagKey, type TagKey } from "@/config/tags";
import { parts } from "@/data/parts";
import type { DocFrontmatter } from "./types";

type RawFrontmatter = Record<string, unknown>;

export type NormalizedFrontmatter = DocFrontmatter & {
  draft: boolean;
};

function asString(value: unknown): string | undefined {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return undefined;
}

function toIsoDate(
  value: unknown,
  field: string,
  sourcePath: string,
): string | undefined {
  if (value == null || value === "") return undefined;

  const date =
    value instanceof Date ? value : new Date(String(value).trim());

  if (Number.isNaN(date.getTime())) {
    throw new Error(
      `[content] Invalid "${field}" in ${sourcePath}: ${String(value)}`,
    );
  }

  return date.toISOString().slice(0, 10);
}

function normalizeTags(value: unknown, sourcePath: string): TagKey[] {
  if (value == null) return [];
  if (!Array.isArray(value)) {
    throw new Error(
      `[content] "tags" must be an array in ${sourcePath}.`,
    );
  }

  const tags: TagKey[] = [];

  for (const raw of value) {
    const tag = String(raw);
    if (!isTagKey(tag)) {
      throw new Error(
        `[content] Unknown tag "${tag}" in ${sourcePath}. ` +
          `Register it in src/config/tags.ts first.`,
      );
    }
    tags.push(tag);
  }

  return [...new Set(tags)];
}

export function normalizeFrontmatter(
  data: RawFrontmatter,
  sourcePath: string,
): NormalizedFrontmatter {
  const title = asString(data.title);
  if (!title) {
    throw new Error(`[content] Missing "title" in ${sourcePath}.`);
  }

  const draft = data.draft === true;
  const date = toIsoDate(data.date, "date", sourcePath);
  const updated = toIsoDate(data.updated, "updated", sourcePath);

  if (!date && !draft) {
    throw new Error(
      `[content] Missing "date" in ${sourcePath}. ` +
        `Every published document needs a date for the archive.`,
    );
  }

  const orderValue = Number(data.order);
  const order = Number.isFinite(orderValue) ? orderValue : 999;
  const part = asString(data.part);

  if (part && !(parts as readonly string[]).includes(part)) {
    throw new Error(
      `[content] Unknown part "${part}" in ${sourcePath}. ` +
        `Use one of: ${parts.join(", ")}.`,
    );
  }

  return {
    title,
    description: asString(data.description) ?? "",
    date: date ?? updated ?? "1970-01-01",
    updated: updated ?? date ?? "1970-01-01",
    tags: normalizeTags(data.tags, sourcePath),
    order,
    draft,
    chapter: asString(data.chapter),
    part,
    cover: asString(data.cover),
    coverAlt: asString(data.coverAlt),
    coverCredit: asString(data.coverCredit),
  };
}

export function assertNoOrphanTranslations(
  zhSlugs: Set<string>,
  enDocs: Array<{ slug: string; sourcePath: string }>,
): void {
  for (const doc of enDocs) {
    if (!zhSlugs.has(doc.slug)) {
      throw new Error(
        `[content] English document ${doc.sourcePath} has no Chinese source. ` +
          `Chinese content is the canonical source of truth.`,
      );
    }
  }
}

export function humanizeSegment(segment: string): string {
  return segment
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
