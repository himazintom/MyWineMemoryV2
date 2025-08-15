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
import type { TastingRecord, WineRecord, PublicWineRecord } from '../types';

class TastingRecordService {
  private readonly collection = 'tasting_records';

  // Search existing wines by user
  async searchUserWines(userId: string, searchTerm: string, limit: number = 20): Promise<TastingRecord[]> {
    try {
      const searches = [
        // Search by wine name
        query(
          collection(db, this.collection),
          where('userId', '==', userId),
          where('wineName', '>=', searchTerm),
          where('wineName', '<=', searchTerm + '\uf8ff'),
          orderBy('wineName'),
          limitQuery(limit)
        ),
        // Search by producer
        query(
          collection(db, this.collection),
          where('userId', '==', userId),
          where('producer', '>=', searchTerm),
          where('producer', '<=', searchTerm + '\uf8ff'),
          orderBy('producer'),
          limitQuery(limit)
        )
      ];

      const results: TastingRecord[] = [];
      const seenWines = new Set<string>();

      for (const q of searches) {
        const querySnapshot = await getDocs(q);
        
        querySnapshot.docs.forEach((doc) => {
          const record = {
            id: doc.id,
            ...doc.data(),
            tastingDate: doc.data().tastingDate?.toDate() || new Date(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date()
          } as TastingRecord;
          
          const wineKey = `${record.wineName}-${record.producer}`;
          if (!seenWines.has(wineKey)) {
            seenWines.add(wineKey);
            results.push(record);
          }
        });
      }

      // Return unique wines sorted by wine name
      return results
        .sort((a, b) => a.wineName.localeCompare(b.wineName))
        .slice(0, limit);
    } catch (error) {
      console.error('Error searching user wines:', error);
      throw new Error('ワインの検索に失敗しました');
    }
  }

  // Get popular wines for user (most recorded)
  async getUserPopularWines(userId: string, limit: number = 10): Promise<{wineName: string; producer: string; count: number; lastRecord: TastingRecord}[]> {
    try {
      const allRecords = await this.getUserTastingRecords(userId, 'date', 1000);
      
      const wineGroups: { [key: string]: TastingRecord[] } = {};
      
      allRecords.forEach(record => {
        const wineKey = `${record.wineName}-${record.producer}`;
        if (!wineGroups[wineKey]) {
          wineGroups[wineKey] = [];
        }
        wineGroups[wineKey].push(record);
      });

      const popularWines = Object.entries(wineGroups)
        .map(([, records]) => ({
          wineName: records[0].wineName,
          producer: records[0].producer,
          count: records.length,
          lastRecord: records[0] // Already sorted by date desc
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

      return popularWines;
    } catch (error) {
      console.error('Error getting user popular wines:', error);
      return [];
    }
  }

  // Get unique wines for user
  async getUserUniqueWines(userId: string): Promise<{wineName: string; producer: string; country: string; region: string; vintage?: number}[]> {
    try {
      const allRecords = await this.getUserTastingRecords(userId, 'date', 1000);
      
      const uniqueWines = new Map<string, TastingRecord>();
      
      allRecords.forEach(record => {
        const wineKey = `${record.wineName}-${record.producer}`;
        if (!uniqueWines.has(wineKey)) {
          uniqueWines.set(wineKey, record);
        }
      });

      return Array.from(uniqueWines.values()).map(record => ({
        wineName: record.wineName,
        producer: record.producer,
        country: record.country,
        region: record.region,
        vintage: record.vintage
      }));
    } catch (error) {
      console.error('Error getting unique wines:', error);
      return [];
    }
  }

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

      // Convert tastingDate string to Date - temporarily disable validation
      const tastingDate = new Date(tastingData.tastingDate);
      const validTastingDate = isNaN(tastingDate.getTime()) ? new Date() : tastingDate;

      const firestoreData = {
        ...tastingData,
        tastingDate: Timestamp.fromDate(validTastingDate),
        createdAt: Timestamp.fromDate(tastingData.createdAt),
        updatedAt: Timestamp.fromDate(tastingData.updatedAt)
      };

      // Debug log for troubleshooting
      console.log('Creating tasting record with data:', {
        userId: firestoreData.userId,
        wineName: firestoreData.wineName,
        producer: firestoreData.producer,
        overallRating: firestoreData.overallRating,
        recordMode: firestoreData.recordMode,
        tastingDate: validTastingDate.toISOString(),
        hasImages: !!firestoreData.images,
        hasDetailedAnalysis: !!firestoreData.detailedAnalysis
      });

      const docRef = await addDoc(collection(db, this.collection), firestoreData);

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
  async getTastingRecordsForWine(userId: string, wineName: string, producer: string, limit: number = 20): Promise<TastingRecord[]> {
    try {
      const q = query(
        collection(db, this.collection),
        where('userId', '==', userId),
        where('wineName', '==', wineName),
        where('producer', '==', producer),
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
      
      // TastingRecord already contains all wine info, just return as WineRecord
      return tastingRecords as WineRecord[];
    } catch (error) {
      console.error('Error getting user tasting records with wine info:', error);
      // Return empty array instead of throwing error to prevent UI crashes
      return [];
    }
  }

  // Update tasting record
  async updateTastingRecord(
    id: string, 
    data: Partial<Omit<TastingRecord, 'id' | 'userId' | 'createdAt'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.collection, id);
      const updateData: Record<string, unknown> = {
        ...data,
        updatedAt: Timestamp.fromDate(new Date())
      };

      // Convert tastingDate to Timestamp if provided
      if (data.tastingDate) {
        const tastingDate = new Date(data.tastingDate);
        const now = new Date();
        const validTastingDate = (isNaN(tastingDate.getTime()) || tastingDate > now) ? now : tastingDate;
        updateData.tastingDate = Timestamp.fromDate(validTastingDate);
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

  // Helper function to retry operations
  private async retry<T>(operation: () => Promise<T>, maxRetries: number = 3, delay: number = 1000): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        
        console.warn(`Upload attempt ${attempt} failed, retrying in ${delay}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
    throw new Error('Max retries exceeded');
  }

  // Optimize image to WebP format
  private async optimizeImage(imageFile: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        const { width, height } = img;
        const aspectRatio = width / height;
        
        let newWidth = width;
        let newHeight = height;
        
        if (width > maxWidth) {
          newWidth = maxWidth;
          newHeight = maxWidth / aspectRatio;
        }
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const optimizedFile = new File([blob], `${imageFile.name.split('.')[0]}.webp`, {
              type: 'image/webp'
            });
            resolve(optimizedFile);
          } else {
            reject(new Error('画像の最適化に失敗しました'));
          }
        }, 'image/webp', quality);
      };
      
      img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
      img.src = URL.createObjectURL(imageFile);
    });
  }

  // Upload wine image
  async uploadWineImage(imageFile: File, userId: string): Promise<string> {
    return this.retry(async () => {
      // Optimize image to WebP if it's not already WebP
      let fileToUpload = imageFile;
      if (!imageFile.type.includes('webp') && imageFile.type.startsWith('image/')) {
        try {
          fileToUpload = await this.optimizeImage(imageFile);
          console.log(`Image optimized: ${imageFile.size} bytes -> ${fileToUpload.size} bytes`);
        } catch (optimizationError) {
          console.warn('Image optimization failed, uploading original:', optimizationError);
          fileToUpload = imageFile;
        }
      }
      
      const timestamp = Date.now();
      // Sanitize filename to avoid special characters
      const sanitizedFileName = fileToUpload.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `wine-images/${userId}/${timestamp}_${sanitizedFileName}`;
      const storageRef = ref(storage, fileName);
      
      // Add metadata to help with CORS
      const metadata = {
        contentType: fileToUpload.type,
        customMetadata: {
          'uploadedBy': userId,
          'uploadedAt': new Date().toISOString()
        }
      };
      
      const snapshot = await uploadBytes(storageRef, fileToUpload, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Use alternative URL format to avoid CORS issues
      const bucketName = 'mywinememory-4bdf9.firebasestorage.app';
      const encodedPath = encodeURIComponent(fileName);
      const alternativeURL = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media`;
      
      // Try to verify the alternative URL is accessible
      try {
        const response = await fetch(alternativeURL, { method: 'HEAD' });
        if (response.ok) {
          return alternativeURL;
        }
      } catch (error) {
        console.warn('Alternative URL verification failed, using standard URL:', error);
      }
      
      return downloadURL;
    }).catch((error) => {
      console.error('Error uploading wine image after retries:', error);
      
      // More specific error handling
      if (error instanceof Error) {
        if (error.message.includes('CORS')) {
          throw new Error('画像のアップロードでCORSエラーが発生しました。しばらく待ってから再度お試しください。');
        } else if (error.message.includes('network')) {
          throw new Error('ネットワークエラーが発生しました。インターネット接続を確認してください。');
        } else if (error.message.includes('permission')) {
          throw new Error('画像アップロードの権限がありません。ログインし直してください。');
        }
      }
      
      throw new Error('画像のアップロードに失敗しました。ファイルサイズが大きすぎるか、一時的な問題が発生している可能性があります。');
    });
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

      // Calculate country distribution from records directly
      const winesByCountry: { [country: string]: number } = {};
      for (const record of allRecords) {
        if (record.country) {
          winesByCountry[record.country] = (winesByCountry[record.country] || 0) + 1;
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
      // Return empty statistics instead of throwing error
      return {
        totalRecords: 0,
        averageRating: 0,
        winesByCountry: {},
        recentActivity: []
      };
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

      // TastingRecord already contains all wine info, just return as WineRecord
      return filteredRecords as WineRecord[];
    } catch (error) {
      console.error('Error searching tasting records:', error);
      // Return empty array instead of throwing error
      return [];
    }
  }

  // Get public records for sharing (exclude private data)
  async getPublicRecords(userId: string): Promise<PublicWineRecord[]> {
    try {
      const allRecords = await this.getUserTastingRecords(userId, 'date', 1000);
      
      return allRecords
        .filter(record => record.isPublic)
        .map(record => ({
          id: record.id,
          wineName: record.wineName,
          producer: record.producer,
          country: record.country,
          region: record.region,
          vintage: record.vintage,
          overallRating: record.overallRating,
          tastingDate: record.tastingDate instanceof Date ? record.tastingDate : new Date(record.tastingDate),
          recordMode: record.recordMode,
          notes: record.notes,
          images: record.images
          // Exclude: price, purchaseLocation, and other private data
        } as PublicWineRecord));
    } catch (error) {
      console.error('Error getting public records:', error);
      return [];
    }
  }
}

export const tastingRecordService = new TastingRecordService();