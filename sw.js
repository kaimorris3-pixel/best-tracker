// Network first, bypassing the browser's HTTP cache (so updates reach the installed app), falling back to the cache when offline or the network is slow.
const CACHE="best-exercise-v9";
const ASSETS=["./","./index.html","./app.js","./manifest.json","./icon.svg","./icon-180.png","./icon-192.png","./icon-512.png"];
const NETWORK_TIMEOUT=3000;
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
function fromCache(request){return caches.match(request,{ignoreSearch:request.mode==="navigate"}).then(hit=>hit||(request.mode==="navigate"?caches.match("./index.html"):undefined))}
self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET"||new URL(request.url).origin!==self.location.origin)return;
  const network=fetch(request,{cache:"no-cache"}).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy))}return response});
  event.waitUntil(network.catch(()=>{}));
  event.respondWith(new Promise(resolve=>{
    let settled=false;const finish=r=>{if(!settled&&r){settled=true;resolve(r)}};
    const timer=setTimeout(()=>fromCache(request).then(finish),NETWORK_TIMEOUT);
    network.then(r=>{clearTimeout(timer);finish(r)}).catch(()=>{clearTimeout(timer);fromCache(request).then(r=>finish(r||Response.error()))});
  }));
});
