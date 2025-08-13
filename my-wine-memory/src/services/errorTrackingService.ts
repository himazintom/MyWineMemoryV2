/**
 * Error Tracking Service with Sentry
 * Provides comprehensive error monitoring and reporting
 */

import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

interface UserContext {
  id: string;
  email?: string;
  wineCount?: number;
  memberSince?: string;
}

interface ErrorContext {
  component?: string;
  action?: string;
  wineId?: string;
  userId?: string;
  route?: string;
  userAgent?: string;
  timestamp?: number;
}

class ErrorTrackingService {
  private isInitialized = false;

  initialize(options: {
    dsn?: string;
    environment: string;
    release?: string;
    userId?: string;
  }) {
    if (this.isInitialized) return;

    try {
      Sentry.init({
        dsn: options.dsn || process.env.VITE_SENTRY_DSN,
        environment: options.environment,
        release: options.release || process.env.VITE_BUILD_VERSION,
        
        integrations: [
          new Integrations.BrowserTracing({
            // Capture interactions like clicks, navigations
            routingInstrumentation: Sentry.reactRouterV6Instrumentation(
              React.useEffect,
              useLocation,
              useNavigationType,
              createRoutesFromChildren,
              matchRoutes
            ),
          }),
        ],

        // Performance monitoring
        tracesSampleRate: options.environment === 'production' ? 0.1 : 1.0,
        
        // Error sampling
        sampleRate: options.environment === 'production' ? 0.8 : 1.0,

        // Before sending events
        beforeSend(event, hint) {
          // Filter out known non-critical errors
          if (event.exception) {
            const error = hint.originalException;
            
            // Filter out network errors in development
            if (options.environment === 'development' && 
                error instanceof Error && 
                error.message.includes('Failed to fetch')) {
              return null;
            }

            // Filter out React hydration errors (common and usually harmless)
            if (error instanceof Error && 
                error.message.includes('Hydration')) {
              return null;
            }
          }

          return event;
        },

        // Privacy considerations
        beforeBreadcrumb(breadcrumb) {
          // Remove sensitive data from breadcrumbs
          if (breadcrumb.category === 'xhr' || breadcrumb.category === 'fetch') {
            // Remove sensitive headers or data
            if (breadcrumb.data?.url) {
              breadcrumb.data.url = this.sanitizeUrl(breadcrumb.data.url);
            }
          }
          return breadcrumb;
        },
      });

      // Set initial user context if provided
      if (options.userId) {
        this.setUser({ id: options.userId });
      }

      this.isInitialized = true;
      console.log('Error tracking initialized');
    } catch (error) {
      console.error('Failed to initialize error tracking:', error);
    }
  }

