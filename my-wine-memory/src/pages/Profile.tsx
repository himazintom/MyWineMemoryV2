import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthHooks';
import { badgeService } from '../services/badgeService';
import { userService } from '../services/userService';
import { gamificationService } from '../services/gamificationService';
import NotificationSettings from '../components/NotificationSettings';
import BadgeDisplay, { EarnedBadges, LevelDisplay, StreakDisplay } from '../components/BadgeDisplay';
import type { Badge, UserStats, DailyGoal } from '../types';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, signInWithGoogle, logout } = useAuth();
  const [badges, setBadges] = useState<(Badge & { earnedAt: Date })[]>([]);
  const [badgeProgress, setBadgeProgress] = useState<{
    category: Badge['category'];
    badges: (Badge & { earned: boolean; progress: number })[];
  }[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal | null>(null);
  const [loading, setLoading] = useState(false);
  const [localPrivacySettings, setLocalPrivacySettings] = useState(userProfile?.privacySettings);
  const [showShareUrl, setShowShareUrl] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [notificationExpanded, setNotificationExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'stats' | 'badges' | 'achievements'>('stats');

  const loadUserData = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const [userBadges, userStats, userBadgeProgress, userDailyGoal] = await Promise.all([
        badgeService.getUserBadges(currentUser.uid),
        gamificationService.getUserStats(currentUser.uid),
        userService.getBadgeProgress(currentUser.uid),
        gamificationService.getDailyGoal(currentUser.uid)
      ]);
      
      setBadges(userBadges);
      setStats(userStats);
      setBadgeProgress(userBadgeProgress);
      setDailyGoal(userDailyGoal);
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
          {currentUser && userProfile && (
            <div className="user-stats-summary">
              <LevelDisplay 
                level={userProfile.level} 
                xp={userProfile.xp} 
                xpForNextLevel={gamificationService.calculateXpForNextLevel(userProfile.level)}
              />
              <div className="stats-row">
                <StreakDisplay streak={userProfile.streak} />
                <div className="badges-count">
                  🏆 {badges.length} バッジ
                </div>
              </div>
            </div>
          )}
        </div>
        
        {!currentUser ? (
          <div className="login-section">
            <p>ログインして記録を保存しましょう</p>
            <button className="google-login-button" onClick={handleGoogleSignIn}>
              🔍 Googleでログイン
            </button>
          </div>
        ) : (
          <div className="action-buttons">
            <button
              className="btn btn-secondary"
              onClick={() => navigate(`/public-wines/${currentUser.uid}`)}
            >
              🌐 公開プロフィールを見る
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>
              ログアウト
            </button>
          </div>
        )}

        {/* Notification Settings */}
        {currentUser && (
          <div className="notification-settings-section">
            <NotificationSettings 
              isExpanded={notificationExpanded}
              onToggle={() => setNotificationExpanded(!notificationExpanded)}
            />
          </div>
        )}

        {/* Daily Goal Display */}
        {currentUser && dailyGoal && (
          <div className="daily-goal-section">
            <h3>今日の目標</h3>
            <div className="daily-goal-grid">
              <div className="goal-item">
                <div className="goal-icon">🍷</div>
                <div className="goal-progress">
                  <div className="goal-text">ワイン記録</div>
                  <div className="goal-numbers">
                    {dailyGoal.wineRecordingCompleted} / {dailyGoal.wineRecordingGoal}
                  </div>
                  <div className="goal-bar">
                    <div 
                      className="goal-fill" 
                      style={{ 
                        width: `${Math.min(100, (dailyGoal.wineRecordingCompleted / dailyGoal.wineRecordingGoal) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="goal-item">
                <div className="goal-icon">🧠</div>
                <div className="goal-progress">
                  <div className="goal-text">クイズ</div>
                  <div className="goal-numbers">
                    {dailyGoal.quizCompleted} / {dailyGoal.quizGoal}
                  </div>
                  <div className="goal-bar">
                    <div 
                      className="goal-fill" 
                      style={{ 
                        width: `${Math.min(100, (dailyGoal.quizCompleted / dailyGoal.quizGoal) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="profile-tabs">
          <button
            className={`btn btn-tab ${selectedTab === 'stats' ? 'active' : ''}`}
            onClick={() => setSelectedTab('stats')}
          >
            統計
          </button>
          <button
            className={`btn btn-tab ${selectedTab === 'badges' ? 'active' : ''}`}
            onClick={() => setSelectedTab('badges')}
          >
            獲得バッジ
          </button>
          <button
            className={`btn btn-tab ${selectedTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setSelectedTab('achievements')}
          >
            全バッジ
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {selectedTab === 'stats' && (
            <div className="achievements">
              <h3>実績</h3>
              <div className="achievement-item">
                <span>🍷 記録数</span>
                <span>{stats?.totalRecords || 0}本</span>
              </div>
              <div className="achievement-item">
                <span>🔥 現在のストリーク</span>
                <span>{stats?.currentStreak || 0}日</span>
              </div>
              <div className="achievement-item">
                <span>🏃 最長ストリーク</span>
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
              <div className="achievement-item">
                <span>💎 XP</span>
                <span>{userProfile?.xp || 0} XP</span>
              </div>
            </div>
          )}

          {selectedTab === 'badges' && (
            <div className="badges-section">
              <h3>獲得バッジ ({badges.length}個)</h3>
              {loading ? (
                <p>読み込み中...</p>
              ) : (
                <EarnedBadges badges={badges} />
              )}
            </div>
          )}

          {selectedTab === 'achievements' && (
            <div className="all-badges-section">
              <h3>全バッジ進捗</h3>
              {loading ? (
                <p>読み込み中...</p>
              ) : (
                <div className="badge-progress-container">
                  {badgeProgress.map((categoryData) => {
                    const categoryNames = {
                      recording: '記録バッジ',
                      streak: '連続記録バッジ',
                      quiz: 'クイズバッジ',
                      exploration: '探求バッジ'
                    };
                    
                    return (
                      <BadgeDisplay
                        key={categoryData.category}
                        badges={categoryData.badges}
                        category={categoryData.category}
                        title={categoryNames[categoryData.category as keyof typeof categoryNames]}
                        showProgress={true}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}
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
                    className={`btn btn-icon ${copySuccess ? 'copied' : ''}`}
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
        </div>
      </main>
    </div>
  );
};

export default Profile;