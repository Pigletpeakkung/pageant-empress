/**
 * Pageant Empress Service Worker
 * Handles caching, offline functionality, and push notifications
 */

const CACHE_NAME = 'pageant-empress-v1.0.0';
const STATIC_CACHE = 'pageant-empress-static-v1';
const DYNAMIC_CACHE = 'pageant-empress-dynamic-v1';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/css/components.css',
  '/assets/css/animations.css',
  '/assets/js/app.js',
  '/assets/js/components/hero.js',
  '/assets/js/components/carousel.js',
  '/assets/js/components/navigation.js',
  '/assets/js/components/counters.js',
  '/assets/js/utils/analytics.js',
  '/assets/js/utils/performance.js',
  '/assets/images/logo.png',
  '/manifest.json'
];

// API endpoints to cache
const API_CACHE_URLS = [
  '/data/news.json',
  '/data/videos.json',
  '/data/carousel.json',
  '/data/gallery.json',
  '/data/events.json'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('👷 Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('📦 Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('📊 Caching API data...');
        return cache.addAll(API_CACHE_URLS);
      })
    ]).then(() => {
      console.log('✅ Service Worker installation complete');
      return self.skipWaiting();
    }).catch(error => {
      console.error('❌ Service Worker installation failed:', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip external requests
  if (url.origin !== location.origin) return;
  
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        // Serve from cache
        return cachedResponse;
      }
      
      // Fetch from network and cache if successful
      return fetch(request).then(networkResponse => {
        // Don't cache error responses
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        
        // Determine which cache to use
        const cacheName = isStaticAsset(request.url) ? STATIC_CACHE : DYNAMIC_CACHE;
        
        // Clone the response as it can only be consumed once
        const responseToCache = networkResponse.clone();
        
        caches.open(cacheName).then(cache => {
          cache.put(request, responseToCache);
        });
        
        return networkResponse;
      }).catch(error => {
        console.warn('🌐 Network request failed:', request.url, error);
        
        // Return offline fallback for HTML pages
        if (request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/offline.html') || generateOfflinePage();
        }
        
        // Return placeholder for images
        if (request.headers.get('accept')?.includes('image/')) {
          return new Response(
            '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f4f4f4"/><text x="50%" y="50%" text-anchor="middle" fill="#888">Image not available offline</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        }
        
        return new Response('Offline - Content not available', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'newsletter-subscription') {
    event.waitUntil(syncNewsletterSubscriptions());
  }
  
  if (event.tag === 'analytics-data') {
    event.waitUntil(syncAnalyticsData());
  }
});

// Push notifications
self.addEventListener('push', event => {
  console.log('📬 Push notification received');
  
  const options = {
    body: 'New pageant news is available!',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/assets/icons/explore-action.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icons/close-action.png'
      }
    ]
  };
  
  if (event.data) {
    const payload = event.data.json();
    options.body = payload.body || options.body;
    options.title = payload.title || 'Pageant Empress';
    options.data.url = payload.url || '/';
  }
  
  event.waitUntil(
    self.registration.showNotification('Pageant Empress', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('🔔 Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(windowClients => {
        // Check if app is already open
        for (let client of windowClients) {
          if (client.url.includes(self.location.origin)) {
            return client.focus();
          }
        }
        // Open new window if not already open
        return clients.openWindow('/');
      })
    );
  }
});

// Utility functions
function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.includes(asset)) ||
         url.includes('.css') || 
         url.includes('.js') || 
         url.includes('.png') || 
         url.includes('.jpg') || 
         url.includes('.svg');
}

function generateOfflinePage() {
  const offlineHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - Pageant Empress</title>
      <style>
        body {
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #8a2be2, #ff69b4);
          color: white;
          text-align: center;
        }
        .offline-container {
          max-width: 400px;
          padding: 2rem;
        }
        .offline-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        .offline-title {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        .offline-message {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 2rem;
        }
        .retry-button {
          background: rgba(255,255,255,0.2);
          border: 2px solid white;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .retry-button:hover {
          background: rgba(255,255,255,0.3);
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="offline-icon">🌐</div>
        <h1 class="offline-title">You're Offline</h1>
        <p class="offline-message">
          It looks like you're not connected to the internet. 
          Some content may not be available right now.
        </p>
        <button class="retry-button" onclick="window.location.reload()">
          Try Again
        </button>
      </div>
    </body>
    </html>
  `;
  
  return new Response(offlineHTML, {
    headers: { 'Content-Type': 'text/html' }
  });
}

async function syncNewsletterSubscriptions() {
  // Sync offline newsletter subscriptions
  const subscriptions = await getStoredSubscriptions();
  
  for (const subscription of subscriptions) {
    try {
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });
      await removeStoredSubscription(subscription.id);
    } catch (error) {
      console.error('Failed to sync subscription:', error);
    }
  }
}

async function syncAnalyticsData() {
  // Sync offline analytics data
  const analyticsData = await getStoredAnalytics();
  
  for (const data of analyticsData) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      await removeStoredAnalytics(data.id);
    } catch (error) {
      console.error('Failed to sync analytics:', error);
    }
  }
}

// IndexedDB helpers (simplified - would need full implementation)
async function getStoredSubscriptions() {
  // Implementation would use IndexedDB
  return [];
}

async function removeStoredSubscription(id) {
  // Implementation would use IndexedDB
}

async function getStoredAnalytics() {
  // Implementation would use IndexedDB
  return [];
}

async function removeStoredAnalytics(id) {
  // Implementation would use IndexedDB
}
