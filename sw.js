// Este service worker se auto-destrói para evitar problemas de cache
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.matchAll({includeUncontrolled: true}))
      .then(clients => clients.forEach(c => c.postMessage({action: 'reload'})))
      .then(() => self.registration.unregister())
  );
});
