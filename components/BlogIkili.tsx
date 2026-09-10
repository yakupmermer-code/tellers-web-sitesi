"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BLOGS } from "@/content/blogs";
import { ilkCumleler } from "@/lib/ozet";

/**
 * Ana sayfa blog alanı — İKİLİ, sürekli dönen kartlar.
 *
 * Revize dökümanı (2026-09-10): "Blog alanı tamamen yanlış, mevcuttaki temada
 * yer alan kullanımdan ilerleyeceğiz. Mouse ile dokunduğumuzda tarih, konu
 * başlığı, seo odaklı kategorizesel atama ve blog içeriğinin ilk cümleleri
 * ekranda çıkacak. 2'li olarak yerleştireceğiz, sürekli döner ve değişir."
 *
 * MASTER TEMA ÖLÇÜMÜ (arpeggio.framer.website ana sayfa, 1440px):
 *   kart 660x500 → oran 1,32 · iki sütun, x=40 ve x=740 → 40px ara
 *
 * `components/BlogSlider.tsx` (eski 4'lü yatay slider) SİLİNMEDİ —
 * hizmetlerimiz sayfası hâlâ onu kullanıyor.
 */

/** Kaç ms'de bir sonraki ikiliye geçiyor. */
const DONME_SURESI = 7000;

/** Aynı anda kaç kart gösteriliyor. */
const ADIM = 2;

