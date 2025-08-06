import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { wineService } from '../services/wineService';
import { userService, goalService } from '../services/userService';
import { useAutoSave } from '../hooks/useAutoSave';
import type { WineDraft } from '../types';

const AddWine: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [mode, setMode] = useState<'quick' | 'detailed'>('quick');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  
  const [formData, setFormData] = useState({
    wineName: '',
    producer: '',
    country: '',
    region: '',
    overallRating: 5,
    notes: '',
    vintage: '',
    price: '',
    grapeVarieties: [] as string[],
    image: null as File | null,
  });

  // Auto-save hook
  const { saveNow } = useAutoSave({
    userId: currentUser?.uid,
    formData: {
      wineName: formData.wineName,
      producer: formData.producer,
      country: formData.country,
      region: formData.region,
      overallRating: formData.overallRating,
      notes: formData.notes,
      vintage: formData.vintage ? parseInt(formData.vintage) : undefined,
      price: formData.price ? parseFloat(formData.price) : undefined,
      recordMode: mode,
      // Don't include image in auto-save for now
    },
    enabled: autoSaveEnabled,
    interval: 30000 // 30 seconds
  });

  useEffect(() => {
    // Enable auto-save after 10 seconds to avoid saving empty forms
    const timer = setTimeout(() => {
      setAutoSaveEnabled(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Load draft data if passed from navigation state
    const draftData = location.state?.draftData as WineDraft | undefined;
    if (draftData && draftData.data) {
      setFormData({
        wineName: draftData.data.wineName || '',
        producer: draftData.data.producer || '',
        country: draftData.data.country || '',
        region: draftData.data.region || '',
        overallRating: draftData.data.overallRating || 5,
        notes: draftData.data.notes || '',
        vintage: draftData.data.vintage?.toString() || '',
        price: draftData.data.price?.toString() || '',
        grapeVarieties: draftData.data.grapeVarieties || [],
        image: null, // Don't restore image from draft
      });
      if (draftData.data.recordMode) {
        setMode(draftData.data.recordMode);
      }
    }
  }, [location.state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, overallRating: rating }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('ログインが必要です');
      return;
    }

    try {
      let imageUrl = '';
      
      // Upload image if provided
      if (formData.image) {
        imageUrl = await wineService.uploadWineImage(formData.image, currentUser.uid);
      }

      // Prepare wine data
      const wineData = {
        wineName: formData.wineName,
        producer: formData.producer,
        country: formData.country,
        region: formData.region,
        overallRating: formData.overallRating,
        vintage: formData.vintage ? parseInt(formData.vintage) : undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        grapeVarieties: formData.grapeVarieties.filter(v => v.trim()),
        images: imageUrl ? [imageUrl] : [],
        recordMode: mode,
        isPublic: false,
        notes: formData.notes
      };

      // Save to Firestore
      await wineService.createWineRecord(currentUser.uid, wineData);
      
      // Update user stats and add XP
      await userService.updateStatsAfterWineRecord(currentUser.uid, wineData);
      const xpToAdd = mode === 'detailed' ? 20 : 10;
      await userService.addXP(currentUser.uid, xpToAdd);
      
      // Update daily goal progress
      await goalService.updateGoalProgress(currentUser.uid, 'wine');

      alert('ワインの記録が保存されました！');
      navigate('/records');
    } catch (error) {
      console.error('Failed to save wine record:', error);
      alert('保存に失敗しました。もう一度お試しください。');
    }
  };

  const isFormValid = formData.wineName && formData.producer && formData.country && formData.region;

  return (
    <div className="page-container">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← 戻る
        </button>
        <h1>ワインを記録する</h1>
        
        <div className="mode-toggle">
          <button 
            className={`mode-button ${mode === 'quick' ? 'active' : ''}`}
            onClick={() => setMode('quick')}
          >
            クイック
          </button>
          <button 
            className={`mode-button ${mode === 'detailed' ? 'active' : ''}`}
            onClick={() => setMode('detailed')}
          >
            詳細
          </button>
        </div>
      </header>
      
      <main className="add-wine-content">
        <form onSubmit={handleSubmit} className="wine-form">
          {/* 必須項目 */}
          <div className="form-section">
            <h3>基本情報 <span className="required">*必須</span></h3>
            
            <div className="form-group">
              <label htmlFor="wineName">ワイン名 *</label>
              <input
                id="wineName"
                name="wineName"
                type="text"
                value={formData.wineName}
                onChange={handleInputChange}
                placeholder="例: シャトー・マルゴー"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="producer">生産者 *</label>
              <input
                id="producer"
                name="producer"
                type="text"
                value={formData.producer}
                onChange={handleInputChange}
                placeholder="例: シャトー・マルゴー"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="country">生産国 *</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                >
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
                  value={formData.region}
                  onChange={handleInputChange}
                  placeholder="例: ボルドー"
                  required
                />
              </div>
            </div>
          </div>

          {/* 評価 */}
          <div className="form-section">
            <h3>総合評価 *</h3>
            <div className="rating-container">
              <div className="star-rating">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${star <= formData.overallRating ? 'active' : ''}`}
                    onClick={() => handleRatingChange(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <span className="rating-text">{formData.overallRating}/10</span>
            </div>
          </div>

          {/* 任意項目 */}
          {mode === 'quick' && (
            <div className="form-section">
              <h3>任意項目</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="vintage">ヴィンテージ</label>
                  <input
                    id="vintage"
                    name="vintage"
                    type="number"
                    value={formData.vintage}
                    onChange={handleInputChange}
                    placeholder="2020"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="price">価格（円）</label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="3000"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="notes">メモ</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="感想や気づいたことを自由に記入してください"
                  rows={4}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="image">写真</label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {formData.image && (
                  <div className="image-preview">
                    <img 
                      src={URL.createObjectURL(formData.image)} 
                      alt="Preview" 
                      className="preview-image"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 詳細モードの追加フィールド */}
          {mode === 'detailed' && (
            <div className="form-section">
              <h3>詳細分析</h3>
              <p className="coming-soon">詳細モードは今後実装予定です</p>
            </div>
          )}

          {/* 保存ボタン */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate(-1)}
            >
              キャンセル
            </button>
            <button 
              type="button" 
              className="btn-draft"
              onClick={async () => {
                const success = await saveNow();
                if (success) {
                  alert('下書きを保存しました');
                  navigate('/');
                } else {
                  alert('下書きの保存に失敗しました');
                }
              }}
              disabled={!currentUser}
            >
              下書き保存
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={!isFormValid}
            >
              記録を保存
            </button>
          </div>

          {autoSaveEnabled && (
            <div className="auto-save-indicator">
              📝 30秒ごとに自動保存されます
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default AddWine;