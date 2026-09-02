"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { EASE, SURE } from "./motion";

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
  sabit = false,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  scaleTo?: number;
  /**
   * true → hiç hareket yok, görsel tam ve kırpılmadan durur.
   * İÇİNDE YAZI OLAN görsellerde ZORUNLU: paralaks görseli büyütüp
   * kaydırdığı için kenardaki yazılar kesiliyor (Yakup bildirdi 2026-09-01:
   * "hakkımızda kısmı ekrana tam oturmuyor"). Fotoğrafta sorun değil,
   * metin görselinde içerik kaybıdır.
   */
  sabit?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${amount}%`, `${amount}%`],
  );
  /*
   * Taban ölçek kaymayı ÖRTMEK zorunda: görsel ±amount% kayarken ölçek 1 ise
   * kenarda boş şerit açılıyordu (code-reviewer bulgusu). Taban 1+2*amount/100
   * ile başlar, ortada scaleTo'ya kadar nefes alır.
   */
  const taban = 1 + (2 * amount) / 100;
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [taban, Math.max(taban, scaleTo), taban]
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        /*
         * sabit modda da GİRİŞ vardır ama yalnızca solma ile: opacity hiçbir
         * şeyi kırpmaz. Transform (kaydırma/ölçek) kullanılamaz çünkü bu
         * sitedeki medyaların neredeyse hepsinde GÖMÜLÜ YAZI var ve en ufak
         * büyütme kenardaki metni kesiyor (2026-09-02).
         */
        initial={reduced ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: SURE.reveal, ease: EASE }}
        className="reveal h-full w-full"
        // reduced: SSR'da basılan translateY(-6%) hidrasyonda AÇIKÇA
        // sıfırlanır; undefined bırakılırsa kalıcı kayma riski var.
        style={reduced || sabit ? { y: 0, scale: 1 } : { y, scale }}
      >
        {children}
      </motion.div>
    </div>
  );
}
