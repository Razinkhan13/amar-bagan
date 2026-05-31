"use client";

import { useEffect } from "react";
import { initPixel } from "@/lib/pixel";

// Mounts once at the app root and injects the Pixel base code. A
// no-op when NEXT_PUBLIC_META_PIXEL_ID is unset, so it is safe in
// every environment.
export default function MetaPixel() {
  useEffect(() => {
    initPixel();
  }, []);
  return null;
}
