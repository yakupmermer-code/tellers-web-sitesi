"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BLOGS } from "@/content/blogs";

/**
 * Ana sayfa blog alanı — İKİLİ, sürekli dönen kartlar.
 *
 * Revize dökümanı (2026-09-10): "Blog alanı tamamen yanlış, mevcuttaki temada
 * yer alan kullanımdan ilerleyeceğiz. Mouse ile dokunduğumuzda tarih, konu
 * başlığı, seo odaklı kategorizesel atama ve blog içeriğinin ilk cümleleri
 * ekranda çıkacak. 2'li olarak yerleştireceğiz, sürekli döner ve değişir."
 *
 * ESKİ HÂLİ: 4'lü yatay slider, imleç kenara yaklaşınca kayan (`BlogSlider`).
 * O bileşen SİLİNMEDİ — hizmetlerimiz sayfası hâlâ kullanıyor.
 *
 * MASTER TEMA ÖLÇÜMÜ (arpeggio.framer.website ana sayfa, 1440px):
 *   · kart 660x500 → oran 1,32 · İKİ sütun, x=40 ve x=740 → 40px ara
 *   · kart içi: tarih 19px/500 · başlık 35px/500 · özet 19px/500 ·
 *     ilk cümleler 17px/400 · üzerine gelince yuvarlak "READ" düğmesi
 * Bizde puntolar sitenin ölçeğine oturtuldu.
 */

/**
 * Yazının ilk cümlelerini gövdeden çıkarır.
 *
 * NEDEN AYRI ALAN AÇILMADI: döküman "blog içeriğinin ilk cümlelerini direkt
 * siteden çekebilirsiniz" diyor. Elle ikinci bir özet alanı açmak, aynı metni
 * iki yerde tutmak demekti — biri güncellenip diğeri unutulurdu.
 *
 * Gövde basit markdown: `##` başlık satırları ve `-` madde satırları atlanır,
 * ilk gerçek paragraf alınır. Cümle sınırında kesilir; kelime ortasında
 * kesilmiş metin baştan savma görünüyor.
 */
export function ilkCumleler(govde: string, sinir = 190) {
  const paragraf =
    govde
      .split("\n")
      .map((s) => s.trim())
      .find((s) => s.length > 0 && !s.startsWith("#") && !s.startsWith("-")) ??
    "";
  if (paragraf.length <= sinir) return paragraf;
  const kesik = paragraf.slice(0, sinir);
  const nokta = Math.max(kesik.lastIndexOf(". "), kesik.lastIndexOf("; "));
  return nokta > sinir * 0.5
    ? kesik.slice(0, nokta + 1)
    : kesik.slice(0, kesik.lastIndexOf(" ")) + "…";
}

/** Kaç saniyede bir sonraki ikiliye geçiyor. */
const DONME_SURESI = 5500;

export default function BlogIkili() {
  const [ilk, setIlk] = useState(0);
  const [durdu, setDurdu] = useState(false);

  useEffect(() => {
    if (durdu) return;
    // Hareketi azaltılmış tercih: dönme HİÇ başlamaz. Sürekli kendiliğinden
    // değişen içerik vestibüler rahatsızlık ve okuma güçlüğü yaratıyor.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setIlk((i) => (i + 2) % BLOGS.length),
      DONME_SURESI,
    );
    return () => window.clearInterval(id);
  }, [durdu]);

  const gorunen = [BLOGS[ilk], BLOGS[(ilk + 1) % BLOGS.length]];

  return (
    <div
      // Üzerine gelince dönme DURUR: okumaya başlayan kişinin altından kart
      // kaymasın. Klavyeyle gezerken de aynı sebeple durur.
      onMouseEnter={() => setDurdu(true)}
      onMouseLeave={() => setDurdu(false)}
      onFocusCapture={() => setDurdu(true)}
      onBlurCapture={() => setDurdu(false)}
    >
      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        {gorunen.map((b) => (
          <Link
            key={b.slug}
            href={`/blog/${b.slug}`}
            aria-label={`${b.title} — yazıyı oku`}
            className="group relative block aspect-[4/3] overflow-hidden md:aspect-[660/500]"
          >
            <Image
              src={b.image}
              alt={b.title}
              width={1200}
              height={900}
              sizes="(min-width: 1440px) 660px, (min-width: 768px) 46vw, 100vw"
              className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.03]"
            />

            {/* DURAĞAN HÂL — yalnız başlık. Alttan lacivert degrade okunurluk
                için; görselin kendi tonu ne olursa olsun beyaz yazı okunuyor. */}
            <div className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-[var(--ease-lux)] group-hover:opacity-0 group-focus-visible:opacity-0">
              <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-navy/85 to-transparent" />
              <p className="absolute inset-x-0 bottom-0 px-6 pb-7 text-[17px] font-medium leading-[1.2] tracking-[-0.02em] text-white md:px-8 md:pb-8 md:text-[20px] lg:text-[24px]">
                {b.title}
              </p>
            </div>

            {/* ÜZERİNE GELİNCE — dökümanın saydığı dört şey: tarih, konu
                başlığı, SEO kategorisi ve içeriğin ilk cümleleri. */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-navy/85 p-6 opacity-0 transition-opacity duration-500 ease-[var(--ease-lux)] group-hover:opacity-100 group-focus-visible:opacity-100 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-white/70 md:text-[13px]">
                  {b.date}
                </p>
                <p className="max-w-[55%] text-right text-[12px] font-medium leading-snug text-white/70 md:text-[13px]">
                  {b.kategori}
                </p>
              </div>

              <div>
                <p className="text-[17px] font-medium leading-[1.2] tracking-[-0.02em] text-white md:text-[20px] lg:text-[24px]">
                  {b.title}
                </p>
                <p className="mt-3 line-clamp-4 text-[13px] leading-relaxed text-white/75 md:text-[15px]">
                  {ilkCumleler(b.body)}
                </p>
              </div>

              <div className="flex justify-end">
                {/* Master temadaki yuvarlak "READ" düğmesinin karşılığı. */}
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[13px] font-medium uppercase tracking-[0.1em] text-navy md:h-20 md:w-20 md:text-[14px]">
                  Oku
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Hangi ikilide olduğumuzu gösteren sade göstergeler. Tıklanabilir:
          dönmeyi beklemek istemeyen kişi doğrudan atlayabilsin. */}
      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: Math.ceil(BLOGS.length / 2) }, (_, i) => {
          const aktif = i === Math.floor(ilk / 2);
          return (
            <button
              key={i}
              type="button"
              onClick={() => setIlk(i * 2)}
              aria-label={`${i + 1}. blog ikilisini göster`}
              aria-current={aktif ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all duration-500 ease-[var(--ease-lux)] ${
                aktif ? "w-8 bg-navy" : "w-3 bg-navy/25 hover:bg-navy/45"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
