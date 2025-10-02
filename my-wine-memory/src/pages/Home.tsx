import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthHooks';
import { useTheme } from '../contexts/ThemeHooks';
import type { WineDraft } from '../types';
import WineCard from '../components/WineCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { StreakDisplay } from '../components/BadgeDisplay';
import NotificationPrompt from '../components/NotificationPrompt';
import { useAsyncOperation } from '../hooks/useAsyncOperation';
import { useHomeData } from '../hooks/useHomeData';
import heroDark from '../assets/images/hero/home-hero-desktop-dark.webp';
import heroLight from '../assets/images/hero/home-hero-desktop-light.webp';
import brandLogo from '../assets/images/logo-icon/logo-icon.svg';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, signInWithGoogle, loading: authInitializing } = useAuth();
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(max-width: 767px)').matches : false
  );
  const [authError, setAuthError] = useState<string>('');
  const { loading: authLoading, execute: executeAuth } = useAsyncOperation<void>();

  // Use custom hook for home data management (replaces 6 useState + useCallback + useEffect)
  const {
    recentWines,
    drafts,
    dailyGoal,
    weeklyProgress,
    learningStreak,
    loading,
    error,
    loadData: loadHomeData,
  } = useHomeData(currentUser?.uid, userProfile, authInitializing);

  // モバイル判定（リサイズ対応）
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(max-width: 767px)');
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const calculateProgress = (completed: number, goal: number) => {
    return Math.min(100, (completed / goal) * 100);
  };

  const handleDraftClick = (draft: WineDraft) => {
    // TODO: Navigate to select-wine with draft data pre-filled
    navigate('/select-wine', { state: { draftData: draft } });
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    try {
      await executeAuth(async () => {
        await signInWithGoogle();
      });
    } catch (error: unknown) {
      setAuthError(error instanceof Error ? error.message : 'ログインに失敗しました');
    }
  };

  // 可用ならモバイル用ヒーロー画像を使用（存在しない場合はデスクトップを流用）
  const heroModules = import.meta.glob('../assets/images/hero/*', { eager: true }) as Record<string, { default: string }>;
  const getUrl = (p: string) => (heroModules[p]?.default as string | undefined);
  const mobileDark = getUrl('../assets/images/hero/home-hero-mobile-dark.webp');
  const mobileLight = getUrl('../assets/images/hero/home-hero-mobile-light.webp');
  const heroImage = theme === 'dark'
    ? (isMobile && mobileDark ? mobileDark : heroDark)
    : (isMobile && mobileLight ? mobileLight : heroLight);
  const heroStyle = { '--hero-image-url': `url(${heroImage})` } as React.CSSProperties & { '--hero-image-url': string };

  return (
    <div className="page-container">
      <section className="home-hero" style={heroStyle}>
        <div className="hero-overlay">
          <div className="hero-inner">
            <div className="brand">
              <img src={brandLogo} alt="My Wine Memoy" className="brand-logo" />
              <h1 className="brand-title">MyWineMemory</h1>
            </div>
            <p>写真で残す、あなただけのワイン体験</p>
            <div className="hero-actions">
              <button className="action-button primary" onClick={() => navigate('/select-wine')}>
                🍷 ワインを記録する
              </button>
              <button className="action-button secondary" onClick={() => navigate('/quiz')}>
                🧠 クイズに挑戦する
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <main className="home-content">
        {!currentUser && (
          <div className="guest-notice">
            <p>💡 <strong>ゲストモード</strong>で体験中です</p>
            <p>記録やクイズ結果を保存するにはログインが必要です</p>
            <button 
              className="login-suggestion-button"
              onClick={handleGoogleSignIn}
              disabled={authLoading}
            >
              {authLoading ? (
                <LoadingSpinner size="small" message="ログイン中..." />
              ) : (
                <>
                  <span className="google-icon">🔍</span>
                  Googleでログイン
                </>
              )}
            </button>
            {authError && (
              <ErrorMessage
                title="ログインエラー"
                message={authError}
                onRetry={handleGoogleSignIn}
                showIcon={true}
              />
            )}
          </div>
        )}
        
        {/* Gamification Dashboard */}
        {currentUser && (
          <div className="gamification-dashboard">
            <div className="dashboard-header">
              <h2>今日の状況</h2>
              <div className="user-level-streak">
                <div className="level-info">
                  ⭐ レベル {currentUser ? (userProfile?.level || 1) : 1}
                </div>
                <StreakDisplay streak={currentUser ? (userProfile?.streak || 0) : 0} />
              </div>
            </div>
            
            <div className="daily-goals">
              {dailyGoal ? (
                <div className="goals-grid">
                  <div className="goal-item">
                    <div className="goal-header">
                      <span className="goal-icon">🍷</span>
                      <span className="goal-label">ワイン記録</span>
                    </div>
                    <div className="goal-progress">
                      <span className="goal-numbers">{dailyGoal.wineRecordingCompleted}/{dailyGoal.wineRecordingGoal}</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${calculateProgress(dailyGoal.wineRecordingCompleted, dailyGoal.wineRecordingGoal)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="goal-item">
                    <div className="goal-header">
                      <span className="goal-icon">🧠</span>
                      <span className="goal-label">クイズ</span>
                    </div>
                    <div className="goal-progress">
                      <span className="goal-numbers">{dailyGoal.quizCompleted}/{dailyGoal.quizGoal}</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${calculateProgress(dailyGoal.quizCompleted, dailyGoal.quizGoal)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="goals-loading">
                  目標を読み込み中...
                </div>
              )}
              
              {dailyGoal && dailyGoal.xpEarned > 0 && (
                <div className="xp-earned">
                  💎 今日獲得したXP: {dailyGoal.xpEarned} XP
                </div>
              )}
            </div>
            
            <div className="learning-progress">
              <h3>今週の学習進捗</h3>
              <div className="weekly-overview">
                <div className="week-chart">
                  {['月', '火', '水', '木', '金', '土', '日'].map((day, i) => {
                    const isToday = i === new Date().getDay() - 1;
                    return (
                      <div key={day} className={`day-column ${isToday ? 'today' : ''}`}>
                        <div 
                          className="activity-bar" 
                          style={{ height: `${Math.min(weeklyProgress[i] * 25, 100)}px` }}
                          title={`${weeklyProgress[i]}件の記録`}
                        >
                          {weeklyProgress[i] > 0 && (
                            <span className="activity-count">{weeklyProgress[i]}</span>
                          )}
                        </div>
                        <span className="day-name">{day}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="learning-tip">
                  <p className="tip-text">
                    {learningStreak > 0 
                      ? `${learningStreak}日連続で学習中！この調子で続けましょう！`
                      : '毎日1本でも記録することで、知識が定着します'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!currentUser && (
          <div className="daily-goals">
            <h2>今日の目標</h2>
            <div className="goal-item">
              <span>ログインして目標を確認しましょう</span>
            </div>
          </div>
        )}
        
        <div className="recent-activity">
          <h2>最近の記録</h2>
          {loading ? (
            <LoadingSpinner size="small" message="最近の記録を読み込み中..." />
          ) : error ? (
            <ErrorMessage
              title="データの読み込みに失敗しました"
              message={error}
              onRetry={loadHomeData}
              showIcon={false}
            />
          ) : recentWines.length > 0 ? (
            <>
              <div className="wine-grid">
                {recentWines.map(wine => (
                  <WineCard 
                    key={wine.id} 
                    wine={wine} 
                    onClick={() => navigate(`/wine-detail/${wine.id}`)}
                  />
                ))}
              </div>
              <button 
                className="view-all-button"
                onClick={() => navigate('/records')}
              >
                すべての記録を見る →
              </button>
            </>
          ) : (
            <div className="empty-state">
              <p>{currentUser ? 'まだワインの記録がありません' : 'まだワインの記録がありません（ゲストモード）'}</p>
              <button 
                className="get-started-button"
                onClick={() => navigate('/select-wine')}
              >
                最初の1本を記録する 🍷
              </button>
            </div>
          )}
        </div>

        {drafts.length > 0 && (
          <div className="drafts-section">
            <h2>下書き ({drafts.length})</h2>
            <div className="draft-list">
              {drafts.slice(0, 2).map(draft => (
                <div 
                  key={draft.id} 
                  className="draft-item"
                  onClick={() => handleDraftClick(draft)}
                >
                  <div className="draft-info">
                    <span className="draft-name">
                      {draft.data.wineName || '名称未入力'}
                    </span>
                    <span className="draft-date">
                      {draft.lastSaved.toLocaleDateString('ja-JP')} に保存
                    </span>
                  </div>
                  <span className="draft-arrow">→</span>
                </div>
              ))}
              {drafts.length > 2 && (
                <p className="more-drafts">他 {drafts.length - 2} 件の下書きがあります</p>
              )}
            </div>
          </div>
        )}
      </main>
      
      {/* Notification Permission Prompt */}
      {currentUser && !currentUser.isAnonymous && (
        <NotificationPrompt />
      )}
    </div>
  );
};

export default Home;