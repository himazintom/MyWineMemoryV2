import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthHooks';
import { getTotalQuestionsByDifficulty } from '../data/sampleQuestions';
import { quizProgressService, type QuizProgress, type UserQuizStats } from '../services/quizProgressService';
import LoadingSpinner from '../components/LoadingSpinner';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const questionStats = getTotalQuestionsByDifficulty();
  
  const [userProgress, setUserProgress] = useState<QuizProgress[]>([]);
  const [userStats, setUserStats] = useState<UserQuizStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hearts, setHearts] = useState(5);
  
  const startQuiz = (difficulty: number) => {
    navigate(`/quiz/play/${difficulty}`);
  };

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
        
        // Recover hearts if needed
        if (stats) {
          const recoveredHearts = await quizProgressService.recoverHearts(currentUser.uid);
          setHearts(recoveredHearts);
        }
      } catch (error) {
        console.error('Failed to load user quiz data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [currentUser]);
  
  const getProgressForDifficulty = (difficulty: number) => {
    return userProgress.find(p => p.difficulty === difficulty);
  };
  
  const getHeartDisplay = () => {
    return '❤️'.repeat(hearts) + '🤍'.repeat(5 - hearts);
  };
  
  const canPlayQuiz = () => {
    return !currentUser || hearts > 0;
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>ワインクイズ</h1>
        <div className="quiz-stats">
          <span>{getHeartDisplay()}</span>
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
        <div className="difficulty-levels">
          <h2>難易度を選択</h2>
          <div className="level-grid">
            <button 
              className={`level-button ${canPlayQuiz() ? 'available' : 'disabled'}`} 
              onClick={() => canPlayQuiz() && startQuiz(1)}
              disabled={!canPlayQuiz()}
            >
              <span className="level-number">1</span>
              <span className="level-name">入門編</span>
              <span className="level-progress">
                {getProgressForDifficulty(1)?.completedQuestions.length || 0}/{questionStats.find(s => s.difficulty === 1)?.count || 0}
              </span>
              {getProgressForDifficulty(1) && (
                <span className="level-score">最高: {getProgressForDifficulty(1)!.bestScore}%</span>
              )}
            </button>
            <button 
              className={`level-button ${canPlayQuiz() ? 'available' : 'disabled'}`} 
              onClick={() => canPlayQuiz() && startQuiz(2)}
              disabled={!canPlayQuiz()}
            >
              <span className="level-number">2</span>
              <span className="level-name">初級編</span>
              <span className="level-progress">
                {getProgressForDifficulty(2)?.completedQuestions.length || 0}/{questionStats.find(s => s.difficulty === 2)?.count || 0}
              </span>
              {getProgressForDifficulty(2) && (
                <span className="level-score">最高: {getProgressForDifficulty(2)!.bestScore}%</span>
              )}
            </button>
            <button 
              className={`level-button ${canPlayQuiz() ? 'available' : 'disabled'}`} 
              onClick={() => canPlayQuiz() && startQuiz(3)}
              disabled={!canPlayQuiz()}
            >
              <span className="level-number">3</span>
              <span className="level-name">中級編</span>
              <span className="level-progress">
                {getProgressForDifficulty(3)?.completedQuestions.length || 0}/{questionStats.find(s => s.difficulty === 3)?.count || 0}
              </span>
              {getProgressForDifficulty(3) && (
                <span className="level-score">最高: {getProgressForDifficulty(3)!.bestScore}%</span>
              )}
            </button>
            <button 
              className={`level-button ${canPlayQuiz() ? 'available' : 'disabled'}`} 
              onClick={() => canPlayQuiz() && startQuiz(4)}
              disabled={!canPlayQuiz()}
            >
              <span className="level-number">4</span>
              <span className="level-name">上級編</span>
              <span className="level-progress">
                {getProgressForDifficulty(4)?.completedQuestions.length || 0}/{questionStats.find(s => s.difficulty === 4)?.count || 0}
              </span>
              {getProgressForDifficulty(4) && (
                <span className="level-score">最高: {getProgressForDifficulty(4)!.bestScore}%</span>
              )}
            </button>
            <button 
              className={`level-button ${canPlayQuiz() ? 'available' : 'disabled'}`} 
              onClick={() => canPlayQuiz() && startQuiz(5)}
              disabled={!canPlayQuiz()}
            >
              <span className="level-number">5</span>
              <span className="level-name">専門級</span>
              <span className="level-progress">
                {getProgressForDifficulty(5)?.completedQuestions.length || 0}/{questionStats.find(s => s.difficulty === 5)?.count || 0}
              </span>
              {getProgressForDifficulty(5) && (
                <span className="level-score">最高: {getProgressForDifficulty(5)!.bestScore}%</span>
              )}
            </button>
          </div>
        </div>
        
        <div className="quiz-modes">
          <h2>クイズモード</h2>
          <button className="mode-button" onClick={startGeneralQuiz}>
            📚 一般クイズ
          </button>
          <button className="mode-button" onClick={startPersonalRecordQuiz}>
            🍷 あなたの記録クイズ
          </button>
          <button className="mode-button" onClick={startReviewQuiz}>
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