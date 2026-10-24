"use client";

import { useRef, useState, type ComponentPropsWithoutRef } from "react";

import { CheckIcon, CopyIcon } from "@/components/ui/icons";

export function CodeBlock({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const rawLanguage = (props as Record<string, unknown>)["data-language"];
  const language =
    typeof rawLanguage === "string" && rawLanguage
      ? rawLanguage.toUpperCase()
      : "TEXT";

  async function copyCode() {
    const text = preRef.current?.innerText ?? "";

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="code-shell">
      <div className="code-bar" data-pagefind-ignore>
        <span className="code-file">FILE / {language}</span>
        <button
          type="button"
          className="code-copy"
          onClick={copyCode}
          aria-label={copied ? "Code copied" : "Copy code"}
        >
          {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
          <span>{copied ? "COPIED" : "COPY"}</span>
        </button>
      </div>
      <pre ref={preRef} className={className} {...props}>
        {children}
      </pre>
    </div>
  );
}
