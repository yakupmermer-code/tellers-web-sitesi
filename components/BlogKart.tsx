import Image from "next/image";
import Link from "next/link";
import MediaReveal from "@/components/MediaReveal";
import type { Blog } from "@/content/blogs";
import { ilkCumleler } from "@/lib/ozet";

/**
 * Blog kartı — master temanın (arpeggio.framer.website/journal) kart anatomisi.
 *
 * ⚠️ 2026-09-11'de MASTER'A GÖRE YENİDEN KURULDU. Yakup: "master temadaki
 * journal kısmı bizim için referans, unutma birebir aynısı olsun. Yazıların
 * bloglar üzerinde nereye yerleşmesi ve ne şekilde olması istendiyse o şekilde
 * olmalı." Önceki hâlin master'dan ÜÇ temel farkı vardı:
 *   1. metinler HOVER'a bağlıydı — master'da HEP GÖRÜNÜR
 *   2. metinler kartın ALTINDAYDI — master'da ÜST kısımda
 *   3. kartta kategori basılıyordu — master'da yok, döküman da blog sayfası
 *      için saymıyor ("ana başlık ve kısa alt açıklama metni gelecek, ana
 *      başlık yukarıda konumlanacak, yazan yerinde tellers yazacak ve
 *      blogların eklenme tarihi yer alacak")
 *
 * MASTER ÖLÇÜMÜ (1440px, canlı, 2026-09-11) — kartın sol-üst köşesine göre:
 *   kart          1360x700 (geniş) · 668x700 (ızgara) · köşe yuvarlaklığı YOK
 *   tarih         sol 44 · üst 32  · 19px/500 · rgb(246,246,246)
 *   "Written by"  sağ üstte        · 17px/400 · beyaz
 *   yazar adı     onun yanında     · 17px/400 · beyaz
 *   ana başlık    sol 48 · üst 91  · 35px/500 · beyaz
 *   alt açıklama  sol 48 · üst 133 · 19px/500 · rgb(246,246,246)
 *   ilk cümleler  sol 36 · ALT bölgede · 17px/400 · rgb(230,230,230)
 *   kart üstünde tam boy koyu bir örtü var — metinler onun üzerinde okunuyor
 *
 * Bizde örtü SİYAH DEĞİL LACİVERT: marka kuralı (`CLAUDE.md`), master'ın
 * siyahı yerine kurumsal renk. Yakup'un tek istisnası zaten "renkler ve
 * kurumsal font harici birebir".
 *
 * NEDEN ORTAK BİLEŞEN: aynı anatomi hem blog dizininde hem yazı detayındaki
 * "Diğer Yazılar" alanında lazım. İki yere ayrı yazılsaydı biri değişip
 * diğeri unutulurdu.
 */
export default function BlogKart({
  blog: b,
  className = "",
  /** `true` → geniş kart puntoları (master: 35px başlık). Dizindeki tam
      genişlik kartları böyle; ızgara kartları bir kademe küçük. */
  buyuk = false,
}: {
  blog: Blog;
  className?: string;
  buyuk?: boolean;
}) {
  return (
    <Link
      href={`/blog/${b.slug}`}
      aria-label={`${b.title} — yazıyı oku`}
      /* Etiket İMLECİN kendisinde (master'daki gibi), kartın köşesinde sabit
         rozet değil. Bkz. `components/Imlec.tsx`. */
      data-imlec="Oku"
      className={`group relative block overflow-hidden ${className}`}
    >
      {/* Kaydırmaya bağlı yaklaşma — sitenin her yerindeki `MediaReveal`,
          referans temanın paketinden birebir çıkarılmış hareket. */}
      <MediaReveal className="h-full w-full" amount={5} scaleTo={1.08}>
        <Image
          src={b.image}
          alt=""
          width={1360}
          height={700}
          sizes={
            buyuk
              ? "(min-width: 1440px) 1360px, 100vw"
              : "(min-width: 1440px) 668px, (min-width: 768px) 47vw, 100vw"
          }
          className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.03]"
        />
      </MediaReveal>

      {/* KOYU ÖRTÜ — master'da da var; metinler hep görünür olduğu için
          okunurluk buna bağlı. Hover'da bir tık koyulaşıyor: master'da kart
          üzerinde başka bir hover göstergesi yok, bu da fazla değil. */}
      <div className="pointer-events-none absolute inset-0 bg-navy/50 transition-colors duration-500 ease-[var(--ease-lux)] group-hover:bg-navy/60" />

      {/* ÜST BLOK — tarih (sol) · "Yazan: tellers" (sağ) · başlık · açıklama.
          Master'da dördü de kartın üst kısmında ve HEP GÖRÜNÜR. */}
      <div className="pointer-events-none absolute inset-x-6 top-6 md:inset-x-11 md:top-8">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[13px] font-medium text-white/95 md:text-[16px] xl:text-[19px]">
            {b.date}
          </p>
          {/* Döküman: "Yazan yerinde tellers yazacak." Master'da bu köşede
              "Written by [isim]" duruyor; bizde yazar hep ajansın kendisi. */}
          <p className="shrink-0 text-right text-[12px] text-white md:text-[15px] xl:text-[17px]">
            Yazan: tellers
          </p>
        </div>

        <h3
          className={`mt-5 font-medium leading-[1.15] tracking-[-0.02em] text-white md:mt-7 ${
            buyuk
              ? "text-[20px] md:text-[27px] xl:text-[35px]"
              : "text-[18px] md:text-[22px] xl:text-[28px]"
          }`}
        >
          {b.title}
        </h3>

        {/* `font-medium`: master'da alt açıklama 19px/500 ölçüldü, 400 değil.
            Kalınlık farkı gözle küçük ama "birebir" istendiği için düzeltildi. */}
        <p
          className={`mt-1.5 font-medium text-white/95 ${
            buyuk
              ? "text-[13px] md:text-[16px] xl:text-[19px]"
              : "text-[12px] md:text-[15px] xl:text-[17px]"
          }`}
        >
          {b.excerpt}
        </p>
      </div>

      {/* ALT BLOK — içeriğin ilk cümleleri. Master'da kartın alt bölgesinde,
          üst bloktan ayrı duruyor. Dar ekranda gizli: 4/3 kutuda üst blokla
          çakışıyor ve iki metin birbirine giriyordu. */}
      <p className="pointer-events-none absolute inset-x-6 bottom-6 hidden line-clamp-3 text-[14px] leading-relaxed text-white/90 md:inset-x-9 md:bottom-8 md:block md:text-[16px] xl:line-clamp-4 xl:text-[17px]">
        {ilkCumleler(b.body, b.excerpt)}
      </p>
    </Link>
  );
}
