/**
 * Advanced Quiz Service
 * Handles weighted question selection, level progression, and spaced repetition
 */

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc,
  updateDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  runTransaction
} from 'firebase/firestore';
import { db } from './firebase';
import type { QuizQuestion } from '../types';
import { loadQuestionsByLevel } from '../data/quiz';

// Types
export type LevelMode = 'FIRST_ROUND' | 'REVIEW_MODE' | 'MASTER_MODE';
export type ChallengeMode = 'TIME_ATTACK' | 'PERFECT_RUN' | 'RANDOM_100' | 'BLIND_TEST';

export interface QuestionWeight {
  cleared: number;
  unsolved: number;
  wrong: number;
}

export interface LevelProgress {
  userId: string;
  level: number;
  mode: LevelMode;
  rounds: number;
  totalQuestions: number;
  clearedQuestions: string[];
  unsolvedQuestions: string[];
  wrongQuestions: string[];
  completionRate: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  perfectClearCount: number;
  lastPerfectClearAt?: Date;
  lastPlayedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WrongAnswerHistory {
  id: string;
  userId: string;
  questionId: string;
  level: number;
  question?: string;
  totalWrongCount: number;
  recentWrongCount: number;
  lastWrongAt: Date;
  resolvedCount: number;
  lastResolvedAt?: Date;
  difficultyScore: number;
  nextReviewAt: Date;
  reviewInterval: number;
}

export interface LevelStatistics {
  userId: string;
  level: number;
  totalAttempts: number;
  totalQuestionsAnswered: number;
  averageAccuracy: number;
  bestStreak: number;
  currentStreak: number;
  fastestTime?: number;
  mostDifficultQuestionId?: string;
  favoriteQuestionId?: string;
  playCount: Record<string, number>;
  lastUpdated: Date;
}

// Review intervals in days
const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 90];

class AdvancedQuizService {
  private progressCollection = collection(db, 'level_progress');
  private historyCollection = collection(db, 'wrong_answer_history');
  private statsCollection = collection(db, 'level_statistics');

  // Initialize level progress for a user
  async initializeLevelProgress(userId: string, level: number): Promise<LevelProgress> {
    console.log(`[initializeLevelProgress] Initializing level ${level} for user ${userId}`);

    const questions = await loadQuestionsByLevel(level);
    console.log(`[initializeLevelProgress] Loaded ${questions.length} questions for level ${level}`);

    const questionIds = questions.map(q => q.id);

    const progress: LevelProgress = {
      userId,
      level,
      mode: 'FIRST_ROUND',
      rounds: 0,
      totalQuestions: questions.length,
      clearedQuestions: [],
      unsolvedQuestions: questionIds,
      wrongQuestions: [],
      completionRate: 0,
      isUnlocked: level === 1, // Level 1 is always unlocked
      unlockedAt: level === 1 ? new Date() : undefined,
      perfectClearCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log(`[initializeLevelProgress] Progress initialized:`, {
      level,
      totalQuestions: progress.totalQuestions,
      isUnlocked: progress.isUnlocked
    });

    await setDoc(doc(this.progressCollection, `${userId}_${level}`), {
      ...progress,
      unlockedAt: progress.unlockedAt ? Timestamp.fromDate(progress.unlockedAt) : null,
      createdAt: Timestamp.fromDate(progress.createdAt),
      updatedAt: Timestamp.fromDate(progress.updatedAt)
    });

    return progress;
  }

  // Get level progress
  async getLevelProgress(userId: string, level: number): Promise<LevelProgress | null> {
    try {
      const docRef = doc(this.progressCollection, `${userId}_${level}`);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return await this.initializeLevelProgress(userId, level);
      }
      
      const data = docSnap.data();
      return {
        ...data,
        unlockedAt: data.unlockedAt?.toDate(),
        lastPerfectClearAt: data.lastPerfectClearAt?.toDate(),
        lastPlayedAt: data.lastPlayedAt?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as LevelProgress;
    } catch (error) {
      console.error('Failed to get level progress:', error);
      return null;
    }
  }

  // Get all level progress for a user
  async getAllLevelProgress(userId: string): Promise<LevelProgress[]> {
    try {
      const q = query(
        this.progressCollection,
        where('userId', '==', userId),
        orderBy('level')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          unlockedAt: data.unlockedAt?.toDate(),
          lastPerfectClearAt: data.lastPerfectClearAt?.toDate(),
          lastPlayedAt: data.lastPlayedAt?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as LevelProgress;
      });
    } catch (error) {
      console.error('Failed to get all level progress:', error);
      return [];
    }
  }

