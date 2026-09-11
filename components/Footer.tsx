import Image from "next/image";
import Link from "next/link";
import BasaDon from "@/components/BasaDon";
import LiveClock from "@/components/LiveClock";
import NewsletterForm from "@/components/NewsletterForm";
import { SERVICES } from "@/content/services";
import { NAV, PARTNER_LOGOLARI, PHONE_READY, SITE } from "@/content/site";

/**
 * Footer — referans temanın (arpeggio) üç katlı 12 kolonlu düzeni.
 *
 * NEDEN YENİDEN KURULDU (2026-09-02, Yakup: "referans olan bizimki ile alakası yok"):
 * Eski footer, referansın footer'ı değil ayrı bir "newsletter bölümü"ydü — 96px'lik
 * "Birlikte çalışalım?" başlığı, her sayfanın zaten ClosingCta/KapanisSection ile
 * biten kurgusunun üstüne ÜÇÜNCÜ bir çağrı koyuyordu. Referansta newsletter
 * footer'ın içinde küçük bir bloktur; footer'ı açan şey dev marka yazısıdır.
 *
 * Katlar:
 *  1) dev marka yazısı + slogan  |  konum + canlı saat + saat dilimi
 *  2) menü + hizmetler  |  bülten  |  oklu iletişim satırları
 *  3) ofis/adres/telefon  |  künye  |  telif  |  başa dön
 *
 * EKSİK BİLGİ (ekipten bekleniyor — geldiğinde buraya eklenecek):
 *  - Çalışma saatleri: referanstaki "Online/Offline" rozetinin karşılığı. Uydurma
 *    saat yazmak yerine rozet hiç basılmadı (bkz. CLAUDE.md "uydurma veri yazılmaz").
 *  - Ticari unvan / vergi dairesi / sicil no: künye satırı bunlar gelince tamamlanacak.
 *  - KVKK / Gizlilik Politikası sayfası: sayfa açılınca ikinci menü kolonuna girecek.
 */
