"use client";

import { useEffect, useState } from "react";
import { BrandLockup } from "./Brand";

export default function Navbar({ onOrderClick }) {
  const [onHero, setOnHero] = useState(true);

  useEffect(() => {
    function handleScroll() {
      const hero = document.getElementById("hero");
      if (!hero) {
        setOnHero(false);
        return;
      }
      const heroBottom = hero.offsetTop + hero.offsetHeight - 80;
      setOnHero(window.scrollY < heroBottom);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 h-[70px] flex items-center justify-between px-5 sm:px-10 lg:px-14 transition-colors duration-300 ${
        onHero
          ? "bg-transparent border-b border-transparent"
          : "bg-cream/90 backdrop-blur-md border-b border-line/60"
      }`}
    >
      <button onClick={() => scrollTo("hero")} aria-label="Amar Bagan home">
        <BrandLockup light={onHero} />
      </button>

      <div className="flex items-center gap-8">
        <button
          onClick={() => scrollTo("story-section")}
          className={`hidden md:inline font-body text-[0.92rem] tracking-wide transition-colors hover:text-gold ${
            onHero ? "text-white" : "text-ink"
          }`}
        >
          Our Story
        </button>
        <button
          onClick={() => scrollTo("orchard-section")}
          className={`hidden md:inline font-body text-[0.92rem] tracking-wide transition-colors hover:text-gold ${
            onHero ? "text-white" : "text-ink"
          }`}
        >
          The Orchard
        </button>
        <button
          onClick={onOrderClick}
          className="bg-emerald text-white font-body text-[0.88rem] px-6 py-[11px] rounded-full tracking-wide hover:bg-emerald-deep hover:-translate-y-0.5 transition-all whitespace-nowrap"
        >
          Order Family Crate
        </button>
      </div>
    </nav>
  );
}
