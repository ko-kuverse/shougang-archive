export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(
  /\/$/,
  "",
);

/**
 * Prefix a root-relative asset path with the configured basePath.
 * Next.js handles basePath for <Link> and router navigation automatically;
 * this helper is for manually loaded public assets (scripts, images).
 */
export function withBasePath(path: string): string {
  if (
    /^[a-z][a-z0-9+.-]*:/i.test(path) ||
    path.startsWith("//") ||
    path.startsWith("#")
  ) {
    return path;
  }

  const clean = path.startsWith("/") ? path : `/${path}`;

  // Pagefind already returns basePath-prefixed URLs when the site was
  // built with a basePath. Keep the helper idempotent.
  if (
    basePath &&
    (clean === basePath || clean.startsWith(`${basePath}/`))
  ) {
    return clean;
  }

  return `${basePath}${clean}`;
}
