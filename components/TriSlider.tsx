"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

type Item = { src: string; alt: string; href?: string };

/**
 * 3'lü grid mantığında dönen yatay slider (Hakkımızda referans işleri).
 *
 * 🔴 PANELLER DİKEY (2026-09-11). Ekip 11 Eylül dökümanında bu alanın ekran
 * görüntüsünü koyup "Burası kare gibi değil, aşağıdaki örnekteki gibi DİKEY
 * olmalı" demiş; örnek olarak master temanın About sayfasındaki 3'lü panel
 * ızgarasını göstermiş. Yakup 2026-09-11: "alttaki 3'lü alan örneği verilmiş
 * revize notunda, onu da aynen bırakmışsın."
 *
 * MASTER ÖLÇÜMÜ (arpeggio.framer.website/about, 1440x900, canlı):
 *   panel        413x750  → oran 0,55
 *   sütun arası  60 piksel
 *   kenar payı   40 piksel · toplam genişlik 1360
 * Bizde panel 437x547 → oran 0,80 idi, yani neredeyse kare.
 *
 * ⚠️ KAYNAK GÖRSELLER 942x1171 (oran 0,80). 0,55'e `object-cover` ile
 * oturunca genişliğin ~%31'i kırpılıyor. Marka kelime işaretleri ortada
 * olduğu için gözle kontrol edildi; yine de en temiz çözüm ekipten dikey
 * (oran ~0,55) kesimlerin gelmesi.
 * Dar ekranda 3/4 kullanılıyor: telefonda 0,55 panel ekrandan taşıyordu.
 *
 * 🔴 ORAN KIRILIMI `md:` — `sm:` DEĞİL (denetimde yakalandı, 2026-09-11).
 * Bir tur oran `sm:`de (640px), genişlik ise `md:`de (768px) değişiyordu;
 * arada kalan bantta "mobil genişlik + masaüstü oranı" birleşip panel ekrandan
 * taşıyordu. Ölçüldü: 700x900'de panel 595x1082 (ekranın 1,20 katı),
 * 667x375'te (iPhone yatay) 567x1031 — ekranın 2,75 katı. İkisi de `md:`.
 *
 * 🟠 OK ADIMI artık sabit 24 değil, gerçek `column-gap`i okuyor: boşluk
 * `md:`de 60 piksele çıktı, 4. bir öğe eklendiği gün sabit değer 36 piksel
 * yanlış kaydırırdı ve hiçbir uyarı çıkmazdı.
 */
export default function TriSlider({ items }: { items: Item[] }) {
  const track = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const bosluk = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    const w = card ? card.getBoundingClientRect().width + bosluk : 400;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  }

  return (
    <div>
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto md:gap-[60px] scroll-smooth px-5 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const img = (
            <Image
              src={item.src}
              alt={item.alt}
              width={760}
              height={950}
              className="aspect-[3/4] w-full object-cover md:aspect-[0.55] transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.03]"
              sizes="(min-width: 768px) 33vw, 85vw"
            />
          );
          return item.href ? (
            <Link
              key={item.src}
              href={item.href}
              data-card
              className="group w-[85vw] flex-none snap-start overflow-hidden md:w-[calc((100%-120px)/3)]"
            >
              {img}
            </Link>
          ) : (
            <div
              key={item.src}
              data-card
              className="group w-[85vw] flex-none snap-start overflow-hidden md:w-[calc((100%-120px)/3)]"
            >
              {img}
            </div>
          );
        })}
      </div>
      {/* Mobilde tek kart görünür → oklar hep lazım; masaüstünde 3'ten fazlaysa */}
      {items.length > 1 && (
        <div
          className={`mt-6 flex justify-end gap-3 px-5 md:px-10 ${
            items.length <= 3 ? "md:hidden" : ""
          }`}
        >
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Önceki"
            className="flex h-11 w-11 items-center justify-center rounded-full border hairline text-navy transition-colors duration-500 hover:bg-navy hover:text-white"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Sonraki"
            className="flex h-11 w-11 items-center justify-center rounded-full border hairline text-navy transition-colors duration-500 hover:bg-navy hover:text-white"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
