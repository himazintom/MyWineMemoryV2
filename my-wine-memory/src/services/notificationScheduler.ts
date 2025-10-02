/**
 * Notification Scheduler Service
 * Handles scheduling and triggering of different notification types
 */

import { notificationService } from './notificationService';
import type { NotificationType } from './notificationService';
import { userService } from './userService';
import { tastingRecordService } from './tastingRecordService';
import { pwaService } from './pwaService';
import { wineMasterService } from './wineMasterService';

export interface NotificationTrigger {
  id: string;
  userId: string;
  type: NotificationType;
  scheduledFor: Date;
  title: string;
  body: string;
  data?: Record<string, string>;
  sent: boolean;
  createdAt: Date;
}

class NotificationScheduler {
  private scheduledNotifications = new Map<string, NodeJS.Timeout>();

  // Schedule a streak reminder notification
  async scheduleStreakReminder(userId: string, targetTime: Date): Promise<void> {
    const notificationId = `streak_${userId}_${targetTime.getTime()}`;
    
    // Cancel existing reminder if any
    this.cancelNotification(notificationId);

    const delay = targetTime.getTime() - Date.now();
    if (delay <= 0) return; // Don't schedule past notifications

    // If PWA is installed, use service worker scheduling
    if (pwaService.isAppInstalled()) {
      try {
        await pwaService.scheduleLocalNotification({
          id: notificationId,
          title: 'ワインの記録をお忘れなく！',
          body: '今日のワイン体験を記録しましょう',
          scheduledTime: targetTime,
          type: 'streak_reminder',
          url: '/select-wine'
        });
        console.log(`PWA streak reminder scheduled for ${targetTime.toLocaleString()}`);
        return;
      } catch (error) {
        console.error('Failed to schedule PWA notification:', error);
        // Fall back to browser notification
      }
    }

    // Browser-based scheduling (fallback)
    const timeout = setTimeout(async () => {
      try {
        await this.sendStreakReminder(userId);
        this.scheduledNotifications.delete(notificationId);
      } catch (error) {
        console.error('Failed to send streak reminder:', error);
      }
    }, delay);

    this.scheduledNotifications.set(notificationId, timeout);
    console.log(`Browser streak reminder scheduled for ${targetTime.toLocaleString()}`);
  }

  // Schedule a wine memory recall notification
  async scheduleWineMemoryRecall(userId: string, targetTime: Date): Promise<void> {
    const notificationId = `memory_${userId}_${targetTime.getTime()}`;
    
    this.cancelNotification(notificationId);

    const delay = targetTime.getTime() - Date.now();
    if (delay <= 0) return;

    const timeout = setTimeout(async () => {
      try {
        await this.sendWineMemoryRecall(userId);
        this.scheduledNotifications.delete(notificationId);
      } catch (error) {
        console.error('Failed to send wine memory recall:', error);
      }
    }, delay);

    this.scheduledNotifications.set(notificationId, timeout);
    console.log(`Wine memory recall scheduled for ${targetTime.toLocaleString()}`);
  }

  // Schedule quiz reminder notification
  async scheduleQuizReminder(userId: string, targetTime: Date): Promise<void> {
    const notificationId = `quiz_${userId}_${targetTime.getTime()}`;
    
    this.cancelNotification(notificationId);

    const delay = targetTime.getTime() - Date.now();
    if (delay <= 0) return;

    const timeout = setTimeout(async () => {
      try {
        await this.sendQuizReminder(userId);
        this.scheduledNotifications.delete(notificationId);
      } catch (error) {
        console.error('Failed to send quiz reminder:', error);
      }
    }, delay);

    this.scheduledNotifications.set(notificationId, timeout);
    console.log(`Quiz reminder scheduled for ${targetTime.toLocaleString()}`);
  }

  // Schedule badge earned notification (immediate)
  async scheduleBadgeNotification(
    userId: string, 
    badgeName: string, 
    badgeIcon: string
  ): Promise<void> {
    setTimeout(async () => {
      try {
        await this.sendBadgeEarnedNotification(userId, badgeName, badgeIcon);
      } catch (error) {
        console.error('Failed to send badge notification:', error);
      }
    }, 1000); // Small delay to ensure UI updates
  }

