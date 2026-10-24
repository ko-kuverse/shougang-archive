import { execFileSync } from "node:child_process";

const url = process.argv[2];

if (!url) {
  console.error(
    "Usage: npm run gitee:setup -- https://gitee.com/<user>/<repo>.git",
  );
  process.exit(1);
}

const remotes = execFileSync("git", ["remote"], { encoding: "utf8" })
  .split(/\s+/)
  .filter(Boolean);

if (remotes.includes("gitee")) {
  execFileSync("git", ["remote", "set-url", "gitee", url], {
    stdio: "inherit",
  });
  console.log("Updated gitee remote.");
} else {
  execFileSync("git", ["remote", "add", "gitee", url], {
    stdio: "inherit",
  });
  console.log("Added gitee remote.");
}

console.log("");
console.log("Next (first time only):");
console.log("  git push -u gitee main");
console.log("");
console.log("After the first push, keep Gitee as the primary upstream:");
console.log("  git branch --set-upstream-to=gitee/main main");
console.log("");
console.log("Then synchronize both remotes with:");
console.log("  npm run sync");
