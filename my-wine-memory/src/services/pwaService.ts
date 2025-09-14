/**
 * PWA Service
 * Handles PWA installation, service worker registration, and app-specific notifications
 */

export class PWAService {
  private deferredPrompt: any = null;
  private isInstalled = false;
  private swRegistration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.checkIfInstalled();
    this.setupInstallPrompt();
  }

  // Check if app is already installed
  private checkIfInstalled() {
    // Check if running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
      console.log('App is running in standalone mode');
    }

    // Check for iOS
    if ((window.navigator as any).standalone) {
      this.isInstalled = true;
      console.log('App is running as iOS standalone');
    }
  }

  // Setup install prompt handler
  private setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      this.deferredPrompt = e;
      console.log('Install prompt ready');
    });

    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
      console.log('App installed successfully');
    });
  }

  // Register service worker (minimal plan A): rely on VitePWA auto registration
  // and just await the ready registration instead of manually registering here.
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      this.swRegistration = registration;
      console.log('Service Worker ready:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker readiness check failed:', error);
      return null;
    }
  }

  // Check if PWA can be installed
  canInstall(): boolean {
    return !this.isInstalled && this.deferredPrompt !== null;
  }

  // Check if app is installed
  isAppInstalled(): boolean {
    return this.isInstalled;
  }

  // Show install prompt
  async promptInstall(): Promise<boolean> {
    if (!this.canInstall()) {
      console.log('App cannot be installed at this time');
      return false;
    }

    // Show the install prompt
    this.deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await this.deferredPrompt.userChoice;
    
    console.log(`User response to install prompt: ${outcome}`);
    
    // Clear the deferred prompt
    this.deferredPrompt = null;
    
    return outcome === 'accepted';
  }

  // Schedule local notification (for PWA)
  async scheduleLocalNotification(notification: {
    id: string;
    title: string;
    body: string;
    scheduledTime: Date;
    type: string;
    url?: string;
  }): Promise<void> {
    if (!this.swRegistration) {
      throw new Error('Service Worker not registered');
    }

    // Send message to service worker to schedule notification
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        notification
      });
    }

    // If app is installed, we can also use Background Sync API
    if (this.isInstalled && 'sync' in this.swRegistration) {
      try {
        await (this.swRegistration as any).sync.register('send-notification');
        console.log('Background sync registered');
      } catch (error) {
        console.error('Background sync registration failed:', error);
      }
    }
  }

  // Enable periodic background sync for daily notifications
  async enablePeriodicSync(): Promise<boolean> {
    if (!this.swRegistration || !this.isInstalled) {
      return false;
    }

    // Check if periodic sync is supported
    if (!('periodicSync' in this.swRegistration)) {
      console.warn('Periodic background sync not supported');
      return false;
    }

    try {
      // Request permission for periodic sync
      const status = await navigator.permissions.query({
        name: 'periodic-background-sync' as PermissionName,
      });

      if (status.state === 'granted') {
        // Register periodic sync
        await (this.swRegistration as any).periodicSync.register('daily-notifications', {
          minInterval: 24 * 60 * 60 * 1000, // 24 hours
        });
        
        console.log('Periodic sync enabled');
        return true;
      } else {
        console.log('Periodic sync permission not granted');
        return false;
      }
    } catch (error) {
      console.error('Failed to enable periodic sync:', error);
      return false;
    }
  }

  // Update notification settings in service worker
  async updateNotificationSettings(settings: any): Promise<void> {
    if (!navigator.serviceWorker.controller) {
      throw new Error('Service Worker not active');
    }

    navigator.serviceWorker.controller.postMessage({
      type: 'ENABLE_NOTIFICATIONS',
      settings
    });
  }

  // (Update prompt removed in Plan A/B; SW auto-updates via VitePWA)

  // Get install instructions for iOS
  getIOSInstallInstructions(): string {
    return `iOSでインストールする方法：
1. Safari でこのページを開く
2. 共有ボタン（□↑）をタップ
3. 「ホーム画面に追加」を選択
4. 「追加」をタップ`;
  }

  // Check if running on iOS
  isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  }

  // Check if running in Safari
  isSafari(): boolean {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  // Show appropriate install instructions
  getInstallInstructions(): string | null {
    if (this.isInstalled) {
      return null;
    }

    if (this.isIOS()) {
      if (!this.isSafari()) {
        return 'iOSでインストールするには、Safariでこのページを開いてください。';
      }
      return this.getIOSInstallInstructions();
    }

    if (this.canInstall()) {
      return 'アプリをインストールして、より良い体験を得ましょう！';
    }

    return null;
  }
}

export const pwaService = new PWAService();
