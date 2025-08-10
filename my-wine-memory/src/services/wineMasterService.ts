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
  private readonly collection = 'wines_master';

  // Create or find existing wine master
  async createOrFindWineMaster(data: Omit<WineMaster, 'id' | 'createdAt' | 'createdBy' | 'referenceCount' | 'updatedAt'>, userId: string): Promise<string> {
    try {
      // First, try to find existing wine with same basic info
      const existingWine = await this.findExistingWine(
        data.wineName,
        data.producer,
        data.country,
        data.region,
        data.vintage
      );

      if (existingWine) {
        // Increment reference count
        await this.incrementReferenceCount(existingWine.id);
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
        Object.entries(wineMasterData).filter(([_, value]) => value !== undefined)
      );

      const docRef = await addDoc(collection(db, this.collection), {
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

  // Find existing wine with similar basic information
  private async findExistingWine(
    wineName: string,
    producer: string,
    country: string,
    region: string,
    vintage?: number
  ): Promise<WineMaster | null> {
    try {
      let q = query(
        collection(db, this.collection),
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

  // Get wine master by ID
  async getWineMaster(id: string): Promise<WineMaster | null> {
    try {
      const docRef = doc(db, this.collection, id);
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
  async getWineMastersByIds(ids: string[]): Promise<WineMaster[]> {
    if (ids.length === 0) return [];
    const uniqueIds = Array.from(new Set(ids));
    const chunks: string[][] = [];
    for (let i = 0; i < uniqueIds.length; i += 10) {
      chunks.push(uniqueIds.slice(i, i + 10));
    }

    const results: WineMaster[] = [];
    for (const chunk of chunks) {
      const q = query(
        collection(db, this.collection),
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

  // Search wine masters
  async searchWineMasters(searchTerm: string, limit: number = 20): Promise<WineMaster[]> {
    try {
      const searches = [
        // Search by wine name
        query(
          collection(db, this.collection),
          where('wineName', '>=', searchTerm),
          where('wineName', '<=', searchTerm + '\uf8ff'),
          orderBy('wineName'),
          limitQuery(limit)
        ),
        // Search by producer
        query(
          collection(db, this.collection),
          where('producer', '>=', searchTerm),
          where('producer', '<=', searchTerm + '\uf8ff'),
          orderBy('producer'),
          limitQuery(limit)
        )
      ];

      const results: WineMaster[] = [];
      const seenIds = new Set<string>();

      for (const q of searches) {
        const querySnapshot = await getDocs(q);
        
        querySnapshot.docs.forEach((doc) => {
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

      // Sort by reference count (popularity) and limit results
      return results
        .sort((a, b) => b.referenceCount - a.referenceCount)
        .slice(0, limit);
    } catch (error) {
      console.error('Error searching wine masters:', error);
      throw new Error('ワインの検索に失敗しました');
    }
  }

  // Get popular wines
  async getPopularWines(limit: number = 10): Promise<WineMaster[]> {
    try {
      const q = query(
        collection(db, this.collection),
        orderBy('referenceCount', 'desc'),
        limitQuery(limit)
      );

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as WineMaster));
    } catch (error) {
      console.error('Error getting popular wines:', error);
      throw new Error('人気ワインの取得に失敗しました');
    }
  }

  // Get wines by country
  async getWinesByCountry(country: string, limit: number = 20): Promise<WineMaster[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('country', '==', country),
        orderBy('referenceCount', 'desc'),
        limitQuery(limit)
      );

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as WineMaster));
    } catch (error) {
      console.error('Error getting wines by country:', error);
      throw new Error('国別ワインの取得に失敗しました');
    }
  }

  // Update wine master data
  async updateWineMaster(id: string, data: Partial<Omit<WineMaster, 'id' | 'createdAt' | 'createdBy' | 'referenceCount'>>): Promise<void> {
    try {
      const docRef = doc(db, this.collection, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error updating wine master:', error);
      throw new Error('ワイン情報の更新に失敗しました');
    }
  }

  // Increment reference count
  private async incrementReferenceCount(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collection, id);
      await updateDoc(docRef, {
        referenceCount: increment(1),
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error incrementing reference count:', error);
      // Don't throw error here, as this is not critical
    }
  }

  // Batch operations for data migration
  // Create new wine master without checking for existing
  async createWineMaster(data: Omit<WineMaster, 'id' | 'createdAt' | 'createdBy' | 'referenceCount' | 'updatedAt'>, userId: string): Promise<WineMaster> {
    try {
      const wineMasterData: Omit<WineMaster, 'id'> = {
        ...data,
        createdAt: new Date(),
        createdBy: userId,
        referenceCount: 1,
        updatedAt: new Date()
      };

      // Remove undefined fields before sending to Firestore
      const cleanedData = Object.fromEntries(
        Object.entries(wineMasterData).filter(([_, value]) => value !== undefined)
      );

      const docRef = await addDoc(collection(db, this.collection), {
        ...cleanedData,
        createdAt: Timestamp.fromDate(wineMasterData.createdAt),
        updatedAt: Timestamp.fromDate(wineMasterData.updatedAt)
      });

      return {
        id: docRef.id,
        ...wineMasterData
      };
    } catch (error) {
      console.error('Error creating wine master:', error);
      throw new Error('ワインマスターの作成に失敗しました');
    }
  }

  async batchCreateWineMasters(wines: Omit<WineMaster, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      const now = Timestamp.fromDate(new Date());

      wines.forEach((wine) => {
        const docRef = doc(collection(db, this.collection));
        batch.set(docRef, {
          ...wine,
          createdAt: now,
          updatedAt: now
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error batch creating wine masters:', error);
      throw new Error('ワインマスターデータの一括作成に失敗しました');
    }
  }
}

export const wineMasterService = new WineMasterService();