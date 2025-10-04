import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthHooks';
import { tastingRecordService } from '../services/tastingRecordService';
import { wineMasterService } from '../services/wineMasterService';
import type { WineMaster } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import WineCard from '../components/WineCard';
import TagInput from '../components/TagInput';
import GrapeVarietyInput from '../components/GrapeVarietyInput';
import { useAsyncOperation } from '../hooks/useAsyncOperation';
// import { useOfflineSync } from '../hooks/useOfflineSync';
// import { useNetworkStatus } from '../hooks/useNetworkStatus';

const SelectWine: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<WineMaster[]>([]);
  const [popularWines, setPopularWines] = useState<WineMaster[]>([]);
  const [showNewWineForm, setShowNewWineForm] = useState(false);
  const [grapeVarieties, setGrapeVarieties] = useState<string[]>([]);
  const [grapeVarietiesWithPercentage, setGrapeVarietiesWithPercentage] = useState<{name: string; percentage: number}[]>([]);
  const [usePercentageMode, setUsePercentageMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [, setIsUsingOfflineData] = useState(false);
  
  const { loading: searchLoading, error: searchError, execute: executeSearch } = useAsyncOperation<WineMaster[]>();
  const { loading: popularLoading, error: popularError, execute: executeLoadPopular } = useAsyncOperation<WineMaster[]>();
  // const { isOnline } = useNetworkStatus();
  // const { searchCachedWines, getCachedWines, cacheWines } = useOfflineSync(currentUser?.uid);


  const loadPopularWines = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      const wines = await executeLoadPopular(() => wineMasterService.getPopularWineMasters(currentUser.uid, 10));
      if (wines) {
        setPopularWines(wines);
        setIsUsingOfflineData(false);
      }
    } catch (error) {
      console.error('Failed to load popular wines:', error);
      setPopularWines([]);
    }
  }, [executeLoadPopular, currentUser]);

  const searchWines = useCallback(async () => {
    if (!searchTerm.trim() || !currentUser) return;

    try {
      const results = await executeSearch(() => wineMasterService.searchWineMasters(searchTerm, currentUser.uid, 20));
      if (results) {
        setSearchResults(results);
        setIsUsingOfflineData(false);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Failed to search wines:', error);
      setSearchResults([]);
    }
  }, [searchTerm, executeSearch, currentUser]);

  useEffect(() => {
    loadPopularWines();
  }, [loadPopularWines]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const timeoutId = setTimeout(() => {
        searchWines();
      }, 300); // Debounce search

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, searchWines]);

  const handleSelectWine = (wineId: string) => {
    // Navigate to add tasting record page with wine ID
    navigate(`/add-tasting-record/${wineId}`);
  };

  const handleCreateNewWine = () => {
    setShowNewWineForm(true);
    setGrapeVarieties([]); // Reset grape varieties when opening form
    setGrapeVarietiesWithPercentage([]);
    setUsePercentageMode(false);
  };

  const handleCancelNewWine = () => {
    setShowNewWineForm(false);
    setGrapeVarieties([]);
    setGrapeVarietiesWithPercentage([]);
    setUsePercentageMode(false);
    setIsSaving(false);
  };

  const handleNewWineSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Prevent double submission
    if (isSaving) return;
    
    setIsSaving(true);
    const formData = new FormData(event.currentTarget);
    
    // Format grape varieties based on mode
    const formattedGrapeVarieties = usePercentageMode && grapeVarietiesWithPercentage.length > 0
      ? grapeVarietiesWithPercentage.map(v => `${v.name} (${v.percentage}%)`)
      : grapeVarieties;
    
    const newWineDataRaw = {
      wineName: formData.get('wineName') as string,
      producer: formData.get('producer') as string,
      country: formData.get('country') as string,
      region: formData.get('region') as string,
      vintage: formData.get('vintage') ? parseInt(formData.get('vintage') as string) : undefined,
      wineType: formData.get('wineType') as 'red' | 'white' | 'rose' | 'sparkling' | 'dessert' | 'fortified' | undefined,
      grapeVarieties: formattedGrapeVarieties.length > 0 ? formattedGrapeVarieties : undefined
    };

    // Remove undefined values
    const newWineData = Object.fromEntries(
      Object.entries(newWineDataRaw).filter(([, value]) => value !== undefined)
    );

    try {
      // Need currentUser for wine creation, show login prompt if not available
      if (!currentUser) {
        alert('ワインの登録にはログインが必要です。');
        setIsSaving(false);
        return;
      }

      // First, create the wine in WineMaster
      const wineId = await wineMasterService.createOrFindWineMaster(newWineData as any, currentUser.uid);

      // Always navigate to add tasting record page with the new wine ID
      navigate(`/add-tasting-record/${wineId}`)
    } catch (error) {
      console.error('Failed to create new wine:', error);
      alert('ワインの登録に失敗しました。再度お試しください。');
    } finally {
      setIsSaving(false);
    }
  };

  const displayedWines = searchTerm.trim() ? searchResults : popularWines;
  const isLoading = searchTerm.trim() ? searchLoading : popularLoading;
  const error = searchTerm.trim() ? searchError : popularError;

  return (
    <div className="page-container">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← 戻る
        </button>
        <h1>ワインを選択</h1>
      </header>

      <main className="select-wine-content">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="ワイン名、生産者名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <button 
            className="create-new-wine-button"
            onClick={handleCreateNewWine}
          >
            📝 新しいワインを登録
          </button>
        </div>

        {/* Wine List */}
        <div className="wine-list-section">
          <h2>
            {searchTerm.trim() ? `"${searchTerm}" の検索結果` : '人気のワイン'}
          </h2>

          {error && (
            <ErrorMessage
              title="エラーが発生しました"
              message={error}
              onRetry={searchTerm.trim() ? searchWines : loadPopularWines}
            />
          )}

          {isLoading && <LoadingSpinner message="ワインを検索中..." />}

          {!isLoading && !error && displayedWines.length === 0 && searchTerm.trim() && (
            <div className="no-results">
              <p>「{searchTerm}」に一致するワインが見つかりませんでした</p>
              <p>新しいワインを登録してください</p>
            </div>
          )}
          
          {!isLoading && !error && displayedWines.length === 0 && !searchTerm.trim() && (
            <div className="empty-state">
              <div className="empty-icon">🍷</div>
              <h3>まだワインが登録されていません</h3>
              <p>最初のワインを登録して、あなたのワイン学習を始めましょう！</p>
              <button 
                className="btn-primary"
                onClick={handleCreateNewWine}
              >
                新しいワインを登録
              </button>
            </div>
          )}

          {!isLoading && !error && displayedWines.length > 0 && (
            <div className="wine-list">
              {displayedWines.map((wine, index) => (
                <WineCard
                  key={wine.id}
                  wine={wine}
                  variant="list"
                  index={index}
                  onClick={() => handleSelectWine(wine.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* New Wine Form Modal */}
        {showNewWineForm && (
          <div className="modal-backdrop">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>新しいワインを登録</h2>
                <button 
                  className="close-button"
                  onClick={() => setShowNewWineForm(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleNewWineSubmit} className="new-wine-form">
                <div className="form-group">
                  <label htmlFor="wineName">ワイン名 *</label>
                  <input
                    id="wineName"
                    name="wineName"
                    type="text"
                    required
                    placeholder="例: シャトー・マルゴー"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="producer">生産者 *</label>
                  <input
                    id="producer"
                    name="producer"
                    type="text"
                    required
                    placeholder="例: シャトー・マルゴー"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="country">生産国 *</label>
                    <select id="country" name="country" required>
                      <option value="">選択してください</option>
                      <option value="フランス">フランス</option>
                      <option value="イタリア">イタリア</option>
                      <option value="スペイン">スペイン</option>
                      <option value="ドイツ">ドイツ</option>
                      <option value="アメリカ">アメリカ</option>
                      <option value="オーストラリア">オーストラリア</option>
                      <option value="チリ">チリ</option>
                      <option value="アルゼンチン">アルゼンチン</option>
                      <option value="南アフリカ">南アフリカ</option>
                      <option value="日本">日本</option>
                      <option value="その他">その他</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="region">地域 *</label>
                    <input
                      id="region"
                      name="region"
                      type="text"
                      required
                      placeholder="例: ボルドー"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="vintage">ヴィンテージ</label>
                    <input
                      id="vintage"
                      name="vintage"
                      type="number"
                      placeholder="2020"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="wineType">ワインタイプ</label>
                    <select id="wineType" name="wineType">
                      <option value="">選択してください</option>
                      <option value="red">赤ワイン</option>
                      <option value="white">白ワイン</option>
                      <option value="rose">ロゼワイン</option>
                      <option value="sparkling">スパークリングワイン</option>
                      <option value="dessert">デザートワイン</option>
                      <option value="fortified">酒精強化ワイン</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>ブドウ品種</label>
                  <div className="variety-mode-toggle">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={usePercentageMode}
                        onChange={(e) => {
                          setUsePercentageMode(e.target.checked);
                          if (e.target.checked) {
                            // Convert simple varieties to percentage mode
                            const converted = grapeVarieties.map((name, index) => ({
                              name,
                              percentage: Math.floor(100 / grapeVarieties.length) + (index === 0 ? 100 % grapeVarieties.length : 0)
                            }));
                            setGrapeVarietiesWithPercentage(converted);
                          } else {
                            // Convert percentage varieties back to simple list
                            setGrapeVarieties(grapeVarietiesWithPercentage.map(v => v.name));
                          }
                        }}
                      />
                      <span>配合パーセンテージを設定</span>
                    </label>
                  </div>
                  {usePercentageMode ? (
                    <GrapeVarietyInput
                      value={grapeVarietiesWithPercentage}
                      onChange={setGrapeVarietiesWithPercentage}
                      placeholder="例: カベルネ・ソーヴィニヨン（Enterで追加）"
                    />
                  ) : (
                    <TagInput
                      value={grapeVarieties}
                      onChange={setGrapeVarieties}
                      placeholder="例: カベルネ・ソーヴィニヨン（Enterで追加）"
                    />
                  )}
                  <small className="field-help">Enterまたはカンマで区切って複数入力できます</small>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={handleCancelNewWine} disabled={isSaving}>
                    キャンセル
                  </button>
                  <button type="submit" className="btn-primary" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <span className="spinner-small"></span>
                        保存中...
                      </>
                    ) : (
                      '次へ（記録入力）'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SelectWine;