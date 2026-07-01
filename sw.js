// Version change karna zaroori hai taaki browser ko pata chale ki naya update aaya hai
const CACHE_NAME = 'smart-tools-v2'; 

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
  self.skipWaiting(); // IMPORTANT: Naya service worker bina wait kiye turant install ho jayega
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching offline files...');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Activate Event (Purana cache delete karne ke liye - ye tumhare purane code me missing tha)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing Old Cache:', cache);
            return caches.delete(cache); // Purana v1 delete kar dega
          }
        })
      );
    }).then(() => self.clients.claim()) // IMPORTANT: Turant control le lega bina refresh kiye
  );
});

// 3. Fetch Data (Network First Strategy - GitHub ke updates turant dikhane ke liye)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Agar internet chal raha hai, toh server se nayi file laao aur cache me update kar do
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // Agar internet band hai (Offline mode), tab cache se purani file dikhao
        return caches.match(event.request);
      })
  );
});
