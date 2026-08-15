"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Temanın (Arpeggio) kaydırma hissi: ham tarayıcı kaydırması yerine ivmeli,
 * ağırlaştırılmış yumuşak kaydırma.
 *
 * Neden Lenis: gerçek scroll konumunu sürer (transform hilesi değil), bu yüzden
 * `position: sticky`, IntersectionObserver (Reveal/MediaReveal) ve çapa linkleri
 * bozulmadan çalışmaya devam eder.
 *
 * Erişilebilirlik: "hareketi azalt" tercihi açıksa hiç devreye girmez —
 * tarayıcının kendi kaydırması kalır.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const azalt = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (azalt.matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      // Yumuşak duruş eğrisi — sonda yavaşlayarak durur
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
      // Dokunmatikte tarayıcının kendi kaydırması daha iyi hissettiriyor
      syncTouch: false,
    });

    let kare = 0;
    const dongu = (zaman: number) => {
      lenis.raf(zaman);
      kare = requestAnimationFrame(dongu);
    };
    kare = requestAnimationFrame(dongu);

    return () => {
      cancelAnimationFrame(kare);
      lenis.destroy();
    };
  }, []);

  return null;
}
