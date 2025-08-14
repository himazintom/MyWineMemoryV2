import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthHooks';
import type { QuizQuestion } from '../types';
import { getRandomQuestions } from '../data/sampleQuestions';
import { quizProgressService } from '../services/quizProgressService';

const QuizGame: React.FC = () => {
  const navigate = useNavigate();
  const { difficulty } = useParams<{ difficulty: string }>();
  const { currentUser } = useAuth();
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStatus, setGameStatus] = useState<'playing' | 'finished' | 'timeup'>('playing');
  const [hearts, setHearts] = useState(5);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);

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
            alert('ハートがありません。\n時間を置いてから再度挑戦してください。');
            navigate('/quiz');
            return;
          }
        }
        
        // Initialize quiz
        const difficultyNum = parseInt(difficulty || '1');
        const quizQuestions = getRandomQuestions(difficultyNum, 10);
        setQuestions(quizQuestions);
      } catch (error) {
        console.error('Failed to initialize quiz:', error);
        // Fallback to default initialization
        const difficultyNum = parseInt(difficulty || '1');
        const quizQuestions = getRandomQuestions(difficultyNum, 10);
        setQuestions(quizQuestions);
      }
    };
    
    initializeQuiz();
  }, [currentUser, difficulty, navigate]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex + 1 >= questions.length) {
      setGameStatus('finished');
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsCorrect(null);
      setTimeLeft(30);
      if (gameStatus === 'timeup') {
        setGameStatus('playing');
      }
    }
  }, [currentQuestionIndex, questions.length, gameStatus]);

  const handleTimeUp = useCallback(async () => {
    setGameStatus('timeup');
    
    // Record time up as wrong answer
    const currentQuestion = questions[currentQuestionIndex];
    if (currentUser && currentQuestion) {
      try {
        await Promise.all([
          quizProgressService.recordWrongAnswer(currentUser.uid, currentQuestion, -1), // -1 indicates timeout
          quizProgressService.useHeart(currentUser.uid)
        ]);
      } catch (error) {
        console.error('Failed to record timeout:', error);
      }
    }
    
    setHearts(hearts - 1);
    setAnsweredQuestions([...answeredQuestions, currentQuestion?.id || '']);
    
    if (hearts <= 1) {
      setGameStatus('finished');
    } else {
      // Move to next question after 2 seconds
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    }
  }, [hearts, nextQuestion, currentQuestionIndex, questions, currentUser, answeredQuestions]);

  useEffect(() => {
    if (gameStatus === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStatus === 'playing') {
      handleTimeUp();
    }
  }, [timeLeft, gameStatus, handleTimeUp]);

  const handleAnswerSelect = async (answerIndex: number) => {
    if (selectedAnswer !== null || showExplanation) return;
    
    setSelectedAnswer(answerIndex);
    const currentQuestion = questions[currentQuestionIndex];
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    // Track answered questions
    const newAnsweredQuestions = [...answeredQuestions, currentQuestion.id];
    setAnsweredQuestions(newAnsweredQuestions);
    
    if (correct) {
      setScore(score + 1);
      setCorrectAnswers([...correctAnswers, currentQuestion.id]);
      
      // Mark wrong answer as resolved if it was previously wrong
      if (currentUser) {
        try {
          await quizProgressService.resolveWrongAnswer(currentUser.uid, currentQuestion.id);
        } catch (error) {
          console.error('Failed to resolve wrong answer:', error);
        }
      }
    } else {
      // Record wrong answer and use heart
      if (currentUser) {
        try {
          await Promise.all([
            quizProgressService.recordWrongAnswer(currentUser.uid, currentQuestion, answerIndex),
            quizProgressService.useHeart(currentUser.uid)
          ]);
        } catch (error) {
          console.error('Failed to record wrong answer or use heart:', error);
        }
      }
      setHearts(hearts - 1);
    }

    setShowExplanation(true);

    // Check if game should end due to no hearts remaining
    if (hearts <= 1 && !correct) {
      setTimeout(() => setGameStatus('finished'), 1000);
    }
  };

  const restartQuiz = () => {
    const difficultyNum = parseInt(difficulty || '1');
    const newQuestions = getRandomQuestions(difficultyNum, 10);
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(30);
    setHearts(5);
    setGameStatus('playing');
    setShowExplanation(false);
    setIsCorrect(null);
    setAnsweredQuestions([]);
    setCorrectAnswers([]);
  };
  
  // Save progress when game ends
  useEffect(() => {
    if (gameStatus === 'finished' && currentUser && answeredQuestions.length > 0) {
      const saveProgress = async () => {
        try {
          const difficultyNum = parseInt(difficulty || '1');
          const isStreak = score === questions.length; // Perfect score
          
          await Promise.all([
            quizProgressService.updateProgress(
              currentUser.uid,
              difficultyNum,
              answeredQuestions,
              score,
              questions.length
            ),
            quizProgressService.updateUserQuizStats(
              currentUser.uid,
              score,
              questions.length,
              isStreak
            )
          ]);
          
          console.log('Progress saved successfully');
        } catch (error) {
          console.error('Failed to save quiz progress:', error);
        }
      };
      
      saveProgress();
    }
  }, [gameStatus, currentUser, answeredQuestions, score, questions.length, difficulty]);

  const goBack = () => {
    navigate('/quiz');
  };

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
          <div className="timer">{timeLeft}秒</div>
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
                disabled={showExplanation}
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