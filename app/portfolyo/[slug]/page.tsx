import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import PortfolyoKart from "@/components/PortfolyoKart";
import { Stagger, StaggerItem } from "@/components/Stagger";
import KapanisSection from "@/components/KapanisSection";
import CountUp from "@/components/CountUp";
import { BRANDS, getBrand } from "@/content/brands";
import { gorselOlcu } from "@/lib/gorsel";
import JsonLd from "@/components/JsonLd";
import {
  grafik,
  sayfaSemasi,
  kirintiSemasi,
  markaSemasi,
  kisalt,
  paylasim,
  ogKarti,
} from "@/lib/seo";

export function generateStaticParams() {
  return BRANDS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const brand = getBrand((await params).slug);
  if (!brand) return {};
  const aciklama = kisalt(brand.intro);
  return {
    // "X | Portfolyo | tellers" yerine hizmet adı: aranan kelime başlıkta olur.
    title: `${brand.name} — ${brand.services[0]}`,
    description: aciklama,
    alternates: { canonical: `/portfolyo/${brand.slug}` },
    ...paylasim({
      baslik: `${brand.name} — ${brand.headline}`,
      aciklama,
      yol: `/portfolyo/${brand.slug}`,
      gorsel: ogKarti("marka", brand.slug),
      gorselAlt: `${brand.name} — tellers işi`,
      makale: true,
    }),
  };
}

