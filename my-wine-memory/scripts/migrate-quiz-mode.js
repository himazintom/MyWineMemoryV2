// Quiz Mode Migration Script
// Migrates all existing users without quizMode to 'infinite' mode

const admin = require('firebase-admin');
const serviceAccount = require('../service-account-key.json');

// Initialize admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateQuizMode() {
  console.log('=== Quiz Mode Migration ===');
  console.log('This script will update all users without quizMode to "infinite" mode');
  console.log('');

  try {
    // Get all users
    console.log('📥 Fetching all users...');
    const usersSnapshot = await db.collection('users').get();

    console.log(`Found ${usersSnapshot.size} total users`);
    console.log('');

    // Filter users without quizMode
    const usersToUpdate = [];
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      if (!data.quizMode) {
        usersToUpdate.push({
          id: doc.id,
          displayName: data.displayName || 'Unknown',
          email: data.email || 'Unknown'
        });
      }
    });

    console.log(`Found ${usersToUpdate.length} users without quizMode`);

    if (usersToUpdate.length === 0) {
      console.log('✅ All users already have quizMode set. No migration needed.');
      process.exit(0);
      return;
    }

    console.log('');
    console.log('Users to be updated:');
    usersToUpdate.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.displayName} (${user.email})`);
    });
    console.log('');

    // Confirm before proceeding
    console.log('⚠️  This will set quizMode="infinite" for all these users');
    console.log('Starting in 5 seconds... Press Ctrl+C to cancel');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('\n🔄 Starting migration...\n');

    // Update users in batches of 500 (Firestore batch limit)
    const batchSize = 500;
    let updatedCount = 0;

    for (let i = 0; i < usersToUpdate.length; i += batchSize) {
      const batch = db.batch();
      const batchUsers = usersToUpdate.slice(i, i + batchSize);

      batchUsers.forEach(user => {
        const userRef = db.collection('users').doc(user.id);
        batch.update(userRef, {
          quizMode: 'infinite',
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      await batch.commit();
      updatedCount += batchUsers.length;
      console.log(`✅ Updated ${updatedCount}/${usersToUpdate.length} users`);
    }

    console.log('\n=================================');
    console.log('✨ Migration complete!');
    console.log(`   Updated ${updatedCount} users to infinite mode`);
    console.log('=================================\n');

    console.log('Next steps:');
    console.log('1. Verify users can access quizzes without heart limitations');
    console.log('2. Users can switch to normal mode from Profile page (when implemented)');
    console.log('3. New users will default to infinite mode');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateQuizMode().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
