"use client";

import { useState } from "react";
import { PRICING, CONTACT, PLANS } from "@/lib/constants";

const { currencySymbol: TK, cratePrice, advanceMin } = PRICING;

export default function CheckoutForm({ onConfirm }) {
  const [plan, setPlan] = useState("full"); // featured option pre-selected
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ active: false, pct: 0, label: "" });
  const [form, setForm] = useState({ name: "", phone: "", city: "", address: "" });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: false }));
  };

  function validate() {
    const er = {};
    if (!form.name.trim()) er.name = true;
    const phoneRx = /^(?:\+?88)?01[3-9]\d{8}$/;
    if (!phoneRx.test(form.phone.replace(/[\s-]/g, ""))) er.phone = true;
    if (!form.city) er.city = true;
    if (form.address.trim().length < 10) er.address = true;
    if (!plan) er.plan = true;
    setErrors(er);
    return Object.keys(er).length === 0;
  }

  // Payment gateway mock — animates a realistic SSLCommerz handshake.
  // Phase 2 replaces the body with a real gateway call via the backend.
  function simulateGateway(amount) {
    return new Promise((resolve) => {
      const steps = [
        { p: 25, m: "Connecting to SSLCommerz…" },
        { p: 60, m: "Verifying bKash / Nagad details…" },
        { p: 88, m: `Processing ${TK}${amount.toLocaleString()}…` },
        { p: 100, m: "Payment confirmed ✓" },
      ];
      let i = 0;
      setProgress({ active: true, pct: 0, label: steps[0].m });
      const iv = setInterval(() => {
        if (i < steps.length) {
          setProgress({ active: true, pct: steps[i].p, label: steps[i].m });
          i++;
        } else clearInterval(iv);
      }, 480);
      setTimeout(() => {
        clearInterval(iv);
        const token =
          "TXN-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();
        resolve({ success: true, token, gateway: "SSLCommerz" });
      }, 2100);
    });
  }

  async function handleSubmit() {
    if (!validate()) return;
    const isFull = plan === "full";
    const amount = isFull ? cratePrice : advanceMin;

    setLoading(true);
    try {
      const payment = await simulateGateway(amount);
      if (!payment.success) throw new Error("Payment failed. Please try again.");

      // Hand the validated order up to the page; Phase 2 writes it to Firestore.
      await onConfirm?.({
        customerName: form.name.trim(),
        phone: form.phone.trim(),
        city: form.city,
        address: form.address.trim(),
        selectedProduct: PRICING.crateName,
        totalAmount: cratePrice,
        amountPaidAdvance: amount,
        balanceDue: cratePrice - amount,
        paymentPlan: isFull ? "full_prepayment" : "partial_cod_advance",
        bonusKg: isFull ? PRICING.prepayBonusKg : 0,
        bonusReward: isFull ? "2kg Extra Premium Mangoes FREE" : "Standard crate",
        paymentToken: payment.token,
        paymentGateway: payment.gateway,
        orderStatus: "Pending",
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[AmarBagan] checkout error:", err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
      setProgress({ active: false, pct: 0, label: "" });
    }
  }

  const fieldCls = (k) =>
    `w-full font-body text-[0.98rem] text-ink bg-transparent border-0 border-b-[1.5px] py-2.5 px-0.5 outline-none transition-colors placeholder:text-[#B5AE9E] focus:border-gold ${
      errors[k] ? "border-red-700" : "border-line"
    }`;

  return (
    <div className="bg-cream-card border border-line rounded-xl p-7 sm:p-10 shadow-card">
      {/* Crate summary */}
      <div className="flex justify-between items-center bg-gold-bg rounded-md px-[22px] py-4 mb-8">
        <div>
          <div className="font-body text-emerald-deep text-sm">Selected Crate</div>
          <div className="font-display text-[1.25rem] font-semibold text-emerald">
            {PRICING.crateName}
          </div>
        </div>
        <div className="text-right">
          <div className="font-body text-emerald-deep text-sm">Total</div>
          <div className="font-display text-[1.6rem] font-bold text-gold">
            {TK}
            {cratePrice.toLocaleString()}
          </div>
        </div>
      </div>

      <h3 className="font-display text-[1.5rem] font-semibold text-ink pb-3.5 mb-6 border-b border-line">
        Delivery Details
      </h3>

      <div className="grid sm:grid-cols-2 gap-[22px]">
        <div className="mb-[22px]">
          <label className="block font-body text-[0.82rem] text-ink mb-2 tracking-wide">
            Full Name <span className="text-gold">*</span>
          </label>
          <input value={form.name} onChange={set("name")} maxLength={80} placeholder="Enter your name" className={fieldCls("name")} />
          {errors.name && <p className="text-red-700 text-xs mt-1.5">Please enter your name.</p>}
        </div>
        <div className="mb-[22px]">
          <label className="block font-body text-[0.82rem] text-ink mb-2 tracking-wide">
            Phone Number <span className="text-gold">*</span>
          </label>
          <input value={form.phone} onChange={set("phone")} maxLength={14} placeholder="01XXX-XXXXXX" className={fieldCls("phone")} />
          {errors.phone && <p className="text-red-700 text-xs mt-1.5">Enter a valid Bangladeshi number.</p>}
        </div>
      </div>

      <div className="mb-[22px]">
        <label className="block font-body text-[0.82rem] text-ink mb-2 tracking-wide">
          Delivery City <span className="text-gold">*</span>
        </label>
        <select value={form.city} onChange={set("city")} className={`field-select cursor-pointer ${fieldCls("city")}`}>
          <option value="">— Select City —</option>
          <option value="Dhaka">Dhaka</option>
          <option value="Chattogram">Chattogram</option>
        </select>
        {errors.city && <p className="text-red-700 text-xs mt-1.5">Please select your city.</p>}
      </div>

      <div className="mb-[22px]">
        <label className="block font-body text-[0.82rem] text-ink mb-2 tracking-wide">
          Delivery Address <span className="text-gold">*</span>
        </label>
        <textarea value={form.address} onChange={set("address")} rows={2} placeholder="Detailed address — house, road, area, thana" className={`resize-y min-h-[56px] ${fieldCls("address")}`} />
        {errors.address && <p className="text-red-700 text-xs mt-1.5">Please enter your full delivery address.</p>}
      </div>

      <h3 className="font-display text-[1.5rem] font-semibold text-ink pb-3.5 mb-6 mt-5 border-b border-line">
        Payment Plan
      </h3>

      {/* HACK 2: Full pre-payment — featured, gold, with reward badge */}
      <button
        type="button"
        onClick={() => setPlan("full")}
        className={`relative w-full text-left bg-white rounded-xl p-6 mb-4 border-[1.5px] transition-all ${
          plan === "full" ? "border-gold shadow-[0_0_0_3px_rgba(184,134,47,.15)]" : "border-line hover:border-gold-soft"
        }`}
      >
        <span className="absolute -top-[11px] left-[22px] bg-gold text-white font-body text-[0.68rem] font-semibold tracking-[1.5px] uppercase px-3 py-1 rounded-full">
          Best Value
        </span>
        <span className={`absolute top-[22px] right-[22px] w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center ${plan === "full" ? "border-gold" : "border-line"}`}>
          <span className={`w-[11px] h-[11px] rounded-full bg-gold transition-transform ${plan === "full" ? "scale-100" : "scale-0"}`} />
        </span>
        <div className="font-display text-[1.3rem] font-semibold text-ink pr-10">{PLANS.full.title}</div>
        <div className="font-display text-[1.1rem] text-gold font-semibold mt-0.5">Pay {TK}{cratePrice.toLocaleString()} now</div>
        <span className="inline-flex items-center gap-1.5 bg-emerald-mid/10 text-emerald-mid font-body text-[0.8rem] font-semibold px-3 py-1.5 rounded-full mt-3">
          ⭐ {PLANS.full.rewardLabel}
        </span>
      </button>

      {/* HACK 1: Micro-commitment — no pure COD, ৳200 minimum */}
      <button
        type="button"
        onClick={() => setPlan("advance")}
        className={`relative w-full text-left bg-white rounded-xl p-6 mb-2 border-[1.5px] transition-all ${
          plan === "advance" ? "border-emerald shadow-[0_0_0_3px_rgba(26,58,42,.1)]" : "border-line hover:border-gold-soft"
        }`}
      >
        <span className={`absolute top-[22px] right-[22px] w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center ${plan === "advance" ? "border-emerald" : "border-line"}`}>
          <span className={`w-[11px] h-[11px] rounded-full bg-emerald transition-transform ${plan === "advance" ? "scale-100" : "scale-0"}`} />
        </span>
        <div className="font-display text-[1.3rem] font-semibold text-ink pr-10">{PLANS.advance.title}</div>
        <div className="font-display text-[1.1rem] text-gold font-semibold mt-0.5">Pay {TK}{advanceMin} now</div>
        <p className="text-[0.86rem] text-ink-soft mt-1.5 leading-relaxed">{PLANS.advance.desc}</p>
      </button>

      {errors.plan && <p className="text-red-700 text-xs mt-1.5">Please choose a payment plan.</p>}

      {/* bKash / Nagad number — trust signal at the decision moment */}
      <p className="text-center text-[0.82rem] text-ink-soft mt-4">
        Send payment to bKash / Nagad: <b className="text-emerald">{CONTACT.payment}</b> (personal)
      </p>

      {/* Payment progress */}
      {progress.active && (
        <div className="mt-[18px] mb-1.5">
          <div className="h-[5px] bg-line rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-[width] duration-[1600ms] ease-out" style={{ width: `${progress.pct}%`, background: "linear-gradient(90deg,#1A3A2A,#B8862F)" }} />
          </div>
          <p className="text-center text-[0.78rem] text-ink-soft mt-2">{progress.label}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-3 bg-emerald text-white font-display text-[1.2rem] font-semibold py-[17px] rounded-full tracking-wide shadow-[0_6px_24px_rgba(26,58,42,.3)] hover:bg-emerald-deep hover:-translate-y-0.5 transition-all disabled:opacity-65 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        {loading ? (
          <span className="inline-block w-5 h-5 border-[2.5px] border-white/35 border-t-white rounded-full animate-spin align-middle" />
        ) : (
          "Confirm Reservation"
        )}
      </button>

      <p className="text-center text-[0.78rem] text-ink-soft mt-4 tracking-wide">
        🔒 Secure Checkout via SSLCommerz · bKash · Nagad · Card
      </p>
    </div>
  );
}
