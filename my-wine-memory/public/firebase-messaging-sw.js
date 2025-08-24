// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration (same as main app)
const firebaseConfig = {
  apiKey: "AIzaSyDVC5fhY6HfIe9uuxPtaiPSmWgBD3iboWY",
  authDomain: "mywinememory-4bdf9.firebaseapp.com",
  projectId: "mywinememory-4bdf9",
  storageBucket: "mywinememory-4bdf9.firebasestorage.app",
  messagingSenderId: "259770604601",
  appId: "1:259770604601:web:24ad6059ebe4ebadb7c1e8",
  measurementId: "G-BP6WYDEC7K"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'MyWineMemory';
  const notificationOptions = {
    body: payload.notification?.body || 'ワインの記録をお忘れなく！',
    icon: '/android/mipmap-mdpi/ic_launcher.png',
    badge: '/android/mipmap-mdpi/ic_launcher.png',
    tag: payload.data?.type || 'general',
    data: payload.data,
    actions: [
      {
        action: 'open',
        title: 'アプリを開く'
      },
      {
        action: 'dismiss',
        title: '後で'
      }
    ],
    requireInteraction: false,
    silent: false
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.');

  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Handle different notification types
  const data = event.notification.data;
  let url = '/';

  if (data?.type === 'streak_reminder') {
    url = '/select-wine';
  } else if (data?.type === 'quiz_reminder') {
    url = '/quiz';
  } else if (data?.type === 'badge_earned') {
    url = '/profile';
  } else if (data?.type === 'wine_memory') {
    url = data.wineUrl || '/records';
  } else if (data?.url) {
    url = data.url;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if a client is already open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      
      // Open a new window if no client is found
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});