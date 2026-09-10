import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import HeroZoom from "@/components/HeroZoom";
import KapanisSection from "@/components/KapanisSection";
import { BLOGS, getBlog } from "@/content/blogs";
import JsonLd from "@/components/JsonLd";
import {
  grafik,
  sayfaSemasi,
  kirintiSemasi,
  yaziSemasi,
  trTarihISO,
  paylasim,
  ogKarti,
} from "@/lib/seo";

export function generateStaticParams() {
  return BLOGS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const blog = getBlog((await params).slug);
  if (!blog) return {};
  const iso = trTarihISO(blog.date);
  return {
    title: blog.title,
    description: blog.excerpt,
    alternates: { canonical: `/blog/${blog.slug}` },
    ...paylasim({
      baslik: blog.title,
      aciklama: blog.excerpt,
      yol: `/blog/${blog.slug}`,
      gorsel: ogKarti("blog", blog.slug),
      gorselAlt: blog.title,
      makale: true,
      yayinTarihi: iso,
    }),
  };
}

/**
 * İçerik gövdesini basit markdown kurallarıyla bloklara çevirir.
 * Her blok KENDİ <Reveal>'ı (kendi gözlemcisi): yazı gerçekten paragraf paragraf
 * akıyor (2026-09-07). Tek bir Stagger kabı denendi ve GERİ ALINDI — kap
 * tetiklenince 15 bloğun hepsi aynı anda zamanlayıcıya giriyor, kullanıcı ilk
 * 600px'deyken alttaki paragraflar görünmeden animasyonlarını bitiriyordu.
 * (Aynı gerekçe app/portfolyo/page.tsx'te de yazılı.)
 * Ayrıca bu bölme gövdeyi TEK bir dev animasyon kabı olmaktan çıkarıyor:
 * bileşenler margin tabanlı tetiklemeye geçse de küçük bloklar daha güvenli.
 */
function renderBody(body: string) {
  const blocks = body.split(/\n\n+/);
  return blocks.map((block, i) => {
    const t = block.trim();
    if (t.startsWith("## ")) {
      return (
        <Reveal key={i}>
          <h2 className="mt-12 text-2xl font-bold tracking-tight text-navy md:text-[36px]">
            {t.slice(3)}
          </h2>
        </Reveal>
      );
    }
    if (t.startsWith("- ")) {
      return (
        <Reveal key={i}>
          <ul className="flex list-disc flex-col gap-3 pl-5">
            {t.split("\n").map((li, j) => (
              <li key={j} className="leading-relaxed">
                {li.replace(/^- /, "")}
              </li>
            ))}
          </ul>
        </Reveal>
      );
    }
    if (/^\d+\. /.test(t)) {
      return (
        <Reveal key={i}>
          <ol className="flex list-decimal flex-col gap-3 pl-5">
            {t.split("\n").map((li, j) => (
              <li key={j} className="leading-relaxed">
                {li.replace(/^\d+\. /, "")}
              </li>
            ))}
          </ol>
        </Reveal>
      );
    }
    return (
      <Reveal key={i}>
        <p className="leading-relaxed">{t}</p>
      </Reveal>
    );
  });
}

