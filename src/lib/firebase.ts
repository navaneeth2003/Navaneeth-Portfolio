import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** The owner's email — the only account the studio accepts. */
export const OWNER_EMAIL = (process.env.NEXT_PUBLIC_OWNER_EMAIL ?? "").toLowerCase();

export function firebaseEnabled(): boolean {
  return Boolean(config.apiKey && config.projectId && config.appId);
}

export function getFirebaseApp(): FirebaseApp {
  const existing = getApps();
  return existing.length > 0 ? existing[0] : initializeApp(config);
}

export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function getFirebaseStorage(): FirebaseStorage {
  return getStorage(getFirebaseApp());
}
