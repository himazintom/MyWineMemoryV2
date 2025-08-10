import type { QuizQuestion } from '../types';

interface OfflineDraft {
  id: string;
  type: 'tasting' | 'wine' | 'quiz-progress';
  data: Record<string, unknown>;
  timestamp: Date;
  syncStatus: 'pending' | 'syncing' | 'failed';
}

interface OfflineQuizCache {
  questions: QuizQuestion[];
  difficulty: number;
  lastUpdated: Date;
}

class OfflineService {
  private readonly STORAGE_KEYS = {
    DRAFTS: 'wine-memory-drafts',
    QUIZ_CACHE: 'wine-memory-quiz-cache',
    USER_PROGRESS: 'wine-memory-user-progress',
    IMAGES: 'wine-memory-images',
    SYNC_QUEUE: 'wine-memory-sync-queue'
  };

  // ====== 下書き管理 ======
  
  /**
   * 下書きを保存（自動保存対応）
   */
  saveDraft(type: 'tasting' | 'wine' | 'quiz-progress', data: Record<string, unknown>): string {
    try {
      const drafts = this.getDrafts();
      const draftId = `${type}-${Date.now()}`;
      
      const newDraft: OfflineDraft = {
        id: draftId,
        type,
        data,
        timestamp: new Date(),
        syncStatus: 'pending'
      };

      drafts[draftId] = newDraft;
      
      // 最大5個の下書きを保持（古いものから削除）
      this.limitDrafts(drafts, type, 5);
      
      localStorage.setItem(this.STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
      return draftId;
    } catch (error) {
      console.error('Failed to save draft:', error);
      throw error;
    }
  }

  /**
   * 下書き一覧を取得
   */
  getDrafts(): Record<string, OfflineDraft> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.DRAFTS);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to get drafts:', error);
      return {};
    }
  }

  /**
   * 特定タイプの下書きを取得
   */
  getDraftsByType(type: 'tasting' | 'wine' | 'quiz-progress'): OfflineDraft[] {
    const drafts = this.getDrafts();
    return Object.values(drafts)
      .filter(draft => draft.type === type)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * 下書きを削除
   */
  deleteDraft(draftId: string): void {
    try {
      const drafts = this.getDrafts();
      delete drafts[draftId];
      localStorage.setItem(this.STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  }

  /**
   * 下書きの数を制限
   */
  private limitDrafts(drafts: Record<string, OfflineDraft>, type: string, limit: number): void {
    const typeDrafts = Object.values(drafts)
      .filter(draft => draft.type === type)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (typeDrafts.length > limit) {
      const toDelete = typeDrafts.slice(limit);
      toDelete.forEach(draft => delete drafts[draft.id]);
    }
  }

  // ====== オフラインクイズ ======

  /**
   * クイズ問題をキャッシュ
   */
  cacheQuizQuestions(difficulty: number, questions: QuizQuestion[]): void {
    try {
      const cache: OfflineQuizCache = {
        questions,
        difficulty,
        lastUpdated: new Date()
      };
      
      const key = `${this.STORAGE_KEYS.QUIZ_CACHE}-${difficulty}`;
      localStorage.setItem(key, JSON.stringify(cache));
    } catch (error) {
      console.error('Failed to cache quiz questions:', error);
    }
  }

  /**
   * キャッシュされたクイズ問題を取得
   */
  getCachedQuizQuestions(difficulty: number): QuizQuestion[] | null {
    try {
      const key = `${this.STORAGE_KEYS.QUIZ_CACHE}-${difficulty}`;
      const stored = localStorage.getItem(key);
      
      if (!stored) return null;
      
      const cache: OfflineQuizCache = JSON.parse(stored);
      const daysSinceUpdate = (Date.now() - new Date(cache.lastUpdated).getTime()) / (1000 * 60 * 60 * 24);
      
      // 7日以上古いキャッシュは無効
      if (daysSinceUpdate > 7) {
        localStorage.removeItem(key);
        return null;
      }
      
      return cache.questions;
    } catch (error) {
      console.error('Failed to get cached quiz questions:', error);
      return null;
    }
  }

  /**
   * 利用可能な難易度一覧を取得
   */
  getAvailableOfflineDifficulties(): number[] {
    const difficulties: number[] = [];
    
    for (let i = 1; i <= 10; i++) {
      const key = `${this.STORAGE_KEYS.QUIZ_CACHE}-${i}`;
      if (localStorage.getItem(key)) {
        difficulties.push(i);
      }
    }
    
    return difficulties;
  }

  // ====== 画像キャッシュ ======

  /**
   * 画像をキャッシュ（Base64形式）
   */
  async cacheImage(imageUrl: string, imageBlob: Blob): Promise<void> {
    try {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          try {
            const images = this.getCachedImages();
            images[imageUrl] = {
              data: reader.result as string,
              timestamp: new Date(),
              size: imageBlob.size
            };
            
            localStorage.setItem(this.STORAGE_KEYS.IMAGES, JSON.stringify(images));
            resolve();
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageBlob);
      });
    } catch (error) {
      console.error('Failed to cache image:', error);
    }
  }

  /**
   * キャッシュされた画像を取得
   */
  getCachedImage(imageUrl: string): string | null {
    try {
      const images = this.getCachedImages();
      const cached = images[imageUrl];
      
      if (!cached) return null;
      
      // 30日以上古いキャッシュは削除
      const daysSinceCache = (Date.now() - new Date(cached.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceCache > 30) {
        delete images[imageUrl];
        localStorage.setItem(this.STORAGE_KEYS.IMAGES, JSON.stringify(images));
        return null;
      }
      
      return cached.data;
    } catch (error) {
      console.error('Failed to get cached image:', error);
      return null;
    }
  }

  private getCachedImages(): Record<string, { data: string; timestamp: Date; size: number }> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.IMAGES);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to get cached images:', error);
      return {};
    }
  }

  // ====== 同期キュー ======

  /**
   * 同期待ちアイテムをキューに追加
   */
  addToSyncQueue(type: string, data: Record<string, unknown>): void {
    try {
      const queue = this.getSyncQueue();
      const item = {
        id: `${type}-${Date.now()}`,
        type,
        data,
        timestamp: new Date(),
        retryCount: 0
      };
      
      queue.push(item);
      localStorage.setItem(this.STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to add to sync queue:', error);
    }
  }

  /**
   * 同期キューを取得
   */
  getSyncQueue(): Array<{
    id: string;
    type: string;
    data: Record<string, unknown>;
    timestamp: Date;
    retryCount: number;
  }> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.SYNC_QUEUE);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get sync queue:', error);
      return [];
    }
  }

  /**
   * 同期キューから項目を削除
   */
  removeFromSyncQueue(itemId: string): void {
    try {
      const queue = this.getSyncQueue();
      const filtered = queue.filter(item => item.id !== itemId);
      localStorage.setItem(this.STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove from sync queue:', error);
    }
  }

  // ====== ユーティリティ ======

  /**
   * オフライン状態を確認
   */
  isOffline(): boolean {
    return !navigator.onLine;
  }

  /**
   * ストレージ使用量を取得
   */
  getStorageUsage(): {
    drafts: number;
    quizCache: number;
    images: number;
    syncQueue: number;
    total: number;
  } {
    const getSize = (key: string) => {
      const item = localStorage.getItem(key);
      return item ? new Blob([item]).size : 0;
    };

    const drafts = getSize(this.STORAGE_KEYS.DRAFTS);
    const syncQueue = getSize(this.STORAGE_KEYS.SYNC_QUEUE);
    const images = getSize(this.STORAGE_KEYS.IMAGES);
    
    let quizCache = 0;
    for (let i = 1; i <= 10; i++) {
      quizCache += getSize(`${this.STORAGE_KEYS.QUIZ_CACHE}-${i}`);
    }

    return {
      drafts,
      quizCache,
      images,
      syncQueue,
      total: drafts + quizCache + images + syncQueue
    };
  }

  /**
   * キャッシュをクリア
   */
  clearCache(type?: 'drafts' | 'quiz' | 'images' | 'sync'): void {
    try {
      if (!type || type === 'drafts') {
        localStorage.removeItem(this.STORAGE_KEYS.DRAFTS);
      }
      if (!type || type === 'quiz') {
        for (let i = 1; i <= 10; i++) {
          localStorage.removeItem(`${this.STORAGE_KEYS.QUIZ_CACHE}-${i}`);
        }
      }
      if (!type || type === 'images') {
        localStorage.removeItem(this.STORAGE_KEYS.IMAGES);
      }
      if (!type || type === 'sync') {
        localStorage.removeItem(this.STORAGE_KEYS.SYNC_QUEUE);
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }
}

export const offlineService = new OfflineService();