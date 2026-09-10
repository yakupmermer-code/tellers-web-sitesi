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
  // KALIN (700): Yakup 2026-09-10 — "ziyaret et yazısı da bold olsun".
  // Master'da 400; blog etiketindekiyle aynı gerekçeyle bilinçli sapma.
  kalinlik: 700,
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

/**
 * İmlecin ALTINDAKİ zemin koyu mu?
 *
 * Yakup 2026-09-10: "mavilerin üstüne gelince, aşağıdaki blog kısmına geldiği
 * gibi beyaz olmalı; menüye tıklayınca da koyu mavi imleç kayboluyor."
 * Lacivert nokta lacivert zeminde görünmüyordu.
 *
 * Öğeden yukarı çıkıp İLK OPAK arka plan rengini bulur ve parlaklığına bakar.
 * Yarı saydam katmanlar (menü örtüsü `rgba(0,0,0,0.8)` gibi) 0,5 üstü alfada
 * zemin sayılır — altındaki her ne ise onu zaten bastırıyorlar.
 *
 * Fotoğraf/video üzerinde arka plan şeffaftır; orada ata zincirindeki kutu
 * rengi kazanır. Kusursuz değil ama Yakup'un bildirdiği iki durumu (lacivert
 * bölümler, menü örtüsü) doğru yakalıyor ve tek satırlık bakım gerektirmiyor.
 */
/*
 * Regex'ler MODÜL DÜZEYİNDE: `zeminKoyuMu` her fare hareketinde ve her kaydırma
 * karesinde çağrılıyor; gövdede tanımlansalar her çağrıda yeniden derlenirdi.
 *
 * 🔴 İKİ BİÇİM DE GEREKLİ. `getComputedStyle().backgroundColor` her zaman
 * `rgb()` döndürmüyor: Tailwind v4 opaklıklı renkleri (`bg-navy/70`,
 * `bg-black/80`) `oklab()` olarak üretiyor ve tarayıcı AYNEN geri veriyor —
 * bu projede canlıda ölçüldü: `oklab(0.205027 0.00304291 -0.108047 / 0.7)`.
 * Bir tur yalnız `rgb` aranıyordu; menü örtüsü ve opaklıklı lacivert kutular
 * sessizce "açık zemin" sayılıyor, imleç hiç beyaza dönmüyordu.
 *
 * 🟡 BİLİNEN SINIR: iki dal farklı ölçek kullanıyor — RGB dalı BT.601 luma,
 * oklab dalı algısal L. Orta tonlarda ayrışabilirler (`#767676` → luma 0,46
 * "koyu", oklab L 0,56 "açık"), yani `bg-x` ile `bg-x/80` zıt sonuç verebilir.
 * Bugün ısırmıyor çünkü palet uçlarda: `#0a0a47` ve beyaz/paper. Ara tonlu bir
 * marka rengi eklenirse burası gözden geçirilmeli. `color(srgb …)` biçimi de
 * yakalanmıyor (bugün üretilmiyor).
 */
const RGB =
  /^rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,/\s]+([\d.]+))?\)/;
const OKL = /^okl(?:ab|ch)\(\s*([\d.]+)(%?)[^/)]*(?:\/\s*([\d.]+))?/;

function zeminKoyuMu(baslangic: Element | null): boolean {
  let n: Element | null = baslangic;
  while (n && n !== document.documentElement) {
    const bg = getComputedStyle(n).backgroundColor;

    const r = RGB.exec(bg);
    if (r) {
      const alfa = r[4] === undefined ? 1 : parseFloat(r[4]);
      if (alfa > 0.5) {
        // ITU-R BT.601 parlaklık — gözün yeşile duyarlılığını hesaba katar
        return (0.299 * +r[1]! + 0.587 * +r[2]! + 0.114 * +r[3]!) / 255 < 0.5;
      }
    } else {
      const o = OKL.exec(bg);
      if (o) {
        const alfa = o[3] === undefined ? 1 : parseFloat(o[3]);
        if (alfa > 0.5) {
          // oklab/oklch'te İLK bileşen zaten algısal parlaklık (0-1 veya %)
          return (o[2] === "%" ? +o[1]! / 100 : +o[1]!) < 0.5;
        }
      }
    }

    n = n.parentElement;
  }
  return false;
}

