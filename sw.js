/* Saliohjelma – service worker.
   Sovellus toimii ilman verkkoa ensimmäisen latauksen jälkeen.
   Versionumeroa nostamalla vanha välimuisti korvautuu.
   Firebasen yhteyksiin (kirjautuminen, Firestore) ei kosketa: ne kulkevat
   aina suoraan verkkoon, jotta reaaliaikainen synkronointi toimii. */
const CACHE = 'saliohjelma-v11.1.0';
const SHELL = ['./', './index.html', './themes.css?v=11.1.0', './assets/hero-neon.webp', './assets/hero-deco.webp', './assets/hero-mono.webp', './assets/hero-nature.webp', './assets/hero-dark.webp', './assets/hero-light.webp', './manifest.json?v=11.1.0', './favicon.ico?v=11.1.0', './icon-48.png?v=11.1.0', './icon-192.png?v=11.1.0', './icon-512.png?v=11.1.0', './icon-180.png?v=11.1.0', './icon-maskable-512.png?v=11.1.0',
  './firebase/firebase-app.js', './firebase/firebase-auth.js', './firebase/firebase-firestore.js'];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(k){ return k === CACHE ? null : caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

self.addEventListener('fetch', function(e){
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  if(!sameOrigin && FONT_HOSTS.indexOf(url.hostname) < 0) return;   /* Firebase ym. suoraan verkkoon */
  if(req.mode === 'navigate'){
    /* sivu: verkko ensin, jotta päivitykset tulevat perille; ilman verkkoa välimuisti */
    e.respondWith(
      fetch(req).then(function(res){
        const copy = res.clone();
        if(res.ok) e.waitUntil(caches.open(CACHE).then(function(c){ return c.put('./index.html', copy); }));
        return res;
      }).catch(function(){
        return caches.match('./index.html').then(function(m){ return m || caches.match('./'); });
      })
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(function(hit){
      return hit || fetch(req).then(function(res){
        if(res && (res.ok || res.type === 'opaque')){
          const copy = res.clone();
          e.waitUntil(caches.open(CACHE).then(function(c){ return c.put(req, copy); }));
        }
        return res;
      });
    })
  );
});
