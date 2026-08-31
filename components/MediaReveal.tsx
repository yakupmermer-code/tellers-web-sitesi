"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Görsel/video için KAYDIRMAYA BAĞLI sürekli hareket.
 *
 * Referans temadaki davranış (paketinden birebir çıkarıldı):
 *   scrollYProgress, offset ["start end", "end start"]
 *   y     : -amount%  →  +amount%      (paralaks)
 *   scale :  1 → scaleTo → 1           (ortada hafif şişme)
 * Medya SOLMAZ — referansın sunucu çıktısında paralaks katmanlarında
 * `opacity:0` yok, yalnızca translateY var. Yani perde/fade girişi yok.
 *
 * ÖNCEKİ HÂLİ (2026-08-31'de değişti): clip-path perde açılışı + elle yazılmış
 * scroll dinleyicisi vardı; hareket ±6px'ti, yani neredeyse hissedilmiyordu.
 * Referansta clip-path hiç kullanılmıyor. Kullanılmayan `kenburns` modu da
 * kaldırıldı (hiçbir sayfada çağrılmıyordu).
 */
export default function MediaReveal({
  children,
  className,
  /** Paralaks genliği (%). Referansta 4–8 arası değerler kullanılıyor. */
  amount = 6,
  scaleTo = 1.12,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  scaleTo?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, scaleTo, 1]);

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="reveal h-full w-full"
        // reduced: SSR'da basılan translateY(-6%) hidrasyonda AÇIKÇA
        // sıfırlanır; undefined bırakılırsa kalıcı kayma riski var.
        style={reduced ? { y: 0, scale: 1 } : { y, scale }}
      >
        {children}
      </motion.div>
    </div>
  );
}
