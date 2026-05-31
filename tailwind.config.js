/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Amar Bagan heritage palette
        emerald: {
          DEFAULT: "#1A3A2A",
          deep:    "#12281D",
          mid:     "#2D5A3D",
          light:   "#3D7A52",
        },
        cream: {
          DEFAULT: "#F7F3E9",
          card:    "#FBF8F0",
          deep:    "#EFEADD",
        },
        gold: {
          DEFAULT: "#B8862F",
          soft:    "#C99B47",
          bg:      "#F3E4C4",
        },
        ink: {
          DEFAULT: "#2A2620",
          soft:    "#6B655A",
        },
        line: "#E4DCC8",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        body:    ["var(--font-lora)", "serif"],
        bn:      ["var(--font-hind)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 12px rgba(42,38,32,.06)",
        card: "0 8px 40px rgba(42,38,32,.10)",
        gold: "0 8px 30px rgba(184,134,47,.45)",
      },
      keyframes: {
        fadeUp:   { "0%": { opacity: 0, transform: "translateY(24px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        fadeIn:   { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        popIn:    { "0%": { transform: "scale(0)", opacity: 0 }, "100%": { transform: "scale(1)", opacity: 1 } },
        floatY:   { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        slideInL: { "0%": { opacity: 0, transform: "translateX(-40px)" }, "100%": { opacity: 1, transform: "translateX(0)" } },
        spin:     { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        fadeUp:   "fadeUp .7s cubic-bezier(.4,0,.2,1) both",
        fadeIn:   "fadeIn .5s ease both",
        popIn:    "popIn .5s cubic-bezier(.34,1.56,.64,1) both",
        floatY:   "floatY 5s ease-in-out infinite",
        slideInL: "slideInL .4s ease both",
        spin:     "spin .7s linear infinite",
      },
    },
  },
  plugins: [],
};
