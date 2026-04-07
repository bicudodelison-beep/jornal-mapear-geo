// Firebase Messaging Service Worker — Jornal Mapear Geo
// Este arquivo DEVE estar na raiz do site para receber notificações em background

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAFe1RUUwCY1tTfthrtBK3fAkGfXVPTMQg",
  authDomain: "mapear-geo.firebaseapp.com",
  projectId: "mapear-geo",
  storageBucket: "mapear-geo.firebasestorage.app",
  messagingSenderId: "908329303410",
  appId: "1:908329303410:web:e802f07a9d4d9fc49e31eb"
});

const messaging = firebase.messaging();

// Notificações recebidas com o app em background (tela bloqueada ou app minimizado)
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Notificação em background recebida:', payload);

  const { title, body, icon } = payload.notification || {};

  self.registration.showNotification(title || '📰 Jornal Mapear Geo', {
    body: body || 'Nova edição disponível. Toque para ler.',
    icon: icon || '/jornal-mapear-geo/icon-192.png',
    badge: '/jornal-mapear-geo/icon-192.png',
    data: { url: '/jornal-mapear-geo/' },
    actions: [
      { action: 'open', title: '▶ Abrir o Jornal' }
    ],
    vibrate: [200, 100, 200],
    requireInteraction: false
  });
});

// Ao clicar na notificação, abre o jornal
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url)
    ? event.notification.data.url
    : '/jornal-mapear-geo/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('jornal-mapear-geo') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
