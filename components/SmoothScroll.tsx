"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Temanın (Arpeggio) kaydırma hissi: ham tarayıcı kaydırması yerine ivmeli,
 * ağırlaştırılmış yumuşak kaydırma.
 *
 * Neden Lenis: gerçek scroll konumunu sürer (transform hilesi değil), bu yüzden
 * `position: sticky`, IntersectionObserver (Reveal/MediaReveal) ve çapa linkleri
 * bozulmadan çalışmaya devam eder.
 *
 * Erişilebilirlik: "hareketi azalt" tercihi açıksa hiç devreye girmez —
 * tarayıcının kendi kaydırması kalır.
 */
/**
 * Çalışan Lenis örneği. Lenis her karede kaydırma konumunu KENDİ hesabına göre
 * yazdığı için `window.scrollTo` ile yarışır; bu yüzden "başa dön" gibi
 * programatik kaydırmalar Lenis'in kendi API'sinden geçmek zorunda.
 * Modül düzeyinde tutuluyor: layout'taki <SmoothScroll /> ile footer'daki
 * buton aynı istemci paketini paylaşır, dolayısıyla aynı örneği görür.
 */
let etkinLenis: Lenis | null = null;

/** Sayfanın en üstüne döner. Lenis kapalıysa tarayıcının kendi kaydırması. */
export function basaDon() {
  if (etkinLenis) {
    etkinLenis.scrollTo(0, { duration: 1.2 });
    return;
  }
  const azalt = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: azalt ? "auto" : "smooth" });
}

