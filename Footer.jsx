import { CONTACT } from "@/lib/constants";
import { BrandMark } from "./Brand";

export default function Footer() {
  return (
    <footer id="contact-section" className="bg-emerald-deep text-white/70 mt-10">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-10 lg:px-14 py-14">
        <div className="grid md:grid-cols-[1.2fr_1fr_1fr] gap-10">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <BrandMark light />
              <span className="font-display text-[1.3rem] font-bold text-white">Amar Bagan</span>
            </div>
            <p className="text-[0.9rem] leading-relaxed text-white/60 max-w-[280px]">
              Pure, chemical-free mango heritage — hand-picked from our ancestral
              orchards in Rajshahi and delivered across Dhaka &amp; Chattogram.
            </p>
          </div>

          {/* Order & Pay column */}
          <div>
            <h4 className="font-display text-[1.1rem] text-white mb-4">Order &amp; Pay</h4>
            <ul className="space-y-3 text-[0.9rem]">
              <li>
                <a href={`https://wa.me/${CONTACT.whatsappDigits}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-gold-soft transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17 15c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.6.9-.8 1-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.3-.5-.5-.9-1.1-1.2-1.7-.1-.2 0-.4.1-.5l.4-.5c.1-.1.1-.3.2-.4 0-.1 0-.3 0-.4 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.6.6-1 1.4-1 2.2.1 1 .5 2 1.1 2.8 1.1 1.6 2.5 2.9 4.3 3.6.5.2 1 .4 1.5.5.6.2 1.1.1 1.6.1.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.4-.2zM12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.3A10 10 0 1012 2z"/></svg>
                  WhatsApp: {CONTACT.whatsappDisplay}
                </a>
              </li>
              <li className="text-white/60">
                bKash / Nagad: <b className="text-white/85">{CONTACT.payment}</b>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="hover:text-gold-soft transition-colors break-all">
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Follow column */}
          <div>
            <h4 className="font-display text-[1.1rem] text-white mb-4">Follow the Orchard</h4>
            <ul className="space-y-3 text-[0.9rem]">
              <li>
                <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-gold-soft transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0022 12z"/></svg>
                  Facebook Page
                </a>
              </li>
              <li>
                <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-gold-soft transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                  {CONTACT.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-wrap justify-between items-center gap-3 text-[0.82rem] text-white/50">
          <span>© 2024 Amar Bagan / <span className="font-bn">আমার বাগান</span>. Pure Mango Heritage.</span>
          <span>100% Chemical Free · Export Quality · Formalin Free</span>
        </div>
      </div>
    </footer>
  );
}
