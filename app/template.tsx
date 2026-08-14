"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.32, 0.72, 0, 1] as const;

/**
 * Sayfa geçişi (temadaki route değişiminin üstüne çıkan sürüm):
 * lacivert bir panel sahneyi yukarı doğru süpürerek açar, içerik hafif
 * yükselerek gelir. template.tsx her navigasyonda yeniden mount olur.
 * DOM yapısı reduced-motion'da da sabittir; panel reduced'da görünmez.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <>
      {/* Lacivert süpürme paneli — header'ın (z-40) altında kalır */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-30 bg-navy"
        initial={reduced ? { opacity: 0 } : { y: 0 }}
        animate={reduced ? { opacity: 0 } : { y: "-100%" }}
        transition={{ duration: 0.85, ease: EASE, delay: 0.05 }}
      />
      <motion.div
        className="reveal"
        initial={reduced ? false : { opacity: 0, y: 36 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
      >
        {children}
      </motion.div>
    </>
  );
}
