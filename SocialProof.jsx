"use client";

import { useEffect, useState } from "react";

// Rotating social-proof popups build trust at the moment of hesitation.
// Names span Dhaka & Chattogram affluent areas to mirror the target audience.
const PROOF = [
  { name: "Farhan", area: "Gulshan", kg: "10kg" },
  { name: "Nusrat", area: "Dhanmondi", kg: "10kg" },
  { name: "Dr. Rahman", area: "Banani", kg: "10kg" },
  { name: "Tania", area: "Uttara", kg: "10kg" },
  { name: "Imran", area: "Agrabad, Ctg", kg: "10kg" },
  { name: "Sadia", area: "Bashundhara", kg: "10kg" },
  { name: "Kabir", area: "Khulshi, Ctg", kg: "10kg" },
];

export default function SocialProof() {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let cycle;
    const first = setTimeout(() => {
      setShow(true);
      cycle = setInterval(() => {
        setShow(false);
        setTimeout(() => {
          setIdx((i) => (i + 1) % PROOF.length);
          setShow(true);
        }, 600);
      }, 11000);
    }, 3500);

    return () => {
      clearTimeout(first);
      clearInterval(cycle);
    };
  }, []);

  const d = PROOF[idx];

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 flex items-center gap-3.5 max-w-[320px] bg-cream-card border border-line rounded-xl px-[18px] py-3.5 shadow-card transition-transform duration-500 ${
        show ? "translate-x-0" : "-translate-x-[130%]"
      }`}
    >
      <div className="w-[38px] h-[38px] rounded-full bg-emerald text-gold-soft flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
          <path
            d="M3 7h11v8H3zM14 10h4l3 3v2h-7zM7 19a2 2 0 100-4 2 2 0 000 4zM18 19a2 2 0 100-4 2 2 0 000 4z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="text-[0.82rem] leading-snug text-ink">
        <b className="text-emerald font-semibold">{d.name}</b> from {d.area} just
        pre-ordered a {d.kg} crate.
        <span className="block text-[0.7rem] text-ink-soft mt-0.5 tracking-wide">
          Just now
        </span>
      </div>
    </div>
  );
}
