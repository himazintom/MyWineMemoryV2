import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { tastingRecordService } from '../services/tastingRecordService';
import { draftService } from '../services/wineService';
import { goalService } from '../services/userService';
import { guestDataService } from '../services/guestDataService';
import type { WineRecord, WineDraft, DailyGoal } from '../types';
import WineCard from '../components/WineCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAsyncOperation } from '../hooks/useAsyncOperation';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, signInWithGoogle } = useAuth();
  const [recentWines, setRecentWines] = useState<WineRecord[]>([]);
  const [drafts, setDrafts] = useState<WineDraft[]>([]);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal | null>(null);
  const [authError, setAuthError] = useState<string>('');
  const { loading, error, execute: executeLoadHome } = useAsyncOperation<void>();
  const { loading: authLoading, execute: executeAuth } = useAsyncOperation<void>();

  useEffect(() => {
    loadHomeData();
  }, [currentUser]);

  const loadHomeData = async () => {
    try {
      await executeLoadHome(async () => {
        if (currentUser) {
          // Load authenticated user data
          const [wines, userDrafts, goal] = await Promise.all([
            tastingRecordService.getUserTastingRecordsWithWineInfo(currentUser.uid, 'date'),
            draftService.getUserDrafts(currentUser.uid),
            goalService.initializeTodayGoal(currentUser.uid)
          ]);
          
          setRecentWines(wines.slice(0, 3));
          setDrafts(userDrafts);
          setDailyGoal(goal);
        } else {
          // Load guest data
          const guestWines = guestDataService.getGuestWineRecordsAsWineRecords();
          setRecentWines(guestWines.slice(0, 3));
          setDrafts([]);
          setDailyGoal(null);
        }
      });
    } catch (error) {
      console.error('Failed to load home data:', error);
    }
  };

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
    } catch (error: any) {
      setAuthError(error.message || 'ログインに失敗しました');
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>MyWineMemory</h1>
        <p>あなたのワイン体験を記録しよう</p>
      </header>
      
      <main className="home-content">
        <div className="quick-actions">
          <button className="action-button primary" onClick={() => navigate('/select-wine')}>
            🍷 ワインを記録する
          </button>
          <button className="action-button secondary" onClick={() => navigate('/quiz')}>
            🧠 クイズに挑戦する
          </button>
        </div>

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
        
        <div className="daily-goals">
          <h2>今日の目標</h2>
          {dailyGoal ? (
            <>
              <div className="goal-item">
                <span>ワイン記録: {dailyGoal.wineRecordingCompleted}/{dailyGoal.wineRecordingGoal}</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${calculateProgress(dailyGoal.wineRecordingCompleted, dailyGoal.wineRecordingGoal)}%` }}
                  ></div>
                </div>
              </div>
              <div className="goal-item">
                <span>クイズ: {dailyGoal.quizCompleted}/{dailyGoal.quizGoal}</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${calculateProgress(dailyGoal.quizCompleted, dailyGoal.quizGoal)}%` }}
                  ></div>
                </div>
              </div>
              {dailyGoal.xpEarned > 0 && (
                <div className="xp-earned">
                  今日獲得したXP: {dailyGoal.xpEarned} XP
                </div>
              )}
            </>
          ) : (
            <div className="goal-item">
              <span>ログインして目標を確認しましょう</span>
            </div>
          )}
        </div>
        
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
              {recentWines.map(wine => (
                <WineCard 
                  key={wine.id} 
                  wine={wine} 
                  onClick={() => navigate(`/wine-detail/${wine.id}`)}
                />
              ))}
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
    </div>
  );
};

export default Home;