export default async function BlogDetayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const blog = getBlog((await params).slug);
  if (!blog) notFound();

  // Mevcut yazıdan sonraki 3 yazı (dairesel) — her sayfada farklı öneri çıkar
  const idx = BLOGS.findIndex((b) => b.slug === blog.slug);
  const others = Array.from(
    { length: 3 },
    (_, i) => BLOGS[(idx + 1 + i) % BLOGS.length],
  );

  return (
    <>
      <JsonLd
        data={grafik(
          sayfaSemasi({
            yol: `/blog/${blog.slug}`,
            ad: blog.title,
            aciklama: blog.excerpt,
            gorsel: ogKarti("blog", blog.slug),
          }),
          yaziSemasi(blog),
          kirintiSemasi([
            { ad: "Ana Sayfa", yol: "/" },
            { ad: "Blog", yol: "/blog" },
            { ad: blog.title, yol: `/blog/${blog.slug}` },
          ]),
        )}
      />
      {/* ── HERO — MASTER /journal/[slug] DÜZENİ ──────────────────────────
          Revize dökümanı: "Blog detay sayfası yukarıdaki gibi olmayacak.
          Bloglarda detay sayfaları örnek temadaki efekt ile açılmalı, SLIDER
          ALANINI GÖRSEL FULL KAPLAMALI."

          ÖNCEKİ HÂL: başlık + özet + tarih beyaz zeminde, LACİVERT yazıyla,
          900px'lik metin kolonunda duruyordu; görsel onların ALTINDA ayrı bir
          16/9 bant olarak geliyordu. Master'da bunun tam tersi.

          MASTER ÖLÇÜMÜ (1440px, canlı, 2026-09-11):
            hero  → görsel kabı boydan boya kaplıyor, `object-fit: cover`
            H1    → 72px/600, BEYAZ, x=40, y=376
            özet  → 28px/500, beyaz, x=40, y=559
            metin bloğu hero'nun dikey ORTASINDA (merkez ~480, hero ~934px)

          `data-koyu-bolum` → üst bar bu bölümde saydam kalıp yazılarını beyaz
          bassın (components/Header.tsx ölçüyor).
          `data-imlec-koyu` → özel imleç fotoğrafın parlaklığını CSS'ten
          okuyamıyor; işaret olmadan lacivert nokta koyu görselde kaybolur
          (bkz. components/Imlec.tsx). */}
      <section
        data-koyu-bolum
        data-imlec-koyu
        className="relative h-[78vh] min-h-[480px] overflow-hidden bg-navy"
      >
        {/* Açılışta 1.28 ölçekten oturur — sitenin hero kalıbı. Dökümanın
            "örnek temadaki efekt ile açılmalı" maddesi bu. */}
        <HeroZoom className="absolute inset-0">
          <Image
            src={blog.image}
            alt=""
            width={1920}
            height={1080}
            priority
            className="h-full w-full object-cover"
            sizes="100vw"
          />
        </HeroZoom>

        {/* Okunurluk örtüsü: master'da da var, metinler onun üzerinde. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-navy/55"
        />

        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
            <Reveal mask>
              {/* `font-semibold` (600): master'da H1 72px/600 ölçüldü, 700 değil. */}
              <h1 className="text-[30px] font-semibold leading-[1.1] tracking-tight text-white md:text-[50px] xl:text-[72px]">
                {blog.title}
              </h1>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-6 max-w-4xl text-[16px] font-medium leading-snug text-white/95 md:text-[21px] xl:text-[28px]">
                {blog.excerpt}
              </p>
            </Reveal>
            {/* Döküman: "Yazan yerinde tellers yazacak ve blogların eklenme
                tarihi yer alacak." */}
            <Reveal delay={0.1}>
              <p className="mt-5 text-[13px] text-white/80 md:text-[15px]">
                Yazan: tellers — {blog.date}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ÜST DOLGU YOK: hero artık header'ın altından başlıyor ve barı
          kendisi kapatıyor. */}
      <article className="pb-20">
        <div className="mx-auto max-w-[900px] px-5 md:px-10">
          <div className="mt-12 flex flex-col gap-6 text-lg text-navy/75 md:mt-16">
            {renderBody(blog.body)}
          </div>
          <Reveal>
            <Link
              href={blog.cta.href}
              /* `w-max` YOK: uzun CTA etiketleri (ör. "tellers Strateji Ekibiyle
                 İletişime Geçin") telefonda 438px yer istiyordu, kapsayıcı 350px'ti
                 — sayfa 458px'e şişip sağdan 68px kırpılıyordu (`overflow-x: clip`
                 yüzünden kullanıcı kaydıramıyordu bile). Sarmasına izin
                 verildi. */
              className="link-grow mt-12 inline-block max-w-full font-medium text-[18px] text-navy transition-opacity duration-500 hover:opacity-70 md:text-[24px]"
            >
              {blog.cta.label}
            </Link>
          </Reveal>
        </div>
      </article>

      {/* Diğer yazılar */}
      <section className="mx-auto max-w-[1440px] border-t hairline px-5 py-20 md:px-10">
        <Reveal mask>
          <h2 className="text-2xl font-bold tracking-tight text-navy md:text-[48px]">
            Diğer Yazılar
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-3">
          {others.map((b, i) => (
            <Reveal key={b.slug} delay={0.05 * i}>
              <Link
                href={`/blog/${b.slug}`}
                data-imlec="Oku"
                className="group block"
              >
                <div className="overflow-hidden">
                  <Image
                    src={b.image}
                    alt={b.title}
                    width={640}
                    height={480}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.04]"
                    sizes="(min-width: 640px) 33vw, 100vw"
                  />
                </div>
                <h3 className="mt-4 line-clamp-2 text-base font-bold leading-snug text-navy">
                  {b.title}
                </h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <KapanisSection />
    </>
  );
}
