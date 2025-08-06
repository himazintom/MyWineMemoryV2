import type { Badge } from '../types';

export const BADGE_DEFINITIONS: Badge[] = [
  // 記録数バッジ (12段階)
  { id: 'records_1', name: 'ビギナー', description: '1本のワインを記録', icon: '🥉', category: 'recording', tier: 1, requirement: 1 },
  { id: 'records_3', name: 'スターター', description: '3本のワインを記録', icon: '🥉', category: 'recording', tier: 2, requirement: 3 },
  { id: 'records_5', name: 'ルーキー', description: '5本のワインを記録', icon: '🥉', category: 'recording', tier: 3, requirement: 5 },
  { id: 'records_10', name: '愛好家', description: '10本のワインを記録', icon: '🥈', category: 'recording', tier: 4, requirement: 10 },
  { id: 'records_25', name: '常連', description: '25本のワインを記録', icon: '🥈', category: 'recording', tier: 5, requirement: 25 },
  { id: 'records_50', name: '通', description: '50本のワインを記録', icon: '🥈', category: 'recording', tier: 6, requirement: 50 },
  { id: 'records_100', name: 'エキスパート', description: '100本のワインを記録', icon: '🥇', category: 'recording', tier: 7, requirement: 100 },
  { id: 'records_200', name: 'プロ', description: '200本のワインを記録', icon: '🥇', category: 'recording', tier: 8, requirement: 200 },
  { id: 'records_500', name: 'マスター', description: '500本のワインを記録', icon: '💎', category: 'recording', tier: 9, requirement: 500 },
  { id: 'records_1000', name: 'グランドマスター', description: '1000本のワインを記録', icon: '💎', category: 'recording', tier: 10, requirement: 1000 },
  { id: 'records_2000', name: 'レジェンド', description: '2000本のワインを記録', icon: '👑', category: 'recording', tier: 11, requirement: 2000 },
  { id: 'records_5000', name: '神', description: '5000本のワインを記録', icon: '🌟', category: 'recording', tier: 12, requirement: 5000 },

  // 連続記録バッジ (10段階)
  { id: 'streak_3', name: '3日連続', description: '3日連続でワインを記録', icon: '🔥', category: 'streak', tier: 1, requirement: 3 },
  { id: 'streak_7', name: '7日連続', description: '1週間連続でワインを記録', icon: '🔥', category: 'streak', tier: 2, requirement: 7 },
  { id: 'streak_14', name: '2週間連続', description: '2週間連続でワインを記録', icon: '🔥🔥', category: 'streak', tier: 3, requirement: 14 },
  { id: 'streak_30', name: '1ヶ月連続', description: '1ヶ月連続でワインを記録', icon: '🔥🔥', category: 'streak', tier: 4, requirement: 30 },
  { id: 'streak_50', name: '50日連続', description: '50日連続でワインを記録', icon: '🔥🔥🔥', category: 'streak', tier: 5, requirement: 50 },
  { id: 'streak_100', name: '100日連続', description: '100日連続でワインを記録', icon: '⭐', category: 'streak', tier: 6, requirement: 100 },
  { id: 'streak_200', name: '200日連続', description: '200日連続でワインを記録', icon: '⭐⭐', category: 'streak', tier: 7, requirement: 200 },
  { id: 'streak_365', name: '1年連続', description: '1年間連続でワインを記録', icon: '⭐⭐⭐', category: 'streak', tier: 8, requirement: 365 },
  { id: 'streak_500', name: '500日連続', description: '500日連続でワインを記録', icon: '💫', category: 'streak', tier: 9, requirement: 500 },
  { id: 'streak_1000', name: '1000日連続', description: '1000日連続でワインを記録', icon: '🌟', category: 'streak', tier: 10, requirement: 1000 },

  // クイズバッジ (15段階)
  { id: 'quiz_10', name: '入門者', description: '10問正解', icon: '📚', category: 'quiz', tier: 1, requirement: 10 },
  { id: 'quiz_25', name: '初級者', description: '25問正解', icon: '📚', category: 'quiz', tier: 2, requirement: 25 },
  { id: 'quiz_50', name: '中級者', description: '50問正解', icon: '📚', category: 'quiz', tier: 3, requirement: 50 },
  { id: 'quiz_100', name: '上級者', description: '100問正解', icon: '📖', category: 'quiz', tier: 4, requirement: 100 },
  { id: 'quiz_200', name: '優等生', description: '200問正解', icon: '📖', category: 'quiz', tier: 5, requirement: 200 },
  { id: 'quiz_500', name: '秀才', description: '500問正解', icon: '🎓', category: 'quiz', tier: 6, requirement: 500 },
  { id: 'quiz_1000', name: '天才', description: '1000問正解', icon: '🎓', category: 'quiz', tier: 7, requirement: 1000 },
  { id: 'quiz_2000', name: '賢者', description: '2000問正解', icon: '🧠', category: 'quiz', tier: 8, requirement: 2000 },
  { id: 'quiz_streak_5', name: '5問連続', description: '5問連続正解', icon: '⚡', category: 'quiz', tier: 9, requirement: 5 },
  { id: 'quiz_streak_10', name: '10問連続', description: '10問連続正解', icon: '⚡⚡', category: 'quiz', tier: 10, requirement: 10 },
  { id: 'quiz_streak_20', name: '20問連続', description: '20問連続正解', icon: '⚡⚡⚡', category: 'quiz', tier: 11, requirement: 20 },
  { id: 'quiz_beginner', name: '初級編完全制覇', description: '初級編を完全制覇', icon: '🏆', category: 'quiz', tier: 12, requirement: 100 },
  { id: 'quiz_intermediate', name: '中級編完全制覇', description: '中級編を完全制覇', icon: '🏆', category: 'quiz', tier: 13, requirement: 100 },
  { id: 'quiz_advanced', name: '上級編完全制覇', description: '上級編を完全制覇', icon: '🏆', category: 'quiz', tier: 14, requirement: 100 },
  { id: 'quiz_master', name: '仙人編完全制覇', description: '仙人編を完全制覇', icon: '🏆', category: 'quiz', tier: 15, requirement: 100 },

  // 探求バッジ
  { id: 'countries_2', name: '2カ国探検家', description: '2カ国のワインを記録', icon: '🌍', category: 'exploration', tier: 1, requirement: 2 },
  { id: 'countries_5', name: '5カ国探検家', description: '5カ国のワインを記録', icon: '🌍', category: 'exploration', tier: 2, requirement: 5 },
  { id: 'countries_10', name: '10カ国探検家', description: '10カ国のワインを記録', icon: '🌍', category: 'exploration', tier: 3, requirement: 10 },
  { id: 'countries_20', name: '20カ国探検家', description: '20カ国のワインを記録', icon: '🌍', category: 'exploration', tier: 4, requirement: 20 },
  
  { id: 'varieties_3', name: '3品種愛好家', description: '3品種のワインを記録', icon: '🍇', category: 'exploration', tier: 1, requirement: 3 },
  { id: 'varieties_5', name: '5品種愛好家', description: '5品種のワインを記録', icon: '🍇', category: 'exploration', tier: 2, requirement: 5 },
  { id: 'varieties_10', name: '10品種愛好家', description: '10品種のワインを記録', icon: '🍇', category: 'exploration', tier: 3, requirement: 10 },
  { id: 'varieties_20', name: '20品種愛好家', description: '20品種のワインを記録', icon: '🍇', category: 'exploration', tier: 4, requirement: 20 },
  { id: 'varieties_50', name: '50品種愛好家', description: '50品種のワインを記録', icon: '🍇', category: 'exploration', tier: 5, requirement: 50 },
  
  { id: 'price_budget', name: '予算派', description: '3000円以下のワインを5本記録', icon: '💰', category: 'exploration', tier: 1, requirement: 5 },
  { id: 'price_mid', name: '中級派', description: '3000-5000円のワインを5本記録', icon: '💰', category: 'exploration', tier: 2, requirement: 5 },
  { id: 'price_premium', name: '上級派', description: '5000-10000円のワインを5本記録', icon: '💰', category: 'exploration', tier: 3, requirement: 5 },
  { id: 'price_luxury', name: '高級派', description: '10000円以上のワインを5本記録', icon: '💰', category: 'exploration', tier: 4, requirement: 5 },
  
  { id: 'vintage_3', name: '3年代コレクター', description: '3つの年代のワインを記録', icon: '📅', category: 'exploration', tier: 1, requirement: 3 },
  { id: 'vintage_5', name: '5年代コレクター', description: '5つの年代のワインを記録', icon: '📅', category: 'exploration', tier: 2, requirement: 5 },
  { id: 'vintage_10', name: '10年代コレクター', description: '10つの年代のワインを記録', icon: '📅', category: 'exploration', tier: 3, requirement: 10 }
];

export const getBadgeById = (badgeId: string): Badge | undefined => {
  return BADGE_DEFINITIONS.find(badge => badge.id === badgeId);
};

export const getBadgesByCategory = (category: Badge['category']): Badge[] => {
  return BADGE_DEFINITIONS.filter(badge => badge.category === category);
};