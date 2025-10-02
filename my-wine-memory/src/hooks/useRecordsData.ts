/**
 * Custom hook for Records page data management
 * Handles loading, filtering, and sorting of wine records
 */

import { useReducer, useCallback, useEffect } from 'react';
import { tastingRecordService } from '../services/tastingRecordService';
import { wineMasterService } from '../services/wineMasterService';
import type { WineMaster, TastingRecord } from '../types';

// Wine with tastings interface
export interface WineWithTastings {
  wine: WineMaster;
  tastingRecords: TastingRecord[];
  latestTasting: Date;
  averageRating: number;
}

// State interface
interface RecordsDataState {
  wineGroups: WineWithTastings[];
  filteredWineGroups: WineWithTastings[];
  searchTerm: string;
  sortBy: 'date' | 'rating' | 'count';
  loading: boolean;
  error: string | null;
}

// Action types
type RecordsDataAction =
  | { type: 'LOADING_START' }
  | { type: 'LOAD_SUCCESS'; payload: WineWithTastings[] }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'SET_SEARCH_TERM'; searchTerm: string }
  | { type: 'SET_SORT_BY'; sortBy: 'date' | 'rating' | 'count' }
  | { type: 'RESET' };

// Initial state
const initialState: RecordsDataState = {
  wineGroups: [],
  filteredWineGroups: [],
  searchTerm: '',
  sortBy: 'date',
  loading: false,
  error: null,
};

// Utility function to filter and sort wine groups
function filterAndSort(
  wineGroups: WineWithTastings[],
  searchTerm: string,
  sortBy: 'date' | 'rating' | 'count'
): WineWithTastings[] {
  let filtered = wineGroups;

  // Apply search filter
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(wineGroup =>
      wineGroup.wine.wineName.toLowerCase().includes(term) ||
      wineGroup.wine.producer.toLowerCase().includes(term) ||
      wineGroup.wine.country.toLowerCase().includes(term)
    );
  }

  // Apply sorting
  const sorted = [...filtered];
  switch (sortBy) {
    case 'date':
      sorted.sort((a, b) => b.latestTasting.getTime() - a.latestTasting.getTime());
      break;
    case 'rating':
      sorted.sort((a, b) => b.averageRating - a.averageRating);
      break;
    case 'count':
      sorted.sort((a, b) => b.tastingRecords.length - a.tastingRecords.length);
      break;
  }

  return sorted;
}

// Reducer function
function recordsDataReducer(state: RecordsDataState, action: RecordsDataAction): RecordsDataState {
  switch (action.type) {
    case 'LOADING_START':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'LOAD_SUCCESS': {
      const wineGroups = action.payload;
      const filteredWineGroups = filterAndSort(wineGroups, state.searchTerm, state.sortBy);
      return {
        ...state,
        wineGroups,
        filteredWineGroups,
        loading: false,
        error: null,
      };
    }

    case 'LOAD_ERROR':
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case 'SET_SEARCH_TERM': {
      const filteredWineGroups = filterAndSort(state.wineGroups, action.searchTerm, state.sortBy);
      return {
        ...state,
        searchTerm: action.searchTerm,
        filteredWineGroups,
      };
    }

    case 'SET_SORT_BY': {
      const filteredWineGroups = filterAndSort(state.wineGroups, state.searchTerm, action.sortBy);
      return {
        ...state,
        sortBy: action.sortBy,
        filteredWineGroups,
      };
    }

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

/**
 * Hook for managing Records page data
 * @param userId - Current user ID
 */
export function useRecordsData(userId: string | undefined) {
  const [state, dispatch] = useReducer(recordsDataReducer, initialState);

  const loadRecords = useCallback(async () => {
    if (!userId) return;

    dispatch({ type: 'LOADING_START' });

    try {
      // Get all user's tasting records
      const tastingRecords = await tastingRecordService.getUserTastingRecords(userId, 'date', 1000);

      // Filter and validate records
      const validRecords = tastingRecords.filter(record => {
        const hasValidWineId = record.wineId && typeof record.wineId === 'string' && record.wineId.trim() !== '';
        if (!hasValidWineId) {
          console.error('Found record with invalid wineId:', {
            recordId: record.id,
            wineId: record.wineId,
          });
        }
        return hasValidWineId;
      });

      if (validRecords.length !== tastingRecords.length) {
        console.warn(`Filtered out ${tastingRecords.length - validRecords.length} records with invalid wineId`);
      }

      // Group by wine ID
      const wineGroups = new Map<string, TastingRecord[]>();
      validRecords.forEach(record => {
        if (!wineGroups.has(record.wineId)) {
          wineGroups.set(record.wineId, []);
        }
        wineGroups.get(record.wineId)!.push(record);
      });

      // Batch fetch wine master data
      const wineIds = Array.from(wineGroups.keys()).filter(id => id && id.trim() !== '');

      if (wineIds.length === 0) {
        console.warn('No valid wine IDs found');
        dispatch({ type: 'LOAD_SUCCESS', payload: [] });
        return;
      }

      const wines = await wineMasterService.getWineMastersByIds(wineIds, userId);
      const wineMap = new Map<string, WineMaster>();
      wines.forEach((w) => wineMap.set(w.id, w));

      // Build wine with tastings array
      const wineWithTastings: WineWithTastings[] = [];
      for (const [wineId, records] of wineGroups.entries()) {
        const wine = wineMap.get(wineId);
        if (!wine) {
          console.warn(`Wine not found for wineId: ${wineId}`);
          continue;
        }

        const latestTasting = new Date(Math.max(...records.map(r => new Date(r.tastingDate).getTime())));
        const averageRating = records.reduce((sum, r) => sum + r.overallRating, 0) / records.length;

        wineWithTastings.push({
          wine,
          tastingRecords: records.sort((a, b) => new Date(b.tastingDate).getTime() - new Date(a.tastingDate).getTime()),
          latestTasting,
          averageRating,
        });
      }

      dispatch({ type: 'LOAD_SUCCESS', payload: wineWithTastings });
    } catch (error) {
      console.error('Failed to load records:', error);
      dispatch({
        type: 'LOAD_ERROR',
        error: error instanceof Error ? error.message : '不明なエラーが発生しました',
      });
    }
  }, [userId]);

  // Auto-load data when userId changes
  useEffect(() => {
    if (userId) {
      loadRecords();
    }
  }, [userId, loadRecords]);

  const setSearchTerm = useCallback((searchTerm: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', searchTerm });
  }, []);

  const setSortBy = useCallback((sortBy: 'date' | 'rating' | 'count') => {
    dispatch({ type: 'SET_SORT_BY', sortBy });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    ...state,
    loadRecords,
    setSearchTerm,
    setSortBy,
    reset,
  };
}
