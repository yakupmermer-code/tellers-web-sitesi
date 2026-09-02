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
import KapanisSection from "@/components/KapanisSection";
import MediaReveal from "@/components/MediaReveal";
import { BRANDS } from "@/content/brands";

const ACIKLAMA =
  "Mastercard, Bardahl, BNI, b-fit ve 13 marka için yaptığımız markalama, performans pazarlama, dijital pazarlama ve kreatif tasarım işleri.";

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
        <MediaReveal sabit>
          <video
            src="/assets/portfolio/hero.mp4"
            poster="/assets/portfolio/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="tellers portfolyo"
            className="h-auto w-full"
          />
        </MediaReveal>
      </section>

      {/* ── Tasarım felsefesi (temanın orijinal yerleşimi) ── */}
      <section className="mx-auto grid max-w-[1440px] gap-12 px-5 py-28 md:grid-cols-2 md:gap-20 md:px-10 md:py-40">
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

      {/* ── Marka bannerları — temadaki gibi görsel üzerine metin overlay,
          altında çizgi + hizmet + yıl (ekip notu 2026-08-14) ── */}
      <section className="mx-auto max-w-[1440px] px-5 pb-28 md:px-10 md:pb-40">
        {/* DİKKAT (2026-08-31): burada Stagger KULLANILAMAZ. framer'ın
            viewport.amount değeri IntersectionObserver eşiği olarak geçiyor ve
            eşik ELEMANIN KENDİ alanının yüzdesi. Bu grid 5488px; iPhone'da
            (812px) görünürlük oranı en fazla 0.148 oluyor, eşik 0.15 → gözlemci
            HİÇ tetiklenmiyor ve 17 kartın tamamı opacity:0 kalıyor. Gerçek
            tarayıcıda doğrulandı. Her kart KENDİ gözlemcisini taşımalı. */}
        <div className="grid gap-6 sm:grid-cols-2">
          {BRANDS.map((b, i) => (
            <Reveal key={b.slug} delay={0.04 * (i % 2)}>
              <Link href={`/portfolyo/${b.slug}`} className="group block">
                <div className="relative overflow-hidden">
                  <Image
                    src={b.banner}
                    alt={`${b.name} — ${b.headline}`}
                    width={960}
                    height={720}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.03]"
                    sizes="(min-width: 640px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
                  <p className="absolute bottom-5 left-5 text-2xl font-bold tracking-tight text-white md:text-[36px]">
                    {b.name}
                  </p>
                </div>
                <div className="mt-4 flex items-baseline justify-between border-t hairline pt-3">
                  <p className="text-sm text-navy/70">{b.listService}</p>
                  {/* Ekip teyidi beklenen tarih hiç gösterilmez — dökümanda
                      XXXX/?? yazıyordu, yer tutucu değer ekranda "gerçek"
                      gibi duruyordu (security-auditor bulgusu). */}
                  <p className="text-sm text-navy/50">
                    {b.tarihTeyitsiz ? "" : b.year}
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
