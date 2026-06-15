const CACHE_NAME = 'Bauchi Sentinel Grid-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './app.js',
  './siren.mp3',
  './icon.png'
];

// 1. INSTALL: Updated to handle media files safely without throwing 206 errors
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Instead of cache.addAll (which crashes on 206), we cache each file individually
      return Promise.all(
        ASSETS_TO_CACHE.map((asset) => {
          return fetch(asset)
            .then((response) => {
              // Only cache valid standard responses or opaque media blocks
              if (response.status === 200 || response.status === 206 || response.type === 'opaque') {
                return cache.put(asset, response);
              }
            })
            .catch((err) => console.log(`Asset deferred for runtime fetch: ${asset}`));
        })
      );
    })
  );
  self.skipWaiting(); // Forces the phone to use the new code immediately
});

// 2. ACTIVATE: Claims the app so the switch works without a restart
self.addEventListener('activate', (e) => {
  e.waitUntil(
    Promise.all([
      caches.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) return caches.delete(key);
          })
        );
      }),
      self.clients.claim() // Takes control of the app right away
    ])
  );
});

// 3. FETCH: Smart Logic (Network-First for Security, Cache-First for Siren)
self.addEventListener('fetch', (e) => {
  // RULE: If the request is for the Kill Switch JSON, ALWAYS go to GitHub
  if (e.request.url.includes('sys_check_772.json') || e.request.url.includes('status.json')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  // DEFAULT: Use cache for Siren/Images to save data and work offline
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});