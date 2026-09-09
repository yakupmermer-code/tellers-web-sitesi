import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import PortfolyoOnizleme from "@/components/PortfolyoOnizleme";
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
import { gorselOlcu } from "@/lib/gorsel";
import type { Metadata } from "next";

/**
 * Portfolyo ön izleme kartlarının veri şekli.
 *
 * NEDEN AYRI BİR TİP: kartlar dizi literalinden `.map()` ile üretiliyor ve
 * `{...m}` ile yayılıyor. TypeScript "fazla alan" denetimini YALNIZCA doğrudan
 * yazılan nesnelerde yapar — `.map()`'ten gelen değişkende yapmaz. Yani
 * `logo` yerine `logoo` yazılsa ya da alakasız bir alan eklense derleme geçer,
 * lint geçer, sayfa açılır ve logo sessizce kaybolur. Dizinin sonundaki
 * `satisfies OnizlemeVerisi[]` bu sessiz bozulmayı derleme hatasına çevirir.
 * (Denetimde deneyle kanıtlandı, 2026-09-09.)
 *
 * `genislik`/`yukseklik` burada YOK — onlar `olcu()` ile dosyadan okunuyor.
 */
type OnizlemeVerisi = {
  slug: string;
  gorsel: string;
  marka: string;
  aciklama?: string;
  logo?: string;
  odak?: string;
  /**
   * ZORUNLU (isteğe bağlı değil): bileşenin varsayılanı `100vw` ve bu, çok
   * sütunlu bir ızgarada 3 KAT fazla veri indirtir. Eksik bırakılması ne
   * derleme hatası ne uyarı üretirdi — `satisfies` yalnız FAZLA alanı yakalar,
   * eksik İSTEĞE BAĞLI alanı yakalamaz (denetimde yakalandı). Zorunlu olunca
   * yeni bir kart eklerken atlanamıyor.
   */
  sizes: string;
};

/**
 * Görselin GERÇEK ölçüsünü dosyadan okur ve bileşenin beklediği ada çevirir.
 *
 * Elle yazılan ölçüler yanlış olabiliyor ve bu SESSİZ bir hata: MasterCard ve
 * Bardahl görselleri kodda 1920x900 yazılıydı, gerçekte 1920x1080. Tarayıcı
 * yanlış orana göre yer ayırıp görsel gelince düzeltince sayfa zıplıyordu
 * (1440px ekranda görsel başına ~135px). `lib/gorsel.ts` bunun için yazılmış;
 * portfolyo ve hakkımızda sayfaları zaten kullanıyordu, ana sayfa kullanmıyordu.
 */
