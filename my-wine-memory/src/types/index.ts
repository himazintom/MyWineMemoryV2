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
  // Public sharing
  isPublic?: boolean;
  publicSlug?: string;
}

// Tasting record: User's personal experience with a wine
export interface TastingRecord {
  id: string;
  userId: string;
  wineId: string; // Reference to WineMaster - the only wine identifier needed

  // Required tasting info
  overallRating: number; // 0.0-10.0
  tastingDate: Date | string;
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

// Combined type for UI display: Wine info + Tasting data
export interface WineRecord extends WineMaster {
  // Tasting-specific fields
  recordId: string; // TastingRecord ID
  overallRating: number;
  tastingDate: Date | string;
  recordMode: 'quick' | 'detailed';
  price?: number;
  purchaseLocation?: string;
  notes?: string;
  detailedAnalysis?: TastingRecord['detailedAnalysis'];
  environment?: TastingRecord['environment'];
  images?: string[];
  referenceUrls?: string[];
  isPublic: boolean;
  userId: string;
}

// WineMaster: Shared wine data to prevent duplicates
export interface WineMaster {
  id: string;
  wineName: string;
  producer: string;
  country: string;
  region: string;
  vintage?: number;
  grapeVarieties?: string[];
  wineType?: 'red' | 'white' | 'rose' | 'sparkling' | 'dessert' | 'fortified';
  alcoholContent?: number;

  // Technical wine info (optional)
  soilInfo?: string;
  climate?: string;
  wineHistory?: string;
  winemaker?: string;

  // Metadata
  createdAt: Date;
  createdBy: string;
  referenceCount: number;
  updatedAt: Date;
}

// Draft types (for auto-save functionality)
// Note: Drafts may contain temporary wine info before WineMaster is created
export interface WineDraft {
  id: string;
  userId: string;
  data: Partial<TastingRecord> & {
    // Temporary wine fields (before WineMaster creation)
    wineName?: string;
    producer?: string;
    country?: string;
    region?: string;
    vintage?: number;
    grapeVarieties?: string[];
    wineType?: 'red' | 'white' | 'rose' | 'sparkling' | 'dessert' | 'fortified';
    alcoholContent?: number;
  };
  lastSaved: Date;
}

export interface TastingDraft extends WineDraft {}

// Public sharing types
export interface PublicWineRecord {
  id: string;
  wineName: string;
  producer: string;
  country: string;
  region: string;
  vintage?: number;
  grapeVarieties?: string[];
  wineType?: 'red' | 'white' | 'rose' | 'sparkling' | 'dessert' | 'fortified';
  alcoholContent?: number;
  overallRating: number;
  tastingDate: Date | string;
  recordMode: 'quick' | 'detailed';
  notes?: string;
  images?: string[];
  detailedAnalysis?: TastingRecord['detailedAnalysis'];
  environment?: TastingRecord['environment'];
  createdAt: Date;
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

// Public sharing interface
export interface PublicWineRecord {
  id: string;
  wineName: string;
  producer: string;
  country: string;
  region: string;
  vintage?: number;
  overallRating: number;
  tastingDate: Date | string;
  recordMode: 'quick' | 'detailed';
  notes?: string;
  images?: string[];
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
  mostCommonType?: string;
  updatedAt: Date;
}