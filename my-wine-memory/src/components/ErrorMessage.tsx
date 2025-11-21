import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  showIcon?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'エラーが発生しました',
  message,
  onRetry,
  retryText = '再試行',
  showIcon = true
}) => {
  return (
    <div className="error-message">
      {showIcon && <div className="error-icon">⚠️</div>}
      <h3 className="error-title">{title}</h3>
      <p className="error-text">{message}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          🔄 {retryText}
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;