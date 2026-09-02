import Link from "next/link";
import BasaDon from "@/components/BasaDon";
import LiveClock from "@/components/LiveClock";
import NewsletterForm from "@/components/NewsletterForm";
import { SERVICES } from "@/content/services";
import { NAV, PHONE_READY, SITE } from "@/content/site";

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

        {/* ——— 2. KAT: menü + bülten + iletişim ——— */}
        <div className="grid gap-14 border-b hairline py-16 lg:grid-cols-12">
          <nav
            aria-label="Footer menü"
            className="grid grid-cols-2 gap-x-10 gap-y-3 lg:col-span-5"
          >
            <ul className="space-y-3 text-[16px] font-medium text-navy">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-sweep transition-colors duration-500 ease-[var(--ease-lux)] hover:text-navy"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-3 text-[16px] text-navy/65">
              {/* Hizmet linkleri artık kendi bölümlerine çapalanıyor
                  (/hizmetlerimiz#performans-pazarlama gibi) — hem kullanıcı
                  doğru yere düşüyor hem iç link sinyali hizmet adına gidiyor. */}
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/hizmetlerimiz#${s.slug}`}
                    className="link-sweep transition-colors duration-500 ease-[var(--ease-lux)] hover:text-navy"
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
          <div aria-labelledby="bulten-basligi" className="lg:col-span-4">
            <p
              id="bulten-basligi"
              className="text-[21px] font-bold tracking-tight text-navy"
            >
              Gelişmelerden haberdar olun
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-navy/65">
              Yeni işlerimizi, vaka çalışmalarımızı ve sektör okumalarımızı arada
              bir gelen kutunuza bırakıyoruz.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-navy/50">
              Gelen kutunuza saygı duyuyoruz. Spam yok, doğrudan geri dönüş var.
            </p>
            <NewsletterForm />
          </div>

          <ul aria-label="İletişim kanalları" className="lg:col-span-3">
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
      </div>
    </footer>
  );
}
