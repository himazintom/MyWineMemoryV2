import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthHooks';
import type { TastingRecord } from '../types';
import { tastingRecordService } from '../services/tastingRecordService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import WineCard from '../components/WineCard';
import { useRecordsData } from '../hooks/useRecordsData';

const Records: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Use custom hook for records data management (replaces 5 useState + 2 useCallback + 2 useEffect)
  const {
    filteredWineGroups,
    searchTerm,
    sortBy,
    loading,
    error,
    loadRecords,
    setSearchTerm,
    setSortBy,
  } = useRecordsData(currentUser?.uid);

  const handleWineClick = (wineId: string) => {
    navigate(`/wine-detail/${wineId}`);
  };

  const handleAddTasting = (wineId: string) => {
    navigate(`/add-tasting-record/${wineId}`);
  };

  const handleTogglePrivacy = async (record?: TastingRecord) => {
    if (!record) return;

    try {
      await tastingRecordService.updateTastingRecord(record.id, {
        isPublic: !record.isPublic
      });
      await loadRecords(); // Refresh the list
      alert(record.isPublic ? '記録を非公開にしました' : '記録を公開しました');
    } catch (error) {
      console.error('Failed to toggle privacy:', error);
      alert('公開設定の変更に失敗しました');
    }
  };

  if (!currentUser) {
    return (
      <div className="page-container">
        <header className="page-header">
          <h1>記録一覧</h1>
        </header>
        <main className="records-content">
          <div className="empty-state welcome-message">
            <div className="welcome-icon">🍷</div>
            <h2>まだワインを記録していませんね</h2>
            <p>初めの一本を記録しましょう！</p>
            <p className="sub-message">ワインの記録を始めて、あなたの味覚の旅を保存しましょう。</p>
            <button 
              className="get-started-button primary"
              onClick={() => navigate('/select-wine')}
            >
              🍷 ワインを記録する
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>記録一覧</h1>
        <button 
          className="add-record-button"
          onClick={() => navigate('/select-wine')}
        >
          ➕ 新しい記録
        </button>
      </header>

      <main className="records-content">
        {/* Search and Sort Controls */}
        <div className="controls-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="ワイン名、生産者、産地で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="sort-options">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'lastUpdated' | 'registered' | 'name' | 'rating' | 'count')}
              className="sort-select"
            >
              <option value="lastUpdated">最終更新日順</option>
              <option value="registered">登録日順</option>
              <option value="name">名前順</option>
              <option value="rating">評価順</option>
              <option value="count">記録数順</option>
            </select>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && <LoadingSpinner message="記録を読み込み中..." />}
        
        {error && (
          <ErrorMessage
            title="記録の読み込みに失敗しました"
            message={error}
            onRetry={loadRecords}
          />
        )}
        {/* Records List */}
        {!loading && !error && filteredWineGroups.length === 0 && !searchTerm && (
          <div className="empty-state">
            <h2>まだ記録がありません</h2>
            <p>最初のワインを記録してみましょう！</p>
            <button 
              className="get-started-button"
              onClick={() => navigate('/select-wine')}
            >
              🍷 ワインを記録する
            </button>
          </div>
        )}

        {!loading && !error && filteredWineGroups.length === 0 && searchTerm && (
          <div className="no-results">
            <p>「{searchTerm}」に一致する記録が見つかりませんでした</p>
          </div>
        )}

        {!loading && !error && filteredWineGroups.length > 0 && (
          <div className="wine-groups-list">
            {filteredWineGroups.map((group, index) => {
              // Combine wine master data with first tasting record for display
              const latestRecord = group.tastingRecords[0];
              const combinedWineData = {
                ...group.wine,
                recordId: latestRecord.id,
                overallRating: latestRecord.overallRating,
                tastingDate: latestRecord.tastingDate,
                recordMode: latestRecord.recordMode,
                price: latestRecord.price,
                purchaseLocation: latestRecord.purchaseLocation,
                notes: latestRecord.notes,
                images: latestRecord.images,
                isPublic: latestRecord.isPublic,
                userId: latestRecord.userId
              };

              return (
                <WineCard
                  key={group.wine.id}
                  wine={combinedWineData}
                  variant="group"
                  index={index}
                  showStats={true}
                  showPrice={true}
                  showPurchaseLocation={true}
                  showPrivacyToggle={true}
                  onClick={() => handleWineClick(group.wine.id)}
                  onAddTasting={handleAddTasting}
                  onTogglePrivacy={handleTogglePrivacy}
                  groupStats={{
                    averageRating: group.averageRating,
                    recordCount: group.tastingRecords.length,
                    latestDate: group.latestTasting,
                    recentRecords: group.tastingRecords.slice(0, 3)
                  }}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Records;