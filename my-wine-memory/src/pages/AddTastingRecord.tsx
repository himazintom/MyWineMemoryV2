import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { wineMasterService } from '../services/wineMasterService';
import { tastingRecordService } from '../services/tastingRecordService';
import { userService, goalService } from '../services/userService';
import type { WineMaster, TastingRecord } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import LoginPrompt from '../components/LoginPrompt';
import { useAsyncOperation } from '../hooks/useAsyncOperation';

const AddTastingRecord: React.FC = () => {
  const navigate = useNavigate();
  const { wineId } = useParams<{ wineId: string }>();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const [wine, setWine] = useState<WineMaster | null>(null);
  const [recordMode, setRecordMode] = useState<'quick' | 'detailed'>('quick');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);
  
  const { loading: wineLoading, error: wineError, execute: executeLoadWine } = useAsyncOperation<WineMaster | null>();
  const { loading: saveLoading, error: saveError, execute: executeSave } = useAsyncOperation<void>();

  const [formData, setFormData] = useState({
    overallRating: 5.0,
    notes: '',
    price: '',
    purchaseLocation: '',
    tastingDate: new Date().toISOString().split('T')[0],
    images: [] as File[]
  });

  // New wine data from location state (if creating new wine)
  const newWineData = location.state?.newWineData;

  useEffect(() => {
    if (wineId && wineId !== 'new') {
      loadWineData();
    } else if (newWineData) {
      // Creating new wine - set up temporary wine data
      setWine({
        id: 'new',
        ...newWineData,
        createdAt: new Date(),
        createdBy: '',
        referenceCount: 0,
        updatedAt: new Date()
      } as WineMaster);
    } else {
      navigate('/select-wine');
    }
  }, [wineId, newWineData]);

  const loadWineData = async () => {
    if (!wineId || wineId === 'new') return;
    
    try {
      const wineData = await executeLoadWine(() => wineMasterService.getWineMaster(wineId));
      setWine(wineData);
    } catch (error) {
      console.error('Failed to load wine data:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, overallRating: rating }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ 
        ...prev, 
        images: Array.from(e.target.files || []) 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setPendingSave(true);
      setShowLoginPrompt(true);
      return;
    }

    await saveTastingRecord();
  };

  const saveTastingRecord = async () => {
    if (!wine || !currentUser) return;

    try {
      await executeSave(async () => {
        let finalWineId = wine.id;

        // If creating new wine, create wine master first
        if (wine.id === 'new' && newWineData) {
          finalWineId = await wineMasterService.createOrFindWineMaster(
            {
              wineName: wine.wineName,
              producer: wine.producer,
              country: wine.country,
              region: wine.region,
              vintage: wine.vintage,
              wineType: wine.wineType,
              grapeVarieties: wine.grapeVarieties,
              alcoholContent: wine.alcoholContent
            },
            currentUser.uid
          );
        }

        // Upload images if any
        const imageUrls: string[] = [];
        for (const image of formData.images) {
          if (image) {
            const url = await tastingRecordService.uploadWineImage(image, currentUser.uid);
            imageUrls.push(url);
          }
        }

        // Create tasting record
        const tastingData: Omit<TastingRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
          wineId: finalWineId,
          overallRating: formData.overallRating,
          tastingDate: new Date(formData.tastingDate),
          recordMode,
          notes: formData.notes || undefined,
          price: formData.price ? parseFloat(formData.price) : undefined,
          purchaseLocation: formData.purchaseLocation || undefined,
          images: imageUrls.length > 0 ? imageUrls : undefined,
          isPublic: false // Default to private
        };

        await tastingRecordService.createTastingRecord(currentUser.uid, tastingData);

        // Update user stats and add XP
        await userService.updateStatsAfterWineRecord(currentUser.uid, {
          wineName: wine.wineName,
          producer: wine.producer,
          country: wine.country,
          region: wine.region,
          overallRating: formData.overallRating,
          recordMode,
          createdAt: new Date(),
          updatedAt: new Date()
        } as any);
        
        const xpToAdd = recordMode === 'detailed' ? 20 : 10;
        await userService.addXP(currentUser.uid, xpToAdd);
        
        // Update daily goal progress
        await goalService.updateGoalProgress(currentUser.uid, 'wine');
      });

      alert('テイスティング記録が保存されました！');
      navigate('/records');
    } catch (error) {
      console.error('Failed to save tasting record:', error);
    }
  };

  const handleLoginSuccess = async () => {
    setShowLoginPrompt(false);
    if (pendingSave) {
      setPendingSave(false);
      await saveTastingRecord();
    }
  };

  const isFormValid = formData.overallRating > 0;

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

  return (
    <div className="page-container">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← 戻る
        </button>
        <h1>テイスティング記録</h1>
        
        <div className="mode-toggle">
          <button 
            className={`mode-button ${recordMode === 'quick' ? 'active' : ''}`}
            onClick={() => setRecordMode('quick')}
          >
            クイック
          </button>
          <button 
            className={`mode-button ${recordMode === 'detailed' ? 'active' : ''}`}
            onClick={() => setRecordMode('detailed')}
          >
            詳細
          </button>
        </div>
      </header>
      
      <main className="add-tasting-content">
        {/* Wine Information Display */}
        <div className="selected-wine-info">
          <h2>選択されたワイン</h2>
          <div className="wine-card">
            <h3>{wine.wineName}</h3>
            <p><strong>生産者:</strong> {wine.producer}</p>
            <p><strong>産地:</strong> {wine.country} - {wine.region}</p>
            {wine.vintage && <p><strong>年:</strong> {wine.vintage}</p>}
            {wine.wineType && <p><strong>タイプ:</strong> {wine.wineType}</p>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="tasting-form">
          {/* Required Fields */}
          <div className="form-section">
            <h3>テイスティング記録 <span className="required">*必須</span></h3>
            
            <div className="form-group">
              <label htmlFor="tastingDate">テイスティング日 *</label>
              <input
                id="tastingDate"
                name="tastingDate"
                type="date"
                value={formData.tastingDate}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Rating Slider */}
            <div className="form-group">
              <label>総合評価 * ({formData.overallRating.toFixed(1)}/10)</label>
              <div className="rating-container">
                <div className="rating-slider-container">
                  <input
                    type="range"
                    className="rating-slider"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.overallRating}
                    onChange={(e) => handleRatingChange(parseFloat(e.target.value))}
                  />
                  <div className="rating-labels">
                    <span>0.0</span>
                    <span>5.0</span>
                    <span>10.0</span>
                  </div>
                </div>
                <div className="rating-display">
                  <span className="rating-value">{formData.overallRating.toFixed(1)}</span>
                  <span className="rating-scale">/10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="form-section">
            <h3>追加情報</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">購入価格（円）</label>
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
              
              <div className="form-group">
                <label htmlFor="purchaseLocation">購入場所</label>
                <input
                  id="purchaseLocation"
                  name="purchaseLocation"
                  type="text"
                  value={formData.purchaseLocation}
                  onChange={handleInputChange}
                  placeholder="例: 〇〇酒店"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">テイスティングメモ</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="香り、味わい、印象など自由に記入してください"
                rows={4}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="images">写真</label>
              <input
                id="images"
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              {formData.images.length > 0 && (
                <div className="image-preview">
                  <p>{formData.images.length}枚の画像が選択されています</p>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Mode Fields */}
          {recordMode === 'detailed' && (
            <div className="form-section">
              <h3>詳細分析</h3>
              <p className="coming-soon">詳細分析機能は今後実装予定です</p>
            </div>
          )}

          {/* Save Buttons */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate(-1)}
            >
              キャンセル
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={!isFormValid || saveLoading}
            >
              {saveLoading ? (
                <LoadingSpinner size="small" message="保存中..." />
              ) : (
                '記録を保存'
              )}
            </button>
          </div>

          {saveError && (
            <ErrorMessage
              title="保存エラー"
              message={saveError}
              onRetry={saveTastingRecord}
              showIcon={false}
            />
          )}
        </form>
      </main>
      
      <LoginPrompt
        isOpen={showLoginPrompt}
        onClose={() => {
          setShowLoginPrompt(false);
          setPendingSave(false);
        }}
        onLoginSuccess={handleLoginSuccess}
        title="記録を保存するにはログインが必要です"
        message="Googleアカウントでログインして、テイスティング記録を保存しましょう。"
      />
    </div>
  );
};

export default AddTastingRecord;