import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getTotalQuestionsByDifficulty } from '../data/sampleQuestions';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const questionStats = getTotalQuestionsByDifficulty();
  
  const startQuiz = (difficulty: number) => {
    navigate(`/quiz/play/${difficulty}`);
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
              <span className="level-progress">0/{questionStats[0]?.count || 0}</span>
            </button>
            <button className="level-button available" onClick={() => startQuiz(2)}>
              <span className="level-number">2</span>
              <span className="level-name">初級編</span>
              <span className="level-progress">0/{questionStats[1]?.count || 0}</span>
            </button>
            <button className="level-button available" onClick={() => startQuiz(3)}>
              <span className="level-number">3</span>
              <span className="level-name">中級編</span>
              <span className="level-progress">0/{questionStats[2]?.count || 0}</span>
            </button>
            <button className="level-button available" onClick={() => startQuiz(4)}>
              <span className="level-number">4</span>
              <span className="level-name">上級編</span>
              <span className="level-progress">0/{questionStats[3]?.count || 0}</span>
            </button>
            <button className="level-button available" onClick={() => startQuiz(5)}>
              <span className="level-number">5</span>
              <span className="level-name">専門級</span>
              <span className="level-progress">0/{questionStats[4]?.count || 0}</span>
            </button>
          </div>
        </div>
        
        <div className="quiz-modes">
          <h2>クイズモード</h2>
          <button className="mode-button">
            📚 一般クイズ
          </button>
          <button className="mode-button">
            🍷 あなたの記録クイズ
          </button>
          <button className="mode-button">
            🔄 復習クイズ
          </button>
        </div>
      </main>
    </div>
  );
};

export default Quiz;