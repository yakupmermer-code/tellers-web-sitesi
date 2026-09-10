"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import HeroZoom from "@/components/HeroZoom";

/**
 * ANA SLIDER — marka tanıtım filmi (YouTube gömme).
 *
 * Revize dökümanının İLK maddesi: "Marka Tanıtım Filmi:
 * https://youtu.be/vQM3s2a7h64". Yakup 2026-09-10'da gömme kodunu verdi:
 * "vereceğim youtube videosunu slider alanına yerleştir" + "ölçüler bizim
 * slider boyutunda olsun" + "slider aşağı kaydırıldığında videonun ve sesinin
 * durması gerekli".
 *
 * Yerini aldığı bileşen: `components/HeroVideo.tsx` (geçici Higgsfield
 * videosu). O dosya SİLİNMEDİ — gömme bir gün geri alınırsa hazır duruyor.
 *
 * 🔴 NEDEN `youtube-nocookie.com`: Yakup'un verdiği kod `youtube.com/embed`
 * idi. O adres ziyaretçiye daha sayfa açılırken izleme çerezi yazar; KVKK ve
 * GDPR'da bu, önceden rıza gerektiren bir işlemdir ve sitede çerez onayı yok.
 * `youtube-nocookie.com` aynı videoyu çerez YAZMADAN oynatır. (Tam uyum için
 * "tıkla-oynat" perdesi gerekirdi ama o zaman video kendiliğinden başlamazdı.)
 *
 * 🔴 NEDEN SESSİZ BAŞLIYOR: Chrome, Safari ve Firefox, kullanıcı sayfayla
 * etkileşime girmeden SESLİ otomatik oynatmayı engeller. `mute=1` olmasaydı
 * video hiç başlamazdı. Ses, aşağıdaki düğmeyle açılır.
 *
 * SAYDAMLIK YOK: bir tur `opacity-80` vardı (eski yerel videodan miras).
 * Yakup 2026-09-10: "video asıl renkleri belli olmuyor" — kaldırıldı, video
 * kendi renkleriyle basılıyor.
 *
 * ÖLÇÜ — "bizim slider boyutunda": iframe `object-fit: cover` desteklemez,
 * 16:9 oranını korumak zorundadır. Bu yüzden klasik kapla-taşır hesabı:
 *   genişlik 177,78cqh (=16/9 x kap yüksekliği) ama en az kabın tamamı
 *   yükseklik  56,25cqw (= 9/16 x kap genişliği) ama en az kabın tamamı
 * ikisi birden merkezlenince video kabı boşluksuz doldurur, taşan kısım
 * kırpılır — yani `object-cover` davranışının birebir karşılığı.
 */

const VIDEO_ID = "vQM3s2a7h64";
const KAYNAK = "https://www.youtube-nocookie.com";

/*
 * enablejsapi=1 → postMessage ile durdur/oynat/ses komutu gönderebilmek için.
 * controls=0 · rel=0 bitişte yabancı video önermesin · iv_load_policy=3
 * anotasyon yok · disablekb=1 klavye kısayolları kapalı · fs=0 tam ekran yok.
 *
 * 🔴 `loop=1&playlist=` BİLEREK YOK. YouTube tek videoyu döndürmek için
 * playlist'e videonun kendi kimliğinin yazılmasını ister — ama o parametre
 * oynatıcıya "bu bir oynatma listesi" dedirtip ORTAYA İLERİ/GERİ OKLARI
 * bastırıyor. Yakup 2026-09-10: "video başlarken ortasında play ve sağa sola
 * işaretleri çıkıyor, onu da kaldırmamız gerekli." Döngü artık aşağıda JS ile:
 * video bitince (`onStateChange` info 0) yeniden oynatılıyor.
 */
const GOMME =
  `${KAYNAK}/embed/${VIDEO_ID}` +
  `?autoplay=1&mute=1` +
  `&controls=0&playsinline=1&rel=0&modestbranding=1&fs=0` +
  `&enablejsapi=1&disablekb=1&iv_load_policy=3`;

