const CACHE_NAME = 'bangla-batch-v204'; // Critical update - force complete cache refresh for PDF fix
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/shared-database.js',
    '/manifest.json',
    '/Assets/logo.png',
    '/Assets/splashscreen.png',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap'
    // Note: PDFs are cached dynamically when accessed
];

// Install event - cache resources
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching resources...');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.log('Cache failed:', error);
            })
    );
    // Skip waiting to activate immediately
    self.skipWaiting();
});

// Fetch event - aggressive network-first strategy for instant updates
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        return;
    }

    // For ALL files with version parameters, ALWAYS fetch from network first
    if (event.request.url.includes('?v=') ||
        event.request.url.includes('shared-database.js') ||
        event.request.url.includes('script.js') ||
        event.request.url.includes('styles.css') ||
        event.request.url.includes('index.html')) {

        event.respondWith(
            fetch(event.request)
                .then(response => {
                    console.log('Fresh content fetched from network:', event.request.url);
                    // Update cache with new content
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                })
                .catch(error => {
                    console.log('Network failed, using cache:', event.request.url);
                    return caches.match(event.request);
                })
        );
        return;
    }

    // For other resources, use cache-first strategy for offline support
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('Serving from cache:', event.request.url);
                    return response;
                }

                // Prefer network for PDFs to avoid long stale loads, but cache for next time
                const isPdf = event.request.url.endsWith('.pdf') || event.request.headers.get('accept')?.includes('application/pdf');
                if (isPdf) {
                    return fetch(event.request, {
                        cache: 'no-cache',
                        headers: {
                            'Cache-Control': 'no-cache, no-store, must-revalidate',
                            'Pragma': 'no-cache',
                            'Expires': '0'
                        }
                    })
                        .then(response => {
                            if (response.status === 200) {
                                const responseClone = response.clone();
                                caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                            }
                            return response;
                        })
                        .catch(() => caches.match(event.request));
                }

                return fetch(event.request)
                    .then(response => {
                        // Cache successful responses
                        if (response.status === 200) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(event.request, responseClone);
                            });
                        }
                        return response;
                    })
                    .catch(error => {
                        console.log('Network failed, no cache available:', event.request.url);
                        // Return offline page for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                        throw error;
                    });
            })
    );
});


// Listen for messages from the main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('Skipping waiting...');
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }

    // Handle PDF caching requests
    if (event.data && event.data.action === 'cache-pdf') {
        const url = event.data.url;
        console.log('Caching PDF for offline:', url);

        fetch(url, {
            cache: 'no-cache',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        })
            .then(response => {
                if (response.status === 200) {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(url, response.clone());
                        console.log('PDF cached successfully:', url);
                        // Notify main thread
                        event.ports[0]?.postMessage({ success: true, url: url });
                    });
                } else {
                    throw new Error(`Failed to fetch PDF: ${response.status}`);
                }
            })
            .catch(error => {
                console.error('Failed to cache PDF:', url, error);
                event.ports[0]?.postMessage({ success: false, url: url, error: error.message });
            });
    }
});

// Notify clients about updates
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker activated');
            // Notify all clients about the update
            return self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({ type: 'UPDATE_AVAILABLE' });
                });
            }).then(() => {
                return self.clients.claim();
            });
        })
    );
});