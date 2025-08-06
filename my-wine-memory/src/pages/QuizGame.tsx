import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { QuizQuestion } from '../types';
import { getRandomQuestions } from '../data/sampleQuestions';

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

  useEffect(() => {
    if (!currentUser) {
      navigate('/profile');
      return;
    }

    // Initialize quiz
    const difficultyNum = parseInt(difficulty || '1');
    const quizQuestions = getRandomQuestions(difficultyNum, 10);
    setQuestions(quizQuestions);
  }, [currentUser, difficulty, navigate]);

  useEffect(() => {
    if (gameStatus === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStatus === 'playing') {
      handleTimeUp();
    }
  }, [timeLeft, gameStatus]);

  const handleTimeUp = () => {
    setGameStatus('timeup');
    setHearts(hearts - 1);
    if (hearts <= 1) {
      setGameStatus('finished');
    } else {
      // Move to next question after 2 seconds
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || showExplanation) return;
    
    setSelectedAnswer(answerIndex);
    const currentQuestion = questions[currentQuestionIndex];
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    } else {
      setHearts(hearts - 1);
    }

    setShowExplanation(true);

    // Auto move to next question after 3 seconds
    setTimeout(() => {
      if (hearts <= 1 && !correct) {
        setGameStatus('finished');
      } else {
        nextQuestion();
      }
    }, 3000);
  };

  const nextQuestion = () => {
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
  };

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
    return (
      <div className="page-container">
        <div className="quiz-result">
          <h1>クイズ終了！</h1>
          <div className="result-stats">
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
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizGame;