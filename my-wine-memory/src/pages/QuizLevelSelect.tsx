import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthHooks';
import { QUIZ_LEVELS, loadQuestionsByLevel } from '../data/quiz';
import { 
  advancedQuizService, 
  type LevelProgress, 
  type LevelStatistics,
  type WrongAnswerHistory 
} from '../services/advancedQuizService';
import { quizProgressService } from '../services/quizProgressService';
import LoadingSpinner from '../components/LoadingSpinner';
import './QuizLevelSelect.css';

const QuizLevelSelect: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [levelProgress, setLevelProgress] = useState<LevelProgress[]>([]);
  const [levelStats, setLevelStats] = useState<Map<number, LevelStatistics>>(new Map());
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswerHistory[]>([]);
  const [hearts, setHearts] = useState(5);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [showWrongAnswers, setShowWrongAnswers] = useState(false);
  const [showMessage, setShowMessage] = useState<{type: 'error' | 'success' | 'info', text: string} | null>(null);
  const [levelQuestionCounts, setLevelQuestionCounts] = useState<Map<number, number>>(new Map());
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    loadUserData();
    
    return () => {
      isMountedRef.current = false;
    };
  }, [currentUser]);

  const loadUserData = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      // Load data in parallel for better performance
      const [progress, wrongs, userStats] = await Promise.all([
        advancedQuizService.getAllLevelProgress(currentUser.uid),
        advancedQuizService.getWrongAnswersForReview(currentUser.uid),
        quizProgressService.getUserQuizStats(currentUser.uid)
      ]);
      
      // Initialize missing levels if needed
      if (progress.length === 0) {
        const levelPromises = [];
        // Initialize all defined quiz levels
        for (const levelInfo of QUIZ_LEVELS) {
          levelPromises.push(advancedQuizService.getLevelProgress(currentUser.uid, levelInfo.level));
        }
        const levels = await Promise.all(levelPromises);
        levels.forEach(levelProg => {
          if (levelProg) progress.push(levelProg);
        });
      }
      
      setLevelProgress(progress);
      setWrongAnswers(wrongs);

      // Check question counts for each level
      const questionCounts = new Map<number, number>();
      for (const level of QUIZ_LEVELS) {
        const questions = await loadQuestionsByLevel(level.level);
        questionCounts.set(level.level, questions.length);
      }
      setLevelQuestionCounts(questionCounts);

      // Load statistics for visible levels only (defer others)
      const visibleLevels = progress.slice(0, 6); // Load first 6 levels initially
      const statsPromises = visibleLevels.map(prog => 
        advancedQuizService.getLevelStatistics(currentUser.uid, prog.level)
      );
      const statsResults = await Promise.all(statsPromises);
      
      const statsMap = new Map<number, LevelStatistics>();
      visibleLevels.forEach((prog, index) => {
        if (statsResults[index]) {
          statsMap.set(prog.level, statsResults[index]!);
        }
      });
      setLevelStats(statsMap);

      // Get current hearts
      if (userStats) {
        const recoveredHearts = await quizProgressService.recoverHearts(currentUser.uid);
        setHearts(recoveredHearts);
      }
      
      // Load remaining statistics in background
      if (progress.length > 6) {
        const remainingLevels = progress.slice(6);
        const remainingStatsPromises = remainingLevels.map(prog => 
          advancedQuizService.getLevelStatistics(currentUser.uid, prog.level)
        );
        Promise.all(remainingStatsPromises).then(remainingStats => {
          // Check if component is still mounted before updating state
          if (isMountedRef.current) {
            const updatedStatsMap = new Map(statsMap);
            remainingLevels.forEach((prog, index) => {
              if (remainingStats[index]) {
                updatedStatsMap.set(prog.level, remainingStats[index]!);
              }
            });
            setLevelStats(updatedStatsMap);
          }
        }).catch(error => {
          if (isMountedRef.current) {
            console.error('Failed to load remaining stats:', error);
          }
        });
      }
    } catch (error) {
      console.error('Failed to load quiz data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (level: number) => {
    if (!currentUser) {
      setShowMessage({type: 'error', text: 'ログインが必要です'});
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
      return;
    }

    if (hearts <= 0) {
      setShowMessage({type: 'error', text: 'ハートがありません。時間を置いてから再度挑戦してください。'});
      setTimeout(() => setShowMessage(null), 3000);
      return;
    }

    navigate(`/quiz/play/${level}`);
  };

  const unlockLevel = async (level: number) => {
    if (!currentUser) return;

    const unlocked = await advancedQuizService.unlockLevel(currentUser.uid, level);
    if (unlocked) {
      await loadUserData();
      setShowMessage({type: 'success', text: `レベル${level}がアンロックされました！`});
    } else {
      setShowMessage({type: 'error', text: 'アンロック条件を満たしていません'});
    }
    setTimeout(() => setShowMessage(null), 3000);
  };

  const resetLevel = async (level: number) => {
    if (!currentUser) return;
    
    if (confirm(`レベル${level}の進捗をリセットしますか？`)) {
      await advancedQuizService.resetLevel(currentUser.uid, level);
      await loadUserData();
    }
  };

  const getModeDisplay = (progress: LevelProgress) => {
    switch (progress.mode) {
      case 'FIRST_ROUND':
        return { label: '初回挑戦', className: 'first-round', icon: '🎯' };
      case 'REVIEW_MODE':
        return { label: '復習モード', className: 'review', icon: '📝' };
      case 'MASTER_MODE':
        return { label: 'マスター', className: 'master', icon: '⭐' };
    }
  };

  const getProgressBarSegments = (progress: LevelProgress) => {
    const total = progress.totalQuestions;
    const clearedPercent = (progress.clearedQuestions.length / total) * 100;
    const wrongPercent = (progress.wrongQuestions.length / total) * 100;
    const unsolvedPercent = (progress.unsolvedQuestions.length / total) * 100;

    return { clearedPercent, wrongPercent, unsolvedPercent };
  };

  const canUnlock = (level: number): boolean => {
    if (level === 1) return false;
    const previousProgress = levelProgress.find(p => p.level === level - 1);
    return previousProgress ? previousProgress.completionRate >= 70 : false;
  };

  if (loading) {
    return <LoadingSpinner message="クイズデータを読み込み中..." />;
  }

  return (
    <div className="quiz-level-select">
      {showMessage && (
        <div className={`message-toast message-${showMessage.type}`}>
          {showMessage.text}
        </div>
      )}
      <div className="quiz-header">
        <h1>クイズレベル選択</h1>
        <div className="hearts-display">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < hearts ? 'heart filled' : 'heart empty'}>
              {i < hearts ? '❤️' : '🤍'}
            </span>
          ))}
          <span className="heart-timer">
            {hearts < 5 && '次の回復まで: 60分'}
          </span>
        </div>
      </div>

      {/* Wrong Answers Review Section */}
      {wrongAnswers.length > 0 && (
        <div className="review-section">
          <h2>
            復習が必要な問題
            <span className="review-count">{wrongAnswers.length}問</span>
          </h2>
          <button 
            className="btn-review"
            onClick={() => setShowWrongAnswers(!showWrongAnswers)}
          >
            {showWrongAnswers ? '隠す' : '詳細を見る'}
          </button>
          
          {showWrongAnswers && (
            <div className="wrong-answers-list">
              {wrongAnswers.map((wrong) => (
                <div key={wrong.id} className="wrong-answer-item">
                  <span className="level-badge">Lv.{wrong.level}</span>
                  <span className="wrong-count">間違い: {wrong.totalWrongCount}回</span>
                  <span className="difficulty-score">
                    難易度: {wrong.difficultyScore}%
                  </span>
                  <button 
                    className="btn-review-now"
                    onClick={() => startQuiz(wrong.level)}
                  >
                    復習する
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Level Grid */}
      <div className="level-grid">
        {QUIZ_LEVELS.filter((levelInfo) => {
          // Filter out levels with 0 questions
          const questionCount = levelQuestionCounts.get(levelInfo.level) || 0;
          return questionCount > 0;
        }).map((levelInfo) => {
          const progress = levelProgress.find(p => p.level === levelInfo.level) || {
            userId: currentUser?.uid || '',
            level: levelInfo.level,
            mode: 'FIRST_ROUND' as const,
            rounds: 0,
            totalQuestions: 100,
            clearedQuestions: [],
            unsolvedQuestions: [],
            wrongQuestions: [],
            completionRate: 0,
            isUnlocked: true, // All levels are unlocked
            perfectClearCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
          } as LevelProgress;
          
          const stats = levelStats.get(levelInfo.level);
          const mode = getModeDisplay(progress);
          const { clearedPercent, wrongPercent, unsolvedPercent } = getProgressBarSegments(progress);
          const isLocked = false; // All levels are always unlocked
          const canUnlockNow = canUnlock(levelInfo.level);

          return (
            <div 
              key={levelInfo.level}
              className={`level-card ${isLocked ? 'locked' : ''} ${
                selectedLevel === levelInfo.level ? 'selected' : ''
              }`}
              onClick={() => !isLocked && setSelectedLevel(
                selectedLevel === levelInfo.level ? null : levelInfo.level
              )}
            >
              {/* Level Header */}
              <div className="level-header">
                <div className="level-number">Lv.{levelInfo.level}</div>
                {!isLocked && (
                  <div className={`mode-badge ${mode.className}`}>
                    {mode.icon} {mode.label}
                  </div>
                )}
              </div>

              {/* Level Info */}
              <h3 className="level-name">{levelInfo.name}</h3>
              <p className="level-description">{levelInfo.description}</p>

              {isLocked ? (
                <div className="lock-section">
                  <div className="lock-icon">🔒</div>
                  <p className="lock-reason">
                    レベル{levelInfo.level - 1}を70%以上クリアで解放
                  </p>
                  {canUnlockNow && (
                    <button 
                      className="btn-unlock"
                      onClick={(e) => {
                        e.stopPropagation();
                        unlockLevel(levelInfo.level);
                      }}
                    >
                      アンロック
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Progress Bar */}
                  <div className="progress-section">
                    <div className="progress-bar">
                      <div 
                        className="progress-segment cleared"
                        style={{ width: `${clearedPercent}%` }}
                        title={`クリア: ${progress.clearedQuestions.length}問`}
                      />
                      <div 
                        className="progress-segment wrong"
                        style={{ width: `${wrongPercent}%`, left: `${clearedPercent}%` }}
                        title={`間違い: ${progress.wrongQuestions.length}問`}
                      />
                      <div 
                        className="progress-segment unsolved"
                        style={{ 
                          width: `${unsolvedPercent}%`, 
                          left: `${clearedPercent + wrongPercent}%` 
                        }}
                        title={`未解答: ${progress.unsolvedQuestions.length}問`}
                      />
                    </div>
                    <div className="progress-text">
                      {progress.completionRate}% 完了
                    </div>
                  </div>

                  {/* Question Stats */}
                  <div className="question-stats">
                    <span className="stat cleared">
                      ✓ {progress.clearedQuestions.length}
                    </span>
                    <span className="stat wrong">
                      ✗ {progress.wrongQuestions.length}
                    </span>
                    <span className="stat unsolved">
                      ? {progress.unsolvedQuestions.length}
                    </span>
                  </div>

                  {/* Statistics (if expanded) */}
                  {selectedLevel === levelInfo.level && stats && (
                    <div className="level-statistics">
                      <div className="stat-item">
                        <span className="stat-label">平均正答率</span>
                        <span className="stat-value">{stats.averageAccuracy}%</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">最高ストリーク</span>
                        <span className="stat-value">{stats.bestStreak}問</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">総回答数</span>
                        <span className="stat-value">{stats.totalQuestionsAnswered}問</span>
                      </div>
                      {progress.perfectClearCount > 0 && (
                        <div className="stat-item">
                          <span className="stat-label">完全制覇</span>
                          <span className="stat-value">{progress.perfectClearCount}回</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="level-actions">
                    <button 
                      className="btn-start"
                      onClick={(e) => {
                        e.stopPropagation();
                        startQuiz(levelInfo.level);
                      }}
                    >
                      挑戦する
                    </button>
                    
                    {progress.rounds > 0 && (
                      <button 
                        className="btn-reset"
                        onClick={(e) => {
                          e.stopPropagation();
                          resetLevel(levelInfo.level);
                        }}
                      >
                        リセット
                      </button>
                    )}
                  </div>

                  {/* Perfect Clear Badge */}
                  {progress.mode === 'MASTER_MODE' && (
                    <div className="perfect-clear-badge">
                      🏆 パーフェクトクリア達成！
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Challenge Modes (for completed levels) */}
      {levelProgress.some(p => p.mode === 'MASTER_MODE') && (
        <div className="challenge-section">
          <h2>チャレンジモード</h2>
          <div className="challenge-modes">
            <button className="challenge-mode time-attack">
              ⏱️ タイムアタック
            </button>
            <button className="challenge-mode perfect-run">
              💯 パーフェクトラン
            </button>
            <button className="challenge-mode random-100">
              🎲 ランダム100
            </button>
            <button className="challenge-mode blind-test">
              🙈 ブラインドテスト
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizLevelSelect;