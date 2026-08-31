"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE, SURE } from "./motion";

/**
 * Scroll'da giriş animasyonu: aşağıdan hafifçe yukarı + solma.
 *
 * Değerler referans temanın (arpeggio-ashen.vercel.app) sunucu çıktısından
 * birebir ölçüldü: `opacity:0; translateY(24px)`, süre .9sn, ease [.22,1,.36,1],
 * `viewport {once:true, amount:.25}`.
 *
 * ÖNCEKİ HÂLİ (2026-08-31'de düzeltildi): y=64px ve `blur(6px)` vardı.
 * İkisi de referansta YOK; hareket bu yüzden daha ağır ve bulanık duruyordu.
 *
 * `mask` modu: içerik kırpan kutunun içinden yukarı kayarak çıkar (tek parça).
 * Referansın MaskLines'ı bunu SATIR SATIR yapar, ama satırları elle verilmiş
 * başlıklar için — bizim başlıklarımızın çoğu doğal sarıyor ve satır sınırı
 * ekran genişliğine göre değiştiği için statik olarak bilinemez. Satırları
 * açıkça belli olan başlıklarda (<br /> içerenler) MaskLines kullanılır.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  mask = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Referansta 16, 24 ve 28 px kullanılıyor; varsayılan 24. */
  y?: number;
  mask?: boolean;
}) {
  const reduced = useReducedMotion();

  if (mask && !reduced) {
    return (
      /* KRİTİK: whileInView DIŞ (kırpılmayan) katmanda durur. Gözlemci
         kırpılmış iç katmana konursa eleman "hiç görünmez" sayılır ve
         animasyon asla tetiklenmez. */
      <motion.div
        className={`overflow-hidden ${className ?? ""}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        {/* pb: ğ/ç/y/ş kuyrukları maskede kırpılmasın. 0.12em BİLEREK
            korunuyor — referansın fontunda ve dilinde bu kuyruklar yok, bizde
            "Nasıl Yaparız?" (96px, leading-1.02) gibi yerlerde p kesiliyor. */}
        <motion.div
          className="reveal pb-[0.12em]"
          variants={{
            hidden: { y: "110%" },
            visible: {
              y: 0,
              transition: { duration: SURE.maske, delay, ease: EASE },
            },
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`reveal ${className ?? ""}`}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: reduced ? 0.4 : SURE.reveal,
        delay: reduced ? Math.min(delay, 0.2) : delay,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
