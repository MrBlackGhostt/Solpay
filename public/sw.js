const CACHE_NAME = 'tapsol-v3';
const STATIC_CACHE = [
  '/',
  '/dashboard',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  console.log('[SW-v3] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW-v3] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW-v3] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // 🚨 CRITICAL: NEVER cache RPC calls, API requests, or external services
  const isRpcOrApi = 
    url.hostname.includes('solana.com') ||
    url.hostname.includes('helius') ||
    url.hostname.includes('quicknode') ||
    url.hostname.includes('alchemy') ||
    url.hostname.includes('rpc') ||
    url.hostname.includes('devnet') ||
    url.hostname.includes('testnet') ||
    url.hostname.includes('mainnet') ||
    url.pathname.includes('/api/');

  const isMutation = 
    event.request.method === 'POST' ||
    event.request.method === 'PUT' ||
    event.request.method === 'DELETE' ||
    event.request.method === 'PATCH';

  const shouldSkipCache = isRpcOrApi || isMutation;
  
  if (shouldSkipCache) {
    if (isRpcOrApi) {
      // console.log('[SW-v3] Bypassing cache for RPC/API:', url.href);
    }
    // Direct network fetch - strictly no caching
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Cache-first strategy for static assets only
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        // Clone the request because it's a stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Cache valid static responses
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        }).catch(() => {
          // Optional: Return offline fallback here if needed
        });
      })
  );
});
