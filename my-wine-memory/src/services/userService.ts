import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  Timestamp,
  increment,
  query,
  where,
  collection,
  getDocs 
} from 'firebase/firestore';
import { db } from './firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User, UserStats, DailyGoal } from '../types';

export const userService = {
  // Create or update user profile
  async createOrUpdateUser(firebaseUser: FirebaseUser): Promise<User> {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Update existing user
      const userData = userDoc.data();
      const updatedUser: User = {
        ...userData,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        updatedAt: new Date()
      } as User;
      
      await updateDoc(userRef, {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        updatedAt: Timestamp.now()
      });
      
      return updatedUser;
    } else {
      // Create new user
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || undefined,
        nickname: firebaseUser.displayName || undefined,
        level: 1,
        xp: 0,
        streak: 0,
        totalRecords: 0,
        badges: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: false,
        publicSlug: undefined
      };

      await setDoc(userRef, {
        ...newUser,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Initialize user stats
      await this.initializeUserStats(firebaseUser.uid);
      
      return newUser;
    }
  },

  // Get user profile
  async getUserProfile(userId: string): Promise<User | null> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data(),
        createdAt: userDoc.data().createdAt.toDate(),
        updatedAt: userDoc.data().updatedAt.toDate()
      } as User;
    }
    return null;
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  // Add XP and check for level up
  async addXP(userId: string, xpAmount: number): Promise<{ newLevel: number; leveledUp: boolean }> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const currentXP = userDoc.data().xp || 0;
    const currentLevel = userDoc.data().level || 1;
    const newXP = currentXP + xpAmount;
    
    // Simple level calculation: 1000 XP per level
    const newLevel = Math.floor(newXP / 1000) + 1;
    const leveledUp = newLevel > currentLevel;

    await updateDoc(userRef, {
      xp: newXP,
      level: newLevel,
      updatedAt: Timestamp.now()
    });

    return { newLevel, leveledUp };
  },

  // Initialize user statistics
  async initializeUserStats(userId: string): Promise<void> {
    const statsRef = doc(db, 'user_stats', userId);
    const initialStats: UserStats = {
      userId,
      totalRecords: 0,
      totalQuizzes: 0,
      currentStreak: 0,
      longestStreak: 0,
      level: 1,
      xp: 0,
      badgeCount: 0,
      monthlyRecords: {},
      countryDistribution: {},
      varietyDistribution: {},
      averageRating: 0,
      updatedAt: new Date()
    };

    await setDoc(statsRef, {
      ...initialStats,
      updatedAt: Timestamp.now()
    });
  },

  // Get user statistics
  async getUserStats(userId: string): Promise<UserStats | null> {
    const statsRef = doc(db, 'user_stats', userId);
    const statsDoc = await getDoc(statsRef);

    if (statsDoc.exists()) {
      return {
        ...statsDoc.data(),
        updatedAt: statsDoc.data().updatedAt.toDate()
      } as UserStats;
    }
    return null;
  },

  // Update user statistics when wine is added
  async updateStatsAfterWineRecord(userId: string, wineData: { country: string; grapeVarieties?: string[] }): Promise<void> {
    const statsRef = doc(db, 'user_stats', userId);
    const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM format

    await updateDoc(statsRef, {
      totalRecords: increment(1),
      [`monthlyRecords.${currentMonth}`]: increment(1),
      [`countryDistribution.${wineData.country}`]: increment(1),
      updatedAt: Timestamp.now()
    });

    // Update grape varieties if provided
    if (wineData.grapeVarieties && wineData.grapeVarieties.length > 0) {
      const varietyUpdates: Record<string, unknown> = {};
      wineData.grapeVarieties.forEach((variety: string) => {
        varietyUpdates[`varietyDistribution.${variety}`] = increment(1);
      });
      
      await updateDoc(statsRef, varietyUpdates);
    }
  },

  // Update user privacy settings
  async updateUserPrivacySettings(userId: string, privacySettings: {
    defaultRecordVisibility: 'public' | 'private';
    allowPublicProfile: boolean;
    pushNotifications: boolean;
  }): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        privacySettings,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error updating user privacy settings:', error);
      throw new Error('プライバシー設定の更新に失敗しました');
    }
  },

  // Set user public sharing settings
  async setPublicSharing(userId: string, isPublic: boolean, publicSlug?: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      
      // Check if slug is unique (if provided)
      if (isPublic && publicSlug) {
        const existingUser = await this.getUserByPublicSlug(publicSlug);
        if (existingUser && existingUser.id !== userId) {
          throw new Error('この公開URLは既に使用されています');
        }
      }
      
      await updateDoc(userRef, {
        isPublic,
        publicSlug: isPublic ? publicSlug : undefined,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error setting public sharing:', error);
      throw error;
    }
  },

  // Get user by public slug
  async getUserByPublicSlug(publicSlug: string): Promise<User | null> {
    try {
      const q = query(
        collection(db, 'users'),
        where('publicSlug', '==', publicSlug),
        where('isPublic', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        } as User;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user by public slug:', error);
      return null;
    }
  },

  // Generate unique public slug
  async generateUniqueSlug(userId: string, displayName: string): Promise<string> {
    const baseSlug = displayName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 20) || 'wine-lover';
    
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      const existingUser = await this.getUserByPublicSlug(slug);
      if (!existingUser || existingUser.id === userId) {
        return slug;
      }
      
      slug = `${baseSlug}-${counter}`;
      counter++;
      
      if (counter > 999) {
        // Fallback with random number
        slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
        break;
      }
    }
    
    return slug;
  }
};

