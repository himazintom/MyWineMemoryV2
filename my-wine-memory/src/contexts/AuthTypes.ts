import type { User as FirebaseUser, UserCredential } from 'firebase/auth';
import type { User } from '../types';

export interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<UserCredential>;
  signInWithGoogleAndMigrateData: () => Promise<void>;
  logout: () => Promise<void>;
  hasGuestData: () => boolean;
  getGuestDataSummary: () => { wineRecords: number; quizResults: number; totalXP: number };
}