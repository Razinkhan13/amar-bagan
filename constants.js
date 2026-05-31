// ─────────────────────────────────────────────────────────────
// Amar Bagan — single source of truth for pricing & contact.
// Both the frontend (Phase 1) and the order validation (Phase 2)
// import from here so the numbers can never drift apart.
// ─────────────────────────────────────────────────────────────

export const PRICING = {
  crateName: "10kg Family Crate",
  crateKg: 10,
  cratePrice: 1400,        // BDT — total crate price
  advanceMin: 200,         // BDT — minimum micro-commitment (courier fee)
  prepayBonusKg: 2,        // free kg awarded on full pre-payment
  currency: "BDT",
  currencySymbol: "৳",
};

export const CONTACT = {
  whatsapp: "+8801410761298",
  whatsappDisplay: "+880 1410-761298",
  whatsappDigits: "8801410761298",          // for wa.me links
  payment: "01708761298",                   // bKash / Nagad (personal)
  email: "contactamarbagan@gmail.com",
  facebook: "https://www.facebook.com/share/1CKskkB3kC/",
  instagram: "https://www.instagram.com/amar_baganbd",
  instagramHandle: "@amar_baganbd",
};

export const PLANS = {
  full: {
    id: "full",
    title: "Full Pre-payment (bKash / Nagad / Card)",
    featured: true,
    rewardLabel: "Reward: 2KG Extra Premium Mangoes FREE",
    amount: PRICING.cratePrice,
  },
  advance: {
    id: "advance",
    title: "Partial COD (৳200 Advance)",
    featured: false,
    desc: "Pay the ৳200 courier fee now to confirm your order. Pay the remaining ৳1,200 on delivery.",
    amount: PRICING.advanceMin,
  },
};
