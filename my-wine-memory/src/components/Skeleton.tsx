import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
  width?: string;
  height?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  variant = 'rectangular',
  className = ''
}) => {
  const variantClass = `skeleton-${variant}`;

  return (
    <div
      className={`skeleton ${variantClass} ${className}`}
      style={{ width, height }}
    />
  );
};

export const SkeletonWineCard: React.FC = () => {
  return (
    <div className="skeleton-wine-card">
      <Skeleton variant="rectangular" height="200px" />
      <div className="skeleton-wine-card-content">
        <Skeleton variant="text" height="24px" width="80%" />
        <Skeleton variant="text" height="18px" width="60%" />
        <Skeleton variant="text" height="18px" width="40%" />
        <div className="skeleton-rating">
          <Skeleton variant="circular" height="24px" width="24px" />
          <Skeleton variant="text" height="18px" width="100px" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonFormField: React.FC<{ label?: boolean }> = ({ label = true }) => {
  return (
    <div className="skeleton-form-field">
      {label && <Skeleton variant="text" height="16px" width="120px" />}
      <Skeleton variant="rectangular" height="48px" />
    </div>
  );
};

export const SkeletonButton: React.FC = () => {
  return <Skeleton variant="rectangular" height="48px" className="skeleton-button" />;
};

export const SkeletonRecordGroup: React.FC = () => {
  return (
    <div className="skeleton-record-group">
      <div className="skeleton-record-header">
        <Skeleton variant="rectangular" height="80px" width="80px" />
        <div className="skeleton-record-info">
          <Skeleton variant="text" height="20px" width="200px" />
          <Skeleton variant="text" height="16px" width="150px" />
          <Skeleton variant="text" height="16px" width="100px" />
        </div>
      </div>
      <div className="skeleton-record-stats">
        <Skeleton variant="text" height="16px" width="80px" />
        <Skeleton variant="text" height="16px" width="80px" />
        <Skeleton variant="text" height="16px" width="80px" />
      </div>
    </div>
  );
};

export const SkeletonWineInfo: React.FC = () => {
  return (
    <div className="skeleton-wine-info">
      <Skeleton variant="rectangular" height="250px" />
      <div className="skeleton-wine-details">
        <Skeleton variant="text" height="32px" width="70%" />
        <Skeleton variant="text" height="20px" width="50%" />
        <Skeleton variant="text" height="20px" width="40%" />
        <div className="skeleton-wine-meta">
          <Skeleton variant="text" height="16px" width="100px" />
          <Skeleton variant="text" height="16px" width="100px" />
          <Skeleton variant="text" height="16px" width="100px" />
        </div>
      </div>
    </div>
  );
};
