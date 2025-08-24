import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthHooks';
import { notificationService } from '../services/notificationService';
import { notificationScheduler } from '../services/notificationScheduler';
import { pwaService } from '../services/pwaService';
import './NotificationPrompt.css';

interface NotificationPromptProps {
  onClose?: () => void;
}

const NotificationPrompt: React.FC<NotificationPromptProps> = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [show, setShow] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);
  const [dismissCount, setDismissCount] = useState(0);

  useEffect(() => {
    checkNotificationStatus();
  }, [currentUser]);

  const checkNotificationStatus = async () => {
    if (!currentUser) return;

    // Check localStorage for dismiss count
    const stored = localStorage.getItem('notification-prompt-dismiss');
    const count = stored ? parseInt(stored, 10) : 0;
    setDismissCount(count);

    // Don't show if dismissed 3+ times
    if (count >= 3) return;

    // Check if notifications are supported
    if (!notificationService.isSupported()) return;

    // Check permission status
    const permission = notificationService.getPermissionStatus();
    
    // Check if notifications are enabled in settings
    const settings = await notificationService.getUserNotificationSettings(currentUser.uid);

    // Show prompt if:
    // 1. Permission is default (never asked)
    // 2. OR permission granted but notifications disabled in settings
    if (permission === 'default' || (permission === 'granted' && !settings.enabled)) {
      // Delay showing to avoid being too aggressive
      setTimeout(() => setShow(true), 3000);
    }

    // Check if PWA can be installed
    if (pwaService.canInstall() && permission === 'granted' && settings.enabled) {
      setShowPWAPrompt(true);
    }
  };

  const handleEnable = async () => {
    if (!currentUser) return;

    try {
      setIsEnabling(true);
      
      // Request permission and enable notifications
      const success = await notificationService.enableNotifications(currentUser.uid);
      
      if (success) {
        // Setup daily schedules
        await notificationScheduler.initializeUserNotifications(currentUser.uid);
        
        // Test notification
        await notificationService.testNotification();
        
        setShow(false);
        
        // Check if PWA can be installed
        if (pwaService.canInstall()) {
          setShowPWAPrompt(true);
        }
      } else {
        // Permission denied
        handleDismiss();
      }
    } catch (error) {
      console.error('Failed to enable notifications:', error);
    } finally {
      setIsEnabling(false);
    }
  };

  const handleDismiss = () => {
    const newCount = dismissCount + 1;
    setDismissCount(newCount);
    localStorage.setItem('notification-prompt-dismiss', newCount.toString());
    setShow(false);
    
    if (onClose) onClose();

    // If dismissed once, try again in 7 days
    if (newCount === 1) {
      localStorage.setItem('notification-prompt-next', Date.now() + 7 * 24 * 60 * 60 * 1000 + '');
    }
  };

  const handlePWAInstall = async () => {
    const installed = await pwaService.promptInstall();
    if (installed) {
      setShowPWAPrompt(false);
      
      // Enable periodic sync for installed PWA
      await pwaService.enablePeriodicSync();
    }
  };

  if (!show && !showPWAPrompt) return null;

  return (
    <>
      {show && (
        <div className="notification-prompt">
          <div className="notification-prompt-content">
            <div className="notification-prompt-icon">
              🔔
            </div>
            <div className="notification-prompt-text">
              <h3>通知を有効にしてワイン体験を充実させましょう！</h3>
              <p className="important-notice">
                💡 <strong>重要：確実に通知を受け取るには、アプリのインストールが必要です</strong>
              </p>
              <div className="notification-comparison">
                <div className="comparison-item browser">
                  <h4>🌐 ブラウザのみ</h4>
                  <ul>
                    <li>⚠️ ブラウザを開いている時のみ通知</li>
                    <li>❌ アプリを閉じると通知が届かない</li>
                  </ul>
                </div>
                <div className="comparison-item pwa">
                  <h4>📱 アプリをインストール（推奨）</h4>
                  <ul>
                    <li>✅ アプリを閉じても通知が届く</li>
                    <li>✅ 毎日決まった時間に自動通知</li>
                    <li>✅ オフラインでも動作</li>
                  </ul>
                </div>
              </div>
              <p className="install-guide">
                まず通知を許可し、その後アプリをインストールすることをお勧めします
              </p>
            </div>
            <div className="notification-prompt-actions">
              <button 
                className="btn-primary"
                onClick={handleEnable}
                disabled={isEnabling}
              >
                {isEnabling ? '設定中...' : '通知を有効にする'}
              </button>
              <button 
                className="btn-secondary"
                onClick={handleDismiss}
              >
                後で
              </button>
            </div>
            {dismissCount === 2 && (
              <p className="notification-prompt-warning">
                次回は表示されません。プロフィール画面から設定できます。
              </p>
            )}
          </div>
        </div>
      )}

      {showPWAPrompt && !pwaService.isIOS() && (
        <div className="pwa-install-prompt">
          <div className="pwa-install-content">
            <div className="pwa-install-icon">
              📱
            </div>
            <div className="pwa-install-text">
              <h4>通知を確実に受け取るために</h4>
              <p>
                <strong>アプリをインストールすると、ブラウザを閉じても通知が届きます。</strong>
                Duolingoのように、毎日決まった時間にリマインダーを送信できます。
              </p>
            </div>
            <div className="pwa-install-actions">
              <button 
                className="btn-primary btn-small"
                onClick={handlePWAInstall}
              >
                インストール
              </button>
              <button 
                className="btn-text btn-small"
                onClick={() => setShowPWAPrompt(false)}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {showPWAPrompt && pwaService.isIOS() && (
        <div className="ios-install-prompt">
          <div className="ios-install-content">
            <div className="ios-install-icon">
              📱
            </div>
            <div className="ios-install-text">
              <h4>iOSでインストール</h4>
              <p>{pwaService.getIOSInstallInstructions()}</p>
            </div>
            <button 
              className="btn-text"
              onClick={() => setShowPWAPrompt(false)}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationPrompt;