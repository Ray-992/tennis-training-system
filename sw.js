{\rtf1\ansi\ansicpg1252\cocoartf2639
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fmodern\fcharset0 Courier;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs26 \cf0 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 const CACHE_NAME = 'tennis-system-v1';\
const ASSETS_TO_CACHE = [\
  './',\
  './index.html',\
  './manifest.json',\
  './icon-192.png',\
  './icon-512.png'\
];\
\
// Install Event - Cache essential static files\
self.addEventListener('install', (event) => \{\
  event.waitUntil(\
    caches.open(CACHE_NAME).then((cache) => \{\
      console.log('[Service Worker] Caching app shell...');\
      return cache.addAll(ASSETS_TO_CACHE);\
    \})\
  );\
  self.skipWaiting();\
\});\
\
// Activate Event - Clean up old caches\
self.addEventListener('activate', (event) => \{\
  event.waitUntil(\
    caches.keys().then((keyList) => \{\
      return Promise.all(\
        keyList.map((key) => \{\
          if (key !== CACHE_NAME) \{\
            console.log('[Service Worker] Removing old cache:', key);\
            return caches.delete(key);\
          \}\
        \})\
      );\
    \})\
  );\
  self.clients.claim();\
\});\
\
// Fetch Event - Serve cached content when offline, fallback to network\
self.addEventListener('fetch', (event) => \{\
  // Always fetch dynamic API calls (like Supabase requests) directly from the network\
  if (event.request.url.includes('supabase.co')) \{\
    return;\
  \}\
\
  event.respondWith(\
    caches.match(event.request).then((cachedResponse) => \{\
      if (cachedResponse) \{\
        return cachedResponse;\
      \}\
      return fetch(event.request).catch(() => \{\
        // Fallback for offline fetch\
        return caches.match('./index.html');\
      \});\
    \})\
  );\
\});\
}