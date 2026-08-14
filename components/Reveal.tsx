"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.32, 0.72, 0, 1] as const;

/*
 * Not: variant'ın kendi transition'ı component transition prop'unu EZER;
 * bu yüzden delay, `custom` üzerinden variant fonksiyonuna taşınır.
 */
const fadeVariants: Variants = {
  hidden: { y: 64, opacity: 0, filter: "blur(6px)" },
  visible: (delay: number = 0) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: EASE, delay },
  }),
};

/*
 * Maske reveal: içerik, kırpan kutunun içinden yukarı kayarak çıkar.
 * KRİTİK: whileInView DIŞ (kırpılmayan) katmanda durur; iç katman variant
 * kalıtımıyla oynar. Gözlemci kırpılmış iç katmana konursa eleman "hiç
 * görünmez" sayılır ve animasyon asla tetiklenmez (IO, overflow-hidden
 * atalarına göre kesişim ölçer).
 */
const maskInnerVariants: Variants = {
  hidden: { y: "112%" },
  visible: (delay: number = 0) => ({
    y: 0,
    transition: { duration: 1.15, ease: EASE, delay },
  }),
};

/* Hareket azaltma tercihi: hareketsiz ama yine de yumuşak bir görünüş. */
const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: Math.min(delay, 0.2) },
  }),
};

/**
 * Scroll'da giriş animasyonu.
 * - varsayılan: ağır fade-up + blur çözülmesi
 * - mask: başlıklar için maskeden kayarak çıkış (temanın imza davranışı)
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  mask = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  mask?: boolean;
}) {
  const reduced = useReducedMotion();

  if (mask && !reduced) {
    return (
      <motion.div
        className={`overflow-hidden ${className ?? ""}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {/* pb: ğ/ç/y gibi harf kuyrukları kırpılmasın */}
        <motion.div
          className="reveal pb-[0.12em]"
          variants={maskInnerVariants}
          custom={delay}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`reveal ${className ?? ""}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={reduced ? reducedVariants : fadeVariants}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}
