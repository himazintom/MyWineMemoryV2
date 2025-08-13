/**
 * IndexedDB Service for offline data storage
 * Stores draft tasting records and wine data for offline access
 */

import { TastingRecord, WineMaster } from '../types';

const DB_NAME = 'MyWineMemoryDB';
const DB_VERSION = 1;

// Store names
const STORES = {
  DRAFTS: 'drafts',
  WINES: 'wines_cache',
  TASTING_RECORDS: 'tasting_records_cache',
  SYNC_QUEUE: 'sync_queue'
} as const;

export interface DraftRecord {
  id: string;
  data: Partial<TastingRecord>;
  lastModified: number;
  wineId?: string;
  wineName?: string;
}

export interface SyncQueueItem {
  id: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  collection: 'tasting_records' | 'wines_master';
  data: any;
  timestamp: number;
}

class IndexedDBService {
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Drafts store
        if (!db.objectStoreNames.contains(STORES.DRAFTS)) {
          const draftsStore = db.createObjectStore(STORES.DRAFTS, { keyPath: 'id' });
          draftsStore.createIndex('lastModified', 'lastModified');
        }

        // Wine cache store
        if (!db.objectStoreNames.contains(STORES.WINES)) {
          const winesStore = db.createObjectStore(STORES.WINES, { keyPath: 'id' });
          winesStore.createIndex('wineName', 'wineName');
          winesStore.createIndex('producer', 'producer');
        }

        // Tasting records cache store
        if (!db.objectStoreNames.contains(STORES.TASTING_RECORDS)) {
          const recordsStore = db.createObjectStore(STORES.TASTING_RECORDS, { keyPath: 'id' });
          recordsStore.createIndex('userId', 'userId');
          recordsStore.createIndex('wineId', 'wineId');
          recordsStore.createIndex('tastingDate', 'tastingDate');
        }

        // Sync queue store for offline changes
        if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
          const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id' });
          syncStore.createIndex('timestamp', 'timestamp');
        }
      };
    });
  }

  // Draft management
  async saveDraft(draft: DraftRecord): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.DRAFTS], 'readwrite');
      const store = transaction.objectStore(STORES.DRAFTS);
      
      const request = store.put({
        ...draft,
        lastModified: Date.now()
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to save draft'));
    });
  }

  async getDrafts(): Promise<DraftRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.DRAFTS], 'readonly');
      const store = transaction.objectStore(STORES.DRAFTS);
      const index = store.index('lastModified');
      
      const request = index.getAll();

      request.onsuccess = () => {
        // Return sorted by last modified (newest first)
        const drafts = request.result.sort((a, b) => b.lastModified - a.lastModified);
        resolve(drafts.slice(0, 5)); // Max 5 drafts
      };
      request.onerror = () => reject(new Error('Failed to get drafts'));
    });
  }

  async deleteDraft(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.DRAFTS], 'readwrite');
      const store = transaction.objectStore(STORES.DRAFTS);
      
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete draft'));
    });
  }

  // Wine cache management
  async cacheWines(wines: WineMaster[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.WINES], 'readwrite');
      const store = transaction.objectStore(STORES.WINES);
      
      let completed = 0;
      const total = wines.length;

      if (total === 0) {
        resolve();
        return;
      }

      wines.forEach(wine => {
        const request = store.put(wine);
        request.onsuccess = () => {
          completed++;
          if (completed === total) resolve();
        };
        request.onerror = () => reject(new Error('Failed to cache wine'));
      });
    });
  }

  async getCachedWines(): Promise<WineMaster[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.WINES], 'readonly');
      const store = transaction.objectStore(STORES.WINES);
      
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to get cached wines'));
    });
  }

  async searchCachedWines(query: string): Promise<WineMaster[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.WINES], 'readonly');
      const store = transaction.objectStore(STORES.WINES);
      
      const request = store.getAll();

      request.onsuccess = () => {
        const wines = request.result;
        const filtered = wines.filter(wine => 
          wine.wineName.toLowerCase().includes(query.toLowerCase()) ||
          wine.producer.toLowerCase().includes(query.toLowerCase()) ||
          wine.country.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      };
      request.onerror = () => reject(new Error('Failed to search cached wines'));
    });
  }

  // Tasting records cache
  async cacheTastingRecords(records: TastingRecord[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.TASTING_RECORDS], 'readwrite');
      const store = transaction.objectStore(STORES.TASTING_RECORDS);
      
      let completed = 0;
      const total = records.length;

      if (total === 0) {
        resolve();
        return;
      }

      records.forEach(record => {
        const request = store.put(record);
        request.onsuccess = () => {
          completed++;
          if (completed === total) resolve();
        };
        request.onerror = () => reject(new Error('Failed to cache tasting record'));
      });
    });
  }

  async getCachedTastingRecords(userId: string): Promise<TastingRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.TASTING_RECORDS], 'readonly');
      const store = transaction.objectStore(STORES.TASTING_RECORDS);
      const index = store.index('userId');
      
      const request = index.getAll(userId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to get cached tasting records'));
    });
  }

  // Sync queue management for offline operations
  async addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const queueItem: SyncQueueItem = {
      ...item,
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.SYNC_QUEUE], 'readwrite');
      const store = transaction.objectStore(STORES.SYNC_QUEUE);
      
      const request = store.add(queueItem);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to add to sync queue'));
    });
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.SYNC_QUEUE], 'readonly');
      const store = transaction.objectStore(STORES.SYNC_QUEUE);
      const index = store.index('timestamp');
      
      const request = index.getAll();

      request.onsuccess = () => {
        // Sort by timestamp (oldest first)
        const items = request.result.sort((a, b) => a.timestamp - b.timestamp);
        resolve(items);
      };
      request.onerror = () => reject(new Error('Failed to get sync queue'));
    });
  }

  async removeSyncQueueItem(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.SYNC_QUEUE], 'readwrite');
      const store = transaction.objectStore(STORES.SYNC_QUEUE);
      
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to remove sync queue item'));
    });
  }

  // Utility methods
  async clearCache(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const stores = [STORES.WINES, STORES.TASTING_RECORDS];
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(stores, 'readwrite');
      let completed = 0;

      stores.forEach(storeName => {
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        
        request.onsuccess = () => {
          completed++;
          if (completed === stores.length) resolve();
        };
        request.onerror = () => reject(new Error(`Failed to clear ${storeName}`));
      });
    });
  }

  async getStorageInfo(): Promise<{
    drafts: number;
    cachedWines: number;
    cachedRecords: number;
    syncQueueItems: number;
  }> {
    if (!this.db) throw new Error('Database not initialized');

    const counts = {
      drafts: 0,
      cachedWines: 0,
      cachedRecords: 0,
      syncQueueItems: 0
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(Object.values(STORES), 'readonly');
      let completed = 0;
      const total = Object.keys(STORES).length;

      Object.values(STORES).forEach((storeName, index) => {
        const store = transaction.objectStore(storeName);
        const request = store.count();

        request.onsuccess = () => {
          const key = Object.keys(counts)[index] as keyof typeof counts;
          counts[key] = request.result;
          completed++;
          if (completed === total) resolve(counts);
        };
        request.onerror = () => reject(new Error('Failed to get storage info'));
      });
    });
  }
}

// Export singleton instance
export const indexedDBService = new IndexedDBService();