  // Select questions with weighted probability
  async selectQuestionsForLevel(
    userId: string,
    level: number,
    count: number = 10
  ): Promise<QuizQuestion[]> {
    console.log(`[selectQuestionsForLevel] Starting for level ${level}, userId: ${userId}`);

    const progress = await this.getLevelProgress(userId, level);
    if (!progress) {
      console.error(`[selectQuestionsForLevel] No progress found for level ${level}`);
      return [];
    }

    console.log(`[selectQuestionsForLevel] Progress loaded:`, {
      mode: progress.mode,
      totalQuestions: progress.totalQuestions,
      cleared: progress.clearedQuestions.length,
      unsolved: progress.unsolvedQuestions.length,
      wrong: progress.wrongQuestions.length
    });

    const weights = this.getQuestionWeights(progress);
    console.log(`[selectQuestionsForLevel] Weights:`, weights);

    const allQuestions = await loadQuestionsByLevel(level);
    console.log(`[selectQuestionsForLevel] Loaded ${allQuestions.length} questions for level ${level}`);

    // Categorize questions
    const clearedQuestions = allQuestions.filter(q =>
      progress.clearedQuestions.includes(q.id)
    );
    const unsolvedQuestions = allQuestions.filter(q =>
      progress.unsolvedQuestions.includes(q.id)
    );
    const wrongQuestions = allQuestions.filter(q =>
      progress.wrongQuestions.includes(q.id)
    );

    console.log(`[selectQuestionsForLevel] Categorized questions:`, {
      cleared: clearedQuestions.length,
      unsolved: unsolvedQuestions.length,
      wrong: wrongQuestions.length,
      total: clearedQuestions.length + unsolvedQuestions.length + wrongQuestions.length
    });

    // Check for data inconsistency (mismatch between progress and actual questions)
    const totalCategorized = clearedQuestions.length + unsolvedQuestions.length + wrongQuestions.length;
    if (totalCategorized === 0 && allQuestions.length > 0) {
      console.warn(`[selectQuestionsForLevel] Data inconsistency detected! Progress has ${progress.totalQuestions} questions but none match current ${allQuestions.length} questions. Resetting progress...`);

      // Reset progress with current questions
      const newProgress = await this.initializeLevelProgress(userId, level);

      // Reload with fresh data
      const newUnsolvedQuestions = allQuestions.filter(q =>
        newProgress.unsolvedQuestions.includes(q.id)
      );

      console.log(`[selectQuestionsForLevel] Progress reset. Now have ${newUnsolvedQuestions.length} unsolved questions.`);

      // Use the new unsolved questions
      unsolvedQuestions.length = 0;
      unsolvedQuestions.push(...newUnsolvedQuestions);
    }

    // If in master mode and no wrong questions, use historical data
    if (progress.mode === 'MASTER_MODE' && wrongQuestions.length === 0) {
      const historicalWrong = await this.getHistoricalWrongQuestions(userId, level);
      wrongQuestions.push(...historicalWrong);
    }

    const selected: QuizQuestion[] = [];
    const usedIds = new Set<string>();

    for (let i = 0; i < count; i++) {
      const rand = Math.random();
      let question: QuizQuestion | null = null;

      if (rand < weights.cleared && clearedQuestions.length > 0) {
        question = this.pickRandomUnused(clearedQuestions, usedIds);
      } else if (rand < weights.cleared + weights.unsolved && unsolvedQuestions.length > 0) {
        question = this.pickRandomUnused(unsolvedQuestions, usedIds);
      } else if (wrongQuestions.length > 0) {
        question = this.pickRandomUnused(wrongQuestions, usedIds);
      }

      // Fallback: pick from any available questions
      if (!question) {
        const available = [...clearedQuestions, ...unsolvedQuestions, ...wrongQuestions]
          .filter(q => !usedIds.has(q.id));
        if (available.length > 0) {
          question = available[Math.floor(Math.random() * available.length)];
        }
      }

      if (question) {
        selected.push(question);
        usedIds.add(question.id);
      }
    }

    return selected;
  }

