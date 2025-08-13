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
    
    // Setup basic mock responses
    mockDB.objectStoreNames.contains.mockReturnValue(false);
    mockDB.createObjectStore.mockReturnValue({
      createIndex: jest.fn()
    });
  });

  describe('initialization', () => {
    it('should initialize database successfully', async () => {
      // Simulate successful database opening
      setTimeout(() => {
        if (mockRequest.onsuccess) {
          mockRequest.onsuccess();
        }
      }, 0);

      await expect(indexedDBService.initialize()).resolves.toBeUndefined();
      expect(global.indexedDB.open).toHaveBeenCalledWith('MyWineMemoryDB', 1);
    });

    it('should handle database open errors', async () => {
      // Simulate database open error
      setTimeout(() => {
        if (mockRequest.onerror) {
          mockRequest.onerror();
        }
      }, 0);

      await expect(indexedDBService.initialize()).rejects.toThrow('Failed to open IndexedDB');
    });

    it('should create object stores on upgrade', async () => {
      const mockEvent = {
        target: mockRequest
      };

      // Simulate upgrade needed
      setTimeout(() => {
        if (mockRequest.onupgradeneeded) {
          mockRequest.onupgradeneeded(mockEvent);
        }
        if (mockRequest.onsuccess) {
          mockRequest.onsuccess();
        }
      }, 0);

      await indexedDBService.initialize();
      
      expect(mockDB.createObjectStore).toHaveBeenCalledWith('drafts', { keyPath: 'id' });
      expect(mockDB.createObjectStore).toHaveBeenCalledWith('wines_cache', { keyPath: 'id' });
      expect(mockDB.createObjectStore).toHaveBeenCalledWith('tasting_records_cache', { keyPath: 'id' });
      expect(mockDB.createObjectStore).toHaveBeenCalledWith('sync_queue', { keyPath: 'id' });
    });
  });

  describe('draft management', () => {
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

    beforeEach(() => {
      // Mock successful initialization
      mockRequest.onsuccess = jest.fn();
      setTimeout(() => mockRequest.onsuccess(), 0);
    });

    it('should save draft successfully', async () => {
      const mockTransaction = {
        objectStore: jest.fn(() => ({
          put: jest.fn(() => ({
            onsuccess: jest.fn(),
            onerror: jest.fn()
          }))
        }))
      };

      mockDB.transaction.mockReturnValue(mockTransaction);

      // Initialize first
      await indexedDBService.initialize();

      const putRequest = mockTransaction.objectStore().put();
      setTimeout(() => {
        if (putRequest.onsuccess) {
          putRequest.onsuccess();
        }
      }, 0);

      await expect(indexedDBService.saveDraft(mockDraft)).resolves.toBeUndefined();
    });

    it('should get drafts successfully', async () => {
      const mockDrafts = [mockDraft];
      
      const mockTransaction = {
        objectStore: jest.fn(() => ({
          index: jest.fn(() => ({
            getAll: jest.fn(() => ({
              result: mockDrafts,
              onsuccess: jest.fn(),
              onerror: jest.fn()
            }))
          }))
        }))
      };

      mockDB.transaction.mockReturnValue(mockTransaction);

      // Initialize first
      await indexedDBService.initialize();

      const getAllRequest = mockTransaction.objectStore().index().getAll();
      setTimeout(() => {
        if (getAllRequest.onsuccess) {
          getAllRequest.onsuccess();
        }
      }, 0);

      const result = await indexedDBService.getDrafts();
      expect(result).toEqual(mockDrafts);
    });
  });

  describe('wine cache management', () => {
    const mockWines: WineMaster[] = [
      {
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
      }
    ];

    beforeEach(async () => {
      // Initialize database
      setTimeout(() => mockRequest.onsuccess(), 0);
      await indexedDBService.initialize();
    });

    it('should cache wines successfully', async () => {
      const mockTransaction = {
        objectStore: jest.fn(() => ({
          put: jest.fn(() => ({
            onsuccess: jest.fn(),
            onerror: jest.fn()
          }))
        }))
      };

      mockDB.transaction.mockReturnValue(mockTransaction);

      const putRequest = mockTransaction.objectStore().put();
      setTimeout(() => {
        if (putRequest.onsuccess) {
          putRequest.onsuccess();
        }
      }, 0);

      await expect(indexedDBService.cacheWines(mockWines)).resolves.toBeUndefined();
    });

    it('should search cached wines', async () => {
      const mockTransaction = {
        objectStore: jest.fn(() => ({
          getAll: jest.fn(() => ({
            result: mockWines,
            onsuccess: jest.fn(),
            onerror: jest.fn()
          }))
        }))
      };

      mockDB.transaction.mockReturnValue(mockTransaction);

      const getAllRequest = mockTransaction.objectStore().getAll();
      setTimeout(() => {
        if (getAllRequest.onsuccess) {
          getAllRequest.onsuccess();
        }
      }, 0);

      const results = await indexedDBService.searchCachedWines('Test');
      expect(results).toHaveLength(1);
      expect(results[0].wineName).toBe('Test Wine 1');
    });
  });

  describe('storage info', () => {
    it('should get storage info successfully', async () => {
      const mockTransaction = {
        objectStore: jest.fn(() => ({
          count: jest.fn(() => ({
            result: 5,
            onsuccess: jest.fn(),
            onerror: jest.fn()
          }))
        }))
      };

      mockDB.transaction.mockReturnValue(mockTransaction);

      // Initialize first
      setTimeout(() => mockRequest.onsuccess(), 0);
      await indexedDBService.initialize();

      const countRequests = [];
      for (let i = 0; i < 4; i++) {
        const countRequest = mockTransaction.objectStore().count();
        countRequests.push(countRequest);
        setTimeout(() => {
          if (countRequest.onsuccess) {
            countRequest.onsuccess();
          }
        }, 0);
      }

      const info = await indexedDBService.getStorageInfo();
      
      expect(info).toEqual({
        drafts: 5,
        cachedWines: 5,
        cachedRecords: 5,
        syncQueueItems: 5
      });
    });
  });
});