  // Schedule heart recovery notification
  async scheduleHeartRecovery(userId: string, recoveryTime: Date): Promise<void> {
    const notificationId = `heart_${userId}_${recoveryTime.getTime()}`;
    
    this.cancelNotification(notificationId);

    const delay = recoveryTime.getTime() - Date.now();
    if (delay <= 0) return;

    const timeout = setTimeout(async () => {
      try {
        await this.sendHeartRecoveryNotification(userId);
        this.scheduledNotifications.delete(notificationId);
      } catch (error) {
        console.error('Failed to send heart recovery notification:', error);
      }
    }, delay);

    this.scheduledNotifications.set(notificationId, timeout);
  }

  // Send streak reminder notification
  private async sendStreakReminder(userId: string): Promise<void> {
    const settings = await notificationService.getUserNotificationSettings(userId);
    
    if (!settings.enabled || !settings.types.streak_reminder) {
      return;
    }

    // Check if in quiet hours
    if (this.isInQuietHours(settings.quietHours)) {
      return;
    }

    // Get user stats to personalize message
    const stats = await userService.getUserStats(userId);
    const currentStreak = stats?.currentStreak || 0;

    let title = 'ワインの記録をお忘れなく！';
    let body = '今日のワイン体験を記録しませんか？';

    if (currentStreak > 0) {
      title = `${currentStreak}日連続記録中！`;
      body = `ストリークを維持するために、今日のワインを記録しましょう！`;
    } else {
      body = '新しいワインとの出会いを記録して、ストリークを始めましょう！';
    }

    await this.showNotification({
      title,
      body,
      type: 'streak_reminder',
      url: '/select-wine',
      icon: '🍷'
    });
  }

  // Send quiz reminder notification  
  private async sendQuizReminder(userId: string): Promise<void> {
    const settings = await notificationService.getUserNotificationSettings(userId);
    
    if (!settings.enabled || !settings.types.quiz_reminder) {
      return;
    }

    if (this.isInQuietHours(settings.quietHours)) {
      return;
    }

    // Get user's stats to personalize message
    // const stats = await userService.getUserStats(userId);
    // TODO: Add quizStreak to UserStats type when quiz tracking is implemented
    const quizStreak = 0; // Placeholder until quiz streak is tracked
    
    const messages = [
      { title: 'クイズでワイン知識を向上！', body: '今日のクイズにチャレンジして、ワイン知識を深めませんか？' },
      { title: 'ワインクイズの時間です！', body: '5分間のクイズで新しい知識を身につけましょう' },
      { title: 'クイズチャレンジ！', body: 'ソムリエレベルの問題に挑戦してみませんか？' },
      { title: '知識をテストしよう！', body: 'ワインの世界をもっと探索しましょう' }
    ];
    
    if (quizStreak > 0) {
      messages.push({
        title: `${quizStreak}日連続クイズ達成中！`,
        body: '今日もクイズを続けて、連続記録を伸ばしましょう！'
      });
    }
    
    const message = messages[Math.floor(Math.random() * messages.length)];

    await this.showNotification({
      title: message.title,
      body: message.body,
      type: 'quiz_reminder', 
      url: '/quiz',
      icon: '🧠'
    });
  }

  // Send badge earned notification
  private async sendBadgeEarnedNotification(
    userId: string,
    badgeName: string,
    badgeIcon: string
  ): Promise<void> {
    const settings = await notificationService.getUserNotificationSettings(userId);
    
    if (!settings.enabled || !settings.types.badge_earned) {
      return;
    }

    await this.showNotification({
      title: '新しいバッジを獲得！',
      body: `「${badgeName}」バッジを獲得しました！おめでとうございます！`,
      type: 'badge_earned',
      url: '/profile',
      icon: badgeIcon
    });
  }

  // Send heart recovery notification
  private async sendHeartRecoveryNotification(userId: string): Promise<void> {
    const settings = await notificationService.getUserNotificationSettings(userId);
    
    if (!settings.enabled || !settings.types.heart_recovery) {
      return;
    }

    await this.showNotification({
      title: 'ハートが回復しました！',
      body: 'クイズに再挑戦できます。知識をテストしてみませんか？',
      type: 'heart_recovery',
      url: '/quiz',
      icon: '❤️'
    });
  }

