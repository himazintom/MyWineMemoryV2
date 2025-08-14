/**
 * Error Tracking Service (Simplified)
 * Placeholder for Sentry integration
 */

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
    
    // Sentry integration disabled for now
    // Will be implemented when Sentry is properly configured
    console.log('Error tracking service initialized (mock)', options);
    this.isInitialized = true;
  }

  setUser(user: UserContext | null) {
    if (!this.isInitialized) return;
    console.log('User context set (mock)', user);
  }

  captureException(error: Error, context?: ErrorContext) {
    console.error('Error captured (mock):', error, context);
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    console.log(`Message captured (mock) [${level}]:`, message);
  }

  addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: string;
    data?: Record<string, unknown>;
  }) {
    console.log('Breadcrumb added (mock):', breadcrumb);
  }

  startSession() {
    console.log('Session started (mock)');
  }

  endSession() {
    console.log('Session ended (mock)');
  }

  setContext(context: ErrorContext) {
    console.log('Context set (mock):', context);
  }

  withScope(callback: (scope: any) => void) {
    // Mock scope
    const mockScope = {
      setTag: () => {},
      setContext: () => {},
      setLevel: () => {}
    };
    callback(mockScope);
  }

  // Performance monitoring
  startTransaction(name: string, op: string) {
    console.log(`Transaction started (mock): ${name} [${op}]`);
    return {
      finish: () => console.log(`Transaction finished (mock): ${name}`)
    };
  }

  // Error boundary component (React)
  ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };

  // Quiz-specific error tracking
  trackQuizError(error: Error, quizContext: {
    questionId: string;
    difficulty: number;
    userAnswer?: string;
  }) {
    this.captureException(error, {
      component: 'Quiz',
      action: 'answer_submission',
      ...quizContext as any
    });
  }

  // Wine record error tracking
  trackWineRecordError(error: Error, wineContext: {
    wineId?: string;
    action: 'create' | 'update' | 'delete';
  }) {
    this.captureException(error, {
      component: 'WineRecord',
      ...wineContext
    });
  }

  // Network error tracking
  trackNetworkError(error: Error, requestContext: {
    url: string;
    method: string;
    statusCode?: number;
  }) {
    this.captureException(error, {
      component: 'Network',
      action: 'api_request',
      ...requestContext as any
    });
  }

  // Performance metrics
  measurePerformance(metricName: string, value: number, unit: string = 'ms') {
    console.log(`Performance metric (mock): ${metricName} = ${value}${unit}`);
  }
}

export const errorTrackingService = new ErrorTrackingService();