export default function HeroYouTube({ className }: { className?: string }) {
  const cerceve = useRef<HTMLIFrameElement>(null);
  const kok = useRef<HTMLDivElement>(null);
  const [sesli, setSesli] = useState(false);
  const [duraklatildi, setDuraklatildi] = useState(false);
  /*
   * Oynatma GERÇEKTEN başladı mı. iframe bu olana kadar saydam duruyor:
   * YouTube açılışta ortada büyük bir oynat düğmesi ve marka arayüzü basıyor,
   * `controls=0` onu engellemiyor. Yakup 2026-09-10: "video başlarken ortasında
   * play ... işaretleri çıkıyor, onu da kaldırmamız gerekli."
   */
  const [oynuyor, setOynuyor] = useState(false);
  /* Kullanıcı elle durdurduysa, hero'ya geri dönünce KENDİLİĞİNDEN başlamasın. */
  const elleDurduruldu = useRef(false);
  /* Hero şu an ekranda mı — sekmeden dönünce oynatıp oynatmamaya karar verir. */
  const heroGorunur = useRef(true);
  /* Ses durumu ref'te de tutuluyor: `uygula` boş bağımlılıkla kuruluyor ve
     state'i okusaydı bayat closure görürdü. */
  const sesliRef = useRef(false);
  /* Oyuncudan en az bir mesaj geldi mi — el sıkışma tekrarını durdurur. */
  const mesajGeldi = useRef(false);
  /* Son görülen oynatıcı durumu — aynı durumun tekrarını yutar. */
  const sonDurum = useRef<number | null>(null);
  /* Duraklatınca kurulan geri-açma zamanlayıcısı (aşağıdaki gerekçeye bak). */
  const gizlemeAgi = useRef<number | null>(null);

  /*
   * 🔴 KOMUT DEĞİL, İSTENEN DURUM UYGULANIYOR.
   *
   * Ham `postMessage` ile gönderilen YouTube komutları KUYRUĞA ALINMAZ: oyuncu
   * yüklenmemişse mesaj sessizce düşer, hata da vermez. Somut kırılma: tarayıcı
   * sayfa yenilemede kaydırma konumunu geri yükler; hero ekran dışındayken
   * IntersectionObserver `pauseVideo` yollar, komut kaybolur, sonra URL'deki
   * `autoplay=1` devreye girer ve video EKRAN DIŞINDA oynar.
   *
   * Bir tur bunun için tek slotluk bir kuyruk yazılmıştı. YETMİYORDU: komutlar
   * İKİ bağımsız eksende (oynatma ve ses) ve tek slot birini diğerine eziyordu
   * — kullanıcı hazır olmadan sesi açsa `unMute` kuyruğa girip hemen ardından
   * gelen `pauseVideo` ile siliniyordu; düğme "ses açık" derken video sessiz
   * kalıyordu. Ayrıca `onLoad` ikinci kez tetiklenirse (bfcache dönüşü) kuyruk
   * boş olduğu için hiçbir şey uygulanmıyor, `autoplay=1` yeniden çalışıyordu.
   *
   * Çözüm komut biriktirmek değil, HER FIRSATTA istenen durumu ref'lerden
   * türetip uygulamak: idempotent, yarış durumu yok, kaç kez çağrıldığı
   * önemsiz. (Denetimde yakalandı, 2026-09-10.)
   */
  /* Oyuncuya "durum olaylarını bana yolla" de — `onStateChange` mesajları
     ancak bundan sonra gelir. */
  const dinlemeyeBasla = useCallback(() => {
    /*
     * 🔴 `hazir` KONTROLÜ YOK, HATA YUTULUYOR. Bir tur el sıkışması `onLoad`
     * bayrağına bağlıydı; ölçümde `onLoad`ın hiç tetiklenmediği durumlar
     * çıktı (canlıda 18 sn sonra YouTube'dan SIFIR mesaj gelmişti) ve
     * `listening` hiç gönderilmediği için `infoDelivery` akışı hiç başlamadı
     * → JS döngüsü ölü kaldı, video bir kez oynayıp durdu (Yakup bildirdi:
     * "video tekrar oynamıyor").
     * iframe henüz `about:blank` ise postMessage `targetOrigin` uyuşmazlığı
     * fırlatır; onu yutup bir sonraki denemede tekrar deniyoruz. Hazır
     * olmadığını tahmin etmeye çalışmaktansa denemek daha sağlam.
     */
    try {
      cerceve.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "listening" }),
        KAYNAK,
      );
    } catch {
      /* iframe daha yüklenmedi — sonraki tur dener */
    }
  }, []);

  const gonder = useCallback((func: string) => {
    try {
      cerceve.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func, args: [] }),
        KAYNAK,
      );
    } catch {
      /* iframe daha yüklenmedi; durum bir sonraki `uygula`da tazelenir */
    }
  }, []);

  const uygula = useCallback(() => {
    /*
     * `hazir` KOŞULU KALDIRILDI (2026-09-10): `onLoad` tetiklenmediğinde bu
     * koşul bütün komutları susturuyordu — kaydırınca durdurma da dahil.
     * Komut kaybolursa zararsız: durum her fırsatta yeniden uygulanıyor.
     */
    if (!cerceve.current?.contentWindow) return;
    gonder(
      !elleDurduruldu.current && heroGorunur.current && !document.hidden
        ? "playVideo"
        : "pauseVideo",
    );
    gonder(sesliRef.current ? "unMute" : "mute");
  }, [gonder]);

  /*
   * OYNATICIDAN GELEN DURUM. İki iş yapıyor:
   *   info 1 (playing) → iframe'i görünür kıl (açılış arayüzü artık geçti)
   *   info 0 (ended)   → yeniden oynat; `playlist` parametresi olmadan döngü
   *                      böyle kuruluyor (yukarıdaki gerekçeye bak)
   *
   * 🔴 İKİ AŞAMALI DOĞRULAMA: hem `origin` hem `source`. Sayfaya herhangi bir
   * pencere/çerçeve mesaj yollayabilir; origin kontrolü olmadan yabancı bir
   * kaynak bu bileşenin durumunu sürebilirdi.
   */
  /*
   * EL SIKIŞMA TEKRARI. `{"event":"listening"}` tek sefer gönderilse
   * yetmeyebilir: `onLoad` gömme BELGESİNİN yüklendiğini söyler, oyuncunun
   * postMessage dinleyicisini kurduğunu değil. Erken giden mesaj sessizce
   * düşer, `onStateChange` hiç gelmez ve JS döngüsü ölür — video bir kez
   * oynayıp donar, üstelik HATA DA VERMEZ (sessiz bozulma).
   * Oyuncudan ilk cevap gelir gelmez duruyoruz; en fazla 10 deneme.
   * (Denetimde yakalandı, 2026-09-10.)
   */
  useEffect(() => {
    /*
     * 20 deneme x 500 ms = 10 saniye. Oyuncudan ilk cevap gelir gelmez duruyor.
     * Bir tur `hazir` bayrağına bağlıydı ve o bayrak set edilmeyince el sıkışma
     * HİÇ denenmiyordu; artık iframe yüklenene kadar denemeye devam ediyor
     * (başarısız denemeler `dinlemeyeBasla` içinde yutuluyor).
     */
    let kalan = 20;
    const id = window.setInterval(() => {
      if (mesajGeldi.current || --kalan <= 0) {
        window.clearInterval(id);
        return;
      }
      dinlemeyeBasla();
    }, 500);
    return () => window.clearInterval(id);
  }, [dinlemeyeBasla]);

  /*
   * 🔴 DÖNGÜ GÜVENCESİ — MESAJ AKIŞINDAN BAĞIMSIZ.
   *
   * Aşağıdaki `infoDelivery` dinleyicisi videoyu bitince yeniden başlatıyor,
   * AMA tamamen YouTube'un mesaj göndermesine bağlı. Bu zincir bir kez zaten
   * koptu: el sıkışma `onLoad`a bağlıydı, `onLoad` tetiklenmedi, hiç mesaj
   * gelmedi ve video bir kez oynayıp durdu (Yakup: "video tekrar oynamıyor").
   * Zincirin bir halkasını düzeltmek yetmez — zincire hiç bağlı olmayan bir
   * güvence gerekiyor.
   *
   * `uygula()` istenen DURUMU yolluyor, kör bir "oynat" komutu değil:
   *   · video zaten oynuyorsa `playVideo` YouTube tarafından yok sayılır
   *   · video bittiyse baştan başlatır (en fazla 3 sn gecikmeyle)
   *   · kullanıcı elle duraklattıysa `pauseVideo` gider, duraklalı KALIR
   *   · hero ekranda değilse ya da sekme gizliyse yine `pauseVideo` gider
   * Yani periyodik çağrı hiçbir kullanıcı kararını ezmiyor; yalnızca kayan
   * durumu geri hizalıyor. Maliyeti 3 saniyede bir postMessage.
   *
   * Mesaj akışı çalıştığında döngü ZATEN anında dönüyor; bu yalnızca akış
   * kopduğunda videonun donmasını engelliyor.
   */
  useEffect(() => {
    const id = window.setInterval(uygula, 3000);
    return () => window.clearInterval(id);
  }, [uygula]);

  /*
   * 🔴 GÖRÜNÜRLÜK GÜVENLİK AĞI — `onLoad`'DAN BAĞIMSIZ OLMAK ZORUNDA.
   * Bir tur bu zamanlayıcı `onLoad` içindeydi. Ölçümde `onLoad`ın hiç
   * tetiklenmediği bir durum yakalandı (arka plan sekmesi): 16 saniye sonra
   * bile iframe `opacity: 0` kaldı, yani HERO TAMAMEN BOŞ göründü. Oynatma
   * gerçekten başlamasa bile (iOS düşük güç modu, veri tasarrufu, ağ engeli)
   * video en geç 4 saniyede görünür olmalı: YouTube'un açılış arayüzünü
   * gizlemek uğruna videoyu hiç göstermemeyi göze alamayız.
   */
  useEffect(() => {
    const t = window.setTimeout(() => setOynuyor(true), 4000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const dinle = (e: MessageEvent) => {
      if (e.origin !== KAYNAK) return;
      if (e.source !== cerceve.current?.contentWindow) return;
      let veri: unknown;
      try {
        veri = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      mesajGeldi.current = true;
      const d = veri as { event?: string; info?: unknown };

      /*
       * 🔴 GERÇEK OLAY ADI `infoDelivery`, `onStateChange` DEĞİL.
       * Bir tur yalnız `onStateChange` aranıyordu ve dinleyicinin tamamı ÖLÜ
       * KODDU. Güvenlik denetiminde gerçek Chrome + gerçek gömme ile 22 sn
       * ölçüldü: gelen olaylar `initialDelivery`, `onReady`, `infoDelivery`,
       * `alreadyInitialized` — `onStateChange` HİÇ GELMEDİ. O ad, resmî
       * `iframe_api` JS sarmalayıcısının (YT.Player) kendi tüketicisine
       * verdiği addır; ham postMessage kanalında yoktur. Durum
       * `infoDelivery.info.playerState` içinden geliyor (ölçülen dizi:
       * 1 → 3 → 1 → 0).
       * `onStateChange` yine de kabul ediliyor: bir gün yayınlanmaya
       * başlarsa kod kendiliğinden çalışsın.
       */
      let durum: unknown;
      if (d?.event === "onStateChange") durum = d.info;
      else if (d?.event === "infoDelivery")
        durum = (d.info as { playerState?: unknown } | null)?.playerState;
      else return;

      /*
       * TEKRAR YUTMA ŞART: `infoDelivery` oynarken saniyede ~4 kez geliyor
       * (denetimde 16 sn'de 62 mesaj ölçüldü). Guard olmasa aynı
       * `playerState: 0` art arda gelip üst üste `uygula()` çağırırdı.
       */
      if (typeof durum !== "number" || durum === sonDurum.current) return;
      sonDurum.current = durum;

      if (durum === 1) {
        if (gizlemeAgi.current) {
          window.clearTimeout(gizlemeAgi.current);
          gizlemeAgi.current = null;
        }
        setOynuyor(true);
      }
      /*
       * DURAKLATILINCA GİZLE (2026-09-10, Yakup ekran kaydıyla bildirdi:
       * "videoda çıkan pause işareti var, onu da kaldırmamız gerekli").
       * `controls=0` YouTube'un ORTADA bastığı duraklama göstergesini
       * engellemiyor. En çok şu akışta görünüyor: kullanıcı aşağı kaydırıyor →
       * biz `pauseVideo` yolluyoruz → YouTube ortaya pause işaretini basıyor →
       * kullanıcı yukarı dönünce onu görüyor. İframe'i saydamlaştırmak işareti
       * de birlikte gizliyor; video yeniden oynayınca (durum 1) geri açılıyor.
       */
      if (durum === 2) {
        setOynuyor(false);
        /*
         * 🔴 GİZLEME TEK YÖNLÜ KALMAMALI. `oynuyor` bayrağını false'a çekmek
         * hero'yu degradeye döndürüyor; onu geri açan tek yol `durum === 1`.
         * Sonraki `playVideo` düşerse (iframe hazır değil, mesaj kayboldu,
         * otomatik oynatma politikası araya girdi) hero KALICI olarak boş
         * kalırdı ve iframe `pointer-events-none` olduğu için ziyaretçinin
         * videoyu açacak doğal bir yolu yok. 5 saniye içinde oynatma
         * başlamazsa donmuş kareyi göstermek, boş degradeden iyidir.
         * (Denetimde yakalandı, 2026-09-10.)
         */
        if (gizlemeAgi.current) window.clearTimeout(gizlemeAgi.current);
        gizlemeAgi.current = window.setTimeout(() => setOynuyor(true), 5000);
      }
      /*
       * 🔴 `uygula()`, `gonder("playVideo")` DEĞİL. Ham komut bu dosyanın kendi
       * kuralını çiğniyordu (yukarıdaki "komut değil, istenen durum" notu):
       * `elleDurduruldu`, `heroGorunur` ve `document.hidden` üçünü de atlıyor.
       * Ulaşılabilir kırılma: video biterken kullanıcı hero'dan aşağı
       * kaydırıyor — IntersectionObserver `pauseVideo` yolluyor ama aynı anda
       * gelen `ended` koşulsuz `playVideo` yolluyor ve video EKRAN DIŞINDA
       * sonsuza kadar oynamaya devam ediyor (gözlemci bir daha tetiklenmez).
       * `uygula()` döngüyü kurar ama üç kararı da gözetir. (Denetimde
       * yakalandı, 2026-09-10.)
       */
      if (durum === 0) uygula();
    };
    window.addEventListener("message", dinle);
    return () => {
      window.removeEventListener("message", dinle);
      if (gizlemeAgi.current) window.clearTimeout(gizlemeAgi.current);
    };
  }, [uygula]);

  /*
   * SLIDER EKRANDAN ÇIKINCA DUR (Yakup'un isteği).
   * Sesi ayrıca kısmaya gerek yok: `pauseVideo` sesi de durdurur. Eşik 0,2 —
   * hero'nun beşte biri bile görünmüyorsa durur.
   */
  useEffect(() => {
    const el = kok.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const gozcu = new IntersectionObserver(
      ([giris]) => {
        heroGorunur.current = giris.isIntersecting;
        uygula();
      },
      { threshold: 0.2 },
    );
    gozcu.observe(el);
    return () => gozcu.disconnect();
  }, [uygula]);

  /*
   * Sekme arka plana geçerse sussun — başka sekmede çalan ses rahatsız eder.
   * GERİ DÖNÜNCE DEVAM ETSİN: bir tur yalnız duraklatıyordu, dönüşte hiçbir
   * şey olmuyordu ve IntersectionObserver de yeniden tetiklenmiyordu (kesişim
   * değişmemiş oluyor) — video kalıcı duruyordu. Üstelik düğme hâlâ "oynuyor"
   * gösterdiği için kullanıcının OYNATMAK için iki kez basması gerekiyordu.
   * Proje zaten `components/VideoGorunurluk.tsx` içinde aynı kalıbı
   * (görününce devam ettir) kullanıyor. (Denetimde yakalandı.)
   */
  useEffect(() => {
    document.addEventListener("visibilitychange", uygula);
    return () => document.removeEventListener("visibilitychange", uygula);
  }, [uygula]);

  return (
    /*
     * 🔴 BURAYA `relative` YAZMA. Kullanan taraf `absolute inset-0` veriyor;
     * ikisi de `position` özelliği ve Tailwind'in çıktı sırasında `relative`
     * SONRA geldiği için o kazanıyordu. Sonuç: bu kutu `position: relative`
     * olup normal akışa düşüyor, TÜM çocukları `absolute` olduğu için de
     * yüksekliği/genişliği 0'a iniyordu. Zincir oradan bozuluyordu:
     * kök 0x0 → HeroZoom 0x0 → motion.div 0x0 → iframe'in `min-w-full`i
     * (%100 x 0) devre dışı kalıyor ve video kabı DOLDURMUYORDU. Açılıştaki
     * 1.28 ölçek bunu geçici olarak örttüğü için gözle fark edilmiyordu.
     * (Canlı ölçümde yakalandı, 2026-09-10.)
     * Konumlandırmayı kullanan taraf verir; burada yalnız kırpma var.
     */
    <div
      ref={kok}
      /*
       * `container-type: size` — aşağıdaki cover hesabı `cqw`/`cqh` ile BU
       * KUTUdan ölçsün diye. Asıl kazanç `vw` → `cqw`: `vw` kaydırma çubuğunu
       * İÇERİR, kap içermez; Windows/Linux Chrome'da oran kayıp YouTube ince
       * siyah bant basıyordu. `dvh` → `cqh` ise tutarlılık için — mobilde adres
       * çubuğu oynamasını ÇÖZMEZ (kabın yüksekliği zaten `min-h-[100dvh]`den
       * geliyor, adres çubuğu hareket edince kap da cqh de değişir).
       * 🔴 KULLANAN TARAF `absolute inset-0` VERMEK ZORUNDA: `container-type`
       * boyutu içerikten almıyor; konumlandırma verilmezse kutu 0x0'a çöker ve
       * HATA VERMEZ, video sessizce görünmez olur. (Denetimde yakalandı.)
       */
      className={`[container-type:size] overflow-hidden ${className ?? ""}`}
    >
      {/* iframe yüklenemezse (ağ engeli, kurumsal güvenlik duvarı, YouTube
          erişilemez) arkada bu degrade kalır — hero boş siyah olmaz. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-navy via-[#12124f] to-[#050530]"
      />

      {/* HeroZoom YALNIZ iframe'i sarıyor: kontrol düğmeleri dışarıda kaldı,
          yoksa açılıştaki 1.28 ölçek onları da büyütüp kaydırırdı. */}
      <HeroZoom className="absolute inset-0">
        <iframe
          ref={cerceve}
          src={GOMME}
          title="tellers marka tanıtım filmi"
          /* Klavyeyle sekme sırasında atlansın: `pointer-events-none` fareyi
             kesiyor ama odağı kesmiyordu; Tab ile görünmez oyuncuya
             giriliyordu. */
          tabIndex={-1}
          /* `onLoad` artık bir BAYRAK KURMUYOR, yalnız erken bir deneme.
             Asıl el sıkışma yukarıdaki aralıklı döngüde; `onLoad`ın hiç
             tetiklenmediği durumlar ölçüldüğü için ona güvenilmiyor. */
          onLoad={() => {
            dinlemeyeBasla();
            uygula();
          }}
          /* `allow` DARALTILDI: iframe `pointer-events-none` ve `controls=0`,
             yani kullanıcı oynatıcıya hiç tıklayamıyor — `picture-in-picture`
             ve `web-share` kullanılamaz izinlerdi. `web-share` özellikle
             gereksiz: `navigator.share()` yetkisini üçüncü tarafa devrederdi.
             `sandbox` üstüne bedava bir kilit: iframe artık üst pencereyi
             yönlendiremez, popup açamaz. `allow-scripts` + `allow-same-origin`
             birlikteliği burada güvenli — o bilinen uyarı, framelenen içerik
             ana sayfayla AYNI origin olduğunda geçerli; burası cross-origin.
             (Güvenlik denetiminde temiz profilde test edildi: oynatıcı
             çalışıyor, 0 CSP ihlali, 0 çerez.)

             🔴 `allow-same-origin` TOKEN'INI SİLME. Sandbox bu token'ı
             içerdiği için gömme belgesi gerçek origin'ini koruyor ve gelen
             mesajlarda `e.origin` = "https://www.youtube-nocookie.com" olarak
             geliyor (gerçek tarayıcıda ölçüldü). Token silinirse origin opak
             ("null") olur; aşağıdaki dinleyici TÜM mesajları eler ve hem
             döngü hem açılış geçişi SESSİZCE ölür. */
          sandbox="allow-scripts allow-same-origin allow-presentation"
          allow="autoplay; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
          /* pointer-events-none: tıklama hero'nun kendi metnine/bağlantısına
             gitsin. Gömme tıklanabilir kalsaydı ziyaretçi kazara YouTube'a
             çıkabilir ya da videoyu duraklatabilirdi. */
          className={`pointer-events-none absolute left-1/2 top-1/2 h-[56.25cqw] min-h-full w-[177.78cqh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0 transition-opacity duration-700 ease-[var(--ease-lux)] ${
            oynuyor ? "opacity-100" : "opacity-0"
          }`}
        />
      </HeroZoom>

      {/*
       * SES + DURAKLAT DÜĞMELERİ.
       * Duraklat WCAG 2.2.2'nin (Duraklat/Durdur/Gizle) gereği: 5 saniyeden
       * uzun, kendiliğinden oynayan hareketli içerik için görünür bir kontrol
       * şart. Ses düğmesi ayrıca 1.4.2'yi (Ses Denetimi) karşılıyor.
       * `sm:` altında da duruyorlar; küçük ama 44px dokunma hedefinde.
       */}
      <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2 md:bottom-8 md:right-8">
        {/* ZEMİN `bg-navy/70`, /40 DEĞİL: karartma katmanı kalkınca düğmeler
            doğrudan videonun üstünde kaldı. Beyaz bir karede /40 zemin ikonla
            2,65:1 kontrast veriyordu — WCAG 1.4.11 en az 3:1 ister. /70 ile
            ~5:1. İki 44px'lik daire olduğu için videoyu da kapatmıyor.
            İKONLAR SVG: bir tur emoji (🔊/🔇) kullanılmıştı; emoji çoğu
            işletim sisteminde RENKLİ çizilir, `text-white` işlemez ve yanındaki
            metin sembolüyle uyumsuz görünürdü. (İkisi de denetimde yakalandı.) */}
        <button
          type="button"
          onClick={() => {
            const yeni = !sesli;
            sesliRef.current = yeni;
            setSesli(yeni);
            uygula();
          }}
          aria-pressed={sesli}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-navy/70 text-white backdrop-blur-sm transition-colors duration-500 hover:bg-navy"
        >
          <span className="sr-only">{sesli ? "Sesi kapat" : "Sesi aç"}</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 5 6 9H3v6h3l5 4V5Z" />
            {sesli ? (
              <>
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M18.5 5.5a9 9 0 0 1 0 13" />
              </>
            ) : (
              <>
                <path d="m16 9 5 6" />
                <path d="m21 9-5 6" />
              </>
            )}
          </svg>
        </button>

        <button
          type="button"
          onClick={() => {
            const yeni = !duraklatildi;
            elleDurduruldu.current = yeni;
            setDuraklatildi(yeni);
            uygula();
          }}
          aria-pressed={duraklatildi}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-navy/70 text-white backdrop-blur-sm transition-colors duration-500 hover:bg-navy"
        >
          <span className="sr-only">
            {duraklatildi ? "Videoyu oynat" : "Videoyu duraklat"}
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="currentColor"
          >
            {duraklatildi ? (
              <path d="M8 5v14l11-7Z" />
            ) : (
              <>
                <rect x="7" y="5" width="3.5" height="14" rx="1" />
                <rect x="13.5" y="5" width="3.5" height="14" rx="1" />
              </>
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}
