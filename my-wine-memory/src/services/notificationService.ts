/**
 * Push Notification Service
 * Handles FCM token management, permission requests, and notification subscriptions
 */

import { 
  getToken, 
  onMessage
} from 'firebase/messaging';
import type { 
  Messaging,
  MessagePayload 
} from 'firebase/messaging';
import { 
  doc, 
  setDoc, 
  deleteDoc, 
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Notification types
export type NotificationType = 
  | 'streak_reminder'      // Daily streak reminders
  | 'quiz_reminder'        // Quiz reminders  
  | 'badge_earned'         // New badge notifications
  | 'weekly_summary'       // Weekly activity summary
  | 'heart_recovery'       // Quiz hearts recovered
  | 'friend_activity';     // Friend's wine records (future)

export interface NotificationSettings {
  enabled: boolean;
  types: {
    [K in NotificationType]: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string;   // HH:mm format
  };
  timezone: string;
}

export interface FCMToken {
  userId: string;
  token: string;
  deviceInfo: {
    userAgent: string;
    platform: string;
    timestamp: Date;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class NotificationService {
  private messaging: Messaging | null = null;
  private vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

  constructor() {
    // Messaging will be initialized asynchronously
    this.initializeMessaging();
  }

  private async initializeMessaging() {
    if (typeof window === 'undefined') return;

    try {
      // Import getMessaging directly instead of the messaging instance
      const { getMessaging, isSupported } = await import('firebase/messaging');
      const { default: app } = await import('../services/firebase');

      // Check if messaging is supported before initializing
      const supported = await isSupported();
      if (supported) {
        this.messaging = getMessaging(app);
      } else {
        console.warn('Firebase Messaging is not supported in this browser');
      }
    } catch (error) {
      console.warn('Failed to initialize messaging:', error);
    }
  }

  // Check if notifications are supported
  isSupported(): boolean {
    return (
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window
    );
  }

  // Get current permission status
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      throw new Error('ブラウザが通知をサポートしていません');
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      throw new Error('通知が拒否されています。ブラウザの設定から許可してください');
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Get FCM token
  async getFCMToken(userId: string): Promise<string | null> {
    if (!this.messaging) {
      console.warn('Messaging not initialized');
      return null;
    }

    // Check if VAPID key is configured
    if (!this.vapidKey || this.vapidKey === 'your-vapid-key-here') {
      console.warn('VAPID key not configured. Push notifications will use local notifications only.');
      // Return a dummy token for local notifications
      return `local-${userId}-${Date.now()}`;
    }

    try {
      // Use existing service worker registration managed by VitePWA
      const registration = await navigator.serviceWorker.ready;

      const token = await getToken(this.messaging, {
        vapidKey: this.vapidKey,
        serviceWorkerRegistration: registration
      });

      if (token) {
        // Save token to Firestore
        await this.saveFCMToken(userId, token);
        return token;
      }

      return null;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      // Fallback to local notifications
      return `local-${userId}-${Date.now()}`;
    }
  }

  // Note: No separate registration for FCM; we rely on the main SW.

  // Save FCM token to Firestore
  private async saveFCMToken(userId: string, token: string): Promise<void> {
    try {
      const tokenRef = doc(db, 'fcm_tokens', `${userId}_${token.slice(-8)}`);
      
      const tokenData: Omit<FCMToken, 'id'> = {
        userId,
        token,
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          timestamp: new Date()
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(tokenRef, {
        ...tokenData,
        createdAt: Timestamp.fromDate(tokenData.createdAt),
        updatedAt: Timestamp.fromDate(tokenData.updatedAt),
        'deviceInfo.timestamp': Timestamp.fromDate(tokenData.deviceInfo.timestamp)
      });

      console.log('FCM token saved successfully');
    } catch (error) {
      console.error('Error saving FCM token:', error);
      throw error;
    }
  }

  // Remove FCM token
  async removeFCMToken(userId: string, token: string): Promise<void> {
    try {
      const tokenRef = doc(db, 'fcm_tokens', `${userId}_${token.slice(-8)}`);
      await deleteDoc(tokenRef);
      console.log('FCM token removed successfully');
    } catch (error) {
      console.error('Error removing FCM token:', error);
      throw error;
    }
  }

  // Setup foreground message listener
  setupForegroundMessages(callback: (payload: MessagePayload) => void): void {
    if (!this.messaging) return;

    onMessage(this.messaging, (payload) => {
      console.log('Foreground message received:', payload);
      
      // Show browser notification for foreground messages
      if (Notification.permission === 'granted') {
        const title = payload.notification?.title || 'MyWineMemory';
        const options = {
          body: payload.notification?.body || '',
          icon: '/android/mipmap-mdpi/ic_launcher.png',
          badge: '/android/mipmap-mdpi/ic_launcher.png',
          tag: payload.data?.type || 'general',
          data: payload.data
        };

        new Notification(title, options);
      }

      callback(payload);
    });
  }

  // Get user notification settings
  async getUserNotificationSettings(userId: string): Promise<NotificationSettings> {
    try {
      const settingsRef = doc(db, 'notification_settings', userId);
      const settingsDoc = await getDoc(settingsRef);

      if (settingsDoc.exists()) {
        return settingsDoc.data() as NotificationSettings;
      }

      // Return default settings
      return this.getDefaultNotificationSettings();
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return this.getDefaultNotificationSettings();
    }
  }

  // Update user notification settings
  async updateNotificationSettings(
    userId: string, 
    settings: Partial<NotificationSettings>
  ): Promise<void> {
    try {
      const settingsRef = doc(db, 'notification_settings', userId);
      const currentSettings = await this.getUserNotificationSettings(userId);
      
      const updatedSettings = {
        ...currentSettings,
        ...settings,
        userId: userId, // Add userId field for Firestore rules
        types: {
          ...currentSettings.types,
          ...settings.types
        },
        quietHours: {
          ...currentSettings.quietHours,
          ...settings.quietHours
        },
        updatedAt: new Date()
      };

      await setDoc(settingsRef, updatedSettings);
      console.log('Notification settings updated successfully');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw new Error('通知設定の更新に失敗しました');
    }
  }

  // Get default notification settings
  private getDefaultNotificationSettings(): NotificationSettings {
    return {
      enabled: false,
      types: {
        streak_reminder: true,
        quiz_reminder: true,
        badge_earned: true,
        weekly_summary: false,
        heart_recovery: true,
        friend_activity: false
      },
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00'
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  // Test notification
  async testNotification(): Promise<void> {
    if (Notification.permission !== 'granted') {
      throw new Error('通知の許可が必要です');
    }

    const notification = new Notification('MyWineMemory テスト通知', {
      body: '通知が正常に動作しています！',
      icon: '/android/mipmap-mdpi/ic_launcher.png',
      badge: '/android/mipmap-mdpi/ic_launcher.png',
      tag: 'test'
    });

    setTimeout(() => notification.close(), 5000);
  }

  // Enable notifications for user
  async enableNotifications(userId: string): Promise<boolean> {
    try {
      // Request permission
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        return false;
      }

      // Get FCM token (or local token as fallback)
      const token = await this.getFCMToken(userId);
      if (!token) {
        console.warn('Could not get FCM token, using local notifications only');
        // Continue with local notifications
      }

      // Update settings
      await this.updateNotificationSettings(userId, { enabled: true });

      // Setup foreground message listener
      this.setupForegroundMessages((payload) => {
        console.log('Received notification:', payload);
      });

      return true;
    } catch (error) {
      console.error('Error enabling notifications:', error);
      throw error;
    }
  }

  // Disable notifications for user
  async disableNotifications(userId: string): Promise<void> {
    try {
      // Update settings
      await this.updateNotificationSettings(userId, { enabled: false });
      
      // Note: We keep the FCM token in case user re-enables
      console.log('Notifications disabled successfully');
    } catch (error) {
      console.error('Error disabling notifications:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
