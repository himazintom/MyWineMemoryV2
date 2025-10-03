import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthHooks';
import { tastingRecordService } from '../services/tastingRecordService';
import { wineMasterService } from '../services/wineMasterService';
import { userService, goalService } from '../services/userService';
import { learningInsightService, type LearningInsight } from '../services/learningInsightService';
import type { WineMaster } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import LoginPrompt from '../components/LoginPrompt';
import WineCard from '../components/WineCard';
import DrawingCanvas from '../components/DrawingCanvas';
import { useAsyncOperation } from '../hooks/useAsyncOperation';
// import { useOfflineSync } from '../hooks/useOfflineSync';
// import { useNetworkStatus } from '../hooks/useNetworkStatus';
// import { useError } from '../contexts/ErrorContext';

const AddTastingRecord: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { wineId } = useParams<{ wineId: string }>();
  const { currentUser } = useAuth();
  
  // Wine state
  const [wine, setWine] = useState<WineMaster | null>(null);
  
  const [recordMode, setRecordMode] = useState<'quick' | 'detailed'>('quick');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [learningInsight, setLearningInsight] = useState<LearningInsight | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  // const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  
  const { loading: wineLoading, error: wineError, execute: executeLoadWine } = useAsyncOperation<WineMaster | null>();
  const { loading: saveLoading, error: saveError, execute: executeSave } = useAsyncOperation<void>();
  // const { isOnline } = useNetworkStatus();
  // const { saveDraft, updateDraft, queueOfflineOperation, getCachedWines } = useOfflineSync(currentUser?.uid);
  // const { handleError } = useError();

  const [formData, setFormData] = useState({
    overallRating: 5.0,
    notes: '',
    tastingDate: new Date().toISOString().split('T')[0],
    images: [] as File[],
    drawingDataUrl: '' as string,
    // Detailed analysis fields
    visualAnalysis: {
      color: '',
      clarity: '',
      viscosity: ''
    },
    aromaAnalysis: {
      firstImpression: '',
      afterSwirling: '',
      aromaIntensity: 5,
      aromaCategories: [] as string[]
    },
    tasteAnalysis: {
      attack: '',
      development: '',
      finish: '',
      finishLength: 5
    },
    componentAnalysis: {
      acidity: 5,
      tannins: 5,
      sweetness: 5,
      body: 5,
      alcohol: 5
    },
    environmentalFactors: {
      temperature: '',
      glassware: '',
      decantingTime: ''
    },
    foodPairings: '',
    personalNotes: '',
    referenceUrls: [] as string[],
    purchaseLocation: '',
    price: undefined as number | undefined,
    isPublic: false
  });

  // New wine data from location state (if creating new wine)
  const newWineData = location.state?.newWineData;

  const loadWineData = useCallback(async () => {
    if (!wineId || wineId === 'new' || !currentUser) return;
    
    try {
      const wineData = await executeLoadWine(() => wineMasterService.getWineMaster(wineId, currentUser.uid));
      setWine(wineData);
    } catch (error) {
      console.error('Failed to load wine data:', error);
    }
  }, [wineId, currentUser, executeLoadWine]);

  useEffect(() => {
    if (wineId) {
      loadWineData();
    } else if (!wineId) {
      // No wine selected, navigate back to select wine
      navigate('/select-wine');
    }
  }, [wineId, loadWineData, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedInputChange = (section: string, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as Record<string, unknown>),
        [field]: value
      }
    }));
  };

  const handleAromaCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      aromaAnalysis: {
        ...prev.aromaAnalysis,
        aromaCategories: prev.aromaAnalysis.aromaCategories.includes(category)
          ? prev.aromaAnalysis.aromaCategories.filter(c => c !== category)
          : [...prev.aromaAnalysis.aromaCategories, category]
      }
    }));
  };

  const addReferenceUrl = () => {
    setFormData(prev => ({
      ...prev,
      referenceUrls: [...prev.referenceUrls, '']
    }));
  };

  const updateReferenceUrl = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      referenceUrls: prev.referenceUrls.map((url, i) => i === index ? value : url)
    }));
  };

  const removeReferenceUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      referenceUrls: prev.referenceUrls.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles: File[] = [];
    const maxFiles = 4;
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (formData.images.length + newFiles.length >= maxFiles) {
        alert(`最大${maxFiles}枚まで登録できます`);
        break;
      }
      
      if (file.size > maxFileSize) {
        alert(`ファイルサイズが大きすぎます（最大5MB）: ${file.name}`);
        continue;
      }
      
      if (!file.type.startsWith('image/')) {
        alert(`画像ファイルのみアップロードできます: ${file.name}`);
        continue;
      }
      
      newFiles.push(file);
    }
    
    if (newFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleDrawingSave = (dataUrl: string) => {
    setFormData(prev => ({
      ...prev,
      drawingDataUrl: dataUrl
    }));
  };

  const clearDrawing = () => {
    setFormData(prev => ({
      ...prev,
      drawingDataUrl: ''
    }));
  };


  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, overallRating: rating }));
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

        // Upload images if any (including drawing)
        const imageUrls: string[] = [];
        try {
          // Upload regular images
          for (const image of formData.images) {
            if (image) {
              // Check file size (max 5MB)
              if (image.size > 5 * 1024 * 1024) {
                console.warn(`Image ${image.name} is too large (${(image.size / 1024 / 1024).toFixed(2)}MB), skipping`);
                continue;
              }
              
              const url = await tastingRecordService.uploadWineImage(image, currentUser.uid);
              imageUrls.push(url);
            }
          }

          // Upload drawing if exists
          if (formData.drawingDataUrl) {
            try {
              // Convert base64 to File object
              const response = await fetch(formData.drawingDataUrl);
              const blob = await response.blob();
              const drawingFile = new File([blob], `sketch-${Date.now()}.png`, { type: 'image/png' });
              
              const drawingUrl = await tastingRecordService.uploadWineImage(drawingFile, currentUser.uid);
              imageUrls.push(drawingUrl);
            } catch (drawingError) {
              console.warn('Failed to upload drawing, proceeding without it:', drawingError);
            }
          }
        } catch (imageError) {
          console.warn('Failed to upload some images, proceeding without them:', imageError);
          // Continue with record creation even if image upload fails
        }

        // Helper function to remove undefined values
        const removeUndefined = <T extends Record<string, unknown>>(obj: T): T => {
          const cleaned = { ...obj };
          Object.keys(cleaned).forEach(key => {
            if (cleaned[key] === undefined) {
              delete cleaned[key];
            } else if (cleaned[key] && typeof cleaned[key] === 'object' && !Array.isArray(cleaned[key])) {
              (cleaned as Record<string, unknown>)[key] = removeUndefined(cleaned[key] as Record<string, unknown>);
            }
          });
          return cleaned;
        };

        // Create tasting record (before cleaning)
        const tastingDataRaw = {
          wineId: finalWineId,
          wineName: wine.wineName,
          producer: wine.producer,
          country: wine.country,
          region: wine.region,
          vintage: wine.vintage,
          grapeVarieties: wine.grapeVarieties,
          wineType: wine.wineType,
          alcoholContent: wine.alcoholContent,
          overallRating: formData.overallRating,
          tastingDate: formData.tastingDate,
          recordMode,
          notes: formData.notes || undefined,
          price: formData.price,
          purchaseLocation: formData.purchaseLocation || undefined,
          images: imageUrls.length > 0 ? imageUrls : undefined,
          isPublic: formData.isPublic,
          
          // Detailed analysis for detailed mode
          detailedAnalysis: recordMode === 'detailed' ? {
            appearance: {
              color: formData.visualAnalysis.color || '',
              clarity: formData.visualAnalysis.clarity || '',
              viscosity: formData.visualAnalysis.viscosity || '',
              intensity: 3 // Default middle value
            },
            aroma: {
              firstImpression: { 
                intensity: formData.aromaAnalysis.aromaIntensity,
                notes: formData.aromaAnalysis.firstImpression || ''
              },
              afterSwirling: { 
                intensity: formData.aromaAnalysis.aromaIntensity,
                notes: formData.aromaAnalysis.afterSwirling || ''
              },
              categories: {
                fruity: formData.aromaAnalysis.aromaCategories.includes('果実') ? 1 : 0,
                floral: formData.aromaAnalysis.aromaCategories.includes('花') ? 1 : 0,
                spicy: formData.aromaAnalysis.aromaCategories.includes('スパイス') ? 1 : 0,
                herbal: formData.aromaAnalysis.aromaCategories.includes('ハーブ') ? 1 : 0,
                earthy: formData.aromaAnalysis.aromaCategories.includes('土') ? 1 : 0,
                woody: formData.aromaAnalysis.aromaCategories.includes('木') ? 1 : 0,
                other: formData.aromaAnalysis.aromaCategories.filter(c => 
                  !['果実', '花', 'スパイス', 'ハーブ', '土', '木'].includes(c)
                ).length
              },
              specificAromas: formData.aromaAnalysis.aromaCategories
            },
            taste: {
              attack: { 
                intensity: 5,
                notes: formData.tasteAnalysis.attack || ''
              },
              development: { 
                complexity: 5,
                notes: formData.tasteAnalysis.development || ''
              },
              finish: { 
                length: formData.tasteAnalysis.finishLength,
                notes: formData.tasteAnalysis.finish || ''
              }
            },
            structure: {
              acidity: { intensity: formData.componentAnalysis.acidity },
              tannins: { intensity: formData.componentAnalysis.tannins },
              sweetness: formData.componentAnalysis.sweetness,
              body: formData.componentAnalysis.body
            }
          } : undefined,
          
          // Environment and context
          environment: recordMode === 'detailed' ? {
            temperature: formData.environmentalFactors.temperature ? 
              parseFloat(formData.environmentalFactors.temperature) : undefined,
            glassType: formData.environmentalFactors.glassware || undefined,
            decanted: formData.environmentalFactors.decantingTime ? 
              formData.environmentalFactors.decantingTime !== 'なし' : undefined,
            occasion: formData.personalNotes || undefined,
            companions: formData.personalNotes || undefined
          } : undefined,
          
          referenceUrls: formData.referenceUrls.filter(url => url.trim() !== '') || undefined
        };

        // Clean the data by removing undefined values
        const tastingData = removeUndefined(tastingDataRaw);

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
        } as Parameters<typeof userService.updateStatsAfterWineRecord>[1]);
        
        const xpToAdd = recordMode === 'detailed' ? 20 : 10;
        await userService.addXP(currentUser.uid, xpToAdd);
        
        // Update daily goal progress
        await goalService.updateGoalProgress(currentUser.uid, 'wine');
        
        // Generate learning insight
        setIsLoadingInsight(true);
        setShowInsightModal(true);
        try {
          const insight = await learningInsightService.generateWineInsight({
            wineName: wine.wineName,
            wineType: wine.wineType,
            country: wine.country,
            region: wine.region,
            rating: formData.overallRating,
            notes: formData.notes,
            grapeVarieties: wine.grapeVarieties
          });
          setLearningInsight(insight);
        } catch (error) {
          console.error('Failed to generate insight:', error);
        } finally {
          setIsLoadingInsight(false);
        }
      });

      // Show success message with insight modal
      setTimeout(() => {
        navigate('/records');
      }, 5000); // Navigate after 5 seconds
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
      {/* Learning Insight Modal */}
      {showInsightModal && (
        <div className="insight-modal-overlay" onClick={() => setShowInsightModal(false)}>
          <div className="insight-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="insight-modal-header">
              <h2>✅ 記録が保存されました！</h2>
              <button className="close-button" onClick={() => setShowInsightModal(false)}>×</button>
            </div>
            <div className="insight-modal-body">
              {(learningInsight || isLoadingInsight) && (
                <div className="learning-insight">
                  <div className="insight-header">💡 学習インサイト</div>
                  {isLoadingInsight ? (
                    <div className="insight-loading">分析中...</div>
                  ) : (
                    <div className="insight-message">{learningInsight?.message}</div>
                  )}
                </div>
              )}
              <button 
                className="btn-primary" 
                onClick={() => {
                  setShowInsightModal(false);
                  navigate('/records');
                }}
              >
                記録一覧へ
              </button>
            </div>
          </div>
        </div>
      )}
      
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
          <WineCard wine={wine} variant="simple" />
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
              <label>写真登録 (最大4枚)</label>
              <div className="image-suggestion-text">
                <p className="text-muted">
                  おすすめ：お店の雰囲気、ペアリングした料理、一緒に楽しんだ人との記念写真など
                </p>
                <p className="text-muted" style={{fontSize: '0.85rem', fontWeight: '500'}}>
                  ※1枚目の写真はメインサムネイルとして記録一覧で表示されます
                </p>
              </div>
              
              <div className="image-gallery">
                {formData.images.map((image, index) => (
                  <div key={index} className="image-gallery-item">
                    <img 
                      src={URL.createObjectURL(image)}
                      alt={`アップロード画像 ${index + 1}`}
                      className="gallery-image"
                    />
                    <button 
                      type="button"
                      className="remove-image-button"
                      onClick={() => removeImage(index)}
                      aria-label={`画像 ${index + 1} を削除`}
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {formData.images.length < 4 && (
                  <div className={`image-gallery-add pos-${formData.images.length + 1}`}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="image-input"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="image-add-button">
                      <div className="add-icon">+</div>
                      <span>写真を追加</span>
                    </label>
                  </div>
                )}
              </div>
              
              {formData.images.length > 0 && (
                <p className="image-count">
                  {formData.images.length}/4枚の画像を選択中
                </p>
              )}
            </div>

            {/* Drawing Section */}
            <div className="form-group">
              <label>手書きメモ・スケッチ</label>
              <p className="text-muted" style={{fontSize: '0.9rem', marginBottom: '1rem'}}>
                テイスティングの印象をスケッチしたり、手書きでメモを残すことができます
              </p>
              
              {formData.drawingDataUrl ? (
                <div className="drawing-preview">
                  <img 
                    src={formData.drawingDataUrl} 
                    alt="手書きスケッチ" 
                    className="drawing-preview-image"
                  />
                  <div className="drawing-preview-actions">
                    <button
                      type="button"
                      onClick={clearDrawing}
                      className="btn-secondary small"
                    >
                      削除
                    </button>
                  </div>
                </div>
              ) : (
                <DrawingCanvas 
                  onSave={handleDrawingSave}
                  width={400}
                  height={300}
                />
              )}
            </div>
          </div>

          {/* Detailed Mode Fields */}
          {recordMode === 'detailed' && (
            <>
              {/* Visual Analysis */}
              <div className="form-section">
                <h3>外観分析</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="color">色合い</label>
                    <select
                      id="colorSelect"
                      name="colorSelect"
                      value={formData.visualAnalysis.color}
                      onChange={(e) => handleNestedInputChange('visualAnalysis', 'color', e.target.value)}
                      style={{ marginBottom: '0.5rem' }}
                    >
                      <option value="">選択してください</option>
                      {/* 赤ワイン */}
                      {(!wine?.wineType || wine.wineType === 'red') && (
                        <>
                          <option value="鮮やかな紫">鮮やかな紫（若い赤ワイン）</option>
                          <option value="深い紫">深い紫（ミディアムボディ）</option>
                          <option value="鮮やかなルビー">鮮やかなルビー（ピノ・ノワール系）</option>
                          <option value="深いガーネット">深いガーネット（カベルネ系）</option>
                          <option value="茶色がかった赤">茶色がかった赤（熟成）</option>
                          <option value="レンガ色">レンガ色（経年変化）</option>
                          <option value="深いマホガニー">深いマホガニー（長期熟成）</option>
                          <option value="灰色がかった赤">灰色がかった赤（ヴィンテージ）</option>
                        </>
                      )}
                      {/* 白ワイン */}
                      {(!wine?.wineType || wine.wineType === 'white') && (
                        <>
                          <option value="透明に近い無色">透明に近い無色（若い白ワイン）</option>
                          <option value="淡いレモンイエロー">淡いレモンイエロー（ソーヴィニヨンブラン系）</option>
                          <option value="黄金色">黄金色（シャルドネ系）</option>
                          <option value="緑がかった黄色">緑がかった黄色（サンセール系）</option>
                          <option value="黄緑色">黄緑色（リースリング系）</option>
                          <option value="深い黄金色">深い黄金色（樽熟成）</option>
                          <option value="琥珀色">琥珀色（甘口ワイン）</option>
                          <option value="茶色がかった黄色">茶色がかった黄色（長期熟成）</option>
                        </>
                      )}
                      {/* ロゼワイン */}
                      {(!wine?.wineType || wine.wineType === 'rose') && (
                        <>
                          <option value="淡いサーモンピンク">淡いサーモンピンク</option>
                          <option value="玄黒ピンク">玄黒ピンク</option>
                          <option value="鮮やかなローズ色">鮮やかなローズ色</option>
                          <option value="オレンジがかったピンク">オレンジがかったピンク</option>
                        </>
                      )}
                      {/* スパークリング */}
                      {(!wine?.wineType || wine.wineType === 'sparkling') && (
                        <>
                          <option value="淡いゴールド（泡付き）">淡いゴールド（泡付き）</option>
                          <option value="銀白色（泡付き）">銀白色（泡付き）</option>
                          <option value="鮮やかなピンク（泡付き）">鮮やかなピンク（泡付き）</option>
                        </>
                      )}
                    </select>
                    <input
                      id="color"
                      name="color"
                      type="text"
                      value={formData.visualAnalysis.color}
                      onChange={(e) => handleNestedInputChange('visualAnalysis', 'color', e.target.value)}
                      placeholder="または自由記入"
                      style={{ fontSize: '0.9rem' }}
                    />
                    <small className="field-help">選択肢から選ぶか、自由に記入してください</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="clarity">透明度</label>
                    <select
                      id="clarity"
                      name="clarity"
                      value={formData.visualAnalysis.clarity}
                      onChange={(e) => handleNestedInputChange('visualAnalysis', 'clarity', e.target.value)}
                    >
                      <option value="">選択してください</option>
                      <option value="clear">透明</option>
                      <option value="slightly_hazy">わずかに濁り</option>
                      <option value="hazy">濁り</option>
                      <option value="opaque">不透明</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="viscosity">粘性（脚の様子）</label>
                  <select
                    id="viscositySelect"
                    name="viscositySelect"
                    value={formData.visualAnalysis.viscosity}
                    onChange={(e) => handleNestedInputChange('visualAnalysis', 'viscosity', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  >
                    <option value="">選択してください</option>
                    <option value="非常に軽い（水のよう）">非常に軽い（水のよう）</option>
                    <option value="軽い（細い脚が素早く落ちる）">軽い（細い脚が素早く落ちる）</option>
                    <option value="やや軽い（適度な脚）">やや軽い（適度な脚）</option>
                    <option value="中程度（ゆっくりとした脚）">中程度（ゆっくりとした脚）</option>
                    <option value="やや重い（太めの脚がゆっくり）">やや重い（太めの脚がゆっくり）</option>
                    <option value="重い（非常に太い脚）">重い（非常に太い脚）</option>
                    <option value="非常に重い（シロップのよう）">非常に重い（シロップのよう）</option>
                    <option value="油性（グリセリンのよう）">油性（グリセリンのよう）</option>
                  </select>
                  <textarea
                    id="viscosity"
                    name="viscosity"
                    value={formData.visualAnalysis.viscosity}
                    onChange={(e) => handleNestedInputChange('visualAnalysis', 'viscosity', e.target.value)}
                    placeholder="または自由記入（例: ゆっくりと落ちる太い脚）"
                    rows={2}
                    style={{ fontSize: '0.9rem' }}
                  />
                  <small className="field-help">選択肢から選ぶか、自由に記入してください</small>
                </div>
              </div>

              {/* Aroma Analysis */}
              <div className="form-section">
                <h3>香り分析</h3>
                <div className="form-group">
                  <label htmlFor="firstImpression">第一印象</label>
                  <select
                    id="firstImpressionSelect"
                    value={formData.aromaAnalysis.firstImpression}
                    onChange={(e) => handleNestedInputChange('aromaAnalysis', 'firstImpression', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  >
                    <option value="">選択してください</option>
                    <option value="非常に弱い（ほとんど香らない）">非常に弱い（ほとんど香らない）</option>
                    <option value="弱い（かすかに香る）">弱い（かすかに香る）</option>
                    <option value="中程度（適度に香る）">中程度（適度に香る）</option>
                    <option value="強い（はっきりと香る）">強い（はっきりと香る）</option>
                    <option value="非常に強い（非常に香りが高い）">非常に強い（非常に香りが高い）</option>
                    <option value="若々しい果実の香り">若々しい果実の香り</option>
                    <option value="花のような上品な香り">花のような上品な香り</option>
                    <option value="熻製香やバニラの香り">熻製香やバニラの香り</option>
                    <option value="土やミネラルの香り">土やミネラルの香り</option>
                  </select>
                  <textarea
                    id="firstImpression"
                    name="firstImpression"
                    value={formData.aromaAnalysis.firstImpression}
                    onChange={(e) => handleNestedInputChange('aromaAnalysis', 'firstImpression', e.target.value)}
                    placeholder="または自由記入（グラスに注いだ直後の香りの印象）"
                    rows={2}
                    style={{ fontSize: '0.9rem' }}
                  />
                  <small className="field-help">選択肢から選ぶか、自由に記入してください</small>
                </div>
                <div className="form-group">
                  <label htmlFor="afterSwirling">スワリング後</label>
                  <select
                    id="afterSwirlingSelect"
                    value={formData.aromaAnalysis.afterSwirling}
                    onChange={(e) => handleNestedInputChange('aromaAnalysis', 'afterSwirling', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  >
                    <option value="">選択してください</option>
                    <option value="香りが強くなった">香りが強くなった</option>
                    <option value="香りが弱くなった">香りが弱くなった</option>
                    <option value="新しい香りが登場した">新しい香りが登場した</option>
                    <option value="香りの層が展開した">香りの層が展開した</option>
                    <option value="果実の香りが際立つ">果実の香りが際立つ</option>
                    <option value="スパイシーな香りが登場">スパイシーな香りが登場</option>
                    <option value="ミネラルや土の香りが登場">ミネラルや土の香りが登場</option>
                    <option value="樽の香りが際立つ">樽の香りが際立つ</option>
                    <option value="あまり変化なし">あまり変化なし</option>
                  </select>
                  <textarea
                    id="afterSwirling"
                    name="afterSwirling"
                    value={formData.aromaAnalysis.afterSwirling}
                    onChange={(e) => handleNestedInputChange('aromaAnalysis', 'afterSwirling', e.target.value)}
                    placeholder="または自由記入（グラスを回した後の香りの変化）"
                    rows={2}
                    style={{ fontSize: '0.9rem' }}
                  />
                  <small className="field-help">選択肢から選ぶか、自由に記入してください</small>
                </div>
                
                <div className="form-group">
                  <label>香りの強さ ({formData.aromaAnalysis.aromaIntensity}/10)</label>
                  <input
                    type="range"
                    className="component-slider"
                    min="1"
                    max="10"
                    step="1"
                    value={formData.aromaAnalysis.aromaIntensity}
                    onChange={(e) => handleNestedInputChange('aromaAnalysis', 'aromaIntensity', parseInt(e.target.value))}
                  />
                  <div className="slider-labels">
                    <span>弱い</span>
                    <span>強い</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>香りのカテゴリー</label>
                  <div className="aroma-categories">
                    {['果実', '花', 'スパイス', '木', '土', 'ハーブ', 'ミネラル', '動物的', '化学的'].map(category => (
                      <button
                        key={category}
                        type="button"
                        className={`category-button ${formData.aromaAnalysis.aromaCategories.includes(category) ? 'active' : ''}`}
                        onClick={() => handleAromaCategoryToggle(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Taste Analysis */}
              <div className="form-section">
                <h3>味わい分析</h3>
                <div className="form-group">
                  <label htmlFor="attack">アタック（第一印象）</label>
                  <select
                    id="attackSelect"
                    value={formData.tasteAnalysis.attack}
                    onChange={(e) => handleNestedInputChange('tasteAnalysis', 'attack', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  >
                    <option value="">選択してください</option>
                    <option value="弱い（あっさりとした入り）">弱い（あっさりとした入り）</option>
                    <option value="中程度（バランスの良い入り）">中程度（バランスの良い入り）</option>
                    <option value="強い（インパクトのある入り）">強い（インパクトのある入り）</option>
                    <option value="果実味が前面に">果実味が前面に</option>
                    <option value="酸味が際立つ">酸味が際立つ</option>
                    <option value="タンニンが前面に">タンニンが前面に</option>
                    <option value="ミネラルや土の味">ミネラルや土の味</option>
                    <option value="アルコール感が強い">アルコール感が強い</option>
                  </select>
                  <textarea
                    id="attack"
                    name="attack"
                    value={formData.tasteAnalysis.attack}
                    onChange={(e) => handleNestedInputChange('tasteAnalysis', 'attack', e.target.value)}
                    placeholder="または自由記入（口に含んだ瞬間の印象）"
                    rows={2}
                    style={{ fontSize: '0.9rem' }}
                  />
                  <small className="field-help">選択肢から選ぶか、自由に記入してください</small>
                </div>
                <div className="form-group">
                  <label htmlFor="development">展開</label>
                  <select
                    id="developmentSelect"
                    value={formData.tasteAnalysis.development}
                    onChange={(e) => handleNestedInputChange('tasteAnalysis', 'development', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  >
                    <option value="">選択してください</option>
                    <option value="シンプル（変化が少ない）">シンプル（変化が少ない）</option>
                    <option value="複雑（層が展開する）">複雑（層が展開する）</option>
                    <option value="非常に複雑（多層的）">非常に複雑（多層的）</option>
                    <option value="果実味が展開">果実味が展開</option>
                    <option value="スパイシーな味が登場">スパイシーな味が登場</option>
                    <option value="ミネラルや土の味が登場">ミネラルや土の味が登場</option>
                    <option value="樽由来の味が登場">樽由来の味が登場</option>
                    <option value="タンニンが展開">タンニンが展開</option>
                    <option value="酸味が際立つ">酸味が際立つ</option>
                  </select>
                  <textarea
                    id="development"
                    name="development"
                    value={formData.tasteAnalysis.development}
                    onChange={(e) => handleNestedInputChange('tasteAnalysis', 'development', e.target.value)}
                    placeholder="または自由記入（口の中での味わいの変化）"
                    rows={2}
                    style={{ fontSize: '0.9rem' }}
                  />
                  <small className="field-help">選択肢から選ぶか、自由に記入してください</small>
                </div>
                <div className="form-group">
                  <label htmlFor="finish">フィニッシュ</label>
                  <select
                    id="finishSelect"
                    value={formData.tasteAnalysis.finish}
                    onChange={(e) => handleNestedInputChange('tasteAnalysis', 'finish', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  >
                    <option value="">選択してください</option>
                    <option value="クリーン（すっきりとした終わり）">クリーン（すっきりとした終わり）</option>
                    <option value="スムース（穏やかな終わり）">スムース（穏やかな終わり）</option>
                    <option value="エレガント（上品な終わり）">エレガント（上品な終わり）</option>
                    <option value="果実味が残る">果実味が残る</option>
                    <option value="スパイシーな余韻">スパイシーな余韻</option>
                    <option value="ミネラルや土の余韻">ミネラルや土の余韻</option>
                    <option value="樽由来の余韻">樽由来の余韻</option>
                    <option value="タンニンが残る">タンニンが残る</option>
                    <option value="苦味が残る">苦味が残る</option>
                  </select>
                  <textarea
                    id="finish"
                    name="finish"
                    value={formData.tasteAnalysis.finish}
                    onChange={(e) => handleNestedInputChange('tasteAnalysis', 'finish', e.target.value)}
                    placeholder="または自由記入（飲み込んだ後の余韻）"
                    rows={2}
                    style={{ fontSize: '0.9rem' }}
                  />
                  <small className="field-help">選択肢から選ぶか、自由に記入してください</small>
                </div>
                <div className="form-group">
                  <label>余韻の長さ ({formData.tasteAnalysis.finishLength}/10)</label>
                  <input
                    type="range"
                    className="component-slider"
                    min="1"
                    max="10"
                    step="1"
                    value={formData.tasteAnalysis.finishLength}
                    onChange={(e) => handleNestedInputChange('tasteAnalysis', 'finishLength', parseInt(e.target.value))}
                  />
                  <div className="slider-labels">
                    <span>短い</span>
                    <span>長い</span>
                  </div>
                </div>
              </div>

              {/* Component Analysis */}
              <div className="form-section">
                <h3>成分分析</h3>
                <div className="components-grid">
                  <div className="component-item">
                    <label>酸味 ({formData.componentAnalysis.acidity}/10)</label>
                    <input
                      type="range"
                      className="component-slider"
                      min="1"
                      max="10"
                      step="1"
                      value={formData.componentAnalysis.acidity}
                      onChange={(e) => handleNestedInputChange('componentAnalysis', 'acidity', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="component-item">
                    <label>タンニン ({formData.componentAnalysis.tannins}/10)</label>
                    <input
                      type="range"
                      className="component-slider"
                      min="1"
                      max="10"
                      step="1"
                      value={formData.componentAnalysis.tannins}
                      onChange={(e) => handleNestedInputChange('componentAnalysis', 'tannins', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="component-item">
                    <label>甘味 ({formData.componentAnalysis.sweetness}/10)</label>
                    <input
                      type="range"
                      className="component-slider"
                      min="1"
                      max="10"
                      step="1"
                      value={formData.componentAnalysis.sweetness}
                      onChange={(e) => handleNestedInputChange('componentAnalysis', 'sweetness', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="component-item">
                    <label>ボディ ({formData.componentAnalysis.body}/10)</label>
                    <input
                      type="range"
                      className="component-slider"
                      min="1"
                      max="10"
                      step="1"
                      value={formData.componentAnalysis.body}
                      onChange={(e) => handleNestedInputChange('componentAnalysis', 'body', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="component-item">
                    <label>アルコール感 ({formData.componentAnalysis.alcohol}/10)</label>
                    <input
                      type="range"
                      className="component-slider"
                      min="1"
                      max="10"
                      step="1"
                      value={formData.componentAnalysis.alcohol}
                      onChange={(e) => handleNestedInputChange('componentAnalysis', 'alcohol', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Environmental Factors */}
              <div className="form-section">
                <h3>環境・条件</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="temperature">サービス温度</label>
                    <input
                      id="temperature"
                      name="temperature"
                      type="text"
                      value={formData.environmentalFactors.temperature}
                      onChange={(e) => handleNestedInputChange('environmentalFactors', 'temperature', e.target.value)}
                      placeholder="例: 16-18℃"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="glassware">グラス</label>
                    <input
                      id="glassware"
                      name="glassware"
                      type="text"
                      value={formData.environmentalFactors.glassware}
                      onChange={(e) => handleNestedInputChange('environmentalFactors', 'glassware', e.target.value)}
                      placeholder="例: ボルドーグラス"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="decantingTime">デカンタージュ時間</label>
                  <input
                    id="decantingTime"
                    name="decantingTime"
                    type="text"
                    value={formData.environmentalFactors.decantingTime}
                    onChange={(e) => handleNestedInputChange('environmentalFactors', 'decantingTime', e.target.value)}
                    placeholder="例: 1時間、なし"
                  />
                </div>
              </div>

              {/* Food Pairings and Additional Notes */}
              <div className="form-section">
                <h3>フードペアリング・追加メモ</h3>
                <div className="form-group">
                  <label htmlFor="foodPairings">料理との相性</label>
                  <textarea
                    id="foodPairings"
                    name="foodPairings"
                    value={formData.foodPairings}
                    onChange={handleInputChange}
                    placeholder="一緒に楽しんだ料理や、合いそうな料理"
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="personalNotes">個人的なメモ</label>
                  <textarea
                    id="personalNotes"
                    name="personalNotes"
                    value={formData.personalNotes}
                    onChange={handleInputChange}
                    placeholder="シチュエーション、同席者、特別な思い出など"
                    rows={3}
                  />
                </div>
              </div>

              {/* Reference URLs */}
              <div className="form-section">
                <h3>参考リンク</h3>
                {formData.referenceUrls.map((url, index) => (
                  <div key={index} className="reference-url-item">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateReferenceUrl(index, e.target.value)}
                      placeholder="https://example.com"
                    />
                    <button
                      type="button"
                      className="remove-url-button"
                      onClick={() => removeReferenceUrl(index)}
                    >
                      削除
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="add-url-button"
                  onClick={addReferenceUrl}
                >
                  + 参考リンクを追加
                </button>
              </div>
            </>
          )}

          {/* Privacy Settings */}
          <div className="form-section privacy-settings">
            <h3>公開設定</h3>
            <div className="privacy-toggle-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                />
                <span className="toggle-slider"></span>
              </label>
              <div className="privacy-label">
                <span className="privacy-status">
                  {formData.isPublic ? '🌐 公開' : '🔒 非公開'}
                </span>
                <p className="privacy-description">
                  {formData.isPublic 
                    ? 'この記録は他のユーザーに表示されます（価格・購入場所は非表示）'
                    : 'この記録はあなただけが閲覧できます'}
                </p>
              </div>
            </div>
          </div>

          {/* Save Buttons */}
          <div className="form-action">
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