import React from 'react';
import { motion } from 'framer-motion';
import type { WineRecord, WineMaster, TastingRecord, PublicWineRecord } from '../types';

// WineCard accepts only types that have wine information (not pure TastingRecord)
type WineData = WineRecord | WineMaster | PublicWineRecord;

export interface WineCardProps {
  // 基本データ
  wine: WineData;
  onClick?: () => void;
  index?: number;

  // 表示バリアント
  variant?: 'photo' | 'list' | 'group' | 'record' | 'detail' | 'simple';

  // 表示オプション
  showImage?: boolean;
  showRating?: boolean;
  showStats?: boolean;
  showDate?: boolean;
  showPrice?: boolean;
  showPurchaseLocation?: boolean;
  showRecordMode?: boolean;
  showPrivacyToggle?: boolean;
  showActions?: boolean;

  // グループ統計（variant="group"用）
  groupStats?: {
    averageRating: number;
    recordCount: number;
    latestDate: Date;
    recentRecords?: TastingRecord[];
  };

  // カスタムアクション
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePrivacy?: (record: TastingRecord) => void;
  onAddTasting?: (wineId: string) => void;
}

const WineCard: React.FC<WineCardProps> = ({
  wine,
  onClick,
  index = 0,
  variant = 'photo',
  showImage = true,
  showRating = true,
  showStats = false,
  showDate = true,
  showPrice = false,
  showPurchaseLocation = false,
  showRecordMode = true,
  showPrivacyToggle = false,
  showActions = false,
  groupStats,
  onEdit,
  onDelete,
  onTogglePrivacy,
  onAddTasting
}) => {
  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRatingColor = (rating: number) => {
    const successColor = getComputedStyle(document.documentElement).getPropertyValue('--success-text') || '#28a745';
    const warningColor = getComputedStyle(document.documentElement).getPropertyValue('--warning-text') || '#ffc107';
    const mutedColor = getComputedStyle(document.documentElement).getPropertyValue('--text-muted') || '#6c757d';

    if (rating >= 8) return successColor;
    if (rating >= 6) return warningColor;
    return mutedColor;
  };

  const hasRating = 'overallRating' in wine;
  const hasTastingDate = 'tastingDate' in wine;
  const hasRecordMode = 'recordMode' in wine;
  const hasPrice = 'price' in wine;
  const hasPurchaseLocation = 'purchaseLocation' in wine;
  const hasImages = 'images' in wine && wine.images && wine.images.length > 0;
  const cover = hasImages ? wine.images![0] : undefined;

  // Variant: photo (デフォルト、ホーム画面用)
  if (variant === 'photo') {
    return (
      <motion.div
        className="wine-card wine-card--photo"
        onClick={onClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          duration: 0.3,
          delay: index * 0.05,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        whileHover={{
          y: -4,
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.98 }}
        layout
      >
        {showImage && cover && <div className="wine-card-bg" style={{ backgroundImage: `url(${cover})` }} />}
        <div className="wine-card-body">
          <div className="wine-card-header">
            <h3 className="wine-name">{wine.wineName}</h3>
            {showRating && hasRating && (
              <div className="wine-rating">
                <span className="rating-score">{wine.overallRating.toFixed(1)}</span>
                <span className="rating-scale">/10</span>
              </div>
            )}
          </div>

          <div className="wine-info">
            <p className="producer">
              <span className="label">生産者:</span> {wine.producer}
            </p>
            <p className="location">
              <span className="label">産地:</span> {wine.country} - {wine.region}
            </p>
            {wine.vintage && (
              <p className="vintage">
                <span className="label">年:</span> {wine.vintage}
              </p>
            )}
            {showPrice && hasPrice && wine.price && (
              <p className="price">
                <span className="label">価格:</span> ¥{wine.price.toLocaleString()}
              </p>
            )}
          </div>

          <div className="wine-card-footer">
            {showDate && 'createdAt' in wine && <span className="record-date">{formatDate(wine.createdAt)}</span>}
            {showRecordMode && hasRecordMode && (
              <span className="record-mode">
                {wine.recordMode === 'quick' ? 'クイック記録' : '詳細記録'}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Variant: list (SelectWine用)
  if (variant === 'list') {
    return (
      <motion.div
        className="wine-list-item"
        onClick={onClick}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
        whileHover={{ x: 4 }}
      >
        <div className="wine-info">
          <h3 className="wine-name">{wine.wineName}</h3>
          <p className="wine-producer">{wine.producer}</p>
          <div className="wine-details-mobile">
            <p className="wine-location">{wine.country} - {wine.region}</p>
            {wine.vintage && <p className="wine-vintage">{wine.vintage}年</p>}
          </div>
        </div>
        <div className="wine-stats">
          {'referenceCount' in wine && (
            <span className="reference-count">
              {wine.referenceCount > 0 ? `${wine.referenceCount}回記録` : '新規ワイン'}
            </span>
          )}
          <span className="select-arrow">→</span>
        </div>
      </motion.div>
    );
  }

  // Variant: group (Records用)
  if (variant === 'group' && groupStats) {
    return (
      <motion.div
        className="wine-group-card"
        onClick={onClick}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
        whileHover={{ y: -1 }}
      >
        <div className="wine-group-header">
          {showImage && cover && (
            <div className="wine-group-image">
              <img src={cover} alt={wine.wineName} loading="lazy" />
            </div>
          )}
          <div className="wine-info">
            <h3 className="wine-name">{wine.wineName}</h3>
            <p className="wine-producer">{wine.producer}</p>
            <p className="wine-location">{wine.country} - {wine.region}</p>
            {wine.vintage && <p className="wine-vintage">{wine.vintage}年</p>}
            {showPrice && hasPrice && wine.price && wine.price > 0 && (
              <p className="wine-price">価格: ¥{wine.price.toLocaleString()}</p>
            )}
            {showPurchaseLocation && hasPurchaseLocation && wine.purchaseLocation && (
              <p className="wine-purchase-location">購入場所: {wine.purchaseLocation}</p>
            )}
          </div>
          {showStats && (
            <div className="wine-stats">
              <div className="rating-info">
                <span
                  className="average-rating"
                  style={{ color: getRatingColor(groupStats.averageRating) }}
                >
                  {groupStats.averageRating.toFixed(1)}/10
                </span>
                <span className="rating-label">平均評価</span>
              </div>
            </div>
          )}
        </div>

        <div className="tasting-summary">
          <div className="tasting-count">
            <span className="count">{groupStats.recordCount}</span>
            <span className="label">回記録</span>
          </div>
          <div className="latest-tasting">
            <span className="date">最新: {formatDate(groupStats.latestDate)}</span>
          </div>
          {onAddTasting && (
            <button
              className="add-tasting-btn"
              onClick={(e) => {
                e.stopPropagation();
                onAddTasting(wine.id);
              }}
              title="新しいテイスティングを追加"
            >
              ➕
            </button>
          )}
        </div>

        {groupStats.recentRecords && groupStats.recentRecords.length > 0 && (
          <div className="recent-tastings">
            <h4>最近のテイスティング</h4>
            <div className="tastings-preview">
              {groupStats.recentRecords.slice(0, 3).map((record) => (
                <div key={record.id} className="tasting-preview-item">
                  <div className="tasting-date">
                    {formatDate(record.tastingDate)}
                  </div>
                  <div
                    className="tasting-rating"
                    style={{ color: getRatingColor(record.overallRating) }}
                  >
                    {record.overallRating.toFixed(1)}
                  </div>
                  <div className="tasting-mode">
                    {record.recordMode === 'quick' ? 'クイック' : '詳細'}
                  </div>
                  {showPrivacyToggle && onTogglePrivacy && (
                    <button
                      className={`privacy-indicator ${record.isPublic ? 'public' : 'private'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePrivacy(record);
                      }}
                      title={record.isPublic ? '非公開にする' : '公開する'}
                    >
                      {record.isPublic ? '🌐' : '🔒'}
                    </button>
                  )}
                </div>
              ))}
              {groupStats.recentRecords.length > 3 && (
                <div className="more-tastings">
                  +{groupStats.recentRecords.length - 3}件
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // Variant: record (公開プロフィール用)
  if (variant === 'record') {
    return (
      <motion.div
        className="wine-record-card"
        onClick={onClick}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
        whileHover={{ scale: 1.02 }}
      >
        {showImage && hasImages && (
          <div className="record-image">
            <img src={cover} alt={wine.wineName} loading="lazy" />
          </div>
        )}

        <div className="record-content">
          <div className="wine-header">
            <h4 className="wine-name">{wine.wineName}</h4>
            <p className="wine-producer">{wine.producer}</p>
            <p className="wine-location">{wine.country} - {wine.region}</p>
            {wine.vintage && <p className="wine-vintage">{wine.vintage}年</p>}
          </div>

          {showRating && hasRating && (
            <div className="wine-rating">
              <span className="rating-value">{wine.overallRating.toFixed(1)}</span>
              <span className="rating-scale">/10.0</span>
              <div className="rating-stars">
                {'★'.repeat(Math.floor(wine.overallRating / 2))}
                {'☆'.repeat(5 - Math.floor(wine.overallRating / 2))}
              </div>
            </div>
          )}

          <div className="wine-meta">
            {showDate && hasTastingDate && (
              <span className="tasting-date">
                {formatDate(wine.tastingDate)}
              </span>
            )}
            {showRecordMode && hasRecordMode && (
              <span className="record-mode">
                {wine.recordMode === 'detailed' ? '詳細記録' : 'クイック記録'}
              </span>
            )}
          </div>

          {'notes' in wine && wine.notes && (
            <div className="wine-notes">
              <p>{wine.notes}</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Variant: detail (WineDetail用のテイスティング記録)
  // This variant requires a WineRecord (combined wine + tasting data)
  if (variant === 'detail' && hasTastingDate) {
    const record = wine as WineRecord;
    return (
      <motion.div
        className="tasting-record-card"
        onClick={onClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="record-header">
          <div className="record-date">{formatDate(record.tastingDate)}</div>
          {showRating && (
            <div
              className="record-rating"
              style={{ color: getRatingColor(record.overallRating) }}
            >
              {record.overallRating.toFixed(1)}/10
            </div>
          )}
          {showRecordMode && (
            <div className="record-mode-badge">
              {record.recordMode === 'quick' ? 'クイック' : '詳細'}
            </div>
          )}
        </div>

        {showActions && (
          <div className="record-actions">
            {onEdit && (
              <button
                className="edit-record-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                ✏️ 編集
              </button>
            )}
            {onDelete && (
              <button
                className="delete-record-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                🗑️ 削除
              </button>
            )}
          </div>
        )}
      </motion.div>
    );
  }

  // Variant: simple (AddTastingRecord用)
  if (variant === 'simple') {
    return (
      <div className="wine-card">
        <h3>{wine.wineName}</h3>
        <p><strong>生産者:</strong> {wine.producer}</p>
        <p><strong>産地:</strong> {wine.country} - {wine.region}</p>
        {wine.vintage && <p><strong>年:</strong> {wine.vintage}</p>}
        {wine.wineType && <p><strong>タイプ:</strong> {wine.wineType}</p>}
      </div>
    );
  }

  // Fallback: photo variant
  return null;
};

export default WineCard;