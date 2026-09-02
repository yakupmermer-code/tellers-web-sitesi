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
/**
 * Çalışan Lenis örneği. Lenis her karede kaydırma konumunu KENDİ hesabına göre
 * yazdığı için `window.scrollTo` ile yarışır; bu yüzden "başa dön" gibi
 * programatik kaydırmalar Lenis'in kendi API'sinden geçmek zorunda.
 * Modül düzeyinde tutuluyor: layout'taki <SmoothScroll /> ile footer'daki
 * buton aynı istemci paketini paylaşır, dolayısıyla aynı örneği görür.
 */
let etkinLenis: Lenis | null = null;

/** Sayfanın en üstüne döner. Lenis kapalıysa tarayıcının kendi kaydırması. */
export function basaDon() {
  if (etkinLenis) {
    etkinLenis.scrollTo(0, { duration: 1.2 });
    return;
  }
  const azalt = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: azalt ? "auto" : "smooth" });
}

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
    etkinLenis = lenis;

    let kare = 0;
    const dongu = (zaman: number) => {
      lenis.raf(zaman);
      kare = requestAnimationFrame(dongu);
    };
    kare = requestAnimationFrame(dongu);

    return () => {
      cancelAnimationFrame(kare);
      lenis.destroy();
      // Sadece KENDİ örneğini sil. Bugün tek <SmoothScroll /> var; ileride
      // ikincisi eklenirse A'nın unmount'u B'nin çalışan örneğini silmesin
      // (silseydi "başa dön" sessizce Lenis'le yarışan yedek yola düşerdi).
      if (etkinLenis === lenis) etkinLenis = null;
    };
  }, []);

  return null;
}
