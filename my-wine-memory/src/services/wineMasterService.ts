import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  increment,
  query, 
  where, 
  orderBy, 
  limit as limitQuery,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import type { WineMaster } from '../types';

class WineMasterService {
  // User-scoped collection path: users/{userId}/wines_master
  private getCollectionPath(userId: string): string {
    return `users/${userId}/wines_master`;
  }

  // Create or find existing wine master (within user's scope only)
  async createOrFindWineMaster(data: Omit<WineMaster, 'id' | 'createdAt' | 'createdBy' | 'referenceCount' | 'updatedAt'>, userId: string): Promise<string> {
    try {
      // First, try to find existing wine within USER'S wines only
      const existingWine = await this.findExistingWine(
        data.wineName,
        data.producer,
        data.country,
        data.region,
        data.vintage,
        userId  // Added userId to scope the search
      );

      if (existingWine) {
        // Increment reference count
        await this.incrementReferenceCount(existingWine.id, userId);
        return existingWine.id;
      }

      // Create new wine master
      const wineMasterData: Omit<WineMaster, 'id'> = {
        ...data,
        createdAt: new Date(),
        createdBy: userId,
        referenceCount: 1,
        updatedAt: new Date()
      };

      // Remove undefined fields before sending to Firestore
      const cleanedData = Object.fromEntries(
        Object.entries(wineMasterData).filter(([, value]) => value !== undefined)
      );

      const docRef = await addDoc(collection(db, this.getCollectionPath(userId)), {
        ...cleanedData,
        createdAt: Timestamp.fromDate(wineMasterData.createdAt),
        updatedAt: Timestamp.fromDate(wineMasterData.updatedAt)
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating wine master:', error);
      throw new Error('ワインマスターデータの作成に失敗しました');
    }
  }

  // Find existing wine master to avoid duplicates (within user's scope)
  private async findExistingWine(
    wineName: string,
    producer: string,
    country: string,
    region: string,
    vintage?: number,
    userId: string
  ): Promise<WineMaster | null> {
    try {
      let q = query(
        collection(db, this.getCollectionPath(userId)),
        where('wineName', '==', wineName),
        where('producer', '==', producer),
        where('country', '==', country),
        where('region', '==', region)
      );

      if (vintage) {
        q = query(q, where('vintage', '==', vintage));
      }

      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        } as WineMaster;
      }

      return null;
    } catch (error) {
      console.error('Error finding existing wine:', error);
      return null;
    }
  }

