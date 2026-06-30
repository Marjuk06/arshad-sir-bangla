// Development Helper Script
// Add this to browser console for quick cache clearing

console.log('🚀 Development Helper Loaded!');
console.log('Available commands:');
console.log('  clearCache() - Clear all caches and reload');
console.log('  forceUpdate() - Force service worker update');
console.log('  checkCache() - Check current cache status');

window.clearCache = function () {
    if ('caches' in window) {
        caches.keys().then(cacheNames => {
            console.log('Found caches:', cacheNames);
            cacheNames.forEach(cacheName => {
                caches.delete(cacheName);
                console.log('✅ Cleared cache:', cacheName);
            });
            console.log('🔄 Reloading page...');
            window.location.reload();
        });
    } else {
        console.log('❌ Cache API not available');
    }
};

window.forceUpdate = function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
            if (registration) {
                registration.update().then(() => {
                    console.log('✅ Service worker update forced');
                    window.location.reload();
                });
            } else {
                console.log('❌ No service worker registration found');
            }
        });
    } else {
        console.log('❌ Service Worker not supported');
    }
};

window.checkCache = function () {
    if ('caches' in window) {
        caches.keys().then(cacheNames => {
            console.log('📦 Current caches:');
            cacheNames.forEach(cacheName => {
                caches.open(cacheName).then(cache => {
                    cache.keys().then(requests => {
                        console.log(`  ${cacheName}: ${requests.length} items`);
                        requests.forEach(request => {
                            console.log(`    - ${request.url}`);
                        });
                    });
                });
            });
        });
    } else {
        console.log('❌ Cache API not available');
    }
};

// Auto-clear cache on development
if (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('localhost')) {
    console.log('🔧 Development mode detected - cache auto-clearing enabled');
}













