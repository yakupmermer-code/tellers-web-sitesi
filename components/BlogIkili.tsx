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

/*
 * Kaç ms'de bir sonraki ikiliye geçiyor.
 * 7000 → 4500 (2026-09-10): 7 saniye, "acaba çalışıyor mu" diye bakan birinin
 * bekleyeceğinden uzun. Şerit 1 saniyede kaydığı için 4,5 saniyede duran
 * görüntü ~3,5 saniye kalıyor — okumaya yetiyor, ölü görünmüyor.
 */
const DONME_SURESI = 4500;

/** Aynı anda kaç kart gösteriliyor. */
const ADIM = 2;

/** Kayma animasyonunun süresi (ms). Başa sarma bu süre dolunca yapılıyor. */
const GECIS_SURESI = 1000;

export default function BlogIkili() {
  const [ilk, setIlk] = useState(0);
  const [durdu, setDurdu] = useState(false);
  const [gorunur, setGorunur] = useState(false);
  /* Şerit başa sarılırken geçiş kapatılır — yoksa görsel olarak geri kayar. */
  const [gecisli, setGecisli] = useState(true);
  /* "Hareketi azalt" açıksa kayma animasyonu yok, içerik yine değişiyor. */
  const [azalt, setAzalt] = useState(false);
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
  /*
   * 🔴 "HAREKETİ AZALT" AÇIKKEN DE DÖNÜYOR, YALNIZ KAYMIYOR.
   * Bir tur bu tercih açıksa `return` ediliyordu, yani karusel HİÇ çalışmıyordu
   * ve o makinede alan tamamen ölü görünüyordu. İşletim sistemi ayarı olduğu
   * için kullanıcı bunu siteyle ilişkilendiremez.
   * Doğrusu içeriği dondurmak değil, HAREKETİ kaldırmak: yazılar yine
   * değişiyor, sadece kayma animasyonu yerine anında geçiyorlar (aşağıdaki
   * `transition` hesabına bak).
   */
  useEffect(() => {
    if (durdu || !gorunur) return;
    const id = window.setInterval(() => setIlk((i) => i + ADIM), DONME_SURESI);
    return () => window.clearInterval(id);
  }, [durdu, gorunur, ilk]);

  /* İşletim sistemindeki "hareketi azalt" tercihi — istemcide okunur. */
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const oku = () => setAzalt(m.matches);
    oku();
    m.addEventListener("change", oku);
    return () => m.removeEventListener("change", oku);
  }, []);

  /*
   * SONSUZ AKIŞ — GÖRÜNÜR SIÇRAMA OLMADAN.
   * Şeritte yazı listesi İKİ KEZ basılı. `ilk` liste sonuna ulaştığında ekranda
   * görünen ikili, ikinci kopyanın başındaki ikiliyle BİREBİR aynıdır; o anda
   * geçiş kapatılıp başa alınınca kimse fark etmez. Modulo ile 0'a dönmek
   * yerine bu yol seçildi çünkü modulo şeridi GERİ kaydırıyordu — kullanıcı
   * "sağa doğru kayacak" dedi, tek yön şart.
   */
  useEffect(() => {
    if (ilk < BLOGS.length) return;
    const t = window.setTimeout(() => {
      setGecisli(false);
      setIlk(0);
    }, GECIS_SURESI);
    return () => window.clearTimeout(t);
  }, [ilk]);

  /* Başa alma bittikten sonra geçişi bir kare sonra geri aç. */
  useEffect(() => {
    if (gecisli) return;
    const r = requestAnimationFrame(() => setGecisli(true));
    return () => cancelAnimationFrame(r);
  }, [gecisli]);

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

  /* Liste iki kez basılı — sonsuz akışın sıçramasız dönüşü için (yukarı bak). */
  const SERIT = [...BLOGS, ...BLOGS];

  // İki karta bölünemeyecek kadar az yazı varsa karusel anlamsız.
  if (BLOGS.length < ADIM) return null;

  return (
    <div
      ref={kok}
      // Üzerine gelince / klavyeyle odaklanınca dönme durur: okumaya başlayanın
      // altından kart kaymasın.
      /*
       * 🔴 FAREYLE DURAKLATMA KALDIRILDI (2026-09-10). `onMouseEnter` ile
       * duruyordu ve şeridi İNCELEMEK İÇİN fareyi oraya götüren herkes
       * "hiç kaymıyor" görüyordu — Yakup iki kez böyle bildirdi. Yakup'un
       * kararı zaten sürekli akış: "sağa doğru kayacak, isteyen de tüm
       * yazılara tıklayabilir."
       *
       * KLAVYE ODAĞI DURDURMAYA DEVAM EDİYOR: sekme ile kartlar arasında
       * gezerken şerit kayarsa odaklanılan kart ekrandan çıkar ve kullanıcı
       * nerede olduğunu kaybeder. Fare kullanıcısı için aynı risk yok, o
       * istediği an tıklayabilir.
       */
      onFocusCapture={() => setDurdu(true)}
      onBlurCapture={() => setDurdu(false)}
    >
      {/*
        KAYAN ŞERİT (2026-09-10, Yakup: "2'li kayma çalıştıracaktık, o alan
        çalışmıyor... sağa doğru kayacak").
        Bir tur ızgaraydı ve dönüşte kartların yalnız İÇERİĞİ değişiyordu —
        hiçbir hareket yoktu. Artık bütün yazılar tek bir şeritte duruyor ve
        şerit `translateX` ile kayıyor.

        BOŞLUK `gap` DEĞİL, KART İÇİ DOLGU: `gap` şeridin toplam genişliğine
        giriyor ve `translateX` yüzdesi ŞERİDİN kendi genişliğine göre
        hesaplandığı için kayma miktarı kart genişliğiyle tutmuyordu. Dolgu
        kullanılınca hesap temiz: şerit = kart sayısı x %50, adım = %(100/kart).
        Dış `-mx-*` kenardaki fazla dolguyu geri alıyor.
      */}
      <div className="-mx-3 overflow-hidden md:-mx-5">
        <div
          className="flex"
          style={{
            width: `${SERIT.length * 50}%`,
            transform: `translateX(-${ilk * (100 / SERIT.length)}%)`,
            transition:
              gecisli && !azalt
                ? `transform ${GECIS_SURESI}ms var(--ease-lux)`
                : "none",
          }}
        >
          {SERIT.map((b, i) => (
            <div
              key={i}
              className="px-3 md:px-5"
              style={{ width: `${100 / SERIT.length}%` }}
            >
              <Link
                href={`/blog/${b.slug}`}
                aria-label={`${b.title} — yazıyı oku`}
                data-imlec="Oku"
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
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* KALDIRILAN KONTROLLER (2026-09-10, Yakup: "oradaki pause kısmını kaldıralım,
   hatta altındaki tüm tıklamaları kaldıralım çünkü sağa doğru kayacak,
   isteyen de tüm yazılara tıklayabilir").
   Burada görünür bir duraklat düğmesi ve durak göstergeleri vardı.

   🟠 BUNUN BİR BEDELİ VAR: WCAG 2.2.2 (Duraklat/Durdur/Gizle), 5 saniyeden
   uzun süren ve kendiliğinden hareket eden içerik için GÖRÜNÜR bir kontrol
   ister. Üzerine gelince ve klavyeyle odaklanınca dönme hâlâ duruyor, ayrıca
   `prefers-reduced-motion` açıksa şerit hiç kaymıyor — yani mekanizma var ama
   keşfedilebilir değil. Bilinçli bir sapma; bildirildi.
*/
