import { execFileSync } from "node:child_process";

function git(args, options = {}) {
  return execFileSync("git", args, { encoding: "utf8", ...options });
}

const remotes = git(["remote"]).split(/\s+/).filter(Boolean);

if (!remotes.includes("gitee")) {
  console.error(
    "No gitee remote found. Run:\n" +
      "  npm run gitee:setup -- https://gitee.com/<user>/<repo>.git\n" +
      "  git push -u gitee main",
  );
  process.exit(1);
}

if (!remotes.includes("origin")) {
  console.error(
    "No origin remote found (expected the GitHub mirror). " +
      "Add it with: git remote add origin <github-repo-url>",
  );
  process.exit(1);
}

const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]).trim();
if (branch !== "main") {
  console.error(`Current branch is "${branch}", expected "main".`);
  process.exit(1);
}

const dirty = git(["status", "--porcelain"]).trim();
if (dirty) {
  console.error(
    "Working tree has uncommitted changes. Commit them before syncing.",
  );
  process.exit(1);
}

console.log("Syncing Gitee (primary) → GitHub (mirror).");
console.log("GitHub Actions will deploy the mirror to Pages.\n");

for (const remote of ["gitee", "origin"]) {
  console.log(`→ git push ${remote} main`);
  execFileSync("git", ["push", remote, "main"], { stdio: "inherit" });
}

console.log(
  "\nDone. Gitee is the primary source; GitHub is the Pages mirror.",
);
