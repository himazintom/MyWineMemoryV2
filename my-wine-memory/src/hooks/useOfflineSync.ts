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