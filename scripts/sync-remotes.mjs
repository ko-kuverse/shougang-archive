import { execFileSync } from "node:child_process";

// Gitee is the primary source of truth. GitCode Pages and GitHub Pages are
// mirrors that build from their own copies of main.
const PRIMARY = "gitee";
const MIRROR = "origin";
const EXTRA_MIRRORS = ["gitcode"];
const BRANCH = "main";

const LABELS = {
  gitee: "Gitee (primary)",
  gitcode: "GitCode Pages",
  origin: "GitHub Pages",
};

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
  try {
    const output = git(["ls-remote", "--heads", remote, `refs/heads/${branch}`]);
    return output.trim().split(/\s+/)[0] || null;
  } catch {
    return null;
  }
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

const mirrors = [...EXTRA_MIRRORS, MIRROR].filter((remote) =>
  remotes.includes(remote),
);

if (!mirrors.includes("gitcode")) {
  console.log(
    "Note: no gitcode remote; skipping GitCode Pages. " +
      "Add one with: npm run gitcode:setup -- <url>",
  );
}

const targetList = mirrors.map((remote) => LABELS[remote] ?? remote).join(" → ");
console.log(`Syncing ${LABELS[PRIMARY]} → ${targetList}.\n`);

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

// Gitee first: if the primary push fails, no mirror is ahead of it.
console.log(`→ git push -u ${PRIMARY} ${BRANCH}`);
try {
  git(["push", "-u", PRIMARY, BRANCH], { stdio: "inherit" });
} catch {
  fail(
    `Push to ${PRIMARY} failed. The first push needs an interactive Gitee ` +
      "login (Git Credential Manager will prompt).",
  );
}

// Push every mirror. A failure in one must not block the others.
const failed = new Set();

for (const remote of mirrors) {
  console.log(`\n→ git push ${remote} ${BRANCH}`);
  try {
    git(["push", remote, BRANCH], { stdio: "inherit" });
  } catch {
    failed.add(remote);
    console.error(`✖ Push to ${remote} failed.`);
    if (remote === "gitcode") {
      console.error(
        "  GitCode no longer accepts account passwords. Use a personal " +
          "access token as the password (个人设置 → 访问令牌), or switch to " +
          "SSH (git@gitcode.com:ab13795/shougang.git).",
      );
    }
  }
}

// Confirm every remote really points at the same commit.
const head = revParse("HEAD");

for (const remote of [PRIMARY, ...mirrors]) {
  const sha = remoteHead(remote, BRANCH);
  if (sha !== head) {
    failed.add(remote);
    console.error(
      `✖ ${remote}/${BRANCH} is at ${sha ?? "(unreachable or missing)"}, ` +
        `expected ${head}.`,
    );
  }
}

if (failed.size > 0) {
  fail(`Sync incomplete: ${[...failed].join(", ")} did not match local HEAD.`);
}

const synced = [PRIMARY, ...mirrors]
  .map((remote) => `${remote}/${BRANCH}`)
  .join(", ");
console.log(`\n✔ ${synced} all at ${head.slice(0, 7)}.`);
console.log(`  Upstream: ${git(["rev-parse", "--abbrev-ref", "@{u}"]).trim()}`);

if (remoteHead(PRIMARY, "master")) {
  console.log(
    "\nNote: the Gitee repo still has a `master` branch. Set `main` as the " +
      "default branch in the Gitee repository settings, then delete `master`.",
  );
}
