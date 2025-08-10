import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthHooks';
import { badgeService } from '../services/badgeService';
import { userService } from '../services/userService';
import type { Badge, UserStats } from '../types';

const Profile: React.FC = () => {
  const { currentUser, userProfile, signInWithGoogle, logout } = useAuth();
  const [badges, setBadges] = useState<(Badge & { earnedAt: Date })[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);

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
          <div className="setting-item">
            <label>
              <input type="checkbox" />
              通知を有効にする
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" />
              記録を公開する
            </label>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;