"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const SLOGAN = "Duyulan unutulur, anlaşılan kalır.";

/**
 * Temadaki hero başlık animasyonu: kelimeler maske içinden yukarı kayarak
 * satır satır akar. Ekran okuyucu/SEO için gerçek metin sr-only olarak
 * verilir; animasyonlu kelime yapısı aria-hidden'dır (kelime span'leri
 * arasında gerçek boşluk olmadığından erişilebilir ad bozulmasın diye).
 */
export default function HeroTitle() {
  const reduced = useReducedMotion();

  const lines: ReactNode[][] = [
    [<span key="d">Duyulan</span>, <span key="u">unutulur,</span>],
    [
      <em key="a" className="font-didot font-normal italic">
        anlaşılan
      </em>,
      <span key="k">kalır.</span>,
    ],
  ];

  let wordIndex = 0;

  return (
    <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-tight text-white md:text-8xl">
      <span className="sr-only">{SLOGAN}</span>
      <span aria-hidden="true">
        {lines.map((words, li) => (
          <span key={li} className="flex flex-wrap gap-x-[0.28em]">
            {words.map((word, wi) => {
              const delay = 0.15 + wordIndex++ * 0.09;
              return (
                <span
                  key={wi}
                  className="inline-block overflow-hidden pb-[0.18em]"
                >
                  <motion.span
                    className="reveal inline-block"
                    initial={reduced ? false : { y: "110%" }}
                    animate={reduced ? undefined : { y: 0 }}
                    transition={{ duration: 1.05, ease: EASE, delay }}
                  >
                    {word}
                  </motion.span>
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </h1>
  );
}
