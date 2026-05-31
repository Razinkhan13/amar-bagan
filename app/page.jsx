"use client";

import { useState, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import OrchardSection from "@/components/OrchardSection";
import FarmerSpotlight from "@/components/FarmerSpotlight";
import Footer from "@/components/Footer";
import SocialProof from "@/components/SocialProof";
import OrderConfirmation from "@/components/OrderConfirmation";
import { submitOrder } from "@/lib/orders";
import { captureReferralFromUrl, recordReferralClick, creditReferralOrder } from "@/lib/referrals";
import { trackPurchase, trackReferralVisit } from "@/lib/pixel";

export default function Home() {
  const [view, setView] = useState("landing"); // "landing" | "confirm"
  const [order, setOrder] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [referralCode, setReferralCode] = useState(null);

  // On first load, capture any ?ref= code, remember it for this session,
  // record the click against the promoter, and tell the Pixel.
  useEffect(() => {
    const code = captureReferralFromUrl();
    if (code) {
      setReferralCode(code);
      recordReferralClick(code);
      trackReferralVisit(code);
    }
  }, []);

  const scrollToCheckout = useCallback(() => {
    setView("landing");
    setTimeout(() => {
      document.getElementById("orchard-section")?.scrollIntoView({ behavior: "smooth" });
    }, 60);
  }, []);

  // The real Firestore write, now carrying referral attribution. On
  // success we fire the dynamic Pixel Purchase event with the actual
  // amount paid, and credit the referring promoter (if any).
  const handleConfirm = useCallback(
    async (orderData) => {
      const withRef = { ...orderData, referralCode: referralCode || null };

      let newId;
      try {
        newId = await submitOrder(withRef);
      } catch (err) {
        if (err?.message?.includes("minimum advance")) throw err;
        // eslint-disable-next-line no-console
        console.warn("[AmarBagan] Firestore unavailable, mock id:", err?.message);
        newId = "AB" + Date.now().toString(36).toUpperCase();
      }

      // THE AI-learner signal: fire Purchase with the real value paid.
      trackPurchase({
        value: withRef.amountPaidAdvance,
        plan: withRef.paymentPlan,
        orderId: newId,
      });

      // Credit the promoter who drove this order.
      if (referralCode) {
        creditReferralOrder(referralCode, withRef.amountPaidAdvance);
      }

      setOrder(withRef);
      setOrderId(newId);
      setView("confirm");
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [referralCode]
  );

  const goHome = useCallback(() => {
    setView("landing");
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  if (view === "confirm") {
    return (
      <>
        <Navbar onOrderClick={goHome} />
        <OrderConfirmation order={order} orderId={orderId} onHome={goHome} />
      </>
    );
  }

  return (
    <>
      <Navbar onOrderClick={scrollToCheckout} />
      <Hero onOrderClick={scrollToCheckout} />
      <OrchardSection onConfirm={handleConfirm} />
      <FarmerSpotlight />
      <Footer />
      <SocialProof />
    </>
  );
}
