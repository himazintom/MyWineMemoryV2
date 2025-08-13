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
      if (currentDataString === lastSavedRef.current) return draftId;

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
        const savedDraftId = await saveToIndexedDB();
        
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