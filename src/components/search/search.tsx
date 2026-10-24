"use client";

/* eslint-disable react-hooks/set-state-in-effect -- Pagefind index loading and the debounced search are external-system synchronization. */

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { CloseIcon, CommandIcon, SearchIcon } from "@/components/ui/icons";
import { withBasePath } from "@/lib/base-path";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

type PagefindResultData = {
  url: string;
  excerpt: string;
  meta?: {
    title?: string;
  };
};

type PagefindApi = {
  init?: () => Promise<void>;
  search: (
    query: string,
    options?: { filters?: Record<string, string> },
  ) => Promise<{
    results: Array<{ data: () => Promise<PagefindResultData> }>;
  }>;
};

declare global {
  interface Window {
    __pagefind?: PagefindApi;
    __pagefindMissing?: boolean;
  }
}

type SearchResult = {
  url: string;
  title: string;
  excerpt: string;
};

type SearchStatus = "idle" | "loading" | "ready" | "missing";

function sanitizeExcerpt(html: string): string {
  if (typeof window === "undefined") return "";

  const parsed = new DOMParser().parseFromString(html, "text/html");
  const container = document.createElement("div");

  function copyNode(node: Node, target: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      target.appendChild(
        document.createTextNode(node.textContent ?? ""),
      );
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const element = node as Element;
    if (element.tagName === "MARK") {
      const mark = document.createElement("mark");
      target.appendChild(mark);
      element.childNodes.forEach((child) => copyNode(child, mark));
      return;
    }

    element.childNodes.forEach((child) => copyNode(child, target));
  }

  parsed.body.childNodes.forEach((node) => copyNode(node, container));
  return container.innerHTML;
}

