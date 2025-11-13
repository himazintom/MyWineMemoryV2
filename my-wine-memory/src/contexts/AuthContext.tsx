import React, { createContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import type { User } from '../types';
import { userService } from '../services/userService';
import { guestDataService } from '../services/guestDataService';
import { wineMasterService } from '../services/wineMasterService';
import { tastingRecordService } from '../services/tastingRecordService';
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
      // Check if we're on iOS Safari or in PWA mode
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                    (window.navigator as any).standalone === true;

      console.log('[Auth] Device detection - iOS:', isIOS, 'PWA:', isPWA);
      console.log('[Auth] User Agent:', navigator.userAgent);

      if (isIOS || isPWA) {
        // Use redirect method for iOS/PWA
        console.log('[Auth] Using redirect method for iOS/PWA...');
        console.log('[Auth] Current URL before redirect:', window.location.href);
        await signInWithRedirect(auth, provider);
        // The redirect will happen, and result will be handled on page reload
        return null;
      } else {
        // Use popup method for desktop and Android
        console.log('[Auth] Starting Google sign-in with popup...');
        const result = await signInWithPopup(auth, provider);
        console.log('[Auth] Popup sign-in successful for user:', result.user.uid);

        // Create or update user profile in Firestore
        const userProfile = await userService.createOrUpdateUser(result.user);
        setUserProfile(userProfile);
        console.log('[Auth] User profile created/updated after popup sign-in');

        return result;
      }
    } catch (error: unknown) {
      console.error('[Auth] Google sign-in error:', error);

      if (error && typeof error === 'object' && 'code' in error) {
        const authError = error as { code: string; message?: string };
        console.log('[Auth] Auth error code:', authError.code);

        if (authError.code === 'auth/popup-closed-by-user') {
          throw new Error('サインインがキャンセルされました');
        } else if (authError.code === 'auth/popup-blocked') {
          // If popup is blocked, fallback to redirect
          console.log('[Auth] Popup blocked, using redirect method...');
          await signInWithRedirect(auth, provider);
          return null;
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
      // Migrate guest tasting records (new architecture: WineMaster + TastingRecord)
      const guestTastingRecords = guestDataService.getGuestTastingRecords();
      for (const guestRecord of guestTastingRecords) {
        // Step 1: Create or find WineMaster
        const wineId = await wineMasterService.createOrFindWineMaster(
          guestRecord.wineData,
          currentUser.uid
        );

        // Step 2: Create TastingRecord linked to WineMaster
        await tastingRecordService.createTastingRecord(currentUser.uid, {
          wineId,
          ...guestRecord.tastingData
        });
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
    // Check for redirect result when component mounts
    const handleRedirectResult = async () => {
      try {
        console.log('[Auth] Checking for redirect result...');
        const result = await getRedirectResult(auth);

        if (result && result.user) {
          console.log('[Auth] Redirect sign-in successful for user:', result.user.uid);
          // Create or update user profile in Firestore
          const userProfile = await userService.createOrUpdateUser(result.user);
          setUserProfile(userProfile);
          console.log('[Auth] User profile created/updated');

          // Migrate guest data if available (new architecture)
          if (guestDataService.hasGuestData()) {
            console.log('[Auth] Migrating guest data...');
            const guestTastingRecords = guestDataService.getGuestTastingRecords();
            for (const guestRecord of guestTastingRecords) {
              // Step 1: Create or find WineMaster
              const wineId = await wineMasterService.createOrFindWineMaster(
                guestRecord.wineData,
                result.user.uid
              );

              // Step 2: Create TastingRecord
              await tastingRecordService.createTastingRecord(result.user.uid, {
                wineId,
                ...guestRecord.tastingData
              });
            }

            const guestQuizResults = guestDataService.getGuestQuizResults();
            if (guestQuizResults.length > 0) {
              const totalGuestXP = guestQuizResults.reduce((sum, result) => sum + result.xpEarned, 0);
              await userService.addXP(result.user.uid, totalGuestXP);
            }

            guestDataService.clearAllGuestData();
            console.log('[Auth] Guest data migration completed after redirect');
          }
        } else {
          console.log('[Auth] No redirect result found (normal if not returning from OAuth)');
        }
      } catch (error) {
        // This is expected when the user hasn't just completed an OAuth flow
        console.debug('[Auth] No pending redirect result:', error instanceof Error ? error.message : String(error));
      }
    };

    handleRedirectResult();

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('[Auth] onAuthStateChanged fired, user:', user?.uid || 'null');
      setCurrentUser(user);

      if (user) {
        try {
          // Wait longer to ensure token is fully available and propagated
          await new Promise(resolve => setTimeout(resolve, 500));

          console.log('[Auth] Loading user profile for:', user.uid);
          // Fetch user profile from Firestore
          const profile = await userService.getUserProfile(user.uid);
          setUserProfile(profile);
          console.log('[Auth] User profile loaded successfully');

          // Initialize notification schedules for the user
          await notificationScheduler.initializeUserNotifications(user.uid);
          console.log('[Auth] Notifications initialized');
        } catch (error) {
          console.error('[Auth] Failed to load user profile:', error);
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