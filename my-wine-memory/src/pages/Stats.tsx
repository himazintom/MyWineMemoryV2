import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthHooks';
import { userService } from '../services/userService';
import { badgeService } from '../services/badgeService';
import type { UserStats } from '../types';

const Stats: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [badgeCount, setBadgeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [weeklyProgress, setWeeklyProgress] = useState<number[]>([]);
  const [monthlyGrowth, setMonthlyGrowth] = useState<{rating: number, knowledge: number}>({rating: 0, knowledge: 0});


  const loadStats = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const userStats = await userService.getUserStats(currentUser.uid);
      if (userStats) {
        setStats(userStats);
      } else {
        await userService.initializeUserStats(currentUser.uid);
        const newStats = await userService.getUserStats(currentUser.uid);
        setStats(newStats);
      }

      const badges = await badgeService.getUserBadges(currentUser.uid);
      setBadgeCount(badges.length);
      
      // Calculate weekly progress (last 7 days)
      const weekData = await userService.getWeeklyProgress(currentUser.uid);
      setWeeklyProgress(weekData || [0, 0, 0, 0, 0, 0, 0]);
      
      // Calculate monthly growth
      const growth = await userService.getMonthlyGrowth(currentUser.uid);
      setMonthlyGrowth(growth || {rating: 0, knowledge: 0});
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadStats();
    } else {
      setLoading(false);
    }
  }, [currentUser, loadStats]);

  const formatAverage = (avg: number) => {
    return avg > 0 ? avg.toFixed(1) : '-';
  };

  const renderTopCountries = () => {
    if (!stats || Object.keys(stats.countryDistribution).length === 0) {
      return <p>データがありません</p>;
    }

    const sortedCountries = Object.entries(stats.countryDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return (
      <div className="top-items">
        {sortedCountries.map(([country, count]) => (
          <div key={country} className="top-item">
            <span className="item-name">{country}</span>
            <span className="item-count">{count}本</span>
            <div className="item-bar">
              <div 
                className="item-bar-fill" 
                style={{ width: `${(count / sortedCountries[0][1]) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTopVarieties = () => {
    if (!stats || Object.keys(stats.varietyDistribution).length === 0) {
      return <p>データがありません</p>;
    }

    const sortedVarieties = Object.entries(stats.varietyDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return (
      <div className="top-items">
        {sortedVarieties.map(([variety, count]) => (
          <div key={variety} className="top-item">
            <span className="item-name">{variety}</span>
            <span className="item-count">{count}本</span>
            <div className="item-bar">
              <div 
                className="item-bar-fill" 
                style={{ width: `${(count / sortedVarieties[0][1]) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div className="page-container">
        <header className="page-header">
          <h1>統計</h1>
        </header>
        <main className="stats-content">
          <p className="login-message">統計を表示するにはログインが必要です</p>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container">
        <header className="page-header">
          <h1>統計</h1>
        </header>
        <main className="stats-content">
          <p className="loading-message">読み込み中...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>統計</h1>
      </header>
      
      <main className="stats-content">
        <div className="stats-overview">
          <div className="stat-card">
            <h3>総記録数</h3>
            <span className="stat-value">{stats?.totalRecords || 0}本</span>
          </div>
          <div className="stat-card">
            <h3>現在のストリーク</h3>
            <span className="stat-value">{stats?.currentStreak || 0}日</span>
          </div>
          <div className="stat-card">
            <h3>平均評価</h3>
            <span className="stat-value">{formatAverage(stats?.averageRating || 0)}</span>
          </div>
          <div className="stat-card">
            <h3>獲得バッジ</h3>
            <span className="stat-value">{badgeCount}個</span>
          </div>
        </div>

        <div className="level-info">
          <h3>学習進捗</h3>
          <div className="level-card">
            <div className="level-display">
              <span className="level-number">レベル {userProfile?.level || 1}</span>
              <span className="xp-amount">{userProfile?.xp || 0} XP</span>
            </div>
            <div className="xp-progress">
              <div className="xp-bar">
                <div 
                  className="xp-bar-fill" 
                  style={{ width: `${((userProfile?.xp || 0) % 1000) / 10}%` }}
                ></div>
              </div>
              <span className="xp-text">次のレベルまで {1000 - ((userProfile?.xp || 0) % 1000)} XP</span>
            </div>
          </div>
        </div>
        
        <div className="personal-growth">
          <h3>個人的成長</h3>
          <div className="growth-metrics">
            <div className="growth-card">
              <h4>今週の活動</h4>
              <div className="weekly-chart">
                {['月', '火', '水', '木', '金', '土', '日'].map((day, i) => (
                  <div key={day} className="day-bar">
                    <div 
                      className="bar-fill" 
                      style={{ height: `${weeklyProgress[i] * 20}px` }}
                      title={`${weeklyProgress[i]}件`}
                    ></div>
                    <span className="day-label">{day}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="growth-card">
              <h4>今月の成長</h4>
              <div className="growth-stats">
                <div className="growth-item">
                  <span className="growth-label">評価精度</span>
                  <span className={`growth-value ${monthlyGrowth.rating > 0 ? 'positive' : ''}`}>
                    {monthlyGrowth.rating > 0 ? '+' : ''}{monthlyGrowth.rating.toFixed(1)}%
                  </span>
                </div>
                <div className="growth-item">
                  <span className="growth-label">知識スコア</span>
                  <span className={`growth-value ${monthlyGrowth.knowledge > 0 ? 'positive' : ''}`}>
                    {monthlyGrowth.knowledge > 0 ? '+' : ''}{monthlyGrowth.knowledge}pt
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="learning-insights">
          <h3>学習インサイト</h3>
          <div className="insights-grid">
            <div className="insight-card">
              <h4>テイスティング傾向</h4>
              <p>あなたは {stats?.mostCommonType || 'ワイン'} を最も多く記録しています。</p>
              <p className="insight-suggestion">異なるタイプのワインにも挑戦してみましょう。</p>
            </div>
            <div className="insight-card">
              <h4>知識の幅</h4>
              <p>{Object.keys(stats?.countryDistribution || {}).length}カ国のワインを体験済み</p>
              <p className="insight-suggestion">新しい産地のワインを探求してみましょう。</p>
            </div>
            <div className="insight-card">
              <h4>学習習慣</h4>
              <p>最長ストリーク: {stats?.longestStreak || 0}日</p>
              <p className="insight-suggestion">毎日の記録で知識を定着させましょう。</p>
            </div>
          </div>
        </div>
        
        <div className="stats-charts">
          <div className="chart-section">
            <h3>個人の好みの傾向</h3>
            <div className="preference-analysis">
              <div className="chart-content">
                <h4>国別体験（Top 5）</h4>
                {renderTopCountries()}
              </div>
              <div className="chart-content">
                <h4>品種別体験（Top 5）</h4>
                {renderTopVarieties()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Stats;