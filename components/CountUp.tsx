"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Temadaki sayaç animasyonu: görünüme girince 0'dan hedefe sayar.
 * value içindeki İLK sayı bloğu animasyonlanır, kalan metin aynen kalır.
 * Örn: "22.872.000 $", "+1500", "13 Ülke".
 *
 * 🔴 SUNUCUDA GERÇEK DEĞER BASILIR (2026-09-02, code-reviewer bulgusu).
 * Önceki sürüm sayaç başlamadan önce `value.replace(sayı, "0")` döndürüyordu ve
 * bu SUNUCU ÇIKTISINA da giriyordu: sayfanın kaynak HTML'inde "0 Yıl Deneyim",
 * "+0 Global Marka", "+0$ Yönetilen Bütçe" yazıyordu. JavaScript çalıştırmayan
 * AI tarayıcıları (ClaudeBot, GPTBot, PerplexityBot…) ajansı "sıfır deneyim,
 * sıfır marka" diye okuyordu — CLAUDE.md'nin "şemaya uydurma veri yazılmaz,
 * yanlış beyan GEO'da en pahalı hatadır" kuralının doğrudan ihlali.
 * Çözüm: `bagli` (mounted) bayrağı. Sunucu ve İLK istemci çizimi gerçek değeri
 * basar (hidrasyon uyuşmazlığı da olmaz), JS bağlandıktan sonra sıfırdan sayar.
 */
export default function CountUp({
  value,
  duration = 1.8,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const [bagli, setBagli] = useState(false);
  const [display, setDisplay] = useState<string | null>(null);

  // "22.872.000" gibi noktalı binlik bloklarını tek sayı olarak yakala
  const match = value.match(/\d[\d.]*/);

  useEffect(() => setBagli(true), []);

  useEffect(() => {
    if (!inView || !match || reduced) return;
    const raw = match[0];
    const target = parseInt(raw.replace(/\./g, ""), 10);
    const hasSep = raw.includes(".");
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart — sonlara doğru yavaşlar
      const current = Math.round(target * eased);
      const text = hasSep ? current.toLocaleString("tr-TR") : String(current);
      setDisplay(value.replace(raw, text));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced]); // eslint-disable-line react-hooks/exhaustive-deps

  /*
   * Sunucuda ve ilk çizimde (`!bagli`) HER ZAMAN gerçek değer. Sayı yoksa veya
   * hareket azaltılmışsa da gerçek değer. Sadece JS bağlandıktan sonra sayaç
   * devreye girer; sayaç henüz başlamadıysa sıfırdan gösterir.
   */
  const text =
    !match || reduced || !bagli
      ? value
      : (display ?? value.replace(match[0], "0"));

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
