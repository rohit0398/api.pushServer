// self.addEventListener("install", () => {
//   self.skipWaiting();
// });

self.addEventListener('push', (e) => {
  console.log('push e', e);
  e.waitUntil(self.registration.showNotification('Hello world!'));
});
