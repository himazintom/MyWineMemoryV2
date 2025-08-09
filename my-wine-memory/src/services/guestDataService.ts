import type { WineRecord } from '../types';

const GUEST_WINE_RECORDS_KEY = 'guestWineRecords';
const GUEST_QUIZ_RESULTS_KEY = 'guestQuizResults';

export interface GuestWineRecord extends Omit<WineRecord, 'id' | 'userId' | 'createdAt'> {
  tempId: string;
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
  // Wine Records
  saveGuestWineRecord(record: Omit<WineRecord, 'id' | 'userId'>): string {
    const guestRecord: GuestWineRecord = {
      ...record,
      tempId: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: record.createdAt.toISOString()
    };

    const existingRecords = this.getGuestWineRecords();
    existingRecords.push(guestRecord);
    
    localStorage.setItem(GUEST_WINE_RECORDS_KEY, JSON.stringify(existingRecords));
    return guestRecord.tempId;
  }

  getGuestWineRecords(): GuestWineRecord[] {
    try {
      const stored = localStorage.getItem(GUEST_WINE_RECORDS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load guest wine records:', error);
      return [];
    }
  }

  getGuestWineRecordsAsWineRecords(): WineRecord[] {
    return this.getGuestWineRecords().map(guestRecord => ({
      ...guestRecord,
      id: guestRecord.tempId,
      userId: 'guest',
      createdAt: new Date(guestRecord.createdAt)
    }));
  }

  clearGuestWineRecords(): void {
    localStorage.removeItem(GUEST_WINE_RECORDS_KEY);
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
    return this.getGuestWineRecords().length > 0 || this.getGuestQuizResults().length > 0;
  }

  // Get guest data summary for migration prompt
  getGuestDataSummary(): { wineRecords: number; quizResults: number; totalXP: number } {
    const wineRecords = this.getGuestWineRecords();
    const quizResults = this.getGuestQuizResults();
    const totalXP = quizResults.reduce((sum, result) => sum + result.xpEarned, 0);
    
    return {
      wineRecords: wineRecords.length,
      quizResults: quizResults.length,
      totalXP
    };
  }

  // Clear all guest data
  clearAllGuestData(): void {
    this.clearGuestWineRecords();
    this.clearGuestQuizResults();
  }
}

export const guestDataService = new GuestDataService();