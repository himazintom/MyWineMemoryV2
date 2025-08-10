import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { Badge, WineRecord, UserStats } from '../types';
import { BADGE_DEFINITIONS, getBadgeById } from '../data/badges';

export const badgeService = {
  // Check and award badges after wine record
  async checkAndAwardBadges(userId: string, userStats: UserStats, newWineRecord?: WineRecord): Promise<Badge[]> {
    const newlyEarnedBadges: Badge[] = [];
    
    // Get user's current badges
    const currentBadges = await this.getUserBadges(userId);
    const currentBadgeIds = currentBadges.map(b => b.id);

    // Check recording badges
    const recordingBadges = await this.checkRecordingBadges(userStats, currentBadgeIds);
    newlyEarnedBadges.push(...recordingBadges);

    // Check streak badges
    const streakBadges = await this.checkStreakBadges(userStats, currentBadgeIds);
    newlyEarnedBadges.push(...streakBadges);

    // Check exploration badges if new wine record provided
    if (newWineRecord) {
      const explorationBadges = await this.checkExplorationBadges(userId, userStats, newWineRecord, currentBadgeIds);
      newlyEarnedBadges.push(...explorationBadges);
    }

    // Award new badges
    for (const badge of newlyEarnedBadges) {
      await this.awardBadge(userId, badge);
    }

    return newlyEarnedBadges;
  },

  // Check recording milestone badges
  async checkRecordingBadges(userStats: UserStats, currentBadgeIds: string[]): Promise<Badge[]> {
    const badges: Badge[] = [];
    const recordingBadges = BADGE_DEFINITIONS.filter(b => 
      b.category === 'recording' && 
      !currentBadgeIds.includes(b.id) &&
      userStats.totalRecords >= b.requirement
    );

    // Award highest tier achieved
    if (recordingBadges.length > 0) {
      const highestBadge = recordingBadges.reduce((prev, current) => 
        current.tier > prev.tier ? current : prev
      );
      badges.push(highestBadge);
    }

    return badges;
  },

  // Check streak badges
  async checkStreakBadges(userStats: UserStats, currentBadgeIds: string[]): Promise<Badge[]> {
    const badges: Badge[] = [];
    const streakBadges = BADGE_DEFINITIONS.filter(b => 
      b.category === 'streak' && 
      !currentBadgeIds.includes(b.id) &&
      Math.max(userStats.currentStreak, userStats.longestStreak) >= b.requirement
    );

    // Award all achieved streak badges
    badges.push(...streakBadges);

    return badges;
  },

  // Check exploration badges
  async checkExplorationBadges(
    userId: string, 
    userStats: UserStats, 
    newWineRecord: WineRecord, 
    currentBadgeIds: string[]
  ): Promise<Badge[]> {
    const badges: Badge[] = [];

    // Check country badges
    const uniqueCountries = Object.keys(userStats.countryDistribution).length;
    const countryBadges = BADGE_DEFINITIONS.filter(b => 
      b.id.startsWith('countries_') && 
      !currentBadgeIds.includes(b.id) &&
      uniqueCountries >= b.requirement
    );
    badges.push(...countryBadges);

    // Check variety badges
    const uniqueVarieties = Object.keys(userStats.varietyDistribution).length;
    const varietyBadges = BADGE_DEFINITIONS.filter(b => 
      b.id.startsWith('varieties_') && 
      !currentBadgeIds.includes(b.id) &&
      uniqueVarieties >= b.requirement
    );
    badges.push(...varietyBadges);

    // Check price range badges (simplified implementation)
    if (newWineRecord.price) {
      const priceRangeBadges = await this.checkPriceRangeBadges(userId, newWineRecord.price, currentBadgeIds);
      badges.push(...priceRangeBadges);
    }

    return badges;
  },

  // Check price range badges
  async checkPriceRangeBadges(_userId: string, price: number, currentBadgeIds: string[]): Promise<Badge[]> {
    const badges: Badge[] = [];
    // This would require additional queries to count wines in each price range
    // Simplified implementation - just check if badge should be awarded
    
    let priceCategory = '';
    if (price <= 3000) priceCategory = 'price_budget';
    else if (price <= 5000) priceCategory = 'price_mid';
    else if (price <= 10000) priceCategory = 'price_premium';
    else priceCategory = 'price_luxury';

    const badge = BADGE_DEFINITIONS.find(b => b.id === priceCategory);
    if (badge && !currentBadgeIds.includes(badge.id)) {
      // TODO: Check if user has 5 wines in this price range
      // For now, award immediately
      badges.push(badge);
    }

    return badges;
  },

  // Award badge to user
  async awardBadge(userId: string, badge: Badge): Promise<void> {
    await addDoc(collection(db, 'user_badges'), {
      userId,
      badgeId: badge.id,
      badgeName: badge.name,
      badgeIcon: badge.icon,
      badgeDescription: badge.description,
      badgeCategory: badge.category,
      badgeTier: badge.tier,
      earnedAt: Timestamp.now()
    });
  },

  // Get user's badges
  async getUserBadges(userId: string): Promise<(Badge & { earnedAt: Date })[]> {
    const q = query(
      collection(db, 'user_badges'),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      const badge = getBadgeById(data.badgeId);
      return {
        ...badge!,
        earnedAt: data.earnedAt.toDate()
      };
    }).filter(badge => badge.id); // Filter out null badges
  },

  // Get badge progress for user
  async getBadgeProgress(userId: string, userStats: UserStats): Promise<{
    category: Badge['category'];
    badges: (Badge & { earned: boolean; progress: number })[];
  }[]> {
    const currentBadges = await this.getUserBadges(userId);
    const earnedBadgeIds = currentBadges.map(b => b.id);

    const categories: Badge['category'][] = ['recording', 'streak', 'quiz', 'exploration'];
    
    return categories.map(category => ({
      category,
      badges: BADGE_DEFINITIONS
        .filter(badge => badge.category === category)
        .map(badge => ({
          ...badge,
          earned: earnedBadgeIds.includes(badge.id),
          progress: this.calculateBadgeProgress(badge, userStats)
        }))
        .sort((a, b) => a.tier - b.tier)
    }));
  },

  // Calculate progress towards a badge
  calculateBadgeProgress(badge: Badge, userStats: UserStats): number {
    switch (badge.category) {
      case 'recording':
        return Math.min(100, (userStats.totalRecords / badge.requirement) * 100);
      case 'streak': {
        const maxStreak = Math.max(userStats.currentStreak, userStats.longestStreak);
        return Math.min(100, (maxStreak / badge.requirement) * 100);
      }
      case 'quiz':
        return Math.min(100, (userStats.totalQuizzes / badge.requirement) * 100);
      case 'exploration':
        if (badge.id.startsWith('countries_')) {
          const uniqueCountries = Object.keys(userStats.countryDistribution).length;
          return Math.min(100, (uniqueCountries / badge.requirement) * 100);
        } else if (badge.id.startsWith('varieties_')) {
          const uniqueVarieties = Object.keys(userStats.varietyDistribution).length;
          return Math.min(100, (uniqueVarieties / badge.requirement) * 100);
        }
        return 0;
      default:
        return 0;
    }
  }
};