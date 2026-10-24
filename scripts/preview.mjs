import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const root = path.resolve(process.cwd(), "out");
const port = Number(process.env.PORT || 4173);
const basePath = (process.env.BASE_PATH || "").replace(/\/$/, "");

if (!fs.existsSync(root)) {
  console.error("out/ does not exist. Run npm run build first.");
  process.exit(1);
}

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8",
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath);
  const resolved = path.resolve(root, `.${decoded}`);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    return null;
  }
  return resolved;
}

function findFile(urlPath) {
  const candidates = [];
  const resolved = safePath(urlPath);
  if (!resolved) return null;

  candidates.push(resolved);

  if (!path.extname(resolved)) {
    candidates.push(path.join(resolved, "index.html"));
    candidates.push(`${resolved}.html`);
  }

  for (const candidate of candidates) {
    if (
      fs.existsSync(candidate) &&
      fs.statSync(candidate).isFile()
    ) {
      return candidate;
    }
  }

  return null;
}

const server = http.createServer((request, response) => {
  let urlPath;

  try {
    urlPath = new URL(request.url, "http://localhost").pathname;
  } catch {
    response.writeHead(400);
    response.end("Bad request");
    return;
  }

  if (basePath) {
    if (urlPath === basePath) {
      response.writeHead(308, { Location: `${basePath}/` });
      response.end();
      return;
    }

    if (!urlPath.startsWith(`${basePath}/`)) {
      response.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8",
      });
      response.end(
        `This preview is mounted at ${basePath}/. Try http://localhost:${port}${basePath}/`,
      );
      return;
    }

    urlPath = urlPath.slice(basePath.length) || "/";
  }

  const found = findFile(urlPath);
  const filePath = found ?? path.join(root, "404.html");
  const isNotFound = !found;
  const extension = path.extname(filePath);

  const body = fs.readFileSync(filePath);
  response.writeHead(isNotFound ? 404 : 200, {
    "Content-Type":
      types[extension] || "application/octet-stream",
    "Cache-Control": "no-store",
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  response.end(body);
});

server.listen(port, () => {
  const prefix = basePath ? `${basePath}/` : "/";
  console.log(`Static preview: http://localhost:${port}${prefix}`);
  console.log(`Serving: ${root}`);
});