export const publicSharingService = {
  // Get public user profile
  async getPublicUserProfile(publicSlug: string): Promise<{ user: User; stats: UserStats | null } | null> {
    try {
      const user = await userService.getUserByPublicSlug(publicSlug);
      if (!user) {
        return null;
      }
      
      const stats = await userService.getUserStats(user.id);
      
      return { user, stats };
    } catch (error) {
      console.error('Error getting public user profile:', error);
      return null;
    }
  }
};

export const goalService = {
  // Get today's daily goal
  async getTodayGoal(userId: string): Promise<DailyGoal | null> {
    const today = new Date().toISOString().substring(0, 10); // YYYY-MM-DD format
    const goalRef = doc(db, 'daily_goals', `${userId}_${today}`);
    const goalDoc = await getDoc(goalRef);

    if (goalDoc.exists()) {
      return goalDoc.data() as DailyGoal;
    }
    return null;
  },

  // Initialize or get today's goal
  async initializeTodayGoal(userId: string): Promise<DailyGoal> {
    const today = new Date().toISOString().substring(0, 10);
    const goalRef = doc(db, 'daily_goals', `${userId}_${today}`);
    
    let goal = await this.getTodayGoal(userId);
    
    if (!goal) {
      goal = {
        userId,
        date: today,
        wineRecordingGoal: 1,
        quizGoal: 5,
        wineRecordingCompleted: 0,
        quizCompleted: 0,
        xpEarned: 0
      };
      
      await setDoc(goalRef, goal);
    }
    
    return goal;
  },

  // Update daily goal progress
  async updateGoalProgress(userId: string, type: 'wine' | 'quiz', amount: number = 1): Promise<void> {
    try {
      const today = new Date().toISOString().substring(0, 10);
      const goalRef = doc(db, 'daily_goals', `${userId}_${today}`);
      
      // Try to update first
      const field = type === 'wine' ? 'wineRecordingCompleted' : 'quizCompleted';
      await updateDoc(goalRef, {
        [field]: increment(amount)
      });
    } catch (error: unknown) {
      // If document doesn't exist, initialize it first
      if (error && typeof error === 'object' && 'code' in error && error.code === 'not-found') {
        console.log('Daily goal document not found, initializing...');
        await this.initializeTodayGoal(userId);
        
        // Retry the update
        const today = new Date().toISOString().substring(0, 10);
        const goalRef = doc(db, 'daily_goals', `${userId}_${today}`);
        const field = type === 'wine' ? 'wineRecordingCompleted' : 'quizCompleted';
        await updateDoc(goalRef, {
          [field]: increment(amount)
        });
      } else {
        // Re-throw other errors
        throw error;
      }
    }
  }
};