  // Get question weights based on level mode
  private getQuestionWeights(progress: LevelProgress): QuestionWeight {
    switch (progress.mode) {
      case 'FIRST_ROUND':
        return { cleared: 0.05, unsolved: 0.80, wrong: 0.15 };
      
      case 'REVIEW_MODE':
        if (progress.wrongQuestions.length > 0) {
          return { cleared: 0.30, unsolved: 0.00, wrong: 0.70 };
        } else {
          return { cleared: 1.00, unsolved: 0.00, wrong: 0.00 };
        }
      
      case 'MASTER_MODE':
        const daysSinceLastClear = progress.lastPerfectClearAt 
          ? this.getDaysSince(progress.lastPerfectClearAt) 
          : 999;
        
        if (daysSinceLastClear < 7) {
          return { cleared: 1.00, unsolved: 0.00, wrong: 0.00 };
        } else if (daysSinceLastClear < 30) {
          return { cleared: 0.70, unsolved: 0.00, wrong: 0.30 };
        } else {
          return { cleared: 0.50, unsolved: 0.00, wrong: 0.50 };
        }
    }
  }

  // Pick random question that hasn't been used
  private pickRandomUnused(
    questions: QuizQuestion[], 
    usedIds: Set<string>
  ): QuizQuestion | null {
    const available = questions.filter(q => !usedIds.has(q.id));
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
  }

  // Update question status after answering
  async updateQuestionStatus(
    userId: string,
    level: number,
    questionId: string,
    isCorrect: boolean
  ): Promise<void> {
    const progressRef = doc(this.progressCollection, `${userId}_${level}`);
    
    await runTransaction(db, async (transaction) => {
      const progressDoc = await transaction.get(progressRef);
      if (!progressDoc.exists()) return;
      
      const progress = progressDoc.data() as LevelProgress;
      
      if (isCorrect) {
        // Handle correct answer
        if (progress.unsolvedQuestions.includes(questionId)) {
          // Unsolved -> Cleared
          progress.unsolvedQuestions = progress.unsolvedQuestions.filter(id => id !== questionId);
          progress.clearedQuestions.push(questionId);
        } else if (progress.wrongQuestions.includes(questionId)) {
          // Wrong -> Cleared
          progress.wrongQuestions = progress.wrongQuestions.filter(id => id !== questionId);
          if (!progress.clearedQuestions.includes(questionId)) {
            progress.clearedQuestions.push(questionId);
          }
          // Mark as resolved in history
          await this.markWrongAsResolved(userId, questionId);
        }
        // Cleared -> Cleared (no change)
      } else {
        // Handle wrong answer
        if (progress.unsolvedQuestions.includes(questionId)) {
          // Unsolved -> Wrong
          progress.unsolvedQuestions = progress.unsolvedQuestions.filter(id => id !== questionId);
          progress.wrongQuestions.push(questionId);
        } else if (progress.clearedQuestions.includes(questionId)) {
          // Cleared -> Wrong
          progress.clearedQuestions = progress.clearedQuestions.filter(id => id !== questionId);
          if (!progress.wrongQuestions.includes(questionId)) {
            progress.wrongQuestions.push(questionId);
          }
        }
        // Record wrong answer
        await this.recordWrongAnswer(userId, questionId, level);
      }
      
      // Update completion rate
      progress.completionRate = Math.round(
        (progress.clearedQuestions.length / progress.totalQuestions) * 100
      );
      
      // Check for mode changes
      if (progress.mode === 'FIRST_ROUND' && 
          progress.clearedQuestions.length + progress.wrongQuestions.length >= progress.totalQuestions) {
        progress.mode = 'REVIEW_MODE';
        progress.rounds++;
      }
      
      if (progress.mode === 'REVIEW_MODE' && progress.wrongQuestions.length === 0) {
        progress.mode = 'MASTER_MODE';
        progress.perfectClearCount++;
        progress.lastPerfectClearAt = new Date();
      }
      
      progress.lastPlayedAt = new Date();
      progress.updatedAt = new Date();
      
      transaction.update(progressRef, {
        ...progress,
        lastPerfectClearAt: progress.lastPerfectClearAt ? 
          Timestamp.fromDate(progress.lastPerfectClearAt) : null,
        lastPlayedAt: Timestamp.fromDate(progress.lastPlayedAt),
        updatedAt: Timestamp.fromDate(progress.updatedAt)
      });
    });
    
    // Update statistics
    await this.updateLevelStatistics(userId, level, questionId, isCorrect);
  }

  // Record wrong answer in history
  private async recordWrongAnswer(
    userId: string, 
    questionId: string, 
    level: number
  ): Promise<void> {
    const historyId = `${userId}_${questionId}`;
    const historyRef = doc(this.historyCollection, historyId);
    
    await runTransaction(db, async (transaction) => {
      const historyDoc = await transaction.get(historyRef);
      
      if (historyDoc.exists()) {
        const history = historyDoc.data() as WrongAnswerHistory;
        history.totalWrongCount++;
        history.recentWrongCount++;
        history.lastWrongAt = new Date();
        history.reviewInterval = 0; // Reset to first interval
        history.nextReviewAt = this.calculateNextReviewDate(0);
        history.difficultyScore = this.calculateDifficultyScore(history);
        
        transaction.update(historyRef, {
          ...history,
          lastWrongAt: Timestamp.fromDate(history.lastWrongAt),
          nextReviewAt: Timestamp.fromDate(history.nextReviewAt)
        });
      } else {
        const newHistory: WrongAnswerHistory = {
          id: historyId,
          userId,
          questionId,
          level,
          totalWrongCount: 1,
          recentWrongCount: 1,
          lastWrongAt: new Date(),
          resolvedCount: 0,
          difficultyScore: 50,
          reviewInterval: 0,
          nextReviewAt: this.calculateNextReviewDate(0)
        };
        
        transaction.set(historyRef, {
          ...newHistory,
          lastWrongAt: Timestamp.fromDate(newHistory.lastWrongAt),
          nextReviewAt: Timestamp.fromDate(newHistory.nextReviewAt)
        });
      }
    });
  }

  // Mark wrong answer as resolved
  private async markWrongAsResolved(
    userId: string, 
    questionId: string
  ): Promise<void> {
    const historyId = `${userId}_${questionId}`;
    const historyRef = doc(this.historyCollection, historyId);
    
    const historyDoc = await getDoc(historyRef);
    if (historyDoc.exists()) {
      const history = historyDoc.data() as WrongAnswerHistory;
      history.resolvedCount++;
      history.recentWrongCount = 0;
      history.lastResolvedAt = new Date();
      
      // Move to next review interval
      const nextInterval = Math.min(
        history.reviewInterval + 1, 
        REVIEW_INTERVALS.length - 1
      );
      history.reviewInterval = nextInterval;
      history.nextReviewAt = this.calculateNextReviewDate(nextInterval);
      history.difficultyScore = this.calculateDifficultyScore(history);
      
      await updateDoc(historyRef, {
        ...history,
        lastResolvedAt: Timestamp.fromDate(history.lastResolvedAt),
        nextReviewAt: Timestamp.fromDate(history.nextReviewAt)
      });
    }
  }

  // Get historical wrong questions for review
  private async getHistoricalWrongQuestions(
    userId: string, 
    level: number
  ): Promise<QuizQuestion[]> {
    const q = query(
      this.historyCollection,
      where('userId', '==', userId),
      where('level', '==', level),
      where('difficultyScore', '>', 30),
      orderBy('difficultyScore', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const questionIds = snapshot.docs
      .slice(0, 20)
      .map(doc => doc.data().questionId);
    
    const allQuestions = await loadQuestionsByLevel(level);
    return allQuestions.filter(q => questionIds.includes(q.id));
  }

  // Get wrong answers for review
  async getWrongAnswersForReview(
    userId: string,
    level?: number
  ): Promise<WrongAnswerHistory[]> {
    const now = new Date();
    let q;
    
    if (level !== undefined) {
      q = query(
        this.historyCollection,
        where('userId', '==', userId),
        where('level', '==', level),
        where('nextReviewAt', '<=', Timestamp.fromDate(now)),
        orderBy('nextReviewAt')
      );
    } else {
      q = query(
        this.historyCollection,
        where('userId', '==', userId),
        where('nextReviewAt', '<=', Timestamp.fromDate(now)),
        orderBy('nextReviewAt')
      );
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        lastWrongAt: data.lastWrongAt?.toDate(),
        lastResolvedAt: data.lastResolvedAt?.toDate(),
        nextReviewAt: data.nextReviewAt?.toDate()
      } as WrongAnswerHistory;
    });
  }

  // Update level statistics
  private async updateLevelStatistics(
    userId: string,
    level: number,
    questionId: string,
    isCorrect: boolean
  ): Promise<void> {
    const statsRef = doc(this.statsCollection, `${userId}_${level}`);
    
    await runTransaction(db, async (transaction) => {
      const statsDoc = await transaction.get(statsRef);
      
      if (statsDoc.exists()) {
        const stats = statsDoc.data() as LevelStatistics;
        stats.totalQuestionsAnswered++;
        
        if (isCorrect) {
          stats.currentStreak++;
          stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
        } else {
          stats.currentStreak = 0;
        }
        
        // Update play count
        stats.playCount[questionId] = (stats.playCount[questionId] || 0) + 1;
        
        // Update average accuracy
        const correctCount = Math.round(stats.averageAccuracy * stats.totalQuestionsAnswered / 100);
        const newCorrectCount = correctCount + (isCorrect ? 1 : 0);
        stats.averageAccuracy = Math.round((newCorrectCount / stats.totalQuestionsAnswered) * 100);
        
        stats.lastUpdated = new Date();
        
        transaction.update(statsRef, {
          ...stats,
          lastUpdated: Timestamp.fromDate(stats.lastUpdated)
        });
      } else {
        const newStats: LevelStatistics = {
          userId,
          level,
          totalAttempts: 1,
          totalQuestionsAnswered: 1,
          averageAccuracy: isCorrect ? 100 : 0,
          bestStreak: isCorrect ? 1 : 0,
          currentStreak: isCorrect ? 1 : 0,
          playCount: { [questionId]: 1 },
          lastUpdated: new Date()
        };
        
        transaction.set(statsRef, {
          ...newStats,
          lastUpdated: Timestamp.fromDate(newStats.lastUpdated)
        });
      }
    });
  }

  // Get level statistics
  async getLevelStatistics(userId: string, level: number): Promise<LevelStatistics | null> {
    try {
      const docRef = doc(this.statsCollection, `${userId}_${level}`);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return null;
      
      const data = docSnap.data();
      return {
        ...data,
        lastUpdated: data.lastUpdated?.toDate()
      } as LevelStatistics;
    } catch (error) {
      console.error('Failed to get level statistics:', error);
      return null;
    }
  }

  // Check if level can be unlocked
  async canUnlockLevel(userId: string, level: number): Promise<boolean> {
    if (level === 1) return true;
    
    const previousProgress = await this.getLevelProgress(userId, level - 1);
    if (!previousProgress) return false;
    
    return previousProgress.completionRate >= 70;
  }

  // Unlock a level
  async unlockLevel(userId: string, level: number): Promise<boolean> {
    const canUnlock = await this.canUnlockLevel(userId, level);
    if (!canUnlock) return false;
    
    const progress = await this.getLevelProgress(userId, level);
    if (!progress || progress.isUnlocked) return false;
    
    progress.isUnlocked = true;
    progress.unlockedAt = new Date();
    progress.updatedAt = new Date();
    
    await updateDoc(doc(this.progressCollection, `${userId}_${level}`), {
      isUnlocked: true,
      unlockedAt: Timestamp.fromDate(progress.unlockedAt),
      updatedAt: Timestamp.fromDate(progress.updatedAt)
    });
    
    return true;
  }

  // Reset level progress
  async resetLevel(userId: string, level: number): Promise<void> {
    await this.initializeLevelProgress(userId, level);
  }

  // Helper functions
  private calculateNextReviewDate(intervalIndex: number): Date {
    const days = REVIEW_INTERVALS[Math.min(intervalIndex, REVIEW_INTERVALS.length - 1)];
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }

  private calculateDifficultyScore(history: WrongAnswerHistory): number {
    const total = history.totalWrongCount + history.resolvedCount;
    if (total === 0) return 50;
    
    const wrongRate = history.totalWrongCount / total;
    const recencyScore = this.getRecencyScore(history.lastWrongAt);
    
    return Math.round(wrongRate * 70 + recencyScore * 30);
  }

  private getRecencyScore(date: Date): number {
    const daysSince = this.getDaysSince(date);
    if (daysSince < 7) return 100;
    if (daysSince < 30) return 70;
    if (daysSince < 90) return 40;
    return 10;
  }

  private getDaysSince(date: Date): number {
    const diff = Date.now() - date.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}

export const advancedQuizService = new AdvancedQuizService();