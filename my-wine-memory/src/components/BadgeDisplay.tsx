import React from 'react';
import type { Badge } from '../types';

interface BadgeDisplayProps {
  badges: (Badge & { earned: boolean; progress?: number })[];
  category: Badge['category'];
  title: string;
  showProgress?: boolean;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ 
  badges, 
  category, 
  title, 
  showProgress = false 
}) => {
  const categoryBadges = badges.filter(badge => badge.category === category);

  if (categoryBadges.length === 0) {
    return null;
  }

  return (
    <div className="badge-category">
      <h3 className="badge-category-title">{title}</h3>
      <div className="badge-grid">
        {categoryBadges.map((badge) => (
          <div
            key={badge.id}
            className={`badge-item ${badge.earned ? 'earned' : 'not-earned'}`}
            title={badge.description}
          >
            <div className="badge-icon">
              {badge.icon}
            </div>
            <div className="badge-info">
              <div className="badge-name">{badge.name}</div>
              <div className="badge-requirement">
                {badge.requirement} {getCategoryUnit(category)}
              </div>
              {showProgress && badge.progress !== undefined && !badge.earned && (
                <div className="badge-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${Math.min(100, badge.progress)}%` }}
                    />
                  </div>
                  <div className="progress-text">
                    {Math.round(badge.progress)}%
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component for displaying earned badges only
interface EarnedBadgesProps {
  badges: (Badge & { earnedAt?: Date })[];
  limit?: number;
}

export const EarnedBadges: React.FC<EarnedBadgesProps> = ({ badges, limit }) => {
  const displayBadges = limit ? badges.slice(0, limit) : badges;

  if (displayBadges.length === 0) {
    return (
      <div className="no-badges">
        <p>まだバッジを獲得していません</p>
        <p>ワインの記録やクイズに挑戦してバッジを集めよう！</p>
      </div>
    );
  }

  return (
    <div className="earned-badges">
      <div className="badge-grid">
        {displayBadges.map((badge) => (
          <div key={badge.id} className="badge-item earned">
            <div className="badge-icon">
              {badge.icon}
            </div>
            <div className="badge-info">
              <div className="badge-name">{badge.name}</div>
              <div className="badge-description">{badge.description}</div>
              {badge.earnedAt && (
                <div className="badge-earned-date">
                  {badge.earnedAt.toLocaleDateString('ja-JP')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {limit && badges.length > limit && (
        <div className="more-badges">
          他 {badges.length - limit} 個のバッジ
        </div>
      )}
    </div>
  );
};

// Component for displaying level and XP
interface LevelDisplayProps {
  level: number;
  xp: number;
  xpForNextLevel: number;
}

export const LevelDisplay: React.FC<LevelDisplayProps> = ({ level, xp, xpForNextLevel }) => {
  // Calculate total XP required to reach current level
  const totalXpForCurrentLevel = calculateTotalXpForLevel(level);
  // Calculate current level progress (XP in current level only)
  const currentLevelXp = xp - totalXpForCurrentLevel;
  // Ensure currentLevelXp is not negative
  const validCurrentLevelXp = Math.max(0, currentLevelXp);
  const progressPercentage = (validCurrentLevelXp / xpForNextLevel) * 100;

  return (
    <div className="level-display">
      <div className="level-header">
        <div className="level-badge">
          <span className="level-icon">⭐</span>
          <span className="level-number">レベル {level}</span>
        </div>
      </div>
      <div className="xp-section">
        <div className="xp-total">
          <span className="xp-label">累計経験値</span>
          <span className="xp-value">{xp.toLocaleString()} XP</span>
        </div>
        <div className="level-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill level-progress-fill" 
              style={{ width: `${Math.min(100, progressPercentage)}%` }}
            />
          </div>
          <div className="progress-details">
            <span className="progress-current">{validCurrentLevelXp.toLocaleString()}</span>
            <span className="progress-separator">/</span>
            <span className="progress-needed">{xpForNextLevel.toLocaleString()} XP</span>
          </div>
        </div>
        <div className="next-level-info">
          次のレベルまで <strong>{Math.max(0, xpForNextLevel - validCurrentLevelXp).toLocaleString()}</strong> XP
        </div>
      </div>
    </div>
  );
};

// Component for streak display
interface StreakDisplayProps {
  streak: number;
  showIcon?: boolean;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak, showIcon = true }) => {
  return (
    <div className="streak-display">
      {showIcon && <span className="streak-icon">🔥</span>}
      <span className="streak-number">{streak}</span>
      <span className="streak-text">日連続</span>
    </div>
  );
};

// Helper function to get unit text for each category
function getCategoryUnit(category: Badge['category']): string {
  switch (category) {
    case 'recording':
      return '本記録';
    case 'streak':
      return '日連続';
    case 'quiz':
      return '問正解';
    case 'exploration':
      return '種類';
    default:
      return '';
  }
}

// Helper function to calculate total XP needed for a level
function calculateTotalXpForLevel(level: number): number {
  let totalXp = 0;
  for (let i = 1; i < level; i++) {
    totalXp += Math.floor(100 * Math.pow(1.2, i - 1));
  }
  return totalXp;
}

// CSS-in-JS styles (you can move this to a separate CSS file)
const styles = `
.badge-category {
  margin-bottom: 2rem;
}

.badge-category-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.badge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.badge-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--card-bg);
  transition: all 0.2s ease;
}

.badge-item.earned {
  border-color: var(--primary-color);
  box-shadow: 0 2px 8px var(--primary-dark-alpha-10);
}

.badge-item.not-earned {
  opacity: 0.6;
  border-style: dashed;
}

.badge-icon {
  font-size: 2rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.badge-info {
  flex: 1;
}

.badge-name {
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.badge-description,
.badge-requirement {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.badge-earned-date {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  font-style: italic;
}

.badge-progress {
  margin-top: 0.5rem;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: var(--secondary-bg);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.level-progress-fill {
  background: var(--gradient-success);
}

.progress-text {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  text-align: center;
}

.no-badges {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.more-badges {
  text-align: center;
  margin-top: 1rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.level-display {
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.level-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.level-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.level-icon {
  font-size: 1.5rem;
}

.level-number {
  font-size: 1.2rem;
  font-weight: bold;
}

.xp-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.xp-total {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.xp-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.xp-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.level-progress {
  margin: 0.5rem 0;
}

.progress-details {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.progress-current {
  color: var(--primary-color);
  font-weight: bold;
}

.progress-separator {
  color: var(--text-secondary);
}

.progress-needed {
  color: var(--text-secondary);
}

.next-level-info {
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
  padding: 0.5rem;
  background: var(--bg-primary);
  border-radius: 6px;
}

.next-level-info strong {
  color: var(--primary-color);
  font-size: 1rem;
}

.streak-display {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: var(--card-bg);
  border: 2px solid var(--primary-color);
  border-radius: 20px;
  font-weight: bold;
}

.streak-icon {
  font-size: 1.2rem;
}

.streak-number {
  font-size: 1.1rem;
  color: var(--primary-color);
}

.streak-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .badge-grid {
    grid-template-columns: 1fr;
  }
  
  .level-info {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default BadgeDisplay;