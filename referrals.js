// ─────────────────────────────────────────────────────────────
// Referral / affiliate system — turn customers into promoters.
//
// Model:
//  • Each promoter has one document in the "referrals" collection,
//    keyed by their unique CODE (e.g. "AMARABC123").
//  • The document tracks: owner identity, total clicks, total
//    confirmed orders, and total advance value driven.
//  • When an order is placed carrying a referralCode, we increment
//    that promoter's counters atomically.
//
// Codes are deterministic-ish but collision-resistant: a short
// random base36 suffix prefixed with "AMAR".
// ─────────────────────────────────────────────────────────────

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";

const REFERRALS = "referrals";

// Generate a fresh referral code.
export function generateReferralCode() {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return "AMAR" + suffix;
}

// Build the shareable link for a code, given the current origin.
export function referralLink(code, origin) {
  const base = origin || (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/?ref=${encodeURIComponent(code)}`;
}

// Read ?ref= from the URL and remember it for this browser session,
// so the attribution survives the journey from landing to checkout.
export function captureReferralFromUrl() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const code = params.get("ref");
  if (code) {
    try {
      sessionStorage.setItem("amarbagan_ref", code);
    } catch {}
    return code;
  }
  try {
    return sessionStorage.getItem("amarbagan_ref");
  } catch {
    return null;
  }
}

export function getStoredReferral() {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem("amarbagan_ref");
  } catch {
    return null;
  }
}

// Ensure a referral document exists for a promoter, creating it on
// first use. Returns the code.
export async function ensureReferral({ code, ownerName, ownerPhone }) {
  if (!isFirebaseConfigured || !db) throw new Error("Firebase is not configured.");
  const ref = doc(db, REFERRALS, code);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      code,
      ownerName: ownerName || "",
      ownerPhone: ownerPhone || "",
      clicks: 0,
      confirmedOrders: 0,
      valueDriven: 0,
      createdAt: serverTimestamp(),
    });
  }
  return code;
}

// Record a click/visit on a referral link (best-effort, non-blocking).
export async function recordReferralClick(code) {
  if (!isFirebaseConfigured || !db || !code) return;
  const ref = doc(db, REFERRALS, code);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, { clicks: increment(1) });
    }
  } catch {
    // Silent — a missing referral doc simply means an unknown code.
  }
}

// Credit a confirmed order to a promoter: bump order count + value.
export async function creditReferralOrder(code, advanceValue) {
  if (!isFirebaseConfigured || !db || !code) return;
  const ref = doc(db, REFERRALS, code);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, {
        confirmedOrders: increment(1),
        valueDriven: increment(Number(advanceValue) || 0),
      });
    }
  } catch {
    // Silent — never let referral accounting break a real order.
  }
}

// Fetch a single promoter's stats by code.
export async function getReferralStats(code) {
  if (!isFirebaseConfigured || !db || !code) return null;
  const snap = await getDoc(doc(db, REFERRALS, code));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Look up a promoter's existing code by phone, so a returning
// customer recovers the same link rather than minting a new one.
export async function findReferralByPhone(phone) {
  if (!isFirebaseConfigured || !db || !phone) return null;
  const q = query(collection(db, REFERRALS), where("ownerPhone", "==", phone));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}
