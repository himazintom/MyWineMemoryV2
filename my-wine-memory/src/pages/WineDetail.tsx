import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthHooks';
import { wineMasterService } from '../services/wineMasterService';
import { tastingRecordService } from '../services/tastingRecordService';
import type { WineMaster, TastingRecord } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import TastingAnalysisCharts from '../components/TastingAnalysisCharts';
import { useAsyncOperation } from '../hooks/useAsyncOperation';

const WineDetail: React.FC = () => {
  const navigate = useNavigate();
  const { wineId } = useParams<{ wineId: string }>();
  const { currentUser } = useAuth();
  
  const [wine, setWine] = useState<WineMaster | null>(null);
  const [tastingRecords, setTastingRecords] = useState<TastingRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<TastingRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'analysis'>('overview');
  
  const { loading: wineLoading, error: wineError, execute: executeLoadWine } = useAsyncOperation<WineMaster | null>();
  const { loading: recordsLoading, error: recordsError, execute: executeLoadRecords } = useAsyncOperation<TastingRecord[]>();

  const loadWineData = useCallback(async () => {
    if (!wineId) return;
    
    try {
      const wineData = await executeLoadWine(() => wineMasterService.getWineMaster(wineId));
      setWine(wineData);
    } catch (error) {
      console.error('Failed to load wine data:', error);
    }
  }, [wineId, executeLoadWine]);

  const loadTastingRecords = useCallback(async () => {
    if (!wineId || !currentUser) return;
    
    try {
      const records = await executeLoadRecords(() => 
        tastingRecordService.getTastingRecordsForWine(currentUser.uid, wineId, 100)
      );
      setTastingRecords(records);
    } catch (error) {
      console.error('Failed to load tasting records:', error);
    }
  }, [wineId, currentUser, executeLoadRecords]);

  useEffect(() => {
    if (wineId) {
      loadWineData();
      if (currentUser) {
        loadTastingRecords();
      }
    }
  }, [wineId, currentUser, loadWineData, loadTastingRecords]);

  const handleAddTasting = () => {
    if (wineId) {
      navigate(`/add-tasting-record/${wineId}`);
    }
  };

  const handleEditRecord = (recordId: string) => {
    navigate(`/edit-tasting-record/${recordId}`);
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!window.confirm('この記録を削除してもよろしいですか？')) return;
    
    try {
      await tastingRecordService.deleteTastingRecord(recordId);
      await loadTastingRecords(); // Refresh the list
      alert('記録を削除しました');
    } catch (error) {
      console.error('Failed to delete record:', error);
      alert('削除に失敗しました');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return '#28a745';
    if (rating >= 6) return '#ffc107';
    return '#6c757d';
  };

  const calculateAverageRating = () => {
    if (tastingRecords.length === 0) return 0;
    return tastingRecords.reduce((sum, record) => sum + record.overallRating, 0) / tastingRecords.length;
  };

  const getDetailedRecords = () => {
    return tastingRecords.filter(record => record.detailedAnalysis);
  };

  const hasDetailedAnalysis = () => {
    return getDetailedRecords().length > 0;
  };

  if (wineLoading) {
    return (
      <div className="page-container">
        <LoadingSpinner size="large" message="ワイン情報を読み込み中..." />
      </div>
    );
  }

  if (wineError || !wine) {
    return (
      <div className="page-container">
        <ErrorMessage
          title="ワイン情報の読み込みに失敗しました"
          message={wineError || 'ワイン情報が見つかりませんでした'}
          onRetry={loadWineData}
        />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="page-container">
        <div className="login-message">
          <h2>ログインが必要です</h2>
          <p>記録を確認するには、Googleアカウントでログインしてください。</p>
          <button 
            className="google-signin-button"
            onClick={() => navigate('/')}
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  const averageRating = calculateAverageRating();

  return (
    <div className="page-container">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← 戻る
        </button>
        <h1>ワイン詳細</h1>
        <button 
          className="add-tasting-button"
          onClick={handleAddTasting}
        >
          ➕ 新しい記録
        </button>
      </header>

      <main className="wine-detail-content">
        {/* Wine Information */}
        <div className="wine-info-section">
          <div className="wine-header">
            <h2>{wine.wineName}</h2>
            <p className="wine-producer">{wine.producer}</p>
            <p className="wine-location">{wine.country} - {wine.region}</p>
            {wine.vintage && <p className="wine-vintage">{wine.vintage}年</p>}
            {wine.wineType && (
              <span className="wine-type-badge">
                {wine.wineType === 'red' ? '赤ワイン' :
                 wine.wineType === 'white' ? '白ワイン' :
                 wine.wineType === 'rose' ? 'ロゼワイン' :
                 wine.wineType === 'sparkling' ? 'スパークリングワイン' :
                 wine.wineType === 'dessert' ? 'デザートワイン' :
                 wine.wineType === 'fortified' ? '酒精強化ワイン' :
                 wine.wineType}
              </span>
            )}
          </div>

          {/* Wine Details */}
          <div className="wine-details">
            {wine.grapeVarieties && wine.grapeVarieties.length > 0 && (
              <div className="detail-item">
                <strong>ブドウ品種:</strong> {wine.grapeVarieties.join(', ')}
              </div>
            )}
            {wine.alcoholContent && (
              <div className="detail-item">
                <strong>アルコール度数:</strong> {wine.alcoholContent}%
              </div>
            )}
            {wine.winemaker && (
              <div className="detail-item">
                <strong>ワインメーカー:</strong> {wine.winemaker}
              </div>
            )}
            <div className="detail-item">
              <strong>参照数:</strong> {wine.referenceCount}人が記録
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            概要
          </button>
          <button 
            className={`tab-button ${activeTab === 'records' ? 'active' : ''}`}
            onClick={() => setActiveTab('records')}
          >
            記録一覧 ({tastingRecords.length})
          </button>
          {hasDetailedAnalysis() && (
            <button 
              className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
              onClick={() => setActiveTab('analysis')}
            >
              詳細分析 ({getDetailedRecords().length})
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            {/* Tasting Statistics */}
            {tastingRecords.length > 0 && (
              <div className="tasting-stats-section">
                <h3>あなたのテイスティング統計</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">{tastingRecords.length}</div>
                    <div className="stat-label">記録数</div>
                  </div>
                  <div className="stat-card">
                    <div 
                      className="stat-value"
                      style={{ color: getRatingColor(averageRating) }}
                    >
                      {averageRating.toFixed(1)}
                    </div>
                    <div className="stat-label">平均評価</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {Math.max(...tastingRecords.map(r => r.overallRating)).toFixed(1)}
                    </div>
                    <div className="stat-label">最高評価</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {formatDate(new Date(Math.max(...tastingRecords.map(r => r.tastingDate.getTime()))))}
                    </div>
                    <div className="stat-label">最新記録</div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Records Summary */}
            {tastingRecords.length > 0 && (
              <div className="recent-records-section">
                <h3>最新の記録</h3>
                <div className="recent-records-list">
                  {tastingRecords.slice(0, 3).map((record) => (
                    <div key={record.id} className="recent-record-item">
                      <div className="recent-record-date">
                        {formatDate(record.tastingDate)}
                      </div>
                      <div 
                        className="recent-record-rating"
                        style={{ color: getRatingColor(record.overallRating) }}
                      >
                        {record.overallRating.toFixed(1)}/10
                      </div>
                      <div className="recent-record-mode">
                        {record.recordMode === 'quick' ? 'クイック' : '詳細'}
                      </div>
                    </div>
                  ))}
                </div>
                {tastingRecords.length > 3 && (
                  <button 
                    className="view-all-records-button"
                    onClick={() => setActiveTab('records')}
                  >
                    全ての記録を見る ({tastingRecords.length}件)
                  </button>
                )}
              </div>
            )}

            {tastingRecords.length === 0 && (
              <div className="no-records">
                <p>まだこのワインの記録がありません</p>
                <button 
                  className="add-first-record-button"
                  onClick={handleAddTasting}
                >
                  🍷 最初の記録を追加
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'records' && (
          <div className="tab-content">
            <div className="tasting-records-section">
              <h3>テイスティング記録一覧</h3>
              
              {recordsLoading && <LoadingSpinner message="記録を読み込み中..." />}
              
              {recordsError && (
                <ErrorMessage
                  title="記録の読み込みに失敗しました"
                  message={recordsError}
                  onRetry={loadTastingRecords}
                />
              )}

              {!recordsLoading && !recordsError && tastingRecords.length > 0 && (
                <div className="records-list">
                  {tastingRecords.map((record) => (
                    <div 
                      key={record.id} 
                      className="tasting-record-card"
                      onClick={() => setSelectedRecord(selectedRecord?.id === record.id ? null : record)}
                    >
                      <div className="record-header">
                        <div className="record-date">
                          {formatDate(record.tastingDate)}
                        </div>
                        <div 
                          className="record-rating"
                          style={{ color: getRatingColor(record.overallRating) }}
                        >
                          {record.overallRating.toFixed(1)}/10
                        </div>
                        <div className="record-mode-badge">
                          {record.recordMode === 'quick' ? 'クイック' : '詳細'}
                        </div>
                      </div>

                      {selectedRecord?.id === record.id && (
                        <div className="record-details">
                          {record.notes && (
                            <div className="detail-section">
                              <h4>テイスティングメモ</h4>
                              <p>{record.notes}</p>
                            </div>
                          )}
                          
                          {record.price && (
                            <div className="detail-section">
                              <h4>購入価格</h4>
                              <p>¥{record.price.toLocaleString()}</p>
                            </div>
                          )}
                          
                          {record.purchaseLocation && (
                            <div className="detail-section">
                              <h4>購入場所</h4>
                              <p>{record.purchaseLocation}</p>
                            </div>
                          )}

                          {record.images && record.images.length > 0 && (
                            <div className="detail-section">
                              <h4>写真</h4>
                              <div className="record-images">
                                {record.images.map((imageUrl, index) => (
                                  <img 
                                    key={index}
                                    src={imageUrl} 
                                    alt={`テイスティング写真 ${index + 1}`}
                                    className="record-image"
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="record-actions">
                            <button 
                              className="edit-record-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditRecord(record.id);
                              }}
                            >
                              ✏️ 編集
                            </button>
                            <button 
                              className="delete-record-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRecord(record.id);
                              }}
                            >
                              🗑️ 削除
                            </button>
                            {record.detailedAnalysis && (
                              <button 
                                className="view-analysis-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRecord(record);
                                  setActiveTab('analysis');
                                }}
                              >
                                📊 詳細分析を見る
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="tab-content">
            <div className="analysis-section">
              <h3>詳細分析</h3>
              
              {getDetailedRecords().length === 0 ? (
                <div className="no-detailed-analysis">
                  <p>詳細モードで記録されたテイスティングデータがありません</p>
                  <p>詳細モードで新しい記録を追加すると、グラフによる分析が表示されます。</p>
                  <button 
                    className="add-detailed-record-button"
                    onClick={handleAddTasting}
                  >
                    詳細記録を追加
                  </button>
                </div>
              ) : (
                <div className="detailed-analysis-container">
                  {/* Record Selector for Analysis */}
                  {getDetailedRecords().length > 1 && (
                    <div className="analysis-record-selector">
                      <label htmlFor="analysis-record-select">分析する記録を選択:</label>
                      <select 
                        id="analysis-record-select"
                        value={selectedRecord?.id || getDetailedRecords()[0].id}
                        onChange={(e) => {
                          const record = getDetailedRecords().find(r => r.id === e.target.value);
                          setSelectedRecord(record || null);
                        }}
                      >
                        {getDetailedRecords().map((record) => (
                          <option key={record.id} value={record.id}>
                            {formatDate(record.tastingDate)} - 評価: {record.overallRating.toFixed(1)}/10
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Analysis Charts */}
                  <TastingAnalysisCharts 
                    record={selectedRecord || getDetailedRecords()[0]} 
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WineDetail;