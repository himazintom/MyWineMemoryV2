// Unlock All Levels Migration Script
// Unlocks all quiz levels for all existing users

const admin = require('firebase-admin');
const serviceAccount = require('../service-account-key.json');

// Initialize admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function unlockAllLevels() {
  console.log('=== Unlock All Levels Migration ===');
  console.log('This script will unlock all quiz levels for all users');
  console.log('');

  try {
    // Get all level_progress documents
    console.log('📥 Fetching all level progress documents...');
    const progressSnapshot = await db.collection('level_progress').get();

    console.log(`Found ${progressSnapshot.size} level progress documents`);
    console.log('');

    if (progressSnapshot.size === 0) {
      console.log('✅ No level progress documents found. No migration needed.');
      process.exit(0);
      return;
    }

    // Filter documents where isUnlocked is false
    const documentsToUpdate = [];
    progressSnapshot.forEach(doc => {
      const data = doc.data();
      if (!data.isUnlocked) {
        documentsToUpdate.push({
          id: doc.id,
          userId: data.userId,
          level: data.level
        });
      }
    });

    console.log(`Found ${documentsToUpdate.length} locked levels to unlock`);

    if (documentsToUpdate.length === 0) {
      console.log('✅ All levels are already unlocked. No migration needed.');
      process.exit(0);
      return;
    }

    console.log('');
    console.log('Levels to be unlocked:');
    const levelsByUser = {};
    documentsToUpdate.forEach(doc => {
      if (!levelsByUser[doc.userId]) {
        levelsByUser[doc.userId] = [];
      }
      levelsByUser[doc.userId].push(doc.level);
    });

    Object.entries(levelsByUser).forEach(([userId, levels]) => {
      console.log(`  User ${userId.substring(0, 8)}...: Levels ${levels.join(', ')}`);
    });
    console.log('');

    // Confirm before proceeding
    console.log('⚠️  This will set isUnlocked=true for all these level progress documents');
    console.log('Starting in 5 seconds... Press Ctrl+C to cancel');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('\n🔄 Starting migration...\n');

    // Update documents in batches of 500 (Firestore batch limit)
    const batchSize = 500;
    let updatedCount = 0;

    for (let i = 0; i < documentsToUpdate.length; i += batchSize) {
      const batch = db.batch();
      const batchDocs = documentsToUpdate.slice(i, i + batchSize);

      batchDocs.forEach(docData => {
        const docRef = db.collection('level_progress').doc(docData.id);
        batch.update(docRef, {
          isUnlocked: true,
          unlockedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      await batch.commit();
      updatedCount += batchDocs.length;
      console.log(`✅ Updated ${updatedCount}/${documentsToUpdate.length} level progress documents`);
    }

    console.log('\n=================================');
    console.log('✨ Migration complete!');
    console.log(`   Unlocked ${updatedCount} levels across ${Object.keys(levelsByUser).length} users`);
    console.log('=================================\n');

    console.log('Next steps:');
    console.log('1. All users can now access all quiz levels');
    console.log('2. New users will have all levels unlocked by default');
    console.log('3. Level progression is now unrestricted');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
unlockAllLevels().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
