'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "2cffdfcbddf31a1c79d6502a81a37799",
"version.json": "185562450ee55176c6a6451671686e5b",
"splash/img/light-2x.png": "3ce283a323b28995743d964e28f68163",
"splash/img/dark-4x.png": "60f96537e8ce3ed901b134ab44d0cb76",
"splash/img/light-3x.png": "3973c8bab89e93fbba63837070c115b3",
"splash/img/dark-3x.png": "ca7618bda6ee598c124e145c50c33ac0",
"splash/img/light-4x.png": "b6fd02dbeb4db2f9ecd361b9c30b4132",
"splash/img/dark-2x.png": "38ed5aa4784eaa712d6f870404686443",
"splash/img/dark-1x.png": "9c1db72fd6539f031089136565a25be3",
"splash/img/light-1x.png": "14d127f5d7b9a8e20885e4dec4b65a27",
"splash/splash.js": "a38a14ca5945d36e43ff966ee8e281c5",
"splash/style.css": "bd8f82c2553697a1970f036b8d2d44a8",
"index.html": "6d3f1962fdc42a1d0114f7b3ba9aa341",
"/": "6d3f1962fdc42a1d0114f7b3ba9aa341",
"privacy-policy.html": "70172e1f15cd08953ed9e74262f02533",
"contact.html": "c8fb5e8e724d17170acc37792158239f",
"CNAME": "9fe95c74bd2f7b04bd47891d1cd836cb",
"main.dart.js": "867e1f842b42ac33f051932006b57c4b",
"flutter.js": "4b2350e14c6650ba82871f60906437ea",
"README.md": "4337d03d259a6e2fe8d319b5ae16aba1",
"favicon.png": "e719b63ace400c76f660c3317c48a31a",
"icons/Icon-192.png": "0cc894aa5b222c8c348f30a2bbefe3d9",
"manifest.json": "e928b126f560017bc75287fedd809542",
"assets/AssetManifest.json": "641a439fa9a2609ce38120ab60b44273",
"assets/NOTICES": "101ed9aa7177f5aec992fffd7dfa12cf",
"assets/FontManifest.json": "9c99822995af0e16b6a3a986838b591d",
"assets/AssetManifest.bin.json": "72f903b5c8dbc9a0ee972777c577ae6e",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "167bdbc324f8c158530ac18602b1a4ef",
"assets/fonts/Clash_Bold.otf": "6824b1e58edc010f07012a75647cf69b",
"assets/fonts/MaterialIcons-Regular.otf": "da8b541d4f5fa9a27e64ed5f03ebca65",
"assets/fonts/Clash_Regular.otf": "f37da98a3139ccdedbcf639072777796",
"assets/assets/images/splash_dark.png": "b290e697d3df8c65e0abe146296898ae",
"assets/assets/images/avatar.png": "6a0d2082987d1cfbf3722298084a7671",
"assets/assets/images/logo.png": "b4c57edf3501bf07c58e6c2d7b781353",
"assets/assets/images/logo_light.png": "deb8ec416c554a21295964ab08ff1bac",
"assets/assets/images/splash_light.png": "75e6d3e6593aba9baa0e67266c14eebe",
"translate.html": "a757a1add1ee111a9ddf954d78175ee7",
"sitemap.txt": "846ebdf1ffb7a64df43d4967af6c75d3",
"canvaskit/skwasm.js": "ac0f73826b925320a1e9b0d3fd7da61c",
"canvaskit/skwasm.js.symbols": "96263e00e3c9bd9cd878ead867c04f3c",
"canvaskit/canvaskit.js.symbols": "efc2cd87d1ff6c586b7d4c7083063a40",
"canvaskit/skwasm.wasm": "828c26a0b1cc8eb1adacbdd0c5e8bcfa",
"canvaskit/chromium/canvaskit.js.symbols": "e115ddcfad5f5b98a90e389433606502",
"canvaskit/chromium/canvaskit.js": "b7ba6d908089f706772b2007c37e6da4",
"canvaskit/chromium/canvaskit.wasm": "ea5ab288728f7200f398f60089048b48",
"canvaskit/canvaskit.js": "26eef3024dbc64886b7f48e1b6fb05cf",
"canvaskit/canvaskit.wasm": "e7602c687313cfac5f495c5eac2fb324",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
