const C='byachad-v2-14';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html'])))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
const keep=(req,res)=>{if(res&&res.ok&&res.type==='basic'){const cl=res.clone();caches.open(C).then(c=>c.put(req,cl))}return res};
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin||u.pathname.endsWith('gate.json'))return;
// Pages: network first so a new version shows on the next open; offline falls back to the cached shell.
if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>keep('./index.html',res)).catch(()=>caches.match('./index.html').then(x=>x||caches.match('./'))));return}
// Hashed assets: cache first.
e.respondWith(caches.match(r).then(x=>x||fetch(r).then(res=>keep(r,res))))});