export default function Footer() {
  // DİKKAT: site statik üretiliyor, bu yıl DERLEME anında donuyor. 1 Ocak'ta
  // yeniden deploy edilmezse eski yılı gösterir. (Eski footer'da da böyleydi.)
  const yil = new Date().getFullYear();

  // `dis` (yeni sekme) elle işaretlenmiyor, adresten türetiliyor: elle tutulan
  // her bayrak yanlış işaretlenebilir (mailto'ya target="_blank" boş sekme açar).
  const iletisimSatirlari = [
    { ad: "WhatsApp", href: SITE.whatsapp, aktif: PHONE_READY },
    { ad: "Instagram", href: SITE.instagram, aktif: true },
    { ad: "LinkedIn", href: SITE.linkedin, aktif: true },
    { ad: "E-posta", href: `mailto:${SITE.email}`, aktif: true },
    { ad: "Telefon", href: `tel:${SITE.phone}`, aktif: PHONE_READY },
  ]
    .filter((s) => s.aktif)
    .map((s) => ({ ...s, dis: s.href.startsWith("http") }));

  return (
    <footer className="bg-paper">
      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-24 md:px-10">
        {/* ——— 1. KAT: marka + konum/saat ——— */}
        <div className="grid gap-12 border-b hairline pb-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {/*
              Dev marka yazısı. Referansta bu canlı metindir (18vw); bizde marka
              işareti çizilmiş bir harf ailesi olduğu için görsel kullanılıyor.
              SVG: tellers-logo-tight.png'den vektöre çevrildi (2026-09-02) —
              775px'lik PNG bu boyutta bulanıklaşıyordu.
            */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo/tellers-logo.svg"
              alt="tellers"
              width={775}
              height={225}
              loading="lazy"
              decoding="async"
              className="w-full max-w-[860px]"
            />
            <p className="mt-6 font-didot text-[clamp(24px,3vw,44px)] italic leading-tight text-navy">
              {SITE.slogan}
            </p>
          </div>

          <div className="flex flex-col justify-end lg:col-span-4">
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-2 inline-block h-3 w-3 rounded-full bg-navy"
              />
              <div>
                <p className="text-[17px] font-medium leading-relaxed text-navy">
                  {SITE.konumCumlesi}
                </p>
                <span className="mt-3 block text-[34px] font-bold tracking-tight text-navy">
                  <LiveClock bicim="saat" />
                </span>
                <p className="mt-2 flex items-center gap-2 text-[13px] text-navy/55">
                  <span
                    aria-hidden="true"
                    className="inline-block h-2 w-2 shrink-0 rounded-full border border-navy/40"
                  />
                  <LiveClock bicim="tarih" /> · GMT+3
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ——— 2. KAT: menü + bülten + iletişim ———
            Master temanın footer'ı (2026-09-10, Yakup'un ekran kaydından
            ölçüldü): dört blok DİKEY ÇİZGİLERLE ayrılmış, aralarında boşluk
            yok, ve bülten sütunu AÇIK GRİ bir panelin üstünde duruyor.
            Bizde `gap-14` ile ayrık bloklar vardı ve bülten sütununun zemini
            beyazdı. Boşluk kaldırıldı, çizgi ve panel geldi.
            `lg:` altında (telefon/tablet) dikey çizgi yok — orada bloklar alt
            alta iniyor ve dikey çizgi anlamsız olurdu; onun yerine boşluk. */}
        <div className="grid gap-14 border-b hairline lg:grid-cols-12 lg:gap-0">
          <nav
            aria-label="Footer menü"
            className="grid grid-cols-2 gap-x-10 gap-y-3 py-16 lg:col-span-5 lg:pr-10"
          >
            <ul className="space-y-3 text-[16px] font-medium text-navy">
              {/* `py-1.5 -my-1.5`: GÖRÜNÜM DEĞİL DOKUNMA HEDEFİ. Canlıda
                  ölçüldü (390px telefon): footer bağlantıları 16 piksel
                  yüksekliğindeydi — WCAG 2.5.8'in 24 piksellik asgarisinin
                  altında, parmakla yanlış satıra basılıyordu. Dolgu kutuyu
                  28 piksele çıkarıyor, negatif dış boşluk yerleşimi geri
                  alıyor: sayfada hiçbir şey kaymıyor. `inline-block` şart,
                  satır içi öğede dikey dolgu kutuyu büyütmez. */}
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-grow -my-1.5 inline-block py-1.5 transition-colors duration-500 ease-[var(--ease-lux)] hover:text-navy"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-3 text-[16px] text-navy/65">
              {/* ÇAPA KALDIRILDI (2026-09-07, Yakup: "menüde bir alana
                  tıkladığım zaman ilgili sayfanın sonunu açıyor, başa getirip
                  açmıyor").
                  2026-09-02'de bu linkleri `/hizmetlerimiz#slug` yapmıştım;
                  niyet "kullanıcı doğrudan ilgili bölüme düşsün"dü. Gerçekte
                  sayfa ortasından/sonundan açılıyordu — ölçüldü: son hizmetin
                  çapası sayfayı %42'sinden açıyordu. Menüden tıklayan kişi
                  sayfanın BAŞINI bekler. Çapa kalktı, dördü de sayfa başına
                  gidiyor. */}
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href="/hizmetlerimiz"
                    className="link-grow -my-1.5 inline-block py-1.5 transition-colors duration-500 ease-[var(--ease-lux)] hover:text-navy"
                  >
                    {s.titleTr}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Başlık <h2> DEĞİL <p>: footer her sayfada basılıyor, global bir
              <h2> her sayfanın başlık ağacına girip sayfanın kendi başlıklarıyla
              yarışırdı (GEO'da zayıflatıcı sinyal). */}
          <div
            aria-labelledby="bulten-basligi"
            className="py-16 lg:col-span-4 lg:border-l hairline lg:bg-mist lg:px-10"
          >
            {/* METİNLER EKİPTEN, BİREBİR (2026-09-10) — revize dökümanı:
                "Gelişmelerden haberdar olun yazmayacağız. Buradaki alan için
                metinler ve tipografik tasarım aşağıdadır." (footer_newslatter.png)
                Görsel GÖMÜLMEDİ, metin olarak yazıldı: dökümanın kendisi "direkt
                görsel eklenebilir ya da aynısı yazılabilir" diyor ve yazı
                hâlinde arama motoru okuyabiliyor, ölçekleniyor, bulanıklaşmıyor.

                PUNTOLAR master temanın footer bülten bloğundan ölçüldü
                (arpeggio.framer.website: "Stay in the Loop" 48px/500, alt metin
                19px/500, küçük not 15px/400). Eski hâli 21px/700 idi. */}
            <p id="bulten-basligi" className="t-kucuk text-navy">
              Birlikte çalışalım?
            </p>
            <p className="mt-4 text-[17px] leading-snug text-navy/70 md:text-[19px]">
              Sorularınız, iş birlikleri ve yeni projeler için{" "}
              <em className="font-didot font-normal italic">bir e-posta</em>{" "}
              uzağınızdayız.
            </p>
            <p className="mt-4 text-[14px] leading-relaxed text-navy/55 md:text-[15px]">
              Gelen kutunuza saygı duyuyoruz. Spam yok,{" "}
              <em className="font-didot font-normal italic">
                hızlı ve doğrudan geri dönüş
              </em>{" "}
              var.
            </p>
            <NewsletterForm />
          </div>

          <ul
            aria-label="İletişim kanalları"
            className="lg:col-span-3 lg:border-l hairline lg:pl-10"
          >
            {iletisimSatirlari.map((s) => (
              <li key={s.ad} className="border-b hairline">
                <a
                  href={s.href}
                  target={s.dis ? "_blank" : undefined}
                  rel={s.dis ? "noopener noreferrer" : undefined}
                  className="arrow-link flex items-center justify-between py-4 text-[16px] font-medium text-navy/75 transition-colors duration-500 ease-[var(--ease-lux)] hover:text-navy"
                >
                  {s.ad}
                  <span aria-hidden="true" className="arrow">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ——— 3. KAT: ofis, künye, telif, başa dön ——— */}
        <div className="grid gap-10 pt-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-4">
            <p className="text-[12px] uppercase tracking-[0.2em] text-navy/45">
              Ofis
            </p>
            {/* Adres parçalardan kuruluyor: tek satırlık SITE.address dar kolonda
                6 satıra bölünüyordu. Kaynak yine content/site.ts (JSON-LD ile aynı). */}
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-[15px] leading-relaxed text-navy/65 transition-colors duration-500 ease-[var(--ease-lux)] hover:text-navy"
            >
              {SITE.adres.sokak}
              <br />
              {SITE.adres.ilce} / {SITE.adres.il}
            </a>
            {PHONE_READY && (
              <a
                href={`tel:${SITE.phone}`}
                className="mt-4 block text-[26px] font-bold tracking-tight text-navy"
              >
                {SITE.phoneDisplay}
              </a>
            )}
            {/* Adres METİN olarak da duruyor: yukarıdaki liste "E-posta" diye
                etiketli, kopyalamak isteyen insan adresi göremiyordu. */}
            <a
              href={`mailto:${SITE.email}`}
              className="link-sweep mt-2 text-[15px] text-navy/65 transition-colors duration-500 ease-[var(--ease-lux)] hover:text-navy"
            >
              {SITE.email}
            </a>
          </div>

          <p className="text-[13px] leading-relaxed text-navy/55 lg:col-span-3">
            {SITE.kunyeCumlesi}
          </p>

          <p className="text-[13px] leading-relaxed text-navy/55 lg:col-span-3">
            © {yil} tellers — Tüm hakları saklıdır.
          </p>

          <div className="lg:col-span-2 lg:text-right">
            <BasaDon />
          </div>
        </div>

        {/* ——— SERTİFİKA / PARTNERLİK ROZETLERİ ———
            Revize dökümanı: "Bu alana sertifikalarımızı ve partnerlik
            logolarını ekleyeceğiz, sağ boş alt alana ekleyelim. Küçük ikonlar,
            minimal gibi."
            Liste `content/site.ts` → `PARTNER_LOGOLARI`. Boşken bu blok HİÇ
            basılmaz — eksik dosyaya 404 attırmamak için. Gerekçe (rozetin bir
            iddia olması) o listenin başında yazılı. */}
        {PARTNER_LOGOLARI.length > 0 && (
          <ul
            aria-label="Sertifikalarımız ve partnerliklerimiz"
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5 border-t hairline pt-8 lg:justify-end"
          >
            {PARTNER_LOGOLARI.map((l) => (
              <li key={l.file}>
                <Image
                  src={`/assets/partners/${l.file}.png`}
                  alt={l.name}
                  width={l.w}
                  height={l.h}
                  /* 🟠 GOOGLE ROZETLERİNİN ALT YAZISI BU ÖLÇÜDE OKUNMUYOR
                     (denetimde gerçek boyutta render edilip ölçüldü: "Google
                     Partner" / "Google Cloud Partner" alt yazısı ~4 piksel
                     çıkıyor, gri leke gibi duruyor). Sebep yapısal: o ikisi
                     DİKEY kilit (ikon üstte, yazı altta), diğer üçü yatay;
                     yüksekliğe göre hizalanınca dikey olanın yazısı yok oluyor.
                     Yükseklik 24→32 pikselle biraz iyileşiyor ama asıl çözüm
                     ekipten YATAY (lockup) sürümleri istemek. AÇIK İŞ.
                     Kommo rozeti de diğer dördünden farklı olarak çerçeveli bir
                     kutu — markanın resmî rozet tasarımı böyle, dokunulmadı. */
                  className="h-8 w-auto max-w-[110px] object-contain opacity-60 transition-opacity duration-500 ease-[var(--ease-lux)] hover:opacity-100 md:h-9"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  );
}
