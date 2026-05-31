// ─────────────────────────────────────────────────────────────
// Firebase initialisation — single shared instance.
//
// Config is read from NEXT_PUBLIC_* environment variables so that
// no values are committed to the repository. Set these in Vercel's
// dashboard (Phase 4) and in .env.local for local development.
//
// Initialisation is defensive: if the config is absent (e.g. during
// a build with no env vars), we do NOT crash. The app degrades
// gracefully and the data layer reports a clear "not configured"
// state instead of throwing an opaque Firebase error.
//
// Note: the Firebase "apiKey" is not a secret — it identifies the
// project to Google and is safe in the browser. Real protection
// comes from Firestore Security Rules (firestore.rules), not secrecy.
// ─────────────────────────────────────────────────────────────

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// True only when the essential keys are present.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app = null;
let db = null;

if (isFirebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
}

export { app, db };
export default app;
