import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import RefLogoBand from "@/components/RefLogoBand";
import ClosingCta from "@/components/ClosingCta";
import BlogSlider from "@/components/BlogSlider";
import HeroVideo from "@/components/HeroVideo";
import HeroTitle from "@/components/HeroTitle";
import CountUp from "@/components/CountUp";
import MediaReveal from "@/components/MediaReveal";
import { SERVICES } from "@/content/services";

export default function HomePage() {
  return (
    <>
      {/* ── HERO: tam ölçek slider — marka tanıtım videosu ── */}
      <section className="relative flex min-h-[100dvh] items-end overflow-hidden bg-navy">
        <HeroVideo />
        {/* Slogan okunurluğu için alt bölgeye yumuşak lacivert degrade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-navy/80 via-navy/25 to-transparent"
        />
        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col justify-between gap-10 px-5 pb-16 pt-40 md:flex-row md:items-end md:px-10 md:pb-20">
          <HeroTitle />
          <Reveal delay={0.15}>
            <ul className="flex flex-col gap-2 text-right text-[13px] uppercase tracking-[0.14em] text-white/70 md:text-sm">
              <li>Performans Pazarlama</li>
              <li>Dijital Pazarlama</li>
              <li>Kreatif Tasarım Hizmetleri</li>
              <li>Markalama</li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── SLOGAN + HAKKIMIZDA ÖZETİ ── */}
      <section className="mx-auto grid max-w-[1440px] gap-16 px-5 py-24 md:grid-cols-2 md:gap-20 md:px-10 md:py-40">
        <Reveal>
          <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-navy md:text-6xl">
            Global devlerin
            <br />
            tercihi, tellers.
          </h2>
          <p className="mt-4 text-lg text-navy/70 md:text-xl">
            Mastercard, Konica Minolta, Bardahl ve Fairmont Hotels.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col justify-center">
          <p className="text-lg leading-relaxed text-ink/75 md:text-xl">
            7 yılda, 3 kıta ve 15 ülkede; sağlık, otomotiv, spor ve kozmetik
            sektörlerindeki ortaklarımızla onlarca iletişim stratejisi ve
            kampanyaya imza attık.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-ink/75 md:text-xl">
            Bugün ise, Birleşik Krallık, Avrupa ve Ortadoğu pazarlarındaki
            markalarımızla faaliyetlerimizi devam ettiriyoruz.
          </p>
          {/* Ekip notu: köşeleri oval, kurumsal lacivert dikdörtgen buton, beyaz metin */}
          <Link
            href="/hakkimizda"
            className="group mt-10 flex w-max items-center gap-4 rounded-full bg-navy px-7 py-[15px] text-xl font-bold text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
          >
            Hakkımızda
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-px group-hover:translate-x-1">
              ↗
            </span>
          </Link>
        </Reveal>
      </section>

      {/* ── REFERANS LOGO BANDI — lacivert, çift genişlik ── */}
      <RefLogoBand />

      {/* ── 22.872.000 $ + HİZMET LİSTESİ ── */}
      <section className="mx-auto grid max-w-[1440px] gap-16 px-5 py-24 md:grid-cols-[1fr_1.1fr] md:gap-24 md:px-10 md:py-40">
        <Reveal>
          <div className="md:sticky md:top-32">
            <h2 className="text-5xl font-bold leading-none tracking-tight text-navy md:text-7xl">
              <CountUp value="22.872.000 $" />
            </h2>
            <p className="mt-4 text-lg text-navy/70 md:text-xl">
              Bugüne kadar{" "}
              <em className="font-didot italic">yönettiğimiz</em> toplam reklam
              bütçesi.
            </p>
          </div>
        </Reveal>
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
                    <p className="mt-3 max-w-xl leading-relaxed text-ink/60">
                      {s.homeBlurb}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── İMAJ BÖLÜCÜ (iki beyaz alan arka arkaya gelmesin) — yükseklik +%20 ── */}
      <MediaReveal parallax>
        <Image
          src="/assets/home/imaj-bolucu.png"
          alt="Markanız konuşuyor ama anlaşılmıyor mu? Bilgi bollaştı, anlam kıtlaştı."
          width={1920}
          height={545}
          className="aspect-[1920/654] w-full object-cover"
          sizes="100vw"
        />
      </MediaReveal>

      {/* ── SLOGAN + ANLAM FELSEFESİ ── */}
      <section className="mx-auto grid max-w-[1440px] gap-16 px-5 py-24 md:grid-cols-2 md:gap-24 md:px-10 md:py-40">
        <Reveal>
          <h2 className="md:sticky md:top-32 text-4xl font-bold leading-[1.08] tracking-tight text-navy md:text-6xl">
            Duyulan unutulur,
            <br />
            <em className="font-didot font-normal italic">anlaşılan</em> kalır.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-col gap-6 text-lg leading-relaxed text-ink/75">
            <p>
              tellers&apos;ın amacı, markaların yalnızca duyulmasını değil
              gerçekten anlaşılmasını sağlamaktır. Çünkü iletişim, bir ses
              değil; bir anlam ilişkisidir. Anlam ilişkisi kurabilen her kampanya
              ise sosyolojik bir iç görünün, psikolojik bir sezginin ve
              ölçülebilir verilerin kesişiminde şekillenir.
            </p>
            <p>
              Bu yaklaşım, tellers&apos;ı klasik ajans anlayışının ötesine
              taşır. Yaratıcılığı ölçülebilir, stratejiyi ise duygusal hale
              getirir. Veriyi sezgisel olarak okur, iletişimi sistematik olarak
              kurar, tasarımı bilimsel doğrulukla uygularız.
            </p>
            <p>
              Böylece ortaya çıkan her proje, sadece estetik bir ifade değil,
              ölçülebilir bir &ldquo;anlam&rdquo; sistemidir.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── PORTFOLYO ÖNE ÇIKANLAR — düzenli grid, tek hiza ── */}
      <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10 md:pb-32">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <Link href="/portfolyo/mastercard" className="group block overflow-hidden">
              <Image
                src="/assets/brands/mastercard/slider.png"
                alt="MasterCard — Above The Line kampanyaları"
                width={960}
                height={720}
                className="h-auto w-full transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              <p className="mt-4 text-sm uppercase tracking-[0.14em] text-navy/70">
                MasterCard
              </p>
            </Link>
          </Reveal>
          <Reveal delay={0.08}>
            <Link href="/portfolyo/bardahl" className="group block overflow-hidden">
              <Image
                src="/assets/brands/bardahl/slide.png"
                alt="Bardahl — Türkiye marka konumlandırması"
                width={960}
                height={720}
                className="h-auto w-full transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              <p className="mt-4 text-sm uppercase tracking-[0.14em] text-navy/70">
                Bardahl
              </p>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── YARIM SLIDE: SAYILAR BANDI ── */}
      <MediaReveal parallax>
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
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-40">
        <Reveal>
          <h2 className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-navy md:text-6xl">
            Tasarım, tellers için estetik değil,{" "}
            <em className="font-didot font-normal italic">anlamın mekansal</em>{" "}
            organizasyonudur.
          </h2>
          <p className="mt-4 text-lg text-ink/50">
            Tasarım, anlamın görünür biçimi.
          </p>
        </Reveal>
      </section>

      {/* ── İLETİŞİM; ANLAMIN DOLAŞIMI + VİDEO ── */}
      <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10 md:pb-32">
        <Reveal>
          <h2 className="text-4xl font-bold leading-[1.08] tracking-tight text-navy md:text-6xl">
            İletişim; <em className="font-didot font-normal italic">anlamın</em>
            <br />
            dolaşımı.
          </h2>
        </Reveal>
        {/* Ekip notu: bu alana marka videosu gelecek (çalışılıyor) — geçici atmosfer videosu */}
        <Reveal delay={0.1} className="mt-12">
          <HeroVideo className="aspect-video w-full rounded-none object-cover" inline />
        </Reveal>
      </section>

      {/* ── VERİ; ANLAMIN KÖKENİ ── */}
      <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10 md:pb-40">
        <Reveal>
          <h2 className="text-4xl font-bold leading-[1.08] tracking-tight text-navy md:text-6xl">
            Veri; <em className="font-didot font-normal italic">anlamın</em>
            <br />
            kökeni.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 flex max-w-none flex-col gap-6 text-lg leading-relaxed text-ink/75 md:text-xl">
            <p>
              Tellers, veriye yalnızca bir sayı dizisi olarak bakmaz. Veri,
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

      {/* ── HİZMETLER SLIDE'LARI ── */}
      <section aria-label="Hizmetlerimiz">
        {SERVICES.map((s) => (
          <Reveal key={s.slug}>
            <Link
              href="/hizmetlerimiz"
              className="group relative block overflow-hidden"
            >
              <Image
                src={s.slide}
                alt={`${s.titleTr} — ${s.summary}`}
                width={1920}
                height={900}
                className="h-auto w-full transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.02]"
                sizes="100vw"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-navy/70 via-navy/10 to-transparent p-6 md:p-14">
                <span className="text-[11px] uppercase tracking-[0.22em] text-white/70">
                  {s.eyebrow}
                </span>
                <h3 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-6xl">
                  {s.titleEn}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
                  {s.summary}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>

      {/* ── BLOG — 4'lü slider ── */}
      <section className="py-24 md:py-40">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <Reveal>
            <h2 className="text-4xl font-bold tracking-tight text-navy md:text-6xl">
              Blog
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="mt-12">
          <BlogSlider />
        </Reveal>
      </section>

      {/* ── SAYFA BİTİŞ İMAJI ── (referans bandı sayfanın üstünde zaten var) */}
      <ClosingCta withRefLogos={false} />
    </>
  );
}
