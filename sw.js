const CACHE_NAME = 'carequest-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './img/IMG-20261014-WA0009.jpg',
  './img/images2.jpg',
  './img/money01.png',
  './img/money02.png',
  './img/money03.png',
  './img/money04.png',
  './img/money05.png',
  './img/money06.png',
  './img/money07.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => caches.match('./index.html'));
    })
  );
});
