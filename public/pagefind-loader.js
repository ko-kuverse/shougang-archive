// Loaded as a module from /<basePath>/pagefind-loader.js.
// The relative import keeps working when the site is hosted under a
// GitHub Pages project path such as /repo/.
const readyEvent = "pagefind-ready";
const missingEvent = "pagefind-missing";

if (window.__pagefind) {
  window.dispatchEvent(new Event(readyEvent));
} else if (window.__pagefindMissing) {
  window.dispatchEvent(new Event(missingEvent));
} else {
  const pagefindUrl = new URL("./pagefind/pagefind.js", import.meta.url);

  import(pagefindUrl.href)
    .then(async (pagefind) => {
      await pagefind.init();
      window.__pagefind = pagefind;
      window.dispatchEvent(new Event(readyEvent));
    })
    .catch(() => {
      window.__pagefindMissing = true;
      window.dispatchEvent(new Event(missingEvent));
    });
}
