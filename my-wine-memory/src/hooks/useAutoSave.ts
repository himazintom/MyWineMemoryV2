import { useEffect, useRef } from 'react';
import { draftService } from '../services/wineService';
import type { WineRecord } from '../types';

interface UseAutoSaveProps {
  userId: string | undefined;
  formData: Partial<WineRecord>;
  enabled: boolean;
  interval?: number; // in milliseconds, default 30 seconds
}

export const useAutoSave = ({ 
  userId, 
  formData, 
  enabled, 
  interval = 30000 
}: UseAutoSaveProps) => {
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastSavedRef = useRef<string>('');

  useEffect(() => {
    if (!enabled || !userId) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Check if form data has meaningful content
    const hasContent = formData.wineName || formData.producer || formData.country || formData.region;
    if (!hasContent) return;

    // Check if data has changed
    const currentDataString = JSON.stringify(formData);
    if (currentDataString === lastSavedRef.current) return;

    // Set timeout to save
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await draftService.saveDraft(userId, formData);
        lastSavedRef.current = currentDataString;
        console.log('Draft auto-saved');
      } catch (error) {
        console.error('Failed to auto-save draft:', error);
      }
    }, interval);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [userId, formData, enabled, interval]);

  // Manual save function
  const saveNow = async (): Promise<boolean> => {
    if (!userId) return false;

    try {
      await draftService.saveDraft(userId, formData);
      lastSavedRef.current = JSON.stringify(formData);
      return true;
    } catch (error) {
      console.error('Failed to save draft:', error);
      return false;
    }
  };

  return { saveNow };
};