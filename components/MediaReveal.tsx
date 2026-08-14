"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

const EASE = [0.32, 0.72, 0, 1] as const;

/**
 * Temadaki görsel davranışlarının üstüne çıkan sürüm:
 * - Açılış: perde gibi AŞAĞIDAN YUKARI açılan clip-path wipe + 1.16 ölçekten
 *   oturma (editoryal imza reveal).
 * - parallax: scroll'a bağlı dikey kayma; ölçeği İÇ katman taşır.
 * - kenburns: oturduktan sonra çok yavaş zoom, SINIRLI tekrar (WCAG 2.2.2).
 * DOM yapısı reduced-motion'da da sabittir; `reveal` sınıfı noscript
 * kurtarması içindir.
 */
export default function MediaReveal({
  children,
  className,
  kenburns = false,
  parallax = false,
}: {
  children: ReactNode;
  className?: string;
  kenburns?: boolean;
  parallax?: boolean;
}) {
  const reduced = useReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!parallax || reduced) return;
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = outer.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      const y = (progress - 0.5) * 12; // -%6 .. +%6
      inner.style.transform = `translateY(${y}%) scale(1.12)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [parallax, reduced]);

  const inner = parallax ? (
    <div
      ref={innerRef}
      style={reduced ? undefined : { transform: "scale(1.12)" }}
    >
      {children}
    </div>
  ) : (
    children
  );

  /* Perde reveal: clipPath alttan açılır; parallax'ta ölçek iç katmanda,
     normalde dış katman 1.16'dan oturur. */
  const hidden = {
    clipPath: "inset(100% 0% 0% 0%)",
    ...(parallax ? {} : { scale: 1.16 }),
  };
  const visible = kenburns
    ? {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: [1.16, 1, 1.06],
        transition: {
          clipPath: { duration: 1.1, ease: EASE },
          scale: {
            duration: 14,
            times: [0, 0.12, 1],
            ease: "linear" as const,
            repeat: 3,
            repeatType: "reverse" as const,
          },
        },
      }
    : {
        clipPath: "inset(0% 0% 0% 0%)",
        ...(parallax ? {} : { scale: 1 }),
        transition: {
          clipPath: { duration: 1.1, ease: EASE },
          scale: { duration: 1.5, ease: EASE },
        },
      };

  return (
    <div ref={outerRef} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="reveal"
        initial={reduced ? false : hidden}
        whileInView={reduced ? undefined : visible}
        viewport={{ once: true, margin: "-60px" }}
      >
        {inner}
      </motion.div>
    </div>
  );
}
