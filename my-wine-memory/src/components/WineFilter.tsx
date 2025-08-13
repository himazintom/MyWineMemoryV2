/**
 * Wine Filter Component
 * Advanced filtering options for wine search
 */

import React, { useState, useCallback } from 'react';
import './WineFilter.css';

export interface WineFilterOptions {
  countries: string[];
  grapeVarieties: string[];
  wineTypes: ('red' | 'white' | 'rose' | 'sparkling' | 'dessert' | 'fortified')[];
  priceRange: {
    min: number | null;
    max: number | null;
  };
  ratingRange: {
    min: number | null;
    max: number | null;
  };
  vintageRange: {
    min: number | null;
    max: number | null;
  };
  searchText: string;
}

interface WineFilterProps {
  filters: WineFilterOptions;
  onFiltersChange: (filters: WineFilterOptions) => void;
  onClearFilters: () => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  suggestions?: {
    countries: string[];
    grapeVarieties: string[];
  };
}

const WINE_TYPES = [
  { value: 'red' as const, label: '赤ワイン', color: '#722f37' },
  { value: 'white' as const, label: '白ワイン', color: '#f9f2e5' },
  { value: 'rose' as const, label: 'ロゼ', color: '#e8a4a4' },
  { value: 'sparkling' as const, label: 'スパークリング', color: '#fff9c4' },
  { value: 'dessert' as const, label: 'デザートワイン', color: '#d4a574' },
  { value: 'fortified' as const, label: '酒精強化ワイン', color: '#8b4513' }
];

const POPULAR_COUNTRIES = [
  'フランス', 'イタリア', 'スペイン', 'ドイツ', 'ポルトガル',
  'アメリカ', 'チリ', 'アルゼンチン', 'オーストラリア', 'ニュージーランド',
  '南アフリカ', '日本'
];

const POPULAR_GRAPES = [
  'カベルネ・ソーヴィニヨン', 'メルロ', 'ピノ・ノワール', 'シラー/シラーズ', 'サンジョヴェーゼ',
  'シャルドネ', 'ソーヴィニヨン・ブラン', 'リースリング', 'ピノ・グリ', 'ゲヴュルツトラミネール'
];

