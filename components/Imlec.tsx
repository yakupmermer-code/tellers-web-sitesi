"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ÖZEL FARE İMLECİ — master temanın (arpeggio.framer.website) imleci.
 *
 * Yakup (2026-09-10): "master temadaki mouse imlecini incelemeni istiyorum,
 * hangi alanın üzerine gelirse ona göre değişkenlik kazanıyor; mesela blog
 * yazılarının üstüne gelince OKU o şekilde çıkıyor, sen sabitte koymuşsun.
 * Ayrıca fare imleci ok işareti değil bir nokta işareti."
 *
 * MASTER ÖLÇÜMÜ (canlı, /journal sayfası):
 *   body            → `cursor: none` (`body.framer-cursor-none`)
 *   boşta           → 24x24, border-radius 100%, zemin rgb(255,68,0) (marka rengi)
 *   okunabilir alan → 120x120, zemin rgba(255,255,255,0.6), backdrop blur(8px),
 *                     etiket "READ" 12px / 400 / siyah
 *   ortak           → position fixed, pointer-events none, z-index 13
 *   Öğeler `data-framer-cursor="<id>"` taşıyor; en yakın atadaki değer kazanıyor.
 *
 * BİZDEKİ KARŞILIĞI: nitelik `data-imlec="<etiket>"`. Etiket boşsa yalnız nokta
 * büyür. Marka rengimiz lacivert olduğu için nokta lacivert.
 *
 * 🔴 `cursor: none` SADECE JS AÇILDIKTAN SONRA: sınıf `<html>`e bu bileşen
 * bağlanınca ekleniyor. CSS'e sabit yazılsaydı JavaScript yüklenmediğinde
 * (ağ kesintisi, eski tarayıcı, bir paketin patlaması) kullanıcıda HİÇ imleç
 * kalmazdı — siteyi kullanılamaz hâle getiren bir hata.
 *
 * 🔴 YALNIZCA GERÇEK FARE: `(hover: hover) and (pointer: fine)`. Dokunmatikte
 * ve kalemde özel imleç anlamsız; üstelik `cursor: none` orada bir şey
 * değiştirmese de boşuna bir katman ve rAF döngüsü doğururdu.
 */

/** Boştaki nokta çapı (master: 24px). */
const NOKTA = 24;
/** Etiketli hâlin çapı (master: 120px). */
const BUYUK = 120;

export default function Imlec() {
  const [etiket, setEtiket] = useState<string | null>(null);
  const [gorunur, setGorunur] = useState(false);
  const el = useRef<HTMLDivElement>(null);
  const hedef = useRef({ x: -100, y: -100 });
  const simdi = useRef({ x: -100, y: -100 });
  const kare = useRef(0);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }

    const kok = document.documentElement;
    kok.classList.add("imlec-acik");

    const azalt = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const hareket = (e: PointerEvent) => {
      hedef.current = { x: e.clientX, y: e.clientY };
      if (!gorunur) setGorunur(true);
      const yakin = (e.target as Element | null)?.closest?.("[data-imlec]");
      const yeni = yakin?.getAttribute("data-imlec") ?? null;
      setEtiket((o) => (o === yeni ? o : yeni));
    };
    const cik = () => setGorunur(false);

    /*
     * Yumuşak takip (lerp). Doğrudan konum atamak imleci "yapışkan" ve sert
     * gösteriyor; master'da da hafif bir gecikme var. Hareketi azaltılmış
     * tercihte gecikme YOK — kayan bir nokta orada rahatsız edici olur.
     */
    const dongu = () => {
      const k = azalt ? 1 : 0.18;
      simdi.current.x += (hedef.current.x - simdi.current.x) * k;
      simdi.current.y += (hedef.current.y - simdi.current.y) * k;
      if (el.current) {
        el.current.style.transform = `translate3d(${simdi.current.x}px, ${simdi.current.y}px, 0) translate(-50%, -50%)`;
      }
      kare.current = requestAnimationFrame(dongu);
    };
    kare.current = requestAnimationFrame(dongu);

    window.addEventListener("pointermove", hareket, { passive: true });
    document.addEventListener("pointerleave", cik);
    window.addEventListener("blur", cik);

    return () => {
      kok.classList.remove("imlec-acik");
      cancelAnimationFrame(kare.current);
      window.removeEventListener("pointermove", hareket);
      document.removeEventListener("pointerleave", cik);
      window.removeEventListener("blur", cik);
    };
    // `gorunur` bilerek dışarıda: içeride yalnız ilk true'ya çevirmek için
    // okunuyor, bağımlılığa girseydi her ilk harekette dinleyiciler yeniden
    // kurulurdu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acik = etiket !== null;

  return (
    <div
      ref={el}
      aria-hidden="true"
      className="imlec pointer-events-none fixed left-0 top-0 z-[60] hidden items-center justify-center rounded-full transition-[width,height,background-color,opacity] duration-300 ease-[var(--ease-lux)]"
      style={{
        width: acik ? BUYUK : NOKTA,
        height: acik ? BUYUK : NOKTA,
        opacity: gorunur ? 1 : 0,
        backgroundColor: acik ? "rgba(255,255,255,0.6)" : "var(--navy)",
        backdropFilter: acik ? "blur(8px)" : undefined,
      }}
    >
      {/* Etiket yalnız büyük hâlde okunur; küçükken de basılı kalması geçişi
          yumuşatıyor (metin sonradan doğmuyor, sadece soluyor). */}
      {/* PUNTO 12 → 15 (2026-09-10, Yakup: "oku yazısı çok küçük").
          Master temada ölçülen değer 12px/400 idi; 120px'lik dairenin içinde
          Türkçe "Oku" üç harf olduğu için orada daha da küçük duruyordu.
          15px/500 ile daire boyutu değişmeden okunur hâle geliyor. */}
      <span
        className="select-none text-[15px] font-medium leading-none text-navy transition-opacity duration-200"
        style={{ opacity: acik ? 1 : 0 }}
      >
        {etiket}
      </span>
    </div>
  );
}
