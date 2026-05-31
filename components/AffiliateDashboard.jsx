"use client";

import { useState } from "react";
import {
  generateReferralCode,
  ensureReferral,
  findReferralByPhone,
  getReferralStats,
  referralLink,
} from "@/lib/referrals";
import { PRICING } from "@/lib/constants";
import { BrandLogoFull } from "@/components/Brand";

const TK = PRICING.currencySymbol;

// A promoter identifies themselves by name + phone. If they already
// have a code (matched by phone) they recover it; otherwise a new one
// is minted. This keeps the flow frictionless — no passwords — while
// still giving each promoter a stable, trackable link.
export default function AffiliateDashboard() {
  const [step, setStep] = useState("identify"); // "identify" | "dashboard"
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [copied, setCopied] = useState(false);

  async function handleStart() {
    setError(null);
    const phoneRx = /^(?:\+?88)?01[3-9]\d{8}$/;
    if (!name.trim()) return setError("Please enter your name.");
    if (!phoneRx.test(phone.replace(/[\s-]/g, ""))) return setError("Enter a valid Bangladeshi number.");

    setBusy(true);
    try {
      // Recover an existing code for this phone, or create a new one.
      let record = await findReferralByPhone(phone.trim());
      if (!record) {
        const code = generateReferralCode();
        await ensureReferral({ code, ownerName: name.trim(), ownerPhone: phone.trim() });
        record = await getReferralStats(code);
      }
      setStats(record);
      setStep("dashboard");
    } catch (e) {
      setError(
        e.message?.includes("not configured")
          ? "The referral system is not connected yet. Add your Firebase keys to enable it."
          : "Something went wrong: " + e.message
      );
    } finally {
      setBusy(false);
    }
  }

  async function refresh() {
    if (!stats?.code) return;
    setBusy(true);
    try {
      const fresh = await getReferralStats(stats.code);
      if (fresh) setStats(fresh);
    } finally {
      setBusy(false);
    }
  }

  const link = stats ? referralLink(stats.code) : "";

  function copyLink() {
    navigator.clipboard?.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function shareWhatsApp() {
    const text = `🥭 I order my mangoes from Amar Bagan — pure, chemical-free heritage fruit from Rajshahi. Order through my link and we both get rewarded: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  if (step === "identify") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-6">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center"><BrandLogoFull width={150} /></div>
          <h1 className="font-display text-3xl font-bold text-emerald mt-6">Become a Promoter</h1>
          <p className="text-ink-soft mt-2 mb-8">
            Share Amar Bagan with friends and family. Earn rewards each time
            someone orders through your personal link.
          </p>

          <div className="bg-cream-card border border-line rounded-xl p-7 shadow-soft text-left">
            <label className="block font-body text-[0.82rem] text-ink mb-2">Your Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name"
              className="w-full font-body text-[0.98rem] text-ink bg-transparent border-0 border-b-[1.5px] border-line py-2.5 px-0.5 outline-none focus:border-gold transition-colors mb-5" />

            <label className="block font-body text-[0.82rem] text-ink mb-2">Phone Number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXX-XXXXXX"
              className="w-full font-body text-[0.98rem] text-ink bg-transparent border-0 border-b-[1.5px] border-line py-2.5 px-0.5 outline-none focus:border-gold transition-colors mb-2" />

            {error && <p className="text-red-700 text-sm mt-3">{error}</p>}

            <button onClick={handleStart} disabled={busy}
              className="w-full mt-6 bg-emerald text-white font-display text-[1.1rem] font-semibold py-3.5 rounded-full hover:bg-emerald-deep transition-colors disabled:opacity-60">
              {busy ? "Setting up…" : "Get My Referral Link"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard view
  const reward = (stats?.confirmedOrders || 0) * 50; // illustrative ৳50 per confirmed order
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-emerald-deep text-white px-5 sm:px-10 py-5 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Promoter Dashboard</h1>
          <p className="text-white/60 text-sm">{stats?.ownerName} · {stats?.ownerPhone}</p>
        </div>
        <button onClick={refresh} disabled={busy}
          className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm px-4 py-2 rounded-full transition-colors disabled:opacity-50">
          {busy ? "Refreshing…" : "Refresh"}
        </button>
      </header>

      <div className="max-w-[820px] mx-auto px-5 sm:px-10 py-8">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Stat label="Link Clicks" value={stats?.clicks || 0} />
          <Stat label="Orders Driven" value={stats?.confirmedOrders || 0} gold />
          <Stat label="Reward Earned" value={`${TK}${reward.toLocaleString()}`} gold />
        </div>

        {/* The link */}
        <div className="bg-cream-card border border-line rounded-xl p-7 shadow-soft mb-6">
          <h2 className="font-display text-xl font-semibold text-ink mb-1">Your Referral Link</h2>
          <p className="text-ink-soft text-sm mb-4">Share this anywhere. Every order through it is credited to you.</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-white border border-line rounded-lg px-4 py-3 font-mono text-sm text-emerald break-all">
              {link}
            </div>
            <button onClick={copyLink}
              className="bg-emerald text-white text-sm font-semibold px-5 py-3 rounded-lg hover:bg-emerald-deep transition-colors whitespace-nowrap">
              {copied ? "Copied ✓" : "Copy Link"}
            </button>
          </div>

          <button onClick={shareWhatsApp}
            className="mt-4 inline-flex items-center gap-2 bg-gold text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gold-soft transition-colors">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17 15c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.6.9-.8 1-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.3-.5-.5-.9-1.1-1.2-1.7-.1-.2 0-.4.1-.5l.4-.5c.1-.1.1-.3.2-.4 0-.1 0-.3 0-.4 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.6.6-1 1.4-1 2.2.1 1 .5 2 1.1 2.8 1.1 1.6 2.5 2.9 4.3 3.6.5.2 1 .4 1.5.5.6.2 1.1.1 1.6.1.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.4-.2zM12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.3A10 10 0 1012 2z"/></svg>
            Share on WhatsApp
          </button>
        </div>

        {/* How it works */}
        <div className="bg-cream-deep rounded-xl p-7">
          <h3 className="font-display text-lg font-semibold text-emerald mb-3">How your rewards work</h3>
          <ol className="space-y-2 text-sm text-ink-soft list-decimal list-inside">
            <li>Share your link with friends, family, and your social channels.</li>
            <li>When someone opens it, the click is recorded here.</li>
            <li>When they confirm an order, it counts as an order driven.</li>
            <li>Your reward grows with every confirmed order you bring in.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, gold }) {
  return (
    <div className="bg-cream-card border border-line rounded-xl p-4 text-center">
      <div className="text-xs text-ink-soft uppercase tracking-wide">{label}</div>
      <div className={`font-display text-2xl font-bold mt-1 ${gold ? "text-gold" : "text-emerald"}`}>{value}</div>
    </div>
  );
}
