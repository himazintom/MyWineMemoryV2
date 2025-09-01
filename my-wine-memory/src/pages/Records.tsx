import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthHooks';
import { tastingRecordService } from '../services/tastingRecordService';
import { wineMasterService } from '../services/wineMasterService';
import type { WineMaster, TastingRecord } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAsyncOperation } from '../hooks/useAsyncOperation';
// import { useOfflineSync } from '../hooks/useOfflineSync';
// import { useNetworkStatus } from '../hooks/useNetworkStatus';

interface WineWithTastings {
  wine: WineMaster;
  tastingRecords: TastingRecord[];
  latestTasting: Date;
  averageRating: number;
}

const Records: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [wineGroups, setWineGroups] = useState<WineWithTastings[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'count'>('date');
  const [filteredWineGroups, setFilteredWineGroups] = useState<WineWithTastings[]>([]);
  // const [isUsingOfflineData, setIsUsingOfflineData] = useState(false);

  const { loading, error, execute: executeLoadRecords } = useAsyncOperation<WineWithTastings[]>();
  // const { isOnline } = useNetworkStatus();
  // const { getCachedTastingRecords, getCachedWines, cacheTastingRecords, cacheWines } = useOfflineSync(currentUser?.uid);

  const loadRecords = useCallback(async () => {
    if (!currentUser) return;

    try {
      const records = await executeLoadRecords(async () => {
        // Get all user's tasting records (already filtered in service)
        const tastingRecords = await tastingRecordService.getUserTastingRecords(currentUser.uid, 'date', 1000);
        
        // Additional safety check and logging for debugging
        const validRecords = tastingRecords.filter(record => {
          const hasValidWineId = record.wineId && typeof record.wineId === 'string' && record.wineId.trim() !== '';
          if (!hasValidWineId) {
            console.error('Found record with invalid wineId in Records.tsx:', {
              recordId: record.id,
              wineId: record.wineId,
              wineName: record.wineName,
              producer: record.producer
            });
          }
          return hasValidWineId;
        });
        
        if (validRecords.length !== tastingRecords.length) {
          console.warn(`Records.tsx: Filtered out ${tastingRecords.length - validRecords.length} records with invalid wineId`);
        }
        
        // Group by wine ID
        const wineGroups = new Map<string, TastingRecord[]>();
        validRecords.forEach(record => {
          // Additional safety check before grouping
          if (record.wineId && typeof record.wineId === 'string') {
            if (!wineGroups.has(record.wineId)) {
              wineGroups.set(record.wineId, []);
            }
            wineGroups.get(record.wineId)!.push(record);
          } else {
            console.error('Skipping record with invalid wineId during grouping:', record.id);
          }
        });

        // Batch fetch wine master data for each group to avoid N+1
        const wineIds = Array.from(wineGroups.keys());
        
        // Final validation before calling getWineMastersByIds
        const safeWineIds = wineIds.filter(id => id && typeof id === 'string' && id.trim() !== '');
        if (safeWineIds.length !== wineIds.length) {
          console.error('Found invalid wineIds in group keys:', {
            original: wineIds,
            filtered: safeWineIds,
            invalid: wineIds.filter(id => !id || typeof id !== 'string' || id.trim() === '')
          });
        }
        
        if (safeWineIds.length === 0) {
          console.warn('No valid wine IDs found for fetching wine masters');
          return [];
        }
        
        const wines = await wineMasterService.getWineMastersByIds(safeWineIds, currentUser.uid);
        const wineMap = new Map<string, WineMaster>();
        wines.forEach((w) => wineMap.set(w.id, w));

        const wineWithTastings: WineWithTastings[] = [];
        for (const [wineId, records] of wineGroups.entries()) {
          const wine = wineMap.get(wineId);
          if (!wine) {
            console.warn(`Wine not found for wineId: ${wineId}`);
            continue;
          }
          const latestTasting = new Date(Math.max(...records.map(r => new Date(r.tastingDate).getTime())));
          const averageRating = records.reduce((sum, r) => sum + r.overallRating, 0) / records.length;
          wineWithTastings.push({
            wine,
            tastingRecords: records.sort((a, b) => new Date(b.tastingDate).getTime() - new Date(a.tastingDate).getTime()),
            latestTasting,
            averageRating
          });
        }

        return wineWithTastings;
      });

      setWineGroups(records || []);
    } catch (error) {
      console.error('Failed to load records:', error);
    }
  }, [currentUser, executeLoadRecords]);

  const filterAndSortRecords = useCallback(() => {
    let filtered = wineGroups;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(wineGroup => 
        wineGroup.wine.wineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wineGroup.wine.producer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wineGroup.wine.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => b.latestTasting.getTime() - a.latestTasting.getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'count':
        filtered.sort((a, b) => b.tastingRecords.length - a.tastingRecords.length);
        break;
    }

    setFilteredWineGroups(filtered);
  }, [wineGroups, searchTerm, sortBy]);

  useEffect(() => {
    if (currentUser) {
      loadRecords();
    }
  }, [currentUser, loadRecords]);

  useEffect(() => {
    filterAndSortRecords();
  }, [filterAndSortRecords]);

  const handleWineClick = (wineId: string) => {
    navigate(`/wine-detail/${wineId}`);
  };

  const handleAddTasting = (wineId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/add-tasting-record/${wineId}`);
  };

  const handleTogglePrivacy = async (record: TastingRecord, event: React.MouseEvent) => {
    event.stopPropagation();
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRatingColor = (rating: number) => {
    const successColor = getComputedStyle(document.documentElement).getPropertyValue('--success-text') || '#28a745';
    const warningColor = getComputedStyle(document.documentElement).getPropertyValue('--warning-text') || '#ffc107';
    const mutedColor = getComputedStyle(document.documentElement).getPropertyValue('--text-muted') || '#6c757d';
    
    if (rating >= 8) return successColor;
    if (rating >= 6) return warningColor;
    return mutedColor;
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
              onChange={(e) => setSortBy(e.target.value as 'date' | 'rating' | 'count')}
              className="sort-select"
            >
              <option value="date">最新記録順</option>
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
            {filteredWineGroups.map((group) => (
              <div 
                key={group.wine.id} 
                className="wine-group-card"
                onClick={() => handleWineClick(group.wine.id)}
              >
                <div className="wine-group-header">
                  <div className="wine-info">
                    <h3 className="wine-name">{group.wine.wineName}</h3>
                    <p className="wine-producer">{group.wine.producer}</p>
                    <p className="wine-location">{group.wine.country} - {group.wine.region}</p>
                    {group.wine.vintage && (
                      <p className="wine-vintage">{group.wine.vintage}年</p>
                    )}
                    {group.tastingRecords[0]?.price && group.tastingRecords[0].price > 0 && (
                      <p className="wine-price">価格: ¥{group.tastingRecords[0].price.toLocaleString()}</p>
                    )}
                    {group.tastingRecords[0]?.purchaseLocation && (
                      <p className="wine-purchase-location">購入場所: {group.tastingRecords[0].purchaseLocation}</p>
                    )}
                  </div>
                  <div className="wine-stats">
                    <div className="rating-info">
                      <span 
                        className="average-rating"
                        style={{ color: getRatingColor(group.averageRating) }}
                      >
                        {group.averageRating.toFixed(1)}/10
                      </span>
                      <span className="rating-label">平均評価</span>
                    </div>
                  </div>
                </div>

                <div className="tasting-summary">
                  <div className="tasting-count">
                    <span className="count">{group.tastingRecords.length}</span>
                    <span className="label">回記録</span>
                  </div>
                  <div className="latest-tasting">
                    <span className="date">最新: {formatDate(group.latestTasting)}</span>
                  </div>
                  <button 
                    className="add-tasting-btn"
                    onClick={(e) => handleAddTasting(group.wine.id, e)}
                    title="新しいテイスティングを追加"
                  >
                    ➕
                  </button>
                </div>

                {/* Recent Tastings Preview */}
                <div className="recent-tastings">
                  <h4>最近のテイスティング</h4>
                  <div className="tastings-preview">
                    {group.tastingRecords.slice(0, 3).map((record) => (
                      <div key={record.id} className="tasting-preview-item">
                        <div className="tasting-date">
                          {formatDate(new Date(record.tastingDate))}
                        </div>
                        <div 
                          className="tasting-rating"
                          style={{ color: getRatingColor(record.overallRating) }}
                        >
                          {record.overallRating.toFixed(1)}
                        </div>
                        <div className="tasting-mode">
                          {record.recordMode === 'quick' ? 'クイック' : '詳細'}
                        </div>
                        <button
                          className={`privacy-indicator ${record.isPublic ? 'public' : 'private'}`}
                          onClick={(e) => handleTogglePrivacy(record, e)}
                          title={record.isPublic ? '非公開にする' : '公開する'}
                        >
                          {record.isPublic ? '🌐' : '🔒'}
                        </button>
                      </div>
                    ))}
                    {group.tastingRecords.length > 3 && (
                      <div className="more-tastings">
                        +{group.tastingRecords.length - 3}件
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Records;