import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthHooks';
import type { QuizQuestion } from '../types';
import { advancedQuizService } from '../services/advancedQuizService';
import { quizProgressService } from '../services/quizProgressService';
import { learningInsightService, type LearningInsight } from '../services/learningInsightService';

const QuizGame: React.FC = () => {
  const navigate = useNavigate();
  const { difficulty } = useParams<{ difficulty: string }>();
  const { currentUser } = useAuth();
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<{ text: string; originalIndex: number }[]>([]);
  // const [timeLeft, setTimeLeft] = useState(30); // Time limit removed
  const [gameStatus, setGameStatus] = useState<'playing' | 'finished' | 'timeup' | 'error'>('playing');
  const [hearts, setHearts] = useState(5);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [loadingError, setLoadingError] = useState<string>('');
  const [showNoHeartsMessage, setShowNoHeartsMessage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [learningInsight, setLearningInsight] = useState<LearningInsight | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  
  // Sound effects refs
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const incorrectSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize sound effects
  useEffect(() => {
    // Create audio elements for sound effects
    correctSoundRef.current = new Audio('/sounds/correct.mp3');
    incorrectSoundRef.current = new Audio('/sounds/incorrect.mp3');
    
    // Set volume
    if (correctSoundRef.current) {
      correctSoundRef.current.volume = 0.3;
      correctSoundRef.current.preload = 'auto';
    }
    if (incorrectSoundRef.current) {
      incorrectSoundRef.current.volume = 0.3;
      incorrectSoundRef.current.preload = 'auto';
    }
    
    // Clean up on unmount
    return () => {
      if (correctSoundRef.current) {
        correctSoundRef.current.pause();
        correctSoundRef.current = null;
      }
      if (incorrectSoundRef.current) {
        incorrectSoundRef.current.pause();
        incorrectSoundRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!currentUser) {
      navigate('/profile');
      return;
    }

    const initializeQuiz = async () => {
      try {
        // Get user's current hearts
        const userStats = await quizProgressService.getUserQuizStats(currentUser.uid);
        if (userStats) {
          const recoveredHearts = await quizProgressService.recoverHearts(currentUser.uid);
          setHearts(recoveredHearts);
          
          if (recoveredHearts <= 0) {
            setShowNoHeartsMessage(true);
            setTimeout(() => {
              navigate('/quiz');
            }, 3000);
            return;
          }
        }
        
        // Initialize quiz with weighted selection
        const difficultyNum = parseInt(difficulty || '1');
        console.log(`[QuizGame] Initializing quiz for level ${difficultyNum}`);

        const quizQuestions = await advancedQuizService.selectQuestionsForLevel(
          currentUser.uid,
          difficultyNum,
          10
        );

        console.log(`[QuizGame] Received ${quizQuestions.length} questions`);

        if (quizQuestions.length === 0) {
          const errorMsg = `このレベル(${difficultyNum})にはまだ問題が準備されていません。コンソールログを確認してください。`;
          console.error(`[QuizGame] No questions loaded for level ${difficultyNum}`);
          setLoadingError(errorMsg);
          setGameStatus('error');
          // Redirect to quiz selection after 3 seconds
          setTimeout(() => {
            navigate('/quiz');
          }, 3000);
        } else {
          setQuestions(quizQuestions);
        }
      } catch (error) {
        console.error('Failed to initialize quiz:', error);
        setLoadingError('クイズの初期化に失敗しました。もう一度お試しください。');
        setGameStatus('error');
      }
    };
    
    initializeQuiz();
  }, [currentUser, difficulty, navigate]);

  // Shuffle array helper
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Shuffle options when question changes
  useEffect(() => {
    if (questions[currentQuestionIndex]) {
      const currentQuestion = questions[currentQuestionIndex];
      const optionsWithIndex = currentQuestion.options.map((text, index) => ({
        text,
        originalIndex: index
      }));
      setShuffledOptions(shuffleArray(optionsWithIndex));
    }
  }, [currentQuestionIndex, questions]);

  const nextQuestion = useCallback(() => {
    // 処理中フラグを即座にリセット
    setIsProcessing(false);
    
    if (currentQuestionIndex + 1 >= questions.length) {
      setGameStatus('finished');
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsCorrect(null);
      // setTimeLeft(30); // Time limit removed
      if (gameStatus === 'timeup') {
        setGameStatus('playing');
      }
    }
  }, [currentQuestionIndex, questions.length, gameStatus]);

  // Time limit functionality removed
  // const handleTimeUp = useCallback(async () => { ... }, [...]);

  // Timer functionality removed
  // useEffect(() => { ... }, [timeLeft, gameStatus, handleTimeUp]);

  const handleAnswerSelect = async (shuffledIndex: number, originalIndex: number) => {
    // 既に回答済み、説明表示中、または処理中の場合は何もしない
    if (selectedAnswer !== null || showExplanation || isProcessing) return;
    
    // Immediately set processing and selected state for faster response
    setIsProcessing(true);
    setSelectedAnswer(shuffledIndex);
    
    const currentQuestion = questions[currentQuestionIndex];
    const correct = originalIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    // Play sound effect immediately
    if (correct && correctSoundRef.current) {
      correctSoundRef.current.currentTime = 0;
      correctSoundRef.current.play().catch(() => {});
    } else if (!correct && incorrectSoundRef.current) {
      incorrectSoundRef.current.currentTime = 0;
      incorrectSoundRef.current.play().catch(() => {});
    }
    
    // Track answered questions
    const newAnsweredQuestions = [...answeredQuestions, currentQuestion.id];
    setAnsweredQuestions(newAnsweredQuestions);
    
    let newHearts = hearts;
    
    if (correct) {
      setScore(score + 1);
      setCorrectAnswers([...correctAnswers, currentQuestion.id]);
    } else {
      // Use heart
      if (currentUser) {
        try {
          const remainingHearts = await quizProgressService.useHeart(currentUser.uid);
          newHearts = remainingHearts;
        } catch (error) {
          console.error('Failed to use heart:', error);
          newHearts = Math.max(0, hearts - 1);
        }
      } else {
        newHearts = Math.max(0, hearts - 1);
      }
      setHearts(newHearts);
    }

    // Show explanation immediately
    setShowExplanation(true);
    
    // Update question status in background (non-blocking)
    if (currentUser) {
      advancedQuizService.updateQuestionStatus(
        currentUser.uid,
        parseInt(difficulty || '1'),
        currentQuestion.id,
        correct
      ).catch(error => console.error('Failed to update question status:', error));
    }

    // Check if game should end due to no hearts remaining
    if (newHearts <= 0 && !correct) {
      setTimeout(() => setGameStatus('finished'), 1000);
    }
    
    // Don't reset processing here - keep it until next question
  };

  const restartQuiz = async () => {
    if (!currentUser) return;
    const difficultyNum = parseInt(difficulty || '1');
    const newQuestions = await advancedQuizService.selectQuestionsForLevel(
      currentUser.uid,
      difficultyNum,
      10
    );
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    // setTimeLeft(30); // Time limit removed
    setHearts(5);
    setGameStatus('playing');
    setShowExplanation(false);
    setIsCorrect(null);
    setAnsweredQuestions([]);
    setCorrectAnswers([]);
  };
  
  // Save progress and generate insight when game ends
  useEffect(() => {
    if (gameStatus === 'finished' && currentUser && answeredQuestions.length > 0) {
      const saveProgressAndGenerateInsight = async () => {
        try {
          const difficultyNum = parseInt(difficulty || '1');
          const isStreak = score === questions.length; // Perfect score
          
          // Use completeQuizSession which includes gamification
          await quizProgressService.completeQuizSession(
            currentUser.uid,
            difficultyNum,
            answeredQuestions,
            score,
            questions.length,
            !isStreak // streakBroken parameter
          );
          
          console.log('Progress and XP saved successfully');
          
          // Generate learning insight
          setIsLoadingInsight(true);
          try {
            const insight = await learningInsightService.generateQuizInsight({
              correctAnswers: score,
              totalQuestions: questions.length,
              difficulty: difficultyNum
            });
            setLearningInsight(insight);
          } catch (error) {
            console.error('Failed to generate insight:', error);
          } finally {
            setIsLoadingInsight(false);
          }
        } catch (error) {
          console.error('Failed to save quiz progress:', error);
        }
      };
      
      saveProgressAndGenerateInsight();
    }
  }, [gameStatus, currentUser, answeredQuestions, score, questions.length, difficulty]);

  const goBack = () => {
    // If game is finished, no need to confirm
    if (gameStatus === 'finished') {
      navigate('/quiz');
      return;
    }
    
    const confirmExit = window.confirm('クイズを中断しますか？進捗は保存されません。');
    if (confirmExit) {
      navigate('/quiz');
    }
  };
  
  // Handle browser back button
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      
      // If game is finished, allow navigation without confirmation
      if (gameStatus === 'finished') {
        navigate('/quiz');
        return;
      }
      
      const confirmExit = window.confirm('クイズを中断しますか？進捗は保存されません。');
      if (confirmExit) {
        navigate('/quiz');
      } else {
        // Push state again to prevent navigation
        window.history.pushState(null, '', window.location.pathname);
      }
    };
    
    // Push initial state
    window.history.pushState(null, '', window.location.pathname);
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, gameStatus]);

  if (gameStatus === 'error') {
    return (
      <div className="page-container">
        <div className="quiz-result">
          <h2>エラーが発生しました</h2>
          <p className="error-message">{loadingError}</p>
          <div className="result-actions">
            <button className="btn-primary" onClick={() => window.location.reload()}>
              再読み込み
            </button>
            <button className="btn-secondary" onClick={() => navigate('/quiz')}>
              レベル選択に戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showNoHeartsMessage) {
    return (
      <div className="page-container">
        <div className="quiz-result">
          <h2>ハートがありません</h2>
          <div className="no-hearts-icon">💔</div>
          <p className="error-message">
            ハートが回復するまでお待ちください。<br />
            3分ごとに1つずつ回復します。
          </p>
          <div className="result-actions">
            <button className="btn-secondary" onClick={() => navigate('/quiz')}>
              レベル選択に戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="page-container">
        <div className="loading-quiz">
          <p>クイズを準備中...</p>
        </div>
      </div>
    );
  }

  if (gameStatus === 'finished') {
    const percentage = (score / questions.length) * 100;
    const difficultyNum = parseInt(difficulty || '1');
    
    return (
      <div className="page-container">
        <div className="quiz-result">
          <h1>クイズ終了！</h1>
          <div className="result-stats">
            <div className="difficulty-info">
              <span className="difficulty-badge">難易度 {difficultyNum}</span>
            </div>
            <div className="score">
              <span className="score-number">{score}</span>
              <span className="score-total">/ {questions.length}</span>
            </div>
            <div className="percentage">{percentage.toFixed(0)}%正解</div>
          </div>
          
          <div className="result-message">
            {percentage >= 80 && <p>🎉 素晴らしい！ワイン博士ですね！</p>}
            {percentage >= 60 && percentage < 80 && <p>👍 よくできました！もう少しで完璧です！</p>}
            {percentage >= 40 && percentage < 60 && <p>📚 まずまずです。もう少し勉強してみましょう！</p>}
            {percentage < 40 && <p>💪 まだまだこれから！頑張って学習を続けましょう！</p>}
          </div>
          
          {/* XP Earned Display */}
          <div className="xp-earned" style={{ 
            textAlign: 'center', 
            fontSize: '1.2rem', 
            color: '#4CAF50',
            fontWeight: 'bold',
            margin: '1rem 0'
          }}>
            ✨ {score * 5 + (percentage === 100 ? 10 : 0)}XP 獲得しました！
            {percentage === 100 && <span style={{ color: '#FFD700', marginLeft: '0.5rem' }}>🏆 パーフェクトボーナス!</span>}
          </div>
          
          {/* Learning Insight */}
          {(learningInsight || isLoadingInsight) && (
            <div className="learning-insight">
              <div className="insight-header">💡 学習インサイト</div>
              {isLoadingInsight ? (
                <div className="insight-loading">分析中...</div>
              ) : (
                <div className="insight-message">{learningInsight?.message}</div>
              )}
            </div>
          )}

          <div className="result-actions">
            <button className="btn-primary" onClick={restartQuiz}>
              もう一度挑戦
            </button>
            <button className="btn-secondary" onClick={goBack}>
              クイズメニューに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="page-container">
      <header className="quiz-header-compact">
        <div className="quiz-header-content">
          <div className="quiz-hearts-section">
            <span className="hearts-label">体力:</span>
            <div className="hearts-compact">
              {Array.from({ length: hearts }).map((_, i) => (
                <span key={i} className="heart-icon">❤️</span>
              ))}
              {hearts < 5 && Array.from({ length: 5 - hearts }).map((_, i) => (
                <span key={`empty-${i}`} className="heart-icon empty">🤍</span>
              ))}
            </div>
          </div>
          <div className="quiz-progress-section">
            <span className="progress-label">進捗:</span>
            <div className="quiz-progress-text">
              {currentQuestionIndex + 1}/{questions.length}
            </div>
          </div>
        </div>
        <div className="progress-bar-thin">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </header>

      <main className="quiz-content">
        <div className="question-info">
          <span className="question-number">
            問題 {currentQuestionIndex + 1}/{questions.length}
          </span>
          <span className="question-category">{currentQuestion.category}</span>
        </div>

        <div className="question-card">
          <h2 className="question-text">{currentQuestion.question}</h2>
          
          <div className="answer-options">
            {shuffledOptions.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = showExplanation && option.originalIndex === currentQuestion.correctAnswer;
              
              return (
                <button
                  key={index}
                  className={`answer-option ${
                    isSelected
                      ? isCorrect === true 
                        ? 'correct' 
                        : 'incorrect'
                      : isCorrectAnswer
                        ? 'correct-answer'
                        : ''
                  } ${isProcessing && !showExplanation ? 'processing' : ''}`}
                  onClick={() => handleAnswerSelect(index, option.originalIndex)}
                  disabled={showExplanation || selectedAnswer !== null}
                >
                  {isProcessing && isSelected && !showExplanation && (
                    <span className="answer-loading"></span>
                  )}
                  {option.text}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="explanation">
              <div className={`result-indicator ${isCorrect ? 'correct' : 'incorrect'}`}>
                {isCorrect ? '✅ 正解！' : '❌ 不正解'}
              </div>
              <p className="explanation-text">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>
      </main>
      
      {showExplanation && (
        <div className="quiz-fixed-footer">
          <button 
            className="next-button-fixed"
            onClick={nextQuestion}
            disabled={false}
          >
            {currentQuestionIndex + 1 >= questions.length ? '結果を見る' : '次の問題へ →'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizGame;