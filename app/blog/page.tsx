import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import KapanisSection from "@/components/KapanisSection";
import MediaReveal from "@/components/MediaReveal";
import { BLOGS } from "@/content/blogs";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Pazarlama, markalama ve anlam mimarisi üzerine tellers'ın güncel yazıları.",
};

import type { Blog } from "@/content/blogs";

function WideCard({ blog: b }: { blog: Blog }) {
  return (
    <Reveal>
      <Link href={`/blog/${b.slug}`} className="group grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden">
          <Image
            src={b.image}
            alt={b.title}
            width={1200}
            height={800}
            className="aspect-[3/2] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-bold leading-snug tracking-tight text-navy md:text-[48px]">
            {b.title}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-navy/60 md:text-lg">
            {b.excerpt}
          </p>
          <span className="link-grow mt-6 w-max text-sm font-bold text-navy">
            Yazıyı okuyun →
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export default function BlogPage() {
  // İlk ve son yazı geniş kart, aradakiler grid — yazı sayısı değişse de kırılmaz
  const [first, ...rest] = BLOGS;
  const last = rest.length > 0 ? rest[rest.length - 1] : undefined;
  const middle = rest.slice(0, -1);

  return (
    <>
      <h1 className="sr-only">tellers Blog</h1>
      {/* ── Ana slide ── */}
      <section className="relative mt-24">
        <MediaReveal parallax>
          <Image
            src="/assets/blog/hero.png"
            alt="tellers blog"
            width={1920}
            height={760}
            priority
            className="max-h-[64dvh] w-full object-cover"
            sizes="100vw"
          />
        </MediaReveal>
      </section>

      <section className="mx-auto flex max-w-[1440px] flex-col gap-20 px-5 py-24 md:px-10 md:py-36">
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
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
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
