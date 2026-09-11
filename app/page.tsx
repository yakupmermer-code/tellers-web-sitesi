import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import PortfolyoOnizleme from "@/components/PortfolyoOnizleme";
import ClosingCta from "@/components/ClosingCta";
import BlogIkili from "@/components/BlogIkili";
import HeroYouTube from "@/components/HeroYouTube";
import MaskLines from "@/components/MaskLines";
import { Stagger, StaggerItem } from "@/components/Stagger";
import CountUp from "@/components/CountUp";
import MediaReveal from "@/components/MediaReveal";
import { SERVICES } from "@/content/services";
import { SITE } from "@/content/site";
import JsonLd from "@/components/JsonLd";
import { grafik, sayfaSemasi, paylasim } from "@/lib/seo";
import { gorselOlcu } from "@/lib/gorsel";
import { getBrand } from "@/content/brands";
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
  bilgi?: { baslik: string; musteri: string; hizmet: string; yil: string };
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

/** Sol dikey kartın görseli. Tek yerde: `gorsel` ve `olcu()` aynı yolu
 *  kullanmak zorunda — ayrışırsa `gorselOlcu` sessizce 16:9 varsayılanına
 *  düşer, ne derleme hatası ne uyarı verir (denetimde yakalandı). */
const MYNOVA_GORSEL = "/assets/brands/mynova/gorsel-3.png";

/**
 * Kart içi bilgi bloğunu `content/brands.ts`ten üretir — TEK KAYNAK.
 *
 * Bir tur elle yazılmıştı ve daha yazılırken ayrışmıştı: yıl `brands.ts`te
 * "2022-2023" (düz tire), kartta "2022–2023" (uzun tire) — aynı yıl sitenin iki
 * yerinde iki farklı karakterle çıkıyordu.
 *
 * 🔴 ASIL SEBEP `tarihTeyitsiz` KALKANI: `app/portfolyo/page.tsx` teyit
 * edilmemiş tarihleri BASMIYOR (security-auditor bulgusu). Elle yazınca ana
 * sayfa bu kalkanı baypas ediyordu; ekip yarın bir markayı teyitsiz işaretlese
 * ana sayfa doğrulanmamış tarihi göstermeye devam ederdi. Anayasa: "Doğrulanamayan
 * alan hiç basılmaz."
 *
 * `baslik` hâlâ elle: `brands.ts`teki `headline` SEO başlığı (Başlık Düzeni,
 * uzun); kartta cümle gerekiyor. Ekleneceği yer belli olunca oraya taşınır.
 */
