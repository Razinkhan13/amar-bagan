// ─────────────────────────────────────────────────────────────
// Admin authentication via Firebase Auth (Google sign-in).
// Only emails listed in NEXT_PUBLIC_ADMIN_EMAILS may view the
// dashboard. The real enforcement is in firestore.rules, which
// only lets those same emails read/update order documents.
//
// All exports tolerate an unconfigured Firebase (build-time / local
// dev with no env vars) by failing gracefully rather than crashing.
// ─────────────────────────────────────────────────────────────

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import app, { isFirebaseConfigured } from "./firebase";

export const auth = isFirebaseConfigured && app ? getAuth(app) : null;
const provider = new GoogleAuthProvider();

export function getAdminEmails() {
  return (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdmin(user) {
  if (!user?.email) return false;
  return getAdminEmails().includes(user.email.toLowerCase());
}

export async function signInAdmin() {
  if (!auth) throw new Error("Firebase is not configured. Set the NEXT_PUBLIC_FIREBASE_* environment variables.");
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signOutAdmin() {
  if (!auth) return;
  await fbSignOut(auth);
}

export function watchAuth(callback) {
  if (!auth) {
    // No Firebase → report "signed out" once so the UI can render its
    // sign-in screen rather than hanging on "Checking access…".
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
