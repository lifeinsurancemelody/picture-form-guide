/* Picture Form Guide PWA — service worker (parity build).
   Cache-first for the app shell so the app opens offline after the first
   visit. Photos and prestige emblems are precached too (small, local
   files). Version the cache name on each release so updates replace old files. */
const CACHE = "pfg-pwa-v6";
const CORE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/levelup.mp3",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/photos/cable-lateral-raise.jpg",
  "./assets/photos/db-lateral-raise.jpg",
  "./assets/photos/bicep-curl.jpg",
  "./assets/photos/cable-pushdown.jpg",
  "./assets/photos/incline-curl.jpg",
  "./assets/photos/overhead-extension.jpg",
  "./assets/photos/bench-press.jpg",
  "./assets/photos/overhead-press.jpg",
  "./assets/photos/incline-press.jpg",
  "./assets/photos/lat-pulldown.jpg",
  "./assets/photos/single-arm-row.jpg",
  "./assets/photos/face-pull.jpg",
  "./assets/photos/hammer-curl.jpg",
  "./assets/photos/goblet-squat.jpg",
  "./assets/photos/romanian-deadlift.jpg",
  "./assets/photos/walking-lunge.jpg",
  "./assets/photos/calf-raise.jpg",
  "./assets/prestige/prestige-1.jpg",
  "./assets/prestige/prestige-2.jpg",
  "./assets/prestige/prestige-3.jpg",
  "./assets/prestige/prestige-4.jpg",
  "./assets/prestige/prestige-5.jpg",
  "./assets/prestige/prestige-6.jpg",
  "./assets/prestige/prestige-7.jpg",
  "./assets/prestige/prestige-8.jpg",
  "./assets/prestige/prestige-9.jpg",
  "./assets/prestige/prestige-10.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; // only cache our own files
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(event.request).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return res;
      });
    })
  );
});
