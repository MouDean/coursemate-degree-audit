// Service worker for caching Vite build assets
const CACHE_NAME = 'coursemate-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/index-vxKe089b.js',
  '/assets/index-DQB17w6-.css',
  '/assets/AdvisorApp-BT1dUqbb.js',
  '/assets/html2canvas.esm-QH1iLAAe.js',
  '/assets/index.es-DFwDyXBy.js',
  '/assets/purify.es-CQJ0hv7W.js',
  '/favicon.ico',
  '/1.png',
  '/2.png',
  '/4.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
