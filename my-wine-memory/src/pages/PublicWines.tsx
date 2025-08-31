import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tastingRecordService } from '../services/tastingRecordService';
import type { PublicWineRecord } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAsyncOperation } from '../hooks/useAsyncOperation';

interface PublicRecord extends PublicWineRecord {
  userName?: string;
}

const PublicWines: React.FC = () => {
  const navigate = useNavigate();
  const [publicRecords, setPublicRecords] = useState<PublicRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<PublicRecord[]>([]);
  const [selectedWineType, setSelectedWineType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { loading, error, execute } = useAsyncOperation<PublicRecord[]>();

  useEffect(() => {
    loadPublicRecords();
  }, []);

  useEffect(() => {
    filterAndSortRecords();
  }, [publicRecords, selectedWineType, sortBy, searchTerm]);

  const loadPublicRecords = async () => {
    try {
      const records = await execute(() => 
        tastingRecordService.getAllPublicRecords(100)
      );
      if (records) {
        setPublicRecords(records);
      }
    } catch (error) {
      console.error('Failed to load public records:', error);
    }
  };

  const filterAndSortRecords = () => {
    let filtered = [...publicRecords];

    // Filter by wine type
    if (selectedWineType !== 'all') {
      filtered = filtered.filter(record => record.wineType === selectedWineType);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(record => 
        record.wineName.toLowerCase().includes(term) ||
        record.producer.toLowerCase().includes(term) ||
        record.country.toLowerCase().includes(term) ||
        record.region.toLowerCase().includes(term) ||
        (record.grapeVarieties && record.grapeVarieties.some(v => v.toLowerCase().includes(term)))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.overallRating - a.overallRating;
      } else {
        const dateA = new Date(a.tastingDate).getTime();
        const dateB = new Date(b.tastingDate).getTime();
        return dateB - dateA;
      }
    });

    setFilteredRecords(filtered);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 9) return '#FFD700'; // Gold
    if (rating >= 8) return '#FFA500'; // Orange
    if (rating >= 7) return '#90EE90'; // Light green
    if (rating >= 6) return '#87CEEB'; // Sky blue
    return '#DDA0DD'; // Plum
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

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return <LoadingSpinner message="公開記録を読み込み中..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="読み込みエラー"
        message="公開記録の読み込みに失敗しました"
        onRetry={loadPublicRecords}
      />
    );
  }

  return (
    <div className="page-container public-wines">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← ホームに戻る
        </button>
        <h1>🌐 みんなのワイン記録</h1>
        <p className="page-subtitle">世界中のワイン愛好家の記録を探索しよう</p>
      </header>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="ワイン名、生産者、国、地域、ブドウ品種で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>ワインタイプ</label>
            <select 
              value={selectedWineType} 
              onChange={(e) => setSelectedWineType(e.target.value)}
              className="filter-select"
            >
              <option value="all">すべて</option>
              <option value="red">赤ワイン</option>
              <option value="white">白ワイン</option>
              <option value="rose">ロゼ</option>
              <option value="sparkling">スパークリング</option>
              <option value="dessert">デザートワイン</option>
              <option value="fortified">フォーティファイド</option>
            </select>
          </div>

          <div className="filter-group">
            <label>並び順</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}
              className="filter-select"
            >
              <option value="date">最新順</option>
              <option value="rating">評価順</option>
            </select>
          </div>
        </div>

        <div className="results-summary">
          {filteredRecords.length}件の公開記録
        </div>
      </div>

      {/* Public Records Grid */}
      <div className="public-records-grid">
        {filteredRecords.length === 0 ? (
          <div className="empty-state">
            <p>公開記録がまだありません</p>
            <p className="empty-state-hint">
              あなたが最初の投稿者になりませんか？
            </p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/select-wine')}
            >
              ワインを記録する
            </button>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div key={record.id} className="public-wine-card">
              {/* Wine Image or Type Icon */}
              <div className="wine-visual">
                {record.images && record.images.length > 0 ? (
                  <img 
                    src={record.images[0]} 
                    alt={record.wineName}
                    className="wine-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="wine-type-icon">
                    <span className="wine-emoji">
                      {getWineTypeEmoji(record.wineType)}
                    </span>
                  </div>
                )}
              </div>

              {/* Wine Info */}
              <div className="wine-info">
                <h3 className="wine-name">{record.wineName}</h3>
                <p className="wine-producer">{record.producer}</p>
                <div className="wine-details">
                  <span className="wine-origin">
                    📍 {record.country} {record.region && `- ${record.region}`}
                  </span>
                  {record.vintage && (
                    <span className="wine-vintage">📅 {record.vintage}年</span>
                  )}
                </div>

                {/* Rating */}
                <div className="wine-rating">
                  <div 
                    className="rating-badge"
                    style={{ backgroundColor: getRatingColor(record.overallRating) }}
                  >
                    {record.overallRating.toFixed(1)}
                  </div>
                  <div className="rating-stars">
                    {'★'.repeat(Math.round(record.overallRating / 2))}
                    {'☆'.repeat(5 - Math.round(record.overallRating / 2))}
                  </div>
                </div>

                {/* Notes */}
                {record.notes && (
                  <div className="wine-notes">
                    <p className="notes-text">
                      {record.notes.length > 100 
                        ? `${record.notes.substring(0, 100)}...` 
                        : record.notes}
                    </p>
                  </div>
                )}

                {/* Grape Varieties */}
                {record.grapeVarieties && record.grapeVarieties.length > 0 && (
                  <div className="grape-varieties">
                    {record.grapeVarieties.map((variety, index) => (
                      <span key={index} className="grape-tag">
                        🍇 {variety}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="card-footer">
                  <button 
                    className="user-name-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Extract userId from the record (we need to add this to the service)
                      const userId = (record as any).userId;
                      if (userId) {
                        navigate(`/public-wines/${userId}`);
                      }
                    }}
                  >
                    👤 {record.userName || 'Wine Lover'}
                  </button>
                  <span className="tasting-date">
                    📅 {formatDate(record.tastingDate)}
                  </span>
                  <span className="record-mode">
                    {record.recordMode === 'detailed' ? '📝 詳細' : '⚡ クイック'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PublicWines;