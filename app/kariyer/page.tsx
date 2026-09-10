import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { grafik, sayfaSemasi, kirintiSemasi, paylasim } from "@/lib/seo";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { Stagger, StaggerItem } from "@/components/Stagger";
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
        {/* 🔴 HERO GÖRSELİ `MediaReveal` İLE SARILMAZ — video hero'larıyla aynı
          gecikme (2026-09-10). Burada çelişki daha da netti: görselde `priority`
          var, yani Next onu ÖNCELİKLİ indiriyor, ama `MediaReveal`ın opacity
          animasyonu onu 0,9 sn boyunca gizli tutuyordu. Erken indirip geç
          göstermenin anlamı yok. */}
        <Image
          src="/assets/career/hero.png"
          alt="tellers ekibine katılın"
          width={3000}
          height={722}
          priority
          className="h-auto w-full"
          sizes="100vw"
        />
      </section>

      {/* ── Giriş metni ── */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24">
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
        {/* tabIndex + outline-none: odağı buraya components/SmoothScroll.tsx'teki
            global dinleyici taşıyor; odaklanabilir olmayan bir <section> `focus()`
            çağrısını sessizce yok sayar. `outline-none`, app/layout.tsx'teki
            <main id="icerik" tabIndex={-1} … outline-none> ile aynı desen: bu bir
            kapsayıcı, Tab ile ulaşılan bir denetim değil — 900px'lik bloğun
            etrafına tarayıcı çerçevesi çizilmesin. */}
        <section
          id="basvuru"
          tabIndex={-1}
          className="mx-auto max-w-[900px] px-5 py-20 outline-none md:px-10 md:py-24"
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
      <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <Reveal mask>
              <h2 className="text-3xl font-bold leading-[1.12] tracking-tight text-navy md:text-[64px]">
                Aradığımız ekip arkadaşı nasıl biri?
              </h2>
            </Reveal>
            {/* KADEMELİ (2026-09-02): dört sıfat tek satırda birden beliriyordu;
                artık teker teker geliyor — cümlenin ritmi ekranda da duyuluyor. */}
            <Stagger
              className="mt-1.5 flex flex-wrap gap-x-2 gap-y-1 text-lg text-navy/50 md:text-[22px]"
              gap={0.1}
            >
              {[
                "Merak eden.",
                "Üreten.",
                "Sorgulayan.",
                "Gelişmek isteyen.",
              ].map((kelime) => (
                <StaggerItem key={kelime}>{kelime}</StaggerItem>
              ))}
            </Stagger>
          </div>
          <Stagger className="flex flex-col justify-center gap-6">
            <StaggerItem>
              <p className="text-lg leading-relaxed text-navy/75 md:text-[22px]">
                Her şeyi bilen insanları değil,{" "}
                <em className="font-didot italic">öğrenmeye açık</em> insanları
                arıyoruz.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p className="text-lg leading-relaxed text-navy/75 md:text-[22px]">
                Bir fikri savunabilen ama gerektiğinde fikrini değiştirebilen,
                detaylara önem veren ama bütünü görebilen, yaptığı işin sonucunu
                merak eden insanlarla çalışmak istiyoruz.
              </p>
            </StaggerItem>
          </Stagger>
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
            {/* <Link>, düz <a> DEĞİL — gerekçesi components/SmoothScroll.tsx'te
                ("ÇAPA LİNKLERİ <Link> KALMALI"). Kaydırmayı ve odağı oradaki
                global dinleyici yapıyor; yukarıdaki tabIndex={-1} onun için. */}
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
