"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Ana slider videosu. Geçici Higgsfield atmosfer videosu; ekibin gerçek marka
 * tanıtım videosu geldiğinde yalnızca /public/assets/video/hero.mp4 değişecek.
 * Video yoksa lacivert degrade fon gösterilir (site kırılmaz).
 *
 * poster (2026-08-31): videonun İLK karesi. Kasıtlı olarak ilk kare seçildi —
 * daha aydınlık bir kare (5. saniye) kullanılsaydı oynatma başlarken görüntü
 * geri sıçrardı. Video zaten karanlıkta açıldığı için LCP kazancı sınırlı;
 * asıl faydası otomatik oynatmanın ENGELLENDİĞİ durumda (iOS düşük güç modu)
 * siyah bir dikdörtgen yerine gerçek karenin görünmesi.
 *
 * (Not: burada bir ara "JSX attribute arasına yorum yazmak Turbopack'i asıyor"
 * diye bir uyarı yazmıştım — YANLIŞTI, geri aldım. Gerçek sebep yorumun İÇİNDE
 * blok kapatma dizisi geçmesiydi; derlemeyi o bozuyordu.)
 */

export default function HeroVideo({
  className,
  inline = false,
}: {
  className?: string;
  inline?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    ref.current?.play().catch(() => {
      /* autoplay engellenirse poster kalır */
    });
  }, []);

  if (failed) {
    return (
      <div
        className={
          inline
            ? `bg-gradient-to-br from-navy via-[#12124f] to-[#050530] ${className ?? ""}`
            : "absolute inset-0 bg-gradient-to-br from-navy via-[#12124f] to-[#050530]"
        }
        aria-hidden
      />
    );
  }

  return (
    <video
      ref={ref}
      src="/assets/video/hero.mp4"
      poster="/assets/video/hero-poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      onError={() => setFailed(true)}
      aria-label="tellers marka tanıtım videosu"
      className={
        inline
          ? className
          : "absolute inset-0 h-full w-full object-cover opacity-80"
      }
    />
  );
}
