"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "@/components/motion";

/*
 * EASE artık components/motion.ts'ten geliyor. Burada kendi eğrisi vardı
 * ([0.32, 0.72, 0, 1]) — referansın eğrisine geçişte ATLANMIŞTI, yani sayfa
 * geçişi sitenin geri kalanından FARKLI bir ivmeyle hareket ediyordu
 * (2026-09-02'de yakalandı).
 */

/**
 * Sayfa geçişi — SADE: yalnız içeriğin solarak gelmesi.
 *
 * ⚠️ 2026-09-11'de LACİVERT SÜPÜRME PANELİ KALDIRILDI. Yakup üç kez bildirdi:
 * "blog sayfasının açılış animasyonu... ana sayfadaki slider şeklinde
 * açılıyor." Blog hero'sundaki `HeroZoom` zaten kaldırılmıştı ve canlıda
 * doğrulandı (görsel sarmalayıcısız basılıyor, `scale(1.28)` yok) — kalan
 * hareket buradaki panelden geliyordu: ekranı kaplayan lacivert bir katman
 * her gezinmede yukarı doğru süpürülüyordu, yani her sayfa "slider gibi"
 * açılıyordu.
 *
 * Bu dosyanın kendi eski yorumu paneli "temadaki route değişiminin ÜSTÜNE
 * ÇIKAN sürüm" diye tanımlıyordu — yani master'dan ölçülmemiş, bilerek
 * eklenmiş bir fazlalıktı. "Birebir master" hedefiyle çelişiyordu.
 *
 * Geriye içeriğin solarak gelmesi kaldı; `y` kaydırması da kalktı çünkü
 * hero'su tam ekran olan sayfalarda görsel aşağıdan yukarı kayıyor gibi
 * duruyordu — "slider" hissinin ikinci kaynağı buydu.
 *
 * GERİ ALINABİLİR: panel silinmedi, aşağıdaki blok yorumda duruyor.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  /*
   * KALDIRILAN PANEL (geri istenirse bu bloğu geri koymak yeterli):
   *   <motion.div
   *     aria-hidden
   *     className="pointer-events-none fixed inset-0 z-30 bg-navy"
   *     initial={reduced ? { opacity: 0 } : { y: 0 }}
   *     animate={reduced ? { opacity: 0 } : { y: "-100%" }}
   *     transition={{ duration: 0.85, ease: EASE, delay: 0.05 }}
   *   />
   */
  return (
    <motion.div
      className="reveal"
      initial={reduced ? false : { opacity: 0 }}
      animate={reduced ? undefined : { opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
