import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicSharingService } from '../services/userService';
import { tastingRecordService } from '../services/tastingRecordService';
import type { User, UserStats, PublicWineRecord } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const PublicProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [records, setRecords] = useState<PublicWineRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPublicProfile = async () => {
      if (!userId) {
        setError('無効な公開URLです');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get public user profile by userId
        const profileData = await publicSharingService.getPublicUserProfileByUserId(userId);
        
        if (!profileData) {
          setError('このユーザーは見つかりませんでした、またはプロフィールが非公開です');
          setLoading(false);
          return;
        }

        setUser(profileData.user);
        setStats(profileData.stats);

        // Get public records
        const publicRecords = await tastingRecordService.getPublicRecords(profileData.user.id);
        setRecords(publicRecords);

      } catch (err) {
        console.error('Error loading public profile:', err);
        setError('プロフィールの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadPublicProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner message="プロフィールを読み込み中..." />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="page-container">
        <ErrorMessage 
          title="プロフィールが見つかりません"
          message={error || 'このユーザーは見つかりませんでした'}
          onRetry={() => navigate('/')}
          retryText="ホームに戻る"
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← ホームに戻る
        </button>
        <h1>{user.displayName}のワイン記録</h1>
      </header>

      <main className="public-profile-content">
        {/* User Info */}
        <section className="user-info-section">
          <div className="user-avatar">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} />
            ) : (
              <div className="avatar-placeholder">
                {user.displayName?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div className="user-details">
            <h2>{user.displayName}</h2>
            <p className="user-level">レベル {user.level}</p>
            {stats && (
              <div className="user-stats">
                <div className="stat-item">
                  <span className="stat-number">{stats.totalRecords}</span>
                  <span className="stat-label">記録</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{stats.averageRating.toFixed(1)}</span>
                  <span className="stat-label">平均評価</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{Object.keys(stats.countryDistribution).length}</span>
                  <span className="stat-label">国</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Wine Records */}
        <section className="records-section">
          <h3>公開中のワイン記録 ({records.length}件)</h3>
          
          {records.length === 0 ? (
            <div className="no-records">
              <p>まだ公開されているワイン記録がありません</p>
            </div>
          ) : (
            <div className="records-grid">
              {records.map((record) => (
                <div key={record.id} className="wine-record-card">
                  <div className="wine-header">
                    <h4 className="wine-name">{record.wineName}</h4>
                    <p className="wine-producer">{record.producer}</p>
                    <p className="wine-location">{record.country} - {record.region}</p>
                    {record.vintage && (
                      <p className="wine-vintage">{record.vintage}年</p>
                    )}
                  </div>
                  
                  <div className="wine-rating">
                    <span className="rating-value">{record.overallRating.toFixed(1)}</span>
                    <span className="rating-scale">/10.0</span>
                    <div className="rating-stars">
                      {'★'.repeat(Math.floor(record.overallRating / 2))}
                      {'☆'.repeat(5 - Math.floor(record.overallRating / 2))}
                    </div>
                  </div>

                  <div className="wine-meta">
                    <span className="tasting-date">
                      {new Date(record.tastingDate).toLocaleDateString('ja-JP')}
                    </span>
                    <span className="record-mode">
                      {record.recordMode === 'detailed' ? '詳細記録' : 'クイック記録'}
                    </span>
                  </div>

                  {record.notes && (
                    <div className="wine-notes">
                      <p>{record.notes}</p>
                    </div>
                  )}

                  {record.images && record.images.length > 0 && (
                    <div className="wine-images">
                      {record.images.slice(0, 3).map((imageUrl, index) => (
                        <img 
                          key={index}
                          src={imageUrl} 
                          alt={`${record.wineName} 画像 ${index + 1}`}
                          className="wine-image"
                          loading="lazy"
                        />
                      ))}
                      {record.images.length > 3 && (
                        <div className="more-images">+{record.images.length - 3}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <div className="cta-card">
            <h3>🍷 MyWineMemory</h3>
            <p>あなたもワインの記録を始めませんか？</p>
            <button 
              className="cta-button"
              onClick={() => navigate('/')}
            >
              アプリを始める
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PublicProfile;