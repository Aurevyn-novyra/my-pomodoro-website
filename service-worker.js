/* =========================================================
   Service Worker
   Basic offline caching (PWA-ready, GitHub Pages compatible)
   ========================================================= */

const CACHE_NAME = "focusflow-cache-v1";

/* ---------------------------------------------------------
   Assets to Cache
   --------------------------------------------------------- */
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",

  /* CSS */
  "./css/base.css",
  "./css/glass.css",
  "./css/animations.css",
  "./css/layout.css",

  /* JavaScript */
  "./js/app.js",
  "./js/timer.js",
  "./js/controls.js",
  "./js/settings.js",
  "./js/sounds.js",
  "./js/stats.js",
  "./js/storage.js",

  /* PWA */
  "./manifest.json",

  /* Media (optional – will be cached if available) */
  "./assets/sounds/focus.mp3",
  "./assets/sounds/alarm.mp3"
];

/* ---------------------------------------------------------
   Install Event – Cache App Shell
   --------------------------------------------------------- */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

/* ---------------------------------------------------------
   Activate Event – Clean Old Caches
   --------------------------------------------------------- */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim();
});

/* ---------------------------------------------------------
   Fetch Event – Cache First Strategy
   --------------------------------------------------------- */
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Cache new requests dynamically
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // If offline and not cached, fail silently
        return cachedResponse;
      });
    })
  );
});
