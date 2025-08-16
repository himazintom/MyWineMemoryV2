/**
 * Notification Scheduler Service
 * Handles scheduling and triggering of different notification types
 */

import { notificationService } from './notificationService';
import type { NotificationType } from './notificationService';
import { userService } from './userService';
import { tastingRecordService } from './tastingRecordService';

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

    const timeout = setTimeout(async () => {
      try {
        await this.sendStreakReminder(userId);
        this.scheduledNotifications.delete(notificationId);
      } catch (error) {
        console.error('Failed to send streak reminder:', error);
      }
    }, delay);

    this.scheduledNotifications.set(notificationId, timeout);
    console.log(`Streak reminder scheduled for ${targetTime.toLocaleString()}`);
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

    await this.showNotification({
      title: 'クイズでワイン知識を向上！',
      body: '今日のクイズにチャレンジして、ワイン知識を深めませんか？',
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

    // Schedule quiz reminder for afternoon (3 PM)
    if (settings.types.quiz_reminder) {
      const quizTime = new Date(tomorrow);
      quizTime.setHours(15, 0, 0, 0);
      await this.scheduleQuizReminder(userId, quizTime);
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
        return records[0].tastingDate instanceof Date 
          ? records[0].tastingDate 
          : new Date(records[0].tastingDate);
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