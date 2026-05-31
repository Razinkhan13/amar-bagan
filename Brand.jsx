import Image from "next/image";

// The real Amar Bagan mark: emerald leaf forming a stylized "A".
// The supplied logo is a full lockup on a cream square; for the compact icon
// we crop tight to the leaf-A mark. On the dark hero we drop it onto a soft
// cream disc with a gold ring so it reads against the photograph.
export function BrandMark({ size = 40, light = false }) {
  return (
    <div
      className="flex items-center justify-center rounded-full flex-shrink-0 overflow-hidden transition-colors"
      style={{
        width: size,
        height: size,
        background: light ? "#FBF8F0" : "#FBF8F0",
        border: light ? "1.5px solid rgba(255,255,255,.6)" : "1.5px solid #E4DCC8",
      }}
    >
      <Image
        src="/logo.png"
        alt="Amar Bagan logo"
        width={size * 2}
        height={size * 2}
        priority
        style={{
          objectFit: "cover",
          transform: "scale(1.7)",
          objectPosition: "center 34%",
        }}
      />
    </div>
  );
}

export function BrandLockup({ light = false }) {
  return (
    <div className="flex items-center gap-3">
      <BrandMark light={light} />
      <div className="flex flex-col leading-none">
        <span
          className={`font-display text-[1.45rem] font-bold tracking-tight transition-colors ${
            light ? "text-white" : "text-emerald"
          }`}
        >
          Amar Bagan
        </span>
        <span className="font-bn text-[0.68rem] text-gold tracking-wide">
          আমার বাগান · Pure Mango Heritage
        </span>
      </div>
    </div>
  );
}

// Full centered logo (image only) for splash / footer use.
export function BrandLogoFull({ width = 180 }) {
  return (
    <Image
      src="/logo.png"
      alt="Amar Bagan — আমার বাগান"
      width={width}
      height={width}
      style={{ height: "auto" }}
    />
  );
}
