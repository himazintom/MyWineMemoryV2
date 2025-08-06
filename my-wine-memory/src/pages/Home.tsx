import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { wineService, draftService } from '../services/wineService';
import { goalService } from '../services/userService';
import type { WineRecord, WineDraft, DailyGoal } from '../types';
import WineCard from '../components/WineCard';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [recentWines, setRecentWines] = useState<WineRecord[]>([]);
  const [drafts, setDrafts] = useState<WineDraft[]>([]);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadHomeData();
    }
  }, [currentUser]);

  const loadHomeData = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const [wines, userDrafts, goal] = await Promise.all([
        wineService.getUserWineRecords(currentUser.uid, 'date'),
        draftService.getUserDrafts(currentUser.uid),
        goalService.initializeTodayGoal(currentUser.uid)
      ]);
      
      setRecentWines(wines.slice(0, 3)); // Show only 3 most recent
      setDrafts(userDrafts);
      setDailyGoal(goal);
    } catch (error) {
      console.error('Failed to load home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (completed: number, goal: number) => {
    return Math.min(100, (completed / goal) * 100);
  };

  const handleDraftClick = (draft: WineDraft) => {
    // TODO: Navigate to add-wine with draft data pre-filled
    navigate('/add-wine', { state: { draftData: draft } });
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>MyWineMemory</h1>
        <p>あなたのワイン体験を記録しよう</p>
      </header>
      
      <main className="home-content">
        <div className="quick-actions">
          <button className="action-button primary" onClick={() => navigate('/add-wine')}>
            🍷 ワインを記録する
          </button>
          <button 
            className="action-button secondary" 
            onClick={() => navigate('/quiz')}
            disabled={drafts.length === 0}
          >
            {drafts.length > 0 ? `📝 下書きを続ける (${drafts.length})` : '📝 下書きなし'}
          </button>
        </div>
        
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
            <p>読み込み中...</p>
          ) : recentWines.length > 0 ? (
            <>
              {recentWines.map(wine => (
                <WineCard 
                  key={wine.id} 
                  wine={wine} 
                  onClick={() => navigate(`/wine/${wine.id}`)}
                />
              ))}
              <button 
                className="view-all-button"
                onClick={() => navigate('/records')}
              >
                すべての記録を見る →
              </button>
            </>
          ) : currentUser ? (
            <div className="empty-state">
              <p>まだワインの記録がありません</p>
              <button 
                className="get-started-button"
                onClick={() => navigate('/add-wine')}
              >
                最初の1本を記録する 🍷
              </button>
            </div>
          ) : (
            <p>ログインして記録を表示しましょう</p>
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