export default function BlogIkili() {
  const [ilk, setIlk] = useState(0);
  const [durdu, setDurdu] = useState(false);
  const [kullaniciDurdurdu, setKullaniciDurdurdu] = useState(false);
  const [gorunur, setGorunur] = useState(false);
  const kok = useRef<HTMLDivElement>(null);

  /*
   * SAYAÇ BÖLÜM EKRANA GİRİNCE BAŞLAR.
   * Bir tur mount anında başlıyordu; oysa blog bölümü ana sayfanın 13.300.
   * pikselinde, yani ~15 ekran aşağıda. Gerçek ziyaretçi oraya inene kadar
   * karusel 4-10 kez dönmüş oluyordu ve EN YENİ iki yazı pratikte hiç "ilk
   * görünen" olmuyordu (denetimde ölçüldü). Projede bu iş için zaten
   * `components/motion.ts` → `GORUNUR` kalıbı var; buradaki eşik de onunla
   * aynı mantıkta.
   */
  useEffect(() => {
    const el = kok.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setGorunur(true);
      return;
    }
    const g = new IntersectionObserver(
      ([giris]) => setGorunur(giris.isIntersecting),
      { rootMargin: "0px 0px -10% 0px" },
    );
    g.observe(el);
    return () => g.disconnect();
  }, []);

  /*
   * `ilk` BAĞIMLILIKTA — göstergeye basınca sayaç SIFIRLANIR.
   * Bir tur bağımlılıkta yoktu ve kullanıcının açık seçimi 466 ms sonra
   * zamanlayıcı tarafından sessizce geri alınabiliyordu (denetimde deterministik
   * olarak üretildi).
   */
  useEffect(() => {
    if (durdu || kullaniciDurdurdu || !gorunur) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setIlk((i) => (i + ADIM) % BLOGS.length),
      DONME_SURESI,
    );
    return () => window.clearInterval(id);
  }, [durdu, kullaniciDurdurdu, gorunur, ilk]);

  /*
   * SIRADAKİ İKİLİYİ ÖNDEN İNDİR. Yavaş bağlantıda her dönüşten sonra iki kart
   * da 4,1 saniye BOŞ kalıyordu — 7 saniyelik pencerenin yarıdan fazlası
   * (denetimde 400 kbps altında ölçüldü). Tarayıcı önbelleğine önceden
   * çekilince geçiş anında doluyor.
   */
  useEffect(() => {
    for (let k = ADIM; k < ADIM * 2; k++) {
      const b = BLOGS[(ilk + k) % BLOGS.length];
      if (b) new window.Image().src = b.image;
    }
  }, [ilk]);

  const gorunenler = Array.from(
    { length: ADIM },
    (_, k) => BLOGS[(ilk + k) % BLOGS.length],
  );
  /*
   * Gösterge sayısı ADIM'a göre değil, GERÇEK duraklara göre.
   * `BLOGS.length` tek sayı olursa `(i+2) % n` bütün indeksleri geziyor (hiçbir
   * yazı atlanmıyor) ama duraklar 2'şer değil n tane oluyor. `ceil(n/2)` nokta
   * basmak o durumda YALAN söylüyordu: 4 nokta iki farklı ikiliyi temsil
   * ediyor, 4 ikiliye tıklayarak hiç ulaşılamıyordu (denetimde simüle edildi).
   */
  const duraklar =
    BLOGS.length % ADIM === 0 ? BLOGS.length / ADIM : BLOGS.length;
  const aktifDurak = BLOGS.length % ADIM === 0 ? ilk / ADIM : ilk;

  // İki karta bölünemeyecek kadar az yazı varsa karusel anlamsız.
  if (BLOGS.length < ADIM) return null;

  return (
    <div
      ref={kok}
      // Üzerine gelince / klavyeyle odaklanınca dönme durur: okumaya başlayanın
      // altından kart kaymasın.
      onMouseEnter={() => setDurdu(true)}
      onMouseLeave={() => setDurdu(false)}
      onFocusCapture={() => setDurdu(true)}
      onBlurCapture={() => setDurdu(false)}
    >
      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        {gorunenler.map((b, konum) => (
          <Link
            /*
             * ANAHTAR SLOTA BAĞLI, YAZIYA DEĞİL. `key={b.slug}` olsaydı her
             * dönüşte React `<Link>`i söküp yeniden takar, yeni bir `<img>`
             * doğar ve görsel sıfırdan inerdi. Slot sabit kalınca yalnız `src`
             * değişiyor; tarayıcı önbellekteki dosyayı anında basıyor.
             */
            key={konum}
            href={`/blog/${b.slug}`}
            aria-label={`${b.title} — yazıyı oku`}
            className="group relative block aspect-[4/3] overflow-hidden"
          >
            <Image
              src={b.image}
              alt=""
              width={1320}
              height={1000}
              sizes="(min-width: 1440px) 660px, (min-width: 768px) 46vw, 100vw"
              className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.03]"
            />

            {/* DURAĞAN HÂL — yalnız başlık. Telefonda GÖSTERİLMEZ: orada hover
                diye bir şey yok, aşağıdaki bilgi katmanı zaten hep açık. */}
            <div className="pointer-events-none absolute inset-0 hidden transition-opacity duration-500 ease-[var(--ease-lux)] group-hover:opacity-0 group-focus-visible:opacity-0 md:block">
              <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-navy/85 to-transparent" />
              <p className="absolute inset-x-0 bottom-0 px-6 pb-7 text-[17px] font-medium leading-[1.2] tracking-[-0.02em] text-white md:px-8 md:pb-8 md:text-[20px] lg:text-[24px]">
                {b.title}
              </p>
            </div>

            {/* DÖKÜMANIN SAYDIĞI DÖRT ŞEY: tarih, konu başlığı, SEO kategorisi,
                içeriğin ilk cümleleri.

                🔴 TELEFONDA HEP AÇIK (`opacity-100 md:opacity-0`): dokunmatikte
                hover yok ve kart bir `<a>` — dokunmak doğrudan gezindiriyor.
                Bir tur yalnız `group-hover` vardı; telefonda bu dördünün HİÇBİRİ
                görünmüyordu, üstelik eski slider'ın gösterdiği özet de
                kaybolmuştu (denetimde yakalandı). Trafiğin çoğu mobil.

                DOLGU VE DAİRE `xl:`DEN İTİBAREN BÜYÜR (`lg:` DEĞİL): 768-1024
                arasında kart 324x245'e kadar iniyor ve büyük dolgu + 80px daire
                içeriği 134px taşırıyordu; "OKU" dairesi kesiliyordu. İlk
                düzeltmede eşik `lg:` (1024px) yapılmıştı ama 1100px'te kart
                hâlâ 490x368 ve içerik 11px taşıyordu (ölçüldü) — eşik 1280'e
                çekildi. 1280'de kart 580x435, boşluk ~125px. */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-navy/85 p-5 opacity-100 transition-opacity duration-500 ease-[var(--ease-lux)] md:p-6 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 xl:p-8">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/70 md:text-[12px] xl:text-[13px]">
                  {b.date}
                </p>
                <p className="max-w-[55%] text-right text-[11px] font-medium leading-snug text-white/70 md:text-[12px] xl:text-[13px]">
                  {b.kategori}
                </p>
              </div>

              <div>
                <p className="text-[16px] font-medium leading-[1.2] tracking-[-0.02em] text-white md:text-[18px] xl:text-[24px]">
                  {b.title}
                </p>
                <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-white/75 md:mt-2 md:line-clamp-2 md:text-[13px] xl:mt-3 xl:line-clamp-4 xl:text-[15px]">
                  {ilkCumleler(b.body, b.excerpt)}
                </p>
              </div>

              <div className="flex justify-end">
                {/* Master temadaki yuvarlak "READ" düğmesinin karşılığı. */}
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[11px] font-medium uppercase tracking-[0.1em] text-navy md:h-14 md:w-14 md:text-[12px] xl:h-20 xl:w-20 xl:text-[14px]">
                  Oku
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        {/* GÖRÜNÜR DURAKLAT — WCAG 2.2.2 (Duraklat/Durdur/Gizle). Hover ve odak
            zaten duraklatıyor ama bunlar KEŞFEDİLEBİLİR değil; kullanıcı
            hover'ın duraklattığını bilemez. Kriterin istediği açık bir kontrol
            (denetimde yakalandı). */}
        <button
          type="button"
          onClick={() => setKullaniciDurdurdu((v) => !v)}
          aria-pressed={kullaniciDurdurdu}
          className="flex h-11 w-11 items-center justify-center rounded-full border hairline text-navy transition-colors duration-500 hover:bg-navy hover:text-white"
        >
          <span className="sr-only">
            {kullaniciDurdurdu ? "Dönmeyi sürdür" : "Dönmeyi duraklat"}
          </span>
          <span aria-hidden="true" className="text-[13px] leading-none">
            {kullaniciDurdurdu ? "▶" : "❚❚"}
          </span>
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: duraklar }, (_, i) => {
            const aktif = i === aktifDurak;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setIlk(BLOGS.length % ADIM === 0 ? i * ADIM : i)}
                aria-label={`${i + 1}. blog ikilisini göster`}
                aria-current={aktif ? "true" : undefined}
                /* DOKUNMA HEDEFİ 44px: görünen çubuk 6px ama düğmenin kendisi
                   `py-5` ile 44px yüksekliğinde. Bir tur 12x6 px'ti — WCAG
                   2.5.8 asgarisi 24x24 (denetimde ölçüldü); komşu noktaların
                   merkez mesafesi de 20px kalıp aralık istisnasını da
                   kaçırıyordu. */
                className="group/n flex h-11 items-center px-1.5"
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-500 ease-[var(--ease-lux)] ${
                    aktif
                      ? "w-8 bg-navy"
                      : "w-3 bg-navy/25 group-hover/n:bg-navy/45"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
