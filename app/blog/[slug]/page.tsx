import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import HeroZoom from "@/components/HeroZoom";
import BlogKart from "@/components/BlogKart";
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
              <li key={j}>{li.replace(/^- /, "")}</li>
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
              <li key={j}>{li.replace(/^\d+\. /, "")}</li>
            ))}
          </ol>
        </Reveal>
      );
    }
    /*
     * SATIR ARALIĞI BURADA VERİLMEZ — kapsayıcıdan miras alınır.
     * Bir tur `leading-relaxed` (1,625) yazılıydı ve gövde kapsayıcısının
     * `leading-[1.4]`ünü eziyordu: master'da gövde 21px/29,4px (=1,4) ölçüldü,
     * bizde 34,1px çıkıyordu. (2026-09-11'de ölçülerek yakalandı.)
     */
    return (
      <Reveal key={i}>
        <p>{t}</p>
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

  /*
   * Komşu yazılar. Master'da (/journal/[slug]) yazı gövdesinin altında
   * "previous article" gezinmesi ve ardından 2 sütunlu bir "diğer yazılar"
   * ızgarası var. Bizde de aynısı: önceki/sonraki bağlantısı + 4 kart
   * (master'da 5 ama orada 7 yazı var; 4 çift sayı olduğu için 2x2 ızgara
   * boşluksuz kapanıyor).
   */
  const idx = BLOGS.findIndex((b) => b.slug === blog.slug);
  const onceki = BLOGS[(idx - 1 + BLOGS.length) % BLOGS.length];
  const sonraki = BLOGS[(idx + 1) % BLOGS.length];
  const others = Array.from(
    { length: 4 },
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

      {/* ── GÖVDE — MASTER'IN İKİ KOLONLU DÜZENİ ─────────────────────────
          MASTER ÖLÇÜMÜ (/journal/[slug], 1440px, canlı 2026-09-11):
            sol sütun  → x=40, genişlik 433, `position: sticky`, `top: 100px`
                         içinde: yazı başlığı 28px/500 gri · "Written by"
                         19px/500 · yazar adı 19px/500 siyah · unvan 17px/500
            sağ sütun  → x=533-565, genişlik 835-867
                         giriş paragrafı 35px, gri (111,111,117), satır 42px
                         gövde paragrafları 21px, (51,51,54), satır 29,4px

          Bizde tek kolonluk 900px'lik bir metin bloğu vardı; künye bilgisi de
          hero'da kalıyordu. Artık sol sütun sayfa kaydıkça sabit duruyor —
          okuyucu hangi yazıda olduğunu ve kimin yazdığını hep görüyor.

          `lg:` ALTINDA TEK KOLON: 433px sabit sütun + içerik, 1024px'in
          altında sığmıyor; orada künye yazının üstünde normal akışta. */}
      <article className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[433px_minmax(0,1fr)] lg:gap-20">
          <aside className="lg:sticky lg:top-[100px] lg:self-start">
            <Reveal>
              <p className="text-[20px] font-medium leading-snug text-navy/55 md:text-[24px] xl:text-[28px]">
                {blog.title}
              </p>
              {/* Döküman: "Yazan yerinde tellers yazacak ve blogların eklenme
                  tarihi yer alacak." Master'da bu blokta yazar adı ve unvanı
                  var; bizde yazar hep ajansın kendisi. */}
              <p className="mt-6 text-[16px] font-medium text-navy/60 md:text-[19px]">
                Yazan <span className="text-navy">tellers</span>
              </p>
              <p className="mt-1 text-[14px] font-medium text-navy/55 md:text-[17px]">
                {blog.date}
              </p>
            </Reveal>
          </aside>

          <div>
            {/* GİRİŞ PARAGRAFI — master'da 35px ve gövdeden AÇIK renkte. */}
            <Reveal>
              <p className="text-[20px] leading-snug text-navy/55 md:text-[26px] xl:text-[35px] xl:leading-[1.2]">
                {blog.excerpt}
              </p>
            </Reveal>
            <div className="mt-10 flex flex-col gap-6 text-[17px] leading-[1.4] text-navy/85 md:mt-14 md:text-[21px]">
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

            {/* ── ÖNCEKİ / SONRAKİ YAZI ──────────────────────────────────
                Master'da gövdenin altında "previous article" bağlantısı var
                (12px). Bizde ikisi birden: okuyucu yazı bitince listeye geri
                dönmeden komşu yazıya geçebiliyor. */}
            <nav
              aria-label="Yazılar arası gezinme"
              className="mt-16 flex flex-wrap justify-between gap-6 border-t hairline pt-8"
            >
              <Link
                href={`/blog/${onceki.slug}`}
                data-imlec="Oku"
                className="group max-w-[45%] min-w-[45%] grow"
              >
                <span className="block text-[12px] uppercase tracking-[0.14em] text-navy/50">
                  Önceki yazı
                </span>
                <span className="link-grow mt-2 inline-block text-[15px] font-medium leading-snug text-navy md:text-[18px]">
                  {onceki.title}
                </span>
              </Link>
              <Link
                href={`/blog/${sonraki.slug}`}
                data-imlec="Oku"
                className="group max-w-[45%] min-w-[45%] grow text-right"
              >
                <span className="block text-[12px] uppercase tracking-[0.14em] text-navy/50">
                  Sonraki yazı
                </span>
                <span className="link-grow link-grow-sag mt-2 inline-block text-[15px] font-medium leading-snug text-navy md:text-[18px]">
                  {sonraki.title}
                </span>
              </Link>
            </nav>
          </div>
        </div>
      </article>

      {/* Diğer yazılar */}
      <section className="mx-auto max-w-[1440px] border-t hairline px-5 py-20 md:px-10">
        <Reveal mask>
          <h2 className="text-2xl font-bold tracking-tight text-navy md:text-[48px]">
            Diğer Yazılar
          </h2>
        </Reveal>
        {/* MASTER ÖLÇÜSÜ: bu ızgara /journal dizinindekiyle aynı karttan
            oluşuyor — 668x800, iki sütun, 24px ara. Bir tur burada ayrı bir
            markup vardı (4/3 görsel + altında lacivert başlık); aynı işi iki
            farklı şekilde yapıyorduk ve biri değişince diğeri unutuluyordu.
            Artık `BlogKart`: tarih ve ilk cümleler üzerine gelince çıkıyor,
            başlık ve alt açıklama sabit — dizindekiyle birebir aynı davranış. */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {others.map((b, i) => (
            <Reveal key={b.slug} delay={0.05 * (i % 2)}>
              <BlogKart blog={b} className="aspect-[4/5] md:aspect-[668/800]" />
            </Reveal>
          ))}
        </div>
      </section>

      <KapanisSection />
    </>
  );
}
