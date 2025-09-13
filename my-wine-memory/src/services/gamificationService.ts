import { 
  doc, 
  getDoc, 
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import type { User, DailyGoal, UserStats } from '../types';
import { badgeService } from './badgeService';

// XP rewards configuration
const XP_REWARDS = {
  WINE_RECORD_QUICK: 10,
  WINE_RECORD_DETAILED: 20,
  QUIZ_CORRECT: 5,
  DAILY_GOAL_COMPLETE: 50,
  BADGE_EARNED: 100,
  STREAK_BONUS: 10, // per day of streak
};

// Level calculation
const LEVEL_XP_BASE = 100; // XP required for level 1
const LEVEL_XP_MULTIPLIER = 1.2; // Each level requires 20% more XP than the previous

class GamificationService {
  // Calculate level from XP
  calculateLevel(xp: number): number {
    let level = 1;
    let totalXpRequired = 0;
    
    while (totalXpRequired <= xp) {
      level++;
      totalXpRequired += Math.floor(LEVEL_XP_BASE * Math.pow(LEVEL_XP_MULTIPLIER, level - 1));
    }
    
    return level - 1;
  }
  
  // Calculate XP needed for next level
  calculateXpForNextLevel(currentLevel: number): number {
    return Math.floor(LEVEL_XP_BASE * Math.pow(LEVEL_XP_MULTIPLIER, currentLevel));
  }
  
  // Award XP to user
  async awardXP(userId: string, amount: number, reason: string): Promise<{newXp: number, newLevel: number, leveledUp: boolean}> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const userData = userDoc.data() as User;
    const oldXp = userData.xp || 0;
    const newXp = oldXp + amount;
    const oldLevel = userData.level || 1;
    const newLevel = this.calculateLevel(newXp);
    const leveledUp = newLevel > oldLevel;
    
    // Update user document
    await updateDoc(userRef, {
      xp: increment(amount),
      level: newLevel,
      updatedAt: Timestamp.now()
    });
    
    // Record XP transaction
    await this.recordXpTransaction(userId, amount, reason);
    
    // Check for level-up badges if leveled up
    if (leveledUp) {
      await this.checkLevelBadges(userId, newLevel);
    }
    
    return { newXp, newLevel, leveledUp };
  }
  
  // Record XP transaction for history
  private async recordXpTransaction(userId: string, amount: number, reason: string): Promise<void> {
    await setDoc(doc(collection(db, 'xp_transactions')), {
      userId,
      amount,
      reason,
      timestamp: Timestamp.now()
    });
  }
  
  // Check and award level-based badges
  private async checkLevelBadges(userId: string, level: number): Promise<void> {
    // Level milestones: 10, 25, 50, 100
    const levelMilestones = [10, 25, 50, 100];
    if (levelMilestones.includes(level)) {
      // This would trigger a specific level badge
      console.log(`User ${userId} reached level ${level} milestone!`);
    }
  }
  
  // Update streak
  async updateStreak(userId: string): Promise<{streak: number, streakBroken: boolean}> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const userData = userDoc.data() as User;
    const lastRecordDate = await this.getLastRecordDate(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let newStreak = userData.streak || 0;
    let streakBroken = false;
    
    if (!lastRecordDate) {
      // First record ever
      newStreak = 1;
    } else {
      const lastDate = new Date(lastRecordDate);
      lastDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // Already recorded today, no change
        return { streak: newStreak, streakBroken: false };
      } else if (daysDiff === 1) {
        // Consecutive day, increment streak
        newStreak++;
      } else {
        // Streak broken
        streakBroken = true;
        newStreak = 1;
      }
    }
    
    // Update user document
    await updateDoc(userRef, {
      streak: newStreak,
      lastRecordDate: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    // Award streak bonus XP
    if (newStreak > 1) {
      await this.awardXP(userId, XP_REWARDS.STREAK_BONUS * Math.min(newStreak, 10), `${newStreak}日連続記録ボーナス`);
    }
    
    // Check streak badges
    const userStats = await this.getUserStats(userId);
    await badgeService.checkAndAwardBadges(userId, userStats);
    
    return { streak: newStreak, streakBroken };
  }
  
  // Get last record date
  private async getLastRecordDate(userId: string): Promise<Date | null> {
    const recordsRef = collection(db, 'tasting_records');
    const q = query(
      recordsRef,
      where('userId', '==', userId),
      where('tastingDate', '!=', null)
    );
    
    const querySnapshot = await getDocs(q);
    let lastDate: Date | null = null;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const recordDate = data.tastingDate?.toDate ? data.tastingDate.toDate() : new Date(data.tastingDate);
      if (!lastDate || recordDate > lastDate) {
        lastDate = recordDate;
      }
    });
    
    return lastDate;
  }
  
  // Get or create daily goal
  async getDailyGoal(userId: string): Promise<DailyGoal> {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    
    const goalRef = doc(db, 'daily_goals', `${userId}_${dateStr}`);
    const goalDoc = await getDoc(goalRef);
    
    if (goalDoc.exists()) {
      return goalDoc.data() as DailyGoal;
    } else {
      // Create default daily goal
      const defaultGoal: DailyGoal = {
        userId,
        date: dateStr,
        wineRecordingGoal: 1,
        quizGoal: 5,
        wineRecordingCompleted: 0,
        quizCompleted: 0,
        xpEarned: 0
      };
      
      await setDoc(goalRef, defaultGoal);
      return defaultGoal;
    }
  }
  
  // Update daily goal progress
  async updateDailyGoalProgress(userId: string, type: 'wine' | 'quiz', increment: number = 1): Promise<DailyGoal> {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    
    const goalRef = doc(db, 'daily_goals', `${userId}_${dateStr}`);
    const goalDoc = await getDoc(goalRef);
    
    if (!goalDoc.exists()) {
      await this.getDailyGoal(userId); // Create if doesn't exist
    }
    
    const field = type === 'wine' ? 'wineRecordingCompleted' : 'quizCompleted';
    await updateDoc(goalRef, {
      [field]: increment
    });
    
    // Check if daily goal completed
    const updatedGoal = await this.getDailyGoal(userId);
    
    if (updatedGoal.wineRecordingCompleted >= updatedGoal.wineRecordingGoal &&
        updatedGoal.quizCompleted >= updatedGoal.quizGoal &&
        updatedGoal.xpEarned === 0) {
      // Award daily goal XP
      await this.awardXP(userId, XP_REWARDS.DAILY_GOAL_COMPLETE, 'デイリーゴール達成');
      await updateDoc(goalRef, {
        xpEarned: XP_REWARDS.DAILY_GOAL_COMPLETE
      });
    }
    
    return updatedGoal;
  }
  
  // Get user statistics
  async getUserStats(userId: string): Promise<UserStats> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const userData = userDoc.data() as User;
    
    // Get wine records for statistics
    const recordsRef = collection(db, 'tasting_records');
    const q = query(recordsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const monthlyRecords: { [key: string]: number } = {};
    const countryDistribution: { [country: string]: number } = {};
    const varietyDistribution: { [variety: string]: number } = {};
    let totalRating = 0;
    let ratingCount = 0;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Monthly records
      const date = data.tastingDate?.toDate ? data.tastingDate.toDate() : new Date(data.tastingDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyRecords[monthKey] = (monthlyRecords[monthKey] || 0) + 1;
      
      // Country distribution
      if (data.country) {
        countryDistribution[data.country] = (countryDistribution[data.country] || 0) + 1;
      }
      
      // Variety distribution
      if (data.grapeVarieties && Array.isArray(data.grapeVarieties)) {
        data.grapeVarieties.forEach((variety: string) => {
          varietyDistribution[variety] = (varietyDistribution[variety] || 0) + 1;
        });
      }
      
      // Average rating
      if (data.overallRating) {
        totalRating += data.overallRating;
        ratingCount++;
      }
    });
    
    const stats: UserStats = {
      userId,
      totalRecords: querySnapshot.size,
      totalQuizzes: 0, // Will be updated from quiz stats
      currentStreak: userData.streak || 0,
      longestStreak: userData.streak || 0, // TODO: Track longest streak separately
      level: userData.level || 1,
      xp: userData.xp || 0,
      badgeCount: userData.badges?.length || 0,
      monthlyRecords,
      countryDistribution,
      varietyDistribution,
      averageRating: ratingCount > 0 ? totalRating / ratingCount : 0,
      updatedAt: new Date()
    };
    
    return stats;
  }
  
  // Process wine recording completion
  async processWineRecording(userId: string, recordMode: 'quick' | 'detailed'): Promise<void> {
    // Award XP
    const xpAmount = recordMode === 'detailed' ? XP_REWARDS.WINE_RECORD_DETAILED : XP_REWARDS.WINE_RECORD_QUICK;
    await this.awardXP(userId, xpAmount, `ワイン記録（${recordMode === 'detailed' ? '詳細' : 'クイック'}モード）`);
    
    // Update streak
    await this.updateStreak(userId);
    
    // Update daily goal
    await this.updateDailyGoalProgress(userId, 'wine');
    
    // Update total records count
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      totalRecords: increment(1),
      updatedAt: Timestamp.now()
    });
    
    // Check badges
    const userStats = await this.getUserStats(userId);
    await badgeService.checkAndAwardBadges(userId, userStats);
  }
  
  // Process quiz completion
  async processQuizCompletion(userId: string, correctAnswers: number, totalQuestions: number): Promise<void> {
    // Award XP for correct answers + perfect bonus
    let xpAmount = correctAnswers * XP_REWARDS.QUIZ_CORRECT;
    let xpDescription = `クイズ正解 ${correctAnswers}/${totalQuestions}問`;
    
    // Add perfect score bonus
    if (correctAnswers === totalQuestions && totalQuestions > 0) {
      xpAmount += 10; // Perfect score bonus
      xpDescription += ' 🏆パーフェクト!';
    }
    
    await this.awardXP(userId, xpAmount, xpDescription);
    
    // Update daily goal
    await this.updateDailyGoalProgress(userId, 'quiz', correctAnswers);
    
    // Update quiz stats
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      totalQuizAnswers: increment(correctAnswers),
      updatedAt: Timestamp.now()
    });
    
    // Check quiz badges
    const userStats = await this.getUserStats(userId);
    await badgeService.checkAndAwardBadges(userId, userStats);
  }
}

export const gamificationService = new GamificationService();