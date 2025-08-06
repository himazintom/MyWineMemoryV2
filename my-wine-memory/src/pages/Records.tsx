import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { wineService } from '../services/wineService';
import type { WineRecord } from '../types';
import WineCard from '../components/WineCard';

const Records: React.FC = () => {
  const { currentUser } = useAuth();
  const [wines, setWines] = useState<WineRecord[]>([]);
  const [filteredWines, setFilteredWines] = useState<WineRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'name'>('date');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadWineRecords();
    } else {
      setLoading(false);
    }
  }, [currentUser, sortBy]);

  useEffect(() => {
    filterWines();
  }, [wines, searchTerm]);

  const loadWineRecords = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const records = await wineService.getUserWineRecords(currentUser.uid, sortBy);
      setWines(records);
    } catch (error) {
      console.error('Failed to load wine records:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterWines = () => {
    if (!searchTerm) {
      setFilteredWines(wines);
      return;
    }

    const filtered = wines.filter(wine => 
      wine.wineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wine.producer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wine.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wine.region.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWines(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'date' | 'rating' | 'name');
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
        
        <div className="records-list">
          {loading ? (
            <p className="loading-message">読み込み中...</p>
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