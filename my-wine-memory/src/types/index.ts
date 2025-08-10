// User types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  nickname?: string;
  level: number;
  xp: number;
  streak: number;
  totalRecords: number;
  badges: Badge[];
  createdAt: Date;
  updatedAt: Date;
  // Privacy settings
  privacySettings?: {
    defaultRecordVisibility: 'public' | 'private';
    allowPublicProfile: boolean;
    pushNotifications: boolean;
  };
}

// Wine Master Data (shared across users)
export interface WineMaster {
  id: string;
  
  // Basic wine information (required)
  wineName: string;
  producer: string;
  country: string;
  region: string;
  
  // Optional wine information
  vintage?: number;
  grapeVarieties?: string[];
  wineType?: 'red' | 'white' | 'rose' | 'sparkling' | 'dessert' | 'fortified';
  alcoholContent?: number;
  
  // Technical wine info
  soilInfo?: string;
  climate?: string;
  wineHistory?: string;
  winemaker?: string;
  
  // Metadata
  createdAt: Date;
  createdBy: string; // user ID who first added this wine
  referenceCount: number; // how many users have tasted this wine
  updatedAt: Date;
}

// Individual tasting records (user-specific experiences)
export interface TastingRecord {
  id: string;
  userId: string;
  wineId: string; // reference to WineMaster
  
  // Required tasting info
  overallRating: number; // 0.0-10.0
  tastingDate: Date;
  recordMode: 'quick' | 'detailed';
  
  // Optional tasting-specific info
  price?: number; // price at time of purchase
  purchaseLocation?: string;
  notes?: string; // personal notes and impressions
  
  // Detailed analysis (detailed mode only)
  detailedAnalysis?: {
    appearance?: {
      color: string;
      intensity: number; // 1-5
      clarity: string;
      viscosity: string;
    };
    
    aroma?: {
      firstImpression: { intensity: number; notes: string };
      afterSwirling: { intensity: number; notes: string };
      categories: {
        fruity: number;
        floral: number;
        spicy: number;
        herbal: number;
        earthy: number;
        woody: number;
        other: number;
      };
      specificAromas: string[];
    };
    
    taste?: {
      attack: { intensity: number; notes: string };
      development: { complexity: number; notes: string };
      finish: { length: number; seconds?: number; notes: string };
    };
    
    structure?: {
      acidity: { intensity: number; type?: string[] };
      tannins: { intensity: number; texture?: string[] };
      sweetness: number; // 1-5 (dry to very sweet)
      body: number; // 1-5 (light to full)
    };
    
    // Time-based changes
    timeBasedNotes?: {
      time: string;
      temperature?: number;
      notes: string;
    }[];
  };
  
  // Environment and context
  environment?: {
    temperature?: number;
    decanted?: boolean;
    glassType?: string;
    lighting?: string;
    mood?: string;
    companions?: string;
    occasion?: string;
  };
  
  // Media
  images?: string[];
  referenceUrls?: string[];
  
  // Metadata
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Legacy WineRecord type for backward compatibility
export interface WineRecord extends TastingRecord {
  // Include wine master data for easy access
  wineName: string;
  producer: string;
  country: string;
  region: string;
  vintage?: number;
  grapeVarieties?: string[];
  wineType?: string;
  alcoholContent?: number;
}

// Draft types (for auto-save functionality)
export interface WineDraft {
  id: string;
  userId: string;
  data: Partial<WineRecord>;
  lastSaved: Date;
}

export interface TastingDraft {
  id: string;
  userId: string;
  wineId?: string; // if wine is already selected
  wineMasterData?: Partial<WineMaster>; // if creating new wine
  tastingData: Partial<TastingRecord>;
  lastSaved: Date;
}

// Badge system
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'recording' | 'streak' | 'quiz' | 'exploration';
  tier: number;
  requirement: number;
  earnedAt?: Date;
}

// Quiz system
export interface QuizQuestion {
  id: string;
  difficulty: number; // 1-10
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizProgress {
  userId: string;
  questionId: string;
  correctCount: number;
  incorrectCount: number;
  lastAnswered: Date;
  nextReviewDate: Date;
  difficulty: number;
}

export interface QuizSession {
  id: string;
  userId: string;
  questions: QuizQuestion[];
  answers: (number | null)[];
  currentQuestion: number;
  score: number;
  startedAt: Date;
  completedAt?: Date;
}

// Gamification
export interface DailyGoal {
  userId: string;
  date: string; // YYYY-MM-DD
  wineRecordingGoal: number;
  quizGoal: number;
  wineRecordingCompleted: number;
  quizCompleted: number;
  xpEarned: number;
}

// Statistics
export interface UserStats {
  userId: string;
  totalRecords: number;
  totalQuizzes: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  xp: number;
  badgeCount: number;
  monthlyRecords: { [key: string]: number }; // YYYY-MM: count
  countryDistribution: { [country: string]: number };
  varietyDistribution: { [variety: string]: number };
  averageRating: number;
  updatedAt: Date;
}