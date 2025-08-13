/**
 * MyWineMemory User Data Deletion Script
 * 
 * This script deletes all Firestore data for the current user in the MyWineMemory app.
 * Run this script in the browser console while the app is loaded.
 * 
 * WARNING: This action is irreversible!
 * 
 * Collections that will be deleted:
 * - tasting_records (where userId == currentUserId)
 * - wines_master (where createdBy == currentUserId)
 * - daily_goals (where document ID contains userId)
 * - user_stats (where document ID == userId)
 * - users (the user's profile document)
 */

(async function deleteAllUserData() {
  // Safety check - ensure Firebase is available
  if (typeof firebase === 'undefined' && typeof window.firebase === 'undefined') {
    console.error('❌ Firebase is not available. Make sure you are running this script in the MyWineMemory app.');
    return;
  }

  // Try to access Firebase from global scope or import
  let db, auth;
  try {
    // Check if Firebase v9+ modular SDK is available
    if (typeof window.getFirestore !== 'undefined') {
      db = window.getFirestore();
      auth = window.getAuth();
    }
    // Check if Firebase v8 compat is available
    else if (window.firebase) {
      db = window.firebase.firestore();
      auth = window.firebase.auth();
    }
    // Check if the app exports are available globally
    else if (window.db && window.auth) {
      db = window.db;
      auth = window.auth;
    }
    else {
      throw new Error('Firebase services not found');
    }
  } catch (error) {
    console.error('❌ Unable to access Firebase services:', error.message);
    console.log('💡 Make sure you are running this script in the MyWineMemory app where Firebase is initialized.');
    return;
  }

  // Get current user
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error('❌ No user is currently logged in. Please log in first.');
    return;
  }

  const userId = currentUser.uid;
  const userEmail = currentUser.email;

  console.log(`🔍 Found logged in user: ${userEmail} (${userId})`);

  // Safety confirmation
  const confirmed = confirm(
    `⚠️  WARNING: This will permanently delete ALL data for user ${userEmail}!\n\n` +
    'This includes:\n' +
    '• All tasting records\n' +
    '• Wine master records you created\n' +
    '• Daily goals and progress\n' +
    '• User statistics\n' +
    '• User profile\n\n' +
    'This action CANNOT be undone!\n\n' +
    'Are you absolutely sure you want to continue?'
  );

  if (!confirmed) {
    console.log('❌ Operation cancelled by user.');
    return;
  }

  // Double confirmation
  const doubleConfirmed = confirm(
    `🚨 FINAL WARNING!\n\n` +
    `You are about to delete ALL data for ${userEmail}.\n\n` +
    'Type "DELETE" in the next prompt to confirm.'
  );

  if (!doubleConfirmed) {
    console.log('❌ Operation cancelled by user.');
    return;
  }

  const finalConfirmation = prompt('Type "DELETE" (in capital letters) to confirm deletion:');
  if (finalConfirmation !== 'DELETE') {
    console.log('❌ Incorrect confirmation. Operation cancelled.');
    return;
  }

  console.log('🚀 Starting data deletion process...');
  
  let totalDeleted = 0;
  const deletionLog = [];

  // Helper function to delete documents in batches
  async function deleteInBatches(collectionRef, query, batchSize = 100) {
    const docs = await query.limit(batchSize).get();
    
    if (docs.empty) {
      return 0;
    }

    const batch = db.batch();
    docs.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    
    // If we got a full batch, there might be more
    if (docs.size === batchSize) {
      const additionalDeleted = await deleteInBatches(collectionRef, query, batchSize);
      return docs.size + additionalDeleted;
    }
    
    return docs.size;
  }

  try {
    // 1. Delete tasting records
    console.log('🗑️  Deleting tasting records...');
    const tastingRecordsQuery = db.collection('tasting_records').where('userId', '==', userId);
    const tastingDeleted = await deleteInBatches(db.collection('tasting_records'), tastingRecordsQuery);
    totalDeleted += tastingDeleted;
    deletionLog.push(`Deleted ${tastingDeleted} tasting records`);
    console.log(`✅ Deleted ${tastingDeleted} tasting records`);

    // 2. Delete wines_master created by user
    console.log('🗑️  Deleting wine master records...');
    const winesQuery = db.collection('wines_master').where('createdBy', '==', userId);
    const winesDeleted = await deleteInBatches(db.collection('wines_master'), winesQuery);
    totalDeleted += winesDeleted;
    deletionLog.push(`Deleted ${winesDeleted} wine master records`);
    console.log(`✅ Deleted ${winesDeleted} wine master records`);

    // 3. Delete daily goals (documents with pattern userId_YYYY-MM-DD)
    console.log('🗑️  Deleting daily goals...');
    let dailyGoalsDeleted = 0;
    
    // We need to query by userId field since we can't do prefix queries on document IDs
    // But since the document ID format is userId_date, we'll query all daily_goals and filter
    try {
      const dailyGoalsSnapshot = await db.collection('daily_goals').get();
      const batch = db.batch();
      let batchCount = 0;
      
      dailyGoalsSnapshot.docs.forEach((doc) => {
        // Check if document ID starts with userId_
        if (doc.id.startsWith(`${userId}_`)) {
          batch.delete(doc.ref);
          batchCount++;
          dailyGoalsDeleted++;
          
          // Firestore batch limit is 500 operations
          if (batchCount === 500) {
            // We'll commit this batch and create a new one if needed
            batch.commit();
            batchCount = 0;
          }
        }
      });
      
      if (batchCount > 0) {
        await batch.commit();
      }
    } catch (error) {
      console.warn('⚠️  Could not delete daily goals:', error.message);
    }
    
    totalDeleted += dailyGoalsDeleted;
    deletionLog.push(`Deleted ${dailyGoalsDeleted} daily goal records`);
    console.log(`✅ Deleted ${dailyGoalsDeleted} daily goal records`);

    // 4. Delete user stats
    console.log('🗑️  Deleting user statistics...');
    let userStatsDeleted = 0;
    try {
      const userStatsRef = db.collection('user_stats').doc(userId);
      const userStatsDoc = await userStatsRef.get();
      if (userStatsDoc.exists) {
        await userStatsRef.delete();
        userStatsDeleted = 1;
      }
    } catch (error) {
      console.warn('⚠️  Could not delete user stats:', error.message);
    }
    
    totalDeleted += userStatsDeleted;
    deletionLog.push(`Deleted ${userStatsDeleted} user stats record`);
    console.log(`✅ Deleted ${userStatsDeleted} user stats record`);

    // 5. Delete user profile
    console.log('🗑️  Deleting user profile...');
    let userProfileDeleted = 0;
    try {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        await userRef.delete();
        userProfileDeleted = 1;
      }
    } catch (error) {
      console.warn('⚠️  Could not delete user profile:', error.message);
    }
    
    totalDeleted += userProfileDeleted;
    deletionLog.push(`Deleted ${userProfileDeleted} user profile`);
    console.log(`✅ Deleted ${userProfileDeleted} user profile`);

    // Final summary
    console.log('\n🎉 Data deletion completed successfully!');
    console.log('📊 Summary:');
    deletionLog.forEach(log => console.log(`   • ${log}`));
    console.log(`   • Total documents deleted: ${totalDeleted}`);
    
    console.log('\n💡 Recommendations:');
    console.log('   • Clear browser cache and local storage');
    console.log('   • Consider signing out and back in');
    console.log('   • Refresh the page to see changes');

  } catch (error) {
    console.error('❌ Error during deletion process:', error);
    console.log('📊 Partial deletion summary:');
    deletionLog.forEach(log => console.log(`   • ${log}`));
    console.log(`   • Total documents deleted before error: ${totalDeleted}`);
    
    console.log('\n⚠️  Some data may not have been deleted due to the error.');
    console.log('💡 You may need to run this script again or contact support.');
  }

  // Additional cleanup suggestions
  console.log('\n🧹 Additional cleanup you might want to do:');
  console.log('   • Clear localStorage: localStorage.clear()');
  console.log('   • Clear sessionStorage: sessionStorage.clear()');
  console.log('   • Clear IndexedDB data if used by the app');
  
})();