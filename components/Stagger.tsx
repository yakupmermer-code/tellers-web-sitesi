"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { EASE, SURE, ARALIK } from "./motion";

/**
 * Kademeli giriş kabı: çocuklar sırayla belirir (varsayılan 80 ms arayla).
 * Çocukların `StaggerItem` olması gerekir — variant kalıtımı böyle çalışır.
 * (Referans temadan birebir: viewport once/amount .15, gap .08.)
 */
export function Stagger({
  children,
  className,
  gap = ARALIK.staggerOge,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  /** Liste anlamı korunsun diye "ul" verilebilir. */
  as?: "div" | "ul" | "ol";
}) {
  const Kap = motion[as] as ElementType;
  return (
    <Kap
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ staggerChildren: gap }}
    >
      {children}
    </Kap>
  );
}

/** Stagger kabının tek bir çocuğu. */
export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const reduced = useReducedMotion();
  const Oge = motion[as] as ElementType;
  return (
    <Oge
      className={`reveal ${className ?? ""}`}
      variants={{
        hidden: reduced ? { opacity: 1 } : { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: SURE.stagger, ease: EASE },
        },
      }}
    >
      {children}
    </Oge>
  );
}
