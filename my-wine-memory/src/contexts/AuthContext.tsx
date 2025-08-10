import React, { createContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import type { User } from '../types';
import { userService } from '../services/userService';
import { guestDataService } from '../services/guestDataService';
import { wineService } from '../services/wineService';
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
    // Remove custom parameters that might interfere with popup
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Create or update user profile in Firestore
      const userProfile = await userService.createOrUpdateUser(result.user);
      setUserProfile(userProfile);
    } catch (error: unknown) {
      console.error('Google sign-in error:', error);
      
      // Provide more detailed error information
      if (error && typeof error === 'object' && 'code' in error) {
        const authError = error as { code: string; message?: string };
        if (authError.code === 'auth/popup-closed-by-user') {
          throw new Error('サインインがキャンセルされました');
        } else if (authError.code === 'auth/popup-blocked') {
          throw new Error('ポップアップがブロックされています。ポップアップブロッカーを無効にしてください');
        } else if (authError.code === 'auth/cancelled-popup-request') {
          throw new Error('サインイン要求がキャンセルされました');
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
          // Fetch user profile from Firestore
          const profile = await userService.getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Failed to load user profile:', error);
        }
      } else {
        setUserProfile(null);
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