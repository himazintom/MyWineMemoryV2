/**
 * Error Display Component
 * Shows user-friendly error messages with retry options
 */

import React from 'react';
import { AppError } from '../hooks/useErrorHandler';
import './ErrorDisplay.css';

interface ErrorDisplayProps {
  errors: AppError[];
  onDismiss: (errorId: string) => void;
  onRetry: (errorId: string) => void;
  onClearAll: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  errors,
  onDismiss,
  onRetry,
  onClearAll
}) => {
  if (errors.length === 0) return null;

  const getErrorIcon = (type: AppError['type']) => {
    switch (type) {
      case 'network': return '📶';
      case 'auth': return '🔐';
      case 'validation': return '⚠️';
      case 'server': return '🔧';
      default: return '❌';
    }
  };

  const getErrorClass = (type: AppError['type']) => {
    switch (type) {
      case 'network': return 'error-network';
      case 'auth': return 'error-auth';
      case 'validation': return 'error-validation';
      case 'server': return 'error-server';
      default: return 'error-unknown';
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}分前`;
    }
    return `${seconds}秒前`;
  };

  return (
    <div className="error-display">
      <div className="error-header">
        <h3>エラー ({errors.length}件)</h3>
        {errors.length > 1 && (
          <button 
            className="error-clear-all"
            onClick={onClearAll}
            aria-label="すべてのエラーを消去"
          >
            すべて消去
          </button>
        )}
      </div>

      <div className="error-list">
        {errors.map((error) => (
          <div
            key={error.id}
            className={`error-item ${getErrorClass(error.type)}`}
            role="alert"
            aria-live="polite"
          >
            <div className="error-content">
              <div className="error-main">
                <span className="error-icon" aria-hidden="true">
                  {getErrorIcon(error.type)}
                </span>
                <div className="error-text">
                  <div className="error-message">
                    {error.userMessage}
                  </div>
                  <div className="error-time">
                    {formatTime(error.timestamp)}
                  </div>
                </div>
              </div>

              <div className="error-actions">
                {error.retry && (
                  <button
                    className="error-retry"
                    onClick={() => onRetry(error.id)}
                    aria-label="再試行"
                  >
                    再試行
                  </button>
                )}
                <button
                  className="error-dismiss"
                  onClick={() => onDismiss(error.id)}
                  aria-label="このエラーを消去"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Development mode: show technical details */}
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>技術的詳細</summary>
                <pre className="error-debug">
                  {JSON.stringify({
                    type: error.type,
                    message: error.message,
                    details: error.details
                  }, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};