import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import {
  grafik,
  sayfaSemasi,
  kirintiSemasi,
  blogDiziniSemasi,
  paylasim,
} from "@/lib/seo";
import Reveal from "@/components/Reveal";
import KapanisSection from "@/components/KapanisSection";
import BlogKart from "@/components/BlogKart";
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

export default function BlogPage() {
  /*
   * MASTER TEMA IZGARASI (arpeggio.framer.website/journal, 1440px'te canlı
   * ölçüldü):
   *   1. kart  1360x650 → oran 2,09  (TAM GENİŞLİK, en üstte)
   *   2-7.     668x650  → oran 1,03  (2 sütun x 3 satır, 24px ara)
   * Yani tam 7 kart — dökümanın "7'li grid sistemi" dediği bu.
   *
   * Bizim 8 yazımız var. Döküman: "linkteki 1. blog alanının (geniş olan en
   * üstteki) aynısından sayfanın sonuna da ekleyeceğiz."
   * → 1 geniş + 6 ızgara + 1 geniş = 8. Tam oturuyor.
   *
   * ⚠️ AÇIK KALEM: dökümanda bir cümle daha var — "Bunun aynısından, bu iki
   * alanın arasında bir tane daha ekleyeceğiz." Bu, ARADA üçüncü bir geniş
   * kart demek olurdu ve toplam 9 kart ederdi; elimizde 8 yazı var. Yakup'a
   * soruldu; 9. yazı gelince araya geniş kart eklenecek.
   */
  const [ilk, ...kalan] = BLOGS;
  const sonuncu = kalan.length > 0 ? kalan[kalan.length - 1] : undefined;
  const ortadakiler = kalan.slice(0, -1);

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

      {/* SAYFA BAŞLIĞI — master'da "Journal" 130px/800, ortada. Bizde hero
          GÖRSELİ vardı (blog/hero.png); döküman "blog sayfası yukarıdaki gibi
          olmayacak" diyordu. Görsel yerine canlı metin: arama motoru okuyor,
          ölçekleniyor, retina'da bulanıklaşmıyor. */}
      <section className="mx-auto max-w-[1440px] px-5 pb-12 pt-32 md:px-10 md:pb-16 md:pt-40">
        <Reveal mask>
          <h1 className="t-dev text-center text-navy">Blog</h1>
        </Reveal>
      </section>

      <section className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 pb-20 md:px-10 md:pb-24">
        {/* 1. kart — tam genişlik. Master ölçüsü 1360x700 (2026-09-11'de yeniden
            ölçüldü; yorumda 650 yazıyordu, yanlıştı). */}
        <Reveal>
          <BlogKart
            blog={ilk}
            buyuk
            className="aspect-[4/3] md:aspect-[1360/700]"
          />
        </Reveal>

        {/* 2-7 — 2 sütun. Master ölçüsü 668x700, x=40 ve x=732, 24px ara. */}
        <div className="grid gap-6 md:grid-cols-2">
          {ortadakiler.map((b, i) => (
            <Reveal key={b.slug} delay={0.05 * (i % 2)}>
              <BlogKart blog={b} className="aspect-[4/3] md:aspect-[668/700]" />
            </Reveal>
          ))}
        </div>

        {/* 8. kart — dökümanın istediği ikinci geniş kart */}
        {sonuncu && (
          <Reveal>
            <BlogKart
              blog={sonuncu}
              buyuk
              className="aspect-[4/3] md:aspect-[1360/700]"
            />
          </Reveal>
        )}
      </section>

      <KapanisSection />
    </>
  );
}
