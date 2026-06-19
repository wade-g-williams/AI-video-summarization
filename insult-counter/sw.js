// Simple offline cache so the counter works without signal at the table.
var CACHE = "jewels-counter-v1";
var ASSETS = [
  ".",
  "index.html",
  "app.js",
  "manifest.webmanifest",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png",
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(ASSETS).catch(function () {});
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (k) {
          if (k !== CACHE) return caches.delete(k);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return (
        hit ||
        fetch(e.request)
          .then(function (resp) {
            var copy = resp.clone();
            caches.open(CACHE).then(function (c) {
              c.put(e.request, copy).catch(function () {});
            });
            return resp;
          })
          .catch(function () {
            return caches.match("index.html");
          })
      );
    })
  );
});
