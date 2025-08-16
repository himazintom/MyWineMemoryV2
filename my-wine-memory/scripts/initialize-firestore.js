// Firestore Database Initialization Script
// WARNING: This will delete ALL data from Firestore collections!

const admin = require('firebase-admin');
const serviceAccount = require('../service-account-key.json');

// Initialize admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function deleteCollection(collectionName) {
  const collectionRef = db.collection(collectionName);
  const query = collectionRef.limit(500);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(query, resolve).catch(reject);
  });

  async function deleteQueryBatch(query, resolve) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
      // When there are no documents left, we are done
      resolve();
      return;
    }

    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid exploding the stack.
    process.nextTick(() => {
      deleteQueryBatch(query, resolve);
    });
  }
}

async function initializeDatabase() {
  console.log('=== Firestore Database Initialization ===');
  console.log('⚠️  WARNING: This will DELETE ALL data from the database!');
  console.log('');

  const collections = [
    'users',
    'wines_master',
    'tasting_records',
    'user_stats',
    'daily_goals',
    'quiz_questions',
    'quiz_progress',
    'notification_settings',
    'fcm_tokens'
  ];

  console.log('Collections to be cleared:');
  collections.forEach(col => console.log(`  - ${col}`));
  console.log('');

  // Add a delay for user to cancel if needed
  console.log('Starting in 5 seconds... Press Ctrl+C to cancel');
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log('\n🗑️  Starting database cleanup...\n');

  for (const collection of collections) {
    try {
      console.log(`Deleting collection: ${collection}...`);
      await deleteCollection(collection);
      console.log(`✅ ${collection} - cleared`);
    } catch (error) {
      console.error(`❌ ${collection} - error:`, error.message);
    }
  }

  console.log('\n=================================');
  console.log('✨ Database initialization complete!');
  console.log('=================================\n');

  console.log('Next steps:');
  console.log('1. Test the application with fresh data');
  console.log('2. Create sample data if needed');
  console.log('3. Verify all features work correctly');

  process.exit(0);
}

// Run the initialization
initializeDatabase().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});