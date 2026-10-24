import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "out");

if (!fs.existsSync(outDir)) {
  console.error("[postbuild] out/ does not exist. Run next build first.");
  process.exit(1);
}

fs.writeFileSync(path.join(outDir, ".nojekyll"), "");
console.log("[postbuild] Wrote out/.nojekyll");

/**
 * Next.js 16 on Windows writes segmented RSC payloads into nested
 * directories (__next.hash/docs/__PAGE__.txt) while the client router
 * requests a flat, dot-joined filename. Copy the nested payloads to the
 * flat names the router expects. This is a no-op on Linux builds that
 * already emit flat files. See vercel/next.js#85374.
 */
function flattenRscPayloads(rootDir) {
  let created = 0;

  function flattenSegment(parentDir, segmentName, segmentDir) {
    const files = [];

    function collect(dir, parts) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          collect(full, [...parts, entry.name]);
        } else {
          files.push({ file: full, parts: [...parts, entry.name] });
        }
      }
    }

    collect(segmentDir, []);

    for (const { file, parts } of files) {
      const target = path.join(
        parentDir,
        [segmentName, ...parts].join("."),
      );
      if (!fs.existsSync(target)) {
        fs.copyFileSync(file, target);
        created += 1;
      }
    }
  }

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const full = path.join(dir, entry.name);
      if (entry.name.startsWith("__next.")) {
        flattenSegment(dir, entry.name, full);
      } else {
        walk(full);
      }
    }
  }

  walk(rootDir);
  return created;
}

const flattened = flattenRscPayloads(outDir);
console.log(`[postbuild] Created ${flattened} flat RSC payload aliases`);

try {
  execSync("pagefind --site out", {
    stdio: "inherit",
    env: process.env,
  });
} catch (error) {
  console.error("[postbuild] Pagefind indexing failed.");
  process.exit(error.status ?? 1);
}

const notFound = path.join(outDir, "404.html");
if (!fs.existsSync(notFound)) {
  console.error(
    "[postbuild] out/404.html is missing. The global not-found document did not render.",
  );
  process.exit(1);
}

console.log(
  "[postbuild] Static export verified: .nojekyll, Pagefind index, 404.html.",
);
