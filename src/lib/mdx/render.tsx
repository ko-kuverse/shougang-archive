import { evaluate } from "@mdx-js/mdx";
import type { MDXComponents } from "mdx/types";
import type { ComponentType, ReactElement } from "react";
import * as runtime from "react/jsx-runtime";

import { mdxComponents } from "@/components/mdx";
import { MdxLink } from "@/components/mdx/link";
import type { Locale } from "@/lib/i18n/config";

import { rehypePlugins, remarkPlugins } from "./plugins";

type MdxContent = ComponentType<{ components?: MDXComponents }>;

const compileCache = new Map<string, MdxContent>();

export async function renderMdx(
  source: string,
  locale: Locale,
): Promise<ReactElement> {
  let Content = compileCache.get(source);

  if (!Content) {
    const compiled = await evaluate(source, {
      ...runtime,
      remarkPlugins,
      rehypePlugins,
    });

    Content = compiled.default as MdxContent;
    compileCache.set(source, Content);
  }

  const components: MDXComponents = {
    ...mdxComponents,
    a: (props) => <MdxLink {...props} locale={locale} />,
  };

  return <Content components={components} />;
}