export const WineFilter: React.FC<WineFilterProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isExpanded,
  onToggleExpanded,
  suggestions
}) => {
  const [activeTab, setActiveTab] = useState<'type' | 'region' | 'price' | 'rating'>('type');

  const updateFilters = useCallback((updates: Partial<WineFilterOptions>) => {
    onFiltersChange({ ...filters, ...updates });
  }, [filters, onFiltersChange]);

  const toggleCountry = useCallback((country: string) => {
    const newCountries = filters.countries.includes(country)
      ? filters.countries.filter(c => c !== country)
      : [...filters.countries, country];
    updateFilters({ countries: newCountries });
  }, [filters.countries, updateFilters]);

  const toggleGrapeVariety = useCallback((grape: string) => {
    const newGrapes = filters.grapeVarieties.includes(grape)
      ? filters.grapeVarieties.filter(g => g !== grape)
      : [...filters.grapeVarieties, grape];
    updateFilters({ grapeVarieties: newGrapes });
  }, [filters.grapeVarieties, updateFilters]);

  const toggleWineType = useCallback((type: WineFilterOptions['wineTypes'][0]) => {
    const newTypes = filters.wineTypes.includes(type)
      ? filters.wineTypes.filter(t => t !== type)
      : [...filters.wineTypes, type];
    updateFilters({ wineTypes: newTypes });
  }, [filters.wineTypes, updateFilters]);

  const hasActiveFilters = filters.countries.length > 0 || 
                          filters.grapeVarieties.length > 0 || 
                          filters.wineTypes.length > 0 ||
                          filters.priceRange.min !== null || 
                          filters.priceRange.max !== null ||
                          filters.ratingRange.min !== null || 
                          filters.ratingRange.max !== null ||
                          filters.vintageRange.min !== null || 
                          filters.vintageRange.max !== null;

  const activeFilterCount = filters.countries.length + 
                           filters.grapeVarieties.length + 
                           filters.wineTypes.length +
                           (filters.priceRange.min !== null ? 1 : 0) +
                           (filters.priceRange.max !== null ? 1 : 0) +
                           (filters.ratingRange.min !== null ? 1 : 0) +
                           (filters.ratingRange.max !== null ? 1 : 0) +
                           (filters.vintageRange.min !== null ? 1 : 0) +
                           (filters.vintageRange.max !== null ? 1 : 0);

  return (
    <div className="wine-filter">
      <div className="filter-header">
        <button
          className={`filter-toggle ${isExpanded ? 'expanded' : ''}`}
          onClick={onToggleExpanded}
          aria-expanded={isExpanded}
        >
          <span className="filter-icon">🔍</span>
          <span className="filter-text">詳細検索</span>
          {activeFilterCount > 0 && (
            <span className="filter-count">{activeFilterCount}</span>
          )}
          <span className="filter-arrow">
            {isExpanded ? '▲' : '▼'}
          </span>
        </button>
        
        {hasActiveFilters && (
          <button
            className="filter-clear"
            onClick={onClearFilters}
            aria-label="フィルターをクリア"
          >
            クリア
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="filter-content">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${activeTab === 'type' ? 'active' : ''}`}
              onClick={() => setActiveTab('type')}
            >
              種類
            </button>
            <button
              className={`filter-tab ${activeTab === 'region' ? 'active' : ''}`}
              onClick={() => setActiveTab('region')}
            >
              産地・品種
            </button>
            <button
              className={`filter-tab ${activeTab === 'price' ? 'active' : ''}`}
              onClick={() => setActiveTab('price')}
            >
              価格・年代
            </button>
            <button
              className={`filter-tab ${activeTab === 'rating' ? 'active' : ''}`}
              onClick={() => setActiveTab('rating')}
            >
              評価
            </button>
          </div>

          <div className="filter-panel">
            {activeTab === 'type' && (
              <div className="filter-section">
                <h4>ワインの種類</h4>
                <div className="wine-type-grid">
                  {WINE_TYPES.map(type => (
                    <button
                      key={type.value}
                      className={`wine-type-button ${filters.wineTypes.includes(type.value) ? 'selected' : ''}`}
                      onClick={() => toggleWineType(type.value)}
                      style={{ 
                        borderColor: type.color,
                        backgroundColor: filters.wineTypes.includes(type.value) ? type.color : 'transparent'
                      }}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'region' && (
              <div className="filter-section">
                <div className="filter-subsection">
                  <h4>産地</h4>
                  <div className="filter-chips">
                    {(suggestions?.countries || POPULAR_COUNTRIES).map(country => (
                      <button
                        key={country}
                        className={`filter-chip ${filters.countries.includes(country) ? 'selected' : ''}`}
                        onClick={() => toggleCountry(country)}
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-subsection">
                  <h4>ブドウ品種</h4>
                  <div className="filter-chips">
                    {(suggestions?.grapeVarieties || POPULAR_GRAPES).map(grape => (
                      <button
                        key={grape}
                        className={`filter-chip ${filters.grapeVarieties.includes(grape) ? 'selected' : ''}`}
                        onClick={() => toggleGrapeVariety(grape)}
                      >
                        {grape}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'price' && (
              <div className="filter-section">
                <div className="filter-subsection">
                  <h4>価格帯（円）</h4>
                  <div className="range-inputs">
                    <input
                      type="number"
                      placeholder="最低価格"
                      value={filters.priceRange.min || ''}
                      onChange={(e) => updateFilters({
                        priceRange: {
                          ...filters.priceRange,
                          min: e.target.value ? parseInt(e.target.value) : null
                        }
                      })}
                    />
                    <span className="range-separator">〜</span>
                    <input
                      type="number"
                      placeholder="最高価格"
                      value={filters.priceRange.max || ''}
                      onChange={(e) => updateFilters({
                        priceRange: {
                          ...filters.priceRange,
                          max: e.target.value ? parseInt(e.target.value) : null
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="filter-subsection">
                  <h4>ヴィンテージ</h4>
                  <div className="range-inputs">
                    <input
                      type="number"
                      placeholder="開始年"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={filters.vintageRange.min || ''}
                      onChange={(e) => updateFilters({
                        vintageRange: {
                          ...filters.vintageRange,
                          min: e.target.value ? parseInt(e.target.value) : null
                        }
                      })}
                    />
                    <span className="range-separator">〜</span>
                    <input
                      type="number"
                      placeholder="終了年"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={filters.vintageRange.max || ''}
                      onChange={(e) => updateFilters({
                        vintageRange: {
                          ...filters.vintageRange,
                          max: e.target.value ? parseInt(e.target.value) : null
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rating' && (
              <div className="filter-section">
                <div className="filter-subsection">
                  <h4>評価範囲（0-10点）</h4>
                  <div className="range-inputs">
                    <input
                      type="number"
                      placeholder="最低評価"
                      min="0"
                      max="10"
                      step="0.1"
                      value={filters.ratingRange.min || ''}
                      onChange={(e) => updateFilters({
                        ratingRange: {
                          ...filters.ratingRange,
                          min: e.target.value ? parseFloat(e.target.value) : null
                        }
                      })}
                    />
                    <span className="range-separator">〜</span>
                    <input
                      type="number"
                      placeholder="最高評価"
                      min="0"
                      max="10"
                      step="0.1"
                      value={filters.ratingRange.max || ''}
                      onChange={(e) => updateFilters({
                        ratingRange: {
                          ...filters.ratingRange,
                          max: e.target.value ? parseFloat(e.target.value) : null
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};