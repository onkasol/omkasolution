import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut as fbSignOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, getDocFromServer, collection, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

let app;
let db: any = null;
let auth: any = null;
let isRealFirebase = false;

try {
  if (firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey !== 'placeholder-api-key') {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    isRealFirebase = true;
    console.log('Firebase successfully initialized in production/cloud mode.');
  } else {
    console.warn('Firebase initialized in fallback/offline mode (using placeholder config).');
  }
} catch (error) {
  console.error('Error initializing Firebase SDK:', error);
}

// Validation constraint check from Firebase Integration skill
async function testConnection() {
  if (!isRealFirebase || !db) return;
  try {
    // Attempt dynamic connection test from system skill
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Note: Firebase client is currently in offline fallback mode.");
    }
  }
}
testConnection();

// Firestore error standard logger & translator from Integration skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Auth Handlers
export const loginWithGoogle = async () => {
  if (!isRealFirebase || !auth) {
    // Simulated auth state for local mock fallback
    const mockUser = {
      uid: 'mock_admin_uid_123',
      email: 'admin@ruby.solution',
      displayName: '루비 관리자',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      emailVerified: true
    };
    localStorage.setItem('ruby_mock_user', JSON.stringify(mockUser));
    return mockUser;
  }
  
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Login action failed:', error);
    throw error;
  }
};

export const logout = async () => {
  if (!isRealFirebase || !auth) {
    localStorage.removeItem('ruby_mock_user');
    return;
  }
  try {
    await fbSignOut(auth);
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

export { db, auth, isRealFirebase };