  // Send wine memory recall notification
  private async sendWineMemoryRecall(userId: string): Promise<void> {
    const settings = await notificationService.getUserNotificationSettings(userId);
    
    if (!settings.enabled || !settings.types.streak_reminder) {
      return;
    }

    if (this.isInQuietHours(settings.quietHours)) {
      return;
    }

    try {
      // Get a random past wine record
      const records = await tastingRecordService.getUserTastingRecords(userId, 'date', 100);
      
      if (records.length === 0) {
        // No records yet, encourage first recording
        await this.showNotification({
          title: '初めてのワイン記録を作成しましょう！',
          body: '素晴らしいワインとの出会いを記録してみませんか？',
          type: 'streak_reminder',
          url: '/select-wine',
          icon: '🍷'
        });
        return;
      }

      // Pick a random record from the past
      const randomRecord = records[Math.floor(Math.random() * records.length)];
      // Get wine info from wines_master collection
      const wineInfo = await wineMasterService.getWineMaster(randomRecord.wineId, userId);
      
      if (!wineInfo) return;

      const tastingDate = randomRecord.tastingDate instanceof Date 
        ? randomRecord.tastingDate 
        : new Date(randomRecord.tastingDate);
      const daysSince = this.getDaysDifference(tastingDate, new Date());
      const formattedDate = tastingDate.toLocaleDateString('ja-JP');
      
      const messages = [
        {
          title: `${wineInfo.wineName}を覚えていますか？`,
          body: `${formattedDate}に飲んだこのワイン、評価は${randomRecord.overallRating}/10でした。最近同じようなワインを飲みましたか？`
        },
        {
          title: `${daysSince}日前のワイン体験`,
          body: `${wineInfo.wineName}（${wineInfo.producer}）を飲みましたね。今日は何を飲みますか？`
        },
        {
          title: '過去のお気に入りワイン',
          body: `${wineInfo.wineName}は${randomRecord.overallRating >= 7 ? '高評価' : '印象的'}でした。新しいワインも記録してみませんか？`
        }
      ];

      // Add special message for highly rated wines
      if (randomRecord.overallRating >= 8) {
        messages.push({
          title: `素晴らしいワインでした！`,
          body: `${wineInfo.wineName}（評価${randomRecord.overallRating}/10）のような素敵なワインにまた出会えるといいですね`
        });
      }

      // Add message with notes if available
      if (randomRecord.notes) {
        const shortNote = randomRecord.notes.length > 50 
          ? randomRecord.notes.substring(0, 50) + '...'
          : randomRecord.notes;
        messages.push({
          title: `${wineInfo.wineName}のメモ`,
          body: `「${shortNote}」と記録していました。懐かしいですね！`
        });
      }

      const message = messages[Math.floor(Math.random() * messages.length)];

      await this.showNotification({
        title: message.title,
        body: message.body,
        type: 'streak_reminder',
        url: `/wine-detail/${randomRecord.wineId}`,
        icon: '🍷'
      });
    } catch (error) {
      console.error('Error sending wine memory recall:', error);
    }
  }

  // Show browser notification
  private async showNotification(options: {
    title: string;
    body: string;
    type: NotificationType;
    url?: string;
    icon?: string;
  }): Promise<void> {
    if (Notification.permission !== 'granted') {
      return;
    }

    const notification = new Notification(options.title, {
      body: options.body,
      icon: '/android/mipmap-mdpi/ic_launcher.png',
      badge: '/android/mipmap-mdpi/ic_launcher.png',
      tag: options.type,
      data: {
        type: options.type,
        url: options.url || '/'
      },
      requireInteraction: false,
      silent: false
    });

    // Handle click
    notification.onclick = () => {
      window.focus();
      if (options.url) {
        window.location.href = options.url;
      }
      notification.close();
    };

    // Auto-close after 8 seconds
    setTimeout(() => {
      notification.close();
    }, 8000);
  }

  // Check if current time is in quiet hours
  private isInQuietHours(quietHours: { enabled: boolean; start: string; end: string }): boolean {
    if (!quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = quietHours.start.split(':').map(Number);
    const [endHour, endMin] = quietHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    // Handle overnight quiet hours (e.g., 22:00 - 08:00)
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      return currentTime >= startTime && currentTime <= endTime;
    }
  }

