const CACHE_NAME = 'biblia-catolica-v1'
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon-192x192.svg',
  '/icon-512x512.svg'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened')
        return cache.addAll(urlsToCache)
      })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response
        }
        return fetch(event.request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })

          return response
        })
      })
  )
})

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync offline data when connection is restored
      syncOfflineData()
    )
  }
})

async function syncOfflineData() {
  try {
    // Check if there's offline data to sync
    const offlineData = await getOfflineData()
    if (offlineData) {
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(offlineData)
      })
      // Clear offline data after successful sync
      await clearOfflineData()
    }
  } catch (error) {
    console.error('Failed to sync offline data:', error)
  }
}

async function getOfflineData() {
  // Implementation would depend on your offline storage strategy
  return null
}

async function clearOfflineData() {
  // Implementation would depend on your offline storage strategy
}