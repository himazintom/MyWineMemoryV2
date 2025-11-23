import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthHooks';
import { initializeQuizQuestions } from '../data/quiz';
import { quizProgressService, type QuizProgress, type UserQuizStats } from '../services/quizProgressService';
import LoadingSpinner from '../components/LoadingSpinner';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();

  const [, setUserProgress] = useState<QuizProgress[]>([]);
  const [userStats, setUserStats] = useState<UserQuizStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hearts, setHearts] = useState(5);
  const [quizInitialized, setQuizInitialized] = useState(false);

  // Check if user is in infinite mode (default to infinite if not set)
  const isInfiniteMode = userProfile?.quizMode !== 'normal';

  const startGeneralQuiz = () => {
    // Start with difficulty 1 for general quiz
    navigate('/quiz/play/1');
  };

  const startPersonalRecordQuiz = () => {
    // For now, show an alert about upcoming feature
    alert('あなたの記録に基づくクイズ機能は準備中です。\n一般クイズをお楽しみください！');
  };

  const startReviewQuiz = async () => {
    if (!currentUser) {
      alert('ログインが必要です');
      return;
    }
    
    try {
      const wrongAnswers = await quizProgressService.getWrongAnswersForReview(currentUser.uid);
      if (wrongAnswers.length === 0) {
        alert('復習する問題がありません。\nまずは一般クイズに挑戦してみましょう！');
        return;
      }
      
      // Navigate to review quiz (we'll implement this later)
      alert(`${wrongAnswers.length}問の復習問題があります。\n復習クイズ機能は準備中です。`);
    } catch (error) {
      console.error('Failed to load review questions:', error);
      alert('復習問題の読み込みに失敗しました。');
    }
  };
  
  useEffect(() => {
    const loadUserData = async () => {
      // Initialize quiz questions
      if (!quizInitialized) {
        await initializeQuizQuestions();
        setQuizInitialized(true);
      }
      
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        const [progress, stats] = await Promise.all([
          quizProgressService.getAllUserProgress(currentUser.uid),
          quizProgressService.getUserQuizStats(currentUser.uid)
        ]);

        setUserProgress(progress);
        setUserStats(stats);

        // Recover hearts if needed (only in normal mode)
        if (stats && userProfile?.quizMode === 'normal') {
          const recoveredHearts = await quizProgressService.recoverHearts(currentUser.uid);
          setHearts(recoveredHearts);
        } else {
          // Infinite mode: always show full hearts (for display purposes)
          setHearts(5);
        }
      } catch (error) {
        console.error('Failed to load user quiz data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [currentUser, quizInitialized, userProfile?.quizMode]);
  
  const getHeartDisplay = () => {
    return '❤️'.repeat(hearts) + '🤍'.repeat(5 - hearts);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>ワインクイズ</h1>
        <div className="quiz-stats">
          {isInfiniteMode ? (
            <span>♾️ 無限モード</span>
          ) : (
            <span>{getHeartDisplay()}</span>
          )}
          <span>レベル {userStats?.level || 1}</span>
          {userStats && (
            <span>正答率: {userStats.overallAccuracy.toFixed(1)}%</span>
          )}
        </div>
      </header>
      
      <main className="quiz-content">
        {loading ? (
          <LoadingSpinner message="クイズデータを読み込み中..." />
        ) : (
        <>
        <div className="quiz-actions">
          <button 
            onClick={() => navigate('/quiz/levels')}
            className="quiz-action-button"
          >
            <span className="action-icon">🎯</span>
            <div className="action-text">
              <div className="action-title">レベル選択</div>
              <div className="action-subtitle">学習進度を確認して挑戦するレベルを選択</div>
            </div>
            <span className="action-arrow">→</span>
          </button>
        </div>
        
        <div className="quiz-modes">
          <h2>クイズモード</h2>
          <button className="btn btn-mode" onClick={startGeneralQuiz}>
            📚 一般クイズ
          </button>
          <button className="btn btn-mode" onClick={startPersonalRecordQuiz}>
            🍷 あなたの記録クイズ
          </button>
          <button className="btn btn-mode" onClick={startReviewQuiz}>
            🔄 復習クイズ
          </button>
        </div>
        </>
        )}
      </main>
    </div>
  );
};

export default Quiz;