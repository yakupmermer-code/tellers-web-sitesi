import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import {
  grafik,
  sayfaSemasi,
  kirintiSemasi,
  hizmetListesiSemasi,
  paylasim,
} from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import YakinAcilis from "@/components/YakinAcilis";
import { Stagger, StaggerItem } from "@/components/Stagger";
import KapanisSection from "@/components/KapanisSection";
import BlogSlider from "@/components/BlogSlider";
import { SERVICES } from "@/content/services";

const ACIKLAMA =
  "Performans pazarlama, dijital pazarlama, markalama ve kreatif tasarım hizmetleri. Reklam bütçenizi ölçülebilir büyümeye çeviren ajans hizmeti.";

export const metadata: Metadata = {
  title: "Performans Pazarlama, Dijital Pazarlama, Markalama",
  description: ACIKLAMA,
  alternates: { canonical: "/hizmetlerimiz" },
  ...paylasim({
    baslik: "Hizmetlerimiz | tellers",
    aciklama: ACIKLAMA,
    gorsel: "/assets/og/hizmetlerimiz.jpg",
    yol: "/hizmetlerimiz",
  }),
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
      <JsonLd
        data={grafik(
          sayfaSemasi({
            tip: "CollectionPage",
            yol: "/hizmetlerimiz",
            ad: "Hizmetlerimiz",
            aciklama: ACIKLAMA,
          }),
          hizmetListesiSemasi(
            SERVICES.map((s) => ({ ad: s.titleTr, aciklama: s.summary })),
            "/hizmetlerimiz",
          ),
          kirintiSemasi([
            { ad: "Ana Sayfa", yol: "/" },
            { ad: "Hizmetlerimiz", yol: "/hizmetlerimiz" },
          ]),
        )}
      />
      <h1 className="sr-only">Hizmetlerimiz</h1>
      {/* ── ANA SLIDE — MASTER KALIBI (2026-09-11) ───────────────────────
          Yakup: "hizmetlerimiz kısmının header ve slider alanını da revize et."
          Hakkımızda ile AYNI SINIF (`hero-oranli`) ama aynı sonuç DEĞİL:
          hakkımızda ayrıca `hero-kirpma-sinirli` alıyor, bu sayfa almıyor.
          1440x900'de ikisi de %70; geniş ekranda ayrışıyorlar (1920x955'te
          hakkımızda %87, burası %70 — ölçüldü). Portfolyo ise bambaşka:
          `hero-tam-ekran` ile tam ekran.
          Kalıp:
            · `mt-24` kalktı → hero sayfanın EN ÜSTÜNDEN başlıyor, 70 piksellik
              bar SAYDAM olarak üstüne biniyor (ana sayfa açılışıyla aynı)
            · `h-auto` kalktı → yükseklik artık MEDYADAN BAĞIMSIZ; video
              çözülene kadar bölüm tarayıcının varsayılan video kutusu kadar
              kalıp sonra zıplamıyor, altındaki içerik yerinde duruyor
            · yükseklik master'ın About sayfasındaki ölçü: ekranın %70'i
            · giriş master'ın hareketi: scale 2 → 1 + soluk açılış

          ÖLÇÜ: `services/hero.mp4` 1280x720 (16:9), 252 KB.
          🔴 `hero-kirpma-sinirli` SINIFI BİLEREK YOK — bu sayfa SAF %70
          kullanıyor, yani master ölçüsüne birebir uyuyor. Sınıfın işi dikey
          kırpmayı sınırlamak; bu video ona ihtiyaç duymuyor.
          ÖLÇÜLDÜ (videodan kare çıkarılıp beyaz içeriğin dikey bandı
          bulunarak, 2026-09-11): "bilimsel yaratıcılık ve veri uzmanlığı."
          yazısı kadrajın yüksekliğinin %43-58 bandında duruyor — 2560x1080'de
          bile (%47 kırpma, her yandan %24) yazıya pay kalıyor.
          Karşılaştırma: hakkımızda hero'sunun yazı halkası kadrajın %94'üne
          kadar iniyor, orada %13'ten fazla kırpma halkayı kesiyor; o yüzden
          O sayfa sınıfı alıyor, bu sayfa almıyor.
          Dar/dikey ekranlarda (oran < 1,4) video kendi 16:9 oranında kalıyor —
          orada kırpma sıfır, yükseklik yine medyadan bağımsız. */}
      <section
        data-koyu-bolum
        data-imlec-koyu
        data-koyu-acilis
        className="hero-oranli relative aspect-video overflow-hidden bg-navy"
      >
        <YakinAcilis hemen olcek={2} className="h-full w-full">
          <video
            src="/assets/services/hero.mp4"
            poster="/assets/services/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="tellers hizmetleri"
            className="h-full w-full object-cover"
          />
        </YakinAcilis>
      </section>

      {/* ── 4 hizmet bloğu ── */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24">
        {/* ANİMASYON (2026-09-02): eskiden article'ın TAMAMI tek <Reveal>
            içindeydi; sağdaki madde listesi metinle birlikte tek blok olarak
            beliriyordu. Referansta bu tür listeler KADEMELİ girer. Artık sol
            metin kendi Reveal'ıyla, sağdaki maddeler sırayla geliyor.
            Reveal article'ı sarmıyor: iç içe iki whileInView'da dıştaki geç
            tetiklenip içteki staggeri görünmez hâlde bitirebilir. (Eski yorum
            bunu "amount .25" ile gerekçelendiriyordu; o mekanizma 2026-09-07'de
            margin tabanlıya geçti ama iç içe sarmama tercihi hâlâ doğru.) */}
        {SERVICES.map((s) => (
          <article
            key={s.slug}
            id={s.slug}
            className="grid gap-10 border-t hairline py-16 first:border-t-0 md:grid-cols-[1.4fr_1fr] md:gap-24 md:py-24"
          >
            <Reveal>
              <span className="text-[11px] uppercase tracking-[0.22em] text-navy/40">
                {s.eyebrow}
              </span>
              <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-navy md:text-[64px]">
                {s.titleTr}
              </h2>
              <p className="mt-2 text-lg font-bold text-navy">{s.tagline}</p>
              <p className="mt-4 text-lg leading-relaxed text-navy/80">
                {s.detail}
              </p>
            </Reveal>
            <Stagger as="ul" className="flex flex-col self-center">
              {s.items.map((item) => (
                <StaggerItem
                  as="li"
                  key={item}
                  className="border-b hairline py-4 text-base text-navy/80 md:text-lg"
                >
                  {item}
                </StaggerItem>
              ))}
            </Stagger>
          </article>
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
          <div className="absolute inset-y-0 right-5 hidden flex-col items-end justify-center gap-5 md:right-14 md:flex">
            {/* ÇİZGİSEL CTA — gerekçe app/page.tsx'teki aynı dönüşümde yazılı.
                Koyu görselin üstünde duruyorlar; `link-grow` çizgiyi
                `currentColor` ile çizdiği için beyaz kalıyor. */}
            <Link
              href="/portfolyo"
              className="link-grow link-grow-sag inline-block w-max font-medium text-[18px] text-white transition-opacity duration-500 hover:opacity-70 md:text-[24px]"
            >
              Portföyümüzü İnceleyin
            </Link>
            <Link
              href="/iletisim"
              className="link-grow link-grow-sag inline-block w-max font-medium text-[18px] text-white transition-opacity duration-500 hover:opacity-70 md:text-[24px]"
            >
              Bizimle İletişime Geçin
            </Link>
          </div>
        </div>
      </Reveal>

      {/* ── Nasıl Yaparız? + Operasyonel Taahhütler ── */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24">
        <Reveal mask>
          <h2 className="text-4xl font-bold leading-[1.02] tracking-tight text-navy md:text-[96px]">
            Nasıl Yaparız?
          </h2>
          <p className="mt-2 text-[12px] uppercase tracking-[0.2em] text-navy/60">
            Operasyonel Taahhütler
          </p>
          <p className="mt-8 max-w-4xl text-lg leading-relaxed text-navy/70 md:text-[22px]">
            Gürültünün içinde{" "}
            <em className="font-didot italic text-navy">netlik üretir</em>;
            netliği stratejiye, stratejiyi deneyime, deneyimi{" "}
            <em className="font-didot italic text-navy">
              ölçülebilir büyümeye
            </em>{" "}
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
                  <h3 className="text-xl font-bold tracking-tight text-navy md:text-[28px]">
                    {item.t}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-navy/60">
                    {item.d}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Blog 4'lü slider, başlıksız (ekip notu 2026-08-14) ── */}
      <section className="pb-20 md:pb-24">
        <Reveal>
          <BlogSlider />
        </Reveal>
      </section>

      {/* ── Kapanış + referans logolar ── */}
      <KapanisSection />
    </>
  );
}
