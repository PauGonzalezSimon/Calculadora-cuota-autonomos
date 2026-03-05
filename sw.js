// Service Worker para caché de larga duración y manejo de 404 personalizado
const CACHE_NAME = 'autonomos-lf-v2';
const ASSETS_TO_CACHE = [
    '/fonts/font-0.woff2',
    '/fonts/font-5.woff2',
    '/logo-icono.webp',
    '/404.html',
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(function () {
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (name) {
                    return name !== CACHE_NAME;
                }).map(function (name) {
                    return caches.delete(name);
                })
            );
        }).then(function () {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', function (event) {
    const url = new URL(event.request.url);

    // Solo manejar peticiones del mismo origen
    if (url.origin !== self.location.origin) return;

    // Assets con cache larga duración (fuentes y logo)
    const cachedAssets = ['/fonts/font-0.woff2', '/fonts/font-5.woff2', '/logo-icono.webp'];
    if (cachedAssets.includes(url.pathname)) {
        event.respondWith(
            caches.match(event.request).then(function (cached) {
                if (cached) return cached;
                return fetch(event.request).then(function (response) {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
                    }
                    return response;
                });
            })
        );
        return;
    }

    // Para navegación HTML: si da 404, servir nuestro 404.html personalizado
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).then(function (response) {
                if (response.status === 404) {
                    return caches.match('/404.html').then(function (cached) {
                        if (cached) return cached;
                        return fetch('/404.html');
                    }).then(function (r) {
                        // Devolver con status 404 para SEO correcto
                        return new Response(r.body, {
                            status: 404,
                            statusText: 'Not Found',
                            headers: r.headers
                        });
                    });
                }
                return response;
            }).catch(function () {
                // Offline fallback
                return caches.match('/404.html');
            })
        );
    }
});
