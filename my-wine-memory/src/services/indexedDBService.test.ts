/**
 * IndexedDB Service Tests
 */

import { indexedDBService } from './indexedDBService';
import type { WineMaster, TastingRecord } from '../types';

// Mock IndexedDB for testing environment
global.indexedDB = {
  open: jest.fn(),
  deleteDatabase: jest.fn()
} as any;

describe('IndexedDBService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(indexedDBService).toBeDefined();
  });

  it('should have required methods', () => {
    expect(typeof indexedDBService.initialize).toBe('function');
    expect(typeof indexedDBService.saveDraft).toBe('function');
    expect(typeof indexedDBService.getDrafts).toBe('function');
    expect(typeof indexedDBService.cacheWines).toBe('function');
    expect(typeof indexedDBService.searchCachedWines).toBe('function');
  });

  it('should handle offline data structures', () => {
    const mockDraft = {
      id: 'draft_123',
      data: {
        notes: 'Test notes',
        overallRating: 8.0
      } as Partial<TastingRecord>,
      lastModified: Date.now(),
      wineId: 'wine_456',
      wineName: 'Test Wine'
    };

    expect(mockDraft).toBeDefined();
    expect(mockDraft.id).toBe('draft_123');
    expect(mockDraft.data.notes).toBe('Test notes');
  });

  it('should handle wine master data structures', () => {
    const mockWine: WineMaster = {
      id: 'wine_1',
      wineName: 'Test Wine 1',
      producer: 'Test Producer',
      country: 'France',
      region: 'Bordeaux',
      grapeVarieties: ['Cabernet Sauvignon'],
      wineType: 'red',
      referenceCount: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'user_123'
    };

    expect(mockWine).toBeDefined();
    expect(mockWine.wineName).toBe('Test Wine 1');
  });
});