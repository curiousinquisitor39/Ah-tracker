// Service Worker — network first, no caching
// This ensures users always get the latest version of the app

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('fetch', e => {
  // Always go to network — no caching
  e.respondWith(
    fetch(e.request).catch(() => {
      // If network fails, return a simple offline message
      return new Response(
        '<h2 style="font-family:sans-serif;padding:20px">You are offline. Please reconnect to use AH Tracker.</h2>',
        { headers: { 'Content-Type': 'text/html' } }
      );
    })
  );
});
