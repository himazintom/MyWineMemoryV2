/**
 * Custom hook for Home page data management
 * Replaces multiple useState calls with a single useReducer
 */

import { useReducer, useCallback, useEffect } from 'react';
import { tastingRecordService } from '../services/tastingRecordService';
import { draftService } from '../services/wineService';
import { gamificationService } from '../services/gamificationService';
import { guestDataService } from '../services/guestDataService';
import { userService } from '../services/userService';
import type { WineRecord, WineDraft, DailyGoal } from '../types';

// State interface
interface HomeDataState {
  recentWines: WineRecord[];
  drafts: WineDraft[];
  dailyGoal: DailyGoal | null;
  weeklyProgress: number[];
  learningStreak: number;
  loading: boolean;
  error: string | null;
}

// Action types
type HomeDataAction =
  | { type: 'LOADING_START' }
  | { type: 'LOAD_SUCCESS'; payload: Partial<HomeDataState> }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'RESET' };

// Initial state
const initialState: HomeDataState = {
  recentWines: [],
  drafts: [],
  dailyGoal: null,
  weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
  learningStreak: 0,
  loading: false,
  error: null,
};

// Reducer function
function homeDataReducer(state: HomeDataState, action: HomeDataAction): HomeDataState {
  switch (action.type) {
    case 'LOADING_START':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'LOAD_SUCCESS':
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null,
      };

    case 'LOAD_ERROR':
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

/**
 * Hook for managing Home page data
 * @param userId - Current user ID (undefined for guest mode)
 * @param userProfile - User profile data (for streak information)
 * @param authInitializing - Whether auth is still initializing
 */
export function useHomeData(
  userId: string | undefined,
  userProfile: { streak?: number; level?: number } | null,
  authInitializing: boolean
) {
  const [state, dispatch] = useReducer(homeDataReducer, initialState);

  const loadData = useCallback(async () => {
    // Don't load data while auth is initializing
    if (authInitializing) {
      console.log('Auth still initializing, waiting...');
      return;
    }

    dispatch({ type: 'LOADING_START' });

    try {
      if (userId) {
        // Load authenticated user data
        const [wines, userDrafts, goal, weekProgress] = await Promise.all([
          tastingRecordService.getUserTastingRecordsWithWineInfo(userId, 'date', 5).catch(error => {
            console.error('Failed to load wines:', error);
            return [];
          }),
          draftService.getUserDrafts(userId).catch(error => {
            console.error('Failed to load drafts:', error);
            return [];
          }),
          gamificationService.getDailyGoal(userId).catch(error => {
            console.error('Failed to load daily goal:', error);
            return {
              userId,
              date: new Date().toISOString().substring(0, 10),
              wineRecordingGoal: 1,
              quizGoal: 5,
              wineRecordingCompleted: 0,
              quizCompleted: 0,
              xpEarned: 0
            };
          }),
          userService.getWeeklyProgress(userId).catch(error => {
            console.error('Failed to load weekly progress:', error);
            return [0, 0, 0, 0, 0, 0, 0];
          })
        ]);

        dispatch({
          type: 'LOAD_SUCCESS',
          payload: {
            recentWines: wines.slice(0, 3),
            drafts: userDrafts,
            dailyGoal: goal,
            weeklyProgress: weekProgress,
            learningStreak: userProfile?.streak || 0,
          },
        });
      } else {
        // Load guest data
        console.log('No authenticated user, loading guest data');
        const guestWines = guestDataService.getGuestWineRecordsAsWineRecords();

        dispatch({
          type: 'LOAD_SUCCESS',
          payload: {
            recentWines: guestWines.slice(0, 3),
            drafts: [],
            dailyGoal: null,
            weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
            learningStreak: 0,
          },
        });
      }
    } catch (error) {
      console.error('Failed to load home data:', error);
      dispatch({
        type: 'LOAD_ERROR',
        error: error instanceof Error ? error.message : '不明なエラーが発生しました',
      });
    }
  }, [userId, userProfile, authInitializing]);

  // Auto-load data when dependencies change
  useEffect(() => {
    loadData();
  }, [loadData]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    ...state,
    loadData,
    reset,
  };
}
