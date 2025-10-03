import type { WineMaster, TastingRecord } from '../types';

const GUEST_TASTING_RECORDS_KEY = 'guestTastingRecords';
const GUEST_QUIZ_RESULTS_KEY = 'guestQuizResults';

// Guest data structure combining wine info + tasting data for easy migration
export interface GuestTastingRecord {
  tempId: string;
  // WineMaster data
  wineData: Omit<WineMaster, 'id' | 'createdAt' | 'createdBy' | 'referenceCount' | 'updatedAt'>;
  // TastingRecord data
  tastingData: Omit<TastingRecord, 'id' | 'userId' | 'wineId' | 'createdAt' | 'updatedAt'>;
  createdAt: string; // ISO string for localStorage
}

export interface GuestQuizResult {
  tempId: string;
  difficulty: number;
  correctAnswers: number;
  totalQuestions: number;
  xpEarned: number;
  completedAt: string; // ISO string
}

class GuestDataService {
  // Tasting Records (new architecture)
  saveGuestTastingRecord(
    wineData: Omit<WineMaster, 'id' | 'createdAt' | 'createdBy' | 'referenceCount' | 'updatedAt'>,
    tastingData: Omit<TastingRecord, 'id' | 'userId' | 'wineId' | 'createdAt' | 'updatedAt'>
  ): string {
    const guestRecord: GuestTastingRecord = {
      tempId: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      wineData,
      tastingData,
      createdAt: new Date().toISOString()
    };

    const existingRecords = this.getGuestTastingRecords();
    existingRecords.push(guestRecord);

    localStorage.setItem(GUEST_TASTING_RECORDS_KEY, JSON.stringify(existingRecords));
    return guestRecord.tempId;
  }

  getGuestTastingRecords(): GuestTastingRecord[] {
    try {
      const stored = localStorage.getItem(GUEST_TASTING_RECORDS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load guest tasting records:', error);
      return [];
    }
  }

  clearGuestTastingRecords(): void {
    localStorage.removeItem(GUEST_TASTING_RECORDS_KEY);
  }

  // Quiz Results
  saveGuestQuizResult(difficulty: number, correctAnswers: number, totalQuestions: number, xpEarned: number): string {
    const guestResult: GuestQuizResult = {
      tempId: `guest_quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      difficulty,
      correctAnswers,
      totalQuestions,
      xpEarned,
      completedAt: new Date().toISOString()
    };

    const existingResults = this.getGuestQuizResults();
    existingResults.push(guestResult);
    
    localStorage.setItem(GUEST_QUIZ_RESULTS_KEY, JSON.stringify(existingResults));
    return guestResult.tempId;
  }

  getGuestQuizResults(): GuestQuizResult[] {
    try {
      const stored = localStorage.getItem(GUEST_QUIZ_RESULTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load guest quiz results:', error);
      return [];
    }
  }

  clearGuestQuizResults(): void {
    localStorage.removeItem(GUEST_QUIZ_RESULTS_KEY);
  }

  // Check if there's any guest data
  hasGuestData(): boolean {
    return this.getGuestTastingRecords().length > 0 || this.getGuestQuizResults().length > 0;
  }

  // Get guest data summary for migration prompt
  getGuestDataSummary(): { tastingRecords: number; quizResults: number; totalXP: number } {
    const tastingRecords = this.getGuestTastingRecords();
    const quizResults = this.getGuestQuizResults();
    const totalXP = quizResults.reduce((sum, result) => sum + result.xpEarned, 0);

    return {
      tastingRecords: tastingRecords.length,
      quizResults: quizResults.length,
      totalXP
    };
  }

  // Clear all guest data
  clearAllGuestData(): void {
    this.clearGuestTastingRecords();
    this.clearGuestQuizResults();
  }
}

export const guestDataService = new GuestDataService();