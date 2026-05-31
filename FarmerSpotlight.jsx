import Image from "next/image";

export default function FarmerSpotlight() {
  return (
    <section id="story-section" className="px-5 sm:px-10 lg:px-14 pb-16 sm:pb-24">
      <div className="max-w-[1100px] mx-auto bg-cream-card border border-line rounded-xl overflow-hidden grid md:grid-cols-[1fr_1.2fr] shadow-soft">
        {/* Real farmer photograph from the Rajshahi orchard */}
        <div className="relative min-h-[320px] md:min-h-[420px]">
          <Image
            src="/farmer-spotlight.png"
            alt="Farhan, the farmer who tends the Amar Bagan orchard, holding freshly picked mangoes"
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
          />
        </div>

        <div className="p-8 sm:p-10 lg:p-[52px]">
          <div className="font-body text-[0.74rem] tracking-[3px] uppercase text-gold mb-3.5">
            Farmer Spotlight
          </div>
          <h2 className="font-display font-bold text-emerald leading-[1.1] mb-3.5" style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)" }}>
            The Hands Behind Your Harvest
          </h2>
          <p className="font-body italic text-[1.15rem] text-ink mb-[22px]">
            Meet Farhan, who has been nurturing these trees for over two decades.
          </p>
          <p className="relative pl-7 text-[0.98rem] text-ink-soft leading-[1.75] mb-[18px]">
            <span className="absolute -left-1 -top-3 font-display text-5xl text-gold/50">“</span>
            It is an honor to nurture these trees for your family. Every mango we
            hand-pick carries the legacy of our land and the warmth of our care.
            Assalamualaikum.
          </p>
          <div className="font-bn text-gold text-[1.05rem] mb-[22px]">— ফারহান মিয়া</div>
        </div>
      </div>
    </section>
  );
}
