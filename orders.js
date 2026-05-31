// ─────────────────────────────────────────────────────────────
// Order data layer — all Firestore reads/writes for orders live
// here so the rest of the app never touches the database directly.
//
// The submitOrder function is the strategic gate: it REFUSES any
// order whose advance payment is below the minimum (200 BDT). This
// rule is enforced here in code AND in the Firestore Security Rules
// (firestore.rules) so it cannot be bypassed from the client.
// ─────────────────────────────────────────────────────────────

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { PRICING } from "./constants";

const ORDERS = "orders";

// Valid order statuses — the admin dashboard moves an order through these.
export const ORDER_STATUSES = ["Pending", "Shipped", "Delivered", "Cancelled"];

/**
 * The Orders schema (one document per order):
 *
 *  customerName       string    — buyer's full name
 *  phone              string    — Bangladeshi mobile, validated client-side
 *  city               string    — "Dhaka" | "Chattogram"
 *  address            string    — full delivery address
 *  selectedProduct    string    — e.g. "10kg Family Crate"
 *  totalAmount        number     — full crate price (1400)
 *  amountPaidAdvance  number     — what they paid now (>= 200, enforced)
 *  balanceDue         number     — totalAmount - amountPaidAdvance
 *  paymentPlan        string    — "full_prepayment" | "partial_cod_advance"
 *  bonusKg            number     — 2 on full pre-payment, else 0
 *  bonusReward        string    — human-readable reward label
 *  paymentToken       string    — gateway transaction reference
 *  paymentGateway     string    — e.g. "SSLCommerz"
 *  orderStatus        string    — one of ORDER_STATUSES
 *  referralCode       string?    — affiliate code if referred (Phase 3)
 *  metaTracked        boolean    — whether Pixel Purchase fired (Phase 3)
 *  createdAt          Timestamp  — server time
 *  updatedAt          Timestamp  — server time, bumped on status change
 */

/**
 * Create an order. Throws if the advance is below the minimum, so a
 * zero-taka / pure-COD order can never reach the database.
 * Returns the new document id.
 */
export async function submitOrder(order) {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured.");
  }
  const advance = Number(order?.amountPaidAdvance);

  if (!Number.isFinite(advance) || advance < PRICING.advanceMin) {
    throw new Error(
      `A minimum advance of ${PRICING.currencySymbol}${PRICING.advanceMin} is required to confirm the order. Received: ${PRICING.currencySymbol}${advance || 0}.`
    );
  }

  // Recompute balance server-side rather than trusting the client value.
  const total = PRICING.cratePrice;
  const balanceDue = Math.max(0, total - advance);

  const ref = await addDoc(collection(db, ORDERS), {
    customerName: order.customerName || "",
    phone: order.phone || "",
    city: order.city || "",
    address: order.address || "",
    selectedProduct: order.selectedProduct || PRICING.crateName,
    totalAmount: total,
    amountPaidAdvance: advance,
    balanceDue,
    paymentPlan: order.paymentPlan || "partial_cod_advance",
    bonusKg: order.bonusKg ?? 0,
    bonusReward: order.bonusReward || "",
    paymentToken: order.paymentToken || "",
    paymentGateway: order.paymentGateway || "",
    orderStatus: "Pending",
    referralCode: order.referralCode || null,
    metaTracked: order.metaTracked ?? false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return ref.id;
}

/** One-time fetch of all orders, newest first (used as a fallback). */
export async function fetchOrders() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured.");
  }
  const q = query(collection(db, ORDERS), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Live subscription to all orders, newest first. Returns an
 * unsubscribe function. The admin dashboard uses this so new
 * orders appear in real time without a refresh.
 */
export function subscribeToOrders(onData, onError) {
  if (!isFirebaseConfigured || !db) {
    onError?.(new Error("Firebase is not configured. Set the NEXT_PUBLIC_FIREBASE_* environment variables."));
    return () => {};
  }
  const q = query(collection(db, ORDERS), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const orders = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.() ?? null,
        updatedAt: d.data().updatedAt?.toDate?.() ?? null,
      }));
      onData(orders);
    },
    (err) => onError?.(err)
  );
}

/** Update an order's status (Pending → Shipped → Delivered, etc.). */
export async function updateOrderStatus(orderId, newStatus, orderData = null) {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured.");
  }
  if (!ORDER_STATUSES.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }
  await updateDoc(doc(db, ORDERS, orderId), {
    orderStatus: newStatus,
    updatedAt: serverTimestamp(),
  });

  // Empathy automation hook: when an order ships, notify Make.com so it can
  // send the empathetic WhatsApp message (see DEPLOYMENT_GUIDE.md, Part 5).
  // No-op unless NEXT_PUBLIC_MAKE_SHIPPED_WEBHOOK is set, so nothing fires
  // until you have built and connected the Make scenario.
  if (newStatus === "Shipped") {
    await notifyShipped(orderId, orderData);
  }
}

async function notifyShipped(orderId, orderData) {
  const url = process.env.NEXT_PUBLIC_MAKE_SHIPPED_WEBHOOK;
  if (!url || !orderData) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "order_shipped",
        orderId,
        customerName: orderData.customerName || "",
        phone: orderData.phone || "",
        city: orderData.city || "",
        selectedProduct: orderData.selectedProduct || "",
        balanceDue: orderData.balanceDue ?? 0,
        paymentPlan: orderData.paymentPlan || "",
      }),
    });
  } catch (e) {
    // Never let a webhook failure block the status update.
    // eslint-disable-next-line no-console
    console.warn("[AmarBagan] shipped webhook failed:", e?.message);
  }
}
