import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { grafik, sayfaSemasi, kirintiSemasi, paylasim } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import MediaReveal from "@/components/MediaReveal";
import RefLogoBand from "@/components/RefLogoBand";
import ContactForm from "@/components/ContactForm";

const ACIKLAMA =
  "Fikirlerin değer gördüğü, yaratıcılığın sonuçlarla buluştuğu bir ekipte yerini al. tellers'ta reklam, tasarım ve pazarlama kariyeri.";

export const metadata: Metadata = {
  title: "Kariyer — Ekibimize Katılın",
  description: ACIKLAMA,
  alternates: { canonical: "/kariyer" },
  ...paylasim({
    baslik: "Kariyer | tellers",
    aciklama: ACIKLAMA,
    gorsel: "/assets/og/kariyer.jpg",
    yol: "/kariyer",
  }),
};

/* Ekip notu: Kariyer sayfası, İletişim sayfasının yapısını kullanır.
   İçerik dökümanı (Google Doc, KARİYER bölümü) birebir uygulanmıştır. */
export default function KariyerPage() {
  return (
    <>
      <JsonLd
        data={grafik(
          sayfaSemasi({
            yol: "/kariyer",
            ad: "Kariyer",
            aciklama: ACIKLAMA,
          }),
          kirintiSemasi([
            { ad: "Ana Sayfa", yol: "/" },
            { ad: "Kariyer", yol: "/kariyer" },
          ]),
        )}
      />
      {/* ── Ana slide ── */}
      <section className="relative mt-24">
        <MediaReveal>
          <Image
            src="/assets/career/hero.png"
            alt="tellers ekibine katılın"
            width={3000}
            height={722}
            priority
            className="max-h-[64dvh] w-full object-cover"
            sizes="100vw"
          />
        </MediaReveal>
      </section>

      {/* ── Giriş metni ── */}
      <section className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-32">
        <Reveal mask>
          <h1 className="max-w-4xl text-3xl font-bold leading-[1.12] tracking-tight text-navy md:text-[64px]">
            Fikirlerin değer gördüğü, yaratıcılığın sonuçlarla buluştuğu bir
            ekipte yerini al; birlikte iz bırakan işler üretelim.
          </h1>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-navy/70 md:text-[22px]">
            Yeni fikirlerden korkmuyor,{" "}
            <em className="font-didot italic">
              “daha iyisini nasıl yapabiliriz?”
            </em>{" "}
            sorusunu her projenin başlangıç noktası olarak görüyoruz.
          </p>
        </Reveal>
      </section>

      {/* ── Başvuru formu (gri fon: üstteki metin alanından ayrılsın) ── */}
      <div className="bg-mist">
        <section
          id="basvuru"
          className="mx-auto max-w-[900px] px-5 py-28 md:px-10 md:py-32"
        >
          <Reveal mask>
            <h2 className="text-3xl font-bold tracking-tight text-navy md:text-[48px]">
              Kendinizi anlatın.
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-navy/60">
              Sadece selam mı vermek istiyorsunuz? Doğrudan ad alanına
              geçebilirsiniz.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="mt-12">
            <ContactForm variant="kariyer" />
          </Reveal>
        </section>
      </div>

      {/* ── Aradığımız ekip arkadaşı ── */}
      <section className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-32">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <Reveal mask>
            <h2 className="text-3xl font-bold leading-[1.12] tracking-tight text-navy md:text-[64px]">
              Aradığımız ekip arkadaşı nasıl biri?
            </h2>
            <p className="mt-1.5 text-lg text-navy/50 md:text-[22px]">
              Merak eden. Üreten. Sorgulayan. Gelişmek isteyen.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col justify-center gap-6">
            <p className="text-lg leading-relaxed text-navy/75 md:text-[22px]">
              Her şeyi bilen insanları değil,{" "}
              <em className="font-didot italic">öğrenmeye açık</em> insanları
              arıyoruz.
            </p>
            <p className="text-lg leading-relaxed text-navy/75 md:text-[22px]">
              Bir fikri savunabilen ama gerektiğinde fikrini değiştirebilen,
              detaylara önem veren ama bütünü görebilen, yaptığı işin sonucunu
              merak eden insanlarla çalışmak istiyoruz.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Kariyere özel sayfa bitiş imajı ──
          Görselin içinde "genel başvuru yap." yazısı basılı; onun üstüne
          tıklanabilir alan konur ve yukarıdaki forma çapa atar. */}
      <section aria-label="Genel başvuru" className="relative">
        <Reveal>
          <div className="relative">
            <Image
              src="/assets/career/kapanis.png"
              alt="Henüz açık pozisyon yok mu? Yine de tanışmak isteriz — genel başvuru yapın"
              width={1920}
              height={1080}
              className="h-auto w-full"
              sizes="100vw"
            />
            <Link
              href="#basvuru"
              aria-label="Genel başvuru yap — başvuru formuna git"
              className="absolute left-[44%] top-[67%] h-[6%] w-[14%] rounded-full transition-colors duration-500 hover:bg-white/10"
            />
          </div>
        </Reveal>
      </section>
      <RefLogoBand />
    </>
  );
}
