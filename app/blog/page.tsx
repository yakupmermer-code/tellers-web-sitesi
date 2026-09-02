import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import {
  grafik,
  sayfaSemasi,
  kirintiSemasi,
  blogDiziniSemasi,
  paylasim,
} from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Stagger, StaggerItem } from "@/components/Stagger";
import KapanisSection from "@/components/KapanisSection";
import MediaReveal from "@/components/MediaReveal";
import { BLOGS } from "@/content/blogs";

const ACIKLAMA =
  "Pazarlama bütçesi, marka konumlandırma, ROAS ve ajans seçimi üzerine tellers'ın yazıları. Reklam yatırımınızı doğru kurgulamanın yolları.";

export const metadata: Metadata = {
  title: "Pazarlama ve Markalama Blogu",
  description: ACIKLAMA,
  alternates: { canonical: "/blog" },
  ...paylasim({
    baslik: "Blog | tellers",
    aciklama: ACIKLAMA,
    gorsel: "/assets/og/blog.jpg",
    yol: "/blog",
  }),
};

import type { Blog } from "@/content/blogs";

/**
 * Geniş blog kartı.
 * ANİMASYON (2026-09-02): eskiden görsel + başlık + özet + link TEK <Reveal>
 * içindeydi, hepsi aynı anda beliriyordu. Artık görsel kendi girişini yapıyor,
 * sağdaki metin kolonu kademeli geliyor — referanstaki iki kolonlu blokların
 * davranışı bu.
 */
function WideCard({ blog: b }: { blog: Blog }) {
  return (
    <Link
      href={`/blog/${b.slug}`}
      className="arrow-link group grid gap-8 md:grid-cols-2"
    >
      <Reveal>
        <div className="overflow-hidden">
          <Image
            src={b.image}
            alt={b.title}
            width={1200}
            height={800}
            className="aspect-[3/2] w-full object-cover transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.03]"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      </Reveal>
      <Stagger className="flex flex-col justify-center">
        <StaggerItem>
          <h2 className="text-2xl font-bold leading-snug tracking-tight text-navy md:text-[48px]">
            {b.title}
          </h2>
        </StaggerItem>
        <StaggerItem>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-navy/60 md:text-lg">
            {b.excerpt}
          </p>
        </StaggerItem>
        <StaggerItem>
          {/* `arrow-link` KARTIN kendisinde (Link'te), bu span'de değil:
              burada olsaydı ok yalnızca bu küçük yazının üstüne gelince kayar,
              klavye odağında hiç çalışmazdı (code-reviewer, 2026-09-02). */}
          <span className="mt-6 flex w-max items-center gap-2 text-sm font-bold text-navy">
            Yazıyı okuyun
            <span aria-hidden="true" className="arrow">
              →
            </span>
          </span>
        </StaggerItem>
      </Stagger>
    </Link>
  );
}

export default function BlogPage() {
  // İlk ve son yazı geniş kart, aradakiler grid — yazı sayısı değişse de kırılmaz
  const [first, ...rest] = BLOGS;
  const last = rest.length > 0 ? rest[rest.length - 1] : undefined;
  const middle = rest.slice(0, -1);

  return (
    <>
      <JsonLd
        data={grafik(
          sayfaSemasi({
            tip: "CollectionPage",
            yol: "/blog",
            ad: "Blog",
            aciklama: ACIKLAMA,
          }),
          blogDiziniSemasi(BLOGS),
          kirintiSemasi([
            { ad: "Ana Sayfa", yol: "/" },
            { ad: "Blog", yol: "/blog" },
          ]),
        )}
      />
      <h1 className="sr-only">tellers Blog</h1>
      {/* ── Ana slide ── */}
      <section className="relative mt-24">
        <MediaReveal sabit>
          <Image
            src="/assets/blog/hero.png"
            alt="tellers blog"
            width={1920}
            height={760}
            priority
            className="h-auto w-full"
            sizes="100vw"
          />
        </MediaReveal>
      </section>

      <section className="mx-auto flex max-w-[1440px] flex-col gap-20 px-5 py-28 md:px-10 md:py-40">
        {/* Geniş kart (temadaki 1. blog alanı) */}
        <WideCard blog={first} />

        {/* Orta alan — ekip notu (2026-08-15): temadaki gibi İKİLİ banner
            sıraları. Üstteki geniş kart → ikili banner satırları → footer'dan
            hemen önce aynı geniş karttan bir tane daha. */}
        <div className="grid gap-x-6 gap-y-16 md:grid-cols-2">
          {middle.map((b, i) => (
            <Reveal key={b.slug} delay={0.05 * (i % 2)}>
              <Link href={`/blog/${b.slug}`} className="group block">
                <div className="overflow-hidden">
                  <Image
                    src={b.image}
                    alt={b.title}
                    width={1200}
                    height={900}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.04]"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <h2 className="mt-6 text-xl font-bold leading-snug tracking-tight text-navy md:text-[30px]">
                  {b.title}
                </h2>
                <p className="mt-3 line-clamp-2 text-base leading-relaxed text-navy/55 md:text-lg">
                  {b.excerpt}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Sayfa sonunda ikinci geniş kart (ekip notu: 8. içerik için) */}
        {last && <WideCard blog={last} />}
      </section>

      <KapanisSection />
    </>
  );
}
