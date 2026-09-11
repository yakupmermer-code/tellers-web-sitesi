import Image from "next/image";
import Link from "next/link";
import type { Brand } from "@/content/brands";
import { ilkCumleler } from "@/lib/ozet";

/**
 * Portfolyo listesi kartı — master temanın (arpeggio.framer.website/work)
 * kart anatomisi.
 *
 * MASTER ÖLÇÜMÜ (1440px, canlı 2026-09-11):
 *   YATAY kart → 1360x622 (oran 2,19); ilk dördü böyle, ARALARINDA BOŞLUK YOK
 *   KARE kart  →  674x622 (oran 1,08); kalanlar 2 sütun, 12px ara
 *   metinler (kartın sol-üst köşesine göre):
 *     açıklama → sol 32 · üst 60  · 35px/500 · GİZLİ (üzerine gelince çıkar)
 *     sektör   → sol 56 · üst 439 · 19px/500
 *     tarih    → SAĞDA    · üst 440 · 17px/400
 *     isim     → sol 56 · üst 478 · 48px/500
 *     hizmet   → sol 56 · üst 535 · 21px/500
 *
 * Yakup 2026-09-11: "work kısmında ilk 3 kısım yatay, sonrası 2'li kare
 * şekilde aşağı ilerliyor ve mouse üzerine gelince bu yazılar ile beraber
 * yazıların ALTINDA ÇİZGİLER çıkıyor. Özellikle kare olanlarda mouse üzerine
 * gelince İÇ DETAY YAZILARI çıkıyor."
 *
 * 🔴 ÇİZGİLER VE HOVER DETAYI ÖLÇÜLEMEDİ: master'da fare kartın üzerindeyken
 * ölçüm alındı (`fareIcinde: true`) ama hiçbir değer değişmedi — tarayıcı
 * sekmesi arka planda olduğu için Framer'ın hover mantığı çalışmıyor. Bu iki
 * davranış Yakup'un tarifine göre kuruldu, master'dan ölçülerek değil.
 */
export default function PortfolyoKart({
  marka: b,
  /** true → 1360x622 yatay kart (listenin ilk üçü). false → 674x622 kare. */
  genis = false,
}: {
  marka: Brand;
  genis?: boolean;
}) {
  return (
    <Link
      href={`/portfolyo/${b.slug}`}
      data-imlec="İncele"
      aria-label={`${b.name} — ${b.listService}`}
      className={`group relative block overflow-hidden ${
        genis
          ? "aspect-[4/3] md:aspect-[1360/622]"
          : "aspect-[4/3] md:aspect-[674/622]"
      }`}
    >
      <Image
        src={b.banner}
        alt=""
        width={genis ? 1360 : 674}
        height={622}
        className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.03]"
        sizes={
          genis
            ? "(min-width: 1440px) 1360px, 100vw"
            : "(min-width: 1440px) 674px, (min-width: 768px) 47vw, 100vw"
        }
      />

      {/* "Banner alanları bu kadar açık olmayacak" — dökümanın açık isteği.
          Master'da da kart üzerinde koyu örtü var; bizde lacivert (marka
          kuralı). Üzerine gelince koyulaşıyor. */}
      <div className="pointer-events-none absolute inset-0 bg-navy/45 transition-colors duration-500 ease-[var(--ease-lux)] group-hover:bg-navy/65" />

      {/* ÜST — iç detay yazısı. Master'da boşta gizli, üzerine gelince çıkar.
          `hover-gizli` gizlemeyi ekran genişliğine değil FARE YETENEĞİNE
          bağlar; dokunmatikte hep açık (orada hover diye bir şey yok). */}
      <p
        className={`hover-gizli pointer-events-none absolute inset-x-6 top-6 font-medium leading-snug text-white md:inset-x-8 md:top-14 ${
          genis
            ? "line-clamp-3 text-[15px] md:text-[22px] xl:text-[35px] xl:leading-[1.2]"
            : "line-clamp-4 text-[14px] md:text-[17px] xl:text-[22px]"
        }`}
      >
        {ilkCumleler(b.intro, b.headline, genis ? 150 : 110)}
      </p>

      {/* ALT — sektör · tarih (sağda) · isim · hizmet. Master'da dördü de
          HEP GÖRÜNÜR. Üzerine gelince isim ve hizmetin ALTINDA çizgi çıkar
          (Yakup'un tarifi; master'da ölçülemedi). */}
      <div className="pointer-events-none absolute inset-x-6 bottom-6 md:inset-x-14 md:bottom-[52px]">
        <div className="flex items-baseline justify-between gap-4">
          <p
            className={`font-medium text-white/95 ${
              genis
                ? "text-[13px] md:text-[16px] xl:text-[19px]"
                : "text-[12px] md:text-[14px] xl:text-[17px]"
            }`}
          >
            {b.sektor}
          </p>
          {/* Ekip teyidi beklenen tarih hiç gösterilmez — dökümanda XXXX/??
              yazıyordu, yer tutucu değer ekranda "gerçek" gibi duruyordu
              (security-auditor bulgusu). */}
          <p
            className={`shrink-0 text-white ${
              genis
                ? "text-[12px] md:text-[15px] xl:text-[17px]"
                : "text-[11px] md:text-[13px] xl:text-[15px]"
            }`}
          >
            {b.tarihTeyitsiz ? "" : b.year}
          </p>
        </div>

        {/* `cizgi-hover`: boşta yok, üzerine gelince soldan sağa açılır.
            `app/globals.css` içinde tanımlı. */}
        <p
          className={`cizgi-hover mt-2 inline-block font-medium leading-[1.1] tracking-[-0.02em] text-white md:mt-3 ${
            genis
              ? "text-[24px] md:text-[34px] xl:text-[48px]"
              : "text-[20px] md:text-[26px] xl:text-[34px]"
          }`}
        >
          {b.name}
        </p>
        <p
          className={`cizgi-hover mt-1.5 inline-block font-medium text-white/95 ${
            genis
              ? "text-[13px] md:text-[17px] xl:text-[21px]"
              : "text-[12px] md:text-[15px] xl:text-[18px]"
          }`}
        >
          {b.listService}
        </p>
      </div>
    </Link>
  );
}
