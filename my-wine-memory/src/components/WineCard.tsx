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

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(10 - rating);
  };

  return (
    <div className="wine-card" onClick={onClick}>
      <div className="wine-card-header">
        <h3 className="wine-name">{wine.wineName}</h3>
        <div className="wine-rating">
          <span className="stars">{renderStars(wine.overallRating)}</span>
          <span className="rating-number">{wine.overallRating}/10</span>
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

      {wine.images && wine.images.length > 0 && (
        <div className="wine-image">
          <img 
            src={wine.images[0]} 
            alt={wine.wineName}
            className="wine-photo"
          />
        </div>
      )}

      <div className="wine-card-footer">
        <span className="record-date">{formatDate(wine.createdAt)}</span>
        <span className="record-mode">
          {wine.recordMode === 'quick' ? 'クイック記録' : '詳細記録'}
        </span>
      </div>
    </div>
  );
};

export default WineCard;