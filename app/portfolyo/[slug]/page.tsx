import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import KapanisSection from "@/components/KapanisSection";
import CountUp from "@/components/CountUp";
import { BRANDS, getBrand } from "@/content/brands";

export function generateStaticParams() {
  return BRANDS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const brand = getBrand((await params).slug);
  if (!brand) return {};
  return {
    title: `${brand.name} | Portfolyo`,
    description: brand.headline,
  };
}

export default async function MarkaDetayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const brand = getBrand((await params).slug);
  if (!brand) notFound();

  // Mevcut markadan sonraki 4 marka (dairesel) — her sayfada farklı öneri çıkar
  const idx = BRANDS.findIndex((b) => b.slug === brand.slug);
  const others = Array.from(
    { length: 4 },
    (_, i) => BRANDS[(idx + 1 + i) % BRANDS.length]
  );

  return (
    <>
      {/* ── Ana slide + sağ altta proje detayları ── */}
      <section className="relative mt-24 overflow-hidden bg-navy">
        <Reveal>
          {brand.hero.type === "video" ? (
            <video
              src={brand.hero.src}
              poster={brand.hero.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="max-h-[82dvh] w-full object-cover"
              aria-label={`${brand.name} tanıtım videosu`}
            />
          ) : (
            <Image
              src={brand.hero.src}
              alt={`${brand.name} — ${brand.headline}`}
              width={1920}
              height={1000}
              priority
              className="max-h-[82dvh] w-full object-cover"
              sizes="100vw"
            />
          )}
        </Reveal>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/70 to-transparent pb-8 pt-24">
          <div className="mx-auto flex max-w-[1440px] justify-end px-5 md:px-10">
            <ul className="text-right text-[12px] uppercase tracking-[0.14em] text-white/85 md:text-sm">
              {brand.services.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Başlık + tanıtım ── */}
      <section className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:grid-cols-2 md:gap-20 md:px-10 md:py-36">
        <Reveal>
          <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-navy md:text-5xl">
            {brand.headline}
          </h1>
          {brand.subheadline && (
            <p className="mt-4 text-lg text-ink/60">{brand.subheadline}</p>
          )}
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-col gap-6 text-lg leading-relaxed text-ink/75">
            {brand.intro.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Operasyon Detayları ── */}
      <section className="mx-auto grid max-w-[1440px] gap-12 border-t hairline px-5 py-24 md:grid-cols-2 md:gap-20 md:px-10 md:py-32">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight text-navy md:text-4xl">
            Operasyon Detayları
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <dl className="flex flex-col">
            {[
              ["Müşteri", brand.meta.musteri],
              ["Operasyon Tarihi", brand.meta.tarih],
              ["Operasyon Süresi", brand.meta.sure],
              ["Proje", brand.meta.proje.join("\n")],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex flex-col gap-1 border-b hairline py-5 md:flex-row md:justify-between md:gap-8"
              >
                <dt className="text-[12px] uppercase tracking-[0.18em] text-ink/40">
                  {k}
                </dt>
                <dd className="whitespace-pre-line text-right text-base text-navy md:text-lg">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* ── Galeri ── */}
      {brand.gallery && (
        <section className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 pb-24 md:px-10 md:pb-32">
          {brand.gallery.map((g, i) => {
            if (g.kind === "image")
              return (
                <Reveal key={i}>
                  <Image
                    src={g.src}
                    alt={`${brand.name} çalışması ${i + 1}`}
                    width={1920}
                    height={1080}
                    className="h-auto w-full"
                    sizes="100vw"
                  />
                </Reveal>
              );
            if (g.kind === "video")
              return (
                <Reveal key={i}>
                  <video
                    src={g.src}
                    poster={g.poster}
                    controls
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full"
                    aria-label={`${brand.name} video çalışması`}
                  />
                </Reveal>
              );
            // Üçlü grid: uzun alan bir yanda, iki yatay diğer yanda
            const tall = (
              <div className="overflow-hidden md:h-full">
                {g.left.type === "video" ? (
                  <video
                    src={g.left.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                    aria-label={`${brand.name} dikey video`}
                  />
                ) : (
                  <Image
                    src={g.left.src}
                    alt={`${brand.name} dikey görsel`}
                    width={760}
                    height={1100}
                    className="h-full w-full object-cover"
                    sizes="(min-width: 768px) 40vw, 100vw"
                  />
                )}
              </div>
            );
            const pair = (
              <div className="flex flex-col gap-6">
                {[g.rightTop, g.rightBottom].map((src) => (
                  <div key={src} className="overflow-hidden">
                    <Image
                      src={src}
                      alt={`${brand.name} yatay görsel`}
                      width={1100}
                      height={640}
                      className="aspect-[16/9] w-full object-cover"
                      sizes="(min-width: 768px) 60vw, 100vw"
                    />
                  </div>
                ))}
              </div>
            );
            return (
              <Reveal key={i}>
                <div className="grid gap-6 md:grid-cols-[2fr_3fr]">
                  {g.flip ? (
                    <>
                      {pair}
                      {tall}
                    </>
                  ) : (
                    <>
                      {tall}
                      {pair}
                    </>
                  )}
                </div>
              </Reveal>
            );
          })}
        </section>
      )}

      {/* ── Performance Results (yalnız veri verilen markalarda) ── */}
      {brand.results && (
        <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10 md:pb-32">
          <div className="grid gap-12 border-t hairline pt-16 md:grid-cols-3">
            {brand.results.map((r, i) => (
              <Reveal key={r.value} delay={0.06 * i}>
                <h3 className="text-5xl font-bold tracking-tight text-navy md:text-6xl">
                  <CountUp value={r.value} />
                </h3>
                <p className="mt-3 text-base leading-relaxed text-ink/60">
                  {r.label}
                </p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── More Projects ── */}
      <section className="mx-auto max-w-[1440px] border-t hairline px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-navy md:text-5xl">
            Diğer Projeler
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((b, i) => (
            <Reveal key={b.slug} delay={0.05 * i}>
              <Link href={`/portfolyo/${b.slug}`} className="group block">
                <div className="overflow-hidden">
                  <Image
                    src={b.banner}
                    alt={b.name}
                    width={640}
                    height={480}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <p className="mt-3 text-sm uppercase tracking-[0.14em] text-navy">
                  {b.name}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Kapanış — marka detaylarında referans logo bandı YOK (ekip notu) ── */}
      <KapanisSection withRefLogos={false} />
    </>
  );
}
