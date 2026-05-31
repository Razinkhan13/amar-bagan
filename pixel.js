// ─────────────────────────────────────────────────────────────
// Meta (Facebook) Pixel — the "AI learner".
//
// The strategic purpose: fire a Purchase event carrying the REAL
// order value at the moment of confirmation. Facebook's delivery
// algorithm uses the value to find more people who resemble your
// high-value, pre-paying buyers — so a full ৳1,400 pre-payment is
// a far stronger training signal than a ৳200 advance.
//
// The Pixel ID is read from NEXT_PUBLIC_META_PIXEL_ID. All helpers
// are no-ops when the id is missing or fbq has not loaded, so they
// are always safe to call.
// ─────────────────────────────────────────────────────────────

export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

export const isPixelConfigured = Boolean(PIXEL_ID);

function fbq(...args) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;
  window.fbq(...args);
}

// Injects the Pixel base code once. Called from the client Pixel
// component on mount. Safe to call repeatedly — it self-guards.
export function initPixel() {
  if (typeof window === "undefined" || !isPixelConfigured) return;
  if (window.__amarBaganPixelInit) return;
  window.__amarBaganPixelInit = true;

  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  fbq("init", PIXEL_ID);
  fbq("track", "PageView");
}

// Fired when a customer reaches / engages the checkout.
export function trackInitiateCheckout(value) {
  fbq("track", "InitiateCheckout", {
    value: Number(value) || 0,
    currency: "BDT",
  });
}

// THE key event. Fire with the real amount paid so Facebook learns
// to optimise toward high-value buyers. We also tag the plan so you
// can build a custom audience of full pre-payers specifically.
export function trackPurchase({ value, plan, orderId }) {
  fbq("track", "Purchase", {
    value: Number(value) || 0,
    currency: "BDT",
    content_name: plan === "full_prepayment" ? "Full Pre-payment Crate" : "Advance Crate",
    content_type: "product",
    content_ids: orderId ? [orderId] : undefined,
  });
}

// Fired when someone opens the site via a referral link, so you can
// measure referral-driven traffic, not just referral-driven sales.
export function trackReferralVisit(code) {
  fbq("trackCustom", "ReferralVisit", { referralCode: code || "" });
}