export default function SmoothScroll() {
  useEffect(() => {
    const azalt = window.matchMedia("(prefers-reduced-motion: reduce)");

    /*
     * AYNI SAYFA İÇİNDEKİ TIKLAMALAR — üç işi birden yapar:
     *   (a) hash yoksa sayfanın başına döner (menüde ZATEN AÇIK olan sayfaya
     *       veya ana sayfadayken logoya basmak),
     *   (b) hash varsa o çapaya kaydırır ("#basvuru", "#icerik"),
     *   (c) çapa hedefine ODAĞI taşır.
     *
     * NEDEN GEREKLİ: yol değişmediği için bu tıklamalarda Next kaydırma
     * yapmıyor ve `stopInertiaOnNavigate` de devreye girmiyor — tekerlek
     * ataleti sürerken sayfa olduğu yerde kalıyordu. Odak kısmı ise ayrı bir
     * eksik: Next 16.3 çapa gezinmesinde odağa BİLEREK dokunmuyor
     * (`appNewScrollHandler` → InnerScrollHandlerNew) ve `<Link>` de
     * `preventDefault()` çağırdığı için tarayıcının kendi odaklaması da
     * çalışmıyor. Hedefler `tabIndex={-1}` taşımalı, yoksa odak almazlar.
     *
     * ⚠️ ÇAPA LİNKLERİ `<Link>` KALMALI, düz `<a>` OLMAMALI. Denendi ve GERİ
     * ALINDI: düz `<a>` ile tarayıcının fragment gezinmesi `history.state`i
     * null yapıyor, Next'in popstate işleyicisi de `if (!event.state) return`
     * diyip çekiliyor. Sonuç ölçüldü: #basvuru'ya bas → Blog'a git → geri tuşu
     * → adres çubuğu "/kariyer#basvuru" diyor ama ekranda hâlâ Blog duruyor.
     *
     * Tek dinleyici; aynı durum header menüsünde, mobil menüde, footer'da ve
     * logoda ayrı ayrı var. "Hareketi azalt" açıkken de kurulur (orada Lenis
     * hiç kurulmaz ama "aynı sayfaya bas → başa dön" yine çalışmıyordu).
     */
    const ayniSayfaTiklamasi = (olay: MouseEvent) => {
      if (olay.button !== 0) return;
      if (olay.metaKey || olay.ctrlKey || olay.shiftKey || olay.altKey) return;
      const hedefOge = olay.target as HTMLElement | null;
      const bag = hedefOge?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!bag || bag.target === "_blank" || bag.hasAttribute("download")) return;
      let adres: URL;
      let hash = "";
      try {
        adres = new URL(bag.href, window.location.href);
        hash = adres.hash ? decodeURIComponent(adres.hash) : "";
      } catch {
        return;
      }
      if (adres.origin !== window.location.origin) return;
      if (adres.pathname !== window.location.pathname) return;

      const hedefBolum = hash ? document.getElementById(hash.slice(1)) : null;

      /*
       * Odağı ÖNCE taşı, kaydırmadan bağımsız olarak. `preventScroll` şart:
       * kaydırmayı biz yapıyoruz, odaklama araya girmemeli. Bu çağrı,
       * `<Link>`'in bastırdığı tarayıcı davranışının yerini tutar — olmazsa
       * ekran okuyucu imleci butonda kalır ve bir sonraki Tab kullanıcıyı
       * formun içine değil footer'a atar (WCAG 2.4.3). Kaydırma bitince
       * odaklamak YANLIŞ olurdu: kullanıcı animasyon sırasında tekerleğe
       * dokunursa animasyon tamamlanmaz ve odak hiç taşınmazdı.
       */
      hedefBolum?.focus({ preventScroll: true });

      // Seçenekler bilerek `basaDon()` ile aynı.
      if (etkinLenis) {
        etkinLenis.scrollTo(hash || 0, { duration: 1.2 });
        return;
      }
      /*
       * Lenis yok — "hareketi azalt" açık. Kaydırmayı Next'e BIRAKMIYORUZ:
       * Next hash kaydırmasını yalnızca hash DEĞİŞTİĞİNDE garanti ediyor
       * (`onlyHashChange`), yani URL zaten "#basvuru" iken aynı butona ikinci
       * kez basmak hiçbir şey yapmıyordu. `scrollIntoView` hem bu boşluğu
       * kapatıyor hem `scroll-padding-top`a uyuyor; azaltılmış harekette
       * `scroll-behavior: smooth` geçerli olmadığı için anlık çalışıyor.
       */
      if (hedefBolum) hedefBolum.scrollIntoView();
      else window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("click", ayniSayfaTiklamasi);

    // Buradan AŞAĞISI yalnızca hareket azaltılmamışsa: Lenis hiç kurulmaz,
    // tarayıcının kendi kaydırması kalır. (Yukarıdaki dinleyici kurulu kalır.)
    if (azalt.matches) {
      return () => window.removeEventListener("click", ayniSayfaTiklamasi);
    }

    /*
     * `stopInertiaOnNavigate` NEDEN AÇIK — "sayfa aşağıdan açılıyor" hatası
     * (2026-09-07, Yakup: "bir referans dosyasına bastığımda veya bloglara
     * girince alt kısımdan başlıyor").
     *
     * Lenis, KENDİ animasyonu koşarken her karede konumu pencereye yazar ve o
     * sırada dışarıdan gelen kaydırmayı kendine senkronlamaz. Next sayfa
     * geçişinde başa dönmek için `scrollTop = 0` yazınca Lenis bunu yutup bir
     * sonraki karede eski sayfanın konumunu geri yazıyordu. Pencere geniş,
     * çünkü `duration` süre tabanlı: hareket gözle ~300ms'de bitse de Lenis
     * kendini tam 1.1 sn "kaydırıyorum" sayar — listeye ulaşmak için zaten
     * aşağı kaydırmak gerektiğinden karta hemen tıklayan herkes bu pencerenin
     * içindeydi. Seçenek, yol değiştiren bir linke tıklandığı ANDA ataleti
     * senkron olarak durdurur.
     *
     * Yalnızca masaüstü/tekerlek sorunuydu: `syncTouch: false` olduğu için
     * dokunmatikte Lenis "native" moda düşüyor.
     *
     * Kapsamı YOL DEĞİŞEN linklerle sınırlı; aynı sayfa içindeki tıklamaları
     * yukarıdaki `ayniSayfaTiklamasi` üstlenir. Lenis'in `anchors: true`
     * seçeneği de denendi ve kaldırıldı: `onClick`'i değiştirici tuşlara hiç
     * bakmadığı için Cmd+tıklamada yeni sekme açılırken durduğun sayfa da
     * kayıyordu.
     *
     * BİLİNEN AÇIK: tıklama ile sayfanın yerleşmesi arasında kullanıcı
     * tekerleği bir tık daha çevirirse atalet yeniden kurulabilir. Çözümü,
     * gezinme bittikten sonra da senkronlamaktır (pathname değişiminde).
     */
    const lenis = new Lenis({
      duration: 1.1,
      // Yumuşak duruş eğrisi — sonda yavaşlayarak durur
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
      // Dokunmatikte tarayıcının kendi kaydırması daha iyi hissettiriyor
      syncTouch: false,
      // "Sayfa aşağıdan açılıyor" hatasının düzeltmesi — gerekçe yukarıda.
      stopInertiaOnNavigate: true,
    });
    etkinLenis = lenis;

    let kare = 0;
    const dongu = (zaman: number) => {
      lenis.raf(zaman);
      kare = requestAnimationFrame(dongu);
    };
    kare = requestAnimationFrame(dongu);

    return () => {
      window.removeEventListener("click", ayniSayfaTiklamasi);
      cancelAnimationFrame(kare);
      lenis.destroy();
      // Sadece KENDİ örneğini sil. Bugün tek <SmoothScroll /> var; ileride
      // ikincisi eklenirse A'nın unmount'u B'nin çalışan örneğini silmesin
      // (silseydi "başa dön" sessizce Lenis'le yarışan yedek yola düşerdi).
      if (etkinLenis === lenis) etkinLenis = null;
    };
  }, []);

  return null;
}
