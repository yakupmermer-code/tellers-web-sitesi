import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { grafik, sayfaSemasi, kirintiSemasi, paylasim } from "@/lib/seo";
import Reveal from "@/components/Reveal";
import { Stagger, StaggerItem } from "@/components/Stagger";
import ClosingCta from "@/components/ClosingCta";
import MediaReveal from "@/components/MediaReveal";
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
        <MediaReveal sabit>
          <video
            src="/assets/contact/hero.mp4"
            poster="/assets/contact/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="tellers ile iletişime geçin"
            className="h-auto w-full"
          />
        </MediaReveal>
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
              NOT: Stagger yalnızca EKRANA SIĞAN kaplarda kullanılabilir —
              viewport.amount elemanın KENDİ alanının yüzdesi, ekrandan uzun bir
              kap hiç tetiklenmez (bkz. app/portfolyo/page.tsx'teki uyarı). */}
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

      {/* ── Sayfa bitiş imajı + lacivert referans logo bandı ── */}
      <ClosingCta />
    </>
  );
}
