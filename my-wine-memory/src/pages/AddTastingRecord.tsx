import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthHooks';
import { wineMasterService } from '../services/wineMasterService';
import { tastingRecordService } from '../services/tastingRecordService';
import { userService, goalService } from '../services/userService';
import type { WineMaster } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import LoginPrompt from '../components/LoginPrompt';
import DrawingCanvas from '../components/DrawingCanvas';
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
    referenceUrls: [] as string[]
  });

  // New wine data from location state (if creating new wine)
  const newWineData = location.state?.newWineData;

  const loadWineData = useCallback(async () => {
    if (!wineId || wineId === 'new') return;
    
    try {
      const wineData = await executeLoadWine(() => wineMasterService.getWineMaster(wineId));
      setWine(wineData);
    } catch (error) {
      console.error('Failed to load wine data:', error);
    }
  }, [wineId, executeLoadWine]);

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
  }, [wineId, newWineData, loadWineData, navigate]);

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
        const removeUndefined = (obj: any): any => {
          const cleaned = { ...obj };
          Object.keys(cleaned).forEach(key => {
            if (cleaned[key] === undefined) {
              delete cleaned[key];
            } else if (cleaned[key] && typeof cleaned[key] === 'object' && !Array.isArray(cleaned[key])) {
              cleaned[key] = removeUndefined(cleaned[key]);
            }
          });
          return cleaned;
        };

        // Create tasting record (before cleaning)
        const tastingDataRaw = {
          wineId: finalWineId,
          overallRating: formData.overallRating,
          tastingDate: formData.tastingDate,
          recordMode,
          notes: formData.notes || undefined,
          price: formData.price ? parseFloat(formData.price) : undefined,
          purchaseLocation: formData.purchaseLocation || undefined,
          images: imageUrls.length > 0 ? imageUrls : undefined,
          isPublic: false, // Default to private
          
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
        const tastingData: any = removeUndefined(tastingDataRaw);

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
                    <input
                      id="color"
                      name="color"
                      type="text"
                      value={formData.visualAnalysis.color}
                      onChange={(e) => handleNestedInputChange('visualAnalysis', 'color', e.target.value)}
                      placeholder="例: 濃い赤紫、黄金色"
                    />
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
                  <textarea
                    id="viscosity"
                    name="viscosity"
                    value={formData.visualAnalysis.viscosity}
                    onChange={(e) => handleNestedInputChange('visualAnalysis', 'viscosity', e.target.value)}
                    placeholder="例: ゆっくりと落ちる太い脚、サラサラとした軽い脚"
                    rows={2}
                  />
                </div>
              </div>

              {/* Aroma Analysis */}
              <div className="form-section">
                <h3>香り分析</h3>
                <div className="form-group">
                  <label htmlFor="firstImpression">第一印象</label>
                  <textarea
                    id="firstImpression"
                    name="firstImpression"
                    value={formData.aromaAnalysis.firstImpression}
                    onChange={(e) => handleNestedInputChange('aromaAnalysis', 'firstImpression', e.target.value)}
                    placeholder="グラスに注いだ直後の香りの印象"
                    rows={2}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="afterSwirling">スワリング後</label>
                  <textarea
                    id="afterSwirling"
                    name="afterSwirling"
                    value={formData.aromaAnalysis.afterSwirling}
                    onChange={(e) => handleNestedInputChange('aromaAnalysis', 'afterSwirling', e.target.value)}
                    placeholder="グラスを回した後の香りの変化"
                    rows={2}
                  />
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
                  <textarea
                    id="attack"
                    name="attack"
                    value={formData.tasteAnalysis.attack}
                    onChange={(e) => handleNestedInputChange('tasteAnalysis', 'attack', e.target.value)}
                    placeholder="口に含んだ瞬間の印象"
                    rows={2}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="development">展開</label>
                  <textarea
                    id="development"
                    name="development"
                    value={formData.tasteAnalysis.development}
                    onChange={(e) => handleNestedInputChange('tasteAnalysis', 'development', e.target.value)}
                    placeholder="口の中での味わいの変化"
                    rows={2}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="finish">フィニッシュ</label>
                  <textarea
                    id="finish"
                    name="finish"
                    value={formData.tasteAnalysis.finish}
                    onChange={(e) => handleNestedInputChange('tasteAnalysis', 'finish', e.target.value)}
                    placeholder="飲み込んだ後の余韻"
                    rows={2}
                  />
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