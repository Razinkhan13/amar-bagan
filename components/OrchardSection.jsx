import CheckoutForm from "./CheckoutForm";

export default function OrchardSection({ onConfirm }) {
  return (
    <section id="orchard-section" className="px-5 sm:px-10 lg:px-14 py-16 sm:py-24">
      <div className="max-w-[760px] mx-auto">
        <div className="text-center mb-12">
          <div className="ornament mb-2">
            <span className="font-bn text-[0.9rem]">আমার বাগান</span>
          </div>
          <div className="font-body text-[0.74rem] tracking-[3px] uppercase text-gold mb-3">
            Limited Seasonal Availability
          </div>
          <h2 className="font-display font-bold text-emerald leading-[1.1] mb-3.5" style={{ fontSize: "clamp(2rem,4vw,2.9rem)" }}>
            Secure Your Harvest
          </h2>
          <p className="text-ink-soft text-[1.05rem] max-w-[480px] mx-auto">
            Reserve your family crate today. Every crate is hand-picked only after
            your order is confirmed — nothing sits in cold storage.
          </p>
        </div>

        <CheckoutForm onConfirm={onConfirm} />
      </div>
    </section>
  );
}
