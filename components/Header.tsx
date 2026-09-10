"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV, SITE } from "@/content/site";
import { EASE } from "./motion";
import { kaydirmayiDurdur } from "./SmoothScroll";

/**
 * Referanstan ölçüldü: üst bar 70px. TEK KAYNAK — hem barın görsel
 * yüksekliği hem "koyu bölüm barı kapatıyor mu" hesabı buradan gelir.
 * `app/globals.css`'teki `scroll-padding-top` de buna göre ayarlı (5.5rem).
 */
const BAR_YUKSEKLIGI = 70;

/**
 * ÜST MENÜ — referans temaya (arpeggio.framer.website) göre yeniden kuruldu
 * (2026-09-09, Yakup: "üst menü şekli kesinlikle aynı değil ... birebir").
 *
 * Referanstan ÖLÇÜLEN yapı:
 *   · bar 70px, `fixed`, HER ZAMAN saydam — kaydırınca zemin/blur DEĞİŞMİYOR
 *     (bizde beyaza dönüp bulanıklaşıyordu)
 *   · sol: sosyal kısaltmalar (referansta WA·X·IG·LI·EMAIL; bizde X yok,
 *     4 öğe: WA·IG·LI·E-POSTA)
 *   · orta: kelime işareti, mutlak ortalanmış
 *   · sağ: hamburger — MASAÜSTÜ DAHİL her ekranda; yatay menü yok
 *   · menü açılınca tam ekran örtü; sağda 84px/600, ls -3.36px, satır aralığı
 *     84px (yani tam bitişik), sağ kenardan 40px içeride
 *   · solda konum cümlesi + CANLI SAAT + zaman dilimi etiketi
 *
 * Bizde farklı olan tek şey renk ve font — Yakup'un kuralı: "renkler ve
 * kurumsal font harici" birebir.
 *
 * 🔴 OKUNABİLİRLİK: bar referansta tamamen saydam. Bizde denendi ve ölçüldü —
 * arkasına koyu bir fotoğraf/video gelince lacivert logo ve hamburger
 * kayboluyordu (ana sayfada 16 konumun 8'i). Çözüm arkadaki içeriği tahmin
 * etmek değil, ONU ALAKASIZ KILMAK: `[data-koyu-bolum]` işaretli bir bölüm
 * barı TAMAMEN kapatıyorsa bar saydam + yazı beyaz (ana sayfa hero'su —
 * referans görünümü orada birebir), aksi hâlde ince beyaz örtü + lacivert
 * yazı. Ölçüm için `offsetTop` kullanılıyor, gerekçesi aşağıda.
 */
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [koyuZemin, setKoyuZemin] = useState(pathname === "/");

  /*
   * Rota değişince menüyü kapat VE koyu-zemin varsayımını sıfırla
   * (render sırasında state ayarlama deseni — efekt içinde senkron setState
   * cascading render üretir, lint de haklı olarak engelliyor).
   * Varsayılan `pathname === "/"`: en üstte koyu bölümü olan tek sayfa ana
   * sayfa. Yanılırsa aşağıdaki gözlemci ilk çağrısında zaten düzeltir.
   */
  const dialogRef = useRef<HTMLDivElement>(null);
  const butonRef = useRef<HTMLButtonElement>(null);

  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
    setKoyuZemin(pathname === "/");
  }

  /*
   * Barın ARKASINI koyu bir bölüm TAM OLARAK kapatıyor mu?
   *
   * IntersectionObserver DENENDİ ve BIRAKILDI: `rootMargin` ile 70px'lik bir
   * şerit kuruluyordu ama (a) şeridin ölçüsü mount anında donuyordu, pencere
   * yeniden boyutlanınca bayatlıyordu; (b) "şeritle KESİŞİYOR" yetmiyordu —
   * hero'nun son 13 pikseli şeride değerken yazı hâlâ beyaz kalıyor, arkadaki
   * gerçek piksel ise açık oluyordu (ölçüldü: scrollY 800'de arka parlaklık
   * 213 iken çizgi beyazdı, yani görünmezdi).
   *
   * Doğru soru "kesişiyor mu" değil, "barı TAMAMEN kapatıyor mu": bölümün üstü
   * barın üstünde (`top <= 0`) VE altı barın altında (`bottom >= 70`) olmalı.
   * Bu her karede yeniden hesaplanmalı, o yüzden kaydırma dinleyicisi + rAF.
   * Maliyeti işaretli bölüm sayısı kadar `getBoundingClientRect` — bugün 1 tane.
   */
  useEffect(() => {
    const hedefler = Array.from(
      document.querySelectorAll<HTMLElement>("[data-koyu-bolum]"),
    );
    if (!hedefler.length) return;
    let kare = 0;
    const olc = () => {
      kare = 0;
      const kapsiyor = hedefler.some((h) => {
        /*
         * `offsetTop`/`offsetHeight` — `getBoundingClientRect` DEĞİL.
         * Rect, ata öğelerdeki `transform`u da hesaba katar; `app/template.tsx`
         * sayfa geçişinde içeriği geçici olarak kaydırdığı için ilk ölçüm
         * yanlış çıkıyordu (hero `top` 0 yerine 36 görünüyor, koşul false
         * oluyor ve scrollY 0'da düzeltecek bir kaydırma olayı da gelmiyordu).
         * Bunu 5 adet zamanlayıcıyla telafi ediyorduk; o çözüm template'in
         * animasyon süresine elle uydurulmuştu ve süre değişince sessizce
         * bozulurdu. `offsetTop` bir YERLEŞİM değeridir, transform'dan
         * etkilenmez — telafiye hiç gerek kalmıyor.
         */
        const ust = h.offsetTop - window.scrollY;
        return ust <= 0 && ust + h.offsetHeight >= BAR_YUKSEKLIGI;
      });
      setKoyuZemin(kapsiyor);
    };
    const planla = () => {
      if (!kare) kare = requestAnimationFrame(olc);
    };
    planla();
    window.addEventListener("scroll", planla, { passive: true });
    window.addEventListener("resize", planla);
    return () => {
      cancelAnimationFrame(kare);
      window.removeEventListener("scroll", planla);
      window.removeEventListener("resize", planla);
    };
  }, [pathname]);

  /*
   * Kaydırma kilidi İKİ KATLI: `overflow: hidden` tarayıcının kendi
   * kaydırmasını, `kaydirmayiDurdur` ise Lenis'i durdurur. Yalnız `overflow`
   * yetmiyor — Lenis tekerleği programatik kaydırmaya çevirip kilidi deliyor
   * (ölçüldü, gerekçe SmoothScroll.tsx'te).
   */
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    kaydirmayiDurdur(open);
    return () => {
      document.documentElement.style.overflow = "";
      kaydirmayiDurdur(false);
    };
  }, [open]);

  /*
   * ODAK YÖNETİMİ (denetimde yakalandı, ölçüldü: menü açıkken 7 odaklanabilir
   * öğe içeride, 49 tanesi DIŞARIDAYDI).
   *
   * `aria-modal="true"` ekran okuyucuya "arkadaki sayfa yok" der; odak tuzağı
   * olmadan bu bir yalandı — Tab ile örtünün ARKASINDAKİ içeriğe düşülüyor,
   * odak halkası bulanık örtünün arkasında görünmüyordu. Menü artık masaüstü
   * dahil TEK gezinme yolu olduğu için bedeli büyüdü.
   *
   * Üç iş yapıyor: açılınca odağı içeri alır, Tab'ı içeride döndürür,
   * kapanınca odağı hamburger'a geri verir.
   */
  useEffect(() => {
    if (!open) return;
    const kap = dialogRef.current;
    // ref'i efekt içinde kopyala: temizlik koştuğunda .current değişmiş olabilir
    const buton = butonRef.current;
    const oncekiOdak = document.activeElement as HTMLElement | null;
    /*
     * Hamburger (kapat butonu) ve ortadaki logo dialog'un DIŞINDA — barda
     * duruyorlar (z-50) ama menünün parçasılar. İlk sürümde tuzak onları
     * "dışarısı" sayıp geri atıyordu; sonuç: menü açıkken klavye kullanıcısı
     * KAPAT BUTONUNA HİÇ ULAŞAMIYORDU, tek çıkış Escape'ti (WCAG 2.1.2 sınırı).
     * Geri atmak yerine listeye dahil ediyoruz.
     */
    const odaklanabilir = () =>
      Array.from(
        /*
         * TEK SORGU — çünkü sıra önemli. İki ayrı `querySelectorAll` sonucunu
         * birleştirmek DOM sırasını bozuyordu: dizide hamburger sondaydı ama
         * gerçek Tab sırasında dialog linkleri ondan SONRA geliyor. Sonuç,
         * son menü öğesinden ("İletişim") sonra sarmanın tetiklenmemesi ve
         * odağın örtünün arkasındaki sayfaya kaçmasıydı (ölçüldü: 12 Tab
         * sonrası "Hakkımızda↗" butonuna düşüyordu).
         * Tek `querySelectorAll` her zaman belge sırasında döner.
         */
        document.querySelectorAll<HTMLElement>(
          'header a[href], header button, [role="dialog"] a[href], [role="dialog"] button',
        ),
      ).filter((e) => e.offsetParent !== null);

    // Açılışta odak ilk MENÜ öğesine — listenin başı bardaki sosyal linktir.
    kap?.querySelector<HTMLElement>("nav a[href]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const oge = odaklanabilir();
      if (!oge.length) return;
      const ilk = oge[0];
      const son = oge[oge.length - 1];
      const simdi = document.activeElement as HTMLElement | null;
      const sira = simdi ? oge.indexOf(simdi) : -1;
      if (sira === -1) {
        // Odak listenin tamamen dışına kaçmış — geri al.
        e.preventDefault();
        (e.shiftKey ? son : ilk).focus();
      } else if (e.shiftKey && simdi === ilk) {
        e.preventDefault();
        son.focus();
      } else if (!e.shiftKey && simdi === son) {
        e.preventDefault();
        ilk.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const acildigiYol = pathname;
    return () => {
      window.removeEventListener("keydown", onKey);
      /*
       * Odağı hamburger'a YALNIZCA menü kapandığı için geri veriyoruz.
       * Menüden başka bir sayfaya gidildiyse yol değişir ve `prevPath` bloğu
       * menüyü kapatır — o durumda odağı hamburger'a oturtmak yanlış olurdu;
       * yeni sayfanın başı (<main tabIndex={-1}>) doğru yer, oraya Next ve
       * SmoothScroll'daki dinleyici karar veriyor.
       */
      if (window.location.pathname !== acildigiYol) return;
      if (buton && document.body.contains(buton)) buton.focus();
      else oncekiOdak?.focus?.();
    };
  }, [open, pathname]);

  /*
   * Bar yazısı ne zaman beyaz olur? Arkada koyu bölüm varken YA DA menü açıkken.
   *
   * `!open` KOŞULU KALDIRILDI (2026-09-09, Yakup: "menüdeki şeffaflık kesinlikle
   * master temadaki mantıkta değil"). Örtü bir ara AÇIK zeminliydi (beyaz %85)
   * ve o dönemde yazıların lacivert kalması doğruydu. Master temada ölçüldü:
   * örtü KOYU ve saydam (siyah %80 + blur 6px), yazılar beyaz. Örtümüz de
   * koyulaşınca (lacivert %80) bar yazıları yeniden beyaz olmak zorunda.
   */
  const acikRenk = koyuZemin || open;

  const sosyal = [
    { k: "WA", href: SITE.whatsapp, dis: true },
    { k: "IG", href: SITE.instagram, dis: true },
    { k: "LI", href: SITE.linkedin, dis: true },
    { k: "E-POSTA", href: `mailto:${SITE.email}`, dis: false },
  ];

  return (
    <>
      {/*
        🔴 ZEMİN — okunabilirliğin tek garantisi (denetimde yakalandı, ölçüldü).
        Bar referanstaki gibi TAMAMEN saydam bırakılınca, arkasına koyu bir
        fotoğraf/video geldiğinde lacivert logo ve hamburger kayboluyordu: ana
        sayfada 16 noktanın 8'inde başlık ekranda yoktu (gerçek piksel ölçümü).
        Yatay menü de kaldırıldığı için o noktalarda sitenin TEK gezinme yolu
        görünmez oluyordu.

        Çözüm arkadaki içeriği tahmin etmeye çalışmak değil — onu alakasız
        kılmak: koyu bölüm barı kapatmıyorsa ince bir beyaz örtü + lacivert
        yazı geliyor, arkada ne olursa olsun okunuyor. İşaretli koyu bölümün
        (ana sayfa hero'su) üstünde ise bar tamamen saydam kalıyor — yani
        referansın görünümü, en çok göründüğü yerde birebir korunuyor.
      */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter] duration-500 ease-[var(--ease-lux)] ${
          acikRenk || open ? "" : "bg-white/80 backdrop-blur-md"
        }`}
      >
        {/* Yükseklik SABİTTEN geliyor, sınıftan değil: JS ölçümü (BAR_YUKSEKLIGI)
            ile görsel yükseklik iki ayrı yere yazılınca sessizce ayrışır. */}
        <div
          style={{ height: BAR_YUKSEKLIGI }}
          className="relative mx-auto flex max-w-[1440px] items-center px-5 md:px-10"
        >
          {/* SOL — sosyal kısaltmalar (referans: WA X IG LI EMAIL) */}
          <div
            /* `font-bold` (2026-09-10, Yakup: "soldaki sosyal medya kısmı da
               bold olsun"). */
            className={`hidden items-center gap-5 text-[13px] font-bold tracking-[0.02em] transition-colors duration-500 sm:flex ${
              acikRenk ? "text-white/75" : "text-navy/75"
            }`}
          >
            {sosyal.map((s) => (
              <a
                key={s.k}
                href={s.href}
                {...(s.dis
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="transition-opacity duration-300 hover:opacity-60"
              >
                {s.k}
              </a>
            ))}
          </div>

          {/* ORTA — kelime işareti, mutlak ortalanmış (referansta da öyle) */}
          <Link
            href="/"
            aria-label="tellers ana sayfa"
            /* Logo z-50, örtü z-30 — menü AÇIKKEN de tıklanabilir. Ana
               sayfadayken menüyü açıp logoya basınca yol değişmiyor, yani
               prevPath tetiklenmiyor; menüyü elle kapatıyoruz. */
            onClick={() => {
              if (pathname === "/") setOpen(false);
            }}
            className="absolute left-1/2 z-50 -translate-x-1/2"
          >
            {/* next/image DEĞİL <img>: Next'in görsel iyileştiricisi SVG'yi
                `dangerouslyAllowSVG` kapalıyken 400 ile reddediyor (canlıda
                denendi). `brightness-0 invert` SVG'de de çalışır. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo/tellers-logo.svg"
              alt="tellers"
              width={775}
              height={225}
              fetchPriority="high"
              decoding="async"
              className={`h-[22px] w-auto transition-[filter] duration-500 ${
                acikRenk ? "brightness-0 invert" : ""
              }`}
            />
          </Link>

          {/* SAĞ — hamburger, HER ekran boyutunda (referansta yatay menü yok) */}
          <button
            ref={butonRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            className="relative z-50 ml-auto flex h-11 w-11 items-center justify-center"
          >
            {/* ÇİZGİLER UZADI VE KALINLAŞTI (2026-09-10, Yakup: "sağdaki menü
                tuşu çizgiyi bir yarısı kadar uzat ve bold yap").
                genişlik 28px → 42px (yarısı kadar uzun), kalınlık 1px → 2px.
                Aralık da ±4px'ten ±5px'e açıldı: 2px'lik çizgilerde eski aralık
                iki çizgiyi birbirine yapıştırıyordu.
                Düğmenin dokunma hedefi 44px olduğu gibi kalıyor (h-11 w-11);
                çizgi `absolute` olduğu için kutuyu büyütmüyor. */}
            <span
              className={`absolute h-0.5 w-[42px] transition-[transform,background-color] duration-500 ease-[var(--ease-lux)] ${
                acikRenk ? "bg-white" : "bg-navy"
              } ${open ? "rotate-45" : "-translate-y-[5px]"}`}
            />
            <span
              className={`absolute h-0.5 w-[42px] transition-[transform,background-color] duration-500 ease-[var(--ease-lux)] ${
                acikRenk ? "bg-white" : "bg-navy"
              } ${open ? "-rotate-45" : "translate-y-[5px]"}`}
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menüsü"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            /* Master temada ölçüldü: rgba(0,0,0,0.8) + blur(6px). Bizde siyah
               yerine KURUMSAL LACİVERT — Yakup: "aynı görüntüyü sadece kendi
               kurumsal rengimde istiyorum". Saydamlık ve bulanıklık birebir. */
            className="fixed inset-0 z-30 bg-navy/80 backdrop-blur-[6px]"
          >
            <div className="mx-auto flex h-full max-w-[1440px] flex-col justify-between px-5 pb-10 pt-[110px] md:px-10">
              <div className="flex flex-1 flex-col justify-between gap-10 md:flex-row md:items-start">
                {/* SOL — konum cümlesi + canlı saat (referanstaki gibi) */}
                <MenuSol />

                {/* SAĞ — dev, sağa yaslı bağlantılar.
                    Referans ölçüsü: 84px / 600 / ls -3.36px (-0.04em) /
                    satır aralığı 84px, yani tam bitişik. */}
                <nav
                  aria-label="Ana menü"
                  className="flex flex-col items-end text-right"
                >
                  {NAV.map((item, i) => (
                    <motion.div
                      key={item.href}
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 0.7,
                        ease: EASE,
                        delay: 0.05 * i,
                      }}
                    >
                      {/* onClick SADECE aynı sayfa için: menü normalde YOL
                          DEĞİŞİNCE kapanıyor (prevPath) ve örtü o sırada
                          geçişi maskeliyor — bilerek bozmuyoruz. */}
                      <Link
                        href={item.href}
                        onClick={() => {
                          if (item.href === pathname) setOpen(false);
                        }}
                        /* Kendi ölçüsü: `.t-buyuk` ana sayfadaki para rakamıyla paylaşılıyordu,
                           birini ayarlamak diğerini sessizce değiştiriyordu. Ayrıca 5.8vw
                           1280px'te linkleri 74px'e düşürüyordu; 6.5vw referans ölçüsünü
                           (84px) daha geniş bir aralıkta koruyor. */
                        className="block font-semibold leading-[1] tracking-[-0.04em] text-white transition-opacity duration-300 hover:opacity-50 text-[clamp(2.25rem,6.5vw,84px)]"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>

              {/* ALT — sosyal (küçük ekranda üstteki gizli olduğu için burada) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
                className="flex gap-6 text-[13px] tracking-[0.02em] text-white/75 sm:hidden"
              >
                {sosyal.map((s) => (
                  <a
                    key={s.k}
                    href={s.href}
                    {...(s.dis
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {s.k}
                  </a>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Menünün sol sütunu: konum cümlesi + canlı saat.
 *
 * Saat SUNUCUDA basılmaz — `--:--:--` yer tutucusuyla başlar ve yalnızca
 * istemcide dolar. Zorunlu: sunucu saati ile tarayıcı saati farklı olur ve
 * React hidrasyon uyuşmazlığı verir. (Referans da aynı deseni kullanıyor;
 * ilk ölçümde ekranda `--:--` yazıyordu.)
 */
function MenuSol() {
  const [saat, setSaat] = useState<string | null>(null);

  useEffect(() => {
    const yaz = () =>
      setSaat(
        new Intl.DateTimeFormat("tr-TR", {
          timeZone: "Europe/Istanbul",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    yaz();
    const id = window.setInterval(yaz, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
      className="max-w-[620px]"
    >
      {/*
        Master temada ölçüldü: cümlenin gövdesi BEYAZ, yalnız şehir adı MARKA
        RENGİNDE (turuncu #FF4400) — vurgu tek kelimede.

        Bizde zemin artık kurumsal lacivert, yani markanın rengi ZEMİN oldu ve
        aynı rengi vurgu olarak da kullanmak mümkün değil (lacivert üstünde
        lacivert okunmaz). Aynı hiyerarşiyi tek renkle kuruyoruz: vurgulanan
        kelime TAM BEYAZ, cümlenin geri kalanı beyaz/55.
        ⚠️ AÇIK KARAR: ayrı bir vurgu tonu (açık lacivert) istenirse burada
        ve aşağıdaki mecra bağlantılarında tek satırla değişir.
      */}
      <p className="t-orta text-white/55">
        <span className="text-white">Türkiye</span>
        {SITE.konumCumlesi.replace(/^Türkiye/, "")}
      </p>
      <p className="mt-8 font-mono text-[clamp(1.75rem,4.2vw,60px)] font-semibold leading-none tracking-[-0.04em] text-white tabular-nums">
        {saat ?? "--:--:--"}
      </p>
      <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-white/70">
        Türkiye saati (GMT+3)
      </p>
    </motion.div>
  );
}