  // Get wine master by ID (requires userId for path)
  async getWineMaster(id: string, userId: string): Promise<WineMaster | null> {
    try {
      const docRef = doc(db, this.getCollectionPath(userId), id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date()
        } as WineMaster;
      }

      return null;
    } catch (error) {
      console.error('Error getting wine master:', error);
      throw new Error('ワイン情報の取得に失敗しました');
    }
  }

  // Batch get wine masters by IDs (max 10 per call due to 'in' limitation)
  async getWineMastersByIds(ids: string[], userId: string): Promise<WineMaster[]> {
    if (ids.length === 0) return [];
    // Filter out undefined, null, and empty string values
    const validIds = ids.filter(id => id && typeof id === 'string' && id.trim() !== '');
    if (validIds.length === 0) return [];
    
    const uniqueIds = Array.from(new Set(validIds));
    const chunks: string[][] = [];
    for (let i = 0; i < uniqueIds.length; i += 10) {
      chunks.push(uniqueIds.slice(i, i + 10));
    }

    const results: WineMaster[] = [];
    for (const chunk of chunks) {
      const q = query(
        collection(db, this.getCollectionPath(userId)),
        where('__name__', 'in', chunk)
      );
      const snap = await getDocs(q);
      snap.docs.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        } as WineMaster);
      });
    }
    return results;
  }

  // Search wine masters (within user's scope)
  async searchWineMasters(searchTerm: string, userId: string, limit: number = 20): Promise<WineMaster[]> {
    try {
      const searches = [
        // Search by wine name
        query(
          collection(db, this.getCollectionPath(userId)),
          where('wineName', '>=', searchTerm),
          where('wineName', '<=', searchTerm + '\uf8ff'),
          orderBy('wineName'),
          limitQuery(limit)
        ),
        // Search by producer
        query(
          collection(db, this.getCollectionPath(userId)),
          where('producer', '>=', searchTerm),
          where('producer', '<=', searchTerm + '\uf8ff'),
          orderBy('producer'),
          limitQuery(limit)
        )
      ];

      const results: WineMaster[] = [];
      const seenIds = new Set<string>();

      for (const search of searches) {
        const snapshot = await getDocs(search);
        snapshot.docs.forEach((doc) => {
          if (!seenIds.has(doc.id)) {
            seenIds.add(doc.id);
            results.push({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate() || new Date(),
              updatedAt: doc.data().updatedAt?.toDate() || new Date()
            } as WineMaster);
          }
        });
      }

      return results;
    } catch (error) {
      console.error('Error searching wine masters:', error);
      return [];
    }
  }

  // Get recent wine masters (within user's scope)
  async getRecentWineMasters(userId: string, limit: number = 10): Promise<WineMaster[]> {
    try {
      const q = query(
        collection(db, this.getCollectionPath(userId)),
        orderBy('createdAt', 'desc'),
        limitQuery(limit)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as WineMaster));
    } catch (error) {
      console.error('Error getting recent wine masters:', error);
      return [];
    }
  }

  // Get popular wine masters (within user's scope - sorted by user's reference count)
  async getPopularWineMasters(userId: string, limit: number = 10): Promise<WineMaster[]> {
    try {
      const q = query(
        collection(db, this.getCollectionPath(userId)),
        orderBy('referenceCount', 'desc'),
        limitQuery(limit)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as WineMaster));
    } catch (error) {
      console.error('Error getting popular wine masters:', error);
      return [];
    }
  }

  // Update wine master
  async updateWineMaster(id: string, userId: string, data: Partial<Omit<WineMaster, 'id' | 'createdAt' | 'createdBy' | 'referenceCount'>>): Promise<void> {
    try {
      const docRef = doc(db, this.getCollectionPath(userId), id);
      
      const updateData = {
        ...data,
        updatedAt: Timestamp.fromDate(new Date())
      };

      // Remove undefined fields
      const cleanedData = Object.fromEntries(
        Object.entries(updateData).filter(([, value]) => value !== undefined)
      );

      await updateDoc(docRef, cleanedData);
    } catch (error) {
      console.error('Error updating wine master:', error);
      throw new Error('ワイン情報の更新に失敗しました');
    }
  }

  // Increment reference count (within user's scope)
  private async incrementReferenceCount(wineId: string, userId: string): Promise<void> {
    try {
      const docRef = doc(db, this.getCollectionPath(userId), wineId);
      await updateDoc(docRef, {
        referenceCount: increment(1),
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error incrementing reference count:', error);
    }
  }

  // Decrement reference count (within user's scope)
  async decrementReferenceCount(wineId: string, userId: string): Promise<void> {
    try {
      const docRef = doc(db, this.getCollectionPath(userId), wineId);
      await updateDoc(docRef, {
        referenceCount: increment(-1),
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error decrementing reference count:', error);
    }
  }

  // Batch update multiple wine masters (within user's scope)
  async batchUpdateWineMasters(updates: { id: string; data: Partial<WineMaster> }[], userId: string): Promise<void> {
    try {
      const batch = writeBatch(db);

      updates.forEach(({ id, data }) => {
        const docRef = doc(db, this.getCollectionPath(userId), id);
        const updateData = {
          ...data,
          updatedAt: Timestamp.fromDate(new Date())
        };

        // Remove undefined fields
        const cleanedData = Object.fromEntries(
          Object.entries(updateData).filter(([, value]) => value !== undefined)
        );

        batch.update(docRef, cleanedData);
      });

      await batch.commit();
    } catch (error) {
      console.error('Error batch updating wine masters:', error);
      throw new Error('ワイン情報の一括更新に失敗しました');
    }
  }
}

export const wineMasterService = new WineMasterService();