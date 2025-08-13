/**
 * Firebase Analytics Service
 * Provides analytics tracking and performance monitoring
 */

import { getAnalytics, logEvent, setUserProperties, setUserId } from 'firebase/analytics';
import { getPerformance, trace } from 'firebase/performance';
import { app } from './firebase';

// Initialize Firebase Analytics and Performance
const analytics = getAnalytics(app);
const performance = getPerformance(app);

export interface UserProperties {
  user_id?: string;
  wine_count?: number;
  quiz_level?: number;
  preferred_wine_type?: string;
  streak_days?: number;
}

export interface CustomEventData {
  [key: string]: string | number | boolean;
}

class AnalyticsService {
  // User identification and properties
  setUser(userId: string, properties?: UserProperties) {
    try {
      setUserId(analytics, userId);
      
      if (properties) {
        setUserProperties(analytics, properties);
      }
    } catch (error) {
      console.error('Failed to set user analytics:', error);
    }
  }

  updateUserProperties(properties: UserProperties) {
    try {
      setUserProperties(analytics, properties);
    } catch (error) {
      console.error('Failed to update user properties:', error);
    }
  }

  // Wine-related events
  trackWineRecorded(wineData: {
    wine_type: string;
    recording_mode: 'quick' | 'detailed';
    rating: number;
    has_images: boolean;
  }) {
    try {
      logEvent(analytics, 'wine_recorded', {
        wine_type: wineData.wine_type,
        recording_mode: wineData.recording_mode,
        rating: Math.floor(wineData.rating),
        has_images: wineData.has_images,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Failed to track wine recording:', error);
    }
  }

  trackWineSearch(searchData: {
    search_term?: string;
    filters_used: string[];
    results_count: number;
  }) {
    try {
      logEvent(analytics, 'wine_search', {
        search_term: searchData.search_term || '',
        filters_count: searchData.filters_used.length,
        results_count: searchData.results_count,
        filters_used: searchData.filters_used.join(',')
      });
    } catch (error) {
      console.error('Failed to track wine search:', error);
    }
  }

  trackWineView(wineData: {
    wine_id: string;
    wine_type: string;
    view_source: 'search' | 'records' | 'direct';
  }) {
    try {
      logEvent(analytics, 'wine_view', {
        wine_id: wineData.wine_id,
        wine_type: wineData.wine_type,
        view_source: wineData.view_source
      });
    } catch (error) {
      console.error('Failed to track wine view:', error);
    }
  }

  // Quiz-related events
  trackQuizStarted(quizData: {
    difficulty: number;
    quiz_type: 'random' | 'personal';
  }) {
    try {
      logEvent(analytics, 'quiz_started', {
        difficulty: quizData.difficulty,
        quiz_type: quizData.quiz_type
      });
    } catch (error) {
      console.error('Failed to track quiz start:', error);
    }
  }

  trackQuizCompleted(quizData: {
    difficulty: number;
    score: number;
    total_questions: number;
    time_spent: number; // in seconds
  }) {
    try {
      logEvent(analytics, 'quiz_completed', {
        difficulty: quizData.difficulty,
        score: quizData.score,
        total_questions: quizData.total_questions,
        time_spent: quizData.time_spent,
        accuracy: Math.round((quizData.score / quizData.total_questions) * 100)
      });
    } catch (error) {
      console.error('Failed to track quiz completion:', error);
    }
  }

  // User engagement events
  trackPageView(pageName: string, additionalData?: CustomEventData) {
    try {
      logEvent(analytics, 'page_view', {
        page_title: pageName,
        page_location: window.location.pathname,
        ...additionalData
      });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }

  trackFeatureUsage(featureName: string, action: string, additionalData?: CustomEventData) {
    try {
      logEvent(analytics, 'feature_usage', {
        feature_name: featureName,
        action: action,
        ...additionalData
      });
    } catch (error) {
      console.error('Failed to track feature usage:', error);
    }
  }

  trackUserEngagement(engagementData: {
    session_duration?: number;
    pages_visited?: number;
    actions_taken?: number;
  }) {
    try {
      logEvent(analytics, 'user_engagement', engagementData);
    } catch (error) {
      console.error('Failed to track user engagement:', error);
    }
  }

  // Error tracking
  trackError(errorData: {
    error_type: string;
    error_message: string;
    error_context?: string;
    user_action?: string;
  }) {
    try {
      logEvent(analytics, 'app_error', {
        error_type: errorData.error_type,
        error_message: errorData.error_message.substring(0, 100), // Limit message length
        error_context: errorData.error_context || '',
        user_action: errorData.user_action || ''
      });
    } catch (error) {
      console.error('Failed to track error:', error);
    }
  }

  // Performance tracking
  trackPerformance(metricName: string, value: number, unit: string = 'ms') {
    try {
      logEvent(analytics, 'performance_metric', {
        metric_name: metricName,
        metric_value: value,
        metric_unit: unit
      });
    } catch (error) {
      console.error('Failed to track performance:', error);
    }
  }

  // Firebase Performance Monitoring
  startTrace(traceName: string) {
    try {
      return trace(performance, traceName);
    } catch (error) {
      console.error('Failed to start performance trace:', error);
      return null;
    }
  }

  // Conversion events
  trackConversion(conversionData: {
    conversion_type: 'user_registration' | 'first_wine_record' | 'quiz_completion' | 'feature_discovery';
    value?: number;
    currency?: string;
  }) {
    try {
      logEvent(analytics, 'conversion', {
        conversion_type: conversionData.conversion_type,
        value: conversionData.value || 0,
        currency: conversionData.currency || 'JPY'
      });
    } catch (error) {
      console.error('Failed to track conversion:', error);
    }
  }

  // Custom events
  trackCustomEvent(eventName: string, eventData: CustomEventData) {
    try {
      logEvent(analytics, eventName, eventData);
    } catch (error) {
      console.error('Failed to track custom event:', error);
    }
  }

  // Batch tracking for offline support
  private eventQueue: Array<{ eventName: string; eventData: any }> = [];

  queueEvent(eventName: string, eventData: any) {
    this.eventQueue.push({ eventName, eventData });
    
    // Limit queue size
    if (this.eventQueue.length > 50) {
      this.eventQueue.shift();
    }
  }

  flushEventQueue() {
    try {
      this.eventQueue.forEach(({ eventName, eventData }) => {
        logEvent(analytics, eventName, eventData);
      });
      this.eventQueue = [];
    } catch (error) {
      console.error('Failed to flush event queue:', error);
    }
  }

  // Privacy and compliance
  setAnalyticsEnabled(enabled: boolean) {
    try {
      // Note: This would require additional Firebase configuration
      // For now, we'll just log the preference
      console.log(`Analytics ${enabled ? 'enabled' : 'disabled'}`);
      
      if (enabled) {
        this.flushEventQueue();
      }
    } catch (error) {
      console.error('Failed to set analytics preference:', error);
    }
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();

// Performance monitoring utilities
export class PerformanceMonitor {
  private static traces: Map<string, any> = new Map();

  static startMeasure(name: string) {
    try {
      const performanceTrace = trace(performance, name);
      performanceTrace.start();
      this.traces.set(name, performanceTrace);
      
      // Also use browser Performance API as fallback
      if (typeof window !== 'undefined' && window.performance) {
        window.performance.mark(`${name}-start`);
      }
    } catch (error) {
      console.error('Failed to start performance measure:', error);
    }
  }

  static stopMeasure(name: string, metadata?: Record<string, string>) {
    try {
      const performanceTrace = this.traces.get(name);
      if (performanceTrace) {
        if (metadata) {
          Object.entries(metadata).forEach(([key, value]) => {
            performanceTrace.putAttribute(key, value);
          });
        }
        performanceTrace.stop();
        this.traces.delete(name);
      }

      // Browser Performance API
      if (typeof window !== 'undefined' && window.performance) {
        window.performance.mark(`${name}-end`);
        window.performance.measure(name, `${name}-start`, `${name}-end`);
        
        const measures = window.performance.getEntriesByName(name, 'measure');
        if (measures.length > 0) {
          const duration = measures[measures.length - 1].duration;
          analyticsService.trackPerformance(name, Math.round(duration));
        }
      }
    } catch (error) {
      console.error('Failed to stop performance measure:', error);
    }
  }

  static measureAsync<T>(name: string, asyncOperation: () => Promise<T>, metadata?: Record<string, string>): Promise<T> {
    this.startMeasure(name);
    
    return asyncOperation()
      .finally(() => {
        this.stopMeasure(name, metadata);
      });
  }
}

// Hook for React components
export function useAnalytics() {
  return {
    trackPageView: analyticsService.trackPageView.bind(analyticsService),
    trackFeatureUsage: analyticsService.trackFeatureUsage.bind(analyticsService),
    trackWineRecorded: analyticsService.trackWineRecorded.bind(analyticsService),
    trackWineSearch: analyticsService.trackWineSearch.bind(analyticsService),
    trackQuizStarted: analyticsService.trackQuizStarted.bind(analyticsService),
    trackQuizCompleted: analyticsService.trackQuizCompleted.bind(analyticsService),
    trackError: analyticsService.trackError.bind(analyticsService),
    trackConversion: analyticsService.trackConversion.bind(analyticsService),
    startMeasure: PerformanceMonitor.startMeasure.bind(PerformanceMonitor),
    stopMeasure: PerformanceMonitor.stopMeasure.bind(PerformanceMonitor),
    measureAsync: PerformanceMonitor.measureAsync.bind(PerformanceMonitor)
  };
}