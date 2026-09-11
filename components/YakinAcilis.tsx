"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE, SURE, GORUNUR } from "./motion";

/**
 * "YAKINDAN GELİP UZAKLAŞMA" — master temanın görsel giriş hareketi.
 *
 * Yakup 2026-09-11: "master temada anasayfa ve iç sayfalarda görseller
 * yakından gelip sonra uzaklaşıyor gibi, bunu kontrol et; ona göre hakkımızda
 * kısmını revize et."
 *
 * MASTER ÖLÇÜMÜ — `arpeggio.framer.website/about`, canlı, 1440x900:
 *   hero görseli      `opacity: 0.001; transform: scale(2)`        → 1 / 1
 *   iç görseller (5)  `opacity: 0.001; transform: scale(1.4)`      → 1 / 1
 *   iç görseller görünür alana girince tetikleniyor, hero ise açılışta.
 *   Yerleşimden sonra KAYDIRMA PARALAKSI YOK: oturduktan sonra sarmalayıcıda
 *   `transform: none` ölçüldü. Yani bu hareket `MediaReveal`ın yerine geçer,
 *   onunla birlikte kullanılmaz.
 *
 * ⚠️ SÜRE ÖLÇÜLEMEDİ, TAHMİN: master'ın animasyonu `requestAnimationFrame` ile
 * sürülüyor ve tarayıcı sekmesi ön planda değilken rAF donuyor — 24 saniye
 * boyunca başlangıç değerinde kaldı, ara kareler hiç üretilmedi (bkz.
 * hafıza: "gizli sekme / rAF tuzağı"). Bu yüzden ölçek ve opaklık DEĞERLERİ
 * kesin, SÜRE değil. Sitenin kendi `SURE.heroZoom` değeri (1,1 sn) kullanıldı.
 * Gerçek süre ölçülebilirse tek yerden düzelir.
 *
 * NEDEN `MediaReveal` DEĞİL: o bileşen kaydırmaya bağlı SÜREKLİ paralakstır
 * (y: -%amount → +%amount). Buradaki hareket bir GİRİŞtir: bir kez oynar ve
 * ölçek 1'de durur. İkisi üst üste binerse görsel hem kayar hem büyür.
 */
export default function YakinAcilis({
  children,
  className,
  /** Başlangıç ölçeği. Master: hero 2, iç görseller 1.4. */
  olcek = 1.4,
  /**
   * true → görünür alan beklenmez, bağlanır bağlanmaz oynar.
   * Sayfanın ilk ekranındaki hero için ZORUNLU: `whileInView` orada bir kare
   * gecikme yaratıyor ve Yakup bunu bildirmişti (2026-09-10, "üst kısmında
   * video olan sayfalarda video 1-2 saniye gecikmeli geliyor").
   */
  hemen = false,
}: {
  children: ReactNode;
  className?: string;
  olcek?: number;
  hemen?: boolean;
}) {
  const reduced = useReducedMotion();
  /*
   * 🔴 `hemen` MODUNDA OPAKLIK ANİMASYONU YOK (2026-09-11, Yakup: "ilk site
   * açılırken slider da mavi oluyor sonra video geliyor, diğer içerik
   * kısımları da aynı, bunun sebebi nedir").
   *
   * Sebep buydu: hero bölümlerinin zemini `bg-navy` (video yüklenirken boş
   * kutu görünmesin, sayfa zıplamasın diye). Giriş `opacity: 0`dan başlayınca
   * medya saydam kalıyor ve arkasındaki LACİVERT görünüyor — izleyici önce
   * mavi, sonra videoyu görüyor. Master'da bu göze batmıyor çünkü onun
   * hero'sunun arkası beyaz; bizde kurumsal renk olduğu için belirgin.
   *
   * Çözüm zemini beyaza çevirmek DEĞİL (o zaman yüklenirken beyaz parlama
   * olurdu ve koyu hero'nun üzerindeki saydam bar okunmaz hâle gelirdi):
   * ilk ekrandaki hero'da opaklık animasyonunu hiç yapmamak. Poster/ilk kare
   * en baştan görünür, yalnızca ölçek 2'den 1'e oturur — yani Yakup'un
   * istediği "yakından gelip uzaklaşma" aynen duruyor, mavi flaş yok.
   *
   * GÖRÜNÜR ALANA GİRİNCE tetiklenen (hemen=false) iç görseller opaklıkla
   * gelmeye DEVAM EDİYOR: onların arkası beyaz, mavi flaş sorunu yok ve
   * master'da ölçülen davranış bu.
   */
  const bitis = hemen ? { scale: 1 } : { scale: 1, opacity: 1 };

  return (
    /* `overflow-hidden` ŞART: giriş sırasında içerik kutudan taşıyor. Master'da
       da hero bloğunda `overflow: hidden` ölçüldü. */
    <div className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        /* `reveal` sınıfı: `prefers-reduced-motion` kapalıyken bile içeriğin
           görünür kalmasını garantileyen ortak kaçış yolu (globals.css). */
        className="reveal h-full w-full"
        initial={reduced ? false : hemen ? { scale: olcek } : { scale: olcek, opacity: 0 }}
        {...(hemen
          ? { animate: bitis }
          : { whileInView: bitis, viewport: GORUNUR })}
        transition={{ duration: SURE.heroZoom, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}
