"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

const EASE = [0.32, 0.72, 0, 1] as const;

/**
 * Temadaki görsel davranışları:
 * - Açılış: görünüme girerken 1.12 ölçekten yavaşça oturur (overflow gizli).
 * - parallax: scroll'a bağlı hafif dikey kayma; ölçeği İÇ katman taşır,
 *   dış reveal ölçek animasyonu yapmaz (çifte ölçek çakışması olmasın).
 * - kenburns: oturduktan sonra çok yavaş zoom, SINIRLI tekrar (WCAG 2.2.2 —
 *   sonsuz otomatik hareket yok; ~1 dk sonra kendiliğinden durur).
 * DOM yapısı reduced-motion'da da sabittir (hydration uyumu); `reveal`
 * sınıfı JS kapalıyken noscript CSS kurtarması içindir.
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
      // Eleman görünüme girerken 0, çıkarken 1
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

  // Parallax'ta ölçeği iç katman taşır; dış reveal yalnızca opaklık animasyonlar
  const hidden = parallax ? { opacity: 0.4 } : { scale: 1.12, opacity: 0.6 };
  const visible = kenburns
    ? {
        scale: [1.12, 1, 1.06],
        opacity: 1,
        transition: {
          scale: {
            duration: 14,
            times: [0, 0.12, 1],
            ease: "linear" as const,
            repeat: 3,
            repeatType: "reverse" as const,
          },
          opacity: { duration: 1.1, ease: EASE },
        },
      }
    : {
        ...(parallax ? {} : { scale: 1 }),
        opacity: 1,
        transition: { duration: 1.3, ease: EASE },
      };

  return (
    <div ref={outerRef} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="reveal"
        initial={reduced ? false : hidden}
        whileInView={reduced ? undefined : visible}
        viewport={{ once: true, margin: "-80px" }}
      >
        {inner}
      </motion.div>
    </div>
  );
}