export default function Imlec() {
  const [etiket, setEtiket] = useState<string | null>(null);
  const [koyu, setKoyu] = useState(false);
  const [gorunur, setGorunur] = useState(false);
  const el = useRef<HTMLDivElement>(null);
  const hedef = useRef({ x: -100, y: -100 });
  const simdi = useRef({ x: -100, y: -100 });
  const kare = useRef(0);
  /* Kaydırma oldu, altımızdaki öğe değişmiş olabilir — bir sonraki karede bak. */
  const tazele = useRef(false);
  /* `gorunur`un ref kopyası: rAF döngüsü ve dinleyiciler boş bağımlılıkla
     kuruluyor, state okusalardı bayat closure görürlerdi. */
  const gorunurRef = useRef(false);
  /* İmlecin altındaki son öğe — aynıysa yeniden hesaplamayı atlar. */
  const sonEl = useRef<Element | null>(null);

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

    /*
     * Altımızdaki öğeye göre etiket + zemin. `hedefEl` verilmezse imlecin son
     * konumundan `elementFromPoint` ile bulunur — KAYDIRMA yolu bunu kullanır.
     */
    /*
     * SON ÖĞE ÖNBELLEĞİ: aynı öğenin üstünde kalındığı sürece (kaydırırken
     * vakaların çoğu) ata zinciri taraması hiç çalışmaz. `elementFromPoint`
     * düzeni, `getComputedStyle` stil hesabını zorla tazeler; ikisini de kare
     * başına gereksiz yere ödememek için. (Denetim önerisi, 2026-09-10.)
     */
    const oku = (hedefEl: Element | null) => {
      if (hedefEl === sonEl.current) return;
      sonEl.current = hedefEl;
      const yakin = hedefEl?.closest?.("[data-imlec]");
      /*
       * `|| null`, `?? null` DEĞİL: `data-imlec=""` (ya da değeri hiç
       * yazılmamış nitelik) boş string döndürür. `??` boş string'i null
       * saymadığı için imleç 76px'lik BOŞ bir daireye büyürdü — etiketsiz,
       * sebepsiz. (Denetimde yakalandı, 2026-09-10.)
       */
      const yeni = yakin?.getAttribute("data-imlec") || null;
      setEtiket((o) => (o === yeni ? o : yeni));
      const k = zeminKoyuMu(hedefEl);
      setKoyu((o) => (o === k ? o : k));
    };

    const hareket = (e: PointerEvent) => {
      hedef.current = { x: e.clientX, y: e.clientY };
      if (!gorunurRef.current) {
        gorunurRef.current = true;
        setGorunur(true);
      }
      oku(e.target as Element | null);
    };
    const cik = () => {
      gorunurRef.current = false;
      setGorunur(false);
    };

    /*
     * 🔴 KAYDIRMA DA İMLECİ TAZELER. Yakup 2026-09-10: "master temada aşağı
     * doğru scroll ile giderken neyin üstüne gelirse ona göre değişkenlik
     * gösteriyor; bizde ise mouse'u sağa sola hareket ettirmem gerekiyor."
     * Sebep: yalnız `pointermove` dinleniyordu. Sayfa kayarken fare durduğu
     * yerde kalır, olay hiç doğmaz — imleç altındaki içerik değişse bile eski
     * etikette donup kalıyordu.
     * Kaydırmada doğrudan hesap YAPMIYORUZ, bayrak koyuyoruz: kaydırma karede
     * onlarca kez tetiklenir, `elementFromPoint` + zemin taraması kare başına
     * en fazla BİR kez çalışsın.
     */
    const kaydi = () => {
      tazele.current = true;
    };

    /*
     * Yumuşak takip (lerp). Doğrudan konum atamak imleci "yapışkan" ve sert
     * gösteriyor; master'da da hafif bir gecikme var. Hareketi azaltılmış
     * tercihte gecikme YOK — kayan bir nokta orada rahatsız edici olur.
     */
    const dongu = () => {
      /*
       * Fare sayfaya hiç girmediyse `hedef` hâlâ {-100,-100}; orada
       * `elementFromPoint` null döner ve etiketi boşuna sıfırlardık.
       */
      if (tazele.current) {
        tazele.current = false;
        if (gorunurRef.current) {
          oku(document.elementFromPoint(hedef.current.x, hedef.current.y));
        }
      }
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
    window.addEventListener("scroll", kaydi, { passive: true });
    document.addEventListener("pointerleave", cik);
    window.addEventListener("blur", cik);

    return () => {
      kok.classList.remove("imlec-acik");
      cancelAnimationFrame(kare.current);
      window.removeEventListener("pointermove", hareket);
      window.removeEventListener("scroll", kaydi);
      document.removeEventListener("pointerleave", cik);
      window.removeEventListener("blur", cik);
    };
    /*
     * Bağımlılık listesi BOŞ ve öyle kalmalı: dinleyiciler bir kez kurulup
     * bileşen sökülene kadar yaşıyor. Görünürlük durumu bu yüzden state'ten
     * değil `gorunurRef`ten okunuyor — state okunsaydı bayat closure hep
     * `false` görürdü. (Bir tur guard gerçekten bayattı; zararsızdı ama
     * kaydırma tazelemesi eklenince ref'e ihtiyaç doğdu.)
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const v = etiket === null ? null : (VARYANTLAR[etiket] ?? VARSAYILAN);
  const cap = v ? v.cap : NOKTA;
  /*
   * KOYU ZEMİNDE TERSLE. Yalnız LACİVERT kullanan durumlar terslenir: boştaki
   * nokta ve "Ziyaret Et" varyantı. "Oku" varyantı zaten beyaz + bulanık,
   * koyu zeminde de okunuyor — ona dokunmak master'dan sapma olurdu.
   */
  const tersle = koyu && (!v || v.zemin === "var(--navy)");
  const zemin = tersle ? "#ffffff" : v ? v.zemin : "var(--navy)";
  const yaziRengi = tersle ? "var(--navy)" : v?.yazi;

  return (
    <div
      ref={el}
      aria-hidden="true"
      /* `overflow-hidden`: "ZİYARET" 12px'te ~54px sürüyor ve 76px'lik
         dairenin iç genişliği `px-1` ile 68px — pay ~13px. Avenir Next
         CDN'den gelmezse yedek yazı tipinde bile ~58px sürüyor, yine sığıyor.
         Yine de emniyet kemeri: taşarsa metin dairenin DIŞINA beyaz olarak
         çıkardı (denetimde yakalandı). Kırpmak, taşmaktan iyi. */
      className="imlec pointer-events-none fixed left-0 top-0 z-[60] hidden items-center justify-center overflow-hidden rounded-full transition-[width,height,background-color,backdrop-filter,opacity] duration-300 ease-[var(--ease-lux)]"
      style={{
        width: cap,
        height: cap,
        opacity: gorunur ? 1 : 0,
        backgroundColor: zemin,
        backdropFilter: v?.bulanik,
        // Safari 18 öncesi yalnız önekli sürümü tanır; yoksa blur hiç çıkmaz.
        WebkitBackdropFilter: v?.bulanik,
      }}
    >
      {/* PUNTO ARTIK VARYANTTAN GELİYOR. Master ikisini de 12px/400 basıyor
          ama Yakup 2026-09-10'da blog etiketini bilerek büyütüp kalınlaştırdı
          ("içindeki oku yazısını bol yap ve büyüt") → 20px/700. Portfolyo
          etiketi de kalınlaştı (12px/700) ama puntosu master'daki 12'de
          kaldı — iki kelime olduğu için daireye ancak o boyda sığıyor.
          DAİRELER master ölçüsünde (120/76) — "yuvarlağı büyütme".
          BÜYÜK HARF: master'ın etiketleri de büyük harf ("READ"/"VISIT").
          Etiket küçükken de basılı kalıyor — metin sonradan doğmuyor, soluyor. */}
      <span
        /* RENK DE GEÇİŞTE: blog kartından portfolyo kartına doğrudan
           geçildiğinde zemin 300 ms'de değişirken yazı rengi anında
           zıplıyordu; o aralıkta beyaz yazı açık zeminde okunmuyordu.
           ORTALI + SARMALI: "Ziyaret Et" iki kelime, 76px daireye tek satır
           sığmıyor; `leading-[1.15]` iki satırı sıkıştırmadan tutuyor.
           `px-1` (px-2 DEĞİL): etiket kalınlaşınca "ZİYARET" ~%7 daha geniş
           sürüyor. px-2'de iç genişlik 60px kalıyor ve pay 2px'e iniyordu;
           px-1 ile iç genişlik 68px, pay ~10px. */
        className="select-none px-1 text-center uppercase leading-[1.15] tracking-[0.08em] transition-[opacity,color] duration-200"
        style={{
          color: yaziRengi,
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
