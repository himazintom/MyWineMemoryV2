/**
 * Error Handler Hook Tests
 */

import { renderHook, act } from '@testing-library/react';
import { useErrorHandler } from './useErrorHandler';

describe('useErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with empty error state', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    expect(result.current.errors).toHaveLength(0);
    expect(result.current.hasErrors).toBe(false);
  });

  it('should add error correctly', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    act(() => {
      result.current.addError({
        type: 'validation',
        message: 'Test error',
        userMessage: 'ユーザーエラー'
      });
    });

    expect(result.current.errors).toHaveLength(1);
    expect(result.current.hasErrors).toBe(true);
    expect(result.current.errors[0].userMessage).toBe('ユーザーエラー');
    expect(result.current.errors[0].type).toBe('validation');
  });

  it('should remove error correctly', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    let errorId: string;
    act(() => {
      errorId = result.current.addError({
        type: 'network',
        message: 'Network error',
        userMessage: 'ネットワークエラー'
      });
    });

    expect(result.current.errors).toHaveLength(1);

    act(() => {
      result.current.removeError(errorId);
    });

    expect(result.current.errors).toHaveLength(0);
    expect(result.current.hasErrors).toBe(false);
  });

  it('should clear all errors', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    act(() => {
      result.current.addError({
        type: 'auth',
        message: 'Auth error 1',
        userMessage: 'ユーザーエラー1'
      });
      result.current.addError({
        type: 'server',
        message: 'Server error 2',
        userMessage: 'ユーザーエラー2'
      });
    });

    expect(result.current.errors).toHaveLength(2);

    act(() => {
      result.current.clearErrors();
    });

    expect(result.current.errors).toHaveLength(0);
    expect(result.current.hasErrors).toBe(false);
  });

  it('should handle Firebase authentication errors', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    const firebaseError = {
      code: 'auth/user-not-found',
      message: 'User not found'
    };

    act(() => {
      result.current.handleFirebaseError(firebaseError, 'login');
    });

    expect(result.current.errors).toHaveLength(1);
    expect(result.current.errors[0].type).toBe('auth');
    expect(result.current.errors[0].userMessage).toBe('ログイン情報が正しくありません。');
  });

  it('should handle Firebase network errors', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    const firebaseError = {
      code: 'auth/network-request-failed',
      message: 'Network request failed'
    };

    act(() => {
      result.current.handleFirebaseError(firebaseError);
    });

    expect(result.current.errors).toHaveLength(1);
    expect(result.current.errors[0].type).toBe('network');
    expect(result.current.errors[0].userMessage).toBe('ネットワーク接続を確認してください。');
  });

  it('should handle validation errors', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    act(() => {
      result.current.handleValidationError('email', 'メールアドレスが無効です');
    });

    expect(result.current.errors).toHaveLength(1);
    expect(result.current.errors[0].type).toBe('validation');
    expect(result.current.errors[0].userMessage).toBe('メールアドレスが無効です');
    expect(result.current.errors[0].details?.field).toBe('email');
  });

  it('should handle network errors with retry function', () => {
    const { result } = renderHook(() => useErrorHandler());
    const retryFunction = jest.fn().mockResolvedValue(undefined);
    
    const networkError = new Error('Fetch failed');
    networkError.name = 'NetworkError';

    act(() => {
      result.current.handleNetworkError(networkError, retryFunction);
    });

    expect(result.current.errors).toHaveLength(1);
    expect(result.current.errors[0].type).toBe('network');
    expect(result.current.errors[0].retry).toBe(retryFunction);
  });

  it('should auto-remove non-critical errors after timeout', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    act(() => {
      result.current.addError({
        type: 'validation',
        message: 'Validation error',
        userMessage: 'バリデーションエラー'
      });
    });

    expect(result.current.errors).toHaveLength(1);

    // Fast-forward time by 10 seconds
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.errors).toHaveLength(0);
  });

  it('should not auto-remove critical errors', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    act(() => {
      result.current.addError({
        type: 'auth',
        message: 'Authentication error',
        userMessage: '認証エラー'
      });
    });

    expect(result.current.errors).toHaveLength(1);

    // Fast-forward time by 10 seconds
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    // Auth errors should not be auto-removed
    expect(result.current.errors).toHaveLength(1);
  });

  it('should handle smart error detection', () => {
    const { result } = renderHook(() => useErrorHandler());
    
    // Test Firebase error detection
    const firebaseError = {
      code: 'firestore/permission-denied',
      message: 'Permission denied'
    };

    act(() => {
      result.current.handleError(firebaseError, 'data access');
    });

    expect(result.current.errors).toHaveLength(1);
    expect(result.current.errors[0].type).toBe('auth');

    // Test network error detection
    const networkError = new Error('Failed to fetch');
    networkError.name = 'NetworkError';

    act(() => {
      result.current.handleError(networkError, 'API call');
    });

    expect(result.current.errors).toHaveLength(2);
    expect(result.current.errors[1].type).toBe('network');
  });

  it('should retry errors successfully', async () => {
    const { result } = renderHook(() => useErrorHandler());
    const retryFunction = jest.fn().mockResolvedValue(undefined);
    
    let errorId: string;
    act(() => {
      errorId = result.current.addError({
        type: 'network',
        message: 'Network error',
        userMessage: 'ネットワークエラー',
        retry: retryFunction
      });
    });

    expect(result.current.errors).toHaveLength(1);

    await act(async () => {
      await result.current.retryError(errorId);
    });

    expect(retryFunction).toHaveBeenCalled();
    expect(result.current.errors).toHaveLength(0);
  });

  it('should handle retry failures', async () => {
    const { result } = renderHook(() => useErrorHandler());
    const retryFunction = jest.fn().mockRejectedValue(new Error('Retry failed'));
    
    let errorId: string;
    act(() => {
      errorId = result.current.addError({
        type: 'network',
        message: 'Network error',
        userMessage: 'ネットワークエラー',
        retry: retryFunction
      });
    });

    await act(async () => {
      await result.current.retryError(errorId);
    });

    expect(retryFunction).toHaveBeenCalled();
    expect(result.current.errors).toHaveLength(1);
    expect(result.current.errors[0].userMessage).toBe('再試行に失敗しました。');
  });
});