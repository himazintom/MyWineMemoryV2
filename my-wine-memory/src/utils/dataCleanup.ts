import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  where,
  writeBatch
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { wineMasterService } from '../services/wineMasterService';
import type { TastingRecord, WineMaster } from '../types';

interface DataCleanupReport {
  totalRecords: number;
  recordsWithInvalidWineId: number;
  recordsFixed: number;
  recordsDeleted: number;
  errors: string[];
}

/**
 * Utility class for cleaning up data integrity issues in the database
 */
export class DataCleanupService {
  private readonly tastingRecordsCollection = 'tasting_records';
  private readonly wineMasterCollection = 'wines_master';

  /**
   * Find all tasting records with invalid or missing wineId
   */
  async findRecordsWithInvalidWineId(userId?: string): Promise<TastingRecord[]> {
    try {
      let q = collection(db, this.tastingRecordsCollection);
      
      if (userId) {
        q = query(collection(db, this.tastingRecordsCollection), where('userId', '==', userId)) as any;
      }

      const querySnapshot = await getDocs(q);
      const allRecords = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        tastingDate: doc.data().tastingDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as TastingRecord));

      // Filter records with invalid wineId
      const invalidRecords = allRecords.filter(record => 
        !record.wineId || 
        typeof record.wineId !== 'string' || 
        record.wineId.trim() === '' ||
        record.wineId === 'undefined' ||
        record.wineId === 'null'
      );

      return invalidRecords;
    } catch (error) {
      console.error('Error finding records with invalid wineId:', error);
      throw new Error('データベース検索に失敗しました');
    }
  }

  /**
   * Attempt to fix records by finding or creating appropriate WineMaster entries
   */
  async fixRecordsWithInvalidWineId(userId?: string): Promise<DataCleanupReport> {
    const report: DataCleanupReport = {
      totalRecords: 0,
      recordsWithInvalidWineId: 0,
      recordsFixed: 0,
      recordsDeleted: 0,
      errors: []
    };

    try {
      const invalidRecords = await this.findRecordsWithInvalidWineId(userId);
      report.totalRecords = invalidRecords.length;
      report.recordsWithInvalidWineId = invalidRecords.length;

      console.log(`Found ${invalidRecords.length} records with invalid wineId`);

      for (const record of invalidRecords) {
        try {
          // Check if we can find or create a wine master for this record
          if (record.wineName && record.producer && record.country && record.region) {
            // Try to find existing wine master
            const existingWine = await this.findMatchingWineMaster(
              record.wineName,
              record.producer,
              record.country,
              record.region,
              record.vintage
            );

            let wineId: string;
            
            if (existingWine) {
              wineId = existingWine.id;
              console.log(`Found existing wine master for record ${record.id}:`, wineId);
            } else {
              // Create new wine master
              wineId = await wineMasterService.createOrFindWineMaster({
                wineName: record.wineName,
                producer: record.producer,
                country: record.country,
                region: record.region,
                vintage: record.vintage,
                grapeVarieties: record.grapeVarieties,
                wineType: record.wineType,
                alcoholContent: record.alcoholContent
              }, record.userId);
              
              console.log(`Created new wine master for record ${record.id}:`, wineId);
            }

            // Update the tasting record with the correct wineId
            const docRef = doc(db, this.tastingRecordsCollection, record.id);
            await updateDoc(docRef, {
              wineId: wineId,
              updatedAt: new Date()
            });

            report.recordsFixed++;
            console.log(`Fixed record ${record.id} with wineId: ${wineId}`);

          } else {
            // Record is missing essential wine information - consider deletion
            console.warn(`Record ${record.id} missing essential wine info:`, {
              wineName: record.wineName,
              producer: record.producer,
              country: record.country,
              region: record.region
            });

            // For safety, don't auto-delete, just log
            report.errors.push(`Record ${record.id} missing essential wine information`);
          }

        } catch (recordError) {
          console.error(`Error fixing record ${record.id}:`, recordError);
          report.errors.push(`Error fixing record ${record.id}: ${recordError}`);
        }
      }

    } catch (error) {
      console.error('Error in fixRecordsWithInvalidWineId:', error);
      report.errors.push(`General error: ${error}`);
    }

    return report;
  }

  /**
   * Find a matching wine master based on wine characteristics
   */
  private async findMatchingWineMaster(
    wineName: string,
    producer: string,
    country: string,
    region: string,
    vintage?: number
  ): Promise<WineMaster | null> {
    try {
      let q = query(
        collection(db, this.wineMasterCollection),
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
      console.error('Error finding matching wine master:', error);
      return null;
    }
  }

  /**
   * Delete records that cannot be fixed (use with extreme caution)
   */
  async deleteUnfixableRecords(recordIds: string[]): Promise<number> {
    let deletedCount = 0;
    const batch = writeBatch(db);

    for (const recordId of recordIds) {
      const docRef = doc(db, this.tastingRecordsCollection, recordId);
      batch.delete(docRef);
      deletedCount++;
    }

    try {
      await batch.commit();
      console.log(`Deleted ${deletedCount} unfixable records`);
      return deletedCount;
    } catch (error) {
      console.error('Error deleting unfixable records:', error);
      throw error;
    }
  }

  /**
   * Generate a report of data integrity issues
   */
  async generateDataIntegrityReport(userId?: string): Promise<DataCleanupReport> {
    const report: DataCleanupReport = {
      totalRecords: 0,
      recordsWithInvalidWineId: 0,
      recordsFixed: 0,
      recordsDeleted: 0,
      errors: []
    };

    try {
      // Get total records count
      let q = collection(db, this.tastingRecordsCollection);
      if (userId) {
        q = query(collection(db, this.tastingRecordsCollection), where('userId', '==', userId)) as any;
      }

      const allRecordsSnapshot = await getDocs(q);
      report.totalRecords = allRecordsSnapshot.size;

      // Find invalid records
      const invalidRecords = await this.findRecordsWithInvalidWineId(userId);
      report.recordsWithInvalidWineId = invalidRecords.length;

      // Log details of invalid records
      console.log('Data Integrity Report:', report);
      if (invalidRecords.length > 0) {
        console.log('Invalid records details:');
        invalidRecords.forEach(record => {
          console.log(`- Record ${record.id}: wineId="${record.wineId}", wine="${record.wineName}", producer="${record.producer}"`);
        });
      }

    } catch (error) {
      console.error('Error generating data integrity report:', error);
      report.errors.push(`Report generation error: ${error}`);
    }

    return report;
  }
}

export const dataCleanupService = new DataCleanupService();

// Helper function for manual cleanup in development/debugging
export const runDataCleanup = async (userId?: string) => {
  console.log('Starting data cleanup process...');
  
  // First, generate a report
  const report = await dataCleanupService.generateDataIntegrityReport(userId);
  console.log('Initial report:', report);
  
  if (report.recordsWithInvalidWineId === 0) {
    console.log('No records with invalid wineId found. Database is clean!');
    return report;
  }
  
  // Attempt to fix the issues
  const fixReport = await dataCleanupService.fixRecordsWithInvalidWineId(userId);
  console.log('Fix report:', fixReport);
  
  return fixReport;
};