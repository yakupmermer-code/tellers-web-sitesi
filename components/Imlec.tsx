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
 *                     etiket "VISIT" 12px / 400  (bizde "Ziyaret Et")
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
  /** Etiket puntosu, px. */
  punto: number;
  /** Etiket kalınlığı (CSS font-weight). */
  kalinlik: number;
};

/*
 * Portfolyo/proje kartlarının varyantı — hem haritada hem VARSAYILAN'da.
 * Etiket "Ziyaret Et" (Yakup 2026-09-10: "ana sayfada ziyaret et yazacak,
 * VISIT'in karşı anlamı olarak"). İki kelime 76px'lik daireye TEK satır
 * sığmıyor; ortalanıp iki satıra sarılıyor, punto master'daki 12'de kalıyor.
 */
const ZIYARET: Varyant = {
  cap: 76,
  zemin: "var(--navy)",
  yazi: "#ffffff",
  punto: 12,
  kalinlik: 400,
};

/**
 * ETİKET → GÖRÜNÜM. Master'da ölçülen iki durum birebir burada.
 * Haritada olmayan bir etiket gelirse portfolyo varyantına düşer — sessizce
 * 24px'lik noktada kalıp etiketi görünmez kılmaktan iyidir.
 */
const VARYANTLAR: Record<string, Varyant> = {
  /*
   * master: 120px, rgba(255,255,255,0.6), blur(8px), etiket "READ" 12px/400.
   * DAİRE master ölçüsünde (120px) — Yakup 2026-09-10: "yuvarlağı büyütme".
   * ETİKET master'dan BİLİNÇLİ SAPMA: "içindeki oku yazısını bol yap ve
   * büyüt" → 20px/700. Tek kelime olduğu için 120px'e rahat sığıyor.
   */
  Oku: {
    cap: 120,
    zemin: "rgba(255,255,255,0.6)",
    bulanik: "blur(8px)",
    yazi: "var(--navy)",
    punto: 20,
    kalinlik: 700,
  },
  // master: 76px, marka rengi, bulanıklık yok — "VISIT"
  "Ziyaret Et": ZIYARET,
};

/*
 * VARSAYILAN doğrudan sabite bağlı, `VARYANTLAR["Ziyaret Et"]` ARAMASINA değil.
 * Aramaya bağlı olsaydı biri anahtarı yeniden adlandırdığında derleme yine
 * geçer, imleç yalnız ÇALIŞMA ANINDA çökerdi (denetimde yakalandı).
 */
const VARSAYILAN: Varyant = ZIYARET;

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
      /* `overflow-hidden`: "ZİYARET" 12px'te ~54px sürüyor ve 76px'lik
         dairenin iç genişliği 60px — pay ~6px. Avenir Next CDN'den gelmezse
         yedek yazı tipinde pay 2,6px'e iniyor; taşarsa metin dairenin DIŞINA
         beyaz olarak çıkardı (denetimde yakalandı). Kırpmak, taşmaktan iyi. */
      className="imlec pointer-events-none fixed left-0 top-0 z-[60] hidden items-center justify-center overflow-hidden rounded-full transition-[width,height,background-color,backdrop-filter,opacity] duration-300 ease-[var(--ease-lux)]"
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
      {/* PUNTO ARTIK VARYANTTAN GELİYOR. Master ikisini de 12px/400 basıyor
          ama Yakup 2026-09-10'da blog etiketini bilerek büyütüp kalınlaştırdı
          ("içindeki oku yazısını bol yap ve büyüt") → 20px/700. Portfolyo
          etiketi 12px/400'de kaldı. DAİRELER master ölçüsünde (120/76) —
          "yuvarlağı büyütme".
          BÜYÜK HARF: master'ın etiketleri de büyük harf ("READ"/"VISIT").
          Etiket küçükken de basılı kalıyor — metin sonradan doğmuyor, soluyor. */}
      <span
        /* RENK DE GEÇİŞTE: blog kartından portfolyo kartına doğrudan
           geçildiğinde zemin 300 ms'de değişirken yazı rengi anında
           zıplıyordu; o aralıkta beyaz yazı açık zeminde okunmuyordu.
           ORTALI + SARMALI: "Ziyaret Et" iki kelime, 76px daireye tek satır
           sığmıyor; `leading-[1.15]` iki satırı sıkıştırmadan tutuyor. */
        className="select-none px-2 text-center uppercase leading-[1.15] tracking-[0.08em] transition-[opacity,color] duration-200"
        style={{
          color: v?.yazi,
          opacity: v ? 1 : 0,
          fontSize: v ? v.punto : 12,
          fontWeight: v ? v.kalinlik : 400,
        }}
      >
        {etiket}
      </span>
    </div>
  );
}
