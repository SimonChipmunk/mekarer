/* Service worker: keeps the app working offline and lets the browser install it. */
var CACHE = 'mekarer-v2';
var SHELL = ['./', './index.html', './firebase-config.js', './manifest.json', './icon-192.png', './icon-512.png'];
/* Third-party files worth caching for offline use: fonts and the Firebase library itself.
   Firebase's live data channel (firestore.googleapis.com) must never be cached, so it is left alone. */
var CACHEABLE_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'www.gstatic.com'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

/* App files: serve from cache, refresh in the background. Fonts and anything else: network, cache fallback. */
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(e.request).then(function (cached) {
        var fresh = fetch(e.request).then(function (res) {
          if (res && res.ok) caches.open(CACHE).then(function (c) { c.put(e.request, res.clone()); });
          return res;
        }).catch(function () { return cached; });
        return cached || fresh;
      })
    );
  } else if (CACHEABLE_HOSTS.indexOf(url.hostname) >= 0) {
    e.respondWith(
      fetch(e.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        return res;
      }).catch(function () { return caches.match(e.request); })
    );
  }
});