const olcu = (src: string) => {
  const { width, height } = gorselOlcu(src);
  return { genislik: width, yukseklik: height };
};

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
      {/* data-koyu-bolum: bu bölüm üst barı TAMAMEN kapattığı sürece bar
          saydam kalır ve yazılar beyaz olur (referans görünümü). Bölüm barın
          altından çıkınca Header ince beyaz örtüye geçer. Ölçümü
          components/Header.tsx yapar. */}
      <section
        data-koyu-bolum
        className="relative flex min-h-[100dvh] items-end overflow-hidden bg-navy"
      >
        {/* Açılışta 1.28 ölçekten oturur — referans temanın HeroZoom'u. */}
        <HeroZoom className="absolute inset-0">
          <HeroVideo inline className="h-full w-full object-cover opacity-80" />
        </HeroZoom>
        {/* Karartma: video üzerindeki yazının okunurluğu için. Videodan
            bağımsız çalışır, video değişirse ayar gerekmez. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-navy/35"
        />
        {/* Slogan okunurluğu için alt bölgeye yumuşak lacivert degrade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-navy/80 via-navy/25 to-transparent"
        />
        {/* HERO MESAJI (2026-09-01, Yakup: "ilk açılışta bir dijital pazarlama
            markalama ajansı için farklı bir şeyler olmalı"). Ekip 2026-08-14'te
            hero'daki sloganı kaldırmıştı; bu karar Yakup'un isteğiyle geri
            alındı.

            ⚠️ METİN ONAY BEKLİYOR: bu cümle sitenin mevcut dilinden türetilmiş
            YENİ bir metindir, dökümanda birebir geçmiyor. İlk denemede
            "hizmetler sayfasının kendi hero cümlesi" diye gerekçelendirmiştim —
            YANLIŞTI: o tasarımı services/hero.png GÖRSELİNİN İÇİNDE gördüm ve
            sayfanın render'ı sandım; sayfada öyle bir metin yok. Ayrıca o cümle
            ana sayfada zaten bir kez geçiyor (aşağıda "anlam felsefesi"
            bölümünde). Ekip onaylamazsa değiştirilecek.

            YERLEŞİM: mesaj ve hizmet listesi TEK kapsayıcıda. İlk denemede iki
            ayrı kardeş div konmuştu; section flex olduğu için YAN YANA dizilip
            ekranı ikiye bölüyorlardı — telefonda başlık kelime kelime alt alta
            iniyordu (code-reviewer bulgusu). Mobilde alt alta, md'den itibaren
            yan yana ve alta hizalı.

            YAZI VİDEOYA GÖMÜLMEZ: yapay zeka Türkçe karakterleri (ğ ş ı İ)
            bozuyor. HTML olarak binince yazı kusursuz çıkar, tek satırla
            değiştirilebilir ve arama motoru okuyabilir. */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-5 pb-16 md:flex-row md:items-end md:justify-between md:gap-16 md:px-10 md:pb-20">
          <h1 className="max-w-2xl text-3xl font-bold leading-[1.08] tracking-tight text-white md:text-[64px]">
            Markaları duyulur değil,{" "}
            <em className="font-didot italic">anlaşılır</em> kılıyoruz.
          </h1>
          <Stagger
            as="ul"
            className="flex shrink-0 flex-col gap-2 text-[13px] uppercase tracking-[0.14em] text-white/70 md:text-right md:text-sm"
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
      <section className="mx-auto grid max-w-[1440px] gap-16 bg-paper px-5 py-20 md:grid-cols-2 ustte-sabit:sticky ustte-sabit:top-0 md:gap-20 md:px-10 md:py-24">
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
            className="t-dev text-navy"
            label="Global devlerin tercihi, tellers."
            lines={["Global devlerin", "tercihi, tellers."]}
          />
          <Reveal delay={0.2}>
            <p className="t-govde mt-1.5 text-navy">
              Mastercard, Konica Minolta, Bardahl ve Fairmont Hotels.
            </p>
          </Reveal>
        </div>
        {/* KADEMELİ (2026-09-02): iki paragraf ve buton tek blok olarak
            beliriyordu. Referansta bu tür sütunlar sırayla girer. */}
        <Stagger className="flex flex-col justify-center">
          <StaggerItem>
            <p className="text-lg leading-relaxed text-navy md:text-[22px]">
              7 yılda, 3 kıta ve 15 ülkede; sağlık, otomotiv, spor ve kozmetik
              sektörlerindeki ortaklarımızla onlarca iletişim stratejisi ve
              kampanyaya imza attık.
            </p>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-6 text-lg leading-relaxed text-navy md:text-[22px]">
              Bugün ise, Birleşik Krallık, Avrupa ve Ortadoğu pazarlarındaki
              markalarımızla faaliyetlerimizi devam ettiriyoruz.
            </p>
          </StaggerItem>
          {/* Ekip notu: köşeleri oval, kurumsal lacivert dikdörtgen buton, beyaz metin */}
          <StaggerItem>
            <Link
              href="/hakkimizda"
              className="group mt-10 flex w-max items-center gap-4 rounded-full bg-navy px-7 py-[15px] text-xl font-bold text-white transition-transform duration-500 ease-[var(--ease-lux)] active:scale-[0.98]"
            >
              Hakkımızda
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 ease-[var(--ease-lux)] group-hover:-translate-y-px group-hover:translate-x-1">
                ↗
              </span>
            </Link>
          </StaggerItem>
        </Stagger>
      </section>

      {/* Buradan aşağısı, yukarıdaki sabitlenen bölümün ÜZERİNE kayar.
          z-10 + opak zemin şart: saydam olursa altındaki bölüm görünür. */}
      <div className="relative z-10 bg-paper">
        {/* ── REFERANS LOGO BANDI — lacivert, çift genişlik ── */}
        <RefLogoBand />

        {/* ── 22.872.000 $ + HİZMET LİSTESİ ── */}
        <section className="mx-auto grid max-w-[1440px] gap-16 px-5 py-20 md:grid-cols-[1fr_1.1fr] md:gap-24 md:px-10 md:py-24">
          <div className="md:sticky md:top-32 md:self-start">
            <Reveal mask>
              <h2 className="t-buyuk text-navy">
                <CountUp value="22.872.000 $" />
              </h2>
              <p className="t-govde mt-1.5 text-navy">
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
                      <h3 className="t-alt text-navy">
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
        <MediaReveal sabit>
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
        <section className="mx-auto grid max-w-[1440px] gap-16 px-5 py-20 md:grid-cols-2 md:gap-24 md:px-10 md:py-24">
          <div className="md:sticky md:top-32 md:self-start">
            <MaskLines
              as="h2"
              className="t-dev text-navy"
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
          <Stagger className="flex flex-col gap-6 text-lg leading-relaxed text-navy/75">
            <StaggerItem>
              <p>
                tellers&apos;ın amacı, markaların yalnızca duyulmasını değil
                gerçekten anlaşılmasını sağlamaktır. Çünkü iletişim, bir ses
                değil; bir anlam ilişkisidir. Anlam ilişkisi kurabilen her
                kampanya ise sosyolojik bir iç görünün, psikolojik bir sezginin
                ve ölçülebilir verilerin kesişiminde şekillenir.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p>
                Bu yaklaşım, tellers&apos;ı klasik ajans anlayışının ötesine
                taşır. Yaratıcılığı ölçülebilir, stratejiyi ise duygusal hale
                getirir. Veriyi sezgisel olarak okur, iletişimi sistematik
                olarak kurar, tasarımı bilimsel doğrulukla uygularız.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p>
                Böylece ortaya çıkan her proje, sadece estetik bir ifade değil,
                ölçülebilir bir &ldquo;anlam&rdquo; sistemidir.
              </p>
            </StaggerItem>
          </Stagger>
        </section>

        {/* ── PORTFOLYO ÖN İZLEME — yatay ikili ──
            Revize dökümanı (2026-09-09): "Burada kullandığımız ikili yatay
            slider normalde temada bu şekilde kullanılmıyor. Biz de temadaki
            gibi sağdan ve soldan sıfıra sıfır ekleyeceğiz ve alt kısma tekrar
            marka isimlerini yazmayacağız."

            Değişenler: yanlardaki `px-5 md:px-10` KALDIRILDI (tam kenar),
            görsel altındaki marka adı paragrafları KALDIRILDI (marka adı artık
            üzerine gelince logo olarak ortada çıkıyor), aradaki 6px boşluk
            korundu. ── */}
        <section className="flex flex-col gap-6 pb-20 md:pb-24">
          {(
            [
              {
                slug: "mastercard",
                gorsel: "/assets/brands/mastercard/slider.png",
                marka: "MasterCard",
                aciklama: "Above The Line kampanyaları",
                logo: "mastercard",
                sizes: "100vw",
              },
              {
                slug: "bardahl",
                gorsel: "/assets/brands/bardahl/slide.png",
                marka: "Bardahl",
                aciklama: "Türkiye marka konumlandırması",
                logo: "bardahl",
                sizes: "100vw",
              },
            ] satisfies OnizlemeVerisi[]
          ).map((m, i) => (
            <Reveal key={m.slug} delay={0.08 * i}>
              <PortfolyoOnizleme {...m} {...olcu(m.gorsel)} />
            </Reveal>
          ))}
        </section>

        {/* ── YARIM SLIDE: SAYILAR BANDI ── */}
        <MediaReveal sabit>
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
        <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24">
          <Reveal mask>
            <h2 className="t-dev max-w-[1100px] text-navy">
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

        {/* ── 3'LÜ GRİD GÖRSEL ALANI (My Nova / Savron / Tyre Supply) ──
            YER DEĞİŞİKLİĞİ (2026-09-02, Yakup): eskiden portfolyo öne
            çıkanların hemen altındaydı; tasarım manifestosunun altına alındı.
            Metin bloğundan sonra üç kare görsel gelmesi sayfanın ritmini
            açıyor. Portfolyo bölümünün alt boşluğu da buna göre büyütüldü
            (gerekçe orada yazılı).

            ⚠️ AÇIK KALEM — İKİ FARKLI KART KALIBI: bu üçlü elle yazılmış
            `Link + Image` (üzerine gelince yalnız hafif büyüme), 40 satır
            aşağıdaki dikey üçlü ise `PortfolyoOnizleme` (lacivert karartma +
            logo). Teknik engel yok — bu üç markanın logoları da hazır
            (`mynova.png`, `savron.png`, `tyresupply.png`). Ayrı durmalarının
            sebebi dökümanın karartmayı YALNIZCA portfolyo ön izleme alanları
            için istemesi; bu ızgara "3'lü görsel alanı" olarak geçiyor.
            Yakup tek kalıba insin derse bu blok da bileşene geçirilir. ── */}
        <section className="grid gap-6 px-5 pb-20 md:grid-cols-3 md:px-10 md:pb-24">
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

        {/* ── İLETİŞİM; ANLAMIN DOLAŞIMI ──
          GERİ GELDİ (2026-09-09, en son revize dökümanı): "Yukarıdaki 3'lü
          portfolyo alanından sonra aşağıdaki tasarım gelecek: 'İletişim;
          Anlamın Dolaşımı' tasarımını ekleyeceğiz."

          ⚠️ 2026-09-02 KARARININ BİR KISMI GERİ ALINDI. Yakup o gün "3.
          görseldeki yazı ve altındaki videoyu kaldır" demişti; ikisi de
          kaldırılmıştı. Yeni döküman BAŞLIĞI geri istiyor (Yakup: "dökümana
          göre ilerle"). VİDEO GERİ GELMEDİ — döküman onu istemiyor ve zaten
          hero videosunun ikinci kez kullanılmasıydı.

          GÖRSEL DEĞİL CANLI METİN: dökümandaki 6.png bir tasarım maketi
          (1080x970, 10 KB, %65'i boş beyaz). Gömülseydi başlık arama motoruna
          ve ekran okuyucuya görünmez, ölçeklenmez, retina'da bulanıklaşırdı.
          Aynı görüntü sitenin kendi tipografisiyle üretiliyor — "Veri; anlamın
          kökeni." başlığıyla birebir aynı kalıp.

          BOŞLUK: bu bölümün KENDİ üst dolgusu YOK — üstündeki ızgaranın
          `pb-20 md:pb-24`'ü (80/96px) tek başına arayı veriyor. Böylece bu
          başlığın üstündeki boşluk, sayfadaki eşdeğer "Veri; anlamın kökeni."
          başlığınınkiyle birebir aynı oluyor ve ara TEK yerde ayarlanıyor.
          (Önce buraya `pt-6 md:pt-10` de eklenmişti; toplam 104/136px'e çıkıp
          sitenin ritminden sapıyordu — denetimde yakalandı.)

          `mx-auto max-w-[1440px]` ŞART: sayfadaki tüm metin bölümleri bu
          sınırı taşıyor. Yalnız `px-5 md:px-10` bırakılınca 1440px'e kadar
          fark görünmüyor, ÜSTÜNDE ayrışıyor: 1920px'lik ekranda bu başlık
          soldan 40px'te, ikizi "Veri" 280px'te başlıyordu — 240px kayma,
          2560px'te 560px (ölçüldü). */}
        <section className="mx-auto max-w-[1440px] px-5 md:px-10">
          <Reveal mask>
            <h2 className="t-dev text-navy">
              İletişim;{" "}
              <em className="font-didot font-normal italic">anlamın</em>
              <br />
              dolaşımı.
            </h2>
          </Reveal>
        </section>

        {/* ── DİKEY ÜÇLÜ PORTFOLYO ÖN İZLEME ──
          Döküman: "Altına ise temadan aşağıdaki alanı ekleyeceğiz, 3'ü de dikey
          olacak ve portfolyo sayfasının ön görüntüleme alanı olacak.
          Savronik - Atlantis - bfit'i göreceğiz."

          KART ORANI 4:5 — keyfi değil: bfit'in görseli (1080x1350) tam 4:5,
          yani üçlünün en iyi kaynağı hiç kırpılmadan oturuyor.

          ⚠️ GÖRSEL EKSİĞİ (ekipten istenecek): üç markadan yalnızca bfit'in
          DİKEY görseli var. Savronik'te tek bir 2:1 hava fotoğrafı (banner.png),
          Atlantis'te 3:2 mockup ve metin ağırlıklı kare sosyal medya postları
          var. İkisi de `object-cover` ile kırpılıyor; odak noktaları elle
          ayarlandı ama bu bir çözüm değil, idare. Dikey çekim/kurgu gelince
          `gorsel` ve `odak` değerleri güncellenecek.

          ⚠️ NETLİK — `sizes` SORUNU TAM ÇÖZMEZ, ÇÖZEMEZ: 4:5 kutuyu dolduran
          şey görselin YÜKSEKLİĞİ. 1440px ekranda kart 437x547 CSS px, yani 2x
          retinada 1093px yükseklik ister. Kaynakların yüksekliği: savronik 887
          (1,23x büyütme), atlantis 1024 (1,07x), bfit 1350 (NET). Yani savronik
          komşularından bir tık yumuşak kalacak ve bunu HİÇBİR `sizes` değeri
          düzeltmez — dosyada o piksel yok. Ancak dikey çekimle çözülür.
          Aşağıdaki `sizes` değerleri kaynağın TAMAMININ indirilmesini sağlıyor;
          düzeltmeden önce tarayıcı kart genişliğinde küçük bir sürüm indirip
          ~2x büyütüyordu, şimdi kayıp yalnız yukarıdaki orana indi.

          `mx-auto max-w-[1440px]` NETLİK İÇİN DE ŞART: sınırsız bırakılırsa
          2560px'lik ekranda kart 811px'e çıkıyor ve savronik büyütmesi 2,28x'e
          fırlıyordu. Sınırla kart 437px'te sabitleniyor, büyütme 1,23x'te
          kalıyor. (Aynı sınır üstteki başlığı da ikiziyle hizalıyor.)

          ⚠️ LOGO EKSİĞİ: `ref-logos/atlantis.png` YOK (savronik ve bfit var).
          Bileşen logosuz markada marka adını yazıyla gösteriyor — uydurma bir
          logo üretilmedi. */}
        <section className="mx-auto grid max-w-[1440px] gap-4 px-5 pb-20 pt-10 md:grid-cols-3 md:gap-6 md:px-10 md:pb-24 md:pt-12">
          {(
            [
              {
                slug: "savronik",
                gorsel: "/assets/brands/savronik/banner.png",
                marka: "Savronik",
                aciklama: "yaratıcı marka tanıtım filmi",
                logo: "savronik",
                // Merkez: kırpma sonrası genişliğin %40'ı kalıyor; kompozisyonun
                // simetri ekseni (daire + yeşil alan) tam ortada.
                odak: "object-center",
                // 33vw DEĞİL: `object-cover` bu 2:1 görselin yalnızca %40'ını
                // gösteriyor, yani tarayıcının kart genişliğinin 2,5 KATI
                // çözünürlükte dosya indirmesi gerekiyor. 33vw verilseydi
                // görsel büyütülür ve yanındaki bfit'e göre BULANIK kalırdı
                // (denetimde yakalandı). 33 x 2,5 ≈ 83; 1440 üstünde kart
                // sabitlendiği için orada piksel değeri: 437 x 2,5 ≈ 1093.
                sizes: "(min-width: 1440px) 1093px, (min-width: 768px) 83vw, 250vw",
              },
              {
                slug: "atlantis",
                gorsel: "/assets/brands/atlantis/banner.png",
                marka: "Atlantis",
                aciklama: "tarım sulama teknolojilerinde dijital pazarlama",
                // Sola kaydırıldı: merkezde bırakılsa mockup'ın sol kenarındaki
                // ATLANTIS logosu ve başlığı kırpma dışında kalıyordu.
                odak: "object-[35%_50%]",
                // 3:2 görselin %53'ü görünüyor → 33 x 1,875 ≈ 62 (yukarıdaki
                // gerekçenin aynısı); 1440 üstünde 437 x 1,875 ≈ 819px.
                sizes: "(min-width: 1440px) 819px, (min-width: 768px) 62vw, 188vw",
              },
              {
                slug: "bfit",
                gorsel: "/assets/brands/bfit/g1.jpg",
                marka: "bfit",
                aciklama: "markalama ve performans pazarlama",
                logo: "bfit",
                // Tam 4:5 — hiç kırpılmıyor, düzeltme gerekmiyor.
                odak: "object-center",
                sizes: "(min-width: 1440px) 437px, (min-width: 768px) 33vw, 100vw",
              },
            ] satisfies OnizlemeVerisi[]
          ).map((m, i) => (
            <Reveal key={m.slug} delay={0.06 * i}>
              <PortfolyoOnizleme
                {...m}
                {...olcu(m.gorsel)}
                className="aspect-[4/5]"
              />
            </Reveal>
          ))}
        </section>

        {/* ── SLOGAN BANNER'I ──
          Döküman: "Bu [slogan] alanı 'İletişim; Anlamın Dolaşımı' alanının
          altına alacağız." Üstteki iki bölüm 2026-09-09'da geri gelince bu
          talimat karşılandı — banner artık dökümanın istediği yerde.

          ⚠️ PLACEHOLDER: slogan-banner.png GEÇİCİ. Ekipten gerçek marka videosu
          gelince bu görselin yerini alacak (eski yorumda yazılıydı, kaldırılan
          blokla birlikte kaybolmuştu — code-reviewer yakaladı).

          TAM GENİŞLİK (2026-09-02, Yakup): gri fon (bg-mist) ve yan boşluklar
          KALDIRILDI. Banner artık ekranın soluna ve sağına sıfırlanıyor —
          sayılar bandı ve imaj bölücü gibi. Gri bandın iki yanında 128'er piksel
          dolgu vardı; komşularının dolgusuyla toplanınca 256px'lik boşluklar
          oluşuyordu, sayfadaki en büyük iki boşluk bunlardı. */}
        <Reveal>
          <Image
            src="/assets/home/slogan-banner.png"
            alt="Duyulan unutulur, anlaşılan kalır — tellers, gerçek bir ajans deneyimi"
            width={1920}
            height={800}
            className="h-auto w-full"
            sizes="100vw"
          />
        </Reveal>

        {/* ── VERİ; ANLAMIN KÖKENİ ──
          NOT: eski yorumda "üstteki gri bandın kenarına yapışmasın" yazıyordu;
          o gri bant 2026-09-02'de kaldırıldı. Üstte artık tam genişlik slogan
          banner'ı var, dolgu ondan ayrılmak için duruyor. */}
        <section className="mx-auto max-w-[1440px] px-5 pb-20 pt-20 md:px-10 md:pb-24 md:pt-24">
          <Reveal mask>
            <h2 className="t-dev text-navy">
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
                  <h3 className="t-dev mt-2 text-white">
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
        <section className="py-20 md:py-24">
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
