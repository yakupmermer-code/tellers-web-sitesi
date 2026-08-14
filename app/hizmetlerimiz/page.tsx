import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import KapanisSection from "@/components/KapanisSection";
import MediaReveal from "@/components/MediaReveal";
import BlogSlider from "@/components/BlogSlider";
import { SERVICES } from "@/content/services";

export const metadata: Metadata = {
  title: "Hizmetlerimiz",
  description:
    "Performans pazarlama, dijital pazarlama, markalama ve kreatif tasarım — tellers'ın uçtan uca hizmetleri.",
};

const TAAHHUTLER = [
  {
    t: "Netlik Disiplini",
    d: "Her iş hedef → metrik → hipotez ile başlar; her cümlenin görevi, her görselin gerekçesi vardır.",
  },
  {
    t: "Kültür Okuryazarlığı",
    d: "İçgörüleri yalnızca veriden değil; yerel kültür, dil ve davranış kodlarından devşiririz.",
  },
  {
    t: "Yaratıcı × Ticari",
    d: "Büyük fikri, kanal ve anlara çevirir; iş hedefleriyle bağlarız (CPA, LTV, ROAS, NPS).",
  },
  {
    t: "AI & Veri Omurgası",
    d: "Segmentasyon, kişiselleştirme, medya optimizasyonu ve içerik üretiminde yapay zekâ ve otomasyon kullanırız.",
  },
  {
    t: "Şeffaflık & Dürüstlük",
    d: "Ölçemediğimiz değeri vaat etmeyiz; radikal dürüst raporlama ve öneri sunarız.",
  },
  {
    t: "Premium Uygulama",
    d: "Tutarlı tasarım dili, kusursuz uygulama ve çok kanallı deneyim standardı uygularız.",
  },
];

export default function HizmetlerimizPage() {
  return (
    <>
      <h1 className="sr-only">Hizmetlerimiz</h1>
      {/* ── Ana slide ── */}
      <section className="relative mt-24">
        <MediaReveal parallax>
          <Image
            src="/assets/services/hero.png"
            alt="tellers hizmetleri"
            width={1920}
            height={860}
            priority
            className="max-h-[72dvh] w-full object-cover"
            sizes="100vw"
          />
        </MediaReveal>
      </section>

      {/* ── 4 hizmet bloğu ── */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
        {SERVICES.map((s) => (
          <Reveal key={s.slug}>
            <article
              id={s.slug}
              className="grid gap-10 border-t hairline py-16 first:border-t-0 md:grid-cols-[1.4fr_1fr] md:gap-24 md:py-24"
            >
              <div>
                <span className="text-[11px] uppercase tracking-[0.22em] text-ink/40">
                  {s.eyebrow}
                </span>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy md:text-5xl">
                  {s.titleEn}
                </h2>
                <p className="mt-4 text-lg font-bold text-navy/80">
                  {s.tagline}
                </p>
                <p className="mt-6 text-lg leading-relaxed text-ink/70">
                  {s.detail}
                </p>
              </div>
              <ul className="flex flex-col self-center">
                {s.items.map((item) => (
                  <li
                    key={item}
                    className="border-b hairline py-4 text-base text-navy/80 md:text-lg"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </section>

      {/* ── "Siz hazırsanız, biz hazırız." — sağda tıklanabilir hizmet alanları ── */}
      <Reveal>
        <div className="relative">
          <Image
            src="/assets/services/imaj-1.png"
            alt="Siz hazırsanız, biz hazırız."
            width={1920}
            height={400}
            className="h-auto w-full"
            sizes="100vw"
          />
          <nav
            aria-label="Hizmetlere hızlı erişim"
            className="absolute inset-y-0 right-5 hidden flex-col items-end justify-center gap-2 md:right-14 md:flex"
          >
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={`#${s.slug}`}
                className="link-grow text-[12px] uppercase tracking-[0.16em] text-white/80 transition-colors duration-500 hover:text-white"
              >
                {s.titleTr}
              </Link>
            ))}
          </nav>
        </div>
      </Reveal>

      {/* ── Nasıl Yaparız? + Operasyonel Taahhütler ── */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
        <Reveal>
          <h2 className="text-4xl font-bold leading-[1.02] tracking-tight text-navy md:text-6xl">
            Nasıl Yaparız?
          </h2>
          <p className="mt-2 text-[12px] uppercase tracking-[0.2em] text-navy/60">
            Operasyonel Taahhütler
          </p>
          <p className="mt-8 max-w-4xl text-lg leading-relaxed text-ink/70 md:text-xl">
            Gürültünün içinde{" "}
            <em className="font-didot italic text-navy">netlik üretir</em>;
            netliği stratejiye, stratejiyi deneyime, deneyimi{" "}
            <em className="font-didot italic text-navy">ölçülebilir büyümeye</em>{" "}
            çeviririz. En yalın haliyle markalar için{" "}
            <em className="font-didot italic text-navy">davranış, kültür</em> ve{" "}
            <em className="font-didot italic text-navy">algı</em> düzeyinde{" "}
            <em className="font-didot italic text-navy">
              sürdürülebilir anlam sistemleri
            </em>{" "}
            kurarız.
          </p>
        </Reveal>
        <div className="mt-16 grid gap-x-16 gap-y-12 md:grid-cols-2">
          {TAAHHUTLER.map((item, i) => (
            <Reveal key={item.t} delay={0.04 * (i % 2)}>
              <div className="flex gap-6 border-t hairline pt-6">
                <span className="font-didot text-lg text-navy/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-navy md:text-2xl">
                    {item.t}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-ink/60">
                    {item.d}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Blog 4'lü slider ── */}
      <section className="pb-24 md:pb-36">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight text-navy md:text-5xl">
              Blog
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="mt-10">
          <BlogSlider />
        </Reveal>
      </section>

      {/* ── Kapanış + referans logolar ── */}
      <KapanisSection />
    </>
  );
}
