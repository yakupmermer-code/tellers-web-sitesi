import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import MediaReveal from "@/components/MediaReveal";
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
      gorsel: blog.image,
      gorselAlt: blog.title,
      makale: true,
      yayinTarihi: iso,
    }),
  };
}

/** İçerik gövdesini basit markdown kurallarıyla bloklara çevirir. */
function renderBody(body: string) {
  const blocks = body.split(/\n\n+/);
  return blocks.map((block, i) => {
    const t = block.trim();
    if (t.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="mt-12 text-2xl font-bold tracking-tight text-navy md:text-[36px]"
        >
          {t.slice(3)}
        </h2>
      );
    }
    if (t.startsWith("- ")) {
      return (
        <ul key={i} className="flex list-disc flex-col gap-3 pl-5">
          {t.split("\n").map((li, j) => (
            <li key={j} className="leading-relaxed">
              {li.replace(/^- /, "")}
            </li>
          ))}
        </ul>
      );
    }
    if (/^\d+\. /.test(t)) {
      return (
        <ol key={i} className="flex list-decimal flex-col gap-3 pl-5">
          {t.split("\n").map((li, j) => (
            <li key={j} className="leading-relaxed">
              {li.replace(/^\d+\. /, "")}
            </li>
          ))}
        </ol>
      );
    }
    return (
      <p key={i} className="leading-relaxed">
        {t}
      </p>
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
    (_, i) => BLOGS[(idx + 1 + i) % BLOGS.length]
  );

  return (
    <>
      <JsonLd
        data={grafik(
          sayfaSemasi({
            yol: `/blog/${blog.slug}`,
            ad: blog.title,
            aciklama: blog.excerpt,
            gorsel: blog.image,
          }),
          yaziSemasi(blog),
          kirintiSemasi([
            { ad: "Ana Sayfa", yol: "/" },
            { ad: "Blog", yol: "/blog" },
            { ad: blog.title, yol: `/blog/${blog.slug}` },
          ])
        )}
      />
      {/* Ekip notu (2026-08-14): başlık + "tellers — tarih" üstte kalır, hero
          görseli metin kolonundan çıkarılıp tam genişliğe alındı ve temanın
          perde açılma efekti (MediaReveal) ile açılır. */}
      <article className="pb-24 pt-36 md:pt-44">
        <div className="mx-auto max-w-[900px] px-5 md:px-10">
          <Reveal mask>
            <h1 className="text-3xl font-bold leading-[1.12] tracking-tight text-navy md:text-[64px]">
              {blog.title}
            </h1>
          </Reveal>
          <Reveal delay={0.03} className="mt-5">
            <p className="text-lg leading-relaxed text-navy/70">
              {blog.excerpt}
            </p>
          </Reveal>
          <Reveal delay={0.05} className="mt-4">
            <p className="text-sm text-navy/50">
              <span className="font-bold text-navy">tellers</span> — {blog.date}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 md:mt-16">
          <MediaReveal parallax>
            {/* Blog görsellerinin 6'sı kare (1080x1080), 2'si geniş
                (blog-1 ve blog-8: 1920x1080). Tam genişlikte h-auto verilirse
                kareler ekran boyu bir duvar oluyor; sabit 16/9 banner oranı +
                object-cover ile hepsi aynı yükseklikte ve öngörülebilir olur
                (dvh kullanılmadı: iOS'ta adres çubuğu açılıp kapanırken
                bandın yüksekliği zıplıyordu). */}
            <Image
              src={blog.image}
              alt={blog.title}
              width={1920}
              height={1080}
              priority
              className="aspect-[16/9] w-full object-cover"
              sizes="100vw"
            />
          </MediaReveal>
        </div>

        <div className="mx-auto max-w-[900px] px-5 md:px-10">
          <Reveal delay={0.12}>
            <div className="mt-12 flex flex-col gap-6 text-lg text-navy/75 md:mt-16">
              {renderBody(blog.body)}
            </div>
            <Link
              href={blog.cta.href}
              className="group mt-12 flex w-max items-center gap-3 rounded-full bg-navy px-7 py-3.5 text-sm text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
            >
              {blog.cta.label}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-px group-hover:translate-x-1">
                ↗
              </span>
            </Link>
          </Reveal>
        </div>
      </article>

      {/* Diğer yazılar */}
      <section className="mx-auto max-w-[1440px] border-t hairline px-5 py-24 md:px-10">
        <Reveal mask>
          <h2 className="text-2xl font-bold tracking-tight text-navy md:text-[48px]">
            Diğer Yazılar
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-3">
          {others.map((b, i) => (
            <Reveal key={b.slug} delay={0.05 * i}>
              <Link href={`/blog/${b.slug}`} className="group block">
                <div className="overflow-hidden">
                  <Image
                    src={b.image}
                    alt={b.title}
                    width={640}
                    height={480}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
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