  // Cancel a scheduled notification
  cancelNotification(notificationId: string): void {
    const timeout = this.scheduledNotifications.get(notificationId);
    if (timeout) {
      clearTimeout(timeout);
      this.scheduledNotifications.delete(notificationId);
      console.log(`Cancelled notification: ${notificationId}`);
    }
  }

  // Cancel all notifications for a user
  cancelAllUserNotifications(userId: string): void {
    for (const [id, timeout] of this.scheduledNotifications) {
      if (id.includes(userId)) {
        clearTimeout(timeout);
        this.scheduledNotifications.delete(id);
      }
    }
  }

  // Setup daily notification schedules for a user
  async setupDailySchedules(userId: string): Promise<void> {
    const settings = await notificationService.getUserNotificationSettings(userId);
    
    if (!settings.enabled) return;

    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Schedule streak reminder for evening (7 PM)
    if (settings.types.streak_reminder) {
      const streakTime = new Date(tomorrow);
      streakTime.setHours(19, 0, 0, 0);
      await this.scheduleStreakReminder(userId, streakTime);
    }

    // Schedule quiz reminders at random times (2-3 times per day)
    if (settings.types.quiz_reminder) {
      // Morning quiz (9-11 AM)
      const morningQuizTime = new Date(tomorrow);
      morningQuizTime.setHours(9 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60), 0, 0);
      await this.scheduleQuizReminder(userId, morningQuizTime);
      
      // Afternoon quiz (2-4 PM)
      const afternoonQuizTime = new Date(tomorrow);
      afternoonQuizTime.setHours(14 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60), 0, 0);
      await this.scheduleQuizReminder(userId, afternoonQuizTime);
      
      // Sometimes add evening quiz (6-8 PM) - 50% chance
      if (Math.random() > 0.5) {
        const eveningQuizTime = new Date(tomorrow);
        eveningQuizTime.setHours(18 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60), 0, 0);
        await this.scheduleQuizReminder(userId, eveningQuizTime);
      }
    }

    // Schedule wine memory recall at random time (once per day)
    if (settings.types.streak_reminder) {
      const memoryTime = new Date(tomorrow);
      // Random time between 10 AM and 8 PM
      memoryTime.setHours(10 + Math.floor(Math.random() * 11), Math.floor(Math.random() * 60), 0, 0);
      await this.scheduleWineMemoryRecall(userId, memoryTime);
    }
  }

  // Initialize notification schedules when user logs in
  async initializeUserNotifications(userId: string): Promise<void> {
    try {
      // Cancel any existing schedules
      this.cancelAllUserNotifications(userId);
      
      // Setup new daily schedules
      await this.setupDailySchedules(userId);
      
      // Check for missed activities
      await this.checkMissedActivities(userId);
      
      console.log(`Notifications initialized for user ${userId}`);
    } catch (error) {
      console.error('Error initializing user notifications:', error);
    }
  }

  // Check for missed activities and send catch-up notifications
  async checkMissedActivities(userId: string): Promise<void> {
    try {
      const stats = await userService.getUserStats(userId);
      if (!stats) return;

      const lastRecordDate = await this.getLastRecordDate(userId);
      const daysSinceLastRecord = this.getDaysDifference(lastRecordDate, new Date());

      // If user hasn't recorded wine in 3+ days, send gentle reminder
      if (daysSinceLastRecord >= 3) {
        await this.showNotification({
          title: 'ワインの記録をしばらくお忘れですね',
          body: `${daysSinceLastRecord}日間記録がありません。新しいワイン体験を記録しませんか？`,
          type: 'streak_reminder',
          url: '/select-wine',
          icon: '🍷'
        });
      }
    } catch (error) {
      console.error('Error checking missed activities:', error);
    }
  }

  // Get date of user's last wine record
  private async getLastRecordDate(userId: string): Promise<Date> {
    try {
      const records = await tastingRecordService.getUserTastingRecords(userId, 'date', 1);
      if (records.length > 0) {
        const tastingDate = records[0].tastingDate;
        return tastingDate instanceof Date 
          ? tastingDate 
          : new Date(tastingDate);
      }
      return new Date(0); // Far past date if no records
    } catch (error) {
      console.error('Error getting last record date:', error);
      return new Date(0);
    }
  }

  // Calculate difference in days between two dates
  private getDaysDifference(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

export const notificationScheduler = new NotificationScheduler();