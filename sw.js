// v1cded00d — auto-gerado, não editar manualmente
const CACHE = 'aga-v1cded00d';
const ASSETS = [
  '/aga-checklist/',
  '/aga-checklist/index.html',
  '/aga-checklist/manifest.json',
  '/aga-checklist/icon-192.png',
  '/aga-checklist/icon-512.png',
  '/aga-checklist/logo.png',
];

// Instala e ativa imediatamente, limpando caches antigos
self.addEventListener('install', e => {{
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS.map(u => new Request(u, {{cache: 'reload'}}))))
      .then(() => self.skipWaiting())
  );
}});

self.addEventListener('activate', e => {{
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
}});

// Network first para o index.html — garante sempre a versão mais recente
self.addEventListener('fetch', e => {{
  if (e.request.url.includes('supabase.co')) return;
  
  const isHTML = e.request.destination === 'document' || 
                 e.request.url.endsWith('/') || 
                 e.request.url.endsWith('.html');
  
  if (isHTML) {{
    // Network first: tenta buscar na rede, fallback para cache
    e.respondWith(
      fetch(e.request)
        .then(res => {{
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        }})
        .catch(() => caches.match(e.request))
    );
  }} else {{
    // Cache first para assets estáticos
    e.respondWith(
      caches.match(e.request).then(cached => {{
        if (cached) return cached;
        return fetch(e.request).then(res => {{
          if (!res || res.status !== 200) return res;
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        }});
      }})
    );
  }}
}});
