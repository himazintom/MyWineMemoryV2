/**
 * Analytics Service (Simplified)
 * Placeholder for Firebase Analytics integration
 */

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
  private isEnabled = false;

  constructor() {
    // Analytics disabled by default
    // Enable when Firebase Analytics is properly configured
    this.isEnabled = false;
  }

  // User identification and properties
  setUser(userId: string, properties?: UserProperties) {
    if (!this.isEnabled) return;
    console.log('Analytics: Set user', userId, properties);
  }

  updateUserProperties(properties: UserProperties) {
    if (!this.isEnabled) return;
    console.log('Analytics: Update user properties', properties);
  }

  // Wine-related events
  trackWineRecorded(wineData: {
    wine_type: string;
    country: string;
    rating: number;
    price_range?: string;
    record_mode: 'quick' | 'detailed';
  }) {
    if (!this.isEnabled) return;
    console.log('Analytics: Wine recorded', wineData);
  }

  trackWineDeleted(wineId: string) {
    if (!this.isEnabled) return;
    console.log('Analytics: Wine deleted', wineId);
  }

  trackWineSearched(searchQuery: string, resultCount: number) {
    if (!this.isEnabled) return;
    console.log('Analytics: Wine searched', { searchQuery, resultCount });
  }

  trackWineFiltered(filters: {
    country?: string;
    wine_type?: string;
    price_range?: string;
    rating_min?: number;
  }) {
    if (!this.isEnabled) return;
    console.log('Analytics: Wine filtered', filters);
  }

  // Quiz-related events
  trackQuizStarted(difficulty: number) {
    if (!this.isEnabled) return;
    console.log('Analytics: Quiz started', { difficulty });
  }

  trackQuizCompleted(data: {
    difficulty: number;
    score: number;
    time_spent: number;
    questions_count: number;
  }) {
    if (!this.isEnabled) return;
    console.log('Analytics: Quiz completed', data);
  }

  trackQuizQuestionAnswered(data: {
    question_id: string;
    is_correct: boolean;
    difficulty: number;
    time_spent: number;
  }) {
    if (!this.isEnabled) return;
    console.log('Analytics: Quiz question answered', data);
  }

  // User engagement events
  trackLogin(method: 'google' | 'email') {
    if (!this.isEnabled) return;
    console.log('Analytics: User login', { method });
  }

  trackSignup(method: 'google' | 'email') {
    if (!this.isEnabled) return;
    console.log('Analytics: User signup', { method });
  }

  trackStreakAchieved(streakDays: number) {
    if (!this.isEnabled) return;
    console.log('Analytics: Streak achieved', { streakDays });
  }

  trackBadgeEarned(badgeName: string, level: number) {
    if (!this.isEnabled) return;
    console.log('Analytics: Badge earned', { badgeName, level });
  }

  trackLevelUp(newLevel: number, totalXP: number) {
    if (!this.isEnabled) return;
    console.log('Analytics: Level up', { newLevel, totalXP });
  }

  // Page view tracking
  trackPageView(pageName: string, pageClass?: string) {
    if (!this.isEnabled) return;
    console.log('Analytics: Page view', { pageName, pageClass });
  }

  // Screen view tracking (for PWA)
  trackScreenView(screenName: string, screenClass?: string) {
    if (!this.isEnabled) return;
    console.log('Analytics: Screen view', { screenName, screenClass });
  }

  // Custom events
  trackEvent(eventName: string, eventData?: CustomEventData) {
    if (!this.isEnabled) return;
    console.log('Analytics: Custom event', eventName, eventData);
  }

  // Performance monitoring
  startTrace(traceName: string): { stop: () => void } {
    if (!this.isEnabled) {
      return { stop: () => {} };
    }
    
    console.log('Analytics: Trace started', traceName);
    const startTime = performance.now();
    
    return {
      stop: () => {
        const duration = performance.now() - startTime;
        console.log(`Analytics: Trace completed - ${traceName} (${duration}ms)`);
      }
    };
  }

  measurePerformance(metricName: string, value: number) {
    if (!this.isEnabled) return;
    console.log(`Analytics: Performance metric - ${metricName}: ${value}ms`);
  }

  // Error tracking
  trackError(errorType: string, errorMessage: string, fatal: boolean = false) {
    if (!this.isEnabled) return;
    console.log('Analytics: Error tracked', { errorType, errorMessage, fatal });
  }

  // Conversion events
  trackPurchase(data: {
    wine_id: string;
    price: number;
    currency: string;
  }) {
    if (!this.isEnabled) return;
    console.log('Analytics: Purchase tracked', data);
  }

  // Social sharing
  trackShare(data: {
    content_type: 'wine' | 'badge' | 'achievement';
    item_id: string;
    method: string;
  }) {
    if (!this.isEnabled) return;
    console.log('Analytics: Share tracked', data);
  }

  // Session tracking
  startSession() {
    if (!this.isEnabled) return;
    console.log('Analytics: Session started');
  }

  endSession() {
    if (!this.isEnabled) return;
    console.log('Analytics: Session ended');
  }
}

export const analyticsService = new AnalyticsService();