"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.32, 0.72, 0, 1] as const;

/*
 * Not: variant'ın kendi transition'ı component transition prop'unu EZER;
 * bu yüzden delay, `custom` üzerinden variant fonksiyonuna taşınır —
 * aksi halde stagger hiç çalışmaz (code-reviewer bulgusu K1).
 */
const variants: Variants = {
  hidden: { y: 56, opacity: 0, filter: "blur(6px)" },
  visible: (delay: number = 0) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE, delay },
  }),
};

const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

/** Görünüme girerken ağır, yumuşak fade-up. Tüm bölümler bununla sarılır. */
export default function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`reveal ${className ?? ""}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={reduced ? reducedVariants : variants}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}
