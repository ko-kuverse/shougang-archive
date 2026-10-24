import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import type { PluggableList } from "unified";

import retroTerminal from "./themes/retro-terminal.json";

const prettyCodeOptions = {
  theme: retroTerminal,
  keepBackground: false,
  bypassInlineCode: true,
};

export const remarkPlugins: PluggableList = [remarkGfm];

export const rehypePlugins: PluggableList = [
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: "append",
      properties: {
        className: ["heading-anchor"],
        ariaLabel: "Link to section",
      },
      content: () => ({
        type: "element",
        tagName: "span",
        properties: { "aria-hidden": "true" },
        children: [{ type: "text", value: "#" }],
      }),
    },
  ],
  [rehypePrettyCode, prettyCodeOptions],
];
