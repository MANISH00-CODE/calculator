const CACHE_NAME = 'smart-tools-v1';

// Yahan hum wo files likh rahe hain jo offline save hongi
const ASSETS = [
  './',
  './index.html',
  './shopping.html',
  './notes.html',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
];

// 1. Install Service Worker (Files ko cache me save karega)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching offline files');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Fetch Data (Net nahi hone par cache se files dikhayega)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Agar file cache mein hai toh wahi se de do, nahi toh internet se laao
      return response || fetch(event.request);
    })
  );
});
