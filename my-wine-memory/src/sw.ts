/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope & typeof globalThis;

// Workbox imports
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkOnly } from 'workbox-strategies';

// Firebase (background messaging) in SW
import { initializeApp } from 'firebase/app';
// eslint-disable-next-line import/no-duplicates
import { getMessaging } from 'firebase/messaging/sw';
// eslint-disable-next-line import/no-duplicates
import { onBackgroundMessage } from 'firebase/messaging/sw';

// Immediate control
self.skipWaiting();
clientsClaim();

// Precache manifest (injected by VitePWA)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
precacheAndRoute(self.__WB_MANIFEST as any);
cleanupOutdatedCaches();

// SPA navigation fallback with denylist similar to previous config
const navigationDenylist = [
  /^\/__\/.*$/,
  /^\/google\.firestore\.v1\.Firestore/,
  /^\/v1\/projects\/.*\/databases\/.*\/documents\/.*/,
  /^\/google\.firestore\.v1beta1\.Firestore/,
  /^.*\.firebasestorage\.app\/_.*/,
  /^.*\.googleapis\.com\/.*/,
  /^\/assets\/.*/,
  /\.(?:png|jpg|jpeg|svg|webp|gif|ico|js|css|woff|woff2|ttf|json)$/
];
registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html'), { denylist: navigationDenylist }));

// Runtime caching strategies (replicating prior VitePWA workbox config)
registerRoute(
  ({ url }) => url.origin === 'https://firebasestorage.googleapis.com',
  new StaleWhileRevalidate({
    cacheName: 'firebase-storage',
  })
);

registerRoute(
  ({ request }) => ['image'].includes(request.destination) || /\.(?:png|jpg|jpeg|svg|webp|gif|ico)$/.test(new URL(request.url).pathname),
  new CacheFirst({ cacheName: 'static-images' })
);

registerRoute(
  ({ request }) => ['font'].includes(request.destination) || /\.(?:woff|woff2|ttf|otf)$/.test(new URL(request.url).pathname),
  new CacheFirst({ cacheName: 'fonts' })
);

registerRoute(
  ({ url }) => /\.googleapis\.com$/.test(url.hostname),
  new NetworkOnly()
);

// Initialize Firebase app for background messaging
try {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  } as const;

  if (
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  ) {
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    onBackgroundMessage(messaging, (payload) => {
      const title = payload.notification?.title || 'MyWineMemory';
      const options: NotificationOptions = {
        body: payload.notification?.body || 'ワインの記録をお忘れなく！',
        icon: '/android/mipmap-xxhdpi/ic_launcher.png',
        badge: '/android/mipmap-mdpi/ic_launcher.png',
        tag: (payload.data && (payload.data as any).type) || 'general',
        data: payload.data,
        requireInteraction: false,
        silent: false
      };
      self.registration.showNotification(title, options);
    });
  }
} catch (e) {
  // Ignore Firebase init errors in SW to avoid breaking offline
  // console.warn('Firebase init failed in SW:', e);
}

// Notification click handling (from previous custom SW)
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  if ((event as any).action === 'dismiss') return;

  const data: any = event.notification.data;
  let url = '/';
  if (data?.type === 'streak_reminder') url = '/select-wine';
  else if (data?.type === 'quiz_reminder') url = '/quiz';
  else if (data?.type === 'badge_earned') url = '/profile';
  else if (data?.type === 'wine_memory') url = data.wineUrl || '/records';
  else if (data?.url) url = data.url;

  event.waitUntil((async () => {
    const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientList) {
      try {
        await (client as WindowClient).navigate(url);
      } catch {}
      try {
        await (client as WindowClient).focus();
      } catch {}
      return;
    }
    if (self.clients.openWindow) {
      await self.clients.openWindow(url);
    }
  })());
});

// Local notification scheduling support (message channel)
class NotificationScheduler {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private async openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;
    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open('MyWineMemoryNotifications', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('notifications')) {
          db.createObjectStore('notifications', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('wine-records')) {
          db.createObjectStore('wine-records', { keyPath: 'id' });
        }
      };
    });
    return this.dbPromise;
  }

  async scheduleNotification(notification: any) {
    const db = await this.openDB();
    const tx = db.transaction(['notifications'], 'readwrite');
    tx.objectStore('notifications').put(notification);

    const delay = new Date(notification.scheduledTime).getTime() - Date.now();
    if (delay > 0) {
      setTimeout(async () => {
        await this.showNotification(notification.title, notification.body, notification.type, notification.url);
        await this.removeScheduled(notification.id);
      }, delay);
    }
  }

  async removeScheduled(id: string) {
    const db = await this.openDB();
    const tx = db.transaction(['notifications'], 'readwrite');
    tx.objectStore('notifications').delete(id);
  }

  async showNotification(title: string, body: string, type: string, url?: string) {
    if (Notification.permission !== 'granted') return;
    await self.registration.showNotification(title, {
      body,
      icon: '/android/mipmap-xxhdpi/ic_launcher.png',
      badge: '/android/mipmap-mdpi/ic_launcher.png',
      tag: type,
      data: { type, url },
      requireInteraction: false,
      silent: false
    });
  }

  async saveSettings(settings: any) {
    const db = await this.openDB();
    const tx = db.transaction(['settings'], 'readwrite');
    tx.objectStore('settings').put({ id: 'notification-settings', ...settings });
  }
}

const scheduler = new NotificationScheduler();

self.addEventListener('message', (event: ExtendableMessageEvent) => {
  const data: any = event.data;
  if (data?.type === 'SCHEDULE_NOTIFICATION') {
    event.waitUntil(scheduler.scheduleNotification(data.notification));
  }
  if (data?.type === 'ENABLE_NOTIFICATIONS') {
    event.waitUntil(scheduler.saveSettings(data.settings));
  }
});

// Background sync handlers (best-effort)
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'send-notification') {
    event.waitUntil((async () => {
      const db = await (scheduler as any).openDB();
      const tx = db.transaction(['notifications'], 'readonly');
      const all = await tx.objectStore('notifications').getAll();
      const now = Date.now();
      for (const n of all) {
        const when = new Date(n.scheduledTime).getTime();
        if (when <= now) {
          await scheduler.showNotification(n.title, n.body, n.type, n.url);
          await scheduler.removeScheduled(n.id);
        }
      }
    })());
  }
});

// Periodic sync for daily reminders (if supported)
self.addEventListener('periodicsync', (event: any) => {
  if (event.tag === 'daily-notifications') {
    event.waitUntil((async () => {
      // Minimal daily notifications example; real logic may inspect settings
      const hour = new Date().getHours();
      if (hour === 19) {
        await scheduler.showNotification('ワインの記録をお忘れなく！', '今日のワイン体験を記録しましょう', 'streak_reminder', '/select-wine');
      }
    })());
  }
});
