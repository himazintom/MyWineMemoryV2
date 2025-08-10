import type { User as FirebaseUser } from 'firebase/auth';
import type { User } from '../types';

export interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGoogleAndMigrateData: () => Promise<void>;
  logout: () => Promise<void>;
  hasGuestData: () => boolean;
  getGuestDataSummary: () => { wineRecords: number; quizResults: number; totalXP: number };
}