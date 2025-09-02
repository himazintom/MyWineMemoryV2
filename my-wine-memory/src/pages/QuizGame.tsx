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
        const quizQuestions = await advancedQuizService.selectQuestionsForLevel(
          currentUser.uid,
          difficultyNum,
          10
        );
        if (quizQuestions.length === 0) {
          setLoadingError('クイズの問題を読み込めませんでした。');
          setGameStatus('error');
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

  const nextQuestion = useCallback(() => {
    // 処理中の場合は何もしない
    if (isProcessing) return;
    
    if (currentQuestionIndex + 1 >= questions.length) {
      setGameStatus('finished');
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsCorrect(null);
      setIsProcessing(false);
      // setTimeLeft(30); // Time limit removed
      if (gameStatus === 'timeup') {
        setGameStatus('playing');
      }
    }
  }, [currentQuestionIndex, questions.length, gameStatus, isProcessing]);

  // Time limit functionality removed
  // const handleTimeUp = useCallback(async () => { ... }, [...]);

  // Timer functionality removed
  // useEffect(() => { ... }, [timeLeft, gameStatus, handleTimeUp]);

  const handleAnswerSelect = async (answerIndex: number) => {
    // 既に回答済み、説明表示中、または処理中の場合は何もしない
    if (selectedAnswer !== null || showExplanation || isProcessing) return;
    
    setIsProcessing(true);
    
    setSelectedAnswer(answerIndex);
    const currentQuestion = questions[currentQuestionIndex];
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    // Play sound effect
    try {
      if (correct && correctSoundRef.current) {
        correctSoundRef.current.currentTime = 0;
        correctSoundRef.current.play().catch(e => console.log('Sound play failed:', e));
      } else if (!correct && incorrectSoundRef.current) {
        incorrectSoundRef.current.currentTime = 0;
        incorrectSoundRef.current.play().catch(e => console.log('Sound play failed:', e));
      }
    } catch (error) {
      console.log('Sound playback error:', error);
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
    
    // 処理完了
    setIsProcessing(false);
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
    navigate('/quiz');
  };

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
      <header className="quiz-header">
        <button className="back-button" onClick={goBack}>
          ← 戻る
        </button>
        <div className="quiz-progress">
          <div className="hearts">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`heart ${i < hearts ? 'active' : ''}`}>
                ❤️
              </span>
            ))}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          {/* Timer removed */}
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
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`answer-option ${
                  selectedAnswer === index 
                    ? isCorrect === true 
                      ? 'correct' 
                      : 'incorrect'
                    : showExplanation && index === currentQuestion.correctAnswer
                      ? 'correct-answer'
                      : ''
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation || selectedAnswer !== null || isProcessing}
              >
                {option}
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="explanation">
              <div className={`result-indicator ${isCorrect ? 'correct' : 'incorrect'}`}>
                {isCorrect ? '✅ 正解！' : '❌ 不正解'}
              </div>
              <p className="explanation-text">{currentQuestion.explanation}</p>
              <button 
                className="next-button"
                onClick={nextQuestion}
                disabled={isProcessing}
              >
                {currentQuestionIndex + 1 >= questions.length ? '結果を見る' : '次の問題へ →'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizGame;