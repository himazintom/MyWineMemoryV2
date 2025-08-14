/**
 * Quiz Progress Service
 * Manages quiz progress, user performance, and wrong answer tracking
 */

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  runTransaction
} from 'firebase/firestore';
import { db } from './firebase';
import type { QuizQuestion } from '../types';

export interface QuizProgress {
  id: string;
  userId: string;
  difficulty: number;
  completedQuestions: string[]; // Question IDs
  correctAnswers: number;
  totalAttempts: number;
  bestScore: number;
  lastPlayedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface WrongAnswer {
  id: string;
  userId: string;
  questionId: string;
  difficulty: number;
  incorrectAnswer: number;
  correctAnswer: number;
  attempts: number;
  lastAttemptAt: Timestamp;
  isResolved: boolean; // True when answered correctly
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserQuizStats {
  userId: string;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  overallAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  heartsRemaining: number;
  heartsLastUsedAt: Timestamp | null;
  heartsRecoveryTime: Timestamp | null;
  level: number;
  xp: number;
  badges: string[];
  updatedAt: Timestamp;
}

class QuizProgressService {
  private progressCollection = collection(db, 'quiz_progress');
  private wrongAnswersCollection = collection(db, 'wrong_answers');
  private userStatsCollection = collection(db, 'user_quiz_stats');

  // Get user's progress for a specific difficulty
  async getProgressByDifficulty(userId: string, difficulty: number): Promise<QuizProgress | null> {
    try {
      const progressDoc = await getDoc(doc(this.progressCollection, `${userId}_${difficulty}`));
      
      if (progressDoc.exists()) {
        const data = progressDoc.data();
        return {
          ...data,
          lastPlayedAt: data.lastPlayedAt,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        } as QuizProgress;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get quiz progress:', error);
      throw error;
    }
  }

  // Update progress after completing a quiz
  async updateProgress(
    userId: string, 
    difficulty: number, 
    questionsAnswered: string[], 
    correctCount: number,
    totalCount: number
  ): Promise<void> {
    try {
      const progressId = `${userId}_${difficulty}`;
      const progressRef = doc(this.progressCollection, progressId);
      
      await runTransaction(db, async (transaction) => {
        const progressDoc = await transaction.get(progressRef);
        const now = new Date();
        const score = Math.round((correctCount / totalCount) * 100);
        
        if (progressDoc.exists()) {
          const currentData = progressDoc.data() as QuizProgress;
          const updatedCompletedQuestions = [
            ...new Set([...currentData.completedQuestions, ...questionsAnswered])
          ];
          
          transaction.update(progressRef, {
            completedQuestions: updatedCompletedQuestions,
            correctAnswers: currentData.correctAnswers + correctCount,
            totalAttempts: currentData.totalAttempts + totalCount,
            bestScore: Math.max(currentData.bestScore, score),
            lastPlayedAt: Timestamp.fromDate(now),
            updatedAt: Timestamp.fromDate(now)
          });
        } else {
          const newProgress: Partial<QuizProgress> = {
            userId,
            difficulty,
            completedQuestions: questionsAnswered,
            correctAnswers: correctCount,
            totalAttempts: totalCount,
            bestScore: score,
            lastPlayedAt: Timestamp.fromDate(now),
            createdAt: Timestamp.fromDate(now),
            updatedAt: Timestamp.fromDate(now)
          };
          
          transaction.set(progressRef, newProgress);
        }
      });
    } catch (error) {
      console.error('Failed to update quiz progress:', error);
      throw error;
    }
  }

  // Record wrong answer for review
  async recordWrongAnswer(
    userId: string,
    question: QuizQuestion,
    userAnswer: number
  ): Promise<void> {
    try {
      const wrongAnswerId = `${userId}_${question.id}`;
      const wrongAnswerRef = doc(this.wrongAnswersCollection, wrongAnswerId);
      
      await runTransaction(db, async (transaction) => {
        const wrongAnswerDoc = await transaction.get(wrongAnswerRef);
        const now = new Date();
        
        if (wrongAnswerDoc.exists()) {
          const currentData = wrongAnswerDoc.data() as WrongAnswer;
          transaction.update(wrongAnswerRef, {
            incorrectAnswer: userAnswer,
            attempts: currentData.attempts + 1,
            lastAttemptAt: Timestamp.fromDate(now),
            isResolved: false,
            updatedAt: Timestamp.fromDate(now)
          });
        } else {
          const newWrongAnswer: Partial<WrongAnswer> = {
            userId,
            questionId: question.id,
            difficulty: question.difficulty,
            incorrectAnswer: userAnswer,
            correctAnswer: question.correctAnswer,
            attempts: 1,
            lastAttemptAt: Timestamp.fromDate(now),
            isResolved: false,
            createdAt: Timestamp.fromDate(now),
            updatedAt: Timestamp.fromDate(now)
          };
          
          transaction.set(wrongAnswerRef, newWrongAnswer);
        }
      });
    } catch (error) {
      console.error('Failed to record wrong answer:', error);
      throw error;
    }
  }

  // Mark wrong answer as resolved (answered correctly)
  async resolveWrongAnswer(userId: string, questionId: string): Promise<void> {
    try {
      const wrongAnswerId = `${userId}_${questionId}`;
      const wrongAnswerRef = doc(this.wrongAnswersCollection, wrongAnswerId);
      
      await updateDoc(wrongAnswerRef, {
        isResolved: true,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Failed to resolve wrong answer:', error);
      throw error;
    }
  }

  // Get unresolved wrong answers for review
  async getWrongAnswersForReview(userId: string, limit: number = 10): Promise<WrongAnswer[]> {
    try {
      const wrongAnswersQuery = query(
        this.wrongAnswersCollection,
        where('userId', '==', userId),
        where('isResolved', '==', false),
        orderBy('lastAttemptAt', 'desc')
      );
      
      const snapshot = await getDocs(wrongAnswersQuery);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          lastAttemptAt: data.lastAttemptAt,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        } as WrongAnswer;
      }).slice(0, limit);
    } catch (error) {
      console.error('Failed to get wrong answers for review:', error);
      throw error;
    }
  }

  // Get user's overall quiz statistics
  async getUserQuizStats(userId: string): Promise<UserQuizStats | null> {
    try {
      const statsDoc = await getDoc(doc(this.userStatsCollection, userId));
      
      if (statsDoc.exists()) {
        const data = statsDoc.data();
        return {
          ...data,
          heartsLastUsedAt: data.heartsLastUsedAt || null,
          heartsRecoveryTime: data.heartsRecoveryTime || null,
          updatedAt: data.updatedAt
        } as UserQuizStats;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get user quiz stats:', error);
      throw error;
    }
  }

  // Update user's quiz statistics
  async updateUserQuizStats(
    userId: string,
    correctAnswers: number,
    totalAnswers: number,
    isStreak: boolean
  ): Promise<void> {
    try {
      const statsRef = doc(this.userStatsCollection, userId);
      
      await runTransaction(db, async (transaction) => {
        const statsDoc = await transaction.get(statsRef);
        const now = new Date();
        
        if (statsDoc.exists()) {
          const currentStats = statsDoc.data() as UserQuizStats;
          const newCorrectTotal = currentStats.totalCorrectAnswers + correctAnswers;
          const newAnsweredTotal = currentStats.totalQuestionsAnswered + totalAnswers;
          const newAccuracy = (newCorrectTotal / newAnsweredTotal) * 100;
          
          const newStreak = isStreak ? currentStats.currentStreak + 1 : 0;
          const newLongestStreak = Math.max(currentStats.longestStreak, newStreak);
          
          transaction.update(statsRef, {
            totalQuestionsAnswered: newAnsweredTotal,
            totalCorrectAnswers: newCorrectTotal,
            overallAccuracy: newAccuracy,
            currentStreak: newStreak,
            longestStreak: newLongestStreak,
            updatedAt: Timestamp.fromDate(now)
          });
        } else {
          const newStats: Partial<UserQuizStats> = {
            userId,
            totalQuestionsAnswered: totalAnswers,
            totalCorrectAnswers: correctAnswers,
            overallAccuracy: (correctAnswers / totalAnswers) * 100,
            currentStreak: isStreak ? 1 : 0,
            longestStreak: isStreak ? 1 : 0,
            heartsRemaining: 5,
            heartsLastUsedAt: null,
            heartsRecoveryTime: null,
            level: 1,
            xp: correctAnswers * 5, // 5 XP per correct answer
            badges: [],
            updatedAt: Timestamp.fromDate(now)
          };
          
          transaction.set(statsRef, newStats);
        }
      });
    } catch (error) {
      console.error('Failed to update user quiz stats:', error);
      throw error;
    }
  }

  // Use a heart (for wrong answers)
  async useHeart(userId: string): Promise<number> {
    try {
      const statsRef = doc(this.userStatsCollection, userId);
      
      return await runTransaction(db, async (transaction) => {
        const statsDoc = await transaction.get(statsRef);
        
        if (statsDoc.exists()) {
          const currentStats = statsDoc.data() as UserQuizStats;
          const newHearts = Math.max(0, currentStats.heartsRemaining - 1);
          const now = new Date();
          
          // Set recovery time for next heart (30 minutes)
          const recoveryTime = new Date(now.getTime() + 30 * 60 * 1000);
          
          transaction.update(statsRef, {
            heartsRemaining: newHearts,
            heartsLastUsedAt: Timestamp.fromDate(now),
            heartsRecoveryTime: newHearts < 5 ? Timestamp.fromDate(recoveryTime) : null,
            updatedAt: Timestamp.fromDate(now)
          });
          
          return newHearts;
        } else {
          // Initialize with 4 hearts (used 1)
          const now = new Date();
          const recoveryTime = new Date(now.getTime() + 30 * 60 * 1000);
          
          const newStats: Partial<UserQuizStats> = {
            userId,
            totalQuestionsAnswered: 0,
            totalCorrectAnswers: 0,
            overallAccuracy: 0,
            currentStreak: 0,
            longestStreak: 0,
            heartsRemaining: 4,
            heartsLastUsedAt: Timestamp.fromDate(now),
            heartsRecoveryTime: Timestamp.fromDate(recoveryTime),
            level: 1,
            xp: 0,
            badges: [],
            updatedAt: Timestamp.fromDate(now)
          };
          
          transaction.set(statsRef, newStats);
          return 4;
        }
      });
    } catch (error) {
      console.error('Failed to use heart:', error);
      throw error;
    }
  }

  // Recover hearts based on time
  async recoverHearts(userId: string): Promise<number> {
    try {
      const statsRef = doc(this.userStatsCollection, userId);
      
      return await runTransaction(db, async (transaction) => {
        const statsDoc = await transaction.get(statsRef);
        
        if (!statsDoc.exists()) {
          return 5; // Default hearts for new users
        }
        
        const currentStats = statsDoc.data() as UserQuizStats;
        const now = new Date();
        
        // If already at max hearts, return current amount
        if (currentStats.heartsRemaining >= 5) {
          return currentStats.heartsRemaining;
        }
        
        // If no recovery time set, return current amount
        if (!currentStats.heartsRecoveryTime) {
          return currentStats.heartsRemaining;
        }
        
        const recoveryTime = currentStats.heartsRecoveryTime.toDate();
        
        // If recovery time hasn't passed, return current amount
        if (now < recoveryTime) {
          return currentStats.heartsRemaining;
        }
        
        // Calculate how many hearts to recover (1 every 30 minutes)
        const timeSinceLastUsed = currentStats.heartsLastUsedAt 
          ? now.getTime() - currentStats.heartsLastUsedAt.toDate().getTime()
          : 0;
        
        const heartsToRecover = Math.floor(timeSinceLastUsed / (30 * 60 * 1000));
        const newHearts = Math.min(5, currentStats.heartsRemaining + heartsToRecover);
        
        // Update hearts and recovery time
        const nextRecoveryTime = newHearts < 5 
          ? new Date(now.getTime() + 30 * 60 * 1000)
          : null;
        
        transaction.update(statsRef, {
          heartsRemaining: newHearts,
          heartsRecoveryTime: nextRecoveryTime ? Timestamp.fromDate(nextRecoveryTime) : null,
          updatedAt: Timestamp.fromDate(now)
        });
        
        return newHearts;
      });
    } catch (error) {
      console.error('Failed to recover hearts:', error);
      throw error;
    }
  }

  // Get all progress for a user (for overview)
  async getAllUserProgress(userId: string): Promise<QuizProgress[]> {
    try {
      const progressQuery = query(
        this.progressCollection,
        where('userId', '==', userId),
        orderBy('difficulty', 'asc')
      );
      
      const snapshot = await getDocs(progressQuery);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          lastPlayedAt: data.lastPlayedAt,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        } as QuizProgress;
      });
    } catch (error) {
      console.error('Failed to get all user progress:', error);
      throw error;
    }
  }
}

export const quizProgressService = new QuizProgressService();