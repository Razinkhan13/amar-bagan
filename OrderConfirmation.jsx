"use client";

import Image from "next/image";
import { PRICING, CONTACT } from "@/lib/constants";

const TK = PRICING.currencySymbol;

export default function OrderConfirmation({ order, orderId, onHome }) {
  const isFull = order?.paymentPlan === "full_prepayment";
  const firstName = order?.customerName?.split(" ")[0] || "friend";

  function shareVia(platform) {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    const text =
      "🥭 I just secured my harvest from Amar Bagan — pure, chemical-free heritage mangoes from Rajshahi! Join the orchard:";
    if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank", "noopener");
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank", "noopener");
    } else {
      navigator.clipboard?.writeText(text + " " + url);
      alert("Link copied — paste it into your Instagram story!");
    }
  }

  return (
    <div className="pt-[70px] min-h-screen animate-fadeIn">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-10 lg:px-14 py-12 sm:py-[72px]">
        {/* Confirmation hero */}
        <div className="text-center mb-14">
          <div className="w-[58px] h-[58px] rounded-full bg-gold-bg text-gold flex items-center justify-center mx-auto mb-[26px] animate-popIn">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-display font-bold text-emerald leading-[1.08] mb-[18px]" style={{ fontSize: "clamp(2.2rem,5vw,3.4rem)" }}>
            Your Harvest is being Nurtured
          </h1>
          <p className="text-ink-soft text-[1.05rem] max-w-[560px] mx-auto leading-[1.7]">
            Assalamualaikum {firstName}. Your personal harvest from our ancestral
            orchard in Rajshahi is now being prepared. Our farmers are hand-picking
            the finest mangoes specifically for your crate.
          </p>
        </div>

        <div className="ornament mb-10"><span className="font-bn text-[0.9rem]">আমার বাগান</span></div>

        <div className="grid md:grid-cols-[1.1fr_.9fr] gap-7 items-start">
          {/* Harvest photo */}
          <div className="relative rounded-xl overflow-hidden shadow-card min-h-[380px]">
            <Image src="/farmer-spotlight.png" alt="Freshly hand-picked mangoes from the orchard" fill sizes="(max-width:768px) 100vw, 55vw" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 p-10 pb-6" style={{ background: "linear-gradient(to top, rgba(18,40,29,.85), transparent)" }}>
              <div className="font-bn text-gold-soft text-[0.8rem] tracking-wide">রাজশাহীর বাগান থেকে</div>
              <h3 className="font-display text-[1.5rem] font-semibold text-white">Hand-picked, just for you</h3>
            </div>
          </div>

          {/* Aside */}
          <div className="flex flex-col gap-6">
            {/* Details */}
            <div className="bg-cream-card border border-line rounded-xl p-7 shadow-soft">
              <h3 className="font-display text-[1.4rem] font-semibold text-ink pb-3.5 mb-1 border-b border-line">Harvest Crate Details</h3>
              {[
                ["Order Reference", (orderId || "—").slice(0, 10).toUpperCase(), "gold"],
                ["Selected Crate", order?.selectedProduct || PRICING.crateName],
                ["Amount Paid", `${TK}${(order?.amountPaidAdvance ?? 0).toLocaleString()}`, "gold"],
                ["Balance on Delivery", `${TK}${(order?.balanceDue ?? 0).toLocaleString()}`],
                ["Farmer-to-Table Promise", "Verified Organic"],
              ].map(([k, v, gold], i) => (
                <div key={i} className="flex justify-between items-center py-3.5 border-b border-line last:border-0">
                  <span className="text-[0.9rem] text-ink-soft">{k}</span>
                  <span className={`font-body font-semibold text-[0.95rem] text-right ${gold ? "text-gold" : "text-ink"}`}>{v}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-3.5">
                <span className="text-[0.9rem] text-ink-soft">Heritage Reward</span>
                <span className="bg-gold-bg text-gold font-semibold text-[0.82rem] px-3 py-1 rounded-full">
                  {isFull ? `+ ${PRICING.prepayBonusKg}kg Complimentary` : "Standard crate"}
                </span>
              </div>
            </div>

            {/* Journey timeline */}
            <div className="bg-cream-deep rounded-xl p-7">
              <div className="font-body text-[0.72rem] tracking-[2.5px] uppercase text-gold mb-[22px]">Journey to You</div>
              {[
                ["Harvesting Today", "Hand-picked from the northern blocks.", true],
                ["Quality Check", "Ensuring premium ripeness, formalin-free.", false],
                ["Direct Delivery", "Journeying to your doorstep.", false],
              ].map(([t, d, active], i, arr) => (
                <div key={i} className={`flex gap-4 relative ${i < arr.length - 1 ? "pb-[26px]" : ""}`}>
                  {i < arr.length - 1 && <span className="absolute left-[6px] top-[18px] bottom-0 w-[1.5px] bg-[#C7BFA8]" />}
                  <span className={`w-3.5 h-3.5 rounded-full flex-shrink-0 mt-1 z-10 ${active ? "bg-gold shadow-[0_0_0_4px_rgba(184,134,47,.2)]" : "bg-[#C7BFA8]"}`} />
                  <div>
                    <h4 className="font-body text-[0.98rem] font-semibold text-ink">{t}</h4>
                    <p className="text-[0.84rem] text-ink-soft mt-0.5">{d}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Invite */}
            <div className="bg-emerald text-white rounded-xl p-7">
              <h3 className="font-display text-[1.45rem] font-semibold mb-2.5">Invite others to the orchard</h3>
              <p className="text-[0.88rem] text-white/75 leading-relaxed mb-5">
                The sweetest harvests are shared. Invite your friends and family to
                join our heritage and experience the gold of Amar Bagan.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {["whatsapp", "facebook", "instagram"].map((p) => (
                  <button key={p} onClick={() => shareVia(p)} className="inline-flex items-center gap-2 bg-white text-emerald-deep font-body text-[0.84rem] font-semibold px-[18px] py-2.5 rounded-full hover:-translate-y-0.5 hover:shadow-lg transition-all capitalize">
                    {p}
                  </button>
                ))}
              </div>

              {/* Become a promoter — captured at the moment of highest
                  enthusiasm, right after a successful order. */}
              <a href="/affiliate"
                className="mt-5 inline-flex items-center gap-2 text-gold-soft font-body text-[0.88rem] font-semibold border-b border-gold-soft/50 pb-1 hover:gap-3 transition-all">
                Earn rewards — get your referral link →
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button onClick={onHome} className="inline-flex items-center gap-2.5 bg-emerald text-white font-body text-base px-9 py-[15px] rounded-full shadow-[0_6px_24px_rgba(26,58,42,.3)] hover:bg-emerald-deep hover:-translate-y-0.5 transition-all">
            ← Return to the Orchard
          </button>
        </div>
      </div>
    </div>
  );
}
