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
          <h3>レベル情報</h3>
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
        
        <div className="stats-charts">
          <div className="chart-section">
            <h3>国別分布（Top 5）</h3>
            <div className="chart-content">
              {renderTopCountries()}
            </div>
          </div>
          
          <div className="chart-section">
            <h3>品種別分布（Top 5）</h3>
            <div className="chart-content">
              {renderTopVarieties()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Stats;