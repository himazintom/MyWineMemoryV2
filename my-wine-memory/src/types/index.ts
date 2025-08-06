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
}

// Wine recording types
export interface WineRecord {
  id: string;
  userId: string;
  
  // Basic information (required in quick mode)
  wineName: string;
  producer: string;
  country: string;
  region: string;
  overallRating: number; // 1-10
  
  // Optional basic info
  vintage?: number;
  price?: number;
  grapeVarieties?: string[];
  alcoholContent?: number;
  notes?: string;
  
  // Detailed analysis (detailed mode)
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
  recordMode: 'quick' | 'detailed';
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Time-based changes
  timeBasedNotes?: {
    time: string;
    temperature?: number;
    notes: string;
  }[];
}

// Draft type (for auto-save functionality)
export interface WineDraft {
  id: string;
  userId: string;
  data: Partial<WineRecord>;
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