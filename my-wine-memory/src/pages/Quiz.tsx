import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthHooks';
import { QUIZ_LEVELS, initializeQuizQuestions } from '../data/quiz';
import { quizProgressService, type QuizProgress, type UserQuizStats } from '../services/quizProgressService';
import LoadingSpinner from '../components/LoadingSpinner';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [userProgress, setUserProgress] = useState<QuizProgress[]>([]);
  const [userStats, setUserStats] = useState<UserQuizStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hearts, setHearts] = useState(5);
  const [quizInitialized, setQuizInitialized] = useState(false);
  
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
  }, [currentUser, quizInitialized]);
  
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
          <h2>レベルを選択</h2>
          <p className="level-info">20レベル × 各100問 = 2000問の包括的なワイン学習システム</p>
          
          <div className="level-sections">
            <div className="level-section">
              <h3>🌱 初心者 (レベル1-5)</h3>
              <div className="level-grid">
                {QUIZ_LEVELS.slice(0, 5).map(level => (
                  <button 
                    key={level.level}
                    className={`level-button ${canPlayQuiz() ? 'available' : 'disabled'}`} 
                    onClick={() => canPlayQuiz() && startQuiz(level.level)}
                    disabled={!canPlayQuiz()}
                  >
                    <span className="level-number">{level.level}</span>
                    <span className="level-name">{level.name}</span>
                    <span className="level-description">{level.description}</span>
                    <span className="level-progress">
                      {getProgressForDifficulty(level.level)?.completedQuestions.length || 0}/100
                    </span>
                    {getProgressForDifficulty(level.level) && (
                      <span className="level-score">最高: {getProgressForDifficulty(level.level)!.bestScore}%</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="level-section">
              <h3>📚 中級 (レベル6-10)</h3>
              <div className="level-grid">
                {QUIZ_LEVELS.slice(5, 10).map(level => (
                  <button 
                    key={level.level}
                    className={`level-button ${canPlayQuiz() ? 'available' : 'disabled'}`} 
                    onClick={() => canPlayQuiz() && startQuiz(level.level)}
                    disabled={!canPlayQuiz()}
                  >
                    <span className="level-number">{level.level}</span>
                    <span className="level-name">{level.name}</span>
                    <span className="level-description">{level.description}</span>
                    <span className="level-progress">
                      {getProgressForDifficulty(level.level)?.completedQuestions.length || 0}/100
                    </span>
                    {getProgressForDifficulty(level.level) && (
                      <span className="level-score">最高: {getProgressForDifficulty(level.level)!.bestScore}%</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="level-section">
              <h3>🎓 上級 (レベル11-15)</h3>
              <div className="level-grid">
                {QUIZ_LEVELS.slice(10, 15).map(level => (
                  <button 
                    key={level.level}
                    className={`level-button ${canPlayQuiz() ? 'available' : 'disabled'}`} 
                    onClick={() => canPlayQuiz() && startQuiz(level.level)}
                    disabled={!canPlayQuiz()}
                  >
                    <span className="level-number">{level.level}</span>
                    <span className="level-name">{level.name}</span>
                    <span className="level-description">{level.description}</span>
                    <span className="level-progress">
                      {getProgressForDifficulty(level.level)?.completedQuestions.length || 0}/100
                    </span>
                    {getProgressForDifficulty(level.level) && (
                      <span className="level-score">最高: {getProgressForDifficulty(level.level)!.bestScore}%</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="level-section">
              <h3>🏆 エキスパート (レベル16-20)</h3>
              <div className="level-grid">
                {QUIZ_LEVELS.slice(15, 20).map(level => (
                  <button 
                    key={level.level}
                    className={`level-button ${canPlayQuiz() ? 'available' : 'disabled'}`} 
                    onClick={() => canPlayQuiz() && startQuiz(level.level)}
                    disabled={!canPlayQuiz()}
                  >
                    <span className="level-number">{level.level}</span>
                    <span className="level-name">{level.name}</span>
                    <span className="level-description">{level.description}</span>
                    <span className="level-progress">
                      {getProgressForDifficulty(level.level)?.completedQuestions.length || 0}/100
                    </span>
                    {getProgressForDifficulty(level.level) && (
                      <span className="level-score">最高: {getProgressForDifficulty(level.level)!.bestScore}%</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
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