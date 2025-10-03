import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tastingRecordService } from '../services/tastingRecordService';
import { userService } from '../services/userService';
import type { PublicWineRecord, User } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import WineCard from '../components/WineCard';
import { useAsyncOperation } from '../hooks/useAsyncOperation';

interface UserPublicProfileData {
  user: Partial<User>;
  records: PublicWineRecord[];
  stats: {
    totalRecords: number;
    averageRating: number;
    favoriteCountry?: string;
    favoriteVariety?: string;
    wineTypes: { [key: string]: number };
  };
}

const UserPublicProfile: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [profileData, setProfileData] = useState<UserPublicProfileData | null>(null);
  const [selectedWineType, setSelectedWineType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  
  const { loading, error, execute } = useAsyncOperation<UserPublicProfileData>();

  useEffect(() => {
    if (userId) {
      loadUserProfile();
    }
  }, [userId]);

  const loadUserProfile = async () => {
    if (!userId) return;
    
    try {
      const data = await execute(async () => {
        // Get user info
        const user = await userService.getUserProfile(userId);
        
        // Get public records
        const records = await tastingRecordService.getPublicRecords(userId);
        
        // Calculate statistics
        const stats = calculateStats(records);
        
        return {
          user: {
            displayName: user?.displayName || 'Wine Lover',
            photoURL: user?.photoURL,
            badges: user?.badges || [],
            level: user?.level || 1,
            xp: user?.xp || 0,
            totalRecords: user?.totalRecords || 0,
            createdAt: user?.createdAt
          },
          records,
          stats
        };
      });
      
      if (data) {
        setProfileData(data);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const calculateStats = (records: PublicWineRecord[]) => {
    if (records.length === 0) {
      return {
        totalRecords: 0,
        averageRating: 0,
        wineTypes: {}
      };
    }

    // Calculate average rating
    const totalRating = records.reduce((sum, r) => sum + r.overallRating, 0);
    const averageRating = totalRating / records.length;

    // Count wine types
    const wineTypes: { [key: string]: number } = {};
    records.forEach(record => {
      const type = record.wineType || 'unknown';
      wineTypes[type] = (wineTypes[type] || 0) + 1;
    });

    // Find favorite country
    const countries: { [key: string]: number } = {};
    records.forEach(record => {
      countries[record.country] = (countries[record.country] || 0) + 1;
    });
    const favoriteCountry = Object.entries(countries)
      .sort(([, a], [, b]) => b - a)[0]?.[0];

    // Find favorite variety
    const varieties: { [key: string]: number } = {};
    records.forEach(record => {
      record.grapeVarieties?.forEach(variety => {
        varieties[variety] = (varieties[variety] || 0) + 1;
      });
    });
    const favoriteVariety = Object.entries(varieties)
      .sort(([, a], [, b]) => b - a)[0]?.[0];

    return {
      totalRecords: records.length,
      averageRating,
      favoriteCountry,
      favoriteVariety,
      wineTypes
    };
  };

  const getFilteredRecords = () => {
    if (!profileData) return [];
    
    let filtered = [...profileData.records];
    
    // Filter by wine type
    if (selectedWineType !== 'all') {
      filtered = filtered.filter(r => r.wineType === selectedWineType);
    }
    
    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.overallRating - a.overallRating;
      } else {
        return new Date(b.tastingDate).getTime() - new Date(a.tastingDate).getTime();
      }
    });
    
    return filtered;
  };

  const getWineTypeEmoji = (type?: string) => {
    switch (type) {
      case 'red': return '🍷';
      case 'white': return '🥂';
      case 'rose': return '🌹';
      case 'sparkling': return '🍾';
      case 'dessert': return '🍯';
      case 'fortified': return '🥃';
      default: return '🍷';
    }
  };

  if (loading) {
    return <LoadingSpinner message="プロフィールを読み込み中..." />;
  }

  if (error || !profileData) {
    return (
      <ErrorMessage
        title="読み込みエラー"
        message="プロフィールの読み込みに失敗しました"
        onRetry={loadUserProfile}
      />
    );
  }

  const filteredRecords = getFilteredRecords();

  return (
    <div className="page-container user-public-profile">
      <header className="profile-header">
        <button className="back-button" onClick={() => navigate('/public-wines')}>
          ← みんなのワインに戻る
        </button>
        
        {/* User Info Section */}
        <div className="user-info-section">
          <div className="user-avatar">
            {profileData.user.photoURL ? (
              <img src={profileData.user.photoURL} alt={profileData.user.displayName} />
            ) : (
              <div className="avatar-placeholder">
                {profileData.user.displayName?.charAt(0).toUpperCase() || '👤'}
              </div>
            )}
          </div>
          
          <div className="user-details">
            <h1>{profileData.user.displayName}</h1>
            <div className="user-stats-summary">
              <span className="stat-item">
                ⭐ レベル {profileData.user.level}
              </span>
              <span className="stat-item">
                📝 {profileData.stats.totalRecords}件の公開記録
              </span>
              <span className="stat-item">
                ⭐ 平均評価 {profileData.stats.averageRating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Wine Preferences */}
        <div className="wine-preferences">
          <h3>ワインの好み</h3>
          <div className="preference-tags">
            {profileData.stats.favoriteCountry && (
              <div className="preference-tag">
                <span className="tag-label">お気に入りの国</span>
                <span className="tag-value">📍 {profileData.stats.favoriteCountry}</span>
              </div>
            )}
            {profileData.stats.favoriteVariety && (
              <div className="preference-tag">
                <span className="tag-label">お気に入り品種</span>
                <span className="tag-value">🍇 {profileData.stats.favoriteVariety}</span>
              </div>
            )}
          </div>
          
          {/* Wine Type Distribution */}
          <div className="wine-type-distribution">
            {Object.entries(profileData.stats.wineTypes).map(([type, count]) => (
              <div key={type} className="type-stat">
                <span className="type-icon">{getWineTypeEmoji(type)}</span>
                <span className="type-name">
                  {type === 'red' ? '赤' :
                   type === 'white' ? '白' :
                   type === 'rose' ? 'ロゼ' :
                   type === 'sparkling' ? '泡' :
                   type === 'dessert' ? 'デザート' :
                   type === 'fortified' ? '酒精強化' : 'その他'}
                </span>
                <span className="type-count">{count}本</span>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        {profileData.user.badges && profileData.user.badges.length > 0 && (
          <div className="user-badges">
            <h3>獲得バッジ</h3>
            <div className="badge-list">
              {profileData.user.badges.map((badge, index) => (
                <div key={index} className="badge-item">
                  <span className="badge-icon">{badge.icon}</span>
                  <span className="badge-name">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Filter Controls */}
      <div className="filter-section">
        <div className="filter-controls">
          <select 
            value={selectedWineType}
            onChange={(e) => setSelectedWineType(e.target.value)}
            className="filter-select"
          >
            <option value="all">すべてのワイン</option>
            <option value="red">赤ワイン</option>
            <option value="white">白ワイン</option>
            <option value="rose">ロゼ</option>
            <option value="sparkling">スパークリング</option>
            <option value="dessert">デザートワイン</option>
            <option value="fortified">フォーティファイド</option>
          </select>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}
            className="filter-select"
          >
            <option value="date">最新順</option>
            <option value="rating">評価順</option>
          </select>
        </div>
        
        <div className="results-count">
          {filteredRecords.length}件の記録
        </div>
      </div>

      {/* Wine Records Grid */}
      <div className="user-wine-records">
        {filteredRecords.length === 0 ? (
          <div className="empty-state">
            <p>公開記録がありません</p>
          </div>
        ) : (
          <div className="wine-records-grid">
            {filteredRecords.map((record, index) => (
              <WineCard
                key={record.id}
                wine={record}
                variant="record"
                index={index}
                showImage={true}
                showRating={true}
                showDate={true}
                showRecordMode={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPublicProfile;