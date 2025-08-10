import React from 'react';
import type { WineRecord } from '../types';

interface WineCardProps {
  wine: WineRecord;
  onClick?: () => void;
}

const WineCard: React.FC<WineCardProps> = ({ wine, onClick }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const cover = wine.images && wine.images.length > 0 ? wine.images[0] : undefined;

  return (
    <div className="wine-card wine-card--photo" onClick={onClick}>
      {cover && <div className="wine-card-bg" style={{ backgroundImage: `url(${cover})` }} />}
      <div className="wine-card-body">
        <div className="wine-card-header">
          <h3 className="wine-name">{wine.wineName}</h3>
          <div className="wine-rating">
            <span className="rating-score">{wine.overallRating.toFixed(1)}</span>
            <span className="rating-scale">/10</span>
          </div>
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
          {wine.price && (
            <p className="price">
              <span className="label">価格:</span> ¥{wine.price.toLocaleString()}
            </p>
          )}
        </div>

        <div className="wine-card-footer">
          <span className="record-date">{formatDate(wine.createdAt)}</span>
          <span className="record-mode">
            {wine.recordMode === 'quick' ? 'クイック記録' : '詳細記録'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WineCard;