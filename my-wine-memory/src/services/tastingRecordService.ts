import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit as limitQuery,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import type { TastingRecord, WineRecord } from '../types';
import { wineMasterService } from './wineMasterService';

class TastingRecordService {
  private readonly collection = 'tasting_records';

  // Create new tasting record
  async createTastingRecord(
    userId: string, 
    data: Omit<TastingRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const tastingData: Omit<TastingRecord, 'id'> = {
        userId,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, this.collection), {
        ...tastingData,
        tastingDate: Timestamp.fromDate(tastingData.tastingDate),
        createdAt: Timestamp.fromDate(tastingData.createdAt),
        updatedAt: Timestamp.fromDate(tastingData.updatedAt)
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating tasting record:', error);
      throw new Error('テイスティング記録の作成に失敗しました');
    }
  }

  // Get tasting record by ID
  async getTastingRecord(id: string): Promise<TastingRecord | null> {
    try {
      const docRef = doc(db, this.collection, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          tastingDate: docSnap.data().tastingDate?.toDate() || new Date(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date()
        } as TastingRecord;
      }

      return null;
    } catch (error) {
      console.error('Error getting tasting record:', error);
      throw new Error('テイスティング記録の取得に失敗しました');
    }
  }

  // Get user's tasting records
  async getUserTastingRecords(
    userId: string, 
    sortBy: 'date' | 'rating' = 'date',
    limit: number = 50
  ): Promise<TastingRecord[]> {
    try {
      let q = query(
        collection(db, this.collection),
        where('userId', '==', userId)
      );

      // Add sorting
      switch (sortBy) {
        case 'date':
          q = query(q, orderBy('tastingDate', 'desc'));
          break;
        case 'rating':
          q = query(q, orderBy('overallRating', 'desc'));
          break;
      }

      q = query(q, limitQuery(limit));

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        tastingDate: doc.data().tastingDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as TastingRecord));
    } catch (error) {
      console.error('Error getting user tasting records:', error);
      throw new Error('ユーザーのテイスティング記録取得に失敗しました');
    }
  }

  // Get tasting records for specific wine (current user only)
  async getTastingRecordsForWine(userId: string, wineId: string, limit: number = 20): Promise<TastingRecord[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('userId', '==', userId),
        where('wineId', '==', wineId),
        orderBy('tastingDate', 'desc'),
        limitQuery(limit)
      );

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        tastingDate: doc.data().tastingDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as TastingRecord));
    } catch (error) {
      console.error('Error getting tasting records for wine:', error);
      throw new Error('ワインのテイスティング記録取得に失敗しました');
    }
  }

  // Get user's tasting records with wine info (for display)
  async getUserTastingRecordsWithWineInfo(
    userId: string, 
    sortBy: 'date' | 'rating' = 'date',
    limit: number = 50
  ): Promise<WineRecord[]> {
    try {
      const tastingRecords = await this.getUserTastingRecords(userId, sortBy, limit);
      const wineRecords: WineRecord[] = [];

      // Get wine master info for each tasting record
      for (const record of tastingRecords) {
        const wineMaster = await wineMasterService.getWineMaster(record.wineId);
        
        if (wineMaster) {
          const wineRecord: WineRecord = {
            ...record,
            // Wine master data
            wineName: wineMaster.wineName,
            producer: wineMaster.producer,
            country: wineMaster.country,
            region: wineMaster.region,
            vintage: wineMaster.vintage,
            grapeVarieties: wineMaster.grapeVarieties,
            wineType: wineMaster.wineType,
            alcoholContent: wineMaster.alcoholContent
          };
          wineRecords.push(wineRecord);
        }
      }

      return wineRecords;
    } catch (error) {
      console.error('Error getting user tasting records with wine info:', error);
      throw new Error('ワイン情報付きテイスティング記録の取得に失敗しました');
    }
  }

  // Update tasting record
  async updateTastingRecord(
    id: string, 
    data: Partial<Omit<TastingRecord, 'id' | 'userId' | 'wineId' | 'createdAt'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.collection, id);
      const updateData: Record<string, unknown> = {
        ...data,
        updatedAt: Timestamp.fromDate(new Date())
      };

      // Convert Date objects to Timestamps
      if (data.tastingDate) {
        updateData.tastingDate = Timestamp.fromDate(data.tastingDate);
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating tasting record:', error);
      throw new Error('テイスティング記録の更新に失敗しました');
    }
  }

  // Delete tasting record
  async deleteTastingRecord(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collection, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting tasting record:', error);
      throw new Error('テイスティング記録の削除に失敗しました');
    }
  }

  // Upload wine image
  async uploadWineImage(imageFile: File, userId: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileName = `wine-images/${userId}/${timestamp}_${imageFile.name}`;
      const storageRef = ref(storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading wine image:', error);
      throw new Error('画像のアップロードに失敗しました');
    }
  }

  // Get tasting statistics for user
  async getTastingStatistics(userId: string): Promise<{
    totalRecords: number;
    averageRating: number;
    winesByCountry: { [country: string]: number };
    recentActivity: TastingRecord[];
  }> {
    try {
      const allRecords = await this.getUserTastingRecords(userId, 'date', 1000);
      
      const totalRecords = allRecords.length;
      const averageRating = totalRecords > 0 
        ? allRecords.reduce((sum, record) => sum + record.overallRating, 0) / totalRecords 
        : 0;

      // Get wine info to calculate country distribution
      const winesByCountry: { [country: string]: number } = {};
      for (const record of allRecords) {
        const wineMaster = await wineMasterService.getWineMaster(record.wineId);
        if (wineMaster?.country) {
          winesByCountry[wineMaster.country] = (winesByCountry[wineMaster.country] || 0) + 1;
        }
      }

      const recentActivity = allRecords.slice(0, 10);

      return {
        totalRecords,
        averageRating: Math.round(averageRating * 10) / 10,
        winesByCountry,
        recentActivity
      };
    } catch (error) {
      console.error('Error getting tasting statistics:', error);
      throw new Error('統計情報の取得に失敗しました');
    }
  }

  // Search tasting records
  async searchTastingRecords(
    userId: string,
    filters: {
      minRating?: number;
      maxRating?: number;
      startDate?: Date;
      endDate?: Date;
      recordMode?: 'quick' | 'detailed';
    } = {},
    limit: number = 50
  ): Promise<WineRecord[]> {
    try {
      let q = query(
        collection(db, this.collection),
        where('userId', '==', userId),
        orderBy('tastingDate', 'desc')
      );

      // Apply filters
      if (filters.minRating !== undefined) {
        q = query(q, where('overallRating', '>=', filters.minRating));
      }
      if (filters.maxRating !== undefined) {
        q = query(q, where('overallRating', '<=', filters.maxRating));
      }
      if (filters.recordMode) {
        q = query(q, where('recordMode', '==', filters.recordMode));
      }

      q = query(q, limitQuery(limit));

      const querySnapshot = await getDocs(q);
      const tastingRecords = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        tastingDate: doc.data().tastingDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as TastingRecord));

      // Filter by date range (client-side due to Firestore limitations with multiple inequalities)
      const filteredRecords = tastingRecords.filter(record => {
        if (filters.startDate && record.tastingDate < filters.startDate) return false;
        if (filters.endDate && record.tastingDate > filters.endDate) return false;
        return true;
      });

      // Get wine master info for each record
      const wineRecords: WineRecord[] = [];
      for (const record of filteredRecords) {
        const wineMaster = await wineMasterService.getWineMaster(record.wineId);
        
        if (wineMaster) {
          const wineRecord: WineRecord = {
            ...record,
            wineName: wineMaster.wineName,
            producer: wineMaster.producer,
            country: wineMaster.country,
            region: wineMaster.region,
            vintage: wineMaster.vintage,
            grapeVarieties: wineMaster.grapeVarieties,
            wineType: wineMaster.wineType,
            alcoholContent: wineMaster.alcoholContent
          };
          wineRecords.push(wineRecord);
        }
      }

      return wineRecords;
    } catch (error) {
      console.error('Error searching tasting records:', error);
      throw new Error('テイスティング記録の検索に失敗しました');
    }
  }
}

export const tastingRecordService = new TastingRecordService();