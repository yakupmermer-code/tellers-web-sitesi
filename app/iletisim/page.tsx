import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { grafik, sayfaSemasi, kirintiSemasi, paylasim } from "@/lib/seo";
import Reveal from "@/components/Reveal";
import { Stagger, StaggerItem } from "@/components/Stagger";
import ClosingCta from "@/components/ClosingCta";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { SITE } from "@/content/site";

const ACIKLAMA =
  "Bir fikre, bir projeye ya da sadece bir merhabaya — tellers dinlemeye hazır. Ofisimize gelin, arayın ya da formu doldurun.";

export const metadata: Metadata = {
  title: "İletişim — Projenizi Konuşalım",
  description: ACIKLAMA,
  alternates: { canonical: "/iletisim" },
  ...paylasim({
    baslik: "İletişim | tellers",
    aciklama: ACIKLAMA,
    gorsel: "/assets/og/iletisim.jpg",
    yol: "/iletisim",
  }),
};

export default function IletisimPage() {
  return (
    <>
      <JsonLd
        data={grafik(
          sayfaSemasi({
            tip: "ContactPage",
            yol: "/iletisim",
            ad: "İletişim",
            aciklama: ACIKLAMA,
          }),
          kirintiSemasi([
            { ad: "Ana Sayfa", yol: "/" },
            { ad: "İletişim", yol: "/iletisim" },
          ]),
        )}
      />
      {/* ── Ana slide ── */}
      <section className="relative mt-24">
        {/* 🔴 HERO VİDEOSU `MediaReveal` İLE SARILMAZ (2026-09-10, Yakup:
          "üst kısmında video olan sayfalarda video 1-2 saniye gecikmeli
          geliyor, sebebini kontrol et").
          Sebep üç animasyonun üst üste binmesiydi:
            · `app/template.tsx` sayfa geçişi — 0,25 sn bekleme + 0,8 sn
            · `MediaReveal sabit` — opacity 0→1, 0,9 sn, üstelik `whileInView`
              tetikli (görünürlük gözlemcisi ateşleyene kadar hiç başlamıyor)
          Toplam ~1,9 sn ve bu sürede video alanı BOŞ; poster bile görünmüyor,
          çünkü o da opacity 0'ın arkasında. Video dosyaları küçük (252-572 KB),
          yani sorun indirme değildi.
          Hero zaten sayfanın ilk ekranında: "görünür alana girince göster"
          beklemenin anlamı yok. Giriş yumuşaklığını `template.tsx` zaten
          veriyor. `preload` da `metadata`dan `auto`ya alındı — ilk ekrandaki
          videonun verisi sayfa açılır açılmaz inmeye başlasın. */}
        <video
          src="/assets/contact/hero.mp4"
          poster="/assets/contact/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="tellers ile iletişime geçin"
          className="h-auto w-full"
        />
      </section>

      {/* ── Başlık ── */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24">
        <Reveal mask>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-navy md:text-[96px]">
            Bize ulaşın
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-navy/60 md:text-[22px]">
            Bir fikre, bir projeye ya da sadece bir merhaba — dinlemeye hazırız.
          </p>
        </Reveal>
      </section>

      {/* ── Form (belirgin, ara çizgili) ──
          Gri fon (ekip notu 2026-08-14): üstteki "Bize ulaşın" metin alanından
          ayrılsın — iki metin alanı üst üste beyaz kalmasın. */}
      <div className="bg-mist">
        <section className="mx-auto grid max-w-[1440px] gap-16 px-5 py-20 md:grid-cols-[1fr_1.4fr] md:gap-24 md:px-10 md:py-24">
          {/* ANİMASYON (2026-09-02): eskiden bu kolonun TAMAMI tek bir
              <Reveal> içindeydi — başlık, liste, kanallar, adres hepsi aynı anda
              beliriyordu. Referansta bu tür bloklar KADEMELİ girer. Artık
              başlık kendi, madde listesi ve kanal satırları sırayla geliyor.
              NOT: eski yorumda "Stagger yalnızca ekrana sığan kaplarda
              kullanılabilir" yazıyordu; o kısıt 2026-09-07'de kalktı
              (bileşenler margin tabanlı tetiklemeye geçti, bkz. motion.ts
              GORUNUR). Uzun ızgaralarda yine de öğe başına Reveal tercih edilir. */}
          <div>
            <Reveal mask>
              <h2 className="text-2xl font-bold tracking-tight text-navy md:text-[36px]">
                Birlikte çalışalım
              </h2>
            </Reveal>
            <Stagger
              as="ul"
              className="mt-8 flex flex-col gap-4 text-base leading-relaxed text-navy/65"
            >
              {[
                "Hızlı geri dönüş, şeffaf iletişim.",
                "Veriyle gerekçelendirilmiş kararlar.",
                "Uçtan uca proje yönetimi.",
                "Stratejiden uygulamaya tek ekip.",
              ].map((madde) => (
                <StaggerItem as="li" key={madde}>
                  {madde}
                </StaggerItem>
              ))}
            </Stagger>

            {/* Diğer kanallar — ekip notundaki düzeltilmiş metinlerle */}
            <Stagger className="mt-12 flex flex-col gap-4">
              {[
                {
                  ad: "Instagram'da İnceleyin",
                  href: SITE.instagram,
                  dis: true,
                },
                { ad: "E-Posta Gönderin", href: `mailto:${SITE.email}` },
                { ad: "Haritada Görün", href: SITE.mapsUrl, dis: true },
              ].map((k) => (
                <StaggerItem key={k.ad}>
                  <a
                    href={k.href}
                    target={k.dis ? "_blank" : undefined}
                    rel={k.dis ? "noopener noreferrer" : undefined}
                    className="arrow-link flex items-center justify-between border-b border-navy/15 pb-4 text-navy"
                  >
                    <span className="text-lg">{k.ad}</span>
                    <span aria-hidden="true" className="arrow">
                      →
                    </span>
                  </a>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.05}>
              <p className="mt-8 max-w-sm text-sm leading-relaxed text-navy/50">
                {SITE.address}
              </p>
              <a
                href={`tel:${SITE.phone}`}
                className="mt-2 block w-max text-sm font-bold text-navy"
              >
                {SITE.phoneDisplay}
              </a>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </section>
      </div>

      {/* ── "DAHA FAZLASINI GÖRÜN" — EKİP NOTU (11 Eylül dökümanı) ────────
          "Hemen bu doldurulan alanın alt kısmına, ekip görselinden ÖNCE
          örnekteki gibi (aşağıda iletiyorum)" + iki metin değişimi:
            "Best part of your" → "daha fazlasını görün"
            "View"              → "portfolyomuzu inceleyin"
          Dökümanın gömülü örneği master temanın iletişim sayfasından: solda
          SERİF bir cümle, ortada dikey ince çizgi, sağda altı çizili bağlantı.
          (Ekip "Best part of your" diye not almış; örnekteki asıl cümle "Be
          part of our journey" — yerine geçecek metni zaten kendileri verdi.)
          Master'da iki bağlantı var ("membership plans" + "view projects");
          bizde üyelik yok, o yüzden tek bağlantı. */}
      <section className="mx-auto max-w-[1440px] px-5 pb-16 md:px-10 md:pb-20">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-12">
            <p className="font-didot text-[28px] leading-tight text-navy md:text-[46px]">
              daha fazlasını görün
            </p>
            <span
              aria-hidden
              className="hidden h-[72px] w-px bg-navy/15 md:block"
            />
            <Link
              href="/portfolyo"
              className="link-grow w-max text-[20px] font-medium text-navy transition-opacity duration-500 hover:opacity-70 md:text-[30px]"
            >
              portfolyomuzu inceleyin
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── Sayfa bitiş imajı + lacivert referans logo bandı ── */}
      <ClosingCta />
    </>
  );
}
