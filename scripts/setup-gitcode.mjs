import { execFileSync } from "node:child_process";

const url = process.argv[2];

if (!url) {
  console.error(
    "Usage: npm run gitcode:setup -- https://gitcode.com/<user>/<repo>.git",
  );
  process.exit(1);
}

const clean = url.replace(/\/$/, "").replace(/\.git$/, "");
const match = clean.match(
  /^(?:https:\/\/gitcode\.(?:com|net)\/|git@gitcode\.com:)([^/]+)\/([^/]+)$/,
);

if (!match) {
  console.error(
    "Unrecognized GitCode URL. Expected\n" +
      "  https://gitcode.com/<user>/<repo>.git\n" +
      "or\n" +
      "  git@gitcode.com:<user>/<repo>.git",
  );
  process.exit(1);
}

const [, owner, repo] = match;
const basePath = `/${repo}`;
const siteUrl = `https://${owner}.gitcode.io/${repo}/`;

if (!/^[A-Za-z0-9._-]+$/.test(repo)) {
  console.warn(
    `Warning: repository name "${repo}" is not ASCII. ` +
      "GitCode Pages puts the repo name in the URL path; use an ASCII name " +
      "such as shougang-archive to avoid broken or percent-encoded links.",
  );
}

const remotes = execFileSync("git", ["remote"], { encoding: "utf8" })
  .split(/\s+/)
  .filter(Boolean);

if (remotes.includes("gitcode")) {
  execFileSync("git", ["remote", "set-url", "gitcode", url], {
    stdio: "inherit",
  });
  console.log("Updated gitcode remote.");
} else {
  execFileSync("git", ["remote", "add", "gitcode", url], {
    stdio: "inherit",
  });
  console.log("Added gitcode remote.");
}

console.log(`
Next:

  1. Make sure the GitCode account has completed real-name verification and
     the repository is public. The first push prompts for GitCode credentials.
     GitCode rejects account passwords: create a personal access token at
     个人设置 → 访问令牌 (scope: write_repository) and use it as the password.

       git push gitcode main

     or publish main to every remote at once:

       npm run sync

  2. In the GitCode repository, open Pages and enable it with:

       部署分支    main
       构建命令    NEXT_PUBLIC_BASE_PATH=${basePath} NEXT_PUBLIC_SITE_URL=${siteUrl} npm run build
       输出目录    out
       Node.js     22

     If the form has separate environment variable fields, put
     NEXT_PUBLIC_BASE_PATH=${basePath}
     NEXT_PUBLIC_SITE_URL=${siteUrl}
     there and use "npm run build" as the build command.

  3. After the first build, the site should be available at:

       ${siteUrl}

     Use the address shown in the Pages panel if the platform assigns a
     different domain.

Why the base path: GitCode Pages serves each repository under /<repo>/, so
Next.js must be built with the same prefix. GitHub Pages does the same for
project sites; a root deployment (for example Cloudflare Pages) would leave
it unset.
`);
