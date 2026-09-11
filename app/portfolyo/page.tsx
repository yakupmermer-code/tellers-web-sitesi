import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import {
  grafik,
  sayfaSemasi,
  kirintiSemasi,
  listeSemasi,
  paylasim,
} from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { ilkCumleler } from "@/lib/ozet";
import KapanisSection from "@/components/KapanisSection";
import { BRANDS } from "@/content/brands";

const ACIKLAMA =
  "Mastercard, Bardahl, BNI, bfit ve 13 marka için yaptığımız markalama, performans pazarlama, dijital pazarlama ve kreatif tasarım işleri.";

export const metadata: Metadata = {
  title: "Portfolyo — Mastercard, Bardahl, BNI ve 14 Marka",
  description: ACIKLAMA,
  alternates: { canonical: "/portfolyo" },
  ...paylasim({
    baslik: "Portfolyo | tellers",
    aciklama: ACIKLAMA,
    gorsel: "/assets/og/portfolyo.jpg",
    yol: "/portfolyo",
  }),
};

export default function PortfolyoPage() {
  return (
    <>
      <JsonLd
        data={grafik(
          sayfaSemasi({
            tip: "CollectionPage",
            yol: "/portfolyo",
            ad: "Portfolyo",
            aciklama: ACIKLAMA,
          }),
          listeSemasi({
            yol: "/portfolyo",
            ad: "tellers portfolyosu",
            ogeler: BRANDS.map((b) => ({
              ad: b.name,
              yol: `/portfolyo/${b.slug}`,
            })),
          }),
          kirintiSemasi([
            { ad: "Ana Sayfa", yol: "/" },
            { ad: "Portfolyo", yol: "/portfolyo" },
          ]),
        )}
      />
      {/* ── Ana slide: marka ismi/detay yok ── */}
      <section className="relative mt-24">
        {/* 🔴 HERO VİDEOSU `MediaReveal` İLE SARILMAZ (2026-09-10, Yakup:
          "üst kısmında video olan sayfalarda video 1-2 saniye gecikmeli
          geliyor, sebebini kontrol et").
          Sebep üç animasyonun üst üste binmesiydi:
            · `app/template.tsx` sayfa geçişi — 0,25 sn bekleme + 0,8 sn
            · `MediaReveal sabit` — opacity 0→1, 0,9 sn, üstelik `whileInView`
              tetikli (görünürlük gözlemcisi ateşleyene kadar hiç başlamıyor)
          Toplam ~1,9 sn ve bu sürede video alanı BOŞ; poster bile görünmüyor,
          çünkü o da opacity 0'ın arkasında. Video dosyaları küçük (252-572 KB),
          yani sorun indirme değildi.
          Hero zaten sayfanın ilk ekranında: "görünür alana girince göster"
          beklemenin anlamı yok. Giriş yumuşaklığını `template.tsx` zaten
          veriyor. `preload` da `metadata`dan `auto`ya alındı — ilk ekrandaki
          videonun verisi sayfa açılır açılmaz inmeye başlasın. */}
        <video
          src="/assets/portfolio/hero.mp4"
          poster="/assets/portfolio/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="tellers portfolyo"
          className="h-auto w-full"
        />
      </section>

      {/* ── Tasarım felsefesi (temanın orijinal yerleşimi) ── */}
      <section className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 md:grid-cols-2 md:gap-20 md:px-10 md:py-24">
        <Reveal mask>
          <h1 className="text-3xl font-bold leading-[1.12] tracking-tight text-navy md:text-[64px]">
            Tasarım, tellers için estetik değil,{" "}
            <em className="font-didot font-normal italic">anlamın mekansal</em>{" "}
            organizasyonudur.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-col gap-6 text-lg leading-relaxed text-navy/75">
            <p>
              Bir form, bir renk, bir tipografi seçimi bile, insanın algılama
              biçimini değiştirir. Biz tasarımı bir &ldquo;son dokunuş&rdquo;
              değil,{" "}
              <strong className="text-navy">anlamın görsel mantığı</strong>{" "}
              olarak inşa ederiz.
            </p>
            <p>
              Her görsel karar, bir düşüncenin fiziksel karşılığıdır. Bu yüzden
              tellers&apos;ın her projesi, bilgiden duyguya, kavramdan forma
              uzanan anlamın yolculuğu gibidir.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── MARKA KARTLARI — MASTER /work DÜZENİ ────────────────────────
          Revize dökümanı: "Alt kısımda kullandığımız ok ve marka isimleri
          iptal edilecek. Bu alanda örnek temadaki gibi TASARIM ÜSTÜ metinleri
          ve yerleşimini tıpkı uygulayacağız. Banner alanları bu kadar açık
          olmayacak, yine temadaki alan kullanımını yapmalıyız."

          MASTER ÖLÇÜMÜ (arpeggio.framer.website/work, 1440px, canlı
          2026-09-11) — 7 kart, HEPSİ TEK SÜTUN, kart 1360x622 (oran 2,185),
          x=40. Kartın sol-üst köşesine göre metinler:
            açıklama → sol 32 · üst 60  · 35px/500 · GİZLİ (üzerine gelince)
            sektör   → sol 56 · üst 439 · 19px/500
            tarih    → SAĞDA    · üst 440 · 17px/400
            isim     → sol 56 · üst 478 · 48px/500
            hizmet   → sol 56 · üst 535 · 21px/500
          Üzerine gelince siyah bir örtü beliriyor (boşta opacity 0).

          ÖNCEKİ HÂLİMİZ: 2 sütunlu 4/3 ızgara; görselde yalnız marka adı,
          hizmet ve yıl KARTIN ALTINDA çizgiyle ayrılmış bir satırdaydı — tam
          da dökümanın "iptal edilecek" dediği yerleşim.

          DÖRT SATIR DÖKÜMANIN MARKA LİSTESİYLE BİREBİR: orada 17 markanın
          hepsi "isim / SEKTÖR / hizmet / yıl" dörtlüsüyle verilmiş. `sektor`
          alanı bu yüzden `content/brands.ts`e eklendi. */}
      <section className="mx-auto max-w-[1440px] px-5 pb-20 md:px-10 md:pb-24">
        {/* Her kart KENDİ gözlemcisini taşır (index gecikmeli Reveal).
            TARİHÇE: 2026-08-31'de burada Stagger kullanılamıyordu — o zaman
            bileşenler `viewport.amount` kullanıyordu ve 5488px'lik bu ızgara
            iPhone'da (812px) eşiği asla sağlayamıyor, 17 kart birden görünmez
            kalıyordu. 2026-09-07'de bileşenler margin tabanlı tetiklemeye
            geçti, kilitlenme riski kalktı. Yine de UZUN ızgaralarda kart başına
            Reveal doğru desen: tek Stagger olsaydı alttaki kartlar, kullanıcı
            oraya varmadan görünmeden animasyonlarını bitirirdi. */}
        <div className="flex flex-col gap-6">
          {BRANDS.map((b) => (
            <Reveal key={b.slug}>
              <Link
                href={`/portfolyo/${b.slug}`}
                data-imlec="Ziyaret Et"
                aria-label={`${b.name} — ${b.listService}`}
                className="group relative block aspect-[4/3] overflow-hidden md:aspect-[1360/622]"
              >
                <Image
                  src={b.banner}
                  alt=""
                  width={1360}
                  height={622}
                  className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.03]"
                  sizes="(min-width: 1440px) 1360px, 100vw"
                />

                {/* "Banner alanları bu kadar açık olmayacak" — dökümanın açık
                    isteği. Master'da da kart üzerinde koyu bir örtü var; bizde
                    lacivert (marka kuralı). Üzerine gelince koyulaşıyor. */}
                <div className="pointer-events-none absolute inset-0 bg-navy/45 transition-colors duration-500 ease-[var(--ease-lux)] group-hover:bg-navy/65" />

                {/* ÜST — açıklama. Master'da boşta gizli, üzerine gelince
                    çıkıyor. `hover-gizli` gizlemeyi ekran genişliğine değil
                    fare yeteneğine bağlar (dokunmatikte hep açık). */}
                <p className="hover-gizli pointer-events-none absolute inset-x-8 top-8 line-clamp-3 text-[15px] font-medium leading-snug text-white md:top-14 md:text-[22px] xl:text-[35px] xl:leading-[1.2]">
                  {ilkCumleler(b.intro, b.headline, 150)}
                </p>

                {/* ALT — sektör · tarih (sağda) · isim · hizmet. Master'da
                    dördü de HEP GÖRÜNÜR. */}
                {/* `bottom-[52px]`: `bottom-16` (64px) ile blok master'dakinden
                    12px yukarıda kalıyordu (bizde sektör satırı üst 427, master
                    439). Ölçülerek oturtuldu. */}
                <div className="pointer-events-none absolute inset-x-6 bottom-6 md:inset-x-14 md:bottom-[52px]">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-[13px] font-medium text-white/95 md:text-[16px] xl:text-[19px]">
                      {b.sektor}
                    </p>
                    {/* Ekip teyidi beklenen tarih hiç gösterilmez — dökümanda
                        XXXX/?? yazıyordu, yer tutucu değer ekranda "gerçek"
                        gibi duruyordu (security-auditor bulgusu). */}
                    <p className="shrink-0 text-[12px] text-white md:text-[15px] xl:text-[17px]">
                      {b.tarihTeyitsiz ? "" : b.year}
                    </p>
                  </div>
                  <p className="mt-2 font-medium leading-[1.1] tracking-[-0.02em] text-white text-[24px] md:mt-3 md:text-[34px] xl:text-[48px]">
                    {b.name}
                  </p>
                  <p className="mt-1.5 text-[13px] font-medium text-white/95 md:text-[17px] xl:text-[21px]">
                    {b.listService}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <KapanisSection />
    </>
  );
}
