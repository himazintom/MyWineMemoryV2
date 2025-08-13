// MyWineMemory - User Data Deletion Script
// WARNING: This will permanently delete all your wine records and related data!

(async function deleteAllUserData() {
  console.log('=== MyWineMemory Data Deletion Script ===');
  
  // Check if Firebase is available
  if (typeof firebase === 'undefined' && !window._firebase) {
    console.error('Firebase is not available. Please run this script from the MyWineMemory app.');
    return;
  }

  // Get Firebase services
  let auth, db;
  try {
    // Try Firebase v8 style first
    if (typeof firebase !== 'undefined') {
      auth = firebase.auth();
      db = firebase.firestore();
    } else {
      // Try to find Firebase v9+ from the app
      const possiblePaths = [
        window._firebase,
        window.firebaseApp,
        window.__firebase,
      ];
      
      for (const path of possiblePaths) {
        if (path?.auth && path?.firestore) {
          auth = path.auth;
          db = path.firestore;
          break;
        }
      }
    }
  } catch (error) {
    console.error('Failed to access Firebase services:', error);
    return;
  }

  // Check if user is logged in
  const currentUser = auth?.currentUser || auth?.getAuth?.()?.currentUser;
  if (!currentUser) {
    console.error('No user is currently logged in. Please log in first.');
    return;
  }

  const userId = currentUser.uid;
  console.log(`Current user ID: ${userId}`);
  console.log(`Email: ${currentUser.email}`);

  // Confirmation dialogs
  if (!confirm('⚠️ WARNING: This will DELETE ALL your wine records and data!\n\nAre you sure you want to continue?')) {
    console.log('Deletion cancelled.');
    return;
  }

  if (!confirm('⚠️ FINAL WARNING: This action CANNOT be undone!\n\nAll your wine records, tasting notes, and statistics will be permanently deleted.\n\nAre you ABSOLUTELY sure?')) {
    console.log('Deletion cancelled.');
    return;
  }

  const confirmText = prompt('Type "DELETE" to confirm you want to delete all data:');
  if (confirmText !== 'DELETE') {
    console.log('Deletion cancelled - confirmation text did not match.');
    return;
  }

  console.log('Starting data deletion...');
  let totalDeleted = 0;

  try {
    // 1. Delete tasting_records
    console.log('\n📝 Deleting tasting records...');
    try {
      const tastingQuery = db.collection('tasting_records').where('userId', '==', userId);
      const tastingDocs = await tastingQuery.get();
      
      const tastingBatch = db.batch();
      let tastingCount = 0;
      
      tastingDocs.forEach(doc => {
        tastingBatch.delete(doc.ref);
        tastingCount++;
      });
      
      if (tastingCount > 0) {
        await tastingBatch.commit();
        console.log(`✅ Deleted ${tastingCount} tasting records`);
        totalDeleted += tastingCount;
      } else {
        console.log('No tasting records found');
      }
    } catch (error) {
      console.error('Error deleting tasting records:', error);
    }

    // 2. Delete wines_master created by user
    console.log('\n🍷 Deleting wine master records...');
    try {
      const winesQuery = db.collection('wines_master').where('createdBy', '==', userId);
      const winesDocs = await winesQuery.get();
      
      const winesBatch = db.batch();
      let winesCount = 0;
      
      winesDocs.forEach(doc => {
        winesBatch.delete(doc.ref);
        winesCount++;
      });
      
      if (winesCount > 0) {
        await winesBatch.commit();
        console.log(`✅ Deleted ${winesCount} wine master records`);
        totalDeleted += winesCount;
      } else {
        console.log('No wine master records found');
      }
    } catch (error) {
      console.error('Error deleting wine master records:', error);
    }

    // 3. Delete daily_goals
    console.log('\n📅 Deleting daily goals...');
    try {
      // Daily goals use document IDs like: userId_YYYY-MM-DD
      const goalsCollection = db.collection('daily_goals');
      const goalsSnapshot = await goalsCollection.get();
      
      const goalsBatch = db.batch();
      let goalsCount = 0;
      
      goalsSnapshot.forEach(doc => {
        if (doc.id.startsWith(userId + '_')) {
          goalsBatch.delete(doc.ref);
          goalsCount++;
        }
      });
      
      if (goalsCount > 0) {
        await goalsBatch.commit();
        console.log(`✅ Deleted ${goalsCount} daily goal records`);
        totalDeleted += goalsCount;
      } else {
        console.log('No daily goals found');
      }
    } catch (error) {
      console.error('Error deleting daily goals:', error);
    }

    // 4. Delete user_stats
    console.log('\n📊 Deleting user statistics...');
    try {
      const statsDoc = db.collection('user_stats').doc(userId);
      const statsSnapshot = await statsDoc.get();
      
      if (statsSnapshot.exists) {
        await statsDoc.delete();
        console.log('✅ Deleted user statistics');
        totalDeleted++;
      } else {
        console.log('No user statistics found');
      }
    } catch (error) {
      console.error('Error deleting user statistics:', error);
    }

    // 5. Delete user profile (optional - uncomment if needed)
    console.log('\n👤 User profile...');
    console.log('Note: User profile is preserved to maintain authentication.');
    console.log('If you want to delete it, uncomment the code below.');
    
    // Uncomment to also delete user profile:
    /*
    try {
      const userDoc = db.collection('users').doc(userId);
      const userSnapshot = await userDoc.get();
      
      if (userSnapshot.exists) {
        await userDoc.delete();
        console.log('✅ Deleted user profile');
        totalDeleted++;
      }
    } catch (error) {
      console.error('Error deleting user profile:', error);
    }
    */

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 DATA DELETION COMPLETE');
    console.log(`Total documents deleted: ${totalDeleted}`);
    console.log('='.repeat(50));
    
    console.log('\n📌 Additional steps:');
    console.log('1. Clear browser cache and local storage');
    console.log('2. Refresh the page to see changes');
    console.log('3. If you deleted your user profile, you may need to log in again');
    
  } catch (error) {
    console.error('\n❌ An error occurred during deletion:', error);
    console.log(`Partial deletion: ${totalDeleted} documents were deleted before the error`);
  }
})();