export default async function MarkaDetayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const brand = getBrand((await params).slug);
  if (!brand) notFound();
  const aciklama = kisalt(brand.intro);

  /* Mevcut markadan sonraki 4 marka (dairesel) — her sayfada farklı öneri
     çıkar. DÖRT: master'ın /work/velocity-motors sayfasındaki "More Projects"
     alanı dört kart gösteriyor (ölçüldü, 2026-09-11). */
  const idx = BRANDS.findIndex((b) => b.slug === brand.slug);
  const others = Array.from(
    { length: 4 },
    (_, i) => BRANDS[(idx + 1 + i) % BRANDS.length],
  );

  return (
    <>
      <JsonLd
        data={grafik(
          sayfaSemasi({
            tip: "ItemPage",
            yol: `/portfolyo/${brand.slug}`,
            ad: `${brand.name} — ${brand.headline}`,
            aciklama,
            gorsel: ogKarti("marka", brand.slug),
          }),
          markaSemasi(brand),
          kirintiSemasi([
            { ad: "Ana Sayfa", yol: "/" },
            { ad: "Portfolyo", yol: "/portfolyo" },
            { ad: brand.name, yol: `/portfolyo/${brand.slug}` },
          ]),
        )}
      />
      {/* ── HERO — ANA SAYFA KALIBI (2026-09-11) ─────────────────────────
          Liste sayfasıyla aynı gerekçe: `mt-24` videoyu barın altından
          başlatıyordu, `data-koyu-bolum` olmadığı için bar beyaz örtüye
          geçiyordu ve `max-h-[82dvh]` + `Reveal` ikilisi videonun geç
          görünmesine yol açıyordu ("alttaki yazılar bir anlık gözüküyor").
          `Reveal` KALDIRILDI: opacity 0→1 hero'da gecikme demek; bölüm zaten
          ilk ekranda, giriş yumuşaklığını sayfa geçişi veriyor.
          `preload` da `metadata` → `auto`. */}
      <section
        data-koyu-bolum
        data-imlec-koyu
        /* Sayfanın EN ÜSTÜNDEKİ koyu hero — üst bar daha ilk boyamada
           (JS ölçümü gelmeden) saydam açılsın diye. Bkz. `app/globals.css`
           → "ÜST BAR AÇILIŞ RENGİ". */
        data-koyu-acilis
        /* 🔴 TELEFONDA TAM EKRAN DEĞİL, 16/9 — gerekçesi liste sayfasında
           (`app/portfolyo/page.tsx`) ayrıntılı yazılı. Özet: `h-[100dvh]` +
           `object-cover` kutunun oranını ekranın oranına bağlıyor; dikey
           telefon ekranında yatay hero medyasının %74-85'i kesiliyordu
           (denetimde ölçüldü, 2026-09-11 — Tyre Supply banner'ında marka
           tanınmaz hâle geliyordu). Masaüstünde `md:h-[100dvh]` ile Yakup'un
           istediği tam ekran aynen duruyor. */
        className="relative aspect-video overflow-hidden bg-navy md:aspect-auto md:h-[100dvh]"
      >
        {brand.hero.type === "video" ? (
            <video
            src={brand.hero.src}
            poster={brand.hero.poster}
            autoPlay
            muted
            loop
            playsInline
            /* 🟠 `preload="auto"` BURADA BEDELSİZ DEĞİL: liste sayfasındaki
               hero 1 MB'ın altında ama marka hero videoları 3,1-8,7 MB
               (Atlantis 8,7 · bfit 6,8 · BNI 5,6 · Minousha 3,1).
               `autoPlay` zaten indirtiyor, `preload` çoğu tarayıcıda eziliyor;
               asıl etkisi otomatik oynatmanın kapalı olduğu durumda (iOS Düşük
               Güç Modu, veri tasarrufu) görünüyor. AÇIK İŞ: hero videolarının
               sıkıştırılması — bu değişiklikten önce de vardı, ayrı bir iş. */
            preload="auto"
            className="h-full w-full object-cover"
            aria-label={`${brand.name} tanıtım videosu`}
          />
        ) : (
          <Image
            src={brand.hero.src}
            alt={`${brand.name} — ${brand.headline}`}
            width={1920}
            height={1000}
            priority
            className="h-full w-full object-cover"
            /* 🔴 `md:` ÜSTÜNDE `100vw` YANLIŞ OLUR: `object-cover` görseli
               artık EKRAN YÜKSEKLİĞİNE göre büyütüyor, yani çizilen genişlik
               pencere genişliğini aşıyor (2400x760'lık Tyre Supply banner'ı
               1440x900 pencerede 2842 piksele yayılıyor). Next indirilecek
               dosyayı `sizes`e bakarak seçtiği için 100vw diyip geçmek çok
               küçük dosya indirtiyor ve görsel bulanıklaşıyordu (denetimde
               ölçüldü: telefonda ~6,7 kat büyütme). En büyük hero kaynağımız
               2400 piksel; onun üstünü istemenin faydası yok. */
            sizes="(min-width: 768px) 2400px, 100vw"
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/70 to-transparent pb-8 pt-24">
          <div className="mx-auto flex max-w-[1440px] justify-end px-5 md:px-10">
            {/* KADEMELİ (2026-09-07): hero üzerindeki hizmet listesi hiç
                animasyon almıyordu, görselle birlikte bir anda beliriyordu. */}
            <Stagger
              as="ul"
              className="text-right text-[12px] uppercase tracking-[0.14em] text-white/85 md:text-sm"
            >
              {brand.services.map((s) => (
                <StaggerItem as="li" key={s}>
                  {s}
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ── Başlık + tanıtım ── */}
      <section className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 md:grid-cols-2 md:gap-20 md:px-10 md:py-24">
        <Reveal mask>
          <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-navy md:text-[64px]">
            {brand.headline}
          </h1>
          {/* Tema deseni (arpeggio /work/velocity-motors): büyük tanıtım
              başlığının hemen altında, aynı sol hizada, ~2/3 puntoda marka
              adı ikinci başlık olarak yer alır (temada 84px başlık → 56px ad).
              Ekip notu: "MasterCard'ı Velocity Motors gibi yazalım —
              yer ve başlık benzerliği olarak" (2026-08-15 teyidi). */}
          <p className="mt-6 text-2xl font-bold leading-tight tracking-tight text-navy md:mt-8 md:text-[44px]">
            {brand.name}
          </p>
          {brand.subheadline && (
            <p className="mt-4 text-lg text-navy/60">{brand.subheadline}</p>
          )}
        </Reveal>
        <Stagger className="flex flex-col gap-6 text-lg leading-relaxed text-navy/75">
          {brand.intro.split("\n\n").map((p, i) => (
            <StaggerItem key={i}>
              <p>{p}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ── Operasyon Detayları ──
          Gri fon (ekip notu 2026-08-14: "2 alanın da fonu beyaz kalmış, bir
          alanın arka tarafı gri olmalı"): üstteki tanıtım metni beyaz kalır,
          bu alan gri olur. Gri fon ayıracın kendisi olduğu için üstteki ince
          çizgi kaldırıldı. */}
      <div className="bg-mist">
        <section className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 md:grid-cols-2 md:gap-20 md:px-10 md:py-24">
          <Reveal mask>
            <h2 className="text-2xl font-bold tracking-tight text-navy md:text-[48px]">
              Operasyon Detayları
            </h2>
          </Reveal>
          {/* Tanım listesi satır satır giriyor; <dl>/<div>/<dt>/<dd> yapısı korunuyor. */}
          <Stagger as="dl" className="flex flex-col">
            {[
              ["Müşteri", brand.meta.musteri],
              // Ekip teyidi beklenen tarihte satır BOŞ bırakılır ve aşağıdaki
              // filtre onu tamamen eler — yer tutucu değeri ekranda "gerçek"
              // gibi göstermemek için (security-auditor bulgusu, 2026-08-31).
              ["Operasyon Tarihi", brand.tarihTeyitsiz ? "" : brand.meta.tarih],
              ["Operasyon Süresi", brand.meta.sure],
              ["Proje", brand.meta.proje.join("\n")],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <StaggerItem
                  key={k}
                  className="flex flex-col gap-1 border-b hairline py-5 md:flex-row md:justify-between md:gap-8"
                >
                  <dt className="text-[12px] uppercase tracking-[0.18em] text-navy/40">
                    {k}
                  </dt>
                  <dd className="whitespace-pre-line text-right text-base text-navy md:text-lg">
                    {v}
                  </dd>
                </StaggerItem>
              ))}
          </Stagger>
        </section>
      </div>

      {/* ── Galeri ── */}
      {brand.gallery && (
        <section className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 pb-20 pt-20 md:px-10 md:pb-24 md:pt-24">
          {brand.gallery.map((g, i) => {
            if (g.kind === "image")
              return (
                <Reveal key={i}>
                  <Image
                    src={g.src}
                    alt={`${brand.name} çalışması ${i + 1}`}
                    width={1920}
                    height={1080}
                    className="h-auto w-full"
                    sizes="100vw"
                  />
                </Reveal>
              );
            if (g.kind === "video")
              return (
                <Reveal key={i}>
                  {/*
                   * 🔊 `muted` BİLEREK YOK (2026-09-07, Yakup: "videolarda ses
                   * yokmuydu hiç birinin sesi yok, özellikle portfolyo").
                   *
                   * Sitedeki TEK oynat-butonlu oynatıcı bu. Buraya gelen kurumsal
                   * filmin (Bardahl) ses kanalı var ama `controls` ile birlikte
                   * `muted` de yazıldığı için izleyici oynat'a bastığında film
                   * sessiz açılıyor, sesi ayrıca açması gerekiyordu.
                   *
                   * `muted` yalnızca OTOMATİK oynatma için zorunludur (tarayıcı
                   * politikası). Burada `autoPlay` yok — kullanıcı kendi basıyor,
                   * yani susturmanın hiçbir teknik gerekçesi yoktu.
                   *
                   * Galeride otomatik dönen dekoratif videolar (`grid`/`tri`)
                   * `autoPlay muted loop` olarak KALIR; onlarda `muted` zorunlu.
                   */}
                  {/*
                    width/height + h-auto: öznitelik yokken kutu, metadata
                    inene kadar tarayıcının SABİT 300x150 varsayılanında
                    duruyor, sonra videonun gerçek oranına sıçrıyordu —
                    masaüstünde (1360px kolon) 150px → 765px, yani ~615px
                    zıplama. `h-auto` şart: `height` özniteliği sunum ipucu
                    olarak yüksekliği çivileyip videoyu letterbox'lıyor.

                    Ölçüyü POSTER'den okuyoruz (`g.poster ?? g.src`), çünkü
                    poster videonun oranını birebir taşır. `g.src` verilseydi
                    `gorselOlcu` posteri İSİMDEN tahmin ederdi
                    ("x.mp4" → "x-poster.jpg") ve Bardahl gibi posteri farklı
                    adlanan markalarda sessizce 16:9 varsayılanına düşerdi —
                    bugün oran tuttuğu için fark edilmezdi, ilk dikey videoda
                    zıplama geri gelirdi.
                  */}
                  <video
                    src={g.src}
                    poster={g.poster}
                    width={gorselOlcu(g.poster ?? g.src).width}
                    height={gorselOlcu(g.poster ?? g.src).height}
                    controls
                    playsInline
                    preload="metadata"
                    className="h-auto w-full"
                    aria-label={`${brand.name} video çalışması`}
                  />
                </Reveal>
              );
            // Eşit kutulu grid (döküman: Atlantis 2'li, Sua 2'li, Utkan 3'lü)
            if (g.kind === "grid")
              return (
                <div
                  key={i}
                  className={`grid gap-6 ${
                    g.cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
                  }`}
                >
                  {g.items.map((it, j) => (
                    <Reveal key={it.src} delay={0.04 * (j % g.cols)}>
                      <div className="overflow-hidden">
                        {it.type === "video" ? (
                          <video
                            src={it.src}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="aspect-[4/5] w-full object-cover"
                            aria-label={`${brand.name} video çalışması ${j + 1}`}
                          />
                        ) : (
                          <Image
                            src={it.src}
                            alt={`${brand.name} çalışması ${j + 1}`}
                            width={1080}
                            height={1350}
                            className="aspect-[4/5] w-full object-cover"
                            sizes={
                              g.cols === 3
                                ? "(min-width: 768px) 33vw, 100vw"
                                : "(min-width: 768px) 50vw, 100vw"
                            }
                          />
                        )}
                      </div>
                    </Reveal>
                  ))}
                </div>
              );
            /* Üçlü grid: uzun alan bir yanda, iki yatay diğer yanda.
               DÜZELTME (2026-08-31): kutular görsele SABİT oran dayatıyordu
               (sol dikey, sağ 16:9) ve object-cover görselin içindeki yazıyı
               kesiyordu — Bardahl'da %42, My Nova'da %60 kayıp. Artık her
               görsel kendi gerçek oranıyla çiziliyor: ne kırpma var ne boş
               bant. Ölçüler derleme anında dosyadan okunuyor (lib/gorsel.ts). */
            // Video da dahil: ölçü videonun poster karesinden okunuyor.
            const solOlcu = gorselOlcu(g.left.src);
            const ustOlcu = gorselOlcu(g.rightTop);
            const altOlcu = gorselOlcu(g.rightBottom);

            /* Kolon genişliği görsellerin GERÇEK oranından hesaplanır, böylece
               iki kolon aynı yükseklikte biter — kırpma da yok, boşluk da.
               Türetme: solYükseklik = solGenişlik / solOran,
               sağYükseklik = sağGenişlik × (1/üstOran + 1/altOran).
               İkisini eşitleyip solPay = solOran×k / (1 + solOran×k) çıkar.
               (Dikey boşluk ihmal edilir — etkisi birkaç piksel.) */
            const solOran = solOlcu.width / solOlcu.height;
            const k =
              ustOlcu.height / ustOlcu.width + altOlcu.height / altOlcu.width;
            const solPay = (solOran * k) / (1 + solOran * k);

            /*
             * 🔴 `flip` GENİŞLİKLERİ DE ÇEVİRMEK ZORUNDA.
             * `solPay` her zaman UZUN ALANIN (tall) payıdır. Aşağıda `flip`
             * true iken kolonların SIRASI değişiyordu ama `--sol`/`--sag`
             * değerleri olduğu gibi kalıyordu: dolayısıyla sol kolona (artık
             * `pair`) uzun alanın payı, sağ kolona (artık `tall`) çiftin payı
             * gidiyordu — tam ters.
             *
             * ÖLÇÜLEN SONUÇ (canlı, /portfolyo/my-nova, 1440px, 2026-09-11):
             *   sol kolon (2 görsel) → 891px geniş, 2543px yüksek
             *   sağ kolon (1 görsel) → 445px geniş,  630px yüksek
             *   yani iki kolon 1913px HİZASIZ.
             * Revize dökümanı bunu şöyle tarif etmiş: "Bu alanda soldaki ikili
             * alan çok dar kalmış. Sağdaki alan aşağıya uzayıp gidiyor,
             * soldakiler yarıda kesiliyor. Onlar da uzatılmalı ve sağdakinin
             * bitişiyle HİZALANMALI."
             *
             * Hesabın tamamı zaten "iki kolon aynı yükseklikte bitsin" diye
             * kurulmuştu; tek eksik payların da yer değiştirmesiydi.
             */
            const ilkKolonPayi = g.flip ? 1 - solPay : solPay;
            const tall = (
              <div className="overflow-hidden">
                {g.left.type === "video" ? (
                  <video
                    src={g.left.src}
                    poster={g.left.src.replace(/\.mp4$/, "-poster.jpg")}
                    width={solOlcu.width}
                    height={solOlcu.height}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-auto w-full"
                    aria-label={`${brand.name} dikey video`}
                  />
                ) : (
                  <Image
                    src={g.left.src}
                    alt={`${brand.name} görseli`}
                    width={solOlcu.width}
                    height={solOlcu.height}
                    className="h-auto w-full"
                    sizes="(min-width: 768px) 40vw, 100vw"
                  />
                )}
              </div>
            );
            const pair = (
              <div className="flex flex-col gap-6">
                {[g.rightTop, g.rightBottom].map((src) => {
                  const olcu = gorselOlcu(src);
                  return (
                    <div key={src} className="overflow-hidden">
                      <Image
                        src={src}
                        alt={`${brand.name} görseli`}
                        width={olcu.width}
                        height={olcu.height}
                        className="h-auto w-full"
                        sizes="(min-width: 768px) 60vw, 100vw"
                      />
                    </div>
                  );
                })}
              </div>
            );
            return (
              <Reveal key={i}>
                {/* items-start: kolonlar birbirine esnetilMEZ. Esnetilince sol
                    görsel sağ çiftin yüksekliğine zorlanıp kırpılıyordu. */}
                <div
                  className="grid items-start gap-6 md:grid-cols-[var(--sol)_var(--sag)]"
                  style={
                    {
                      "--sol": `${(ilkKolonPayi * 100).toFixed(2)}fr`,
                      "--sag": `${((1 - ilkKolonPayi) * 100).toFixed(2)}fr`,
                    } as React.CSSProperties
                  }
                >
                  {g.flip ? (
                    <>
                      {pair}
                      {tall}
                    </>
                  ) : (
                    <>
                      {tall}
                      {pair}
                    </>
                  )}
                </div>
              </Reveal>
            );
          })}
        </section>
      )}

      {/* ── Performance Results (yalnız veri verilen markalarda) ── */}
      {brand.results && (
        <section className="mx-auto max-w-[1440px] px-5 pb-20 md:px-10 md:pb-24">
          <div className="grid gap-12 border-t hairline pt-16 md:grid-cols-3">
            {brand.results.map((r, i) => (
              <Reveal key={r.value} delay={0.06 * i}>
                <h3 className="text-5xl font-bold tracking-tight text-navy md:text-[96px]">
                  <CountUp value={r.value} />
                </h3>
                <p className="mt-3 text-base leading-relaxed text-navy/60">
                  {r.label}
                </p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── More Projects ── */}
      <section className="mx-auto max-w-[1440px] border-t hairline px-5 py-20 md:px-10 md:py-24">
        <Reveal mask>
          <h2 className="text-3xl font-bold tracking-tight text-navy md:text-[64px]">
            Diğer Projeler
          </h2>
        </Reveal>
        {/* ── DİĞER PROJELER — MASTER /work/velocity-motors DÜZENİ ──────
            Revize dökümanı: "Diğer projeleri gördüğümüz bu alan yukarıdaki gibi
            olmayacak, aşağıdaki örnekteki gibi olmalı" +
            https://arpeggio.framer.website/work/velocity-motors#top

            MASTER ÖLÇÜMÜ (1440px, canlı): o sayfadaki "More Projects" alanı
            DÖRT kart, hepsi 1440x800 ve TAM GENİŞLİK, art arda (mutlak y =
            13645 / 14445 / 15245 / 16045, yani tam 800'er — aralarında boşluk
            yok). Üç sütunlu küçük kart ızgarası değil.

            ÖNCEKİ HÂLİMİZ: 3 sütunlu 4/5 kartlar; marka adı görselde, hizmet
            ve yıl KARTIN ALTINDA çizgiyle ayrılmış bir satırdaydı — dökümanın
            portfolyo listesi için "iptal edilecek" dediği yerleşimin aynısı.

            Artık `PortfolyoKart` (yatay biçim): liste sayfasıyla aynı bileşen,
            yani sektör/tarih/isim/hizmet dörtlüsü, sabit ayraç çizgisi,
            üzerine gelince bulanıklık + iç detay yazısı hepsi aynı davranıyor. */}
        <div className="mt-12 flex flex-col">
          {others.map((b) => (
            <Reveal key={b.slug}>
              <PortfolyoKart marka={b} genis />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Kapanış — marka detaylarında referans logo bandı YOK (ekip notu) ── */}
      <KapanisSection withRefLogos={false} />
    </>
  );
}
