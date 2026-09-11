"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE, SURE, GORUNUR } from "./motion";

/**
 * YATAY AÇILIŞ — portfolyo kartlarının giriş hareketi.
 *
 * Yakup 2026-09-11: "master temada work kısmının slider'ı bu şekilde açılmıyor,
 * orada YATAY ayrı bir animasyon var" + "ana sayfa slider alanında
 * çalıştırdığın animasyonun YATAY OLANI olarak düşünebiliriz".
 *
 * Ana sayfa slider'ının hareketi `components/HeroZoom.tsx`: görsel 1.28
 * ölçekten 1'e oturuyor (her iki eksende). Buradaki, onun yatay eksendeki
 * karşılığı: `scaleX` 1.28 → 1. Süre ve eğri aynı (`SURE.heroZoom`, `EASE`) —
 * tarif "aynı animasyonun yatay olanı" olduğu için değerleri değiştirmedim.
 *
 * HeroZoom'dan TEK FARKI TETİKLEYİCİ: hero sayfanın en üstünde olduğu için
 * orada animasyon mount anında başlıyor. Portfolyo kartları listenin
 * aşağısında; `whileInView` ile her kart kendi sırası geldiğinde açılıyor,
 * yoksa kullanıcı oraya varmadan hepsi bitmiş olurdu.
 *
 * 🔴 ÖLÇÜLEMEDİ: master'ın gerçek animasyonu bu ortamda ölçülemiyor — tarayıcı
 * sekmesi arka planda olduğu için Framer'ın animasyon motoru duruyor
 * (`visibilityState: "hidden"`), ekran kaydından kare de çıkarılamadı. Değerler
 * Yakup'un tarifinden türetildi, master'dan ölçülerek değil. Yanlışsa
 * `scaleX` satırı tek başına değiştirilir.
 */
export default function YatayAcilis({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="reveal h-full w-full"
        initial={reduced ? false : { scaleX: 1.28 }}
        whileInView={reduced ? undefined : { scaleX: 1 }}
        viewport={GORUNUR}
        transition={{ duration: SURE.heroZoom, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}
