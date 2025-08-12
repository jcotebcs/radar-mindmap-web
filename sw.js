const PRECACHE = 'mm-v5-precache';
const RUNTIME = 'mm-v5-runtime';
const CORE = [
  '/', '/index.html', '/styles.css', '/manifest.webmanifest',
  '/scripts/app.js', '/scripts/auth.js', '/scripts/whipClient.js',
  '/scripts/timesheet.js', '/scripts/backgroundSync.js', '/scripts/export.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then(cache => cache.addAll(CORE)).then(()=> self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event)=>{
  const url = new URL(event.request.url);
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
  }
});

self.addEventListener('sync', (event)=>{
  if (event.tag === 'upload-queue') {
    event.waitUntil((async ()=>{
      try {
        const clientsList = await self.clients.matchAll({ includeUncontrolled:true, type:'window' });
        for (const c of clientsList) {
          c.postMessage({ type:'SYNC_UPLOAD' });
        }
      } catch(e){}
    })());
  }
});
