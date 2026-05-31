import "./globals.css";
import MetaPixel from "@/components/MetaPixel";

export const metadata = {
  title: "Amar Bagan — Pure Mango Heritage from Rajshahi",
  description:
    "Chemical-free, formalin-free mangoes hand-picked from our ancestral orchards in Rajshahi. Delivered pristine to your door in Dhaka & Chattogram.",
  openGraph: {
    title: "Amar Bagan — Pure Mango Heritage",
    description: "The unadulterated luxury of nature, delivered from our Rajshahi orchard.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts loaded via stylesheet rather than next/font, so the build
            never depends on a build-time fetch to Google's servers. The
            CSS variables below map onto the Tailwind font families. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Hind+Siliguri:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-cream text-ink">
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
