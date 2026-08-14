"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.32, 0.72, 0, 1] as const;

/**
 * Temadaki hero başlık animasyonu: satırlar maske içinden yukarı kayarak
 * sırayla belirir (Framer'daki line-mask reveal karşılığı).
 */
export default function HeroTitle() {
  const reduced = useReducedMotion();

  const lines = [
    <>Duyulan unutulur,</>,
    <>
      <em className="font-didot font-normal italic">anlaşılan</em> kalır.
    </>,
  ];

  return (
    <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-tight text-white md:text-8xl">
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            initial={reduced ? { opacity: 0 } : { y: "110%" }}
            animate={reduced ? { opacity: 1 } : { y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.15 + i * 0.14 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
