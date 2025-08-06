import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { wineService } from '../services/wineService';
import type { WineRecord } from '../types';
import WineCard from '../components/WineCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAsyncOperation } from '../hooks/useAsyncOperation';

const Records: React.FC = () => {
  const { currentUser } = useAuth();
  const [wines, setWines] = useState<WineRecord[]>([]);
  const [filteredWines, setFilteredWines] = useState<WineRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'name'>('date');
  const [filters, setFilters] = useState({
    country: '',
    producer: '',
    minRating: 0,
    maxRating: 10,
    minVintage: 0,
    maxVintage: new Date().getFullYear(),
    recordMode: '' as 'quick' | 'detailed' | ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const { loading, error, execute: executeLoadWines } = useAsyncOperation<WineRecord[]>();

  useEffect(() => {
    if (currentUser) {
      loadWineRecords();
    }
  }, [currentUser, sortBy]);

  useEffect(() => {
    filterWines();
  }, [wines, searchTerm, filters]);

  const loadWineRecords = async () => {
    if (!currentUser) return;
    
    try {
      const records = await executeLoadWines(() => 
        wineService.getUserWineRecords(currentUser.uid, sortBy)
      );
      setWines(records);
    } catch (error) {
      console.error('Failed to load wine records:', error);
    }
  };

  const filterWines = () => {
    let filtered = wines;

    // Text search
    if (searchTerm) {
      filtered = filtered.filter(wine => 
        wine.wineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wine.producer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wine.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wine.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Country filter
    if (filters.country) {
      filtered = filtered.filter(wine => 
        wine.country.toLowerCase() === filters.country.toLowerCase()
      );
    }

    // Producer filter
    if (filters.producer) {
      filtered = filtered.filter(wine => 
        wine.producer.toLowerCase().includes(filters.producer.toLowerCase())
      );
    }

    // Rating filter
    filtered = filtered.filter(wine => 
      wine.overallRating >= filters.minRating && 
      wine.overallRating <= filters.maxRating
    );

    // Vintage filter
    if (filters.minVintage > 0 || filters.maxVintage < new Date().getFullYear()) {
      filtered = filtered.filter(wine => {
        if (!wine.vintage) return filters.minVintage === 0;
        return wine.vintage >= filters.minVintage && wine.vintage <= filters.maxVintage;
      });
    }

    // Record mode filter
    if (filters.recordMode) {
      filtered = filtered.filter(wine => wine.recordMode === filters.recordMode);
    }

    setFilteredWines(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'date' | 'rating' | 'name');
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      country: '',
      producer: '',
      minRating: 0,
      maxRating: 10,
      minVintage: 0,
      maxVintage: new Date().getFullYear(),
      recordMode: ''
    });
    setSearchTerm('');
  };

  // Get unique values for dropdowns
  const getUniqueValues = (key: 'country' | 'producer') => {
    return [...new Set(wines.map(wine => wine[key]))].filter(Boolean).sort();
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (filters.country) count++;
    if (filters.producer) count++;
    if (filters.minRating > 0 || filters.maxRating < 10) count++;
    if (filters.minVintage > 0 || filters.maxVintage < new Date().getFullYear()) count++;
    if (filters.recordMode) count++;
    if (searchTerm) count++;
    return count;
  };

  if (!currentUser) {
    return (
      <div className="page-container">
        <header className="page-header">
          <h1>ワイン記録</h1>
        </header>
        <main className="records-content">
          <p className="login-message">記録を表示するにはログインが必要です</p>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>ワイン記録</h1>
      </header>
      
      <main className="records-content">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="ワイン名で検索..." 
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="controls-section">
          <div className="sort-options">
            <select 
              className="sort-select"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="date">登録日順</option>
              <option value="rating">評価順</option>
              <option value="name">名前順</option>
            </select>
          </div>

          <div className="filter-controls">
            <button 
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              🔍 フィルター {activeFiltersCount() > 0 && `(${activeFiltersCount()})`}
            </button>
            {activeFiltersCount() > 0 && (
              <button className="clear-filters" onClick={clearFilters}>
                ✕ クリア
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="filter-panel">
            <div className="filter-grid">
              <div className="filter-group">
                <label htmlFor="country-filter">産地</label>
                <select 
                  id="country-filter"
                  className="filter-select"
                  value={filters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                >
                  <option value="">すべての産地</option>
                  {getUniqueValues('country').map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="producer-filter">生産者</label>
                <select 
                  id="producer-filter"
                  className="filter-select"
                  value={filters.producer}
                  onChange={(e) => handleFilterChange('producer', e.target.value)}
                >
                  <option value="">すべての生産者</option>
                  {getUniqueValues('producer').map(producer => (
                    <option key={producer} value={producer}>{producer}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="rating-filter">評価</label>
                <div className="range-filter">
                  <input
                    type="range"
                    id="rating-min"
                    className="range-input"
                    min="0"
                    max="10"
                    step="0.5"
                    value={filters.minRating}
                    onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
                  />
                  <input
                    type="range"
                    id="rating-max"
                    className="range-input"
                    min="0"
                    max="10"
                    step="0.5"
                    value={filters.maxRating}
                    onChange={(e) => handleFilterChange('maxRating', parseFloat(e.target.value))}
                  />
                  <div className="range-labels">
                    <span>{filters.minRating} - {filters.maxRating}</span>
                  </div>
                </div>
              </div>

              <div className="filter-group">
                <label htmlFor="vintage-filter">ヴィンテージ</label>
                <div className="range-filter">
                  <input
                    type="number"
                    id="vintage-min"
                    className="vintage-input"
                    placeholder="開始年"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={filters.minVintage || ''}
                    onChange={(e) => handleFilterChange('minVintage', parseInt(e.target.value) || 0)}
                  />
                  <span className="range-separator">-</span>
                  <input
                    type="number"
                    id="vintage-max"
                    className="vintage-input"
                    placeholder="終了年"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={filters.maxVintage === new Date().getFullYear() ? '' : filters.maxVintage}
                    onChange={(e) => handleFilterChange('maxVintage', parseInt(e.target.value) || new Date().getFullYear())}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label htmlFor="mode-filter">記録モード</label>
                <select 
                  id="mode-filter"
                  className="filter-select"
                  value={filters.recordMode}
                  onChange={(e) => handleFilterChange('recordMode', e.target.value)}
                >
                  <option value="">すべてのモード</option>
                  <option value="quick">クイック</option>
                  <option value="detailed">詳細</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        <div className="records-list">
          {loading ? (
            <div className="page-loading">
              <LoadingSpinner message="ワイン記録を読み込み中..." />
            </div>
          ) : error ? (
            <div className="page-error">
              <ErrorMessage
                title="データの読み込みに失敗しました"
                message={error}
                onRetry={loadWineRecords}
              />
            </div>
          ) : filteredWines.length > 0 ? (
            filteredWines.map(wine => (
              <WineCard 
                key={wine.id} 
                wine={wine} 
                onClick={() => {
                  // TODO: Navigate to wine detail page
                  console.log('View wine details:', wine.id);
                }}
              />
            ))
          ) : wines.length > 0 ? (
            <p className="no-results">検索条件に一致するワインが見つかりません</p>
          ) : (
            <p className="empty-state">まだワインの記録がありません。最初の1本を記録してみましょう！</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Records;