"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Sayfa geçiş animasyonu (temadaki route değişim davranışı):
 * her navigasyonda içerik yumuşak bir fade + yükselişle gelir.
 * DOM yapısı reduced-motion durumunda da sabittir (hydration uyumu);
 * `reveal` sınıfı, JS kapalıyken noscript CSS'inin içeriği görünür
 * kılması içindir.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="reveal"
      initial={reduced ? false : { opacity: 0, y: 28 }}
      animate={reduced ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}
