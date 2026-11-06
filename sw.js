/* Anchored Inside service worker.
   Bump CACHE_VERSION when the site shell changes so precached pages and
   assets refresh. HTML and JSON stay network-first, so a published update
   shows up on the next visit while the visitor is online. Handouts and
   resources.json are stored the first time they are opened. */

const CACHE_VERSION = 'anchored-v22';
const SHELL_CACHE = `anchored-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `anchored-runtime-${CACHE_VERSION}`;

const FONT_STYLESHEET = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Manrope:wght@400;500;600;700;800&display=swap';

const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/philosophy.html',
  '/services.html',
  '/resources.html',
  '/contact.html',
  '/privacy.html',
  '/disclaimer.html',
  '/manifest.webmanifest',
  '/manifest-practice.webmanifest',
  '/assets/css/styles.css',
  '/assets/app.js',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/icons/icon-maskable-512.png',
  '/assets/icons/apple-touch-icon.png',
  '/assets/images/favicon.png',
  '/assets/images/anchored-inside-logo.png',
  '/assets/images/anchored-inside-logo-white.png',
  '/assets/images/hero-coast.jpg',
  '/assets/images/homepage-hero-crisp.svg',
  '/assets/images/jessica-prosser-beach.webp',
  '/assets/images/service-children.png',
  '/assets/images/service-teens.png',
  '/assets/images/service-adults.png',
  '/assets/images/service-families.png',
  '/assets/images/hiking-boots.png',
  '/assets/images/jess-lake-louise-new.jpeg',
  '/assets/images/jess-summit-silhouette.jpeg',
  '/assets/images/jessica-prosser-sedona.jpeg',
  '/assets/images/philosophy-all-parts-crisp.jpg',
  '/assets/images/philosophy-hero-nature.svg',
  '/assets/images/philosophy-safety-first-crisp.jpg',
  '/assets/images/philosophy-wisdom-within-crisp.jpg',
  '/assets/images/philosophy-coast.jpg',
  '/assets/images/services-hero-beach.svg',
  '/assets/images/struggles-have-stories.png',
  '/assets/images/values-compass.png',
  '/assets/images/window-tolerance.png',
  '/assets/images/toolbox-lighthouse.jpg',
  '/assets/images/virginia-evergreens.svg',
  '/assets/images/toolkit/grounding-skills.jpg',
  '/assets/handouts/anchoring-family.jpeg',
  '/assets/handouts/structure.jpeg',
  '/assets/handouts/upstairs-downstairs-brain.jpeg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(precache());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key !== SHELL_CACHE && key !== RUNTIME_CACHE)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  if (url.origin === self.location.origin) {
    if (url.pathname === '/sw.js') return;
    if (isPdf(url)) {
      event.respondWith(handlePdf(request, url));
      return;
    }
    if (isJson(url)) {
      event.respondWith(networkFirst(request, RUNTIME_CACHE));
      return;
    }
    if (isPage(request, url)) {
      event.respondWith(networkFirst(request, SHELL_CACHE));
      return;
    }
    if (isStaticAsset(url)) {
      event.respondWith(cacheFirst(request));
    }
    return;
  }

  if (isFontHost(url)) {
    event.respondWith(cacheFirst(request));
  }
});

async function precache() {
  const cache = await caches.open(SHELL_CACHE);
  await Promise.all(SHELL_ASSETS.map(async (url) => {
    try {
      await cache.add(url);
    } catch (error) {
      throw new Error(`Precache failed for ${url}: ${error && error.message ? error.message : error}`);
    }
  }));
  try {
    await precacheFonts(cache);
  } catch (error) {
    // The shell still installs if the font host cannot be reached.
  }
}

async function precacheFonts(cache) {
  const cssResponse = await fetch(FONT_STYLESHEET, { mode: 'cors', credentials: 'omit' });
  if (!cssResponse.ok) return;
  const css = await cssResponse.clone().text();
  await cache.put(FONT_STYLESHEET, cssResponse);
  const fontUrls = new Set();
  for (const match of css.matchAll(/url\((['"]?)(https:[^)'"]+)\1\)/g)) {
    fontUrls.add(match[2]);
  }
  await Promise.all([...fontUrls].map(async (fontUrl) => {
    const fontResponse = await fetch(fontUrl, { mode: 'cors', credentials: 'omit' });
    if (fontResponse.ok) await cache.put(fontUrl, fontResponse);
  }));
}

function isPdf(url) {
  return url.pathname.startsWith('/assets/') && url.pathname.toLowerCase().endsWith('.pdf');
}

function isJson(url) {
  return url.pathname.endsWith('.json');
}

function isPage(request, url) {
  if (url.pathname.startsWith('/assets/')) return false;
  if (request.mode === 'navigate') return true;
  if (url.pathname.endsWith('.html') || url.pathname.endsWith('/')) return true;
  return (request.headers.get('accept') || '').includes('text/html');
}

function isStaticAsset(url) {
  return url.pathname.startsWith('/assets/') || url.pathname === '/manifest.webmanifest' || url.pathname === '/manifest-practice.webmanifest';
}

function isFontHost(url) {
  return url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    // Revalidate with the server so an updated page shows on the next visit,
    // even when the browser's HTTP cache still holds an older copy.
    const response = await fetch(request, { cache: 'no-cache' });
    if (response && response.ok && response.type === 'basic') {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request, { ignoreVary: true })
      || await cache.match(request, { ignoreSearch: true, ignoreVary: true })
      || await caches.match(request, { ignoreVary: true })
      || await caches.match(request, { ignoreSearch: true, ignoreVary: true });
    if (cached) return cached;
    if (request.mode === 'navigate') {
      const home = await cache.match('/index.html') || await cache.match('/');
      if (home) return home;
    }
    return offlineResponse();
  }
}

async function cacheFirst(request) {
  const shell = await caches.open(SHELL_CACHE);
  const runtime = await caches.open(RUNTIME_CACHE);
  const cached = await shell.match(request, { ignoreVary: true }) || await runtime.match(request, { ignoreVary: true });
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.ok && response.status === 200 && (response.type === 'basic' || response.type === 'cors')) {
      const destination = isShellRequest(request) ? shell : runtime;
      await destination.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const fallback = await shell.match(request, { ignoreSearch: true, ignoreVary: true })
      || await runtime.match(request, { ignoreSearch: true, ignoreVary: true });
    return fallback || offlineResponse();
  }
}

function isShellRequest(request) {
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return true;
  const path = url.pathname;
  return SHELL_ASSETS.some((asset) => asset === path);
}

async function handlePdf(request, url) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cacheKey = url.origin + url.pathname;
  const cached = await cache.match(cacheKey, { ignoreVary: true });
  if (cached) {
    return request.headers.has('range') ? respondToRange(request, cached) : cached;
  }

  try {
    const response = await fetch(cacheKey);
    if (!response || !response.ok || response.status !== 200) return response;
    await cache.put(cacheKey, response.clone());
    return request.headers.has('range') ? respondToRange(request, response) : response;
  } catch (error) {
    return offlineResponse('This handout is not available offline yet. Open it once while online, then it will be saved on this device.');
  }
}

async function respondToRange(request, response) {
  const buffer = await response.clone().arrayBuffer();
  const match = /bytes=(\d+)-(\d*)/.exec(request.headers.get('range') || '');
  const type = response.headers.get('Content-Type') || 'application/pdf';
  if (!match) {
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': type,
        'Content-Length': String(buffer.byteLength),
        'Accept-Ranges': 'bytes'
      }
    });
  }

  const size = buffer.byteLength;
  const start = Number(match[1]);
  let end = match[2] ? Number(match[2]) : size - 1;
  if (!Number.isFinite(start) || start >= size || start < 0) {
    return new Response(null, {
      status: 416,
      headers: { 'Content-Range': `bytes */${size}` }
    });
  }
  end = Math.min(end, size - 1);
  const slice = buffer.slice(start, end + 1);
  return new Response(slice, {
    status: 206,
    headers: {
      'Content-Type': type,
      'Content-Length': String(slice.byteLength),
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes'
    }
  });
}

function offlineResponse(message) {
  return new Response(message || 'You are offline, and this page has not been saved on this device yet.', {
    status: 503,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
