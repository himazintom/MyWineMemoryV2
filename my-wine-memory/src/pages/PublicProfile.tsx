import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicSharingService } from '../services/userService';
import { tastingRecordService } from '../services/tastingRecordService';
import { wineMasterService } from '../services/wineMasterService';
import type { User, UserStats, WineRecord } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import WineCard from '../components/WineCard';

const PublicProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [records, setRecords] = useState<WineRecord[]>([]); // Combined WineMaster + TastingRecord
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

        // Get public tasting records
        const publicTastingRecords = await tastingRecordService.getPublicRecords(profileData.user.id);

        // Fetch WineMaster data for each record and combine
        const wineIds = publicTastingRecords.map(r => r.wineId).filter(id => id);
        const wines = await wineMasterService.getWineMastersByIds(wineIds, profileData.user.id);
        const wineMap = new Map(wines.map(w => [w.id, w]));

        const wineRecords: WineRecord[] = [];
        for (const record of publicTastingRecords) {
          const wine = wineMap.get(record.wineId);
          if (wine) {
            wineRecords.push({
              ...wine,
              recordId: record.id,
              overallRating: record.overallRating,
              tastingDate: record.tastingDate,
              recordMode: record.recordMode,
              notes: record.notes,
              images: record.images,
              isPublic: record.isPublic,
              userId: record.userId
            });
          }
        }

        setRecords(wineRecords);

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
              {records.map((record, index) => (
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