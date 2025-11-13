/**
 * Error Boundary Component
 * Catches React errors and provides fallback UI
 */

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { logger } from '../utils/logger';
import { isOperationalError } from '../utils/errors';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary to catch and handle React component errors
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error with context
    logger.error('React Error Boundary caught error', error, {
      componentStack: errorInfo.componentStack,
      operational: isOperationalError(error),
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      // Default fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h1 className="error-boundary-title">問題が発生しました</h1>
            <p className="error-boundary-message">
              申し訳ございません。予期しないエラーが発生しました。
            </p>

            {import.meta.env.DEV && (
              <details className="error-boundary-details">
                <summary>エラー詳細（開発モード）</summary>
                <pre className="error-boundary-stack">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="error-boundary-actions">
              <button
                className="action-button primary"
                onClick={this.reset}
              >
                リトライ
              </button>
              <button
                className="action-button secondary"
                onClick={() => window.location.href = '/'}
              >
                ホームに戻る
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component
 */
export const ErrorFallback: React.FC<{
  error: Error;
  onReset: () => void;
}> = ({ error, onReset }) => {
  return (
    <div className="error-fallback">
      <div className="error-fallback-content">
        <h2>エラーが発生しました</h2>
        <p>{error.message}</p>

        <div className="error-fallback-actions">
          <button className="action-button primary" onClick={onReset}>
            リトライ
          </button>
          <button
            className="action-button secondary"
            onClick={() => window.location.href = '/'}
          >
            ホームに戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