const kartBilgisi = (slug: string, baslik: string) => {
  const m = getBrand(slug);
  if (!m) throw new Error(`Bilinmeyen marka: ${slug}`);
  return {
    baslik,
    musteri: m.name,
    hizmet: m.listService,
    yil: m.tarihTeyitsiz ? "" : m.year,
  };
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
        /* Sayfanın EN ÜSTÜNDEKİ koyu hero — üst bar daha ilk boyamada
           (JS ölçümü gelmeden) saydam açılsın diye. Bkz. `app/globals.css`
           → "ÜST BAR AÇILIŞ RENGİ". */
        data-koyu-acilis
        className="relative flex min-h-[100dvh] items-end overflow-hidden bg-navy"
      >
        {/* Marka tanıtım filmi (YouTube gömme). Açılıştaki 1.28 ölçek
            HeroZoom'u artık bileşenin İÇİNDE — kontrol düğmeleri ölçeğin
            dışında kalsın diye. Geçici Higgsfield videosunu gösteren
            `components/HeroVideo.tsx` silinmedi, yedekte duruyor. */}
        <HeroYouTube className="absolute inset-0" />
        {/* 🔴 ÜST ŞERİT DEGRADESİ — menü okunurluğu için ZORUNLU.
            Bu bölüm `data-koyu-bolum` taşıyor; `components/Header.tsx` onu
            görünce barı TAMAMEN saydam bırakıp yazıları beyaz basıyor. O
            dosyadaki ölçüm notu aynen şöyle: saydam barda "ana sayfada 16
            noktanın 8'inde başlık ekranda yoktu". Bunu telafi eden şey, bu
            turda kaldırılan tam ekran `bg-navy/35` örtüsüydü. Örtü gidince
            videonun açık bir karesinde logo ve hamburger kayboluyor — yatay
            menü olmadığı için sitenin TEK gezinme yolu görünmez oluyor.
            (Denetimde yakalandı, 2026-09-10.)

            Bu degrade tüm ekranı DEĞİL yalnız üstteki 112px'i kaplıyor
            (bar 70px). Videonun renkleri ekranın ~%85'inde bozulmadan kalıyor,
            yani Yakup'un "soft görünüm kalksın" isteği korunuyor.
            DOM'da HeroYouTube'dan SONRA: ikisi de konumlandırılmış, sonraki
            üste biner. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-navy/70 via-navy/30 to-transparent"
        />
        {/* ⚠️ İKİ KARARTMA KATMANI KALDIRILDI (2026-09-10, Yakup: "slider
            üzerinde bir alan daha var, soft gösteriyor, video asıl renkleri
            belli olmuyor, onu da kaldır"). Kaldırılanlar: tam ekran
            `bg-navy/35` örtüsü ve alttaki `from-navy/80` degrade. İkisi de
            hero yazısının okunurluğu içindi; yazı da bu turda ekrandan
            kalktığı için gerekçeleri kalmadı. Video artık kendi renkleriyle
            görünüyor (iframe'deki `opacity-80` de kaldırıldı).

            🟠 BUNUN BİR BEDELİ VAR: üst bar (Header) bu bölümde `data-koyu-bolum`
            gördüğü için yazılarını BEYAZ basıyor. Karartma yokken videonun
            açık renkli bir karesinde menü/logo okunmayabilir. Videonun tonu
            görülüp gerekirse yalnız üst şeride ince bir degrade eklenmeli —
            tüm ekranı kaplayan örtü değil. */}
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
        {/* ⚠️ HERO YAZILARI EKRANDAN KALDIRILDI (2026-09-10, Yakup: "slider
            üzerindeki yazıları kaldır, solda ve sağda olan"). Soldaki başlık ve
            sağdaki dört hizmet kalemi artık görünmüyor; slider tek başına.

            🔴 BAŞLIK SİLİNMEDİ, `sr-only` OLDU. Sebebi 226. satırdaki nottur:
            ana sayfanın TEK `<h1>`'i buydu — "Global devlerin tercihi" başlığı
            bilerek `h2` yapılmıştı, çünkü Hakkımızda sayfasının h1'i ile
            birebir aynı cümle ve iki sayfa aynı başlıkla yarışıyordu. Bu h1
            tamamen silinseydi ana sayfa BAŞLIKSIZ kalırdı; arama motorları ve
            (CLAUDE.md'deki GEO hedefi gereği) yapay zeka motorları sayfanın ne
            olduğunu okuyamazdı. `sr-only` ekranda hiçbir şey göstermez ama
            HTML'de durur — Yakup'un istediği görsel sonuç birebir korunuyor.

            Sağdaki hizmet listesi TAMAMEN kaldırıldı: aynı dört kalem sayfanın
            ilerisindeki hizmet slider'ında zaten var, içerik kaybı yok. */}
        <h1 className="sr-only">
          Markaları duyulur değil, anlaşılır kılıyoruz.
        </h1>
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
            className="t-orta text-navy"
            label="Global devlerin tercihi, tellers."
            lines={["Global devlerin", "tercihi, tellers."]}
          />
          {/* EKİP NOTU (11 Eylül dökümanı): "Global devlerin tercih… başlığının
              altındaki metin ile satır aralığı bu kadar fazla olmayacak,
              başlığa daha yakın olacak." Tasarım dosyası (`1 (1).png`) ölçüldü:
              alt metin başlığın hemen altında, arada boşluk yok. `mt-1.5`
              kaldırıldı — Tailwind preflight `p`ye zaten margin vermiyor. */}
          <Reveal delay={0.2}>
            <p className="t-govde text-navy">
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
          {/* ÇİZGİSEL CTA (2026-09-09, revize dökümanı): "rect içine alınmayacak
              temadaki örnekteki gibi çizgisel olarak kullanılacak."
              Master temada ölçüldü: CTA'lar 28px/500, kenarlık YOK, köşe
              yuvarlaklığı YOK — düz metin. `link-grow` altındaki 14px'lik
              çizgiyi hover'da %100'e uzatıyor (sitenin mevcut kalıbı;
              KapanisSection'daki iki CTA zaten böyleydi).
              Eski hâli: lacivert dolu hap buton + daire içinde ok. */}
          <StaggerItem>
            <Link
              href="/hakkimizda"
              className="link-grow inline-block w-max font-medium transition-opacity duration-500 hover:opacity-70 mt-10 text-[20px] text-navy md:text-[28px]"
            >
              Hakkımızda
            </Link>
          </StaggerItem>
        </Stagger>
      </section>

      {/* Buradan aşağısı, yukarıdaki sabitlenen bölümün ÜZERİNE kayar.
          z-10 + opak zemin şart: saydam olursa altındaki bölüm görünür. */}
      <div className="relative z-10 bg-paper">
        {/* ── REFERANS LOGO BANDI KALDIRILDI (2026-09-10, Yakup: "üsteki
            şeridi kaldır") ──
            Burada ayrı bir lacivert logo bandı vardı. Revize dökümanı
            "Referans logolar alt kısımda banner alanında verilmeyecek temadaki
            gibi yukarıdaki ekip görselinin alt boş kısmında akan slider
            şeklinde dönecek" diyor. Logolar artık YALNIZCA sayfanın altındaki
            ekip görselinin içinde akıyor (`components/ClosingCta.tsx`).
            Ana sayfada iki logo şeridi birden bulunma sorunu da böylece bitti. */}

        {/* ── 22.872.000 $ + HİZMET LİSTESİ ── */}
        <section className="mx-auto grid max-w-[1440px] gap-16 px-5 py-20 md:grid-cols-[1fr_1.1fr] md:gap-24 md:px-10 md:py-24">
          <div className="md:sticky md:top-32 md:self-start">
            <Reveal mask>
              <h2 className="t-buyuk text-navy">
                <CountUp value="22.872.000 $" />
              </h2>
              {/* "22… rakamın hemen altındaki metin satır arası azaltsın,
                  birbirine yaklaşsın" (11 Eylül dökümanı). */}
              <p className="t-govde text-navy">
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
                      {/* "Alt açıklama metni ana metinden ÇOK UZAK, daha yakın
                          olmalı" (11 Eylül dökümanı) — 12px'ten 4px'e. */}
                      <h3 className="t-alt text-navy">{s.titleTr}</h3>
                      <p className="mt-1 max-w-xl leading-relaxed text-navy/60">
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

        {/* ── SLOGAN + ANLAM FELSEFESİ ──
            Izgara 1fr/1fr DEĞİL 1.25fr/1fr: gerekçe aşağıda, slogan başlığında. */}
        <section className="mx-auto grid max-w-[1440px] gap-16 px-5 py-20 md:grid-cols-[1.25fr_1fr] md:gap-24 md:px-10 md:py-24">
          <div className="md:sticky md:top-32 md:self-start">
            <MaskLines
              as="h2"
              /* 🔴 `t-dev` (130px) DEĞİL `t-buyuk` (84px) + kalınlık korundu.
                 Ekip notu: "Duyulan unutulur, anlaşılan kalır ÇOK BÜYÜK ve
                 yerleşim olarak tasarımdaki ile aynı değil."
                 Ölçüldü (1440x900): 130px, 632 piksellik kolonda DÖRT satıra
                 sarıyordu (kutu 632x605); tasarım dosyası (`slogan.png`) İKİ
                 satır gösteriyor. 84px'te "Duyulan unutulur," satırı kolona
                 sığıyor ve iki satır oluyor.
                 SONRA BİR KADEME DAHA İNDİ (ölçüldü): 84px'te "Duyulan
                 unutulur," satırı 793 piksel, 72px'te 680 piksel — kolon ise
                 632 piksel. Yani 84 de 72 de tek başına sığmıyordu. İki taraflı
                 çözüldü: punto sayfanın h2 ölçeğine (`t-orta`, 72px) indi VE
                 bölümün ızgarası 1fr/1fr yerine 1.25fr/1fr oldu — slogan kolonu
                 702 piksele çıkıp 680'lik satırı alıyor, sağdaki metin kolonu
                 562 pikselle rahat kalıyor.
                 `font-extrabold`: `t-orta` 600 taşıyor, tasarımdaki ağırlık
                 ise `t-dev`inki (800) — punto küçüldü, kalınlık korundu. */
              className="t-orta font-extrabold text-navy"
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
            görsel altındaki marka adı paragrafları KALDIRILDI.

            İKİ GÖRSEL ARASI BOŞLUK SIFIR (2026-09-09, Yakup: "master ve bardahl
            görselleri arası boşluk bırakmışsın, master temada boşluk yok o
            alanda, revize metninde gösterdiği kısımda da yok"). Önceden 24px
            (`gap-6`) vardı.

            ÜZERİNE GELİNCE KARARTMA YOK (`ortu={false}`): master temada bu
            slaytların üstüne renk gelmiyor, görsel olduğu gibi kalıp hafifçe
            büyüyor. Karartma + logo YALNIZCA aşağıdaki dikey üçlüde. ── */}
        <section className="flex flex-col pb-20 md:pb-24">
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
              <PortfolyoOnizleme {...m} {...olcu(m.gorsel)} ortu={false} />
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
            <h2 className="t-orta max-w-[1100px] text-navy">
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

        {/* ── 3'LÜ PORTFOLYO ALANI — SOL DİKEY / SAĞ YATAY ──
            Revize dökümanı (2026-09-09): "Bu alanı temadaki gibi
            konumlandıralım. Temadaki kullanım: Sol dikey / Sağ alan ise yatay
            olacak."

            ÖNCEKİ HÂLİ YANLIŞTI: üç eşit KARE görsel yan yanaydı. Döküman bu
            alanı asimetrik istiyor — solda tam boy bir DİKEY, sağda üst üste
            iki YATAY. (Yakup 2026-09-09: "belgede olduğu şekilde 3'lü alanı
            yapmamışsın.")

            ORAN NASIL ÇIKIYOR: sağdaki iki kart 16:9. Sol sütun `h-full` ile
            onların toplam yüksekliğini kaplıyor, yani oranı ızgaradan doğuyor
            (1440px'te 594x859 = 0.69, tarayıcıda ölçüldü) — elle bir oran dayatılmadı. Referansın
            dikey kartları 0.56-0.70 bandında, aynı yerdeyiz.

            SÜTUN ORANI NEDEN 2.4fr/3fr (2fr DEĞİL): 2fr'de sol kart 0.58
            oranına düşüyor ve My Nova görselinin (kaynak oranı 0.71) yalnızca
            %82'si görünüyordu — "THE EVOLUTION OF SMILES" başlığı kaynağın
            %83'ünü kapladığı için son harfi kesiliyordu (ekran görüntüsüyle
            görüldü). 2.4fr'de kart 0.69'a çıkıyor. (O görsel sonra geri alındı ama
            oran korundu: 0.69, referansın dikey kart bandının üst ucu.)

            KART KALIBI: dökümanın "portfolyo sayfasının ön görüntü alanı"
            tarifi bu alan için de geçerli — üçü de `PortfolyoOnizleme`, yani
            üzerine gelince lacivert karartma + logo. Böylece sayfadaki iki
            farklı kart kalıbı da tek kalıba indi. ── */}
        <section className="mx-auto max-w-[1440px] px-5 pb-20 md:px-10 md:pb-24">
          <div className="grid gap-4 md:grid-cols-[minmax(0,2.4fr)_minmax(0,3fr)] md:gap-6">
            <Reveal>
              {/* Sol dikey: My Nova broşür maketi.
                  NEDEN BU GÖRSEL: kaynak oranı 0.80, telefondaki kart oranıyla
                  (`aspect-[4/5]`) BİREBİR — mobilde hiç kırpılmıyor. Ayrıca
                  üzerinde basılı marka logosu YOK, bu yüzden karartmada çıkan
                  logoyla çakışmıyor. (`darwin-chair.jpg` denendi ve geri
                  alındı: 0.707 oranı telefonda üstten/alttan %5,8 kesiyor ve
                  gömülü "my nova" logosu + web adresi kartta ikinci bir logo
                  yaratıyordu — denetimde yakalandı.)

                  ⚠️ İCLOUD TUZAĞI (2026-09-09): bu dosya bir tur boyunca
                  optimize ediciyi 18 sn kilitli tuttu ve "dosya bozuk" diye
                  teşhis edildi. YANLIŞTI — dosya sağlam, şimdi 0,002-0,1 sn'de
                  dönüyor, sharp'ta 65 ms. Sebep proje `~/Desktop` altında ve
                  iCloud senkronu açık olduğu için dosyanın o an buluttan
                  indiriliyor olmasıydı. Bir dosya "bozuk" görünürse ÖNCE
                  `brctl` ve tekrar denemeyi düşün. */}
              <PortfolyoOnizleme
                slug="my-nova"
                gorsel={MYNOVA_GORSEL}
                marka="My Nova Dental Clinic"
                aciklama="performans ve dijital pazarlama"
                logo="mynova"
                {...olcu(MYNOVA_GORSEL)}
                sizes="(min-width: 1440px) 597px, (min-width: 768px) 45vw, 100vw"
                className="aspect-[4/5] md:aspect-auto md:h-full"
              />
            </Reveal>
            <div className="grid gap-4 md:gap-6">
              {(
                [
                  {
                    slug: "savron-smart-media",
                    gorsel: "/assets/brands/savron/banner.png",
                    marka: "Savron Smart Medya",
                    aciklama: "3D içerik üretimi ve dijital pazarlama",
                    logo: "savron",
                    sizes:
                      "(min-width: 1440px) 742px, (min-width: 768px) 52vw, 100vw",
                  },
                  {
                    slug: "tyre-supply",
                    gorsel: "/assets/brands/tyresupply/banner.png",
                    marka: "Tyre Supply",
                    aciklama: "performans ve dijital pazarlama",
                    logo: "tyresupply",
                    sizes:
                      "(min-width: 1440px) 742px, (min-width: 768px) 52vw, 100vw",
                  },
                ] satisfies OnizlemeVerisi[]
              ).map((m, i) => (
                <Reveal key={m.slug} delay={0.06 * (i + 1)}>
                  <PortfolyoOnizleme
                    {...m}
                    {...olcu(m.gorsel)}
                    className="aspect-[16/9]"
                  />
                </Reveal>
              ))}
            </div>
          </div>
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
            <h2 className="t-orta text-navy">
              İletişim;{" "}
              <em className="font-didot font-normal italic">anlamın</em>
              <br />
              dolaşımı.
            </h2>
          </Reveal>
        </section>

        {/* ── DİKEY PORTFOLYO ÖN İZLEME (Savronik / Atlantis / bfit) ──
          Döküman: "Altına ise TEMADAN AŞAĞIDAKİ ALANI ekleyeceğiz, 3'ü de dikey
          olacak ve portfolyo sayfasının ön görüntüleme alanı olacak.
          Savronik - Atlantis - bfit'i göreceğiz."

          ⚠️ ÖNCEKİ HÂLİ YANLIŞTI (Yakup 2026-09-10: "sabit 3'lü yapmışsın,
          revize talebinde o şekilde değil"). Üç eşit sütun yan yanaydı ve
          kartların içi boştu.

          DOĞRUSU — ekibin ekran görüntüsündeki alan master temanın PORTFOLYO
          DETAY sayfası (arpeggio.framer.website/work/velocity-motors). Yakup'un
          tarayıcısında canlı ölçüldü (2026-09-10, 1440px):
            · master kartı 427x940 → oran 0,454
            · ⚠️ BİZDE 427x627: Yakup 2026-09-10'da "3 kısmı da 3/1 oranında
              küçült" dedi → 940 x 2/3 = 627 (`aspect-[427/627]`). Genişlik
              ızgaradan geliyor, değişmedi; kısalan yükseklik.
            · ÜÇ EŞİT sütun, hepsi aynı hizada, 40px ara
            · (1440 - 80 kenar - 80 ara) / 3 = 426,7 ✔ birebir tutuyor

          ÜÇ KART EŞİT (2026-09-10, Yakup: "3'ünün görselini birbirine
          eşitleyelim, eskiye döndürelim"). Bir ara sol kart kısa yapılmıştı;
          ekibin ekran görüntüsündeki kademeli görüntü oradan geliyordu. Ama o
          kademe SABİT BİR DÜZEN DEĞİL — master'da kaplar eşit (427x940) ve
          kaymış görüntü PARALAKSTAN doğuyor: görseller kaplarından büyük ve
          kaydırdıkça kap içinde hareket ediyorlar.
          Doğru çözüm kapları eşitleyip paralaksı açmak; ikisi birden yapıldı
          (paralaks `components/PortfolyoOnizleme.tsx` içinde `MediaReveal`).

          KART İÇİ YAZI: master'da bu kartların üstünde HİÇ YAZI YOK (ölçüldü,
          kesişen metin sayısı 0; tek metin kısa kartın ALTINDAKİ teknoloji
          listesi). Bizde yazı KALIYOR — Yakup 2026-09-10: "yoksa da eğer bizde
          olsun, sadece ölçüleri bu şekilde yap." Bilinçli sapma.

          ÜZERİNE GELİNCE: bilgi bloğu sönüyor, yerini lacivert karartma + logo
          alıyor. Karartma dökümanın ayrı bir isteği ve Yakup 2026-09-10'da
          "3'lü gruptaki kararmayı kaldırma" dedi — master'da karartma yok,
          bilinçli bir sapma.

          ⚠️ ATLANTIS'İN LOGOSU YOK (`ref-logos/atlantis.png`) — karartmada adı
          yazıyla çıkıyor, uydurma logo üretilmedi.
          ⚠️ Savronik ve Atlantis'in DİKEY görseli yok; yatay kaynaklar
          kırpılıyor. Dikey çekim gelince `gorsel`/`odak` güncellenecek. */}
        <section className="mx-auto max-w-[1440px] px-5 pb-20 pt-10 md:px-10 md:pb-24 md:pt-12">
          <div className="grid gap-6 md:grid-cols-3 md:items-start md:gap-10">
            {(
              [
                {
                  slug: "savronik",
                  gorsel: "/assets/brands/savronik/banner.png",
                  marka: "Savronik",
                  aciklama: "yaratıcı marka tanıtım filmi",
                  logo: "savronik",
                  odak: "object-center",
                  bilgi: kartBilgisi(
                    "savronik",
                    "Savunma sektöründe yaratıcı marka tanıtım filmi.",
                  ),
                  // Kart 427x627 (1/3 küçültme sonrası). `object-cover` kutuyu
                  // BOYA göre dolduruyor: gereken genişlik = 627 x 2,0 = 1254px.
                  // Kaynak 1774px — artık FAZLASIYLA yetiyor; kart kısalınca
                  // Savronik'teki yumuşaklık sorunu da kendiliğinden kapandı.
                  // 768px ALTI: mobilde kart hâlâ `aspect-[4/5]`, 1/3 küçültme
                  // yalnız `md:` üstündeki orana uygulandı.
                  // 🔴 199vw TAVAN: burada bir tur 250vw yazılmıştı ama Next'in
                  // sizes ayrıştırıcısı `(1?\d?\d)vw` deseniyle çalışıyor —
                  // 200 ve üstü SESSİZCE yok sayılıyor, yani o değer hiç
                  // işlemiyordu (denetimde regex çalıştırılarak doğrulandı).
                  // İhtiyaç ~223vw; 199vw tavanı %11 eksik kalıyor, bu Next'in
                  // sınırı, bizim tercihimiz değil.
                  sizes:
                    "(min-width: 1440px) 1254px, (min-width: 768px) 82vw, 199vw",
                },
                {
                  slug: "atlantis",
                  gorsel: "/assets/brands/atlantis/banner.png",
                  marka: "Atlantis",
                  aciklama: "tarım sulama teknolojilerinde dijital pazarlama",
                  odak: "object-[35%_50%]",
                  bilgi: kartBilgisi(
                    "atlantis",
                    "Akıllı sulama sistemlerinde dijital pazarlama operasyonu.",
                  ),
                  // 627 x 1,5 = 941px gerekiyor; kaynak 1536px, rahat yetiyor.
                  // Son değer (768px altı) mobil oranı değişmediği için sabit.
                  sizes:
                    "(min-width: 1440px) 941px, (min-width: 768px) 62vw, 188vw",
                },
                {
                  slug: "bfit",
                  // g1.jpg DEĞİL: o görselin İÇİNE "TÜRKİYE'NİN EN BÜYÜK SPOR
                  // FRANCHISE MARKASI" + "KENDİN İÇİN BAŞLA." + bfit wordmark'ı
                  // basılı. Bizim başlığımız neredeyse aynı cümle olduğu için
                  // üst üste biniyordu ve kartta üç ayrı bfit işareti çıkıyordu
                  // (denetimde yakalandı). banner.jpg temiz: yalnız stüdyo
                  // cephesi ve tabela.
                  gorsel: "/assets/brands/bfit/banner.jpg",
                  marka: "bfit",
                  aciklama: "markalama ve performans pazarlama",
                  logo: "bfit",
                  odak: "object-center",
                  bilgi: kartBilgisi(
                    "bfit",
                    "Türkiye'nin en büyük spor franchise markasına markalama.",
                  ),
                  // 627 x 1,5 = 941px gerekiyor; kaynak 1410px, rahat yetiyor.
                  // Son değer (768px altı) mobil oranı değişmediği için sabit.
                  sizes:
                    "(min-width: 1440px) 941px, (min-width: 768px) 62vw, 188vw",
                },
              ] satisfies OnizlemeVerisi[]
            ).map((m, i) => (
              <Reveal key={m.slug} delay={0.06 * i}>
                <PortfolyoOnizleme
                  {...m}
                  {...olcu(m.gorsel)}
                  className="aspect-[4/5] md:aspect-[427/627]"
                />
              </Reveal>
            ))}
          </div>
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
        {/* İKİ KOLON — EKİP NOTU (11 Eylül dökümanı): "Veri anlamın kökeni
            kısmında font avenir & didot olmalı. Direkt tasarımı ekleyelim.
            ALT PARAGRAF YERLEŞİMİ İSE TEMADAKİ GİBİ HEMEN BAŞLIĞIN YAN
            TARAFINDA OLMALI."
            Başlık zaten avenir + didot karışımıydı; 2026-09-11'de serif geri
            gelince tasarımdaki görünüme kavuştu. Kalan iş paragrafın yerleşimi:
            başlığın ALTINDAN yan tarafına alındı. */}
        <section className="mx-auto grid max-w-[1440px] gap-10 px-5 pb-20 pt-20 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-20 md:px-10 md:pb-24 md:pt-24">
          <Reveal mask>
            <h2 className="t-orta text-navy">
              Veri; <em className="font-didot font-normal italic">anlamın</em>
              <br />
              kökeni.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex max-w-none flex-col gap-6 text-lg leading-relaxed text-navy/75 md:text-[22px]">
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

        {/* ── HİZMETLER SLIDE'LARI — ART ARDA, ÜST ÜSTE BİNMEDEN ──
          ⚠️ 2026-09-10'da DEĞİŞTİ. Kartlar `sticky top-0 h-[100dvh]` ile üst
          üste biniyordu; Yakup: "birimki üst üste katlanıyor fakat master
          temada o şekilde değil."

          MASTER ÖLÇÜMÜ (/work/velocity-motors, 1440px, Yakup'un tarayıcısında
          canlı): "More Projects" altındaki dört kartın hepsi
          `position: relative` — sticky DEĞİL. Ölçülen kutular 1440x800 ve
          mutlak konumları 13645 / 14445 / 15245 / 16045: tam 800px aralıkla
          art arda, ARALARINDA BOŞLUK YOK, hiçbiri diğerinin üstüne binmiyor.
          1440/800 = 1,8 → `aspect-[9/5]`.

          ⚠️ BİZDE 27/10 (2026-09-10, Yakup: "hizmetlerimiz kısmını, 4 tane alt
          alta olan, 3/1 oranında küçült"). Yükseklik üçte bir kısaldı:
          800 x 2/3 = 533 → 1440/533 = 2,70 → `aspect-[27/10]`. Genişlik
          değişmedi, kısalan yükseklik. (Aynı yorum 3'lü portfolyo alanında da
          uygulanmıştı: 940 → 627.)
          Mobil de aynı oranda: `aspect-[4/5]` → `aspect-[6/5]`; 375px'te kart
          469 → 312 px. İçerik (eyebrow + başlık + özet) ~111px, `p-6` dolgudan
          sonra 264px kalıyor — sığıyor.

          Master'da sticky BAŞKA yerlerde var (hero bandı, künye bandı,
          Credits, kapanış CTA) — yani efekt temada mevcut ama bu kartlarda
          kullanılmıyor. Bizde de artık kullanılmıyor.

          MOBİLDE 4/5: 375px genişlikte 9/5 oran 208px yükseklik demek; başlık
          + özet metni oraya sığmıyordu. Dar ekranda kart dikeye dönüyor. */}
        <section aria-label="Hizmetlerimiz" className="relative">
          {/* Reveal ARTIK KULLANILABİLİR: eski `sticky` düzende Reveal'in
              transform'u sticky'yi kırdığı için kartlar animasyonsuz giriyordu.
              Sticky kalkınca engel de kalktı; sayfanın geri kalanıyla aynı
              kademeli giriş burada da açıldı. Gecikme YOK: kartlar art arda ve
              tam ekran, hiçbiri diğeriyle aynı anda görünmüyor. */}
          {SERVICES.map((s) => (
            <Reveal key={s.slug}>
              <div className="relative aspect-[6/5] overflow-hidden md:aspect-[27/10]">
                <Link
                  href="/hizmetlerimiz"
                  className="group relative block h-full w-full overflow-hidden"
                >
                  {/* KAYDIRMA PARALAKSI — master'ın kurulumu birebir.
                      ÖLÇÜM (/work/velocity-motors, 1440px, canlı): kart
                      1440x800 ama İÇİNDEKİ görsel 2016x1011 — kaptan %40
                      geniş, %26 uzun, dikeyde tam merkezli (üst ofset -105 =
                      (800-1011)/2). Kaptan büyük görsel = paralaks payı.
                      Bizimki 1440x800'dü: kabı tam dolduruyordu, oynayacak
                      yeri yoktu. Yakup 2026-09-10: "aşağı doğru inerken ki
                      efekt master temadaki ile birebir aynı olsun."

                      amount=13 HESAPLA SEÇİLDİ: MediaReveal'da taban ölçek
                      1+2*amount/100. Master'ın dikey payı 1011/800 = 1,264 →
                      amount 13,2 ≈ 13 (taban 1,26). Pay birebir oturuyor.

                      scaleTo VERİLMEDİ: varsayılan 1,12 tabandan küçük ve
                      bileşen `Math.max(taban, scaleTo)` uyguluyor → ölçek
                      sabit 1,26 kalır, yalnız kayma olur. Master'da da üç
                      ayrı kaydırma konumunda görsel boyutu DEĞİŞMEDİ
                      (2016x1011 sabit), yani ortada şişme yok.

                      METİN KATMANI DIŞARIDA: paralaks yalnız görseli taşır,
                      başlık/özet sabit kalır (BlogKart'taki desenin aynısı). */}
                  <MediaReveal className="h-full w-full" amount={13}>
                    {/* ⚠️ `<Image>` DALI BUGÜN ÇALIŞMIYOR: `content/services.ts`
                        içindeki DÖRT hizmetin de `slideVideo` alanı dolu, yani
                        ana sayfada her zaman `<video>` basılıyor. Dal yedek
                        olarak duruyor (videosu olmayan bir hizmet eklenirse
                        devreye girer) — aşağıdaki `sizes` hesabı da o gün için.
                        Denetimde yakalandı: ölü dal üzerinde ince ayar yapılıp
                        asıl render edilen dal gözden kaçmıştı. */}
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
                        /* 126vw. Kart 27/10'a (2,70) kısalınca hesap DEĞİŞTİ:
                           kaynaklar 1920x900 (oran 2,133) artık kutudan DAR,
                           yani `object-cover`da bağlayan kenar GENİŞLİK —
                           görsel tam kutu genişliğinde basılıyor, dikeyde
                           kırpılıyor. Eskiden kutu 1,8 iken YÜKSEKLİK bağlıyor
                           ve görsel %18 geniş basılıyordu; o çarpan kalktı.
                           Geriye yalnız paralaksın taban ölçeği kalıyor:
                           1,00 x 1,26 = 1,26. */
                        sizes="126vw"
                      />
                    )}
                  </MediaReveal>
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-navy/70 via-navy/10 to-transparent p-6 md:p-14">
                    <span className="text-[11px] uppercase tracking-[0.22em] text-white/70">
                      {s.eyebrow}
                    </span>
                    <h3 className="t-kucuk mt-2 text-white">{s.titleTr}</h3>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
                      {s.summary}
                    </p>
                  </div>
                </Link>
              </div>
            </Reveal>
          ))}
        </section>

        {/* ── BLOG — İKİLİ, sürekli dönen (revize dökümanı 2026-09-10) ──
            "Blog alanı tamamen yanlış, mevcuttaki temada yer alan kullanımdan
            ilerleyeceğiz... 2'li olarak yerleştireceğiz, sürekli döner ve
            değişir." Eskiden 4'lü yatay slider'dı.
            Kenar dolgusu eklendi: kartlar artık tam genişlik değil, sayfanın
            diğer bölümleriyle aynı 1440px kapsayıcıda. */}
        <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24">
          {/* "Tüm yazılar" linki (denetim bulgusu 2026-09-10): blog alanı 4'lü
              slider'dan ikiliye inince ana sayfadaki blog yazısı linki 8'den
              2'ye düştü. JavaScript çalıştırmayan tarayıcılar — özellikle yapay
              zeka botları — kalan 6 yazıyı ana sayfada göremez oldu. Dizin
              sayfasına görünür bir link hem bunu kapatıyor hem de beklemek
              istemeyen kullanıcıya çıkış veriyor. */}
          <div className="mb-8 flex justify-end">
            <Link
              href="/blog"
              className="link-grow link-grow-sag inline-block w-max text-[16px] font-medium text-navy transition-opacity duration-500 hover:opacity-70 md:text-[18px]"
            >
              Tüm yazılar
            </Link>
          </div>
          <Reveal>
            <BlogIkili />
          </Reveal>
        </section>

        {/* ── SAYFA BİTİŞ İMAJI + referans logoları ──
          Ekip notu (2026-08-14): logolar ekip görselinin yanında verilecek.
          2026-09-09'da revize dökümanına göre güncellendi: artık ayrı bant
          değil, geniş ekranda görselin İÇİNE (alt boş alana) biniyor.
          Ayrıntı ve mobil davranışı `components/ClosingCta.tsx`'te.

          ⚠️ AÇIK KALEM: bu sayfanın YUKARISINDA (üstteki hero bölümünün hemen
          altında) hâlâ AYRI bir logo bandı var. Yani ana sayfada iki logo
          şeridi birden bulunuyor. Döküman "banner alanında verilmeyecek" diyor
          ama hangisinin kalacağı bir içerik kararı — Yakup'a soruldu. */}
        <ClosingCta />
      </div>
    </>
  );
}