  setUser(user: UserContext) {
    try {
      Sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.id,
        wine_count: user.wineCount,
        member_since: user.memberSince,
      });
    } catch (error) {
      console.error('Failed to set user context:', error);
    }
  }

  setContext(contextName: string, context: Record<string, any>) {
    try {
      Sentry.setContext(contextName, context);
    } catch (error) {
      console.error('Failed to set context:', error);
    }
  }

  // Manual error reporting
  captureError(error: Error, context?: ErrorContext, level: Sentry.Severity = Sentry.Severity.Error) {
    try {
      Sentry.withScope((scope) => {
        scope.setLevel(level);
        
        if (context) {
          scope.setContext('error_context', {
            ...context,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            url: window.location.href,
          });

          // Set tags for better filtering
          if (context.component) scope.setTag('component', context.component);
          if (context.action) scope.setTag('action', context.action);
          if (context.route) scope.setTag('route', context.route);
        }

        Sentry.captureException(error);
      });
    } catch (captureError) {
      console.error('Failed to capture error:', captureError);
    }
  }

  // Capture messages (warnings, info)
  captureMessage(message: string, level: Sentry.Severity = Sentry.Severity.Info, context?: ErrorContext) {
    try {
      Sentry.withScope((scope) => {
        scope.setLevel(level);
        
        if (context) {
          scope.setContext('message_context', context);
        }

        Sentry.captureMessage(message);
      });
    } catch (error) {
      console.error('Failed to capture message:', error);
    }
  }

  // Wine-specific error tracking
  captureWineError(error: Error, wineContext: {
    wineId?: string;
    action: 'create' | 'update' | 'delete' | 'view' | 'search';
    component: string;
    additionalData?: Record<string, any>;
  }) {
    this.captureError(error, {
      component: wineContext.component,
      action: `wine_${wineContext.action}`,
      wineId: wineContext.wineId,
      ...wineContext.additionalData,
    });
  }

  // Quiz-specific error tracking
  captureQuizError(error: Error, quizContext: {
    difficulty?: number;
    questionIndex?: number;
    action: 'start' | 'answer' | 'complete' | 'load';
    component: string;
  }) {
    this.captureError(error, {
      component: quizContext.component,
      action: `quiz_${quizContext.action}`,
      difficulty: quizContext.difficulty?.toString(),
      questionIndex: quizContext.questionIndex?.toString(),
    });
  }

  // Firebase-specific error tracking
  captureFirebaseError(error: any, operation: string, context?: Record<string, any>) {
    const firebaseContext: ErrorContext = {
      component: 'firebase',
      action: operation,
      ...context,
    };

    // Add Firebase-specific context
    if (error.code) {
      this.setContext('firebase_error', {
        code: error.code,
        message: error.message,
        operation,
      });
    }

    this.captureError(error, firebaseContext);
  }

  // Performance issue tracking
  capturePerformanceIssue(metricName: string, value: number, threshold: number, context?: Record<string, any>) {
    if (value > threshold) {
      this.captureMessage(
        `Performance issue: ${metricName} took ${value}ms (threshold: ${threshold}ms)`,
        Sentry.Severity.Warning,
        {
          component: 'performance',
          action: 'threshold_exceeded',
          metricName,
          value: value.toString(),
          threshold: threshold.toString(),
          ...context,
        }
      );
    }
  }

  // Breadcrumbs for debugging context
  addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
    try {
      Sentry.addBreadcrumb({
        message,
        category,
        data,
        timestamp: Date.now() / 1000,
      });
    } catch (error) {
      console.error('Failed to add breadcrumb:', error);
    }
  }

  // User feedback collection
  showUserFeedbackDialog() {
    try {
      const eventId = Sentry.captureMessage('User feedback requested');
      Sentry.showReportDialog({
        eventId,
        title: 'エラーの報告',
        subtitle: 'エラーの詳細を教えてください',
        subtitle2: '修正のためにフィードバックをお聞かせください',
        labelName: 'お名前',
        labelEmail: 'メールアドレス',
        labelComments: 'コメント',
        labelClose: '閉じる',
        labelSubmit: '送信',
        errorGeneric: 'エラーが発生しました。再度お試しください。',
        errorFormEntry: '入力内容に問題があります。',
        successMessage: 'フィードバックをありがとうございました！',
      });
    } catch (error) {
      console.error('Failed to show feedback dialog:', error);
    }
  }

  // Custom fingerprinting for error grouping
  setFingerprint(fingerprint: string[]) {
    try {
      Sentry.configureScope((scope) => {
        scope.setFingerprint(fingerprint);
      });
    } catch (error) {
      console.error('Failed to set fingerprint:', error);
    }
  }

  // Utility methods
  private sanitizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Remove sensitive query parameters
      urlObj.searchParams.delete('token');
      urlObj.searchParams.delete('apiKey');
      urlObj.searchParams.delete('key');
      return urlObj.toString();
    } catch {
      return '[sanitized-url]';
    }
  }

  // Session management
  startSession() {
    try {
      this.addBreadcrumb('Session started', 'navigation');
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  }

  endSession() {
    try {
      this.addBreadcrumb('Session ended', 'navigation');
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  }

  // Flush pending events (useful before page unload)
  async flush(timeout: number = 5000): Promise<boolean> {
    try {
      return await Sentry.flush(timeout);
    } catch (error) {
      console.error('Failed to flush Sentry events:', error);
      return false;
    }
  }
}

// Export singleton instance
export const errorTrackingService = new ErrorTrackingService();

// React Error Boundary integration
export const SentryErrorBoundary = Sentry.withErrorBoundary;

// Hook for React components
export function useErrorTracking() {
  return {
    captureError: errorTrackingService.captureError.bind(errorTrackingService),
    captureMessage: errorTrackingService.captureMessage.bind(errorTrackingService),
    captureWineError: errorTrackingService.captureWineError.bind(errorTrackingService),
    captureQuizError: errorTrackingService.captureQuizError.bind(errorTrackingService),
    captureFirebaseError: errorTrackingService.captureFirebaseError.bind(errorTrackingService),
    addBreadcrumb: errorTrackingService.addBreadcrumb.bind(errorTrackingService),
    showFeedbackDialog: errorTrackingService.showUserFeedbackDialog.bind(errorTrackingService),
  };
}

// Decorator for automatic error capture in async functions
export function withErrorCapture<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context: ErrorContext
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorTrackingService.captureError(error as Error, context);
      throw error;
    }
  }) as T;
}

// Import required React Router types for Sentry integration
import React, { useEffect } from 'react';
import { 
  useLocation, 
  useNavigationType, 
  createRoutesFromChildren, 
  matchRoutes 
} from 'react-router-dom';