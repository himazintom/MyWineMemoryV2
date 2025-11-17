# Create Firebase Service

Create a new Firebase service module following MyWineMemory project patterns for Firestore operations.

## What this skill does

1. Gather service requirements from the user
2. Create service file with CRUD operations
3. Add proper TypeScript typing
4. Include error handling and logging
5. Add Firestore security rules if needed
6. Update type definitions

## Usage

Use this skill when:
- Creating a new Firestore collection handler
- Adding data access layer for new features
- Need to implement CRUD operations
- Refactoring existing database operations

## Instructions

### Step 1: Gather Requirements

Ask the user for:
- Service name (e.g., wineMasterService, tastingRecordService)
- Collection name in Firestore
- Data structure/schema
- Required operations (Create, Read, Update, Delete, Query)
- Relationships with other collections

### Step 2: Create Service File

Location: `my-wine-memory/src/services/[serviceName].ts`

### Step 3: Service Template

```typescript
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentReference,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { [TypeName] } from '../types';

const COLLECTION_NAME = '[collection_name]';

/**
 * Get a single document by ID
 */
export const get[EntityName] = async (id: string): Promise<[TypeName] | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as [TypeName];
    }
    return null;
  } catch (error) {
    console.error('Error getting [entity]:', error);
    throw error;
  }
};

/**
 * Get all documents for a user
 */
export const get[EntityName]sByUserId = async (userId: string): Promise<[TypeName][]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as [TypeName][];
  } catch (error) {
    console.error('Error getting [entity]s:', error);
    throw error;
  }
};

/**
 * Create a new document
 */
export const create[EntityName] = async (data: Omit<[TypeName], 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating [entity]:', error);
    throw error;
  }
};

/**
 * Update an existing document
 */
export const update[EntityName] = async (
  id: string,
  data: Partial<[TypeName]>
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating [entity]:', error);
    throw error;
  }
};

/**
 * Delete a document
 */
export const delete[EntityName] = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting [entity]:', error);
    throw error;
  }
};

/**
 * Custom query operations as needed
 */
export const query[EntityName]s = async (
  userId: string,
  filters: QueryConstraint[]
): Promise<[TypeName][]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      ...filters
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as [TypeName][];
  } catch (error) {
    console.error('Error querying [entity]s:', error);
    throw error;
  }
};
```

### Step 4: Update Type Definitions

Add types to `my-wine-memory/src/types/index.ts`:

```typescript
export interface [TypeName] {
  id: string;
  userId: string;
  // Add fields here
  createdAt: Date;
  updatedAt: Date;
}
```

### Step 5: Update Firestore Security Rules

Add rules to `my-wine-memory/firestore.rules`:

```
match /[collection_name]/{documentId} {
  // Read: User can read their own documents
  allow read: if request.auth != null &&
              request.auth.uid == resource.data.userId;

  // Create: Authenticated users can create
  allow create: if request.auth != null &&
                request.auth.uid == request.resource.data.userId;

  // Update: User can update their own documents
  allow update: if request.auth != null &&
                request.auth.uid == resource.data.userId;

  // Delete: User can delete their own documents
  allow delete: if request.auth != null &&
                request.auth.uid == resource.data.userId;
}
```

### Step 6: Update Firestore Indexes

If queries need indexes, add to `my-wine-memory/firestore.indexes.json`:

```json
{
  "collectionGroup": "[collection_name]",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```

## Best Practices

- **Error Handling**: Always wrap Firebase calls in try-catch
- **TypeScript**: Use proper types, avoid `any`
- **Security**: Always filter by userId in queries
- **Timestamps**: Use Firebase Timestamp for dates
- **Logging**: Console.error for debugging
- **Performance**: Use indexes for complex queries
- **Data Validation**: Validate data before saving
- **User Isolation**: Ensure users can only access their own data

## Common Patterns

### Pagination
```typescript
const firstPage = query(
  collection(db, COLLECTION_NAME),
  where('userId', '==', userId),
  orderBy('createdAt', 'desc'),
  limit(10)
);
```

### Soft Delete
```typescript
await updateDoc(docRef, {
  deletedAt: Timestamp.now(),
  isDeleted: true
});
```

### Reference Counting
```typescript
await updateDoc(docRef, {
  referenceCount: increment(1)
});
```

## Success Criteria

- Service file created with all CRUD operations
- Proper TypeScript types defined
- Error handling implemented
- Firestore security rules updated
- Indexes added if needed
- No TypeScript or ESLint errors
- Service follows project patterns
