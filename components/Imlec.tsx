"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ÖZEL FARE İMLECİ — master temanın (arpeggio.framer.website) imleci.
 *
 * Yakup (2026-09-10): "master temadaki mouse imlecini incelemeni istiyorum,
 * hangi alanın üzerine gelirse ona göre değişkenlik kazanıyor." + "imlecin
 * içindeki oku yazısı ana temadaki read yazısı ile aynı boyutta olsun."
 *
 * MASTER ÖLÇÜMÜ (canlı, Yakup'un tarayıcısında, imleç görünürken):
 *   body            → `cursor: none` (`body.framer-cursor-none`)
 *   boşta           → 24x24, border-radius 100%, zemin marka rengi
 *   blog kartı      → 120x120, zemin rgba(255,255,255,0.6), backdrop blur(8px),
 *                     etiket "READ" 12px / 400
 *   portfolyo kartı → 76x76, zemin MARKA RENGİ, bulanıklık YOK,
 *                     etiket "VISIT" 12px / 400
 *   ortak           → position fixed, pointer-events none, z-index 13
 *
 * Yani master'da tek bir "büyük hâl" yok: alan türüne göre HEM ÇAP HEM ZEMİN
 * değişiyor. Bu yüzden tek `BUYUK` sabiti yerine etiket → varyant haritası var.
 *
 * BİZDEKİ KARŞILIĞI: nitelik `data-imlec="<etiket>"`. En yakın atadaki değer
 * kazanır (master'daki `data-framer-cursor` mantığı). Marka rengimiz lacivert.
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

type Varyant = {
  /** Dairenin çapı, px. */
  cap: number;
  zemin: string;
  /** `backdrop-filter` değeri; yoksa bulanıklık uygulanmaz. */
  bulanik?: string;
  yazi: string;
};

/** Portfolyo/proje kartlarının varyantı — hem haritada hem VARSAYILAN'da. */
const INCELE: Varyant = { cap: 76, zemin: "var(--navy)", yazi: "#ffffff" };

/**
 * ETİKET → GÖRÜNÜM. Master'da ölçülen iki durum birebir burada.
 * Haritada olmayan bir etiket gelirse portfolyo varyantına düşer — sessizce
 * 24px'lik noktada kalıp etiketi görünmez kılmaktan iyidir.
 */
const VARYANTLAR: Record<string, Varyant> = {
  // master: 120px, rgba(255,255,255,0.6), blur(8px) — "READ"
  Oku: {
    cap: 120,
    zemin: "rgba(255,255,255,0.6)",
    bulanik: "blur(8px)",
    yazi: "var(--navy)",
  },
  // master: 76px, marka rengi, bulanıklık yok — "VISIT"
  İncele: INCELE,
};

/*
 * VARSAYILAN doğrudan sabite bağlı, `VARYANTLAR["İncele"]` ARAMASINA değil.
 * Aramaya bağlı olsaydı biri anahtarı yeniden adlandırdığında derleme yine
 * geçer, imleç yalnız ÇALIŞMA ANINDA çökerdi (denetimde yakalandı).
 */
const VARSAYILAN: Varyant = INCELE;

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
      /*
       * `|| null`, `?? null` DEĞİL: `data-imlec=""` (ya da değeri hiç
       * yazılmamış nitelik) boş string döndürür. `??` boş string'i null
       * saymadığı için imleç 76px'lik BOŞ bir daireye büyürdü — etiketsiz,
       * sebepsiz. (Denetimde yakalandı, 2026-09-10.)
       */
      const yeni = yakin?.getAttribute("data-imlec") || null;
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
    /*
     * `gorunur` BİLEREK bağımlılıkta değil. Sonuç olarak yukarıdaki
     * `if (!gorunur)` guard'ı bayat bir closure okur ve hep `false` görür —
     * yani `setGorunur(true)` her fare hareketinde çağrılır. Zararsız: React
     * aynı değerde yeniden render etmez. Guard'ı "düzeltmek" için `gorunur`u
     * bağımlılığa eklemek İŞİ BOZAR — fare pencereden çıkıp geri girince
     * imleç bir daha görünmezdi. (Denetimde yakalandı, 2026-09-10.)
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const v = etiket === null ? null : (VARYANTLAR[etiket] ?? VARSAYILAN);
  const cap = v ? v.cap : NOKTA;

  return (
    <div
      ref={el}
      aria-hidden="true"
      className="imlec pointer-events-none fixed left-0 top-0 z-[60] hidden items-center justify-center rounded-full transition-[width,height,background-color,backdrop-filter,opacity] duration-300 ease-[var(--ease-lux)]"
      style={{
        width: cap,
        height: cap,
        opacity: gorunur ? 1 : 0,
        backgroundColor: v ? v.zemin : "var(--navy)",
        backdropFilter: v?.bulanik,
        // Safari 18 öncesi yalnız önekli sürümü tanır; yoksa blur hiç çıkmaz.
        WebkitBackdropFilter: v?.bulanik,
      }}
    >
      {/* PUNTO 12 — master'da hem "READ" hem "VISIT" 12px/400 ölçüldü.
          (Bir tur 15px'e çıkarılmıştı; Yakup 2026-09-10'da "ana temadaki read
          yazısı ile aynı boyutta olsun" diyerek geri istedi.)
          BÜYÜK HARF: master'ın etiketleri de büyük harf ("READ"/"VISIT");
          12px'te büyük harf küçük harften okunaklı da çıkıyor.
          Etiket küçükken de basılı kalıyor — metin sonradan doğmuyor, soluyor. */}
      <span
        /* RENK DE GEÇİŞTE: blog kartından portfolyo kartına doğrudan
           geçildiğinde zemin 300 ms'de değişirken yazı rengi anında
           zıplıyordu; o aralıkta beyaz yazı açık zeminde okunmuyordu. */
        className="select-none text-[12px] font-normal uppercase leading-none tracking-[0.08em] transition-[opacity,color] duration-200"
        style={{ color: v?.yazi, opacity: v ? 1 : 0 }}
      >
        {etiket}
      </span>
    </div>
  );
}
