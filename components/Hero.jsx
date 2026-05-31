"use client";

import Image from "next/image";

export default function Hero({ onOrderClick }) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 overflow-hidden"
    >
      {/* Real orchard photograph as hero background */}
      <Image
        src="/hero-orchard.png"
        alt="Amar Bagan farmer hand-picking mangoes in the Rajshahi orchard"
        fill
        priority
        sizes="100vw"
        className="object-cover z-0"
      />
      {/* Emerald gradient scrim so white headline stays legible and the
          section blends into the cream body below */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(18,40,29,.72) 0%, rgba(18,40,29,.40) 38%, rgba(18,40,29,.30) 62%, rgba(247,243,233,.55) 88%, #F7F3E9 100%)",
        }}
      />

      <div className="relative z-10 max-w-[760px]">
        <span className="inline-block font-body text-[0.72rem] tracking-[3px] uppercase text-white bg-gold/85 px-[18px] py-[7px] rounded-full mb-7 animate-fadeUp">
          100% Chemical Free · Export Quality
        </span>
        <h1
          className="font-display font-bold text-white leading-[1.05] mb-[22px] animate-fadeUp"
          style={{
            fontSize: "clamp(2.6rem, 7vw, 5rem)",
            textShadow: "0 2px 30px rgba(0,0,0,.45)",
            animationDelay: ".1s",
          }}
        >
          The <em className="italic text-gold-soft">Unadulterated</em>
          <br />
          Luxury of Nature
        </h1>
        <p
          className="font-body text-white/95 max-w-[560px] mx-auto mb-[38px] leading-[1.7] animate-fadeUp"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.18rem)",
            textShadow: "0 1px 14px rgba(0,0,0,.4)",
            animationDelay: ".2s",
          }}
        >
          Chemical-free, formalin-free mangoes hand-picked from our ancestral
          orchards in Rajshahi — delivered pristine to your door in Dhaka &amp;
          Chattogram.
        </p>
        <div className="animate-fadeUp" style={{ animationDelay: ".3s" }}>
          <button
            onClick={onOrderClick}
            className="inline-flex items-center gap-[10px] bg-gold text-white font-body text-[1.02rem] px-10 py-4 rounded-full shadow-gold hover:bg-gold-soft hover:-translate-y-0.5 transition-all"
          >
            🥭 Order Family Crate
          </button>
        </div>
      </div>
    </section>
  );
}
