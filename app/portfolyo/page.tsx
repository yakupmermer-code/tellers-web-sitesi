import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import {
  grafik,
  sayfaSemasi,
  kirintiSemasi,
  listeSemasi,
  paylasim,
} from "@/lib/seo";
import Reveal from "@/components/Reveal";
import PortfolyoKart from "@/components/PortfolyoKart";
import KapanisSection from "@/components/KapanisSection";
import { BRANDS } from "@/content/brands";

const ACIKLAMA =
  "Mastercard, Bardahl, BNI, bfit ve 13 marka için yaptığımız markalama, performans pazarlama, dijital pazarlama ve kreatif tasarım işleri.";

export const metadata: Metadata = {
  title: "Portfolyo — Mastercard, Bardahl, BNI ve 14 Marka",
  description: ACIKLAMA,
  alternates: { canonical: "/portfolyo" },
  ...paylasim({
    baslik: "Portfolyo | tellers",
    aciklama: ACIKLAMA,
    gorsel: "/assets/og/portfolyo.jpg",
    yol: "/portfolyo",
  }),
};

export default function PortfolyoPage() {
  return (
    <>
      <JsonLd
        data={grafik(
          sayfaSemasi({
            tip: "CollectionPage",
            yol: "/portfolyo",
            ad: "Portfolyo",
            aciklama: ACIKLAMA,
          }),
          listeSemasi({
            yol: "/portfolyo",
            ad: "tellers portfolyosu",
            ogeler: BRANDS.map((b) => ({
              ad: b.name,
              yol: `/portfolyo/${b.slug}`,
            })),
          }),
          kirintiSemasi([
            { ad: "Ana Sayfa", yol: "/" },
            { ad: "Portfolyo", yol: "/portfolyo" },
          ]),
        )}
      />
      {/* ── HERO — ANA SAYFA KALIBI (2026-09-11) ─────────────────────────
          Yakup üç şey bildirdi ve üçü de AYNI KÖKTEN geliyordu:
            (a) "portfolyo sayfasının açılışındaki header alanı, ana sayfadaki
                açılış anındaki header ile aynı olsun"
            (b) "videosu olanlar geç açılıyor, alttaki yazılar bir anlık da
                olsa gözüküyor"
            (c) "video, üst header alanı dahil edildiğinde ekrana tam otursun;
                videonun bir kısmı aşağıda kalıyor"

          ESKİ HÂL: `mt-24` (header payı) + video `h-auto`.
            · `mt-24` videoyu barın ALTINDAN başlatıyordu → (c)
            · bar hero'yu kapatmadığı için `data-koyu-bolum` yoktu; Header ince
              beyaz örtüye geçip yazılarını lacivert basıyordu → (a)
            · `h-auto` yüksekliği VİDEODAN alıyordu: video çözülene kadar
              bölüm tarayıcının varsayılan video kutusu kadardı (300x150),
              altındaki içerik yukarı çıkıp video gelince aşağı itiliyordu → (b)

          YENİ HÂL ana sayfa hero'sunun birebir kalıbı: tam ekran yükseklik,
          lacivert zemin, `object-cover`. Yükseklik artık videodan bağımsız
          olduğu için yüklenme sırasında hiçbir şey kaymıyor; video gelene
          kadar lacivert zemin duruyor.
          `data-koyu-bolum` → bar saydam kalıp yazılarını beyaz basar.
          `data-imlec-koyu` → özel imleç koyu görselde kaybolmasın. */}
      <section
        data-koyu-bolum
        data-imlec-koyu
        /* Sayfanın EN ÜSTÜNDEKİ koyu hero — üst bar daha ilk boyamada
           (JS ölçümü gelmeden) saydam açılsın diye. Bkz. `app/globals.css`
           → "ÜST BAR AÇILIŞ RENGİ". */
        data-koyu-acilis
        /* 🔴 TELEFONDA TAM EKRAN DEĞİL, 16/9 (denetimde ölçülerek yakalandı,
           2026-09-11). `h-[100dvh]` + `object-cover`, kutunun oranını EKRANIN
           oranına bağlıyor: telefon dikey (390x844 = 0,46), hero videoları
           yatay (16/9 = 1,78). Sonuç kadrajın eninin %74'ünün kesilmesiydi —
           "PORTFOLYO" yazısı telefonda "RTFO" olarak görünüyordu.
           `object-position` bunu ÇÖZMEZ; sorun hizalama değil kutunun oranı.
           Yakup'un isteği ("video ekrana tam otursun") masaüstü gözlemiydi,
           orada `.hero-tam-ekran` ile birebir karşılanıyor.
           🔴 KIRILIM GENİŞLİK DEĞİL ORAN (denetimde yakalandı, 2026-09-11):
           önce `md:h-[100dvh]` yazılmıştı; iPad Pro 12.9" DİKEY (1024x1366,
           oran 0,75) genişlik eşiğini geçip tam ekran oluyor ve videonun
           ENİNİN %58'i kesiliyordu. Kural artık `app/globals.css` içinde
           `min-aspect-ratio: 7/5` ile yazılı. Telefonda kadraj
           bütün kalıyor ve yükseklik yine MEDYADAN BAĞIMSIZ (56,25vw), yani
           yüklenirken kayma da olmuyor. */
        className="hero-tam-ekran relative aspect-video overflow-hidden bg-navy"
      >
        {/* 🔴 HERO VİDEOSU `MediaReveal` İLE SARILMAZ (2026-09-10, Yakup:
          "üst kısmında video olan sayfalarda video 1-2 saniye gecikmeli
          geliyor, sebebini kontrol et").
          Sebep iki animasyonun üst üste binmesiydi:
            · `app/template.tsx` sayfa geçişi — opacity 0→1, 0,5 sn
            · `MediaReveal sabit` — opacity 0→1, 0,9 sn, üstelik `whileInView`
              tetikli (görünürlük gözlemcisi ateşleyene kadar hiç başlamıyor)
          Bu sürede video alanı BOŞ; poster bile görünmüyor, çünkü o da
          opacity 0'ın arkasında. Video dosyası küçük (bu sayfada 1 MB'ın
          altında), yani sorun indirme değildi.
          Hero zaten sayfanın ilk ekranında: "görünür alana girince göster"
          beklemenin anlamı yok. Giriş yumuşaklığını `template.tsx` zaten
          veriyor. `preload` da `metadata`dan `auto`ya alındı — ilk ekrandaki
          videonun verisi sayfa açılır açılmaz inmeye başlasın. */}
        <video
          src="/assets/portfolio/hero.mp4"
          poster="/assets/portfolio/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="tellers portfolyo"
          className="h-full w-full object-cover"
        />
      </section>

      {/* ── Tasarım felsefesi (temanın orijinal yerleşimi) ── */}
      <section className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 md:grid-cols-2 md:gap-20 md:px-10 md:py-24">
        <Reveal mask>
          <h1 className="text-3xl font-bold leading-[1.12] tracking-tight text-navy md:text-[64px]">
            Tasarım, tellers için estetik değil,{" "}
            <em className="font-didot font-normal italic">anlamın mekansal</em>{" "}
            organizasyonudur.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-col gap-6 text-lg leading-relaxed text-navy/75">
            <p>
              Bir form, bir renk, bir tipografi seçimi bile, insanın algılama
              biçimini değiştirir. Biz tasarımı bir &ldquo;son dokunuş&rdquo;
              değil,{" "}
              <strong className="text-navy">anlamın görsel mantığı</strong>{" "}
              olarak inşa ederiz.
            </p>
            <p>
              Her görsel karar, bir düşüncenin fiziksel karşılığıdır. Bu yüzden
              tellers&apos;ın her projesi, bilgiden duyguya, kavramdan forma
              uzanan anlamın yolculuğu gibidir.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── MARKA KARTLARI — MASTER /work DÜZENİ ────────────────────────
          Revize dökümanı: "Alt kısımda kullandığımız ok ve marka isimleri
          iptal edilecek. Bu alanda örnek temadaki gibi TASARIM ÜSTÜ metinleri
          ve yerleşimini tıpkı uygulayacağız. Banner alanları bu kadar açık
          olmayacak, yine temadaki alan kullanımını yapmalıyız."

          MASTER ÖLÇÜMÜ (arpeggio.framer.website/work, 1440px, canlı
          2026-09-11) — 7 kart, HEPSİ TEK SÜTUN, kart 1360x622 (oran 2,185),
          x=40. Kartın sol-üst köşesine göre metinler:
            açıklama → sol 32 · üst 60  · 35px/500 · GİZLİ (üzerine gelince)
            sektör   → sol 56 · üst 439 · 19px/500
            tarih    → SAĞDA    · üst 440 · 17px/400
            isim     → sol 56 · üst 478 · 48px/500
            hizmet   → sol 56 · üst 535 · 21px/500
          Üzerine gelince siyah bir örtü beliriyor (boşta opacity 0).

          ÖNCEKİ HÂLİMİZ: 2 sütunlu 4/3 ızgara; görselde yalnız marka adı,
          hizmet ve yıl KARTIN ALTINDA çizgiyle ayrılmış bir satırdaydı — tam
          da dökümanın "iptal edilecek" dediği yerleşim.

          DÖRT SATIR DÖKÜMANIN MARKA LİSTESİYLE BİREBİR: orada 17 markanın
          hepsi "isim / SEKTÖR / hizmet / yıl" dörtlüsüyle verilmiş. `sektor`
          alanı bu yüzden `content/brands.ts`e eklendi. */}
      <section className="mx-auto max-w-[1440px] px-5 pb-20 md:px-10 md:pb-24">
        {/* Her kart KENDİ gözlemcisini taşır (index gecikmeli Reveal).
            TARİHÇE: 2026-08-31'de burada Stagger kullanılamıyordu — o zaman
            bileşenler `viewport.amount` kullanıyordu ve 5488px'lik bu ızgara
            iPhone'da (812px) eşiği asla sağlayamıyor, 17 kart birden görünmez
            kalıyordu. 2026-09-07'de bileşenler margin tabanlı tetiklemeye
            geçti, kilitlenme riski kalktı. Yine de UZUN ızgaralarda kart başına
            Reveal doğru desen: tek Stagger olsaydı alttaki kartlar, kullanıcı
            oraya varmadan görünmeden animasyonlarını bitirirdi. */}
        {/* İLK ÜÇÜ YATAY, KALANI 2'Lİ KARE (2026-09-11, Yakup: "work
            kısmında ilk 3 kısım yatay, sonrası 2'li kare şekilde aşağı
            ilerliyor").
            MASTER ÖLÇÜMÜ: ilk dört kart 1360x622 ve ARALARINDA BOŞLUK YOK
            (y = 70, 692, 1315, 1937 — tam 622'şer); sonraki üçü 674x622,
            iki sütun, 12px ara (x = 40 ve 726, y = 3030 ve 3664).
            Bizde yatay sayısı ÜÇ: Yakup'un tarifi bu. */}
        <div className="flex flex-col">
          {BRANDS.slice(0, 3).map((b) => (
            <Reveal key={b.slug}>
              <PortfolyoKart marka={b} genis />
            </Reveal>
          ))}
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {BRANDS.slice(3).map((b, i) => (
            <Reveal key={b.slug} delay={0.05 * (i % 2)}>
              <PortfolyoKart marka={b} />
            </Reveal>
          ))}
        </div>
      </section>

      <KapanisSection />
    </>
  );
}
