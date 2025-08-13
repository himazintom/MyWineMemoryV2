/**
 * Global Error Handler Hook
 * Provides unified error handling with user-friendly messages
 */

import { useState, useCallback } from 'react';

export interface AppError {
  id: string;
  type: 'network' | 'auth' | 'validation' | 'server' | 'unknown';
  message: string;
  userMessage: string;
  timestamp: number;
  retry?: () => Promise<void>;
  details?: any;
}

interface ErrorHandlerState {
  errors: AppError[];
  hasErrors: boolean;
}

export function useErrorHandler() {
  const [state, setState] = useState<ErrorHandlerState>({
    errors: [],
    hasErrors: false
  });

  // Add new error
  const addError = useCallback((error: Omit<AppError, 'id' | 'timestamp'>) => {
    const newError: AppError = {
      ...error,
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    setState(prev => ({
      errors: [...prev.errors, newError],
      hasErrors: true
    }));

    // Auto-remove error after 10 seconds for non-critical errors
    if (newError.type !== 'auth' && newError.type !== 'server') {
      setTimeout(() => {
        removeError(newError.id);
      }, 10000);
    }

    return newError.id;
  }, []);

  // Remove specific error
  const removeError = useCallback((errorId: string) => {
    setState(prev => {
      const filteredErrors = prev.errors.filter(error => error.id !== errorId);
      return {
        errors: filteredErrors,
        hasErrors: filteredErrors.length > 0
      };
    });
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setState({
      errors: [],
      hasErrors: false
    });
  }, []);

  // Handle Firebase errors
  const handleFirebaseError = useCallback((error: any, context: string = '') => {
    let userMessage = 'エラーが発生しました。';
    let type: AppError['type'] = 'server';

    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        userMessage = 'ログイン情報が正しくありません。';
        type = 'auth';
        break;
      case 'auth/too-many-requests':
        userMessage = 'しばらく時間をおいてから再度お試しください。';
        type = 'auth';
        break;
      case 'auth/network-request-failed':
        userMessage = 'ネットワーク接続を確認してください。';
        type = 'network';
        break;
      case 'permission-denied':
        userMessage = 'この操作を実行する権限がありません。';
        type = 'auth';
        break;
      case 'not-found':
        userMessage = '指定されたデータが見つかりません。';
        type = 'validation';
        break;
      case 'unavailable':
        userMessage = 'サービスが一時的に利用できません。';
        type = 'network';
        break;
      case 'deadline-exceeded':
        userMessage = '処理がタイムアウトしました。再度お試しください。';
        type = 'network';
        break;
      default:
        if (error.message?.includes('network')) {
          userMessage = 'ネットワーク接続を確認してください。';
          type = 'network';
        } else if (error.message?.includes('quota')) {
          userMessage = 'サービスの利用上限に達しました。';
          type = 'server';
        }
    }

    return addError({
      type,
      message: `${context}: ${error.code || error.message}`,
      userMessage,
      details: {
        code: error.code,
        context,
        originalMessage: error.message
      }
    });
  }, [addError]);

  // Handle validation errors
  const handleValidationError = useCallback((field: string, message: string) => {
    return addError({
      type: 'validation',
      message: `Validation error: ${field} - ${message}`,
      userMessage: message,
      details: { field }
    });
  }, [addError]);

  // Handle network errors
  const handleNetworkError = useCallback((error: any, retryFunction?: () => Promise<void>) => {
    const isOffline = !navigator.onLine;
    
    return addError({
      type: 'network',
      message: `Network error: ${error.message}`,
      userMessage: isOffline 
        ? 'オフラインです。接続を確認してください。'
        : 'ネットワークエラーが発生しました。',
      retry: retryFunction,
      details: { 
        isOffline,
        originalError: error.message 
      }
    });
  }, [addError]);

  // Handle unknown errors
  const handleUnknownError = useCallback((error: any, context: string = '') => {
    return addError({
      type: 'unknown',
      message: `Unknown error${context ? ` in ${context}` : ''}: ${error.message}`,
      userMessage: '予期しないエラーが発生しました。',
      details: {
        context,
        stack: error.stack,
        originalError: error.message
      }
    });
  }, [addError]);

  // Smart error handler that detects error type
  const handleError = useCallback((error: any, context: string = '', retryFunction?: () => Promise<void>) => {
    // Firebase errors
    if (error.code && (error.code.startsWith('auth/') || error.code.startsWith('firestore/'))) {
      return handleFirebaseError(error, context);
    }

    // Network errors
    if (error.name === 'NetworkError' || error.message?.includes('fetch') || !navigator.onLine) {
      return handleNetworkError(error, retryFunction);
    }

    // Validation errors (custom)
    if (error.name === 'ValidationError') {
      return handleValidationError(error.field || 'unknown', error.message);
    }

    // Default to unknown error
    return handleUnknownError(error, context);
  }, [handleFirebaseError, handleNetworkError, handleValidationError, handleUnknownError]);

  // Retry error function
  const retryError = useCallback(async (errorId: string) => {
    const error = state.errors.find(e => e.id === errorId);
    if (!error || !error.retry) return;

    try {
      await error.retry();
      removeError(errorId);
    } catch (retryError) {
      // Update error with retry failure
      setState(prev => ({
        ...prev,
        errors: prev.errors.map(e => 
          e.id === errorId 
            ? { ...e, userMessage: '再試行に失敗しました。' }
            : e
        )
      }));
    }
  }, [state.errors, removeError]);

  return {
    errors: state.errors,
    hasErrors: state.hasErrors,
    addError,
    removeError,
    clearErrors,
    handleError,
    handleFirebaseError,
    handleValidationError,
    handleNetworkError,
    retryError
  };
}