import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import KapanisSection from "@/components/KapanisSection";
import MediaReveal from "@/components/MediaReveal";
import { BRANDS } from "@/content/brands";

export const metadata: Metadata = {
  title: "Portfolyo",
  description:
    "MasterCard, Bardahl, My Nova ve daha fazlası — tellers'ın markalar için ürettiği işler.",
};

export default function PortfolyoPage() {
  return (
    <>
      {/* ── Ana slide: marka ismi/detay yok ── */}
      <section className="relative mt-24">
        <MediaReveal parallax>
          <video
            src="/assets/portfolio/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="tellers portfolyo"
            className="max-h-[78dvh] w-full object-cover"
          />
        </MediaReveal>
      </section>

      {/* ── Tasarım felsefesi (temanın orijinal yerleşimi) ── */}
      <section className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:grid-cols-2 md:gap-20 md:px-10 md:py-36">
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
              değil, <strong className="text-navy">anlamın görsel mantığı</strong>{" "}
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
      <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10 md:pb-36">
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
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
                    sizes="(min-width: 640px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
                  <p className="absolute bottom-5 left-5 text-2xl font-bold tracking-tight text-white md:text-[36px]">
                    {b.name}
                  </p>
                </div>
                <div className="mt-4 flex items-baseline justify-between border-t hairline pt-3">
                  <p className="text-sm text-navy/70">{b.listService}</p>
                  <p className="text-sm text-navy/50">{b.year}</p>
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
