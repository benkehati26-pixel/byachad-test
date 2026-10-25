const CACHE = "beyachad-1azn84r"
const SHELL = ["./","./index.html","./404.html","./favicon.svg","./icons/apple-touch-icon.png","./manifest.webmanifest","./assets/index-ch31xdWg.js","./assets/index-F7NYxCtW.css","./gate.json","./robots.txt","./icons/icon-192.png","./icons/icon-512.png","./assets/rubik-arabic-wght-normal-CGnJ-sf6.woff2","./assets/rubik-cyrillic-ext-wght-normal-BjodpZir.woff2","./assets/rubik-cyrillic-wght-normal-DveCct9I.woff2","./assets/rubik-hebrew-wght-normal-BIkpbuMU.woff2","./assets/rubik-latin-ext-wght-normal-OacczzuJ.woff2","./assets/rubik-latin-wght-normal-CnQIisVs.woff2","./assets/fredoka-hebrew-wght-normal-DdnsCkLr.woff2","./assets/fredoka-latin-ext-wght-normal-CYrqKuxd.woff2","./assets/fredoka-latin-wght-normal-DM6njrJ3.woff2"]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

const ROOT = new URL('./', self.location)

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin || !url.pathname.startsWith(ROOT.pathname) || url.pathname.includes('/api/')) return
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put(event.request, copy)).catch(() => {})
        }
        return response
      })
      .catch(async () => {
        const cached = await caches.match(event.request)
        if (cached) return cached
        if (event.request.mode === 'navigate') return caches.match(new URL('./index.html', self.location))
        return caches.match(new URL('./index.html', self.location))
      }),
  )
})
