/* Toolkit service worker — offline app shell + runtime caching.
   Bumping VERSION invalidates old caches. */
const VERSION = "v1";
const SHELL = `toolkit-shell-${VERSION}`;
const RUNTIME = `toolkit-runtime-${VERSION}`;
const OFFLINE_URL = "/offline";
const PRECACHE = ["/", "/tools", OFFLINE_URL];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL);
      await cache.addAll(PRECACHE).catch(() => {});
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => !k.endsWith(VERSION))
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // Leave cross-origin requests (CDN engine/model downloads, currency API) alone.
  if (url.origin !== self.location.origin) return;

  // Navigations: network-first, fall back to cached page, then the offline page.
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(RUNTIME);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          return (
            (await caches.match(req)) ||
            (await caches.match(OFFLINE_URL)) ||
            Response.error()
          );
        }
      })(),
    );
    return;
  }

  // Everything else (JS/CSS/fonts/icons): stale-while-revalidate.
  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            caches.open(RUNTIME).then((c) => c.put(req, res.clone()));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })(),
  );
});
