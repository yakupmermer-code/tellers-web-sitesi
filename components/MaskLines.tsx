"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ElementType, type ReactNode } from "react";
import { EASE, SURE, ARALIK } from "./motion";

/**
 * Başlıkları SATIR SATIR maskeden yukarı kaydırır — referans temanın imza
 * efekti. Her satır kendi `overflow-hidden` kutusunda durur ve %110 aşağıdan
 * gelir; satırlar arasında 90 ms gecikme olur.
 *
 * Bizdeki eski `Reveal mask` tüm bloğu TEK parça kaydırıyordu; fark buradan
 * geliyordu. (Referans paketinden birebir çıkarıldı, 2026-08-31.)
 *
 * ERİŞİLEBİLİRLİK: satırlar `aria-hidden`; okunacak metin dış etikette
 * `aria-label` olarak tek parça durur, ekran okuyucu bölünmüş görmez.
 */
export default function MaskLines({
  lines,
  className,
  lineClassName,
  label,
  delay = 0,
  stagger = ARALIK.maskeSatir,
  as: Etiket = "div",
}: {
  lines: ReactNode[];
  /**
   * Ekran okuyucunun okuyacağı tam metin. TİP DÜZEYİNDE ZORUNLU: satırlar
   * <em> gibi etiket içerdiğinde otomatik üretim sessizce metin kaybediyordu.
   * "Yorumda zorunlu yazmak" yetmiyor — derleyici zorlamalı.
   */
  label: string;
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  as?: ElementType;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const gorunur = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Etiket ref={ref} className={className} aria-label={label}>
      {lines.map((satir, i) => (
        <span key={i} aria-hidden className="block overflow-hidden">
          {/* pb: ğ/ç/y/ş kuyrukları kırpılmasın (Türkçe için 0.12em şart) */}
          <motion.span
            className={`reveal block pb-[0.12em] ${lineClassName ?? ""}`}
            initial={reduced ? false : { y: "110%" }}
            animate={gorunur ? { y: 0 } : undefined}
            transition={{
              duration: SURE.maske,
              delay: delay + i * stagger,
              ease: EASE,
            }}
          >
            {satir}
          </motion.span>
        </span>
      ))}
    </Etiket>
  );
}
