// sw.js - Enhanced Service Worker for PWA with Notifications
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const CACHE_NAME = 'my-wine-memory-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/android/mipmap-mdpi/ic_launcher.png',
  '/android/mipmap-hdpi/ic_launcher.png',
  '/android/mipmap-xhdpi/ic_launcher.png',
  '/android/mipmap-xxhdpi/ic_launcher.png',
  '/android/mipmap-xxxhdpi/ic_launcher.png'
];

// Firebase configuration
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
const messaging = firebase.messaging();

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});

// Background sync for offline notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'send-notification') {
    event.waitUntil(sendScheduledNotifications());
  }
});

// Periodic background sync (requires PWA installation)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-notifications') {
    event.waitUntil(handleDailyNotifications());
  }
});

// Handle FCM background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'MyWineMemory';
  const notificationOptions = {
    body: payload.notification?.body || 'ワインの記録をお忘れなく！',
    icon: '/android/mipmap-xxhdpi/ic_launcher.png',
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
    silent: false,
    vibrate: [200, 100, 200]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[sw.js] Notification click received.');
  
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

// Local notification scheduling for PWA
class NotificationScheduler {
  constructor() {
    this.scheduledNotifications = new Map();
  }

  async scheduleNotification(notificationData) {
    const { id, title, body, scheduledTime, type, url } = notificationData;
    
    // Store in IndexedDB for persistence
    await this.storeScheduledNotification(notificationData);
    
    // Calculate delay
    const delay = new Date(scheduledTime).getTime() - Date.now();
    
    if (delay > 0) {
      // Use setTimeout for near-future notifications
      setTimeout(() => {
        this.showNotification(title, body, type, url);
        this.removeScheduledNotification(id);
      }, delay);
    }
  }

  async showNotification(title, body, type, url) {
    // Check if we have permission
    if (Notification.permission !== 'granted') {
      return;
    }

    const options = {
      body,
      icon: '/android/mipmap-xxhdpi/ic_launcher.png',
      badge: '/android/mipmap-mdpi/ic_launcher.png',
      tag: type,
      data: { type, url },
      requireInteraction: false,
      silent: false,
      vibrate: [200, 100, 200]
    };

    await self.registration.showNotification(title, options);
  }

  async storeScheduledNotification(notificationData) {
    // Open IndexedDB
    const db = await this.openDB();
    const transaction = db.transaction(['notifications'], 'readwrite');
    const store = transaction.objectStore('notifications');
    await store.put(notificationData);
  }

  async removeScheduledNotification(id) {
    const db = await this.openDB();
    const transaction = db.transaction(['notifications'], 'readwrite');
    const store = transaction.objectStore('notifications');
    await store.delete(id);
  }

  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MyWineMemoryNotifications', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('notifications')) {
          db.createObjectStore('notifications', { keyPath: 'id' });
        }
      };
    });
  }
}

const scheduler = new NotificationScheduler();

// Handle daily notifications for PWA
async function handleDailyNotifications() {
  const now = new Date();
  const hour = now.getHours();
  
  // Get user preferences from IndexedDB
  const db = await scheduler.openDB();
  const transaction = db.transaction(['settings'], 'readonly');
  const store = transaction.objectStore('settings');
  const settings = await store.get('notification-settings');
  
  if (!settings || !settings.enabled) {
    return;
  }
  
  // Morning quiz reminder (9-11 AM)
  if (hour === 9 && settings.types.quiz_reminder) {
    await scheduler.showNotification(
      'おはようございます！クイズの時間です',
      '朝のワインクイズで知識をテストしましょう',
      'quiz_reminder',
      '/quiz'
    );
  }
  
  // Afternoon quiz reminder (2-4 PM)
  if (hour === 14 && settings.types.quiz_reminder) {
    await scheduler.showNotification(
      'ワインクイズでリフレッシュ！',
      '午後のひとときにワイン知識を深めませんか？',
      'quiz_reminder',
      '/quiz'
    );
  }
  
  // Evening streak reminder (7 PM)
  if (hour === 19 && settings.types.streak_reminder) {
    await scheduler.showNotification(
      'ワインの記録をお忘れなく！',
      '今日のワイン体験を記録しましょう',
      'streak_reminder',
      '/select-wine'
    );
  }
  
  // Random wine memory recall (once a day)
  if (hour === 12 && Math.random() > 0.5) {
    await getRandomWineMemory();
  }
}

// Get random wine memory for recall notification
async function getRandomWineMemory() {
  try {
    // Get stored wine records from IndexedDB
    const db = await scheduler.openDB();
    const transaction = db.transaction(['wine-records'], 'readonly');
    const store = transaction.objectStore('wine-records');
    const records = await store.getAll();
    
    if (records && records.length > 0) {
      const randomRecord = records[Math.floor(Math.random() * records.length)];
      const daysSince = Math.floor((Date.now() - new Date(randomRecord.date).getTime()) / (1000 * 60 * 60 * 24));
      
      await scheduler.showNotification(
        `${randomRecord.wineName}を覚えていますか？`,
        `${daysSince}日前に飲んだワイン（評価: ${randomRecord.rating}/10）`,
        'wine_memory',
        `/wine-detail/${randomRecord.wineId}`
      );
    }
  } catch (error) {
    console.error('Error getting random wine memory:', error);
  }
}

// Register periodic sync when SW is activated
self.addEventListener('activate', async () => {
  // Check if periodic sync is supported
  if ('periodicSync' in self.registration) {
    const status = await navigator.permissions.query({
      name: 'periodic-background-sync',
    });
    
    if (status.state === 'granted') {
      try {
        // Register daily sync
        await self.registration.periodicSync.register('daily-notifications', {
          minInterval: 24 * 60 * 60 * 1000, // 24 hours
        });
        console.log('Periodic sync registered');
      } catch (error) {
        console.error('Periodic sync registration failed:', error);
      }
    }
  }
});

// Send scheduled notifications (for background sync)
async function sendScheduledNotifications() {
  const db = await scheduler.openDB();
  const transaction = db.transaction(['notifications'], 'readonly');
  const store = transaction.objectStore('notifications');
  const notifications = await store.getAll();
  
  const now = Date.now();
  
  for (const notification of notifications) {
    const scheduledTime = new Date(notification.scheduledTime).getTime();
    
    if (scheduledTime <= now) {
      await scheduler.showNotification(
        notification.title,
        notification.body,
        notification.type,
        notification.url
      );
      
      // Remove sent notification
      await scheduler.removeScheduledNotification(notification.id);
    }
  }
}

// Listen for messages from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    scheduler.scheduleNotification(event.data.notification);
  }
  
  if (event.data && event.data.type === 'ENABLE_NOTIFICATIONS') {
    // Store settings in IndexedDB
    scheduler.openDB().then(db => {
      const transaction = db.transaction(['settings'], 'readwrite');
      const store = transaction.objectStore('settings');
      store.put({ id: 'notification-settings', ...event.data.settings });
    });
  }
});