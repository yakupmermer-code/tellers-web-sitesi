import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import KapanisSection from "@/components/KapanisSection";
import CountUp from "@/components/CountUp";
import { BRANDS, getBrand } from "@/content/brands";
import { gorselOlcu } from "@/lib/gorsel";
import JsonLd from "@/components/JsonLd";
import {
  grafik,
  sayfaSemasi,
  kirintiSemasi,
  markaSemasi,
  kisalt,
  paylasim,
  ogKarti,
} from "@/lib/seo";

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
  const aciklama = kisalt(brand.intro);
  return {
    // "X | Portfolyo | tellers" yerine hizmet adı: aranan kelime başlıkta olur.
    title: `${brand.name} — ${brand.services[0]}`,
    description: aciklama,
    alternates: { canonical: `/portfolyo/${brand.slug}` },
    ...paylasim({
      baslik: `${brand.name} — ${brand.headline}`,
      aciklama,
      yol: `/portfolyo/${brand.slug}`,
      gorsel: ogKarti("marka", brand.slug),
      gorselAlt: `${brand.name} — tellers işi`,
      makale: true,
    }),
  };
}

export default async function MarkaDetayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const brand = getBrand((await params).slug);
  if (!brand) notFound();
  const aciklama = kisalt(brand.intro);

  // Mevcut markadan sonraki 3 marka (dairesel) — her sayfada farklı öneri çıkar
  const idx = BRANDS.findIndex((b) => b.slug === brand.slug);
  const others = Array.from(
    { length: 3 },
    (_, i) => BRANDS[(idx + 1 + i) % BRANDS.length]
  );

  return (
    <>
      <JsonLd
        data={grafik(
          sayfaSemasi({
            tip: "ItemPage",
            yol: `/portfolyo/${brand.slug}`,
            ad: `${brand.name} — ${brand.headline}`,
            aciklama,
            gorsel: ogKarti("marka", brand.slug),
          }),
          markaSemasi(brand),
          kirintiSemasi([
            { ad: "Ana Sayfa", yol: "/" },
            { ad: "Portfolyo", yol: "/portfolyo" },
            { ad: brand.name, yol: `/portfolyo/${brand.slug}` },
          ])
        )}
      />
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
        <Reveal mask>
          <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-navy md:text-[64px]">
            {brand.headline}
          </h1>
          {/* Tema deseni (arpeggio /work/velocity-motors): büyük tanıtım
              başlığının hemen altında, aynı sol hizada, ~2/3 puntoda marka
              adı ikinci başlık olarak yer alır (temada 84px başlık → 56px ad).
              Ekip notu: "MasterCard'ı Velocity Motors gibi yazalım —
              yer ve başlık benzerliği olarak" (2026-08-15 teyidi). */}
          <p className="mt-6 text-2xl font-bold leading-tight tracking-tight text-navy md:mt-8 md:text-[44px]">
            {brand.name}
          </p>
          {brand.subheadline && (
            <p className="mt-4 text-lg text-navy/60">{brand.subheadline}</p>
          )}
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-col gap-6 text-lg leading-relaxed text-navy/75">
            {brand.intro.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Operasyon Detayları ──
          Gri fon (ekip notu 2026-08-14: "2 alanın da fonu beyaz kalmış, bir
          alanın arka tarafı gri olmalı"): üstteki tanıtım metni beyaz kalır,
          bu alan gri olur. Gri fon ayıracın kendisi olduğu için üstteki ince
          çizgi kaldırıldı. */}
      <div className="bg-mist">
        <section className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:grid-cols-2 md:gap-20 md:px-10 md:py-32">
          <Reveal mask>
            <h2 className="text-2xl font-bold tracking-tight text-navy md:text-[48px]">
              Operasyon Detayları
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <dl className="flex flex-col">
              {[
                ["Müşteri", brand.meta.musteri],
                // Ekip teyidi beklenen tarihte satır BOŞ bırakılır ve aşağıdaki
                // filtre onu tamamen eler — yer tutucu değeri ekranda "gerçek"
                // gibi göstermemek için (security-auditor bulgusu, 2026-08-31).
                ["Operasyon Tarihi", brand.tarihTeyitsiz ? "" : brand.meta.tarih],
                ["Operasyon Süresi", brand.meta.sure],
                ["Proje", brand.meta.proje.join("\n")],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                <div
                  key={k}
                  className="flex flex-col gap-1 border-b hairline py-5 md:flex-row md:justify-between md:gap-8"
                >
                  <dt className="text-[12px] uppercase tracking-[0.18em] text-navy/40">
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
      </div>

      {/* ── Galeri ── */}
      {brand.gallery && (
        <section className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 pb-24 pt-24 md:px-10 md:pb-32 md:pt-32">
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
            // Eşit kutulu grid (döküman: Atlantis 2'li, Sua 2'li, Utkan 3'lü)
            if (g.kind === "grid")
              return (
                <div
                  key={i}
                  className={`grid gap-6 ${
                    g.cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
                  }`}
                >
                  {g.items.map((it, j) => (
                    <Reveal key={it.src} delay={0.04 * (j % g.cols)}>
                      <div className="overflow-hidden">
                        {it.type === "video" ? (
                          <video
                            src={it.src}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="aspect-[4/5] w-full object-cover"
                            aria-label={`${brand.name} video çalışması ${j + 1}`}
                          />
                        ) : (
                          <Image
                            src={it.src}
                            alt={`${brand.name} çalışması ${j + 1}`}
                            width={1080}
                            height={1350}
                            className="aspect-[4/5] w-full object-cover"
                            sizes={
                              g.cols === 3
                                ? "(min-width: 768px) 33vw, 100vw"
                                : "(min-width: 768px) 50vw, 100vw"
                            }
                          />
                        )}
                      </div>
                    </Reveal>
                  ))}
                </div>
              );
            /* Üçlü grid: uzun alan bir yanda, iki yatay diğer yanda.
               DÜZELTME (2026-08-31): kutular görsele SABİT oran dayatıyordu
               (sol dikey, sağ 16:9) ve object-cover görselin içindeki yazıyı
               kesiyordu — Bardahl'da %42, My Nova'da %60 kayıp. Artık her
               görsel kendi gerçek oranıyla çiziliyor: ne kırpma var ne boş
               bant. Ölçüler derleme anında dosyadan okunuyor (lib/gorsel.ts). */
            // Video da dahil: ölçü videonun poster karesinden okunuyor.
            const solOlcu = gorselOlcu(g.left.src);
            const ustOlcu = gorselOlcu(g.rightTop);
            const altOlcu = gorselOlcu(g.rightBottom);

            /* Kolon genişliği görsellerin GERÇEK oranından hesaplanır, böylece
               iki kolon aynı yükseklikte biter — kırpma da yok, boşluk da.
               Türetme: solYükseklik = solGenişlik / solOran,
               sağYükseklik = sağGenişlik × (1/üstOran + 1/altOran).
               İkisini eşitleyip solPay = solOran×k / (1 + solOran×k) çıkar.
               (Dikey boşluk ihmal edilir — etkisi birkaç piksel.) */
            const solOran = solOlcu.width / solOlcu.height;
            const k = ustOlcu.height / ustOlcu.width + altOlcu.height / altOlcu.width;
            const solPay = (solOran * k) / (1 + solOran * k);
            const tall = (
              <div className="overflow-hidden">
                {g.left.type === "video" ? (
                  <video
                    src={g.left.src}
                    poster={g.left.src.replace(/\.mp4$/, "-poster.jpg")}
                    width={solOlcu.width}
                    height={solOlcu.height}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-auto w-full"
                    aria-label={`${brand.name} dikey video`}
                  />
                ) : (
                  <Image
                    src={g.left.src}
                    alt={`${brand.name} görseli`}
                    width={solOlcu.width}
                    height={solOlcu.height}
                    className="h-auto w-full"
                    sizes="(min-width: 768px) 40vw, 100vw"
                  />
                )}
              </div>
            );
            const pair = (
              <div className="flex flex-col gap-6">
                {[g.rightTop, g.rightBottom].map((src) => {
                  const olcu = gorselOlcu(src);
                  return (
                    <div key={src} className="overflow-hidden">
                      <Image
                        src={src}
                        alt={`${brand.name} görseli`}
                        width={olcu.width}
                        height={olcu.height}
                        className="h-auto w-full"
                        sizes="(min-width: 768px) 60vw, 100vw"
                      />
                    </div>
                  );
                })}
              </div>
            );
            return (
              <Reveal key={i}>
                {/* items-start: kolonlar birbirine esnetilMEZ. Esnetilince sol
                    görsel sağ çiftin yüksekliğine zorlanıp kırpılıyordu. */}
                <div
                  className="grid items-start gap-6 md:grid-cols-[var(--sol)_var(--sag)]"
                  style={
                    {
                      "--sol": `${(solPay * 100).toFixed(2)}fr`,
                      "--sag": `${((1 - solPay) * 100).toFixed(2)}fr`,
                    } as React.CSSProperties
                  }
                >
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
                <h3 className="text-5xl font-bold tracking-tight text-navy md:text-[96px]">
                  <CountUp value={r.value} />
                </h3>
                <p className="mt-3 text-base leading-relaxed text-navy/60">
                  {r.label}
                </p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── More Projects ── */}
      <section className="mx-auto max-w-[1440px] border-t hairline px-5 py-24 md:px-10 md:py-32">
        <Reveal mask>
          <h2 className="text-3xl font-bold tracking-tight text-navy md:text-[64px]">
            Diğer Projeler
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((b, i) => (
            <Reveal key={b.slug} delay={0.05 * i}>
              <Link href={`/portfolyo/${b.slug}`} className="group block">
                <div className="relative overflow-hidden">
                  <Image
                    src={b.banner}
                    alt={b.name}
                    width={760}
                    height={950}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
                  <p className="absolute bottom-5 left-5 text-xl font-bold tracking-tight text-white md:text-[28px]">
                    {b.name}
                  </p>
                </div>
                <div className="mt-4 flex items-baseline justify-between border-t hairline pt-3">
                  <p className="text-sm text-navy/70">{b.listService}</p>
                  <p className="text-sm text-navy/50">
                    {b.tarihTeyitsiz ? "" : b.year}
                  </p>
                </div>
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
