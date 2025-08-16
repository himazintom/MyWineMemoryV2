import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthHooks';
import { 
  notificationService
} from '../services/notificationService';
import type { 
  NotificationSettings as NotificationSettingsType,
  NotificationType 
} from '../services/notificationService';
import { notificationScheduler } from '../services/notificationScheduler';
import LoadingSpinner from './LoadingSpinner';

interface NotificationSettingsProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ 
  isExpanded = false, 
  onToggle 
}) => {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState<NotificationSettingsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [enabling, setEnabling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  // Notification type descriptions
  const notificationTypes: { 
    type: NotificationType; 
    name: string; 
    description: string; 
    icon: string;
  }[] = [
    {
      type: 'streak_reminder',
      name: 'ストリークリマインダー',
      description: '連続記録を維持するための通知',
      icon: '🔥'
    },
    {
      type: 'quiz_reminder', 
      name: 'クイズリマインダー',
      description: 'ワイン知識向上のためのクイズ通知',
      icon: '🧠'
    },
    {
      type: 'badge_earned',
      name: 'バッジ獲得',
      description: '新しいバッジを獲得した時の通知',
      icon: '🏆'
    },
    {
      type: 'heart_recovery',
      name: 'ハート回復',
      description: 'クイズのハートが回復した時の通知',
      icon: '❤️'
    },
    {
      type: 'weekly_summary',
      name: '週間サマリー',
      description: '週間の活動まとめ通知',
      icon: '📊'
    },
    {
      type: 'friend_activity',
      name: 'フレンド活動',
      description: '友達の新しい記録通知（近日対応予定）',
      icon: '👥'
    }
  ];

  useEffect(() => {
    loadSettings();
    setPermissionStatus(notificationService.getPermissionStatus());
  }, [currentUser]);

  const loadSettings = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const userSettings = await notificationService.getUserNotificationSettings(currentUser.uid);
      setSettings(userSettings);
    } catch (error) {
      console.error('Failed to load notification settings:', error);
      setError('設定の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleEnableNotifications = async () => {
    if (!currentUser) return;

    try {
      setEnabling(true);
      setError(null);

      const success = await notificationService.enableNotifications(currentUser.uid);
      
      if (success) {
        setPermissionStatus('granted');
        await loadSettings();
        
        // Setup daily schedules
        await notificationScheduler.setupDailySchedules(currentUser.uid);
        
        // Test notification
        await notificationService.testNotification();
      } else {
        setError('通知の許可が拒否されました。ブラウザの設定から許可してください。');
      }
    } catch (error) {
      console.error('Failed to enable notifications:', error);
      setError(error instanceof Error ? error.message : '通知の有効化に失敗しました');
    } finally {
      setEnabling(false);
    }
  };

  const handleDisableNotifications = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      await notificationService.disableNotifications(currentUser.uid);
      
      // Cancel all scheduled notifications
      notificationScheduler.cancelAllUserNotifications(currentUser.uid);
      
      await loadSettings();
    } catch (error) {
      console.error('Failed to disable notifications:', error);
      setError('通知の無効化に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleTypeToggle = async (type: NotificationType, enabled: boolean) => {
    if (!currentUser || !settings) return;

    try {
      const updatedSettings = {
        ...settings,
        types: {
          ...settings.types,
          [type]: enabled
        }
      };

      await notificationService.updateNotificationSettings(currentUser.uid, updatedSettings);
      setSettings(updatedSettings);

      // Reschedule notifications if needed
      if (enabled && settings.enabled) {
        await notificationScheduler.setupDailySchedules(currentUser.uid);
      }
    } catch (error) {
      console.error('Failed to update notification type:', error);
      setError('設定の更新に失敗しました');
    }
  };

  const handleQuietHoursChange = async (field: 'enabled' | 'start' | 'end', value: boolean | string) => {
    if (!currentUser || !settings) return;

    try {
      const updatedSettings = {
        ...settings,
        quietHours: {
          ...settings.quietHours,
          [field]: value
        }
      };

      await notificationService.updateNotificationSettings(currentUser.uid, updatedSettings);
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Failed to update quiet hours:', error);
      setError('設定の更新に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="notification-settings">
        <LoadingSpinner message="設定を読み込み中..." />
      </div>
    );
  }

  const isSupported = notificationService.isSupported();
  const hasPermission = permissionStatus === 'granted';
  const isEnabled = settings?.enabled || false;

  return (
    <div className="notification-settings">
      <div className="setting-header" onClick={onToggle} style={{ cursor: 'pointer' }}>
        <div className="setting-label">
          <span>プッシュ通知 {isSupported ? '🔔' : '❌'}</span>
          <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
        </div>
        <div className="setting-status">
          {!isSupported && <span className="status-badge error">未対応</span>}
          {isSupported && !hasPermission && <span className="status-badge warning">許可待ち</span>}
          {isSupported && hasPermission && !isEnabled && <span className="status-badge disabled">無効</span>}
          {isSupported && hasPermission && isEnabled && <span className="status-badge enabled">有効</span>}
        </div>
      </div>

      {isExpanded && (
        <div className="notification-settings-content">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
              <button 
                className="error-dismiss" 
                onClick={() => setError(null)}
                aria-label="エラーを閉じる"
              >
                ×
              </button>
            </div>
          )}

          {!isSupported && (
            <div className="unsupported-message">
              <span className="warning-icon">⚠️</span>
              <p>お使いのブラウザではプッシュ通知がサポートされていません。</p>
              <p><small>Chrome、Firefox、Edge の最新版をお試しください。</small></p>
            </div>
          )}

          {isSupported && (
            <>
              {!hasPermission ? (
                <div className="permission-section">
                  <h4>通知を有効にする</h4>
                  <p>ワインの記録やクイズのリマインダーを受け取るために、通知を許可してください。</p>
                  <button 
                    className="btn-primary"
                    onClick={handleEnableNotifications}
                    disabled={enabling}
                  >
                    {enabling ? '有効化中...' : '通知を許可する'}
                  </button>
                </div>
              ) : (
                <>
                  {/* Main Toggle */}
                  <div className="setting-item">
                    <label className="setting-label">
                      <span>通知を受け取る</span>
                      <div className="toggle-wrapper">
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={(e) => e.target.checked ? handleEnableNotifications() : handleDisableNotifications()}
                          className="setting-toggle"
                        />
                        <span className="toggle-slider"></span>
                      </div>
                    </label>
                  </div>

                  {isEnabled && settings && (
                    <>
                      {/* Notification Types */}
                      <div className="notification-types">
                        <h4>通知の種類</h4>
                        {notificationTypes.map(({ type, name, description, icon }) => (
                          <div key={type} className="notification-type-item">
                            <div className="type-info">
                              <span className="type-icon">{icon}</span>
                              <div className="type-details">
                                <span className="type-name">{name}</span>
                                <span className="type-description">{description}</span>
                              </div>
                            </div>
                            <div className="toggle-wrapper">
                              <input
                                type="checkbox"
                                checked={settings.types[type]}
                                onChange={(e) => handleTypeToggle(type, e.target.checked)}
                                className="setting-toggle"
                                disabled={type === 'friend_activity'} // Future feature
                              />
                              <span className="toggle-slider"></span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Quiet Hours */}
                      <div className="quiet-hours-section">
                        <h4>おやすみ時間</h4>
                        <div className="setting-item">
                          <label className="setting-label">
                            <span>おやすみ時間を設定</span>
                            <div className="toggle-wrapper">
                              <input
                                type="checkbox"
                                checked={settings.quietHours.enabled}
                                onChange={(e) => handleQuietHoursChange('enabled', e.target.checked)}
                                className="setting-toggle"
                              />
                              <span className="toggle-slider"></span>
                            </div>
                          </label>
                        </div>

                        {settings.quietHours.enabled && (
                          <div className="quiet-hours-time">
                            <div className="time-input-group">
                              <label>
                                <span>開始時刻</span>
                                <input
                                  type="time"
                                  value={settings.quietHours.start}
                                  onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                                  className="time-input"
                                />
                              </label>
                              <span className="time-separator">〜</span>
                              <label>
                                <span>終了時刻</span>
                                <input
                                  type="time"
                                  value={settings.quietHours.end}
                                  onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                                  className="time-input"
                                />
                              </label>
                            </div>
                            <p className="quiet-hours-note">
                              この時間帯は通知が送信されません
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Test Notification */}
                      <div className="test-section">
                        <button 
                          className="btn-secondary"
                          onClick={() => notificationService.testNotification()}
                        >
                          テスト通知を送信
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;