import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { WineRecord, WineDraft } from '../types';

/**
 * Draft Service
 * Manages wine record drafts with auto-save functionality
 * Note: This service uses legacy WineRecord format for backward compatibility
 * TODO: Update to use TastingRecord format when draft system is refactored
 */
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
  }
};
