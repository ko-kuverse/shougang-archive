import { execFileSync } from "node:child_process";

const url = process.argv[2];

if (!url || !/^(https:\/\/gitee\.com\/|git@gitee\.com:)/.test(url)) {
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

console.log(`
Next (first time only):

  1. Publish main to Gitee. Git Credential Manager will ask you to sign in;
     the project never stores your Gitee password.

       git push -u gitee main

     This also makes gitee/main the upstream of main, so a plain
     "git pull" and "git status" follow the primary source.

  2. In the Gitee repository settings, set "main" as the default branch,
     then delete the auto-generated "master" branch.

  3. Synchronize both remotes from now on:

       npm run sync
`);
