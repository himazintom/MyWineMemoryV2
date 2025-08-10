import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthHooks';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { useAsyncOperation } from '../hooks/useAsyncOperation';

interface LoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  title?: string;
  message?: string;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  title = "データを保存するにはログインが必要です",
  message = "Googleアカウントでログインして、記録を保存しましょう"
}) => {
  const { signInWithGoogle } = useAuth();
  const [authError, setAuthError] = useState<string>('');
  const { loading: authLoading, execute: executeAuth } = useAsyncOperation<void>();

  const handleGoogleSignIn = async () => {
    setAuthError('');
    try {
      await executeAuth(async () => {
        await signInWithGoogle();
      });
      onLoginSuccess();
    } catch (error: unknown) {
      setAuthError(error instanceof Error ? error.message : 'ログインに失敗しました');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-prompt-backdrop" onClick={handleBackdropClick}>
      <div className="login-prompt-modal">
        <div className="login-prompt-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="login-prompt-content">
          <p>{message}</p>
          
          {authError && (
            <ErrorMessage
              title="ログインエラー"
              message={authError}
              onRetry={handleGoogleSignIn}
              showIcon={true}
            />
          )}
          
          <div className="login-prompt-actions">
            <button 
              className="google-signin-button"
              onClick={handleGoogleSignIn}
              disabled={authLoading}
            >
              {authLoading ? (
                <LoadingSpinner size="small" message="ログイン中..." />
              ) : (
                <>
                  <span className="google-icon">🔍</span>
                  Googleでログイン
                </>
              )}
            </button>
            
            <button className="cancel-button" onClick={onClose}>
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;