export function Search({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(false);

  const minimumQueryLength = locale === "zh" ? 1 : 2;
  const trimmedQuery = query.trim();

  useEffect(() => {
    function onShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (!dialogRef.current?.open) {
          dialogRef.current?.showModal();
          setOpen(true);
        }
      }
    }

    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (status === "ready" || status === "missing") {
      return;
    }

    setStatus("loading");

    if (window.__pagefind) {
      setStatus("ready");
      return;
    }

    if (window.__pagefindMissing) {
      setStatus("missing");
      return;
    }

    function onReady() {
      setStatus("ready");
    }

    function onMissing() {
      setStatus("missing");
    }

    window.addEventListener("pagefind-ready", onReady);
    window.addEventListener("pagefind-missing", onMissing);

    if (!document.querySelector("script[data-pagefind-loader]")) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = withBasePath("/pagefind-loader.js");
      script.dataset.pagefindLoader = "true";
      script.onerror = () => setStatus("missing");
      document.head.appendChild(script);
    }

    return () => {
      window.removeEventListener("pagefind-ready", onReady);
      window.removeEventListener("pagefind-missing", onMissing);
    };
  }, [open, status]);

  useEffect(() => {
    if (!open || status !== "ready") return;

    if (trimmedQuery.length < minimumQueryLength) {
      setResults([]);
      setTotalResults(0);
      setSearching(false);
      setError(false);
      setActiveIndex(-1);
      return;
    }

    let cancelled = false;
    setSearching(true);
    setError(false);

    const timer = window.setTimeout(async () => {
      try {
        const pagefind = window.__pagefind;
        if (!pagefind) return;

        const response = await pagefind.search(trimmedQuery, {
          filters: { language: locale },
        });

        const data = await Promise.all(
          response.results.slice(0, 12).map((result) => result.data()),
        );

        if (cancelled) return;

        setResults(
          data.map((item) => ({
            url: item.url,
            title: item.meta?.title ?? item.url,
            excerpt: item.excerpt ?? "",
          })),
        );
        setTotalResults(response.results.length);
        setActiveIndex(data.length > 0 ? 0 : -1);
      } catch {
        if (!cancelled) {
          setError(true);
          setResults([]);
          setTotalResults(0);
          setActiveIndex(-1);
        }
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 160);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [open, status, trimmedQuery, minimumQueryLength, locale]);

  function openSearch() {
    setOpen(true);
    dialogRef.current?.showModal();
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function closeSearch() {
    dialogRef.current?.close();
  }

  function handleDialogClose() {
    setOpen(false);
    setQuery("");
    setResults([]);
    setTotalResults(0);
    setActiveIndex(-1);
    setSearching(false);
    setError(false);
  }

  function navigate(url: string) {
    window.location.assign(withBasePath(url));
  }

  function handleInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (results.length > 0) {
        setActiveIndex((index) => (index + 1) % results.length);
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (results.length > 0) {
        setActiveIndex(
          (index) => (index - 1 + results.length) % results.length,
        );
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
    } else if (event.key === "Enter") {
      if (activeIndex >= 0 && results[activeIndex]) {
        event.preventDefault();
        navigate(results[activeIndex].url);
      }
    }
  }

  const showMinChars = trimmedQuery.length < minimumQueryLength;
  const showEmpty =
    !showMinChars && !searching && !error && results.length === 0;

  return (
    <>
      <button
        type="button"
        className="search-trigger"
        onClick={openSearch}
        aria-label={dict.search.trigger}
        data-pagefind-ignore
      >
        <SearchIcon size={16} />
        <span className="search-trigger-label">{dict.search.trigger}</span>
        <kbd className="search-kbd" aria-hidden="true">
          <CommandIcon size={11} />K
        </kbd>
      </button>

      <dialog
        ref={dialogRef}
        className="search-dialog"
        aria-label={dict.search.title}
        onClose={handleDialogClose}
        data-pagefind-ignore
      >
        <div className="search-shell">
          <div className="search-head">
            <span className="plate-label">
              [ {dict.search.title} ]
            </span>
            <button
              type="button"
              className="icon-button"
              onClick={closeSearch}
              aria-label={dict.search.close}
            >
              <CloseIcon size={18} />
            </button>
          </div>

          <div className="search-input-row">
            <span className="search-prompt" aria-hidden="true">
              &gt;
            </span>
            <input
              ref={inputRef}
              className="search-input"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={dict.search.placeholder}
              aria-label={dict.search.placeholder}
              autoComplete="off"
              spellCheck={false}
            />
            <kbd className="search-esc" aria-hidden="true">
              ESC
            </kbd>
          </div>

          <div className="search-body" aria-live="polite">
            {status === "loading" ? (
              <p className="search-state">{dict.search.loading}</p>
            ) : null}

            {status === "missing" ? (
              <div className="search-state search-state-missing">
                <p className="search-state-title">
                  {dict.search.unavailable}
                </p>
                <p>{dict.search.unavailableHint}</p>
              </div>
            ) : null}

            {status === "ready" && showMinChars ? (
              <p className="search-state">{dict.search.hint}</p>
            ) : null}

            {status === "ready" && searching ? (
              <p className="search-state">{dict.search.loading}</p>
            ) : null}

            {status === "ready" && error ? (
              <p className="search-state search-state-error">
                {dict.search.error}
              </p>
            ) : null}

            {status === "ready" && showEmpty ? (
              <p className="search-state">{dict.search.empty}</p>
            ) : null}

            {status === "ready" &&
            !showMinChars &&
            trimmedQuery.length > 0 ? (
              <p className="search-count">
                {dict.search.results(totalResults)}
              </p>
            ) : null}

            {status === "ready" && results.length > 0 ? (
              <ol className="search-results">
                {results.map((result, index) => (
                  <li key={`${result.url}-${index}`}>
                    <a
                      href={withBasePath(result.url)}
                      className={cn(
                        "search-result",
                        index === activeIndex && "is-active",
                      )}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <span className="search-result-index">
                        {String(index + 1).padStart(3, "0")}
                      </span>
                      <span className="search-result-content">
                        <span className="search-result-title">
                          {result.title}
                        </span>
                        <span
                          className="search-result-excerpt"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeExcerpt(result.excerpt),
                          }}
                        />
                        <span className="search-result-url">
                          {result.url}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            ) : null}
          </div>

          <div className="search-foot" data-pagefind-ignore>
            <span>{dict.search.navigate}</span>
            <span>{dict.search.select}</span>
            <span>{dict.search.hint}</span>
          </div>
        </div>
      </dialog>
    </>
  );
}
