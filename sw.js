// Service Worker — Jornal Mapear Geo PWA
const CACHE_NAME = 'mapear-geo-v1';
const ASSETS = [
  '/jornal-mapear-geo/',
  '/jornal-mapear-geo/index.html',
  '/jornal-mapear-geo/manifest.json',
  '/jornal-mapear-geo/icon-192.png',
  '/jornal-mapear-geo/icon-512.png'
];

// Instalação: pré-cacheia os arquivos essenciais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Ativação: limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first para garantir sempre a edição mais recente
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Atualiza o cache com a versão mais recente
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => {
        // Se offline, serve do cache
        return caches.match(event.request);
      })
  );
});
