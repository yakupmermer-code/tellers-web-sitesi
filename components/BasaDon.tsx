"use client";

import { basaDon } from "@/components/SmoothScroll";

/**
 * Footer'ın sağ alt köşesindeki "başa dön" butonu (referans temadaki karşılığı:
 * 48x48 çerçeveli kare + yukarı ok).
 * Kaydırmayı doğrudan Lenis'e devreder — bkz. SmoothScroll.basaDon().
 */
export default function BasaDon() {
  return (
    <button
      type="button"
      onClick={basaDon}
      aria-label="Sayfanın başına dön"
      // `hairline` DEĞİL: o kural @layer dışında olduğu için hover:border-*'ı
      // sessizce eziyordu (code-reviewer bulgusu, 2026-09-02). İkisi de utility
      // olunca hover gerçekten çalışıyor.
      className="group inline-flex h-12 w-12 items-center justify-center border border-navy/12 bg-white transition-colors duration-500 ease-[var(--ease-lux)] hover:border-navy/40"
    >
      <span
        aria-hidden="true"
        className="inline-block text-[18px] leading-none text-navy transition-transform duration-500 ease-[var(--ease-lux)] group-hover:-translate-y-1"
      >
        ↑
      </span>
    </button>
  );
}
