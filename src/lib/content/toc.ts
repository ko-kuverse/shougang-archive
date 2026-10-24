import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export type TocItem = {
  id: string;
  text: string;
  depth: 2 | 3;
};

/**
 * Extract H2/H3 headings with the same slug algorithm used by rehype-slug.
 * All heading levels are slugged so duplicate IDs stay in sync.
 */
export function extractToc(source: string): TocItem[] {
  const tree = unified().use(remarkParse).parse(source);
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];

  visit(tree, "heading", (node) => {
    const text = toString(node).trim();
    if (!text) return;

    const id = slugger.slug(text);
    if (node.depth === 2 || node.depth === 3) {
      items.push({ id, text, depth: node.depth });
    }
  });

  return items;
}
