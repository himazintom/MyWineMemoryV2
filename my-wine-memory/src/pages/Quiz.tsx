import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getTotalQuestionsByDifficulty } from '../data/sampleQuestions';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const questionStats = getTotalQuestionsByDifficulty();
  
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

  const startReviewQuiz = () => {
    // For now, show an alert about upcoming feature
    alert('復習クイズ機能は準備中です。\n一般クイズをお楽しみください！');
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>ワインクイズ</h1>
        <div className="quiz-stats">
          <span>❤️❤️❤️❤️❤️</span>
          <span>レベル 1</span>
        </div>
      </header>
      
      <main className="quiz-content">
        <div className="difficulty-levels">
          <h2>難易度を選択</h2>
          <div className="level-grid">
            <button className="level-button available" onClick={() => startQuiz(1)}>
              <span className="level-number">1</span>
              <span className="level-name">入門編</span>
              <span className="level-progress">0/{questionStats.find(s => s.difficulty === 1)?.count || 0}</span>
            </button>
            <button className="level-button available" onClick={() => startQuiz(2)}>
              <span className="level-number">2</span>
              <span className="level-name">初級編</span>
              <span className="level-progress">0/{questionStats.find(s => s.difficulty === 2)?.count || 0}</span>
            </button>
            <button className="level-button available" onClick={() => startQuiz(3)}>
              <span className="level-number">3</span>
              <span className="level-name">中級編</span>
              <span className="level-progress">0/{questionStats.find(s => s.difficulty === 3)?.count || 0}</span>
            </button>
            <button className="level-button available" onClick={() => startQuiz(4)}>
              <span className="level-number">4</span>
              <span className="level-name">上級編</span>
              <span className="level-progress">0/{questionStats.find(s => s.difficulty === 4)?.count || 0}</span>
            </button>
            <button className="level-button available" onClick={() => startQuiz(5)}>
              <span className="level-number">5</span>
              <span className="level-name">専門級</span>
              <span className="level-progress">0/{questionStats.find(s => s.difficulty === 5)?.count || 0}</span>
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
      </main>
    </div>
  );
};

export default Quiz;