const CACHE_NAME = "sahal-cache-v2";
const urlsToCache = [
  "/",
  "/practice.html",
  "/css/style.css",
  "/js/script.js",
  "/js/login.js",
  "/js/signup.js",
  "/img/sahal logo.svg",
  "/img/sahal favicon.svg",
  "/img/icons/icon-192.png",
  "/img/icons/icon-512.png",
  // Cache all question JSONs
  "/data/english.json",
  "/data/mathematics.json",
  "/data/biology.json",
  "/data/chemistry.json",
  "/data/physics.json",
  "/data/government.json",
  "/data/literature-in-english.json",
  "/data/economics.json",
  "/data/commerce.json",
  "/data/principles-of-accounts.json"
];

// Install event: pre-cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Activate event: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

// Fetch event: cache-first strategy
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          // Cache the new request for future offline use
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // Optional: fallback if request fails
          if (event.request.destination === "document") {
            return caches.match("/practice.html");
          }
        });
    })
  );
});
