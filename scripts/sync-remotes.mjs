import { execFileSync } from "node:child_process";

// Gitee is the primary source of truth; GitHub is a mirror that deploys Pages.
const PRIMARY = "gitee";
const MIRROR = "origin";
const BRANCH = "main";

function git(args, options = {}) {
  return execFileSync("git", args, { encoding: "utf8", ...options });
}

function fail(message) {
  console.error(`\n✖ ${message}`);
  process.exit(1);
}

function remoteNames() {
  return git(["remote"]).split(/\s+/).filter(Boolean);
}

function revParse(ref) {
  try {
    return git(["rev-parse", "--verify", "--quiet", ref]).trim() || null;
  } catch {
    return null;
  }
}

function remoteHead(remote, branch) {
  let output;
  try {
    output = git(["ls-remote", "--heads", remote, `refs/heads/${branch}`]);
  } catch {
    fail(
      `Could not read ${remote}/${branch}. ` +
        `Check your network connection and the "${remote}" remote URL.`,
    );
  }
  return output.trim().split(/\s+/)[0] || null;
}

function isAncestor(ancestor, descendant) {
  try {
    git(["merge-base", "--is-ancestor", ancestor, descendant]);
    return true;
  } catch {
    return false;
  }
}

const remotes = remoteNames();

if (!remotes.includes(PRIMARY)) {
  fail(
    `No "${PRIMARY}" remote found. Run:\n` +
      "  npm run gitee:setup -- https://gitee.com/<user>/<repo>.git",
  );
}

if (!remotes.includes(MIRROR)) {
  fail(
    `No "${MIRROR}" remote found (expected the GitHub mirror). ` +
      "Add it with: git remote add origin <github-repo-url>",
  );
}

const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]).trim();
if (branch !== BRANCH) {
  fail(`Current branch is "${branch}", expected "${BRANCH}".`);
}

const dirty = git(["status", "--porcelain"]).trim();
if (dirty) {
  fail("Working tree has uncommitted changes. Commit them before syncing.");
}

console.log(`Syncing ${PRIMARY} (primary) → ${MIRROR} (mirror).\n`);

// Pull from the primary first so a second machine never pushes over newer
// Gitee commits. Fast-forward only: anything else needs a human decision.
try {
  git(["fetch", PRIMARY, "--prune"]);
} catch {
  fail(`Could not fetch ${PRIMARY}. Check your network connection.`);
}

const primaryRef = `refs/remotes/${PRIMARY}/${BRANCH}`;
const primarySha = revParse(primaryRef);

if (primarySha) {
  const head = revParse("HEAD");

  if (!isAncestor(primaryRef, "HEAD")) {
    if (isAncestor("HEAD", primaryRef)) {
      console.log(`→ ${PRIMARY}/${BRANCH} is ahead; fast-forwarding.`);
      git(["merge", "--ff-only", primaryRef], { stdio: "inherit" });
    } else {
      fail(
        `Local ${BRANCH} and ${PRIMARY}/${BRANCH} have diverged. ` +
          `Reconcile first, e.g.:\n` +
          `  git pull --rebase ${PRIMARY} ${BRANCH}\n` +
          "then re-run `npm run sync`.",
      );
    }
  } else if (head !== primarySha) {
    console.log(`→ Local ${BRANCH} has commits to publish.`);
  }
}

// Gitee first: if the primary push fails, the mirror is never ahead of it.
console.log(`→ git push -u ${PRIMARY} ${BRANCH}`);
try {
  git(["push", "-u", PRIMARY, BRANCH], { stdio: "inherit" });
} catch {
  fail(
    `Push to ${PRIMARY} failed. The first push needs an interactive Gitee ` +
      "login (Git Credential Manager will prompt).",
  );
}

console.log(`→ git push ${MIRROR} ${BRANCH}`);
try {
  git(["push", MIRROR, BRANCH], { stdio: "inherit" });
} catch {
  fail(`Push to ${MIRROR} failed. ${PRIMARY} is updated, the mirror is not.`);
}

// Confirm both remotes really point at the same commit.
const head = revParse("HEAD");
for (const remote of [PRIMARY, MIRROR]) {
  const sha = remoteHead(remote, BRANCH);
  if (sha !== head) {
    fail(
      `${remote}/${BRANCH} is at ${sha ?? "(missing)"}, expected ${head}. ` +
        "The push reported success but the remote does not match.",
    );
  }
}

console.log(`\n✔ ${PRIMARY}/${BRANCH} and ${MIRROR}/${BRANCH} both at ${head.slice(0, 7)}.`);
console.log(`  Upstream: ${git(["rev-parse", "--abbrev-ref", "@{u}"]).trim()}`);

if (remoteHead(PRIMARY, "master")) {
  console.log(
    "\nNote: the Gitee repo still has a `master` branch. Set `main` as the " +
      "default branch in the Gitee repository settings, then delete `master`.",
  );
}
