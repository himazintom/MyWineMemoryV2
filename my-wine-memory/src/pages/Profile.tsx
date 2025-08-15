import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthHooks';
import { badgeService } from '../services/badgeService';
import { userService } from '../services/userService';
import ThemeToggle from '../components/ThemeToggle';
import NotificationSettings from '../components/NotificationSettings';
import type { Badge, UserStats } from '../types';

const Profile: React.FC = () => {
  const { currentUser, userProfile, signInWithGoogle, logout } = useAuth();
  const [badges, setBadges] = useState<(Badge & { earnedAt: Date })[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [localPrivacySettings, setLocalPrivacySettings] = useState(userProfile?.privacySettings);
  const [showShareUrl, setShowShareUrl] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [notificationExpanded, setNotificationExpanded] = useState(false);

  const loadUserData = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const [userBadges, userStats] = await Promise.all([
        badgeService.getUserBadges(currentUser.uid),
        userService.getUserStats(currentUser.uid)
      ]);
      
      setBadges(userBadges);
      setStats(userStats);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadUserData();
    }
  }, [currentUser, loadUserData]);

  useEffect(() => {
    setLocalPrivacySettings(userProfile?.privacySettings);
    setShowShareUrl(userProfile?.privacySettings?.allowPublicProfile || false);
  }, [userProfile?.privacySettings]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getCategoryBadges = (category: Badge['category']) => {
    return badges.filter(badge => badge.category === category);
  };

  const handlePrivacySettingChange = async (setting: string, value: boolean | string) => {
    if (!currentUser) return;
    
    try {
      const currentSettings = localPrivacySettings || {
        defaultRecordVisibility: 'private' as const,
        allowPublicProfile: false,
        pushNotifications: false
      };
      
      const updatedSettings = {
        ...currentSettings,
        [setting]: value
      };
      
      // Update local state immediately for responsive UI
      setLocalPrivacySettings(updatedSettings);
      
      // Handle public profile visibility change
      if (setting === 'allowPublicProfile') {
        setShowShareUrl(value as boolean);
      }
      
      // Update database
      await userService.updateUserPrivacySettings(currentUser.uid, updatedSettings);
      
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      // Revert local state on error
      setLocalPrivacySettings(userProfile?.privacySettings);
      setShowShareUrl(userProfile?.privacySettings?.allowPublicProfile || false);
      alert('プライバシー設定の更新に失敗しました。');
    }
  };

  const generateShareUrl = () => {
    if (!currentUser) return '';
    return `${window.location.origin}/profile/${currentUser.uid}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareUrl());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = generateShareUrl();
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>プロフィール</h1>
      </header>
      
      <main className="profile-content">
        <div className="profile-info">
          <div className="avatar">
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="Profile" className="avatar-image" />
            ) : (
              <span className="avatar-placeholder">👤</span>
            )}
          </div>
          <h2>{currentUser?.displayName || 'ゲストユーザー'}</h2>
          <p>レベル 1 (0 XP)</p>
        </div>
        
        {!currentUser ? (
          <div className="login-section">
            <p>ログインして記録を保存しましょう</p>
            <button className="google-login-button" onClick={handleGoogleSignIn}>
              🔍 Googleでログイン
            </button>
          </div>
        ) : (
          <div className="logout-section">
            <button className="logout-button" onClick={handleLogout}>
              ログアウト
            </button>
          </div>
        )}
        
        <div className="badges-section">
          <h3>獲得バッジ ({badges.length}個)</h3>
          {loading ? (
            <p>読み込み中...</p>
          ) : badges.length > 0 ? (
            <div className="badge-categories">
              {['recording', 'streak', 'quiz', 'exploration'].map(category => {
                const categoryBadges = getCategoryBadges(category as Badge['category']);
                if (categoryBadges.length === 0) return null;
                
                const categoryNames = {
                  recording: '記録バッジ',
                  streak: '連続記録バッジ',
                  quiz: 'クイズバッジ',
                  exploration: '探求バッジ'
                };

                return (
                  <div key={category} className="badge-category">
                    <h4>{categoryNames[category as keyof typeof categoryNames]}</h4>
                    <div className="badges-grid">
                      {categoryBadges.map((badge) => (
                        <div key={badge.id} className="badge-item">
                          <span className="badge-icon">{badge.icon}</span>
                          <div className="badge-info">
                            <span className="badge-name">{badge.name}</span>
                            <span className="badge-description">{badge.description}</span>
                            <span className="badge-date">
                              {badge.earnedAt.toLocaleDateString('ja-JP')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>まだバッジがありません。ワインを記録してバッジを獲得しましょう！</p>
          )}
        </div>
        
        <div className="achievements">
          <h3>実績</h3>
          <div className="achievement-item">
            <span>🍷 記録数</span>
            <span>{stats?.totalRecords || 0}本</span>
          </div>
          <div className="achievement-item">
            <span>🔥 最長ストリーク</span>
            <span>{stats?.longestStreak || 0}日</span>
          </div>
          <div className="achievement-item">
            <span>🧠 クイズ正答数</span>
            <span>{stats?.totalQuizzes || 0}問</span>
          </div>
          <div className="achievement-item">
            <span>📊 平均評価</span>
            <span>{stats?.averageRating ? stats.averageRating.toFixed(1) : '-'}</span>
          </div>
          <div className="achievement-item">
            <span>⭐ 現在のレベル</span>
            <span>レベル {userProfile?.level || 1}</span>
          </div>
        </div>
        
        <div className="settings">
          <h3>設定</h3>
          
          <NotificationSettings 
            isExpanded={notificationExpanded}
            onToggle={() => setNotificationExpanded(!notificationExpanded)}
          />
          
          <div className="setting-item">
            <label className="setting-label">
              <span>ほかの人も記録を見れるようにする</span>
              <input 
                type="checkbox" 
                checked={localPrivacySettings?.defaultRecordVisibility === 'public'}
                onChange={(e) => handlePrivacySettingChange('defaultRecordVisibility', e.target.checked ? 'public' : 'private')}
                className="setting-checkbox"
              />
            </label>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">
              <span>プロフィールを公開する</span>
              <input 
                type="checkbox" 
                checked={localPrivacySettings?.allowPublicProfile ?? false}
                onChange={(e) => handlePrivacySettingChange('allowPublicProfile', e.target.checked)}
                className="setting-checkbox"
              />
            </label>
            {showShareUrl && (
              <div className="share-url-container">
                <div className="share-url-box">
                  <span className="share-url-text">{generateShareUrl()}</span>
                  <button 
                    className={`copy-button ${copySuccess ? 'copied' : ''}`}
                    onClick={copyToClipboard}
                    title="クリップボードにコピー"
                  >
                    {copySuccess ? '✅' : '📋'}
                  </button>
                </div>
                <p className="share-url-description">
                  この URL をシェアして、あなたのワイン記録を友達に見せましょう！
                </p>
              </div>
            )}
          </div>
          
          <div className="setting-item">
            <div className="setting-label">
              <span>テーマ</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;