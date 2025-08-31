# MyWineMemory コードレビュー用ドキュメント

生成日時: 2025/8/29 7:54:31

## 目次

1. [App.tsx](#apptsx)
2. [main.tsx](#maintsx)
3. [index.ts](#indexts)
4. [firebase.ts](#firebasets)
5. [wineMasterService.ts](#winemasterservicets)
6. [tastingRecordService.ts](#tastingrecordservicets)
7. [userService.ts](#userservicets)
8. [gamificationService.ts](#gamificationservicets)
9. [badgeService.ts](#badgeservicets)
10. [advancedQuizService.ts](#advancedquizservicets)
11. [notificationService.ts](#notificationservicets)
12. [AuthContext.tsx](#authcontexttsx)
13. [ThemeContext.tsx](#themecontexttsx)
14. [Home.tsx](#hometsx)
15. [SelectWine.tsx](#selectwinetsx)
16. [AddTastingRecord.tsx](#addtastingrecordtsx)
17. [Records.tsx](#recordstsx)
18. [WineDetail.tsx](#winedetailtsx)
19. [Quiz.tsx](#quiztsx)
20. [QuizGame.tsx](#quizgametsx)
21. [Profile.tsx](#profiletsx)
22. [useAsyncOperation.ts](#useasyncoperationts)
23. [useAutoSave.ts](#useautosavets)
24. [useOfflineSync.ts](#useofflinesyncts)
25. [WineCard.tsx](#winecardtsx)
26. [BottomNavigation.tsx](#bottomnavigationtsx)
27. [BadgeDisplay.tsx](#badgedisplaytsx)

---

## App.tsx

**パス**: `my-wine-memory/src/App.tsx`

```tsx
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorProvider } from './contexts/ErrorContext';
import BottomNavigation from './components/BottomNavigation';
import LoadingSpinner from './components/LoadingSpinner';
// import { OfflineIndicator } from './components/OfflineIndicator';
// import { analyticsService } from './services/analyticsService';
import { errorTrackingService } from './services/errorTrackingService';
import './App.css';

// スクロール位置をリセットするコンポーネント
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Lazy load page components
const Home = React.lazy(() => import('./pages/Home'));
const Quiz = React.lazy(() => import('./pages/Quiz'));
const Stats = React.lazy(() => import('./pages/Stats'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Records = React.lazy(() => import('./pages/Records'));
const SelectWine = React.lazy(() => import('./pages/SelectWine'));
const AddTastingRecord = React.lazy(() => import('./pages/AddTastingRecord'));
const WineDetail = React.lazy(() => import('./pages/WineDetail'));
const QuizGame = React.lazy(() => import('./pages/QuizGame'));
const QuizLevelSelect = React.lazy(() => import('./pages/QuizLevelSelect'));
const PublicProfile = React.lazy(() => import('./pages/PublicProfile'));

function App() {
  // Initialize monitoring services
  useEffect(() => {
    // Initialize error tracking
    errorTrackingService.initialize({
      environment: import.meta.env.VITE_NODE_ENV || 'development',
      release: import.meta.env.VITE_BUILD_VERSION,
    });

    // Start session tracking
    errorTrackingService.startSession();

    // Cleanup on unmount
    return () => {
      errorTrackingService.endSession();
    };
  }, []);

  return (
    <ThemeProvider>
      <ErrorProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <div className="app">
              {/* <OfflineIndicator /> */}
              <main className="main-content">
              <Suspense fallback={
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '50vh' 
                }}>
                  <LoadingSpinner message="ページを読み込み中..." />
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/records" element={<Records />} />
                  <Route path="/select-wine" element={<SelectWine />} />
                  <Route path="/add-tasting-record" element={<AddTastingRecord />} />
                  <Route path="/edit-tasting-record/:recordId" element={<AddTastingRecord />} />
                  <Route path="/wine-detail/:wineId" element={<WineDetail />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/quiz/levels" element={<QuizLevelSelect />} />
                  <Route path="/quiz/play/:difficulty" element={<QuizGame />} />
                  <Route path="/stats" element={<Stats />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/:userId" element={<PublicProfile />} />
                </Routes>
              </Suspense>
            </main>
            <BottomNavigation />
          </div>
          </Router>
        </AuthProvider>
      </ErrorProvider>
    </ThemeProvider>
  );
}

export default App;

```

---

## main.tsx

**パス**: `my-wine-memory/src/main.tsx`

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { pwaService } from './services/pwaService'

// Initialize PWA service
pwaService.registerServiceWorker().then(() => {
  console.log('PWA Service initialized');
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

---

## index.ts

**パス**: `my-wine-memory/src/types/index.ts`

```ts
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

// Unified wine record (all data per user)
export interface TastingRecord {
  id: string;
  userId: string;
  wineId: string; // Reference to WineMaster
  
  // Wine basic information (user-specific)
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

// Legacy WineRecord type for backward compatibility (now same as TastingRecord)
export interface WineRecord extends TastingRecord {}

// Legacy WineMaster type for backward compatibility
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
  soilInfo?: string;
  climate?: string;
  wineHistory?: string;
  winemaker?: string;
  createdAt: Date;
  createdBy: string;
  referenceCount: number;
  updatedAt: Date;
}

// Draft types (for auto-save functionality)
export interface WineDraft {
  id: string;
  userId: string;
  data: Partial<TastingRecord>;
  lastSaved: Date;
}

export interface TastingDraft {
  id: string;
  userId: string;
  data: Partial<TastingRecord>;
  lastSaved: Date;
}

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
  updatedAt: Date;
}
```

---

## firebase.ts

**パス**: `my-wine-memory/src/services/firebase.ts`

```ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, isSupported } from 'firebase/messaging';

// Validate required environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN', 
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}. Please check your .env file.`);
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Firebase Messaging (only in supported environments)
let messaging: ReturnType<typeof getMessaging> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    } else {
      console.warn('Firebase Messaging is not supported in this browser');
    }
  }).catch((error) => {
    console.warn('Error checking Firebase Messaging support:', error);
  });
}

export { messaging };

// Handle Service Worker interference with Firestore
if (typeof window !== 'undefined') {
  // Listen for service worker updates
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', async () => {
      // Re-enable network after service worker update
      try {
        await disableNetwork(db);
        await enableNetwork(db);
        console.log('Firestore network restarted after service worker update');
      } catch (error) {
        console.warn('Failed to restart Firestore network:', error);
      }
    });
  }
}

export default app;
```

---

## wineMasterService.ts

**パス**: `my-wine-memory/src/services/wineMasterService.ts`

```ts
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  increment,
  query, 
  where, 
  orderBy, 
  limit as limitQuery,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import type { WineMaster } from '../types';

class WineMasterService {
  private readonly collection = 'wines_master';

  // Create or find existing wine master
  async createOrFindWineMaster(data: Omit<WineMaster, 'id' | 'createdAt' | 'createdBy' | 'referenceCount' | 'updatedAt'>, userId: string): Promise<string> {
    try {
      // First, try to find existing wine with same basic info
      const existingWine = await this.findExistingWine(
        data.wineName,
        data.producer,
        data.country,
        data.region,
        data.vintage
      );

      if (existingWine) {
        // Increment reference count
        await this.incrementReferenceCount(existingWine.id);
        return existingWine.id;
      }

      // Create new wine master
      const wineMasterData: Omit<WineMaster, 'id'> = {
        ...data,
        createdAt: new Date(),
        createdBy: userId,
        referenceCount: 1,
        updatedAt: new Date()
      };

      // Remove undefined fields before sending to Firestore
      const cleanedData = Object.fromEntries(
        Object.entries(wineMasterData).filter(([, value]) => value !== undefined)
      );

      const docRef = await addDoc(collection(db, this.collection), {
        ...cleanedData,
        createdAt: Timestamp.fromDate(wineMasterData.createdAt),
        updatedAt: Timestamp.fromDate(wineMasterData.updatedAt)
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating wine master:', error);
      throw new Error('ワインマスターデータの作成に失敗しました');
    }
  }

  // Find existing wine with similar basic information
  private async findExistingWine(
    wineName: string,
    producer: string,
    country: string,
    region: string,
    vintage?: number
  ): Promise<WineMaster | null> {
    try {
      let q = query(
        collection(db, this.collection),
        where('wineName', '==', wineName),
        where('producer', '==', producer),
        where('country', '==', country),
        where('region', '==', region)
      );

      if (vintage) {
        q = query(q, where('vintage', '==', vintage));
      }

      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        } as WineMaster;
      }

      return null;
    } catch (error) {
      console.error('Error finding existing wine:', error);
      return null;
    }
  }

  // Get wine master by ID
  async getWineMaster(id: string): Promise<WineMaster | null> {
    try {
      const docRef = doc(db, this.collection, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date()
        } as WineMaster;
      }

      return null;
    } catch (error) {
      console.error('Error getting wine master:', error);
      throw new Error('ワイン情報の取得に失敗しました');
    }
  }

  // Batch get wine masters by IDs (max 10 per call due to 'in' limitation)
  async getWineMastersByIds(ids: string[]): Promise<WineMaster[]> {
    if (ids.length === 0) return [];
    const uniqueIds = Array.from(new Set(ids));
    const chunks: string[][] = [];
    for (let i = 0; i < uniqueIds.length; i += 10) {
      chunks.push(uniqueIds.slice(i, i + 10));
    }

    const results: WineMaster[] = [];
    for (const chunk of chunks) {
      const q = query(
        collection(db, this.collection),
        where('__name__', 'in', chunk)
      );
      const snap = await getDocs(q);
      snap.docs.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        } as WineMaster);
      });
    }
    return results;
  }

  // Search wine masters
  async searchWineMasters(searchTerm: string, limit: number = 20): Promise<WineMaster[]> {
    try {
      const searches = [
        // Search by wine name
        query(
          collection(db, this.collection),
          where('wineName', '>=', searchTerm),
          where('wineName', '<=', searchTerm + '\uf8ff'),
          orderBy('wineName'),
          limitQuery(limit)
        ),
        // Search by producer
        query(
          collection(db, this.collection),
          where('producer', '>=', searchTerm),
          where('producer', '<=', searchTerm + '\uf8ff'),
          orderBy('producer'),
          limitQuery(limit)
        )
      ];

      const results: WineMaster[] = [];
      const seenIds = new Set<string>();

      for (const q of searches) {
        const querySnapshot = await getDocs(q);
        
        querySnapshot.docs.forEach((doc) => {
          if (!seenIds.has(doc.id)) {
            seenIds.add(doc.id);
            results.push({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate() || new Date(),
              updatedAt: doc.data().updatedAt?.toDate() || new Date()
            } as WineMaster);
          }
        });
      }

      // Sort by reference count (popularity) and limit results
      return results
        .sort((a, b) => b.referenceCount - a.referenceCount)
        .slice(0, limit);
    } catch (error) {
      console.error('Error searching wine masters:', error);
      throw new Error('ワインの検索に失敗しました');
    }
  }

  // Get popular wines
  async getPopularWines(limit: number = 10): Promise<WineMaster[]> {
    try {
      const q = query(
        collection(db, this.collection),
        orderBy('referenceCount', 'desc'),
        limitQuery(limit)
      );

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as WineMaster));
    } catch (error) {
      console.error('Error getting popular wines:', error);
      throw new Error('人気ワインの取得に失敗しました');
    }
  }

  // Get wines by country
  async getWinesByCountry(country: string, limit: number = 20): Promise<WineMaster[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('country', '==', country),
        orderBy('referenceCount', 'desc'),
        limitQuery(limit)
      );

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as WineMaster));
    } catch (error) {
      console.error('Error getting wines by country:', error);
      throw new Error('国別ワインの取得に失敗しました');
    }
  }

  // Update wine master data
  async updateWineMaster(id: string, data: Partial<Omit<WineMaster, 'id' | 'createdAt' | 'createdBy' | 'referenceCount'>>): Promise<void> {
    try {
      const docRef = doc(db, this.collection, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error updating wine master:', error);
      throw new Error('ワイン情報の更新に失敗しました');
    }
  }

  // Increment reference count
  private async incrementReferenceCount(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collection, id);
      await updateDoc(docRef, {
        referenceCount: increment(1),
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error incrementing reference count:', error);
      // Don't throw error here, as this is not critical
    }
  }

  // Batch operations for data migration
  // Create new wine master without checking for existing
  async createWineMaster(data: Omit<WineMaster, 'id' | 'createdAt' | 'createdBy' | 'referenceCount' | 'updatedAt'>, userId: string): Promise<WineMaster> {
    try {
      const wineMasterData: Omit<WineMaster, 'id'> = {
        ...data,
        createdAt: new Date(),
        createdBy: userId,
        referenceCount: 1,
        updatedAt: new Date()
      };

      // Remove undefined fields before sending to Firestore
      const cleanedData = Object.fromEntries(
        Object.entries(wineMasterData).filter(([, value]) => value !== undefined)
      );

      const docRef = await addDoc(collection(db, this.collection), {
        ...cleanedData,
        createdAt: Timestamp.fromDate(wineMasterData.createdAt),
        updatedAt: Timestamp.fromDate(wineMasterData.updatedAt)
      });

      return {
        id: docRef.id,
        ...wineMasterData
      };
    } catch (error) {
      console.error('Error creating wine master:', error);
      throw new Error('ワインマスターの作成に失敗しました');
    }
  }

  async batchCreateWineMasters(wines: Omit<WineMaster, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      const now = Timestamp.fromDate(new Date());

      wines.forEach((wine) => {
        const docRef = doc(collection(db, this.collection));
        batch.set(docRef, {
          ...wine,
          createdAt: now,
          updatedAt: now
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error batch creating wine masters:', error);
      throw new Error('ワインマスターデータの一括作成に失敗しました');
    }
  }
}

export const wineMasterService = new WineMasterService();
```

---

## tastingRecordService.ts

**パス**: `my-wine-memory/src/services/tastingRecordService.ts`

```ts
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit as limitQuery,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import type { TastingRecord, WineRecord, PublicWineRecord } from '../types';
import { gamificationService } from './gamificationService';

class TastingRecordService {
  private readonly collection = 'tasting_records';

  // Search existing wines by user
  async searchUserWines(userId: string, searchTerm: string, limit: number = 20): Promise<TastingRecord[]> {
    try {
      const searches = [
        // Search by wine name
        query(
          collection(db, this.collection),
          where('userId', '==', userId),
          where('wineName', '>=', searchTerm),
          where('wineName', '<=', searchTerm + '\uf8ff'),
          orderBy('wineName'),
          limitQuery(limit)
        ),
        // Search by producer
        query(
          collection(db, this.collection),
          where('userId', '==', userId),
          where('producer', '>=', searchTerm),
          where('producer', '<=', searchTerm + '\uf8ff'),
          orderBy('producer'),
          limitQuery(limit)
        )
      ];

      const results: TastingRecord[] = [];
      const seenWines = new Set<string>();

      for (const q of searches) {
        const querySnapshot = await getDocs(q);
        
        querySnapshot.docs.forEach((doc) => {
          const record = {
            id: doc.id,
            ...doc.data(),
            tastingDate: doc.data().tastingDate?.toDate() || new Date(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date()
          } as TastingRecord;
          
          const wineKey = `${record.wineName}-${record.producer}`;
          if (!seenWines.has(wineKey)) {
            seenWines.add(wineKey);
            results.push(record);
          }
        });
      }

      // Return unique wines sorted by wine name
      return results
        .sort((a, b) => a.wineName.localeCompare(b.wineName))
        .slice(0, limit);
    } catch (error) {
      console.error('Error searching user wines:', error);
      throw new Error('ワインの検索に失敗しました');
    }
  }

  // Get popular wines for user (most recorded)
  async getUserPopularWines(userId: string, limit: number = 10): Promise<{wineName: string; producer: string; count: number; lastRecord: TastingRecord}[]> {
    try {
      const allRecords = await this.getUserTastingRecords(userId, 'date', 1000);
      
      const wineGroups: { [key: string]: TastingRecord[] } = {};
      
      allRecords.forEach(record => {
        const wineKey = `${record.wineName}-${record.producer}`;
        if (!wineGroups[wineKey]) {
          wineGroups[wineKey] = [];
        }
        wineGroups[wineKey].push(record);
      });

      const popularWines = Object.entries(wineGroups)
        .map(([, records]) => ({
          wineName: records[0].wineName,
          producer: records[0].producer,
          count: records.length,
          lastRecord: records[0] // Already sorted by date desc
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

      return popularWines;
    } catch (error) {
      console.error('Error getting user popular wines:', error);
      return [];
    }
  }

  // Get unique wines for user
  async getUserUniqueWines(userId: string): Promise<{wineName: string; producer: string; country: string; region: string; vintage?: number}[]> {
    try {
      const allRecords = await this.getUserTastingRecords(userId, 'date', 1000);
      
      const uniqueWines = new Map<string, TastingRecord>();
      
      allRecords.forEach(record => {
        const wineKey = `${record.wineName}-${record.producer}`;
        if (!uniqueWines.has(wineKey)) {
          uniqueWines.set(wineKey, record);
        }
      });

      return Array.from(uniqueWines.values()).map(record => ({
        wineName: record.wineName,
        producer: record.producer,
        country: record.country,
        region: record.region,
        vintage: record.vintage
      }));
    } catch (error) {
      console.error('Error getting unique wines:', error);
      return [];
    }
  }

  // Create new tasting record
  async createTastingRecord(
    userId: string, 
    data: Omit<TastingRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const tastingData: Omit<TastingRecord, 'id'> = {
        userId,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Convert tastingDate string to Date - temporarily disable validation
      const tastingDate = new Date(tastingData.tastingDate);
      const validTastingDate = isNaN(tastingDate.getTime()) ? new Date() : tastingDate;

      const firestoreData = {
        ...tastingData,
        tastingDate: Timestamp.fromDate(validTastingDate),
        createdAt: Timestamp.fromDate(tastingData.createdAt),
        updatedAt: Timestamp.fromDate(tastingData.updatedAt)
      };

      // Debug log for troubleshooting
      console.log('Creating tasting record with data:', {
        userId: firestoreData.userId,
        wineName: firestoreData.wineName,
        producer: firestoreData.producer,
        overallRating: firestoreData.overallRating,
        recordMode: firestoreData.recordMode,
        tastingDate: validTastingDate.toISOString(),
        hasImages: !!firestoreData.images,
        hasDetailedAnalysis: !!firestoreData.detailedAnalysis
      });

      const docRef = await addDoc(collection(db, this.collection), firestoreData);

      // Process gamification after successful record creation
      try {
        await gamificationService.processWineRecording(userId, data.recordMode);
      } catch (gamificationError) {
        console.error('Error processing gamification for wine record:', gamificationError);
        // Don't fail the main operation if gamification fails
      }

      return docRef.id;
    } catch (error) {
      console.error('Error creating tasting record:', error);
      throw new Error('テイスティング記録の作成に失敗しました');
    }
  }

  // Get tasting record by ID
  async getTastingRecord(id: string): Promise<TastingRecord | null> {
    try {
      const docRef = doc(db, this.collection, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          tastingDate: docSnap.data().tastingDate?.toDate() || new Date(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date()
        } as TastingRecord;
      }

      return null;
    } catch (error) {
      console.error('Error getting tasting record:', error);
      throw new Error('テイスティング記録の取得に失敗しました');
    }
  }

  // Get user's tasting records
  async getUserTastingRecords(
    userId: string, 
    sortBy: 'date' | 'rating' = 'date',
    limit: number = 50
  ): Promise<TastingRecord[]> {
    try {
      let q = query(
        collection(db, this.collection),
        where('userId', '==', userId)
      );

      // Add sorting
      switch (sortBy) {
        case 'date':
          q = query(q, orderBy('tastingDate', 'desc'));
          break;
        case 'rating':
          q = query(q, orderBy('overallRating', 'desc'));
          break;
      }

      q = query(q, limitQuery(limit));

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        tastingDate: doc.data().tastingDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as TastingRecord));
    } catch (error) {
      console.error('Error getting user tasting records:', error);
      throw new Error('ユーザーのテイスティング記録取得に失敗しました');
    }
  }

  // Get tasting records for specific wine (current user only)
  async getTastingRecordsForWine(userId: string, wineName: string, producer: string, limit: number = 20): Promise<TastingRecord[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('userId', '==', userId),
        where('wineName', '==', wineName),
        where('producer', '==', producer),
        orderBy('tastingDate', 'desc'),
        limitQuery(limit)
      );

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        tastingDate: doc.data().tastingDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as TastingRecord));
    } catch (error) {
      console.error('Error getting tasting records for wine:', error);
      throw new Error('ワインのテイスティング記録取得に失敗しました');
    }
  }

  // Get user's tasting records with wine info (for display)
  async getUserTastingRecordsWithWineInfo(
    userId: string, 
    sortBy: 'date' | 'rating' = 'date',
    limit: number = 50
  ): Promise<WineRecord[]> {
    try {
      const tastingRecords = await this.getUserTastingRecords(userId, sortBy, limit);
      
      // TastingRecord already contains all wine info, just return as WineRecord
      return tastingRecords as WineRecord[];
    } catch (error) {
      console.error('Error getting user tasting records with wine info:', error);
      // Return empty array instead of throwing error to prevent UI crashes
      return [];
    }
  }

  // Update tasting record
  async updateTastingRecord(
    id: string, 
    data: Partial<Omit<TastingRecord, 'id' | 'userId' | 'createdAt'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.collection, id);
      const updateData: Record<string, unknown> = {
        ...data,
        updatedAt: Timestamp.fromDate(new Date())
      };

      // Convert tastingDate to Timestamp if provided
      if (data.tastingDate) {
        const tastingDate = new Date(data.tastingDate);
        const now = new Date();
        const validTastingDate = (isNaN(tastingDate.getTime()) || tastingDate > now) ? now : tastingDate;
        updateData.tastingDate = Timestamp.fromDate(validTastingDate);
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating tasting record:', error);
      throw new Error('テイスティング記録の更新に失敗しました');
    }
  }

  // Delete tasting record
  async deleteTastingRecord(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collection, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting tasting record:', error);
      throw new Error('テイスティング記録の削除に失敗しました');
    }
  }

  // Helper function to retry operations
  private async retry<T>(operation: () => Promise<T>, maxRetries: number = 3, delay: number = 1000): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        
        console.warn(`Upload attempt ${attempt} failed, retrying in ${delay}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
    throw new Error('Max retries exceeded');
  }

  // Optimize image to WebP format
  private async optimizeImage(imageFile: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        const { width, height } = img;
        const aspectRatio = width / height;
        
        let newWidth = width;
        let newHeight = height;
        
        if (width > maxWidth) {
          newWidth = maxWidth;
          newHeight = maxWidth / aspectRatio;
        }
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const optimizedFile = new File([blob], `${imageFile.name.split('.')[0]}.webp`, {
              type: 'image/webp'
            });
            resolve(optimizedFile);
          } else {
            reject(new Error('画像の最適化に失敗しました'));
          }
        }, 'image/webp', quality);
      };
      
      img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
      img.src = URL.createObjectURL(imageFile);
    });
  }

  // Upload wine image
  async uploadWineImage(imageFile: File, userId: string): Promise<string> {
    return this.retry(async () => {
      // Optimize image to WebP if it's not already WebP
      let fileToUpload = imageFile;
      if (!imageFile.type.includes('webp') && imageFile.type.startsWith('image/')) {
        try {
          fileToUpload = await this.optimizeImage(imageFile);
          console.log(`Image optimized: ${imageFile.size} bytes -> ${fileToUpload.size} bytes`);
        } catch (optimizationError) {
          console.warn('Image optimization failed, uploading original:', optimizationError);
          fileToUpload = imageFile;
        }
      }
      
      const timestamp = Date.now();
      // Sanitize filename to avoid special characters
      const sanitizedFileName = fileToUpload.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `wine-images/${userId}/${timestamp}_${sanitizedFileName}`;
      const storageRef = ref(storage, fileName);
      
      // Add metadata to help with CORS
      const metadata = {
        contentType: fileToUpload.type,
        customMetadata: {
          'uploadedBy': userId,
          'uploadedAt': new Date().toISOString()
        }
      };
      
      const snapshot = await uploadBytes(storageRef, fileToUpload, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Use alternative URL format to avoid CORS issues
      const bucketName = 'mywinememory-4bdf9.firebasestorage.app';
      const encodedPath = encodeURIComponent(fileName);
      const alternativeURL = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media`;
      
      // Try to verify the alternative URL is accessible
      try {
        const response = await fetch(alternativeURL, { method: 'HEAD' });
        if (response.ok) {
          return alternativeURL;
        }
      } catch (error) {
        console.warn('Alternative URL verification failed, using standard URL:', error);
      }
      
      return downloadURL;
    }).catch((error) => {
      console.error('Error uploading wine image after retries:', error);
      
      // More specific error handling
      if (error instanceof Error) {
        if (error.message.includes('CORS')) {
          throw new Error('画像のアップロードでCORSエラーが発生しました。しばらく待ってから再度お試しください。');
        } else if (error.message.includes('network')) {
          throw new Error('ネットワークエラーが発生しました。インターネット接続を確認してください。');
        } else if (error.message.includes('permission')) {
          throw new Error('画像アップロードの権限がありません。ログインし直してください。');
        }
      }
      
      throw new Error('画像のアップロードに失敗しました。ファイルサイズが大きすぎるか、一時的な問題が発生している可能性があります。');
    });
  }

  // Get tasting statistics for user
  async getTastingStatistics(userId: string): Promise<{
    totalRecords: number;
    averageRating: number;
    winesByCountry: { [country: string]: number };
    recentActivity: TastingRecord[];
  }> {
    try {
      const allRecords = await this.getUserTastingRecords(userId, 'date', 1000);
      
      const totalRecords = allRecords.length;
      const averageRating = totalRecords > 0 
        ? allRecords.reduce((sum, record) => sum + record.overallRating, 0) / totalRecords 
        : 0;

      // Calculate country distribution from records directly
      const winesByCountry: { [country: string]: number } = {};
      for (const record of allRecords) {
        if (record.country) {
          winesByCountry[record.country] = (winesByCountry[record.country] || 0) + 1;
        }
      }

      const recentActivity = allRecords.slice(0, 10);

      return {
        totalRecords,
        averageRating: Math.round(averageRating * 10) / 10,
        winesByCountry,
        recentActivity
      };
    } catch (error) {
      console.error('Error getting tasting statistics:', error);
      // Return empty statistics instead of throwing error
      return {
        totalRecords: 0,
        averageRating: 0,
        winesByCountry: {},
        recentActivity: []
      };
    }
  }

  // Search tasting records
  async searchTastingRecords(
    userId: string,
    filters: {
      minRating?: number;
      maxRating?: number;
      startDate?: Date;
      endDate?: Date;
      recordMode?: 'quick' | 'detailed';
    } = {},
    limit: number = 50
  ): Promise<WineRecord[]> {
    try {
      let q = query(
        collection(db, this.collection),
        where('userId', '==', userId),
        orderBy('tastingDate', 'desc')
      );

      // Apply filters
      if (filters.minRating !== undefined) {
        q = query(q, where('overallRating', '>=', filters.minRating));
      }
      if (filters.maxRating !== undefined) {
        q = query(q, where('overallRating', '<=', filters.maxRating));
      }
      if (filters.recordMode) {
        q = query(q, where('recordMode', '==', filters.recordMode));
      }

      q = query(q, limitQuery(limit));

      const querySnapshot = await getDocs(q);
      const tastingRecords = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        tastingDate: doc.data().tastingDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as TastingRecord));

      // Filter by date range (client-side due to Firestore limitations with multiple inequalities)
      const filteredRecords = tastingRecords.filter(record => {
        if (filters.startDate && record.tastingDate < filters.startDate) return false;
        if (filters.endDate && record.tastingDate > filters.endDate) return false;
        return true;
      });

      // TastingRecord already contains all wine info, just return as WineRecord
      return filteredRecords as WineRecord[];
    } catch (error) {
      console.error('Error searching tasting records:', error);
      // Return empty array instead of throwing error
      return [];
    }
  }

  // Get public records for sharing (exclude private data)
  async getPublicRecords(userId: string): Promise<PublicWineRecord[]> {
    try {
      const allRecords = await this.getUserTastingRecords(userId, 'date', 1000);
      
      return allRecords
        .filter(record => record.isPublic)
        .map(record => ({
          id: record.id,
          wineName: record.wineName,
          producer: record.producer,
          country: record.country,
          region: record.region,
          vintage: record.vintage,
          overallRating: record.overallRating,
          tastingDate: record.tastingDate instanceof Date ? record.tastingDate : new Date(record.tastingDate),
          recordMode: record.recordMode,
          notes: record.notes,
          images: record.images
          // Exclude: price, purchaseLocation, and other private data
        } as PublicWineRecord));
    } catch (error) {
      console.error('Error getting public records:', error);
      return [];
    }
  }
}

export const tastingRecordService = new TastingRecordService();
```

---

## userService.ts

**パス**: `my-wine-memory/src/services/userService.ts`

```ts
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
import type { User, UserStats, DailyGoal, Badge } from '../types';
import { gamificationService } from './gamificationService';
import { badgeService } from './badgeService';

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

  // Add XP and check for level up (delegated to gamificationService)
  async addXP(userId: string, xpAmount: number, reason: string = 'Manual XP award'): Promise<{ newXp: number; newLevel: number; leveledUp: boolean }> {
    return await gamificationService.awardXP(userId, xpAmount, reason);
  },

  // Get user badges
  async getUserBadges(userId: string): Promise<Badge[]> {
    return await badgeService.getUserBadges(userId);
  },

  // Get badge progress
  async getBadgeProgress(userId: string): Promise<{
    category: Badge['category'];
    badges: (Badge & { earned: boolean; progress: number })[];
  }[]> {
    const userStats = await gamificationService.getUserStats(userId);
    return await badgeService.getBadgeProgress(userId, userStats);
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
  // Get public user profile by slug
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
  },

  // Get public user profile by userId
  async getPublicUserProfileByUserId(userId: string): Promise<{ user: User; stats: UserStats | null } | null> {
    try {
      const user = await userService.getUserProfile(userId);
      if (!user || !user.privacySettings?.allowPublicProfile) {
        return null;
      }
      
      const stats = await userService.getUserStats(user.id);
      
      return { user, stats };
    } catch (error) {
      console.error('Error getting public user profile by userId:', error);
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
```

---

## gamificationService.ts

**パス**: `my-wine-memory/src/services/gamificationService.ts`

```ts
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
    // Award XP for correct answers
    const xpAmount = correctAnswers * XP_REWARDS.QUIZ_CORRECT;
    await this.awardXP(userId, xpAmount, `クイズ正解 ${correctAnswers}/${totalQuestions}問`);
    
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
```

---

## badgeService.ts

**パス**: `my-wine-memory/src/services/badgeService.ts`

```ts
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
```

---

## advancedQuizService.ts

**パス**: `my-wine-memory/src/services/advancedQuizService.ts`

```ts
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
    const questions = await loadQuestionsByLevel(level);
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
    const progress = await this.getLevelProgress(userId, level);
    if (!progress) return [];

    const weights = this.getQuestionWeights(progress);
    const allQuestions = await loadQuestionsByLevel(level);
    
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
```

---

## notificationService.ts

**パス**: `my-wine-memory/src/services/notificationService.ts`

```ts
/**
 * Push Notification Service
 * Handles FCM token management, permission requests, and notification subscriptions
 */

import { 
  getToken, 
  onMessage
} from 'firebase/messaging';
import type { 
  Messaging,
  MessagePayload 
} from 'firebase/messaging';
import { 
  doc, 
  setDoc, 
  deleteDoc, 
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Notification types
export type NotificationType = 
  | 'streak_reminder'      // Daily streak reminders
  | 'quiz_reminder'        // Quiz reminders  
  | 'badge_earned'         // New badge notifications
  | 'weekly_summary'       // Weekly activity summary
  | 'heart_recovery'       // Quiz hearts recovered
  | 'friend_activity';     // Friend's wine records (future)

export interface NotificationSettings {
  enabled: boolean;
  types: {
    [K in NotificationType]: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string;   // HH:mm format
  };
  timezone: string;
}

export interface FCMToken {
  userId: string;
  token: string;
  deviceInfo: {
    userAgent: string;
    platform: string;
    timestamp: Date;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class NotificationService {
  private messaging: Messaging | null = null;
  private vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

  constructor() {
    // Messaging will be initialized asynchronously
    this.initializeMessaging();
  }

  private async initializeMessaging() {
    if (typeof window === 'undefined') return;
    
    try {
      const { messaging } = await import('../services/firebase');
      this.messaging = messaging;
    } catch (error) {
      console.warn('Failed to initialize messaging:', error);
    }
  }

  // Check if notifications are supported
  isSupported(): boolean {
    return (
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window
    );
  }

  // Get current permission status
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      throw new Error('ブラウザが通知をサポートしていません');
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      throw new Error('通知が拒否されています。ブラウザの設定から許可してください');
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Get FCM token
  async getFCMToken(userId: string): Promise<string | null> {
    if (!this.messaging) {
      console.warn('Messaging not initialized');
      return null;
    }

    // Check if VAPID key is configured
    if (!this.vapidKey || this.vapidKey === 'your-vapid-key-here') {
      console.warn('VAPID key not configured. Push notifications will use local notifications only.');
      // Return a dummy token for local notifications
      return `local-${userId}-${Date.now()}`;
    }

    try {
      // Register service worker first
      await this.registerServiceWorker();

      const token = await getToken(this.messaging, {
        vapidKey: this.vapidKey
      });

      if (token) {
        // Save token to Firestore
        await this.saveFCMToken(userId, token);
        return token;
      }

      return null;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      // Fallback to local notifications
      return `local-${userId}-${Date.now()}`;
    }
  }

  // Register service worker for FCM
  private async registerServiceWorker(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker not supported');
    }

    try {
      const registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js'
      );
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }

  // Save FCM token to Firestore
  private async saveFCMToken(userId: string, token: string): Promise<void> {
    try {
      const tokenRef = doc(db, 'fcm_tokens', `${userId}_${token.slice(-8)}`);
      
      const tokenData: Omit<FCMToken, 'id'> = {
        userId,
        token,
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          timestamp: new Date()
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(tokenRef, {
        ...tokenData,
        createdAt: Timestamp.fromDate(tokenData.createdAt),
        updatedAt: Timestamp.fromDate(tokenData.updatedAt),
        'deviceInfo.timestamp': Timestamp.fromDate(tokenData.deviceInfo.timestamp)
      });

      console.log('FCM token saved successfully');
    } catch (error) {
      console.error('Error saving FCM token:', error);
      throw error;
    }
  }

  // Remove FCM token
  async removeFCMToken(userId: string, token: string): Promise<void> {
    try {
      const tokenRef = doc(db, 'fcm_tokens', `${userId}_${token.slice(-8)}`);
      await deleteDoc(tokenRef);
      console.log('FCM token removed successfully');
    } catch (error) {
      console.error('Error removing FCM token:', error);
      throw error;
    }
  }

  // Setup foreground message listener
  setupForegroundMessages(callback: (payload: MessagePayload) => void): void {
    if (!this.messaging) return;

    onMessage(this.messaging, (payload) => {
      console.log('Foreground message received:', payload);
      
      // Show browser notification for foreground messages
      if (Notification.permission === 'granted') {
        const title = payload.notification?.title || 'MyWineMemory';
        const options = {
          body: payload.notification?.body || '',
          icon: '/android/mipmap-mdpi/ic_launcher.png',
          badge: '/android/mipmap-mdpi/ic_launcher.png',
          tag: payload.data?.type || 'general',
          data: payload.data
        };

        new Notification(title, options);
      }

      callback(payload);
    });
  }

  // Get user notification settings
  async getUserNotificationSettings(userId: string): Promise<NotificationSettings> {
    try {
      const settingsRef = doc(db, 'notification_settings', userId);
      const settingsDoc = await getDoc(settingsRef);

      if (settingsDoc.exists()) {
        return settingsDoc.data() as NotificationSettings;
      }

      // Return default settings
      return this.getDefaultNotificationSettings();
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return this.getDefaultNotificationSettings();
    }
  }

  // Update user notification settings
  async updateNotificationSettings(
    userId: string, 
    settings: Partial<NotificationSettings>
  ): Promise<void> {
    try {
      const settingsRef = doc(db, 'notification_settings', userId);
      const currentSettings = await this.getUserNotificationSettings(userId);
      
      const updatedSettings = {
        ...currentSettings,
        ...settings,
        types: {
          ...currentSettings.types,
          ...settings.types
        },
        quietHours: {
          ...currentSettings.quietHours,
          ...settings.quietHours
        }
      };

      await setDoc(settingsRef, updatedSettings);
      console.log('Notification settings updated successfully');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw new Error('通知設定の更新に失敗しました');
    }
  }

  // Get default notification settings
  private getDefaultNotificationSettings(): NotificationSettings {
    return {
      enabled: false,
      types: {
        streak_reminder: true,
        quiz_reminder: true,
        badge_earned: true,
        weekly_summary: false,
        heart_recovery: true,
        friend_activity: false
      },
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00'
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  // Test notification
  async testNotification(): Promise<void> {
    if (Notification.permission !== 'granted') {
      throw new Error('通知の許可が必要です');
    }

    const notification = new Notification('MyWineMemory テスト通知', {
      body: '通知が正常に動作しています！',
      icon: '/android/mipmap-mdpi/ic_launcher.png',
      badge: '/android/mipmap-mdpi/ic_launcher.png',
      tag: 'test'
    });

    setTimeout(() => notification.close(), 5000);
  }

  // Enable notifications for user
  async enableNotifications(userId: string): Promise<boolean> {
    try {
      // Request permission
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        return false;
      }

      // Get FCM token (or local token as fallback)
      const token = await this.getFCMToken(userId);
      if (!token) {
        console.warn('Could not get FCM token, using local notifications only');
        // Continue with local notifications
      }

      // Update settings
      await this.updateNotificationSettings(userId, { enabled: true });

      // Setup foreground message listener
      this.setupForegroundMessages((payload) => {
        console.log('Received notification:', payload);
      });

      return true;
    } catch (error) {
      console.error('Error enabling notifications:', error);
      throw error;
    }
  }

  // Disable notifications for user
  async disableNotifications(userId: string): Promise<void> {
    try {
      // Update settings
      await this.updateNotificationSettings(userId, { enabled: false });
      
      // Note: We keep the FCM token in case user re-enables
      console.log('Notifications disabled successfully');
    } catch (error) {
      console.error('Error disabling notifications:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
```

---

## AuthContext.tsx

**パス**: `my-wine-memory/src/contexts/AuthContext.tsx`

```tsx
import React, { createContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import type { User } from '../types';
import { userService } from '../services/userService';
import { guestDataService } from '../services/guestDataService';
import { wineService } from '../services/wineService';
import { notificationScheduler } from '../services/notificationScheduler';
import type { AuthContextType } from './AuthTypes';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    try {
      console.log('Starting Google sign-in with popup...');
      const result = await signInWithPopup(auth, provider);
      
      // Create or update user profile in Firestore
      const userProfile = await userService.createOrUpdateUser(result.user);
      setUserProfile(userProfile);
      
      return result;
    } catch (error: unknown) {
      console.error('Google sign-in popup error:', error);
      
      if (error && typeof error === 'object' && 'code' in error) {
        const authError = error as { code: string; message?: string };
        if (authError.code === 'auth/popup-closed-by-user') {
          throw new Error('サインインがキャンセルされました');
        } else if (authError.code === 'auth/unauthorized-domain') {
          throw new Error('このドメインは認証が許可されていません');
        } else {
          throw new Error(`サインインエラー: ${authError.message || 'Unknown error'}`);
        }
      } else {
        throw new Error('サインインに失敗しました');
      }
    }
  };

  const signInWithGoogleAndMigrateData = async () => {
    try {
      await signInWithGoogle();
      
      // Migrate guest data if available
      if (guestDataService.hasGuestData()) {
        await migrateGuestData();
      }
    } catch (error) {
      console.error('Sign-in and data migration error:', error);
      throw error;
    }
  };

  const migrateGuestData = async () => {
    if (!currentUser) return;

    try {
      // Migrate guest wine records
      const guestWineRecords = guestDataService.getGuestWineRecords();
      for (const guestRecord of guestWineRecords) {
        const wineRecord = {
          ...guestRecord,
          createdAt: new Date(guestRecord.createdAt)
        };
        delete (wineRecord as { [key: string]: unknown }).tempId;
        await wineService.createWineRecord(currentUser.uid, wineRecord);
      }

      // Migrate guest quiz results (add XP to user profile)
      const guestQuizResults = guestDataService.getGuestQuizResults();
      if (guestQuizResults.length > 0 && userProfile) {
        const totalGuestXP = guestQuizResults.reduce((sum, result) => sum + result.xpEarned, 0);
        await userService.addXP(currentUser.uid, totalGuestXP);
        
        // Update local user profile
        setUserProfile(prev => prev ? {
          ...prev,
          xp: prev.xp + totalGuestXP,
          level: Math.floor((prev.xp + totalGuestXP) / 100) + 1
        } : prev);
      }

      // Clear guest data after successful migration
      guestDataService.clearAllGuestData();
      
      console.log('Guest data migration completed successfully');
    } catch (error) {
      console.error('Guest data migration failed:', error);
      throw new Error('ゲストデータの移行に失敗しました');
    }
  };

  const hasGuestData = () => {
    return guestDataService.hasGuestData();
  };

  const getGuestDataSummary = () => {
    return guestDataService.getGuestDataSummary();
  };

  const logout = async () => {
    try {
      // Cancel all notifications before logging out
      if (currentUser) {
        notificationScheduler.cancelAllUserNotifications(currentUser.uid);
      }
      
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Wait a moment to ensure token is fully available
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Fetch user profile from Firestore
          const profile = await userService.getUserProfile(user.uid);
          setUserProfile(profile);
          
          // Initialize notification schedules for the user
          await notificationScheduler.initializeUserNotifications(user.uid);
        } catch (error) {
          console.error('Failed to load user profile:', error);
        }
      } else {
        setUserProfile(null);
        
        // Cancel all notifications when user logs out
        if (currentUser) {
          notificationScheduler.cancelAllUserNotifications(currentUser.uid);
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);


  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signInWithGoogle,
    signInWithGoogleAndMigrateData,
    logout,
    hasGuestData,
    getGuestDataSummary,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
```

---

## ThemeContext.tsx

**パス**: `my-wine-memory/src/contexts/ThemeContext.tsx`

```tsx
import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Theme, ThemeContextType } from './ThemeTypes';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // ローカルストレージからテーマを読み込み
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // システムのダークモード設定を確認
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    // テーマが変更されたらローカルストレージに保存
    localStorage.setItem('theme', theme);
    
    // HTMLのdata-theme属性を更新
    document.documentElement.setAttribute('data-theme', theme);
    
    // bodyのクラスを更新（既存のCSSとの互換性のため）
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


```

---

## Home.tsx

**パス**: `my-wine-memory/src/pages/Home.tsx`

```tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthHooks';
import { useTheme } from '../contexts/ThemeHooks';
import { tastingRecordService } from '../services/tastingRecordService';
import { draftService } from '../services/wineService';
import { gamificationService } from '../services/gamificationService';
import { guestDataService } from '../services/guestDataService';
import type { WineRecord, WineDraft, DailyGoal } from '../types';
import WineCard from '../components/WineCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { StreakDisplay } from '../components/BadgeDisplay';
import NotificationPrompt from '../components/NotificationPrompt';
import { useAsyncOperation } from '../hooks/useAsyncOperation';
import heroDark from '../assets/images/hero/home-hero-desktop-dark.webp';
import heroLight from '../assets/images/hero/home-hero-desktop-light.webp';
import brandLogo from '../assets/images/logo-icon/logo-icon.svg';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, signInWithGoogle, loading: authInitializing } = useAuth();
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(max-width: 767px)').matches : false
  );
  const [recentWines, setRecentWines] = useState<WineRecord[]>([]);
  const [drafts, setDrafts] = useState<WineDraft[]>([]);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal | null>(null);
  const [authError, setAuthError] = useState<string>('');
  const { loading, error, execute: executeLoadHome } = useAsyncOperation<void>();
  const { loading: authLoading, execute: executeAuth } = useAsyncOperation<void>();

  const loadHomeData = useCallback(async () => {
    // Don't load data while auth is initializing
    if (authInitializing) {
      console.log('Auth still initializing, waiting...');
      return;
    }

    try {
      await executeLoadHome(async () => {
        if (currentUser && !currentUser.isAnonymous) {
          // Ensure user is fully authenticated
          try {
            const token = await currentUser.getIdToken(false);
            if (!token) {
              console.warn('User token not available, skipping data load');
              return;
            }
          } catch (tokenError) {
            console.error('Token retrieval failed:', tokenError);
            return;
          }
          
          // Load authenticated user data
          const [wines, userDrafts, goal] = await Promise.all([
            tastingRecordService.getUserTastingRecordsWithWineInfo(currentUser.uid, 'date', 5).catch(error => {
              console.error('Failed to load wines:', error);
              return [];
            }),
            draftService.getUserDrafts(currentUser.uid).catch(error => {
              console.error('Failed to load drafts:', error);
              return [];
            }),
            gamificationService.getDailyGoal(currentUser.uid).catch(error => {
              console.error('Failed to load daily goal:', error);
              return {
                userId: currentUser.uid,
                date: new Date().toISOString().substring(0, 10),
                wineRecordingGoal: 1,
                quizGoal: 5,
                wineRecordingCompleted: 0,
                quizCompleted: 0,
                xpEarned: 0
              };
            })
          ]);
          
          setRecentWines(wines.slice(0, 3));
          setDrafts(userDrafts);
          setDailyGoal(goal);
        } else {
          console.log('No authenticated user, loading guest data');
          // Load guest data
          const guestWines = guestDataService.getGuestWineRecordsAsWineRecords();
          setRecentWines(guestWines.slice(0, 3));
          setDrafts([]);
          setDailyGoal(null);
        }
      });
    } catch (error) {
      console.error('Failed to load home data:', error);
    }
  }, [currentUser, authInitializing, executeLoadHome]);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  // モバイル判定（リサイズ対応）
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(max-width: 767px)');
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const calculateProgress = (completed: number, goal: number) => {
    return Math.min(100, (completed / goal) * 100);
  };

  const handleDraftClick = (draft: WineDraft) => {
    // TODO: Navigate to select-wine with draft data pre-filled
    navigate('/select-wine', { state: { draftData: draft } });
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    try {
      await executeAuth(async () => {
        await signInWithGoogle();
      });
    } catch (error: unknown) {
      setAuthError(error instanceof Error ? error.message : 'ログインに失敗しました');
    }
  };

  // 可用ならモバイル用ヒーロー画像を使用（存在しない場合はデスクトップを流用）
  const heroModules = import.meta.glob('../assets/images/hero/*', { eager: true }) as Record<string, { default: string }>;
  const getUrl = (p: string) => (heroModules[p]?.default as string | undefined);
  const mobileDark = getUrl('../assets/images/hero/home-hero-mobile-dark.webp');
  const mobileLight = getUrl('../assets/images/hero/home-hero-mobile-light.webp');
  const heroImage = theme === 'dark'
    ? (isMobile && mobileDark ? mobileDark : heroDark)
    : (isMobile && mobileLight ? mobileLight : heroLight);
  const heroStyle = { '--hero-image-url': `url(${heroImage})` } as React.CSSProperties & { '--hero-image-url': string };

  return (
    <div className="page-container">
      <section className="home-hero" style={heroStyle}>
        <div className="hero-overlay">
          <div className="hero-inner">
            <div className="brand">
              <img src={brandLogo} alt="My Wine Memoy" className="brand-logo" />
              <h1 className="brand-title">MyWineMemory</h1>
            </div>
            <p>写真で残す、あなただけのワイン体験</p>
            <div className="hero-actions">
              <button className="action-button primary" onClick={() => navigate('/select-wine')}>
                🍷 ワインを記録する
              </button>
              <button className="action-button secondary" onClick={() => navigate('/quiz')}>
                🧠 クイズに挑戦する
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <main className="home-content">
        {!currentUser && (
          <div className="guest-notice">
            <p>💡 <strong>ゲストモード</strong>で体験中です</p>
            <p>記録やクイズ結果を保存するにはログインが必要です</p>
            <button 
              className="login-suggestion-button"
              onClick={handleGoogleSignIn}
              disabled={authLoading}
            >
              {authLoading ? (
                <LoadingSpinner size="small" message="ログイン中..." />
              ) : (
                <>
                  <span className="google-icon">🔍</span>
                  Googleでログイン
                </>
              )}
            </button>
            {authError && (
              <ErrorMessage
                title="ログインエラー"
                message={authError}
                onRetry={handleGoogleSignIn}
                showIcon={true}
              />
            )}
          </div>
        )}
        
        {/* Gamification Dashboard */}
        {currentUser && (
          <div className="gamification-dashboard">
            <div className="dashboard-header">
              <h2>今日の状況</h2>
              <div className="user-level-streak">
                <div className="level-info">
                  ⭐ レベル {currentUser ? (userProfile?.level || 1) : 1}
                </div>
                <StreakDisplay streak={currentUser ? (userProfile?.streak || 0) : 0} />
              </div>
            </div>
            
            <div className="daily-goals">
              {dailyGoal ? (
                <div className="goals-grid">
                  <div className="goal-item">
                    <div className="goal-header">
                      <span className="goal-icon">🍷</span>
                      <span className="goal-label">ワイン記録</span>
                    </div>
                    <div className="goal-progress">
                      <span className="goal-numbers">{dailyGoal.wineRecordingCompleted}/{dailyGoal.wineRecordingGoal}</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${calculateProgress(dailyGoal.wineRecordingCompleted, dailyGoal.wineRecordingGoal)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="goal-item">
                    <div className="goal-header">
                      <span className="goal-icon">🧠</span>
                      <span className="goal-label">クイズ</span>
                    </div>
                    <div className="goal-progress">
                      <span className="goal-numbers">{dailyGoal.quizCompleted}/{dailyGoal.quizGoal}</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${calculateProgress(dailyGoal.quizCompleted, dailyGoal.quizGoal)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="goals-loading">
                  目標を読み込み中...
                </div>
              )}
              
              {dailyGoal && dailyGoal.xpEarned > 0 && (
                <div className="xp-earned">
                  💎 今日獲得したXP: {dailyGoal.xpEarned} XP
                </div>
              )}
            </div>
          </div>
        )}
        
        {!currentUser && (
          <div className="daily-goals">
            <h2>今日の目標</h2>
            <div className="goal-item">
              <span>ログインして目標を確認しましょう</span>
            </div>
          </div>
        )}
        
        <div className="recent-activity">
          <h2>最近の記録</h2>
          {loading ? (
            <LoadingSpinner size="small" message="最近の記録を読み込み中..." />
          ) : error ? (
            <ErrorMessage
              title="データの読み込みに失敗しました"
              message={error}
              onRetry={loadHomeData}
              showIcon={false}
            />
          ) : recentWines.length > 0 ? (
            <>
              <div className="wine-grid">
                {recentWines.map(wine => (
                  <WineCard 
                    key={wine.id} 
                    wine={wine} 
                    onClick={() => navigate(`/wine-detail/${wine.id}`)}
                  />
                ))}
              </div>
              <button 
                className="view-all-button"
                onClick={() => navigate('/records')}
              >
                すべての記録を見る →
              </button>
            </>
          ) : (
            <div className="empty-state">
              <p>{currentUser ? 'まだワインの記録がありません' : 'まだワインの記録がありません（ゲストモード）'}</p>
              <button 
                className="get-started-button"
                onClick={() => navigate('/select-wine')}
              >
                最初の1本を記録する 🍷
              </button>
            </div>
          )}
        </div>

        {drafts.length > 0 && (
          <div className="drafts-section">
            <h2>下書き ({drafts.length})</h2>
            <div className="draft-list">
              {drafts.slice(0, 2).map(draft => (
                <div 
                  key={draft.id} 
                  className="draft-item"
                  onClick={() => handleDraftClick(draft)}
                >
                  <div className="draft-info">
                    <span className="draft-name">
                      {draft.data.wineName || '名称未入力'}
                    </span>
                    <span className="draft-date">
                      {draft.lastSaved.toLocaleDateString('ja-JP')} に保存
                    </span>
                  </div>
                  <span className="draft-arrow">→</span>
                </div>
              ))}
              {drafts.length > 2 && (
                <p className="more-drafts">他 {drafts.length - 2} 件の下書きがあります</p>
              )}
            </div>
          </div>
        )}
      </main>
      
      {/* Notification Permission Prompt */}
      {currentUser && !currentUser.isAnonymous && (
        <NotificationPrompt />
      )}
    </div>
  );
};

export default Home;
```

---

## SelectWine.tsx

**パス**: `my-wine-memory/src/pages/SelectWine.tsx`

```tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthHooks';
import { tastingRecordService } from '../services/tastingRecordService';
import type { TastingRecord } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import TagInput from '../components/TagInput';
import { useAsyncOperation } from '../hooks/useAsyncOperation';
// import { useOfflineSync } from '../hooks/useOfflineSync';
// import { useNetworkStatus } from '../hooks/useNetworkStatus';

const SelectWine: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<TastingRecord[]>([]);
  const [popularWines, setPopularWines] = useState<{wineName: string; producer: string; count: number; lastRecord: TastingRecord}[]>([]);
  const [showNewWineForm, setShowNewWineForm] = useState(false);
  const [grapeVarieties, setGrapeVarieties] = useState<string[]>([]);
  const [, setIsUsingOfflineData] = useState(false);
  
  const { loading: searchLoading, error: searchError, execute: executeSearch } = useAsyncOperation<TastingRecord[]>();
  const { loading: popularLoading, error: popularError, execute: executeLoadPopular } = useAsyncOperation<{wineName: string; producer: string; count: number; lastRecord: TastingRecord}[]>();
  // const { isOnline } = useNetworkStatus();
  // const { searchCachedWines, getCachedWines, cacheWines } = useOfflineSync(currentUser?.uid);


  const loadPopularWines = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      const wines = await executeLoadPopular(() => tastingRecordService.getUserPopularWines(currentUser.uid, 10));
      if (wines) {
        setPopularWines(wines);
        setIsUsingOfflineData(false);
      }
    } catch (error) {
      console.error('Failed to load popular wines:', error);
    }
  }, [executeLoadPopular, currentUser]);

  const searchWines = useCallback(async () => {
    if (!searchTerm.trim() || !currentUser) return;

    try {
      const results = await executeSearch(() => tastingRecordService.searchUserWines(currentUser.uid, searchTerm, 20));
      if (results) {
        setSearchResults(results);
        setIsUsingOfflineData(false);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Failed to search wines:', error);
      setSearchResults([]);
    }
  }, [searchTerm, executeSearch, currentUser]);

  useEffect(() => {
    loadPopularWines();
  }, [loadPopularWines]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const timeoutId = setTimeout(() => {
        searchWines();
      }, 300); // Debounce search

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, searchWines]);

  const handleSelectWine = (wineName: string, producer: string) => {
    // Navigate with wine info as URL params
    const params = new URLSearchParams({
      wineName,
      producer
    });
    navigate(`/add-tasting-record?${params.toString()}`);
  };

  const handleCreateNewWine = () => {
    setShowNewWineForm(true);
    setGrapeVarieties([]); // Reset grape varieties when opening form
  };

  const handleCancelNewWine = () => {
    setShowNewWineForm(false);
    setGrapeVarieties([]);
  };

  const handleNewWineSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const newWineDataRaw = {
      wineName: formData.get('wineName') as string,
      producer: formData.get('producer') as string,
      country: formData.get('country') as string,
      region: formData.get('region') as string,
      vintage: formData.get('vintage') ? parseInt(formData.get('vintage') as string) : undefined,
      wineType: formData.get('wineType') as 'red' | 'white' | 'rose' | 'sparkling' | 'dessert' | 'fortified' | undefined,
      grapeVarieties: grapeVarieties.length > 0 ? grapeVarieties : undefined
    };

    // Remove undefined values
    const newWineData = Object.fromEntries(
      Object.entries(newWineDataRaw).filter(([, value]) => value !== undefined)
    );

    // Prepare initial tasting record data with purchase info
    const price = formData.get('price');
    const purchaseLocation = formData.get('purchaseLocation') as string;
    const purchaseDate = formData.get('purchaseDate') as string;

    let initialRecordData = null;
    if (price || purchaseLocation || purchaseDate) {
      initialRecordData = {
        price: price ? parseInt(price as string) : undefined,
        purchaseLocation: purchaseLocation || undefined,
        tastingDate: purchaseDate ? new Date(purchaseDate) : new Date(),
        recordMode: 'quick' as const,
        overallRating: 5.0, // Default rating
        notes: '購入記録として登録'
      };

      // Remove undefined values
      initialRecordData = Object.fromEntries(
        Object.entries(initialRecordData).filter(([, value]) => value !== undefined)
      );
    }

    try {
      // Need currentUser for wine creation, show login prompt if not available
      if (!currentUser) {
        alert('ワインの登録にはログインが必要です。');
        return;
      }
      
      // Create tasting record with all wine info included
      const recordData = {
        ...newWineData,
        ...initialRecordData,
        isPublic: false
      };
      
      if (initialRecordData) {
        // Create record with initial data
        await tastingRecordService.createTastingRecord(currentUser.uid, recordData as any);
        navigate('/records');
      } else {
        // Navigate to add tasting record page with wine data
        const params = new URLSearchParams();
        params.set('wineName', String(newWineData.wineName || ''));
        params.set('producer', String(newWineData.producer || ''));
        params.set('country', String(newWineData.country || ''));
        params.set('region', String(newWineData.region || ''));
        if (newWineData.vintage) params.set('vintage', newWineData.vintage.toString());
        if (newWineData.wineType) params.set('wineType', String(newWineData.wineType));
        if (newWineData.grapeVarieties) params.set('grapeVarieties', JSON.stringify(newWineData.grapeVarieties));
        navigate(`/add-tasting-record?${params.toString()}`);
      }
    } catch (error) {
      console.error('Failed to create new wine:', error);
      alert('ワインの登録に失敗しました。再度お試しください。');
    }
  };

  const displayedWines = searchTerm.trim() ? searchResults : popularWines.map(w => w.lastRecord);
  const isLoading = searchTerm.trim() ? searchLoading : popularLoading;
  const error = searchTerm.trim() ? searchError : popularError;

  return (
    <div className="page-container">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← 戻る
        </button>
        <h1>ワインを選択</h1>
      </header>

      <main className="select-wine-content">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="ワイン名、生産者名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <button 
            className="create-new-wine-button"
            onClick={handleCreateNewWine}
          >
            📝 新しいワインを登録
          </button>
        </div>

        {/* Wine List */}
        <div className="wine-list-section">
          <h2>
            {searchTerm.trim() ? `"${searchTerm}" の検索結果` : '人気のワイン'}
          </h2>

          {error && (
            <ErrorMessage
              title="エラーが発生しました"
              message={error}
              onRetry={searchTerm.trim() ? searchWines : loadPopularWines}
            />
          )}

          {isLoading && <LoadingSpinner message="ワインを検索中..." />}

          {!isLoading && !error && displayedWines.length === 0 && searchTerm.trim() && (
            <div className="no-results">
              <p>「{searchTerm}」に一致するワインが見つかりませんでした</p>
              <p>新しいワインを登録してください</p>
            </div>
          )}

          {!isLoading && !error && displayedWines.length > 0 && (
            <div className="wine-list">
              {displayedWines.map((wine, index) => {
                const popularWine = searchTerm.trim() ? null : popularWines[index];
                return (
                  <div 
                    key={wine.id} 
                    className="wine-list-item"
                    onClick={() => handleSelectWine(wine.wineName, wine.producer)}
                  >
                    <div className="wine-info">
                      <h3 className="wine-name">{wine.wineName}</h3>
                      <p className="wine-producer">{wine.producer}</p>
                      <p className="wine-location">{wine.country} - {wine.region}</p>
                      {wine.vintage && (
                        <p className="wine-vintage">{wine.vintage}年</p>
                      )}
                    </div>
                    <div className="wine-stats">
                      <span className="reference-count">
                        {popularWine ? `${popularWine.count}回記録` : '既に記録済み'}
                      </span>
                      <span className="select-arrow">→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* New Wine Form Modal */}
        {showNewWineForm && (
          <div className="modal-backdrop">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>新しいワインを登録</h2>
                <button 
                  className="close-button"
                  onClick={() => setShowNewWineForm(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleNewWineSubmit} className="new-wine-form">
                <div className="form-group">
                  <label htmlFor="wineName">ワイン名 *</label>
                  <input
                    id="wineName"
                    name="wineName"
                    type="text"
                    required
                    placeholder="例: シャトー・マルゴー"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="producer">生産者 *</label>
                  <input
                    id="producer"
                    name="producer"
                    type="text"
                    required
                    placeholder="例: シャトー・マルゴー"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="country">生産国 *</label>
                    <select id="country" name="country" required>
                      <option value="">選択してください</option>
                      <option value="フランス">フランス</option>
                      <option value="イタリア">イタリア</option>
                      <option value="スペイン">スペイン</option>
                      <option value="ドイツ">ドイツ</option>
                      <option value="アメリカ">アメリカ</option>
                      <option value="オーストラリア">オーストラリア</option>
                      <option value="チリ">チリ</option>
                      <option value="アルゼンチン">アルゼンチン</option>
                      <option value="南アフリカ">南アフリカ</option>
                      <option value="日本">日本</option>
                      <option value="その他">その他</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="region">地域 *</label>
                    <input
                      id="region"
                      name="region"
                      type="text"
                      required
                      placeholder="例: ボルドー"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="vintage">ヴィンテージ</label>
                    <input
                      id="vintage"
                      name="vintage"
                      type="number"
                      placeholder="2020"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="wineType">ワインタイプ</label>
                    <select id="wineType" name="wineType">
                      <option value="">選択してください</option>
                      <option value="red">赤ワイン</option>
                      <option value="white">白ワイン</option>
                      <option value="rose">ロゼワイン</option>
                      <option value="sparkling">スパークリングワイン</option>
                      <option value="dessert">デザートワイン</option>
                      <option value="fortified">酒精強化ワイン</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>ブドウ品種</label>
                  <TagInput
                    value={grapeVarieties}
                    onChange={setGrapeVarieties}
                    placeholder="例: カベルネ・ソーヴィニヨン（Enterで追加）"
                  />
                  <small className="field-help">Enterまたはカンマで区切って複数入力できます</small>
                </div>

                <div className="form-section">
                  <h3>購入情報</h3>
                  <small className="field-help">価格と購入店舗を入力してください（任意）</small>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="price">価格</label>
                        <div className="input-with-unit">
                          <input
                            id="price"
                            name="price"
                            type="number"
                            placeholder="3000"
                            min="0"
                            step="10"
                          />
                          <span className="input-unit">円</span>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="purchaseLocation">購入店舗</label>
                        <input
                          id="purchaseLocation"
                          name="purchaseLocation"
                          type="text"
                          placeholder="例: ワインショップ○○"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="purchaseDate">購入日</label>
                      <input
                        id="purchaseDate"
                        name="purchaseDate"
                        type="date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={handleCancelNewWine}>
                    キャンセル
                  </button>
                  <button type="submit" className="btn-primary">
                    次へ（記録入力）
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SelectWine;
```

---

## AddTastingRecord.tsx

**パス**: `my-wine-memory/src/pages/AddTastingRecord.tsx`

```tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthHooks';
import { tastingRecordService } from '../services/tastingRecordService';
import { wineMasterService } from '../services/wineMasterService';
import { userService, goalService } from '../services/userService';
import type { WineMaster } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import LoginPrompt from '../components/LoginPrompt';
import DrawingCanvas from '../components/DrawingCanvas';
import { useAsyncOperation } from '../hooks/useAsyncOperation';
// import { useOfflineSync } from '../hooks/useOfflineSync';
// import { useNetworkStatus } from '../hooks/useNetworkStatus';
// import { useError } from '../contexts/ErrorContext';

const AddTastingRecord: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { wineId } = useParams<{ wineId: string }>();
  const { currentUser } = useAuth();
  
  // Wine state
  const [wine, setWine] = useState<WineMaster | null>(null);
  
  const [recordMode, setRecordMode] = useState<'quick' | 'detailed'>('quick');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);
  // const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  
  const { loading: wineLoading, error: wineError, execute: executeLoadWine } = useAsyncOperation<WineMaster | null>();
  const { loading: saveLoading, error: saveError, execute: executeSave } = useAsyncOperation<void>();
  // const { isOnline } = useNetworkStatus();
  // const { saveDraft, updateDraft, queueOfflineOperation, getCachedWines } = useOfflineSync(currentUser?.uid);
  // const { handleError } = useError();

  const [formData, setFormData] = useState({
    overallRating: 5.0,
    notes: '',
    tastingDate: new Date().toISOString().split('T')[0],
    images: [] as File[],
    drawingDataUrl: '' as string,
    // Detailed analysis fields
    visualAnalysis: {
      color: '',
      clarity: '',
      viscosity: ''
    },
    aromaAnalysis: {
      firstImpression: '',
      afterSwirling: '',
      aromaIntensity: 5,
      aromaCategories: [] as string[]
    },
    tasteAnalysis: {
      attack: '',
      development: '',
      finish: '',
      finishLength: 5
    },
    componentAnalysis: {
      acidity: 5,
      tannins: 5,
      sweetness: 5,
      body: 5,
      alcohol: 5
    },
    environmentalFactors: {
      temperature: '',
      glassware: '',
      decantingTime: ''
    },
    foodPairings: '',
    personalNotes: '',
    referenceUrls: [] as string[]
  });

  // New wine data from location state (if creating new wine)
  const newWineData = location.state?.newWineData;

  const loadWineData = useCallback(async () => {
    if (!wineId || wineId === 'new') return;
    
    try {
      const wineData = await executeLoadWine(() => wineMasterService.getWineMaster(wineId));
      setWine(wineData);
    } catch (error) {
      console.error('Failed to load wine data:', error);
    }
  }, [wineId, executeLoadWine]);

  useEffect(() => {
    if (wineId && wineId !== 'new') {
      loadWineData();
    } else if (newWineData) {
      // Creating new wine - set up temporary wine data
      setWine({
        id: 'new',
        ...newWineData,
        createdAt: new Date(),
        createdBy: '',
        referenceCount: 0,
        updatedAt: new Date()
      } as WineMaster);
    } else {
      navigate('/select-wine');
    }
  }, [wineId, newWineData, loadWineData, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedInputChange = (section: string, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as Record<string, unknown>),
        [field]: value
      }
    }));
  };

  const handleAromaCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      aromaAnalysis: {
        ...prev.aromaAnalysis,
        aromaCategories: prev.aromaAnalysis.aromaCategories.includes(category)
          ? prev.aromaAnalysis.aromaCategories.filter(c => c !== category)
          : [...prev.aromaAnalysis.aromaCategories, category]
      }
    }));
  };

  const addReferenceUrl = () => {
    setFormData(prev => ({
      ...prev,
      referenceUrls: [...prev.referenceUrls, '']
    }));
  };

  const updateReferenceUrl = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      referenceUrls: prev.referenceUrls.map((url, i) => i === index ? value : url)
    }));
  };

  const removeReferenceUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      referenceUrls: prev.referenceUrls.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles: File[] = [];
    const maxFiles = 4;
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (formData.images.length + newFiles.length >= maxFiles) {
        alert(`最大${maxFiles}枚まで登録できます`);
        break;
      }
      
      if (file.size > maxFileSize) {
        alert(`ファイルサイズが大きすぎます（最大5MB）: ${file.name}`);
        continue;
      }
      
      if (!file.type.startsWith('image/')) {
        alert(`画像ファイルのみアップロードできます: ${file.name}`);
        continue;
      }
      
      newFiles.push(file);
    }
    
    if (newFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleDrawingSave = (dataUrl: string) => {
    setFormData(prev => ({
      ...prev,
      drawingDataUrl: dataUrl
    }));
  };

  const clearDrawing = () => {
    setFormData(prev => ({
      ...prev,
      drawingDataUrl: ''
    }));
  };


  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, overallRating: rating }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setPendingSave(true);
      setShowLoginPrompt(true);
      return;
    }

    await saveTastingRecord();
  };

  const saveTastingRecord = async () => {
    if (!wine || !currentUser) return;

    try {
      await executeSave(async () => {
        let finalWineId = wine.id;

        // If creating new wine, create wine master first
        if (wine.id === 'new' && newWineData) {
          finalWineId = await wineMasterService.createOrFindWineMaster(
            {
              wineName: wine.wineName,
              producer: wine.producer,
              country: wine.country,
              region: wine.region,
              vintage: wine.vintage,
              wineType: wine.wineType,
              grapeVarieties: wine.grapeVarieties,
              alcoholContent: wine.alcoholContent
            },
            currentUser.uid
          );
        }

        // Upload images if any (including drawing)
        const imageUrls: string[] = [];
        try {
          // Upload regular images
          for (const image of formData.images) {
            if (image) {
              // Check file size (max 5MB)
              if (image.size > 5 * 1024 * 1024) {
                console.warn(`Image ${image.name} is too large (${(image.size / 1024 / 1024).toFixed(2)}MB), skipping`);
                continue;
              }
              
              const url = await tastingRecordService.uploadWineImage(image, currentUser.uid);
              imageUrls.push(url);
            }
          }

          // Upload drawing if exists
          if (formData.drawingDataUrl) {
            try {
              // Convert base64 to File object
              const response = await fetch(formData.drawingDataUrl);
              const blob = await response.blob();
              const drawingFile = new File([blob], `sketch-${Date.now()}.png`, { type: 'image/png' });
              
              const drawingUrl = await tastingRecordService.uploadWineImage(drawingFile, currentUser.uid);
              imageUrls.push(drawingUrl);
            } catch (drawingError) {
              console.warn('Failed to upload drawing, proceeding without it:', drawingError);
            }
          }
        } catch (imageError) {
          console.warn('Failed to upload some images, proceeding without them:', imageError);
          // Continue with record creation even if image upload fails
        }

        // Helper function to remove undefined values
        const removeUndefined = <T extends Record<string, unknown>>(obj: T): T => {
          const cleaned = { ...obj };
          Object.keys(cleaned).forEach(key => {
            if (cleaned[key] === undefined) {
              delete cleaned[key];
            } else if (cleaned[key] && typeof cleaned[key] === 'object' && !Array.isArray(cleaned[key])) {
              (cleaned as Record<string, unknown>)[key] = removeUndefined(cleaned[key] as Record<string, unknown>);
            }
          });
          return cleaned;
        };

        // Create tasting record (before cleaning)
        const tastingDataRaw = {
          wineId: finalWineId,
          wineName: wine.wineName,
          producer: wine.producer,
          country: wine.country,
          region: wine.region,
          vintage: wine.vintage,
          grapeVarieties: wine.grapeVarieties,
          wineType: wine.wineType,
          alcoholContent: wine.alcoholContent,
          overallRating: formData.overallRating,
          tastingDate: formData.tastingDate,
          recordMode,
          notes: formData.notes || undefined,
          images: imageUrls.length > 0 ? imageUrls : undefined,
          isPublic: false, // Default to private
          
          // Detailed analysis for detailed mode
          detailedAnalysis: recordMode === 'detailed' ? {
            appearance: {
              color: formData.visualAnalysis.color || '',
              clarity: formData.visualAnalysis.clarity || '',
              viscosity: formData.visualAnalysis.viscosity || '',
              intensity: 3 // Default middle value
            },
            aroma: {
              firstImpression: { 
                intensity: formData.aromaAnalysis.aromaIntensity,
                notes: formData.aromaAnalysis.firstImpression || ''
              },
              afterSwirling: { 
                intensity: formData.aromaAnalysis.aromaIntensity,
                notes: formData.aromaAnalysis.afterSwirling || ''
              },
              categories: {
                fruity: formData.aromaAnalysis.aromaCategories.includes('果実') ? 1 : 0,
                floral: formData.aromaAnalysis.aromaCategories.includes('花') ? 1 : 0,
                spicy: formData.aromaAnalysis.aromaCategories.includes('スパイス') ? 1 : 0,
                herbal: formData.aromaAnalysis.aromaCategories.includes('ハーブ') ? 1 : 0,
                earthy: formData.aromaAnalysis.aromaCategories.includes('土') ? 1 : 0,
                woody: formData.aromaAnalysis.aromaCategories.includes('木') ? 1 : 0,
                other: formData.aromaAnalysis.aromaCategories.filter(c => 
                  !['果実', '花', 'スパイス', 'ハーブ', '土', '木'].includes(c)
                ).length
              },
              specificAromas: formData.aromaAnalysis.aromaCategories
            },
            taste: {
              attack: { 
                intensity: 5,
                notes: formData.tasteAnalysis.attack || ''
              },
              development: { 
                complexity: 5,
                notes: formData.tasteAnalysis.development || ''
              },
              finish: { 
                length: formData.tasteAnalysis.finishLength,
                notes: formData.tasteAnalysis.finish || ''
              }
            },
            structure: {
              acidity: { intensity: formData.componentAnalysis.acidity },
              tannins: { intensity: formData.componentAnalysis.tannins },
              sweetness: formData.componentAnalysis.sweetness,
              body: formData.componentAnalysis.body
            }
          } : undefined,
          
          // Environment and context
          environment: recordMode === 'detailed' ? {
            temperature: formData.environmentalFactors.temperature ? 
              parseFloat(formData.environmentalFactors.temperature) : undefined,
            glassType: formData.environmentalFactors.glassware || undefined,
            decanted: formData.environmentalFactors.decantingTime ? 
              formData.environmentalFactors.decantingTime !== 'なし' : undefined,
            occasion: formData.personalNotes || undefined,
            companions: formData.personalNotes || undefined
          } : undefined,
          
          referenceUrls: formData.referenceUrls.filter(url => url.trim() !== '') || undefined
        };

        // Clean the data by removing undefined values
        const tastingData = removeUndefined(tastingDataRaw);

        await tastingRecordService.createTastingRecord(currentUser.uid, tastingData);

        // Update user stats and add XP
        await userService.updateStatsAfterWineRecord(currentUser.uid, {
          wineName: wine.wineName,
          producer: wine.producer,
          country: wine.country,
          region: wine.region,
          overallRating: formData.overallRating,
          recordMode,
          createdAt: new Date(),
          updatedAt: new Date()
        } as Parameters<typeof userService.updateStatsAfterWineRecord>[1]);
        
        const xpToAdd = recordMode === 'detailed' ? 20 : 10;
        await userService.addXP(currentUser.uid, xpToAdd);
        
        // Update daily goal progress
        await goalService.updateGoalProgress(currentUser.uid, 'wine');
      });

      alert('テイスティング記録が保存されました！');
      navigate('/records');
    } catch (error) {
      console.error('Failed to save tasting record:', error);
    }
  };

  const handleLoginSuccess = async () => {
    setShowLoginPrompt(false);
    if (pendingSave) {
      setPendingSave(false);
      await saveTastingRecord();
    }
  };

  const isFormValid = formData.overallRating > 0;

  if (wineLoading) {
    return (
      <div className="page-container">
        <LoadingSpinner size="large" message="ワイン情報を読み込み中..." />
      </div>
    );
  }

  if (wineError || !wine) {
    return (
      <div className="page-container">
        <ErrorMessage
          title="ワイン情報の読み込みに失敗しました"
          message={wineError || 'ワイン情報が見つかりませんでした'}
          onRetry={loadWineData}
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← 戻る
        </button>
        <h1>テイスティング記録</h1>
        
        <div className="mode-toggle">
          <button 
            className={`mode-button ${recordMode === 'quick' ? 'active' : ''}`}
            onClick={() => setRecordMode('quick')}
          >
            クイック
          </button>
          <button 
            className={`mode-button ${recordMode === 'detailed' ? 'active' : ''}`}
            onClick={() => setRecordMode('detailed')}
          >
            詳細
          </button>
        </div>
      </header>
      
      <main className="add-tasting-content">
        {/* Wine Information Display */}
        <div className="selected-wine-info">
          <h2>選択されたワイン</h2>
          <div className="wine-card">
            <h3>{wine.wineName}</h3>
            <p><strong>生産者:</strong> {wine.producer}</p>
            <p><strong>産地:</strong> {wine.country} - {wine.region}</p>
            {wine.vintage && <p><strong>年:</strong> {wine.vintage}</p>}
            {wine.wineType && <p><strong>タイプ:</strong> {wine.wineType}</p>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="tasting-form">
          {/* Required Fields */}
          <div className="form-section">
            <h3>テイスティング記録 <span className="required">*必須</span></h3>
            
            <div className="form-group">
              <label htmlFor="tastingDate">テイスティング日 *</label>
              <input
                id="tastingDate"
                name="tastingDate"
                type="date"
                value={formData.tastingDate}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>


            {/* Rating Slider */}
            <div className="form-group">
              <label>総合評価 * ({formData.overallRating.toFixed(1)}/10)</label>
              <div className="rating-container">
                <div className="rating-slider-container">
                  <input
                    type="range"
                    className="rating-slider"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.overallRating}
                    onChange={(e) => handleRatingChange(parseFloat(e.target.value))}
                  />
                  <div className="rating-labels">
                    <span>0.0</span>
                    <span>5.0</span>
                    <span>10.0</span>
                  </div>
                </div>
                <div className="rating-display">
                  <span className="rating-value">{formData.overallRating.toFixed(1)}</span>
                  <span className="rating-scale">/10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="form-section">
            <h3>追加情報</h3>
            
            
            <div className="form-group">
              <label htmlFor="notes">テイスティングメモ</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="香り、味わい、印象など自由に記入してください"
                rows={4}
              />
            </div>
            
            <div className="form-group">
              <label>写真登録 (最大4枚)</label>
              <div className="image-suggestion-text">
                <p className="text-muted">
                  おすすめ：お店の雰囲気、ペアリングした料理、一緒に楽しんだ人との記念写真など
                </p>
                <p className="text-muted" style={{fontSize: '0.85rem', fontWeight: '500'}}>
                  ※1枚目の写真はメインサムネイルとして記録一覧で表示されます
                </p>
              </div>
              
              <div className="image-gallery">
                {formData.images.map((image, index) => (
                  <div key={index} className="image-gallery-item">
                    <img 
                      src={URL.createObjectURL(image)}
                      alt={`アップロード画像 ${index + 1}`}
                      className="gallery-image"
                    />
                    <button 
                      type="button"
                      className="remove-image-button"
                      onClick={() => removeImage(index)}
                      aria-label={`画像 ${index + 1} を削除`}
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {formData.images.length < 4 && (
                  <div className={`image-gallery-add pos-${formData.images.length + 1}`}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="image-input"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="image-add-button">
                      <div className="add-icon">+</div>
                      <span>写真を追加</span>
                    </label>
                  </div>
                )}
              </div>
              
              {formData.images.length > 0 && (
                <p className="image-count">
                  {formData.images.length}/4枚の画像を選択中
                </p>
              )}
            </div>

            {/* Drawing Section */}
            <div className="form-group">
              <label>手書きメモ・スケッチ</label>
              <p className="text-muted" style={{fontSize: '0.9rem', marginBottom: '1rem'}}>
                テイスティングの印象をスケッチしたり、手書きでメモを残すことができます
              </p>
              
              {formData.drawingDataUrl ? (
                <div className="drawing-preview">
                  <img 
                    src={formData.drawingDataUrl} 
                    alt="手書きスケッチ" 
                    className="drawing-preview-image"
                  />
                  <div className="drawing-preview-actions">
                    <button
                      type="button"
                      onClick={clearDrawing}
                      className="btn-secondary small"
                    >
                      削除
                    </button>
                  </div>
                </div>
              ) : (
                <DrawingCanvas 
                  onSave={handleDrawingSave}
                  width={400}
                  height={300}
                />
              )}
            </div>
          </div>

          {/* Detailed Mode Fields */}
          {recordMode === 'detailed' && (
            <>
              {/* Visual Analysis */}
              <div className="form-section">
                <h3>外観分析</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="color">色合い</label>
                    <select
                      id="colorSelect"
                      name="colorSelect"
                      value={formData.visualAnalysis.color}
                      onChange={(e) => handleNestedInputChange('visualAnalysis', 'color', e.target.value)}
                      style={{ marginBottom: '0.5rem' }}
                    >
                      <option value="">選択してください</option>
                      {/* 赤ワイン */}
                      {(!wine?.wineType || wine.wineType === 'red') && (
                        <>
                          <option value="鮮やかな紫">鮮やかな紫（若い赤ワイン）</option>
                          <option value="深い紫">深い紫（ミディアムボディ）</option>
                          <option value="鮮やかなルビー">鮮やかなルビー（ピノ・ノワール系）</option>
                          <option value="深いガーネット">深いガーネット（カベルネ系）</option>
                          <option value="茶色がかった赤">茶色がかった赤（熟成）</option>
                          <option value="レンガ色">レンガ色（経年変化）</option>
                          <option value="深いマホガニー">深いマホガニー（長期熟成）</option>
                          <option value="灰色がかった赤">灰色がかった赤（ヴィンテージ）</option>
                        </>
                      )}
                      {/* 白ワイン */}
                      {(!wine?.wineType || wine.wineType === 'white') && (
                        <>
                          <option value="透明に近い無色">透明に近い無色（若い白ワイン）</option>
                          <option value="淡いレモンイエロー">淡いレモンイエロー（ソーヴィニヨンブラン系）</option>
                          <option value="黄金色">黄金色（シャルドネ系）</option>
                          <option value="緑がかった黄色">緑がかった黄色（サンセール系）</option>
                          <option value="黄緑色">黄緑色（リースリング系）</option>
                          <option value="深い黄金色">深い黄金色（樽熟成）</option>
                          <option value="琥珀色">琥珀色（甘口ワイン）</option>
                          <option value="茶色がかった黄色">茶色がかった黄色（長期熟成）</option>
                        </>
                      )}
                      {/* ロゼワイン */}
                      {(!wine?.wineType || wine.wineType === 'rose') && (
                        <>
                          <option value="淡いサーモンピンク">淡いサーモンピンク</option>
                          <option value="玄黒ピンク">玄黒ピンク</option>
                          <option value="鮮やかなローズ色">鮮やかなローズ色</option>
                          <option value="オレンジがかったピンク">オレンジがかったピンク</option>
                        </>
                      )}
                      {/* スパークリング */}
                      {(!wine?.wineType || wine.wineType === 'sparkling') && (
                        <>
                          <option value="淡いゴールド（泡付き）">淡いゴールド（泡付き）</option>
                          <option value="銀白色（泡付き）">銀白色（泡付き）</option>
                          <option value="鮮やかなピンク（泡付き）">鮮やかなピンク（泡付き）</option>
                        </>
                      )}
                    </select>
                    <input
                      id="color"
                      name="color"
                      type="text"
                      value={formData.visualAnalysis.color}
                      onChange={(e) => handleNestedInputChange('visualAnalysis', 'color', e.target.value)}
                      placeholder="または自由記入"
                      style={{ fontSize: '0.9rem' }}
                    />
                    <small className="field-help">選択肢から選ぶか、自由に記入してください</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="clarity">透明度</label>
                    <select
                      id="clarity"
                      name="clarity"
                      value={formData.visualAnalysis.clarity}
                      onChange={(e) => handleNestedInputChange('visualAnalysis', 'clarity', e.target.value)}
                    >
                      <option value="">選択してください</option>
                      <option value="clear">透明</option>
                      <option value="slightly_hazy">わずかに濁り</option>
                      <option value="hazy">濁り</option>
                      <option value="opaque">不透明</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="viscosity">粘性（脚の様子）</label>
                  <select
                    id="viscositySelect"
                    name="viscositySelect"
                    value={formData.visualAnalysis.viscosity}
                    onChange={(e) => handleNestedInputChange('visualAnalysis', 'viscosity', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  >
                    <option value="">選択してください</option>
                    <option value="非常に軽い（水のよう）">非常に軽い（水のよう）</option>
                    <option value="軽い（細い脚が素早く落ちる）">軽い（細い脚が素早く落ちる）</option>
                    <option value="やや軽い（適度な脚）">やや軽い（適度な脚）</option>
                    <option value="中程度（ゆっくりとした脚）">中程度（ゆっくりとした脚）</option>
                    <option value="やや重い（太めの脚がゆっくり）">やや重い（太めの脚がゆっくり）</option>
                    <option value="重い（非常に太い脚）">重い（非常に太い脚）</option>
                    <option value="非常に重い（シロップのよう）">非常に重い（シロップのよう）</option>
                    <option value="油性（グリセリンのよう）">油性（グリセリンのよう）</option>
                  </select>
                  <textarea
                    id="viscosity"
                    name="viscosity"
                    value={formData.visualAnalysis.viscosity}
                    onChange={(e) => handleNestedInputChange('visualAnalysis', 'viscosity', e.target.value)}
                    placeholder="または自由記入（例: ゆっくりと落ちる太い脚）"
                    rows={2}
                    style={{ fontSize: '0.9rem' }}
                  />
                  <small className="field-help">選択肢から選ぶか、自由に記入してください</small>
                </div>
              </div>

              {/* Aroma Analysis */}
              <div className="form-section">
                <h3>香り分析</h3>
                <div className="form-group">
                  <label htmlFor="firstImpression">第一印象</label>
                  <select
                    id="firstImpressionSelect"
                    value={formData.aromaAnalysis.firstImpression}
                    onChange={(e) => handleNestedInputChange('aromaAnalysis', 'firstImpression', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  >
                    <option value="">選択してください</option>
                    <option value="非常に弱い（ほとんど香らない）">非常に弱い（ほとんど香らない）</option>
                    <option value="弱い（かすかに香る）">弱い（かすかに香る）</option>
                    <option value="中程度（適度に香る）">中程度（適度に香る）</option>
                    <option value="強い（はっきりと香る）">強い（はっきりと香る）</option>
                    <option value="非常に強い（非常に香りが高い）">非常に強い（非常に香りが高い）</option>
                    <option value="若々しい果実の香り">若々しい果実の香り</option>
                    <option value="花のような上品な香り">花のような上品な香り</option>
                    <option value="熻製香やバニラの香り">熻製香やバニラの香り</option>
                    <option value="土やミネラルの香り">土やミネラルの香り</option>
                  </select>
                  <textarea
                    id="firstImpression"
                    name="firstImpression"
                    value={formData.aromaAnalysis.firstImpression}
                    onChange={(e) => handleNestedInputChange('aromaAnalysis', 'firstImpression', e.target.value)}
                    placeholder="または自由記入（グラスに注いだ直後の香りの印象）"
                    rows={2}
                    style={{ fontSize: '0.9rem' }}
                  />
                  <small className="field-help">選択肢から選ぶか、自由に記入してください</small>
                </div>
                <div className="form-group">
                  <label htmlFor="afterSwirling">スワリング後</label>
                  <select
                    id="afterSwirlingSelect"
                    value={formData.aromaAnalysis.afterSwirling}
                    onChange={(e) => handleNestedInputChange('aromaAnalysis', 'afterSwirling', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  >
                    <option value="">選択してください</option>
                    <option value="香りが強くなった">香りが強くなった</option>
                    <option value="香りが弱くなった">香りが弱くなった</option>
                    <option value="新しい香りが登場した">新しい香りが登場した</option>
                    <option value="香りの層が展開した">香りの層が展開した</option>
                    <option value="果実の香りが際立つ">果実の香りが際立つ</option>
                    <option value="スパイシーな香りが登場">スパイシーな香りが登場</option>
                    <option value="ミネラルや土の香りが登場">ミネラルや土の香りが登場</option>
                    <option value="樽の香りが際立つ">樽の香りが際立つ</option>
                    <option value="あまり変化なし">あまり変化なし</option>
                  </select>
                  <textarea
                    id="afterSwirling"
                    name="afterSwirling"
                    value={formData.aromaAnalysis.afterSwirling}
                    onChange={(e) => handleNestedInputChange('aromaAnalysis', 'afterSwirling', e.target.value)}
                    placeholder="または自由記入（グラスを回した後の香りの変化）"
                    rows={2}
                    style={{ fontSize: '0.9rem' }}
                  />
                  <small className="field-help">選択肢から選ぶか、自由に記入してください</small>
                </div>
                
                <div className="form-group">
                  <label>香りの強さ ({formData.aromaAnalysis.aromaIntensity}/10)</label>
                  <input
                    type="range"
                    className="component-slider"
                    min="1"
                    max="10"
                    step="1"
                    value={formData.aromaAnalysis.aromaIntensity}
                    onChange={(e) => handleNestedInputChange('aromaAnalysis', 'aromaIntensity', parseInt(e.target.value))}
                  />
                  <div className="slider-labels">
                    <span>弱い</span>
                    <span>強い</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>香りのカテゴリー</label>
                  <div className="aroma-categories">
                    {['果実', '花', 'スパイス', '木', '土', 'ハーブ', 'ミネラル', '動物的', '化学的'].map(category => (
                      <button
                        key={category}
                        type="button"
                        className={`category-button ${formData.aromaAnalysis.aromaCategories.includes(category) ? 'active' : ''}`}
                        onClick={() => handleAromaCategoryToggle(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Taste Analysis */}
              <div className="form-section">
                <h3>味わい分析</h3>
                <div className="form-group">
                  <label htmlFor="attack">アタック（第一印象）</label>
                  <select
                    id="attackSelect"
                    value={formData.tasteAnalysis.attack}
                    onChange={(e) => handleNestedInputChange('tasteAnalysis', 'attack', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  >
                    <option value="">選択してください</option>
                    <option value="弱い（あっさりとした入り）">弱い（あっさりとした入り）</option>
                    <option value="中程度（バランスの良い入り）">中程度（バランスの良い入り）</option>
                    <option value="強い（インパクトのある入り）">強い（インパクトのある入り）</option>
                    <option value="果実味が前面に">果実味が前面に</option>
                    <option value="酸味が際立つ">酸味が際立つ</option>
                    <option value="タンニンが前面に">タンニンが前面に</option>
                    <option value="ミネラルや土の味">ミネラルや土の味</option>
                    <option value="アルコール感が強い">アルコール感が強い</option>
                  </select>
                  <textarea
                    id="attack"
                    name="attack"
                    value={formData.tasteAnalysis.attack}
                    onChange={(e) => handleNestedInputChange('tasteAnalysis', 'attack', e.target.value)}
                    placeholder="または自由記入（口に含んだ瞬間の印象）"
                    rows={2}
                    style={{ fontSize: '0.9rem' }}
                  />
                  <small className="field-help">選択肢から選ぶか、自由に記入してください</small>
                </div>
                <div className="form-group">
                  <label htmlFor="development">展開</label>
                  <select
                    id="developmentSelect"
                    value={formData.tasteAnalysis.development}
                    onChange={(e) => handleNestedInputChange('tasteAnalysis', 'development', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  >
                    <option value="">選択してください</option>
                    <option value="シンプル（変化が少ない）">シンプル（変化が少ない）</option>
                    <option value="複雑（層が展開する）">複雑（層が展開する）</option>
                    <option value="非常に複雑（多層的）">非常に複雑（多層的）</option>
                    <option value="果実味が展開">果実味が展開</option>
                    <option value="スパイシーな味が登場">スパイシーな味が登場</option>
                    <option value="ミネラルや土の味が登場">ミネラルや土の味が登場</option>
                    <option value="樽由来の味が登場">樽由来の味が登場</option>
                    <option value="タンニンが展開">タンニンが展開</option>
                    <option value="酸味が際立つ">酸味が際立つ</option>
                  </select>
                  <textarea
                    id="development"
                    name="development"
                    value={formData.tasteAnalysis.development}
                    onChange={(e) => handleNestedInputChange('tasteAnalysis', 'development', e.target.value)}
                    placeholder="または自由記入（口の中での味わいの変化）"
                    rows={2}
                    style={{ fontSize: '0.9rem' }}
                  />
                  <small className="field-help">選択肢から選ぶか、自由に記入してください</small>
                </div>
                <div className="form-group">
                  <label htmlFor="finish">フィニッシュ</label>
                  <select
                    id="finishSelect"
                    value={formData.tasteAnalysis.finish}
                    onChange={(e) => handleNestedInputChange('tasteAnalysis', 'finish', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  >
                    <option value="">選択してください</option>
                    <option value="クリーン（すっきりとした終わり）">クリーン（すっきりとした終わり）</option>
                    <option value="スムース（穏やかな終わり）">スムース（穏やかな終わり）</option>
                    <option value="エレガント（上品な終わり）">エレガント（上品な終わり）</option>
                    <option value="果実味が残る">果実味が残る</option>
                    <option value="スパイシーな余韻">スパイシーな余韻</option>
                    <option value="ミネラルや土の余韻">ミネラルや土の余韻</option>
                    <option value="樽由来の余韻">樽由来の余韻</option>
                    <option value="タンニンが残る">タンニンが残る</option>
                    <option value="苦味が残る">苦味が残る</option>
                  </select>
                  <textarea
                    id="finish"
                    name="finish"
                    value={formData.tasteAnalysis.finish}
                    onChange={(e) => handleNestedInputChange('tasteAnalysis', 'finish', e.target.value)}
                    placeholder="または自由記入（飲み込んだ後の余韻）"
                    rows={2}
                    style={{ fontSize: '0.9rem' }}
                  />
                  <small className="field-help">選択肢から選ぶか、自由に記入してください</small>
                </div>
                <div className="form-group">
                  <label>余韻の長さ ({formData.tasteAnalysis.finishLength}/10)</label>
                  <input
                    type="range"
                    className="component-slider"
                    min="1"
                    max="10"
                    step="1"
                    value={formData.tasteAnalysis.finishLength}
                    onChange={(e) => handleNestedInputChange('tasteAnalysis', 'finishLength', parseInt(e.target.value))}
                  />
                  <div className="slider-labels">
                    <span>短い</span>
                    <span>長い</span>
                  </div>
                </div>
              </div>

              {/* Component Analysis */}
              <div className="form-section">
                <h3>成分分析</h3>
                <div className="components-grid">
                  <div className="component-item">
                    <label>酸味 ({formData.componentAnalysis.acidity}/10)</label>
                    <input
                      type="range"
                      className="component-slider"
                      min="1"
                      max="10"
                      step="1"
                      value={formData.componentAnalysis.acidity}
                      onChange={(e) => handleNestedInputChange('componentAnalysis', 'acidity', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="component-item">
                    <label>タンニン ({formData.componentAnalysis.tannins}/10)</label>
                    <input
                      type="range"
                      className="component-slider"
                      min="1"
                      max="10"
                      step="1"
                      value={formData.componentAnalysis.tannins}
                      onChange={(e) => handleNestedInputChange('componentAnalysis', 'tannins', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="component-item">
                    <label>甘味 ({formData.componentAnalysis.sweetness}/10)</label>
                    <input
                      type="range"
                      className="component-slider"
                      min="1"
                      max="10"
                      step="1"
                      value={formData.componentAnalysis.sweetness}
                      onChange={(e) => handleNestedInputChange('componentAnalysis', 'sweetness', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="component-item">
                    <label>ボディ ({formData.componentAnalysis.body}/10)</label>
                    <input
                      type="range"
                      className="component-slider"
                      min="1"
                      max="10"
                      step="1"
                      value={formData.componentAnalysis.body}
                      onChange={(e) => handleNestedInputChange('componentAnalysis', 'body', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="component-item">
                    <label>アルコール感 ({formData.componentAnalysis.alcohol}/10)</label>
                    <input
                      type="range"
                      className="component-slider"
                      min="1"
                      max="10"
                      step="1"
                      value={formData.componentAnalysis.alcohol}
                      onChange={(e) => handleNestedInputChange('componentAnalysis', 'alcohol', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Environmental Factors */}
              <div className="form-section">
                <h3>環境・条件</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="temperature">サービス温度</label>
                    <input
                      id="temperature"
                      name="temperature"
                      type="text"
                      value={formData.environmentalFactors.temperature}
                      onChange={(e) => handleNestedInputChange('environmentalFactors', 'temperature', e.target.value)}
                      placeholder="例: 16-18℃"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="glassware">グラス</label>
                    <input
                      id="glassware"
                      name="glassware"
                      type="text"
                      value={formData.environmentalFactors.glassware}
                      onChange={(e) => handleNestedInputChange('environmentalFactors', 'glassware', e.target.value)}
                      placeholder="例: ボルドーグラス"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="decantingTime">デカンタージュ時間</label>
                  <input
                    id="decantingTime"
                    name="decantingTime"
                    type="text"
                    value={formData.environmentalFactors.decantingTime}
                    onChange={(e) => handleNestedInputChange('environmentalFactors', 'decantingTime', e.target.value)}
                    placeholder="例: 1時間、なし"
                  />
                </div>
              </div>

              {/* Food Pairings and Additional Notes */}
              <div className="form-section">
                <h3>フードペアリング・追加メモ</h3>
                <div className="form-group">
                  <label htmlFor="foodPairings">料理との相性</label>
                  <textarea
                    id="foodPairings"
                    name="foodPairings"
                    value={formData.foodPairings}
                    onChange={handleInputChange}
                    placeholder="一緒に楽しんだ料理や、合いそうな料理"
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="personalNotes">個人的なメモ</label>
                  <textarea
                    id="personalNotes"
                    name="personalNotes"
                    value={formData.personalNotes}
                    onChange={handleInputChange}
                    placeholder="シチュエーション、同席者、特別な思い出など"
                    rows={3}
                  />
                </div>
              </div>

              {/* Reference URLs */}
              <div className="form-section">
                <h3>参考リンク</h3>
                {formData.referenceUrls.map((url, index) => (
                  <div key={index} className="reference-url-item">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateReferenceUrl(index, e.target.value)}
                      placeholder="https://example.com"
                    />
                    <button
                      type="button"
                      className="remove-url-button"
                      onClick={() => removeReferenceUrl(index)}
                    >
                      削除
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="add-url-button"
                  onClick={addReferenceUrl}
                >
                  + 参考リンクを追加
                </button>
              </div>
            </>
          )}

          {/* Save Buttons */}
          <div className="form-action">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate(-1)}
            >
              キャンセル
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={!isFormValid || saveLoading}
            >
              {saveLoading ? (
                <LoadingSpinner size="small" message="保存中..." />
              ) : (
                '記録を保存'
              )}
            </button>
          </div>

          {saveError && (
            <ErrorMessage
              title="保存エラー"
              message={saveError}
              onRetry={saveTastingRecord}
              showIcon={false}
            />
          )}
        </form>
      </main>
      
      <LoginPrompt
        isOpen={showLoginPrompt}
        onClose={() => {
          setShowLoginPrompt(false);
          setPendingSave(false);
        }}
        onLoginSuccess={handleLoginSuccess}
        title="記録を保存するにはログインが必要です"
        message="Googleアカウントでログインして、テイスティング記録を保存しましょう。"
      />
    </div>
  );
};

export default AddTastingRecord;
```

---

## Records.tsx

**パス**: `my-wine-memory/src/pages/Records.tsx`

```tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthHooks';
import { tastingRecordService } from '../services/tastingRecordService';
import { wineMasterService } from '../services/wineMasterService';
import type { WineMaster, TastingRecord } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAsyncOperation } from '../hooks/useAsyncOperation';
// import { useOfflineSync } from '../hooks/useOfflineSync';
// import { useNetworkStatus } from '../hooks/useNetworkStatus';

interface WineWithTastings {
  wine: WineMaster;
  tastingRecords: TastingRecord[];
  latestTasting: Date;
  averageRating: number;
}

const Records: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [wineGroups, setWineGroups] = useState<WineWithTastings[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'count'>('date');
  const [filteredWineGroups, setFilteredWineGroups] = useState<WineWithTastings[]>([]);
  // const [isUsingOfflineData, setIsUsingOfflineData] = useState(false);

  const { loading, error, execute: executeLoadRecords } = useAsyncOperation<WineWithTastings[]>();
  // const { isOnline } = useNetworkStatus();
  // const { getCachedTastingRecords, getCachedWines, cacheTastingRecords, cacheWines } = useOfflineSync(currentUser?.uid);

  const loadRecords = useCallback(async () => {
    if (!currentUser) return;

    try {
      const records = await executeLoadRecords(async () => {
        // Get all user's tasting records
        const tastingRecords = await tastingRecordService.getUserTastingRecords(currentUser.uid, 'date', 1000);
        
        // Group by wine ID
        const wineGroups = new Map<string, TastingRecord[]>();
        tastingRecords.forEach(record => {
          if (!wineGroups.has(record.wineId)) {
            wineGroups.set(record.wineId, []);
          }
          wineGroups.get(record.wineId)!.push(record);
        });

        // Batch fetch wine master data for each group to avoid N+1
        const wineIds = Array.from(wineGroups.keys());
        const wines = await wineMasterService.getWineMastersByIds(wineIds);
        const wineMap = new Map<string, WineMaster>();
        wines.forEach((w) => wineMap.set(w.id, w));

        const wineWithTastings: WineWithTastings[] = [];
        for (const [wineId, records] of wineGroups.entries()) {
          const wine = wineMap.get(wineId);
          if (!wine) continue;
          const latestTasting = new Date(Math.max(...records.map(r => new Date(r.tastingDate).getTime())));
          const averageRating = records.reduce((sum, r) => sum + r.overallRating, 0) / records.length;
          wineWithTastings.push({
            wine,
            tastingRecords: records.sort((a, b) => new Date(b.tastingDate).getTime() - new Date(a.tastingDate).getTime()),
            latestTasting,
            averageRating
          });
        }

        return wineWithTastings;
      });

      setWineGroups(records || []);
    } catch (error) {
      console.error('Failed to load records:', error);
    }
  }, [currentUser, executeLoadRecords]);

  const filterAndSortRecords = useCallback(() => {
    let filtered = wineGroups;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(wineGroup => 
        wineGroup.wine.wineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wineGroup.wine.producer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wineGroup.wine.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => b.latestTasting.getTime() - a.latestTasting.getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'count':
        filtered.sort((a, b) => b.tastingRecords.length - a.tastingRecords.length);
        break;
    }

    setFilteredWineGroups(filtered);
  }, [wineGroups, searchTerm, sortBy]);

  useEffect(() => {
    if (currentUser) {
      loadRecords();
    }
  }, [currentUser, loadRecords]);

  useEffect(() => {
    filterAndSortRecords();
  }, [filterAndSortRecords]);

  const handleWineClick = (wineId: string) => {
    navigate(`/wine-detail/${wineId}`);
  };

  const handleAddTasting = (wineId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/add-tasting-record/${wineId}`);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRatingColor = (rating: number) => {
    const successColor = getComputedStyle(document.documentElement).getPropertyValue('--success-text') || '#28a745';
    const warningColor = getComputedStyle(document.documentElement).getPropertyValue('--warning-text') || '#ffc107';
    const mutedColor = getComputedStyle(document.documentElement).getPropertyValue('--text-muted') || '#6c757d';
    
    if (rating >= 8) return successColor;
    if (rating >= 6) return warningColor;
    return mutedColor;
  };

  if (!currentUser) {
    return (
      <div className="page-container">
        <header className="page-header">
          <h1>記録一覧</h1>
        </header>
        <main className="records-content">
          <div className="empty-state welcome-message">
            <div className="welcome-icon">🍷</div>
            <h2>まだワインを記録していませんね</h2>
            <p>初めの一本を記録しましょう！</p>
            <p className="sub-message">ワインの記録を始めて、あなたの味覚の旅を保存しましょう。</p>
            <button 
              className="get-started-button primary"
              onClick={() => navigate('/select-wine')}
            >
              🍷 ワインを記録する
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>記録一覧</h1>
        <button 
          className="add-record-button"
          onClick={() => navigate('/select-wine')}
        >
          ➕ 新しい記録
        </button>
      </header>

      <main className="records-content">
        {/* Search and Sort Controls */}
        <div className="controls-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="ワイン名、生産者、産地で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="sort-options">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'rating' | 'count')}
              className="sort-select"
            >
              <option value="date">最新記録順</option>
              <option value="rating">評価順</option>
              <option value="count">記録数順</option>
            </select>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && <LoadingSpinner message="記録を読み込み中..." />}
        
        {error && (
          <ErrorMessage
            title="記録の読み込みに失敗しました"
            message={error}
            onRetry={loadRecords}
          />
        )}
        {/* Records List */}
        {!loading && !error && filteredWineGroups.length === 0 && !searchTerm && (
          <div className="empty-state">
            <h2>まだ記録がありません</h2>
            <p>最初のワインを記録してみましょう！</p>
            <button 
              className="get-started-button"
              onClick={() => navigate('/select-wine')}
            >
              🍷 ワインを記録する
            </button>
          </div>
        )}

        {!loading && !error && filteredWineGroups.length === 0 && searchTerm && (
          <div className="no-results">
            <p>「{searchTerm}」に一致する記録が見つかりませんでした</p>
          </div>
        )}

        {!loading && !error && filteredWineGroups.length > 0 && (
          <div className="wine-groups-list">
            {filteredWineGroups.map((group) => (
              <div 
                key={group.wine.id} 
                className="wine-group-card"
                onClick={() => handleWineClick(group.wine.id)}
              >
                <div className="wine-group-header">
                  <div className="wine-info">
                    <h3 className="wine-name">{group.wine.wineName}</h3>
                    <p className="wine-producer">{group.wine.producer}</p>
                    <p className="wine-location">{group.wine.country} - {group.wine.region}</p>
                    {group.wine.vintage && (
                      <p className="wine-vintage">{group.wine.vintage}年</p>
                    )}
                    {group.tastingRecords[0]?.price && group.tastingRecords[0].price > 0 && (
                      <p className="wine-price">価格: ¥{group.tastingRecords[0].price.toLocaleString()}</p>
                    )}
                    {group.tastingRecords[0]?.purchaseLocation && (
                      <p className="wine-purchase-location">購入場所: {group.tastingRecords[0].purchaseLocation}</p>
                    )}
                  </div>
                  <div className="wine-stats">
                    <div className="rating-info">
                      <span 
                        className="average-rating"
                        style={{ color: getRatingColor(group.averageRating) }}
                      >
                        {group.averageRating.toFixed(1)}/10
                      </span>
                      <span className="rating-label">平均評価</span>
                    </div>
                  </div>
                </div>

                <div className="tasting-summary">
                  <div className="tasting-count">
                    <span className="count">{group.tastingRecords.length}</span>
                    <span className="label">回記録</span>
                  </div>
                  <div className="latest-tasting">
                    <span className="date">最新: {formatDate(group.latestTasting)}</span>
                  </div>
                  <button 
                    className="add-tasting-btn"
                    onClick={(e) => handleAddTasting(group.wine.id, e)}
                    title="新しいテイスティングを追加"
                  >
                    ➕
                  </button>
                </div>

                {/* Recent Tastings Preview */}
                <div className="recent-tastings">
                  <h4>最近のテイスティング</h4>
                  <div className="tastings-preview">
                    {group.tastingRecords.slice(0, 3).map((record) => (
                      <div key={record.id} className="tasting-preview-item">
                        <div className="tasting-date">
                          {formatDate(new Date(record.tastingDate))}
                        </div>
                        <div 
                          className="tasting-rating"
                          style={{ color: getRatingColor(record.overallRating) }}
                        >
                          {record.overallRating.toFixed(1)}
                        </div>
                        <div className="tasting-mode">
                          {record.recordMode === 'quick' ? 'クイック' : '詳細'}
                        </div>
                      </div>
                    ))}
                    {group.tastingRecords.length > 3 && (
                      <div className="more-tastings">
                        +{group.tastingRecords.length - 3}件
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Records;
```

---

## WineDetail.tsx

**パス**: `my-wine-memory/src/pages/WineDetail.tsx`

```tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthHooks';
import { wineMasterService } from '../services/wineMasterService';
import { tastingRecordService } from '../services/tastingRecordService';
import type { WineMaster, TastingRecord } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import TastingAnalysisCharts from '../components/TastingAnalysisCharts';
import { useAsyncOperation } from '../hooks/useAsyncOperation';

const WineDetail: React.FC = () => {
  const navigate = useNavigate();
  const { wineId } = useParams<{ wineId: string }>();
  const { currentUser } = useAuth();
  
  const [wine, setWine] = useState<WineMaster | null>(null);
  const [tastingRecords, setTastingRecords] = useState<TastingRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<TastingRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'analysis'>('overview');
  
  const { loading: wineLoading, error: wineError, execute: executeLoadWine } = useAsyncOperation<WineMaster | null>();
  const { loading: recordsLoading, error: recordsError, execute: executeLoadRecords } = useAsyncOperation<TastingRecord[]>();

  const loadWineData = useCallback(async () => {
    if (!wineId) return;
    
    try {
      const wineData = await executeLoadWine(() => wineMasterService.getWineMaster(wineId));
      setWine(wineData);
    } catch (error) {
      console.error('Failed to load wine data:', error);
    }
  }, [wineId, executeLoadWine]);

  const loadTastingRecords = useCallback(async () => {
    if (!wineId || !currentUser) return;
    
    try {
      const records = await executeLoadRecords(() => 
        tastingRecordService.getUserTastingRecords(currentUser.uid, 'date', 100)
      );
      setTastingRecords(records);
    } catch (error) {
      console.error('Failed to load tasting records:', error);
    }
  }, [wineId, currentUser, executeLoadRecords]);

  useEffect(() => {
    if (wineId) {
      loadWineData();
      if (currentUser) {
        loadTastingRecords();
      }
    }
  }, [wineId, currentUser, loadWineData, loadTastingRecords]);

  const handleAddTasting = () => {
    if (wineId) {
      navigate(`/add-tasting-record/${wineId}`);
    }
  };

  const handleEditRecord = (recordId: string) => {
    navigate(`/edit-tasting-record/${recordId}`);
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!window.confirm('この記録を削除してもよろしいですか？')) return;
    
    try {
      await tastingRecordService.deleteTastingRecord(recordId);
      await loadTastingRecords(); // Refresh the list
      alert('記録を削除しました');
    } catch (error) {
      console.error('Failed to delete record:', error);
      alert('削除に失敗しました');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingColor = (rating: number) => {
    const successColor = getComputedStyle(document.documentElement).getPropertyValue('--success-text') || '#28a745';
    const warningColor = getComputedStyle(document.documentElement).getPropertyValue('--warning-text') || '#ffc107';
    const mutedColor = getComputedStyle(document.documentElement).getPropertyValue('--text-muted') || '#6c757d';
    
    if (rating >= 8) return successColor;
    if (rating >= 6) return warningColor;
    return mutedColor;
  };

  const calculateAverageRating = () => {
    if (tastingRecords.length === 0) return 0;
    return tastingRecords.reduce((sum, record) => sum + record.overallRating, 0) / tastingRecords.length;
  };

  const getDetailedRecords = () => {
    return tastingRecords.filter(record => record.detailedAnalysis);
  };

  const hasDetailedAnalysis = () => {
    return getDetailedRecords().length > 0;
  };

  if (wineLoading) {
    return (
      <div className="page-container">
        <LoadingSpinner size="large" message="ワイン情報を読み込み中..." />
      </div>
    );
  }

  if (wineError || !wine) {
    return (
      <div className="page-container">
        <ErrorMessage
          title="ワイン情報の読み込みに失敗しました"
          message={wineError || 'ワイン情報が見つかりませんでした'}
          onRetry={loadWineData}
        />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="page-container">
        <div className="login-message">
          <h2>ログインが必要です</h2>
          <p>記録を確認するには、Googleアカウントでログインしてください。</p>
          <button 
            className="google-signin-button"
            onClick={() => navigate('/')}
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  const averageRating = calculateAverageRating();

  return (
    <div className="page-container">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← 戻る
        </button>
        <h1>ワイン詳細</h1>
        <button 
          className="add-tasting-button"
          onClick={handleAddTasting}
        >
          ➕ 新しい記録
        </button>
      </header>

      <main className="wine-detail-content">
        {/* Wine Information */}
        <div className="wine-info-section">
          <div className="wine-header">
            <h2>{wine.wineName}</h2>
            <p className="wine-producer">{wine.producer}</p>
            <p className="wine-location">{wine.country} - {wine.region}</p>
            {wine.vintage && <p className="wine-vintage">{wine.vintage}年</p>}
            {wine.wineType && (
              <span className="wine-type-badge">
                {wine.wineType === 'red' ? '赤ワイン' :
                 wine.wineType === 'white' ? '白ワイン' :
                 wine.wineType === 'rose' ? 'ロゼワイン' :
                 wine.wineType === 'sparkling' ? 'スパークリングワイン' :
                 wine.wineType === 'dessert' ? 'デザートワイン' :
                 wine.wineType === 'fortified' ? '酒精強化ワイン' :
                 wine.wineType}
              </span>
            )}
          </div>

          {/* Wine Details */}
          <div className="wine-details">
            {wine.grapeVarieties && wine.grapeVarieties.length > 0 && (
              <div className="detail-item">
                <strong>ブドウ品種:</strong> {wine.grapeVarieties.join(', ')}
              </div>
            )}
            {wine.alcoholContent && (
              <div className="detail-item">
                <strong>アルコール度数:</strong> {wine.alcoholContent}%
              </div>
            )}
            {wine.winemaker && (
              <div className="detail-item">
                <strong>ワインメーカー:</strong> {wine.winemaker}
              </div>
            )}
            <div className="detail-item">
              <strong>参照数:</strong> {wine.referenceCount}人が記録
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            概要
          </button>
          <button 
            className={`tab-button ${activeTab === 'records' ? 'active' : ''}`}
            onClick={() => setActiveTab('records')}
          >
            記録一覧 ({tastingRecords.length})
          </button>
          {hasDetailedAnalysis() && (
            <button 
              className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
              onClick={() => setActiveTab('analysis')}
            >
              詳細分析 ({getDetailedRecords().length})
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            {/* Tasting Statistics */}
            {tastingRecords.length > 0 && (
              <div className="tasting-stats-section">
                <h3>あなたのテイスティング統計</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">{tastingRecords.length}</div>
                    <div className="stat-label">記録数</div>
                  </div>
                  <div className="stat-card">
                    <div 
                      className="stat-value"
                      style={{ color: getRatingColor(averageRating) }}
                    >
                      {averageRating.toFixed(1)}
                    </div>
                    <div className="stat-label">平均評価</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {Math.max(...tastingRecords.map(r => r.overallRating)).toFixed(1)}
                    </div>
                    <div className="stat-label">最高評価</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {formatDate(new Date(Math.max(...tastingRecords.map(r => new Date(r.tastingDate).getTime()))))}
                    </div>
                    <div className="stat-label">最新記録</div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Records Summary */}
            {tastingRecords.length > 0 && (
              <div className="recent-records-section">
                <h3>最新の記録</h3>
                <div className="recent-records-list">
                  {tastingRecords.slice(0, 3).map((record) => (
                    <div key={record.id} className="recent-record-item">
                      <div className="recent-record-date">
                        {formatDate(new Date(record.tastingDate))}
                      </div>
                      <div 
                        className="recent-record-rating"
                        style={{ color: getRatingColor(record.overallRating) }}
                      >
                        {record.overallRating.toFixed(1)}/10
                      </div>
                      <div className="recent-record-mode">
                        {record.recordMode === 'quick' ? 'クイック' : '詳細'}
                      </div>
                    </div>
                  ))}
                </div>
                {tastingRecords.length > 3 && (
                  <button 
                    className="view-all-records-button"
                    onClick={() => setActiveTab('records')}
                  >
                    全ての記録を見る ({tastingRecords.length}件)
                  </button>
                )}
              </div>
            )}

            {tastingRecords.length === 0 && (
              <div className="no-records">
                <p>まだこのワインの記録がありません</p>
                <button 
                  className="add-first-record-button"
                  onClick={handleAddTasting}
                >
                  🍷 最初の記録を追加
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'records' && (
          <div className="tab-content">
            <div className="tasting-records-section">
              <h3>テイスティング記録一覧</h3>
              
              {recordsLoading && <LoadingSpinner message="記録を読み込み中..." />}
              
              {recordsError && (
                <ErrorMessage
                  title="記録の読み込みに失敗しました"
                  message={recordsError}
                  onRetry={loadTastingRecords}
                />
              )}

              {!recordsLoading && !recordsError && tastingRecords.length > 0 && (
                <div className="records-list">
                  {tastingRecords.map((record) => (
                    <div 
                      key={record.id} 
                      className="tasting-record-card"
                      onClick={() => setSelectedRecord(selectedRecord?.id === record.id ? null : record)}
                    >
                      <div className="record-header">
                        <div className="record-date">
                          {formatDate(new Date(record.tastingDate))}
                        </div>
                        <div 
                          className="record-rating"
                          style={{ color: getRatingColor(record.overallRating) }}
                        >
                          {record.overallRating.toFixed(1)}/10
                        </div>
                        <div className="record-mode-badge">
                          {record.recordMode === 'quick' ? 'クイック' : '詳細'}
                        </div>
                      </div>

                      {selectedRecord?.id === record.id && (
                        <div className="record-details">
                          {record.notes && (
                            <div className="detail-section">
                              <h4>テイスティングメモ</h4>
                              <p>{record.notes}</p>
                            </div>
                          )}
                          
                          {record.price && (
                            <div className="detail-section">
                              <h4>購入価格</h4>
                              <p>¥{record.price.toLocaleString()}</p>
                            </div>
                          )}
                          
                          {record.purchaseLocation && (
                            <div className="detail-section">
                              <h4>購入場所</h4>
                              <p>{record.purchaseLocation}</p>
                            </div>
                          )}

                          {record.images && record.images.length > 0 && (
                            <div className="detail-section">
                              <h4>写真</h4>
                              <div className="record-images">
                                {record.images.map((imageUrl, index) => (
                                  <img 
                                    key={index}
                                    src={imageUrl} 
                                    alt={`テイスティング写真 ${index + 1}`}
                                    className="record-image"
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="record-actions">
                            <button 
                              className="edit-record-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditRecord(record.id);
                              }}
                            >
                              ✏️ 編集
                            </button>
                            <button 
                              className="delete-record-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRecord(record.id);
                              }}
                            >
                              🗑️ 削除
                            </button>
                            {record.detailedAnalysis && (
                              <button 
                                className="view-analysis-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRecord(record);
                                  setActiveTab('analysis');
                                }}
                              >
                                📊 詳細分析を見る
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="tab-content">
            <div className="analysis-section">
              <h3>詳細分析</h3>
              
              {getDetailedRecords().length === 0 ? (
                <div className="no-detailed-analysis">
                  <p>詳細モードで記録されたテイスティングデータがありません</p>
                  <p>詳細モードで新しい記録を追加すると、グラフによる分析が表示されます。</p>
                  <button 
                    className="add-detailed-record-button"
                    onClick={handleAddTasting}
                  >
                    詳細記録を追加
                  </button>
                </div>
              ) : (
                <div className="detailed-analysis-container">
                  {/* Record Selector for Analysis */}
                  {getDetailedRecords().length > 1 && (
                    <div className="analysis-record-selector">
                      <label htmlFor="analysis-record-select">分析する記録を選択:</label>
                      <select 
                        id="analysis-record-select"
                        value={selectedRecord?.id || getDetailedRecords()[0].id}
                        onChange={(e) => {
                          const record = getDetailedRecords().find(r => r.id === e.target.value);
                          setSelectedRecord(record || null);
                        }}
                      >
                        {getDetailedRecords().map((record) => (
                          <option key={record.id} value={record.id}>
                            {formatDate(new Date(record.tastingDate))} - 評価: {record.overallRating.toFixed(1)}/10
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Analysis Charts */}
                  <TastingAnalysisCharts 
                    record={selectedRecord || getDetailedRecords()[0]} 
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WineDetail;
```

---

## Quiz.tsx

**パス**: `my-wine-memory/src/pages/Quiz.tsx`

```tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthHooks';
import { initializeQuizQuestions } from '../data/quiz';
import { quizProgressService, type QuizProgress, type UserQuizStats } from '../services/quizProgressService';
import LoadingSpinner from '../components/LoadingSpinner';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [, setUserProgress] = useState<QuizProgress[]>([]);
  const [userStats, setUserStats] = useState<UserQuizStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hearts, setHearts] = useState(5);
  const [quizInitialized, setQuizInitialized] = useState(false);

  const startGeneralQuiz = () => {
    // Start with difficulty 1 for general quiz
    navigate('/quiz/play/1');
  };

  const startPersonalRecordQuiz = () => {
    // For now, show an alert about upcoming feature
    alert('あなたの記録に基づくクイズ機能は準備中です。\n一般クイズをお楽しみください！');
  };

  const startReviewQuiz = async () => {
    if (!currentUser) {
      alert('ログインが必要です');
      return;
    }
    
    try {
      const wrongAnswers = await quizProgressService.getWrongAnswersForReview(currentUser.uid);
      if (wrongAnswers.length === 0) {
        alert('復習する問題がありません。\nまずは一般クイズに挑戦してみましょう！');
        return;
      }
      
      // Navigate to review quiz (we'll implement this later)
      alert(`${wrongAnswers.length}問の復習問題があります。\n復習クイズ機能は準備中です。`);
    } catch (error) {
      console.error('Failed to load review questions:', error);
      alert('復習問題の読み込みに失敗しました。');
    }
  };
  
  useEffect(() => {
    const loadUserData = async () => {
      // Initialize quiz questions
      if (!quizInitialized) {
        await initializeQuizQuestions();
        setQuizInitialized(true);
      }
      
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        const [progress, stats] = await Promise.all([
          quizProgressService.getAllUserProgress(currentUser.uid),
          quizProgressService.getUserQuizStats(currentUser.uid)
        ]);
        
        setUserProgress(progress);
        setUserStats(stats);
        
        // Recover hearts if needed
        if (stats) {
          const recoveredHearts = await quizProgressService.recoverHearts(currentUser.uid);
          setHearts(recoveredHearts);
        }
      } catch (error) {
        console.error('Failed to load user quiz data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [currentUser, quizInitialized]);
  
  const getHeartDisplay = () => {
    return '❤️'.repeat(hearts) + '🤍'.repeat(5 - hearts);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>ワインクイズ</h1>
        <div className="quiz-stats">
          <span>{getHeartDisplay()}</span>
          <span>レベル {userStats?.level || 1}</span>
          {userStats && (
            <span>正答率: {userStats.overallAccuracy.toFixed(1)}%</span>
          )}
        </div>
      </header>
      
      <main className="quiz-content">
        {loading ? (
          <LoadingSpinner message="クイズデータを読み込み中..." />
        ) : (
        <>
        <div className="quiz-actions">
          <button 
            onClick={() => navigate('/quiz/levels')}
            className="quiz-action-button"
          >
            <span className="action-icon">🎯</span>
            <div className="action-text">
              <div className="action-title">レベル選択</div>
              <div className="action-subtitle">学習進度を確認して挑戦するレベルを選択</div>
            </div>
            <span className="action-arrow">→</span>
          </button>
        </div>
        
        <div className="quiz-modes">
          <h2>クイズモード</h2>
          <button className="mode-button" onClick={startGeneralQuiz}>
            📚 一般クイズ
          </button>
          <button className="mode-button" onClick={startPersonalRecordQuiz}>
            🍷 あなたの記録クイズ
          </button>
          <button className="mode-button" onClick={startReviewQuiz}>
            🔄 復習クイズ
          </button>
        </div>
        </>
        )}
      </main>
    </div>
  );
};

export default Quiz;
```

---

## QuizGame.tsx

**パス**: `my-wine-memory/src/pages/QuizGame.tsx`

```tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthHooks';
import type { QuizQuestion } from '../types';
import { advancedQuizService } from '../services/advancedQuizService';
import { quizProgressService } from '../services/quizProgressService';

const QuizGame: React.FC = () => {
  const navigate = useNavigate();
  const { difficulty } = useParams<{ difficulty: string }>();
  const { currentUser } = useAuth();
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStatus, setGameStatus] = useState<'playing' | 'finished' | 'timeup'>('playing');
  const [hearts, setHearts] = useState(5);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/profile');
      return;
    }

    const initializeQuiz = async () => {
      try {
        // Get user's current hearts
        const userStats = await quizProgressService.getUserQuizStats(currentUser.uid);
        if (userStats) {
          const recoveredHearts = await quizProgressService.recoverHearts(currentUser.uid);
          setHearts(recoveredHearts);
          
          if (recoveredHearts <= 0) {
            alert('ハートがありません。\n時間を置いてから再度挑戦してください。');
            navigate('/quiz');
            return;
          }
        }
        
        // Initialize quiz with weighted selection
        const difficultyNum = parseInt(difficulty || '1');
        const quizQuestions = await advancedQuizService.selectQuestionsForLevel(
          currentUser.uid,
          difficultyNum,
          10
        );
        setQuestions(quizQuestions);
      } catch (error) {
        console.error('Failed to initialize quiz:', error);
        // Fallback: use empty array
        console.warn('Failed to load questions, using empty array');
        setQuestions([]);
      }
    };
    
    initializeQuiz();
  }, [currentUser, difficulty, navigate]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex + 1 >= questions.length) {
      setGameStatus('finished');
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsCorrect(null);
      setTimeLeft(30);
      if (gameStatus === 'timeup') {
        setGameStatus('playing');
      }
    }
  }, [currentQuestionIndex, questions.length, gameStatus]);

  const handleTimeUp = useCallback(async () => {
    setGameStatus('timeup');
    
    // Record time up as wrong answer
    const currentQuestion = questions[currentQuestionIndex];
    if (currentUser && currentQuestion) {
      try {
        await Promise.all([
          advancedQuizService.updateQuestionStatus(
            currentUser.uid,
            parseInt(difficulty || '1'),
            currentQuestion.id,
            false
          ),
          quizProgressService.useHeart(currentUser.uid)
        ]);
      } catch (error) {
        console.error('Failed to record timeout:', error);
      }
    }
    
    setHearts(hearts - 1);
    setAnsweredQuestions([...answeredQuestions, currentQuestion?.id || '']);
    
    if (hearts <= 1) {
      setGameStatus('finished');
    } else {
      // Move to next question after 2 seconds
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    }
  }, [hearts, nextQuestion, currentQuestionIndex, questions, currentUser, answeredQuestions]);

  useEffect(() => {
    if (gameStatus === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStatus === 'playing') {
      handleTimeUp();
    }
  }, [timeLeft, gameStatus, handleTimeUp]);

  const handleAnswerSelect = async (answerIndex: number) => {
    if (selectedAnswer !== null || showExplanation) return;
    
    setSelectedAnswer(answerIndex);
    const currentQuestion = questions[currentQuestionIndex];
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    // Track answered questions
    const newAnsweredQuestions = [...answeredQuestions, currentQuestion.id];
    setAnsweredQuestions(newAnsweredQuestions);
    
    if (correct) {
      setScore(score + 1);
      setCorrectAnswers([...correctAnswers, currentQuestion.id]);
    } else {
      // Use heart
      if (currentUser) {
        try {
          await quizProgressService.useHeart(currentUser.uid);
        } catch (error) {
          console.error('Failed to use heart:', error);
        }
      }
      setHearts(hearts - 1);
    }

    // Update question status in advanced quiz service
    if (currentUser) {
      await advancedQuizService.updateQuestionStatus(
        currentUser.uid,
        parseInt(difficulty || '1'),
        currentQuestion.id,
        correct
      );
    }
    
    setShowExplanation(true);

    // Check if game should end due to no hearts remaining
    if (hearts <= 1 && !correct) {
      setTimeout(() => setGameStatus('finished'), 1000);
    }
  };

  const restartQuiz = async () => {
    if (!currentUser) return;
    const difficultyNum = parseInt(difficulty || '1');
    const newQuestions = await advancedQuizService.selectQuestionsForLevel(
      currentUser.uid,
      difficultyNum,
      10
    );
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(30);
    setHearts(5);
    setGameStatus('playing');
    setShowExplanation(false);
    setIsCorrect(null);
    setAnsweredQuestions([]);
    setCorrectAnswers([]);
  };
  
  // Save progress when game ends
  useEffect(() => {
    if (gameStatus === 'finished' && currentUser && answeredQuestions.length > 0) {
      const saveProgress = async () => {
        try {
          const difficultyNum = parseInt(difficulty || '1');
          const isStreak = score === questions.length; // Perfect score
          
          await Promise.all([
            quizProgressService.updateProgress(
              currentUser.uid,
              difficultyNum,
              answeredQuestions,
              score,
              questions.length
            ),
            quizProgressService.updateUserQuizStats(
              currentUser.uid,
              score,
              questions.length,
              isStreak
            )
          ]);
          
          console.log('Progress saved successfully');
        } catch (error) {
          console.error('Failed to save quiz progress:', error);
        }
      };
      
      saveProgress();
    }
  }, [gameStatus, currentUser, answeredQuestions, score, questions.length, difficulty]);

  const goBack = () => {
    navigate('/quiz');
  };

  if (questions.length === 0) {
    return (
      <div className="page-container">
        <div className="loading-quiz">
          <p>クイズを準備中...</p>
        </div>
      </div>
    );
  }

  if (gameStatus === 'finished') {
    const percentage = (score / questions.length) * 100;
    const difficultyNum = parseInt(difficulty || '1');
    
    return (
      <div className="page-container">
        <div className="quiz-result">
          <h1>クイズ終了！</h1>
          <div className="result-stats">
            <div className="difficulty-info">
              <span className="difficulty-badge">難易度 {difficultyNum}</span>
            </div>
            <div className="score">
              <span className="score-number">{score}</span>
              <span className="score-total">/ {questions.length}</span>
            </div>
            <div className="percentage">{percentage.toFixed(0)}%正解</div>
          </div>
          
          <div className="result-message">
            {percentage >= 80 && <p>🎉 素晴らしい！ワイン博士ですね！</p>}
            {percentage >= 60 && percentage < 80 && <p>👍 よくできました！もう少しで完璧です！</p>}
            {percentage >= 40 && percentage < 60 && <p>📚 まずまずです。もう少し勉強してみましょう！</p>}
            {percentage < 40 && <p>💪 まだまだこれから！頑張って学習を続けましょう！</p>}
          </div>

          <div className="result-actions">
            <button className="btn-primary" onClick={restartQuiz}>
              もう一度挑戦
            </button>
            <button className="btn-secondary" onClick={goBack}>
              クイズメニューに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="page-container">
      <header className="quiz-header">
        <button className="back-button" onClick={goBack}>
          ← 戻る
        </button>
        <div className="quiz-progress">
          <div className="hearts">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`heart ${i < hearts ? 'active' : ''}`}>
                ❤️
              </span>
            ))}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <div className="timer">{timeLeft}秒</div>
        </div>
      </header>

      <main className="quiz-content">
        <div className="question-info">
          <span className="question-number">
            問題 {currentQuestionIndex + 1}/{questions.length}
          </span>
          <span className="question-category">{currentQuestion.category}</span>
        </div>

        <div className="question-card">
          <h2 className="question-text">{currentQuestion.question}</h2>
          
          <div className="answer-options">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`answer-option ${
                  selectedAnswer === index 
                    ? isCorrect === true 
                      ? 'correct' 
                      : 'incorrect'
                    : showExplanation && index === currentQuestion.correctAnswer
                      ? 'correct-answer'
                      : ''
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
              >
                {option}
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="explanation">
              <div className={`result-indicator ${isCorrect ? 'correct' : 'incorrect'}`}>
                {isCorrect ? '✅ 正解！' : '❌ 不正解'}
              </div>
              <p className="explanation-text">{currentQuestion.explanation}</p>
              <button 
                className="next-button"
                onClick={nextQuestion}
              >
                {currentQuestionIndex + 1 >= questions.length ? '結果を見る' : '次の問題へ →'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizGame;
```

---

## Profile.tsx

**パス**: `my-wine-memory/src/pages/Profile.tsx`

```tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthHooks';
import { badgeService } from '../services/badgeService';
import { userService } from '../services/userService';
import { gamificationService } from '../services/gamificationService';
import ThemeToggle from '../components/ThemeToggle';
import NotificationSettings from '../components/NotificationSettings';
import BadgeDisplay, { EarnedBadges, LevelDisplay, StreakDisplay } from '../components/BadgeDisplay';
import type { Badge, UserStats, DailyGoal } from '../types';

const Profile: React.FC = () => {
  const { currentUser, userProfile, signInWithGoogle, logout } = useAuth();
  const [badges, setBadges] = useState<(Badge & { earnedAt: Date })[]>([]);
  const [badgeProgress, setBadgeProgress] = useState<{
    category: Badge['category'];
    badges: (Badge & { earned: boolean; progress: number })[];
  }[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal | null>(null);
  const [loading, setLoading] = useState(false);
  const [localPrivacySettings, setLocalPrivacySettings] = useState(userProfile?.privacySettings);
  const [showShareUrl, setShowShareUrl] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [notificationExpanded, setNotificationExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'stats' | 'badges' | 'achievements'>('stats');

  const loadUserData = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const [userBadges, userStats, userBadgeProgress, userDailyGoal] = await Promise.all([
        badgeService.getUserBadges(currentUser.uid),
        gamificationService.getUserStats(currentUser.uid),
        userService.getBadgeProgress(currentUser.uid),
        gamificationService.getDailyGoal(currentUser.uid)
      ]);
      
      setBadges(userBadges);
      setStats(userStats);
      setBadgeProgress(userBadgeProgress);
      setDailyGoal(userDailyGoal);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadUserData();
    }
  }, [currentUser, loadUserData]);

  useEffect(() => {
    setLocalPrivacySettings(userProfile?.privacySettings);
    setShowShareUrl(userProfile?.privacySettings?.allowPublicProfile || false);
  }, [userProfile?.privacySettings]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  const handlePrivacySettingChange = async (setting: string, value: boolean | string) => {
    if (!currentUser) return;
    
    try {
      const currentSettings = localPrivacySettings || {
        defaultRecordVisibility: 'private' as const,
        allowPublicProfile: false,
        pushNotifications: false
      };
      
      const updatedSettings = {
        ...currentSettings,
        [setting]: value
      };
      
      // Update local state immediately for responsive UI
      setLocalPrivacySettings(updatedSettings);
      
      // Handle public profile visibility change
      if (setting === 'allowPublicProfile') {
        setShowShareUrl(value as boolean);
      }
      
      // Update database
      await userService.updateUserPrivacySettings(currentUser.uid, updatedSettings);
      
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      // Revert local state on error
      setLocalPrivacySettings(userProfile?.privacySettings);
      setShowShareUrl(userProfile?.privacySettings?.allowPublicProfile || false);
      alert('プライバシー設定の更新に失敗しました。');
    }
  };

  const generateShareUrl = () => {
    if (!currentUser) return '';
    return `${window.location.origin}/profile/${currentUser.uid}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareUrl());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = generateShareUrl();
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>プロフィール</h1>
      </header>
      
      <main className="profile-content">
        <div className="profile-info">
          <div className="avatar">
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="Profile" className="avatar-image" />
            ) : (
              <span className="avatar-placeholder">👤</span>
            )}
          </div>
          <h2>{currentUser?.displayName || 'ゲストユーザー'}</h2>
          {currentUser && userProfile && (
            <div className="user-stats-summary">
              <LevelDisplay 
                level={userProfile.level} 
                xp={userProfile.xp} 
                xpForNextLevel={gamificationService.calculateXpForNextLevel(userProfile.level)}
              />
              <div className="stats-row">
                <StreakDisplay streak={userProfile.streak} />
                <div className="badges-count">
                  🏆 {badges.length} バッジ
                </div>
              </div>
            </div>
          )}
        </div>
        
        {!currentUser ? (
          <div className="login-section">
            <p>ログインして記録を保存しましょう</p>
            <button className="google-login-button" onClick={handleGoogleSignIn}>
              🔍 Googleでログイン
            </button>
          </div>
        ) : (
          <div className="logout-section">
            <button className="logout-button" onClick={handleLogout}>
              ログアウト
            </button>
          </div>
        )}

        {/* Notification Settings */}
        {currentUser && (
          <div className="notification-settings-section">
            <NotificationSettings 
              isExpanded={notificationExpanded}
              onToggle={() => setNotificationExpanded(!notificationExpanded)}
            />
          </div>
        )}

        {/* Daily Goal Display */}
        {currentUser && dailyGoal && (
          <div className="daily-goal-section">
            <h3>今日の目標</h3>
            <div className="daily-goal-grid">
              <div className="goal-item">
                <div className="goal-icon">🍷</div>
                <div className="goal-progress">
                  <div className="goal-text">ワイン記録</div>
                  <div className="goal-numbers">
                    {dailyGoal.wineRecordingCompleted} / {dailyGoal.wineRecordingGoal}
                  </div>
                  <div className="goal-bar">
                    <div 
                      className="goal-fill" 
                      style={{ 
                        width: `${Math.min(100, (dailyGoal.wineRecordingCompleted / dailyGoal.wineRecordingGoal) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="goal-item">
                <div className="goal-icon">🧠</div>
                <div className="goal-progress">
                  <div className="goal-text">クイズ</div>
                  <div className="goal-numbers">
                    {dailyGoal.quizCompleted} / {dailyGoal.quizGoal}
                  </div>
                  <div className="goal-bar">
                    <div 
                      className="goal-fill" 
                      style={{ 
                        width: `${Math.min(100, (dailyGoal.quizCompleted / dailyGoal.quizGoal) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="profile-tabs">
          <button 
            className={`tab-button ${selectedTab === 'stats' ? 'active' : ''}`}
            onClick={() => setSelectedTab('stats')}
          >
            統計
          </button>
          <button 
            className={`tab-button ${selectedTab === 'badges' ? 'active' : ''}`}
            onClick={() => setSelectedTab('badges')}
          >
            獲得バッジ
          </button>
          <button 
            className={`tab-button ${selectedTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setSelectedTab('achievements')}
          >
            全バッジ
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {selectedTab === 'stats' && (
            <div className="achievements">
              <h3>実績</h3>
              <div className="achievement-item">
                <span>🍷 記録数</span>
                <span>{stats?.totalRecords || 0}本</span>
              </div>
              <div className="achievement-item">
                <span>🔥 現在のストリーク</span>
                <span>{stats?.currentStreak || 0}日</span>
              </div>
              <div className="achievement-item">
                <span>🏃 最長ストリーク</span>
                <span>{stats?.longestStreak || 0}日</span>
              </div>
              <div className="achievement-item">
                <span>🧠 クイズ正答数</span>
                <span>{stats?.totalQuizzes || 0}問</span>
              </div>
              <div className="achievement-item">
                <span>📊 平均評価</span>
                <span>{stats?.averageRating ? stats.averageRating.toFixed(1) : '-'}</span>
              </div>
              <div className="achievement-item">
                <span>⭐ 現在のレベル</span>
                <span>レベル {userProfile?.level || 1}</span>
              </div>
              <div className="achievement-item">
                <span>💎 XP</span>
                <span>{userProfile?.xp || 0} XP</span>
              </div>
            </div>
          )}

          {selectedTab === 'badges' && (
            <div className="badges-section">
              <h3>獲得バッジ ({badges.length}個)</h3>
              {loading ? (
                <p>読み込み中...</p>
              ) : (
                <EarnedBadges badges={badges} />
              )}
            </div>
          )}

          {selectedTab === 'achievements' && (
            <div className="all-badges-section">
              <h3>全バッジ進捗</h3>
              {loading ? (
                <p>読み込み中...</p>
              ) : (
                <div className="badge-progress-container">
                  {badgeProgress.map((categoryData) => {
                    const categoryNames = {
                      recording: '記録バッジ',
                      streak: '連続記録バッジ',
                      quiz: 'クイズバッジ',
                      exploration: '探求バッジ'
                    };
                    
                    return (
                      <BadgeDisplay
                        key={categoryData.category}
                        badges={categoryData.badges}
                        category={categoryData.category}
                        title={categoryNames[categoryData.category as keyof typeof categoryNames]}
                        showProgress={true}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="settings">
          <h3>設定</h3>
          
          <NotificationSettings 
            isExpanded={notificationExpanded}
            onToggle={() => setNotificationExpanded(!notificationExpanded)}
          />
          
          <div className="setting-item">
            <label className="setting-label">
              <span>ほかの人も記録を見れるようにする</span>
              <input 
                type="checkbox" 
                checked={localPrivacySettings?.defaultRecordVisibility === 'public'}
                onChange={(e) => handlePrivacySettingChange('defaultRecordVisibility', e.target.checked ? 'public' : 'private')}
                className="setting-checkbox"
              />
            </label>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">
              <span>プロフィールを公開する</span>
              <input 
                type="checkbox" 
                checked={localPrivacySettings?.allowPublicProfile ?? false}
                onChange={(e) => handlePrivacySettingChange('allowPublicProfile', e.target.checked)}
                className="setting-checkbox"
              />
            </label>
            {showShareUrl && (
              <div className="share-url-container">
                <div className="share-url-box">
                  <span className="share-url-text">{generateShareUrl()}</span>
                  <button 
                    className={`copy-button ${copySuccess ? 'copied' : ''}`}
                    onClick={copyToClipboard}
                    title="クリップボードにコピー"
                  >
                    {copySuccess ? '✅' : '📋'}
                  </button>
                </div>
                <p className="share-url-description">
                  この URL をシェアして、あなたのワイン記録を友達に見せましょう！
                </p>
              </div>
            )}
          </div>
          
          <div className="setting-item">
            <div className="setting-label">
              <span>テーマ</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
```

---

## useAsyncOperation.ts

**パス**: `my-wine-memory/src/hooks/useAsyncOperation.ts`

```ts
import { useState, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useAsyncOperation = <T>() => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await asyncFunction();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};
```

---

## useAutoSave.ts

**パス**: `my-wine-memory/src/hooks/useAutoSave.ts`

```ts
import { useEffect, useRef, useCallback } from 'react';
import { draftService } from '../services/wineService';
import { indexedDBService } from '../services/indexedDBService';
import type { WineRecord, TastingRecord } from '../types';
import { useNetworkStatus } from './useNetworkStatus';

interface UseAutoSaveProps {
  userId: string | undefined;
  formData: Partial<WineRecord> | Partial<TastingRecord>;
  enabled: boolean;
  interval?: number; // in milliseconds, default 30 seconds
  wineId?: string;
  wineName?: string;
  draftId?: string | null;
  onDraftSaved?: (draftId: string) => void;
}

export const useAutoSave = ({ 
  userId, 
  formData, 
  enabled, 
  interval = 30000,
  wineId,
  wineName,
  draftId,
  onDraftSaved
}: UseAutoSaveProps) => {
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastSavedRef = useRef<string>('');
  const { isOnline } = useNetworkStatus();

  // Enhanced content detection for tasting records
  const hasContent = useCallback(() => {
    if ('wineName' in formData) {
      // Legacy WineRecord format
      return formData.wineName || formData.producer || formData.country || formData.region;
    } else {
      // TastingRecord format
      const record = formData as Partial<TastingRecord>;
      return record.notes || 
             record.overallRating !== 5.0 || 
             record.price || 
             record.purchaseLocation ||
             (record.images && record.images.length > 0);
    }
  }, [formData]);

  // Save to IndexedDB (offline-first approach)
  const saveToIndexedDB = useCallback(async (): Promise<string | null> => {
    if (!userId || !hasContent()) return null;

    try {
      const currentDataString = JSON.stringify(formData);
      if (currentDataString === lastSavedRef.current) return draftId ?? null;

      let savedDraftId: string;

      if (draftId) {
        // Update existing draft
        const draftRecord = {
          id: draftId,
          data: formData as Partial<TastingRecord>,
          lastModified: Date.now(),
          wineId,
          wineName
        };
        await indexedDBService.saveDraft(draftRecord);
        savedDraftId = draftId;
      } else {
        // Create new draft
        savedDraftId = `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const draftRecord = {
          id: savedDraftId,
          data: formData as Partial<TastingRecord>,
          lastModified: Date.now(),
          wineId,
          wineName
        };
        await indexedDBService.saveDraft(draftRecord);
      }

      lastSavedRef.current = currentDataString;
      
      if (onDraftSaved) {
        onDraftSaved(savedDraftId);
      }

      return savedDraftId;
    } catch (error) {
      console.error('Failed to save draft to IndexedDB:', error);
      return null;
    }
  }, [userId, formData, hasContent, draftId, wineId, wineName, onDraftSaved]);

  // Save to cloud (when online)
  const saveToCloud = useCallback(async (): Promise<boolean> => {
    if (!userId || !isOnline) return false;

    try {
      // Use legacy draft service for cloud sync
      await draftService.saveDraft(userId, formData as Partial<WineRecord>);
      return true;
    } catch (error) {
      console.error('Failed to save draft to cloud:', error);
      return false;
    }
  }, [userId, formData, isOnline]);

  useEffect(() => {
    if (!enabled || !userId) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (!hasContent()) return;

    // Check if data has changed
    const currentDataString = JSON.stringify(formData);
    if (currentDataString === lastSavedRef.current) return;

    // Set timeout to save
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        // Always save to IndexedDB first (offline-first)
        // const savedDraftId = await saveToIndexedDB();
        await saveToIndexedDB();
        
        // Also try to save to cloud if online
        if (isOnline) {
          await saveToCloud();
        }
        
        console.log(`Draft auto-saved${isOnline ? ' (online + offline)' : ' (offline only)'}`);
      } catch (error) {
        console.error('Failed to auto-save draft:', error);
      }
    }, interval);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [userId, formData, enabled, interval, hasContent, saveToIndexedDB, saveToCloud, isOnline]);

  // Manual save function
  const saveNow = useCallback(async (): Promise<{
    success: boolean;
    draftId?: string;
    savedOffline: boolean;
    savedOnline: boolean;
  }> => {
    if (!userId) return {
      success: false,
      savedOffline: false,
      savedOnline: false
    };

    let savedOffline = false;
    let savedOnline = false;
    let resultDraftId: string | undefined;

    try {
      // Save to IndexedDB
      const draftIdResult = await saveToIndexedDB();
      if (draftIdResult) {
        savedOffline = true;
        resultDraftId = draftIdResult;
      }

      // Save to cloud if online
      if (isOnline) {
        savedOnline = await saveToCloud();
      }

      return {
        success: savedOffline || savedOnline,
        draftId: resultDraftId,
        savedOffline,
        savedOnline
      };
    } catch (error) {
      console.error('Failed to save draft:', error);
      return {
        success: false,
        savedOffline,
        savedOnline
      };
    }
  }, [userId, saveToIndexedDB, saveToCloud, isOnline]);

  return { 
    saveNow,
    hasUnsavedChanges: () => {
      const currentDataString = JSON.stringify(formData);
      return currentDataString !== lastSavedRef.current && hasContent();
    }
  };
};
```

---

## useOfflineSync.ts

**パス**: `my-wine-memory/src/hooks/useOfflineSync.ts`

```ts
/**
 * Hook for managing offline synchronization
 * Handles draft persistence, cache management, and sync queue
 */

import { useState, useEffect, useCallback } from 'react';
import { indexedDBService } from '../services/indexedDBService';
import type { DraftRecord, SyncQueueItem } from '../services/indexedDBService';
import { useNetworkStatus } from './useNetworkStatus';
import type { TastingRecord, WineMaster } from '../types';

export interface OfflineSyncState {
  isInitialized: boolean;
  drafts: DraftRecord[];
  syncQueueCount: number;
  cacheInfo: {
    wines: number;
    records: number;
  };
  isSyncing: boolean;
  lastSyncTime: number | null;
}

export function useOfflineSync(userId?: string) {
  const [state, setState] = useState<OfflineSyncState>({
    isInitialized: false,
    drafts: [],
    syncQueueCount: 0,
    cacheInfo: { wines: 0, records: 0 },
    isSyncing: false,
    lastSyncTime: null
  });

  const { isOnline } = useNetworkStatus();

  // Initialize IndexedDB
  useEffect(() => {
    const initialize = async () => {
      try {
        await indexedDBService.initialize();
        await loadOfflineData();
        setState(prev => ({ ...prev, isInitialized: true }));
      } catch (error) {
        console.error('Failed to initialize offline storage:', error);
      }
    };

    initialize();
  }, []);

  // Load offline data
  const loadOfflineData = useCallback(async () => {
    try {
      const [drafts, storageInfo] = await Promise.all([
        indexedDBService.getDrafts(),
        indexedDBService.getStorageInfo()
      ]);

      setState(prev => ({
        ...prev,
        drafts,
        syncQueueCount: storageInfo.syncQueueItems,
        cacheInfo: {
          wines: storageInfo.cachedWines,
          records: storageInfo.cachedRecords
        }
      }));
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  }, []);

  // Save draft
  const saveDraft = useCallback(async (
    data: Partial<TastingRecord>,
    wineId?: string,
    wineName?: string
  ): Promise<string> => {
    const draftId = `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const draft: DraftRecord = {
      id: draftId,
      data,
      lastModified: Date.now(),
      wineId,
      wineName
    };

    await indexedDBService.saveDraft(draft);
    await loadOfflineData();
    
    return draftId;
  }, [loadOfflineData]);

  // Update existing draft
  const updateDraft = useCallback(async (
    draftId: string,
    data: Partial<TastingRecord>,
    wineId?: string,
    wineName?: string
  ): Promise<void> => {
    const draft: DraftRecord = {
      id: draftId,
      data,
      lastModified: Date.now(),
      wineId,
      wineName
    };

    await indexedDBService.saveDraft(draft);
    await loadOfflineData();
  }, [loadOfflineData]);

  // Delete draft
  const deleteDraft = useCallback(async (draftId: string): Promise<void> => {
    await indexedDBService.deleteDraft(draftId);
    await loadOfflineData();
  }, [loadOfflineData]);

  // Cache wines for offline access
  const cacheWines = useCallback(async (wines: WineMaster[]): Promise<void> => {
    await indexedDBService.cacheWines(wines);
    await loadOfflineData();
  }, [loadOfflineData]);

  // Cache tasting records for offline access
  const cacheTastingRecords = useCallback(async (records: TastingRecord[]): Promise<void> => {
    await indexedDBService.cacheTastingRecords(records);
    await loadOfflineData();
  }, [loadOfflineData]);

  // Get cached wines (for offline search)
  const getCachedWines = useCallback(async (): Promise<WineMaster[]> => {
    return await indexedDBService.getCachedWines();
  }, []);

  // Search cached wines
  const searchCachedWines = useCallback(async (query: string): Promise<WineMaster[]> => {
    return await indexedDBService.searchCachedWines(query);
  }, []);

  // Get cached tasting records
  const getCachedTastingRecords = useCallback(async (): Promise<TastingRecord[]> => {
    if (!userId) return [];
    return await indexedDBService.getCachedTastingRecords(userId);
  }, [userId]);

  // Add operation to sync queue (for offline operations)
  const queueOfflineOperation = useCallback(async (
    operation: 'CREATE' | 'UPDATE' | 'DELETE',
    collection: 'tasting_records' | 'wines_master',
    data: any
  ): Promise<void> => {
    await indexedDBService.addToSyncQueue({
      operation,
      collection,
      data
    });
    await loadOfflineData();
  }, [loadOfflineData]);

  // Sync queued operations when online
  const syncOfflineOperations = useCallback(async (
    syncFunction: (item: SyncQueueItem) => Promise<void>
  ): Promise<void> => {
    if (!isOnline) return;

    setState(prev => ({ ...prev, isSyncing: true }));

    try {
      const queue = await indexedDBService.getSyncQueue();
      
      for (const item of queue) {
        try {
          await syncFunction(item);
          await indexedDBService.removeSyncQueueItem(item.id);
        } catch (error) {
          console.error('Failed to sync item:', item, error);
          // Continue with next item instead of failing entire sync
        }
      }

      setState(prev => ({ 
        ...prev, 
        lastSyncTime: Date.now()
      }));
      
      await loadOfflineData();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setState(prev => ({ ...prev, isSyncing: false }));
    }
  }, [isOnline, loadOfflineData]);

  // Clear all cached data
  const clearCache = useCallback(async (): Promise<void> => {
    await indexedDBService.clearCache();
    await loadOfflineData();
  }, [loadOfflineData]);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && state.syncQueueCount > 0) {
      // Auto-sync will be handled by the consuming component
      // This hook just tracks the state
    }
  }, [isOnline, state.syncQueueCount]);

  return {
    ...state,
    saveDraft,
    updateDraft,
    deleteDraft,
    cacheWines,
    cacheTastingRecords,
    getCachedWines,
    searchCachedWines,
    getCachedTastingRecords,
    queueOfflineOperation,
    syncOfflineOperations,
    clearCache,
    refreshOfflineData: loadOfflineData
  };
}
```

---

## WineCard.tsx

**パス**: `my-wine-memory/src/components/WineCard.tsx`

```tsx
import React from 'react';
import type { WineRecord } from '../types';

interface WineCardProps {
  wine: WineRecord;
  onClick?: () => void;
}

const WineCard: React.FC<WineCardProps> = ({ wine, onClick }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const cover = wine.images && wine.images.length > 0 ? wine.images[0] : undefined;

  return (
    <div className="wine-card wine-card--photo" onClick={onClick}>
      {cover && <div className="wine-card-bg" style={{ backgroundImage: `url(${cover})` }} />}
      <div className="wine-card-body">
        <div className="wine-card-header">
          <h3 className="wine-name">{wine.wineName}</h3>
          <div className="wine-rating">
            <span className="rating-score">{wine.overallRating.toFixed(1)}</span>
            <span className="rating-scale">/10</span>
          </div>
        </div>
        
        <div className="wine-info">
          <p className="producer">
            <span className="label">生産者:</span> {wine.producer}
          </p>
          <p className="location">
            <span className="label">産地:</span> {wine.country} - {wine.region}
          </p>
          {wine.vintage && (
            <p className="vintage">
              <span className="label">年:</span> {wine.vintage}
            </p>
          )}
          {wine.price && (
            <p className="price">
              <span className="label">価格:</span> ¥{wine.price.toLocaleString()}
            </p>
          )}
        </div>

        <div className="wine-card-footer">
          <span className="record-date">{formatDate(wine.createdAt)}</span>
          <span className="record-mode">
            {wine.recordMode === 'quick' ? 'クイック記録' : '詳細記録'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WineCard;
```

---

## BottomNavigation.tsx

**パス**: `my-wine-memory/src/components/BottomNavigation.tsx`

```tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: '🏠', label: 'ホーム' },
    { path: '/records', icon: '📝', label: '記録' },
    { path: '/quiz', icon: '🧠', label: 'クイズ' },
    { path: '/stats', icon: '📊', label: '統計' },
    { path: '/profile', icon: '👤', label: 'プロフィール' },
  ];
  
  return (
    <nav className="bottom-navigation">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNavigation;
```

---

## BadgeDisplay.tsx

**パス**: `my-wine-memory/src/components/BadgeDisplay.tsx`

```tsx
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
  const currentLevelXp = xp - (level > 1 ? calculateTotalXpForLevel(level - 1) : 0);
  const progressPercentage = (currentLevelXp / xpForNextLevel) * 100;

  return (
    <div className="level-display">
      <div className="level-info">
        <div className="level-number">レベル {level}</div>
        <div className="xp-info">{xp.toLocaleString()} XP</div>
      </div>
      <div className="level-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill level-progress-fill" 
            style={{ width: `${Math.min(100, progressPercentage)}%` }}
          />
        </div>
        <div className="progress-text">
          {currentLevelXp} / {xpForNextLevel} XP
        </div>
      </div>
      <div className="next-level">
        次のレベルまで {xpForNextLevel - currentLevelXp} XP
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
  box-shadow: 0 2px 8px rgba(114, 47, 55, 0.1);
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
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
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
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.level-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.level-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.xp-info {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

.level-progress {
  margin-bottom: 0.5rem;
}

.next-level {
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
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
```

---

