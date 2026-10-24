import type { MDXComponents } from "mdx/types";

import { Callout } from "./callout";
import { CodeBlock } from "./code-block";
import { Figure } from "./figure";
import { MdxImage } from "./img";
import { MdxLink } from "./link";
import { PullQuote } from "./pull-quote";

export const mdxComponents: MDXComponents = {
  Callout,
  Figure,
  PullQuote,
  pre: CodeBlock,
  a: MdxLink,
  img: MdxImage,
  table: (props) => (
    <div className="table-scroll">
      <table {...props} />
    </div>
  ),
};
