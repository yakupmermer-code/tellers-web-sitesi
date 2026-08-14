import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import ClosingCta from "@/components/ClosingCta";
import MediaReveal from "@/components/MediaReveal";
import ContactForm from "@/components/ContactForm";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Bir fikre, bir projeye ya da sadece bir merhabaya — tellers dinlemeye hazır.",
};

export default function IletisimPage() {
  return (
    <>
      {/* ── Ana slide ── */}
      <section className="relative mt-24">
        <MediaReveal>
          <Image
            src="/assets/contact/hero.png"
            alt="tellers ile iletişime geçin"
            width={1920}
            height={760}
            priority
            className="max-h-[64dvh] w-full object-cover"
            sizes="100vw"
          />
        </MediaReveal>
      </section>

      {/* ── Başlık ── */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-navy md:text-6xl">
            Bize ulaşın
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/60 md:text-xl">
            Bir fikre, bir projeye ya da sadece bir merhaba — dinlemeye hazırız.
          </p>
        </Reveal>
      </section>

      {/* ── Form (belirgin, ara çizgili) ── */}
      <section className="mx-auto grid max-w-[1440px] gap-16 px-5 pb-24 md:grid-cols-[1fr_1.4fr] md:gap-24 md:px-10 md:pb-36">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight text-navy md:text-3xl">
            Birlikte çalışalım
          </h2>
          <ul className="mt-8 flex flex-col gap-4 text-base leading-relaxed text-ink/65">
            <li>Hızlı geri dönüş, şeffaf iletişim.</li>
            <li>Veriyle gerekçelendirilmiş kararlar.</li>
            <li>Uçtan uca proje yönetimi.</li>
            <li>Stratejiden uygulamaya tek ekip.</li>
          </ul>

          {/* Diğer kanallar — ekip notundaki düzeltilmiş metinlerle */}
          <div className="mt-12 flex flex-col gap-4">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between border-b border-navy/15 pb-4 text-navy"
            >
              <span className="text-lg">Instagram&apos;da İnceleyin</span>
              <span className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="group flex items-center justify-between border-b border-navy/15 pb-4 text-navy"
            >
              <span className="text-lg">E-Posta Gönderin</span>
              <span className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="https://maps.google.com/?q=Istanbul"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between border-b border-navy/15 pb-4 text-navy"
            >
              <span className="text-lg">Haritada Görün</span>
              <span className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </section>

      {/* ── Sayfa bitiş imajı + lacivert referans logo bandı ── */}
      <ClosingCta />
    </>
  );
}
