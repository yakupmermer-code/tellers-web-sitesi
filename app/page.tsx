import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import RefLogoBand from "@/components/RefLogoBand";
import ClosingCta from "@/components/ClosingCta";
import BlogSlider from "@/components/BlogSlider";
import HeroVideo from "@/components/HeroVideo";
import HeroZoom from "@/components/HeroZoom";
import MaskLines from "@/components/MaskLines";
import { Stagger, StaggerItem } from "@/components/Stagger";
import CountUp from "@/components/CountUp";
import MediaReveal from "@/components/MediaReveal";
import { SERVICES } from "@/content/services";
import { SITE } from "@/content/site";
import JsonLd from "@/components/JsonLd";
import { grafik, sayfaSemasi, paylasim } from "@/lib/seo";
import type { Metadata } from "next";

const ANA_ACIKLAMA =
  "Mastercard, Bardahl, Konica Minolta ve Fairmont'un tercih ettiği ajans. 3 kıta, 15 ülkede performans pazarlama, dijital pazarlama, markalama ve kreatif tasarım.";

export const metadata: Metadata = {
  // Başlık aranan kelimeyle başlar, marka adı sonda. Önceki hâli
  // "tellers | Creative Communications"tı — yani sayfayı yalnızca ADIMIZI
  // BİLEN biri bulabiliyordu.
  // DİKKAT: layout'taki "%s | tellers" şablonu ana sayfaya UYGULANMAZ
  // (Next kuralı: şablon, kendi segmentindeki sayfayı kapsamaz), bu yüzden
  // marka adı burada ELLE yazılıyor.
  title: "Reklam ve Marka İletişimi Ajansı | tellers",
  description: ANA_ACIKLAMA,
  // Kendi kendini isaret eden canonical: gecici Railway adresi + ileride
  // baglanacak alan adi arasinda cift icerik olusmasini engeller.
  alternates: { canonical: "/" },
  ...paylasim({
    baslik: "tellers — Reklam ve Marka İletişimi Ajansı",
    aciklama: ANA_ACIKLAMA,
    yol: "/",
    gorselAlt: SITE.slogan,
  }),
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={grafik(
          sayfaSemasi({
            yol: "/",
            ad: "tellers — Reklam ve Marka İletişimi Ajansı",
            aciklama: ANA_ACIKLAMA,
            gorsel: "/assets/home/imaj-bolucu.png",
          }),
        )}
      />
      {/* ── HERO: tam ölçek slider — marka tanıtım videosu ── */}
      <section className="relative flex min-h-[100dvh] items-end overflow-hidden bg-navy">
        {/* Açılışta 1.28 ölçekten oturur — referans temanın HeroZoom'u. */}
        <HeroZoom className="absolute inset-0">
          <HeroVideo inline className="h-full w-full object-cover opacity-80" />
        </HeroZoom>
        {/* Ana sayfanın <h1>'i. Hero tasarımı bilinçli olarak metinsiz (ekip
            kararı, 2026-08-14) — bu yüzden başlık görsel olarak gizlenir ama
            ekran okuyucular ve arama motorları için sayfada durur. İçerik
            sayfayı DOĞRU tarif ediyor; gizli anahtar kelime doldurma değil.
            NOT: görünür bir h1 daha güçlüdür — ekip hero'ya başlık koymaya
            karar verirse bu sr-only kaldırılıp o başlık h1 yapılmalı. */}
        <h1 className="sr-only">
          tellers — reklam ve marka iletişimi ajansı: performans pazarlama,
          dijital pazarlama, markalama ve kreatif tasarım
        </h1>
        {/* Slogan okunurluğu için alt bölgeye yumuşak lacivert degrade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-navy/80 via-navy/25 to-transparent"
        />
        {/* Ekip notu (2026-08-14): video üzerindeki slogan kaldırıldı — slogan
            footer'da marka kimliğini koruyor, hero sade bir atmosfer videosu */}
        <div className="relative z-10 mx-auto flex w-full justify-end px-5 pb-16 md:px-10 md:pb-20">
          <Stagger
            as="ul"
            className="flex flex-col gap-2 text-right text-[13px] uppercase tracking-[0.14em] text-white/70 md:text-sm"
          >
            {[
              "Performans Pazarlama",
              "Dijital Pazarlama",
              "Kreatif Tasarım Hizmetleri",
              "Markalama",
            ].map((h) => (
              <StaggerItem as="li" key={h}>
                {h}
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── SLOGAN + HAKKIMIZDA ÖZETİ ──
          Referans temanın omurgası: bu bölüm ekranın üstüne ÇAKILIR, sonraki
          tüm içerik (z-10 + opak zemin) onun ÜZERİNE kayar. Referansta yapı
          birebir şöyle:  hero(relative) → section(sticky top-0 bg-white) →
          section(relative z-10 bg-white)…
          KORUMA: sticky yalnızca ekran hem GENİŞ hem YÜKSEK ise açılır.
          `md:` tek başına yetmiyordu — kırpma riski genişliğe değil YÜKSEKLİĞE
          bağlı: bölümün altı ekrandan taşarsa o kısma kaydırarak bile
          ulaşılamaz ve ana sayfanın tek CTA'sı ("Hakkımızda" butonu) kalıcı
          olarak kesiliyordu (code-reviewer hesabı: 768-1300px genişlik +
          660px'ten kısa ekranlarda). Footer'da da aynı tuzağa düşülmüştü
          (2026-08-15 notu). 820px eşiği, bölümün en uzun hâli (~843px)
          hesaba katılarak seçildi. */}
      <section className="mx-auto grid max-w-[1440px] gap-16 bg-paper px-5 py-28 md:grid-cols-2 [@media(min-width:768px)and(min-height:820px)]:sticky [@media(min-width:768px)and(min-height:820px)]:top-0 md:gap-20 md:px-10 md:py-40">
        {/* DÜZELTME (2026-08-31): burası önce h1 yapılmıştı, ama Hakkımızda
            sayfasının h1'i de birebir aynı cümle — iki sayfa aynı başlıkla
            yarışıyordu. h2'ye geri alındı; ana sayfanın kendi h1'i hero
            bölümünde (görsel tasarıma dokunmadan) veriliyor.
            Satırlar açıkça belli olduğu için referansın SATIR SATIR maskesi
            (MaskLines) kullanılıyor — temanın imza efekti bu. */}
        {/* DİKKAT: bu section 2 SÜTUNLU grid. Başlık ve altındaki satır TEK
            hücrede kalmak zorunda — ayrı çocuk yapılırsa sütunlar kayar ve
            sağdaki metin bloğu alt satıra düşer (2026-08-31'de bu hata
            yapıldı, Yakup bildirdi: "ana omurgayı bozdun"). */}
        <div>
          <MaskLines
            as="h2"
            className="text-4xl font-bold leading-[1.05] tracking-tight text-navy md:text-[96px]"
            label="Global devlerin tercihi, tellers."
            lines={["Global devlerin", "tercihi, tellers."]}
          />
          <Reveal delay={0.2}>
            <p className="mt-1.5 text-lg text-navy md:text-[22px]">
              Mastercard, Konica Minolta, Bardahl ve Fairmont Hotels.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="flex flex-col justify-center">
          <p className="text-lg leading-relaxed text-navy md:text-[22px]">
            7 yılda, 3 kıta ve 15 ülkede; sağlık, otomotiv, spor ve kozmetik
            sektörlerindeki ortaklarımızla onlarca iletişim stratejisi ve
            kampanyaya imza attık.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-navy md:text-[22px]">
            Bugün ise, Birleşik Krallık, Avrupa ve Ortadoğu pazarlarındaki
            markalarımızla faaliyetlerimizi devam ettiriyoruz.
          </p>
          {/* Ekip notu: köşeleri oval, kurumsal lacivert dikdörtgen buton, beyaz metin */}
          <Link
            href="/hakkimizda"
            className="group mt-10 flex w-max items-center gap-4 rounded-full bg-navy px-7 py-[15px] text-xl font-bold text-white transition-transform duration-500 ease-[var(--ease-lux)] active:scale-[0.98]"
          >
            Hakkımızda
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 ease-[var(--ease-lux)] group-hover:-translate-y-px group-hover:translate-x-1">
              ↗
            </span>
          </Link>
        </Reveal>
      </section>

      {/* Buradan aşağısı, yukarıdaki sabitlenen bölümün ÜZERİNE kayar.
          z-10 + opak zemin şart: saydam olursa altındaki bölüm görünür. */}
      <div className="relative z-10 bg-paper">
        {/* ── REFERANS LOGO BANDI — lacivert, çift genişlik ── */}
        <RefLogoBand />

        {/* ── 22.872.000 $ + HİZMET LİSTESİ ── */}
        <section className="mx-auto grid max-w-[1440px] gap-16 px-5 py-28 md:grid-cols-[1fr_1.1fr] md:gap-24 md:px-10 md:py-40">
          <div className="md:sticky md:top-32 md:self-start">
            <Reveal mask>
              <h2 className="text-5xl font-bold leading-none tracking-tight text-navy md:text-[112px]">
                <CountUp value="22.872.000 $" />
              </h2>
              <p className="mt-1.5 text-lg text-navy md:text-[22px]">
                Bugüne kadar <em className="font-didot italic">yönettiğimiz</em>{" "}
                toplam reklam bütçesi.
              </p>
            </Reveal>
          </div>
          <div className="flex flex-col">
            {SERVICES.map((s, i) => (
              <Reveal key={s.slug} delay={0.05 * i}>
                {/* İlk madde, soldaki rakamın üst noktasıyla aynı hizada başlar */}
                <div className="border-t hairline py-10 first:border-t-0 first:pt-0 md:py-12 md:first:pt-0">
                  <div className="flex items-baseline gap-6">
                    <span className="font-didot text-lg text-navy/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-[26px] font-bold tracking-tight text-navy md:text-[33px]">
                        {s.titleTr}
                      </h3>
                      <p className="mt-3 max-w-xl leading-relaxed text-navy/60">
                        {s.homeBlurb}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── İMAJ BÖLÜCÜ — ekipten gelen gerçek video ── */}
        <MediaReveal>
          <video
            src="/assets/home/imaj-bolucu.mp4"
            poster="/assets/home/imaj-bolucu-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Markanız konuşuyor ama anlaşılmıyor mu?"
            className="aspect-[1920/654] w-full object-cover"
          />
        </MediaReveal>

        {/* ── SLOGAN + ANLAM FELSEFESİ ── */}
        <section className="mx-auto grid max-w-[1440px] gap-16 px-5 py-28 md:grid-cols-2 md:gap-24 md:px-10 md:py-40">
          <div className="md:sticky md:top-32 md:self-start">
            <MaskLines
              as="h2"
              className="text-4xl font-bold leading-[1.08] tracking-tight text-navy md:text-[96px]"
              label="Duyulan unutulur, anlaşılan kalır."
              lines={[
                "Duyulan unutulur,",
                <>
                  <em className="font-didot font-normal italic">anlaşılan</em>{" "}
                  kalır.
                </>,
              ]}
            />
          </div>
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-6 text-lg leading-relaxed text-navy/75">
              <p>
                tellers&apos;ın amacı, markaların yalnızca duyulmasını değil
                gerçekten anlaşılmasını sağlamaktır. Çünkü iletişim, bir ses
                değil; bir anlam ilişkisidir. Anlam ilişkisi kurabilen her
                kampanya ise sosyolojik bir iç görünün, psikolojik bir sezginin
                ve ölçülebilir verilerin kesişiminde şekillenir.
              </p>
              <p>
                Bu yaklaşım, tellers&apos;ı klasik ajans anlayışının ötesine
                taşır. Yaratıcılığı ölçülebilir, stratejiyi ise duygusal hale
                getirir. Veriyi sezgisel olarak okur, iletişimi sistematik
                olarak kurar, tasarımı bilimsel doğrulukla uygularız.
              </p>
              <p>
                Böylece ortaya çıkan her proje, sadece estetik bir ifade değil,
                ölçülebilir bir &ldquo;anlam&rdquo; sistemidir.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ── PORTFOLYO ÖNE ÇIKANLAR — alt alta, tam genişlik (ekip notu 2026-08-14) ── */}
        <section className="flex flex-col gap-6 px-5 pb-6 md:px-10">
          <Reveal>
            <Link
              href="/portfolyo/mastercard"
              className="group block overflow-hidden"
            >
              <Image
                src="/assets/brands/mastercard/slider.png"
                alt="MasterCard — Above The Line kampanyaları"
                width={1920}
                height={900}
                className="h-auto w-full transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.02]"
                sizes="100vw"
              />
              <p className="mt-4 text-sm uppercase tracking-[0.14em] text-navy">
                MasterCard
              </p>
            </Link>
          </Reveal>
          <Reveal delay={0.08}>
            <Link
              href="/portfolyo/bardahl"
              className="group block overflow-hidden"
            >
              <Image
                src="/assets/brands/bardahl/slide.png"
                alt="Bardahl — Türkiye marka konumlandırması"
                width={1920}
                height={900}
                className="h-auto w-full transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.02]"
                sizes="100vw"
              />
              <p className="mt-4 text-sm uppercase tracking-[0.14em] text-navy">
                Bardahl
              </p>
            </Link>
          </Reveal>
        </section>

        {/* ── 3'LÜ GRİD GÖRSEL ALANI (My Nova / Savron / Tyre Supply) ── */}
        <section className="grid gap-6 px-5 pb-28 md:grid-cols-3 md:px-10 md:pb-32">
          {[
            {
              src: "/assets/brands/mynova/banner.png",
              alt: "My Nova Dental Clinic",
              href: "/portfolyo/my-nova",
            },
            {
              src: "/assets/brands/savron/banner.png",
              alt: "Savron Smart Medya",
              href: "/portfolyo/savron-smart-media",
            },
            {
              src: "/assets/brands/tyresupply/banner.png",
              alt: "Tyre Supply",
              href: "/portfolyo/tyre-supply",
            },
          ].map((item, i) => (
            <Reveal key={item.href} delay={0.05 * i}>
              <Link href={item.href} className="group block overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={640}
                  height={640}
                  className="aspect-square w-full object-cover transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.04]"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              </Link>
            </Reveal>
          ))}
        </section>

        {/* ── YARIM SLIDE: SAYILAR BANDI ── */}
        <MediaReveal>
          <Image
            src="/assets/home/yarim-slide-4.png"
            alt="7 yıl deneyim, +32 global marka, 3 kıta, 15 ülke, aylık +2000 lead akışı"
            width={1920}
            height={700}
            className="h-auto w-full"
            sizes="100vw"
          />
        </MediaReveal>

        {/* ── TASARIM MANİFESTOSU (5.png) ── */}
        <section className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-40">
          <Reveal mask>
            <h2 className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-navy md:text-[96px]">
              Tasarım, tellers için estetik değil,{" "}
              <em className="font-didot font-normal italic">
                anlamın mekansal
              </em>{" "}
              organizasyonudur.
            </h2>
            <p className="mt-4 text-lg text-navy/50">
              Tasarım, anlamın görünür biçimi.
            </p>
          </Reveal>
        </section>

        {/* ── İLETİŞİM; ANLAMIN DOLAŞIMI + VİDEO ──
          Gri fon (ekip notu 2026-08-14): üstteki "Tasarım manifestosu" ve
          alttaki "Veri; anlamın kökeni" metin alanları arasına giren bu bölüm
          gri fonla ayrılır — üç metin bloğu birbirine yapışık okunmasın. */}
        <div className="bg-mist">
          <section className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-32">
            <Reveal mask>
              <h2 className="text-4xl font-bold leading-[1.08] tracking-tight text-navy md:text-[96px]">
                İletişim;{" "}
                <em className="font-didot font-normal italic">anlamın</em>
                <br />
                dolaşımı.
              </h2>
            </Reveal>
            {/* Ekip notu: bu alana marka videosu gelecek (çalışılıyor) — geçici atmosfer videosu */}
            <Reveal delay={0.1} className="mt-12">
              <HeroVideo
                className="aspect-video w-full rounded-none object-cover"
                inline
              />
            </Reveal>
            {/* İçerik dökümanı: "Bu [slogan] alanı 'İletişim; Anlamın Dolaşımı'
              alanının altına alacağız." (ana_safya_slogan_imaj.png)
              Gerçek marka videosu geldiğinde bu görselin yerini alacak. */}
            <Reveal delay={0.15} className="mt-6">
              <Image
                src="/assets/home/slogan-banner.png"
                alt="Duyulan unutulur, anlaşılan kalır — tellers, gerçek bir ajans deneyimi"
                width={1920}
                height={800}
                className="h-auto w-full"
                sizes="100vw"
              />
            </Reveal>
          </section>
        </div>

        {/* ── VERİ; ANLAMIN KÖKENİ ──
          pt: üstteki gri bandın kenarına yapışmasın. */}
        <section className="mx-auto max-w-[1440px] px-5 pb-28 pt-28 md:px-10 md:pb-40 md:pt-32">
          <Reveal mask>
            <h2 className="text-4xl font-bold leading-[1.08] tracking-tight text-navy md:text-[96px]">
              Veri; <em className="font-didot font-normal italic">anlamın</em>
              <br />
              kökeni.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex max-w-none flex-col gap-6 text-lg leading-relaxed text-navy/75 md:text-[22px]">
              <p>
                tellers, veriye yalnızca bir sayı dizisi olarak bakmaz. Veri,
                insan davranışının sessiz hikâyesidir. Rakamların ardındaki
                niyeti, duyguyu, kültürel kodu çözümleyerek bilgiyi içgörüye,
                içgörüyü anlama dönüştürür. Bu süreçte anlam, soyut bir fikir
                olmaktan çıkar ölçülebilir bir yapıya dönüşür.
              </p>
              <p>
                Çünkü bizim işimiz &ldquo;veriyi okumak&rdquo; değil, verinin
                neden var olduğunu anlamaktır.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ── HİZMETLER SLIDE'LARI — üst üste sabitlenen kart yığını ──
          Temanın (Arpeggio) imza efekti: her slide tam ekran yüksekliğinde ve
          `sticky top-0` ile ekrana çakılır; kaydırdıkça bir sonraki slide
          öncekinin ÜSTÜNE biner. Kapsayıcının yüksekliği kart sayısı × 100dvh
          olarak kendiliğinden oluşur — ekstra JS gerekmez.
          DİKKAT: sticky elemanlar Reveal ile SARILMAZ; Reveal transform
          uyguluyor, transform'lu bir ata sticky'yi viewport'a değil kendine
          göre sabitler ve efekt ölür. */}
        <section aria-label="Hizmetlerimiz" className="relative">
          {SERVICES.map((s) => (
            <div
              key={s.slug}
              className="sticky top-0 h-[100dvh] overflow-hidden"
            >
              <Link
                href="/hizmetlerimiz"
                className="group relative block h-full w-full overflow-hidden"
              >
                {s.slideVideo ? (
                  <video
                    src={s.slideVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={`${s.titleTr} — ${s.summary}`}
                    className="h-full w-full object-cover transition-transform duration-1000 ease-[var(--ease-lux)] group-hover:scale-[1.02]"
                  />
                ) : (
                  <Image
                    src={s.slide}
                    alt={`${s.titleTr} — ${s.summary}`}
                    width={1920}
                    height={900}
                    className="h-full w-full object-cover transition-transform duration-1000 ease-[var(--ease-lux)] group-hover:scale-[1.02]"
                    sizes="100vw"
                  />
                )}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-navy/70 via-navy/10 to-transparent p-6 md:p-14">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-white/70">
                    {s.eyebrow}
                  </span>
                  <h3 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-[96px]">
                    {s.titleTr}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
                    {s.summary}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </section>

        {/* ── BLOG — 4'lü slider, başlıksız (ekip notu 2026-08-14) ── */}
        <section className="py-28 md:py-40">
          <Reveal>
            <BlogSlider />
          </Reveal>
        </section>

        {/* ── SAYFA BİTİŞ İMAJI + referans logo bandı ──
          Ekip notu (2026-08-14): logo bandı ekip görselinin hemen altında da
          yer alacak (diğer tüm sayfalarla aynı kapanış deseni). */}
        <ClosingCta />
      </div>
    </>
  );
}
