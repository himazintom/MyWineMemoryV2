import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showIcon?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'エラーが発生しました',
  message,
  onRetry,
  showIcon = true
}) => {
  return (
    <div className="error-message">
      {showIcon && <div className="error-icon">⚠️</div>}
      <h3 className="error-title">{title}</h3>
      <p className="error-text">{message}</p>
      {onRetry && (
        <button className="retry-button" onClick={onRetry}>
          🔄 再試行
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;