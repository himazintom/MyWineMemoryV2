import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import type { WineRecord, WineDraft } from '../types';

export const wineService = {
  // Create a new wine record
  async createWineRecord(userId: string, wineData: Omit<WineRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docData = {
      ...wineData,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'wines'), docData);
    return docRef.id;
  },

  // Get wine records for a user
  async getUserWineRecords(userId: string, sortBy: 'date' | 'rating' | 'name' = 'date'): Promise<WineRecord[]> {
    let q;
    
    switch (sortBy) {
      case 'rating':
        q = query(
          collection(db, 'wines'),
          where('userId', '==', userId),
          orderBy('overallRating', 'desc')
        );
        break;
      case 'name':
        q = query(
          collection(db, 'wines'),
          where('userId', '==', userId),
          orderBy('wineName', 'asc')
        );
        break;
      default:
        q = query(
          collection(db, 'wines'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    } as WineRecord));
  },

  // Get a single wine record
  async getWineRecord(id: string): Promise<WineRecord | null> {
    const docRef = doc(db, 'wines', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate(),
        updatedAt: docSnap.data().updatedAt.toDate()
      } as WineRecord;
    }
    return null;
  },

  // Update wine record
  async updateWineRecord(id: string, updates: Partial<WineRecord>): Promise<void> {
    const docRef = doc(db, 'wines', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  // Delete wine record (soft delete by moving to deleted_items collection)
  async deleteWineRecord(id: string): Promise<void> {
    const wineRecord = await this.getWineRecord(id);
    if (wineRecord) {
      // Move to deleted_items collection with TTL
      await addDoc(collection(db, 'deleted_items'), {
        ...wineRecord,
        originalCollection: 'wines',
        deletedAt: Timestamp.now(),
        // TTL will be handled by Firestore rules (3 days)
      });

      // Remove from wines collection
      await deleteDoc(doc(db, 'wines', id));
    }
  },

  // Upload wine image
  async uploadWineImage(file: File, userId: string): Promise<string> {
    const fileName = `${userId}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `wine-images/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  },

  // Search wine records
  async searchWineRecords(userId: string, searchTerm: string): Promise<WineRecord[]> {
    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation - consider using Algolia for production
    const userRecords = await this.getUserWineRecords(userId);
    
    return userRecords.filter(record => 
      record.wineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.producer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.region.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  // Get public wine records
  async getPublicWineRecords(limitCount: number = 20): Promise<WineRecord[]> {
    const q = query(
      collection(db, 'wines'),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    } as WineRecord));
  }
};

export const draftService = {
  // Save draft
  async saveDraft(userId: string, draftData: Partial<WineRecord>): Promise<string> {
    const draftsQuery = query(
      collection(db, 'drafts'),
      where('userId', '==', userId)
    );
    
    const existingDrafts = await getDocs(draftsQuery);
    
    // Limit to 5 drafts per user
    if (existingDrafts.size >= 5) {
      // Delete oldest draft
      const oldestDraft = existingDrafts.docs
        .sort((a, b) => a.data().lastSaved.toMillis() - b.data().lastSaved.toMillis())[0];
      await deleteDoc(oldestDraft.ref);
    }

    const docData = {
      userId,
      data: draftData,
      lastSaved: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'drafts'), docData);
    return docRef.id;
  },

  // Get user drafts
  async getUserDrafts(userId: string): Promise<WineDraft[]> {
    const q = query(
      collection(db, 'drafts'),
      where('userId', '==', userId),
      orderBy('lastSaved', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lastSaved: doc.data().lastSaved.toDate()
    } as WineDraft));
  },

  // Delete draft
  async deleteDraft(id: string): Promise<void> {
    await deleteDoc(doc(db, 'drafts', id));
  },

  // Convert draft to wine record
  async publishDraft(draftId: string): Promise<string> {
    const draftDoc = await getDoc(doc(db, 'drafts', draftId));
    if (draftDoc.exists()) {
      const draft = draftDoc.data() as WineDraft;
      const wineRecordId = await wineService.createWineRecord(
        draft.userId,
        draft.data as Omit<WineRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
      );
      
      await this.deleteDraft(draftId);
      return wineRecordId;
    }
    throw new Error('Draft not found');
  }
};