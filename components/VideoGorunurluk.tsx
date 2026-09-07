"use client";

import { useEffect } from "react";

/**
 * Ekrandan çıkan videoyu durdurur (2026-09-07, Yakup: "aşağı doğru kaydırınca
 * ses kapansın").
 *
 * İki farklı fayda:
 *
 *  1) SES — Oynat butonlu videoyu (portfolyodaki kurumsal filmler) izlerken
 *     sayfayı kaydırıp uzaklaşan kullanıcının kulağında ekranda olmayan bir
 *     videonun sesi kalıyordu. Artık film ekrandan çıkınca duruyor.
 *
 *  2) PİL / İŞLEMCİ — Marka sayfalarında aynı anda 4-6 otomatik oynayan video
 *     olabiliyor. Görünmeyenler artık kod çözmüyor.
 *     KAPSAM DIŞI: ana sayfanın üst üste sabitlenen (`sticky`) hizmet slaytları.
 *     IntersectionObserver ÖRTÜLMEYİ bilmez — üstüne başka slayt çizilse de
 *     alttaki hâlâ "ekranda" sayılır. Örtülme takibi eklemeye değmez.
 *
 * DAVRANIŞ FARKI (bilinçli):
 *  • Otomatik oynayan dekoratif videolar geri görünür olunca KALDIĞI YERDEN
 *    devam eder — kullanıcı zaten başlatmamıştı, durduğunu fark etmemeli.
 *  • Oynat butonlu video geri görünür olunca KENDİLİĞİNDEN BAŞLAMAZ. Sesli bir
 *    filmi kullanıcının izni olmadan yeniden başlatmak istemediğimiz için.
 *
 * Neden tek bir global bileşen: `<video>` etiketi 7 dosyada, 13 ayrı yerde
 * geçiyor. Her birine ayrı kod koymak yerine kök layout'ta tek yerden yönetiliyor.
 * Sayfa geçişlerinde DOM'a yeni videolar geldiği için MutationObserver ile de
 * izleniyor (IntersectionObserver yalnızca kendisine verilen öğeleri görür).
 */

/**
 * Safari, W3C resim-içinde-resim API'sini uygulamaz; kendi
 * `webkitPresentationMode`'unu kullanır. iOS'ta tam ekran da oradan okunur.
 */
type WebkitVideo = HTMLVideoElement & {
  webkitPresentationMode?: "inline" | "picture-in-picture" | "fullscreen";
  webkitDisplayingFullscreen?: boolean;
};

/*
 * Resim-içinde-resim (PiP) ve tam ekran DIŞARIDA BIRAKILIR: PiP'in bütün amacı
 * "sayfayı kaydırırken izlemeye devam etmek", burada duraklatırsak yüzen
 * pencere donar. (Denetimde yakalandı, ölçüldü.)
 *
 * Fail-closed yazıldı: her koşul POZİTİF bir sinyal istiyor. Hiçbir API açmayan
 * tarayıcı muafiyet alamaz. BİLİNEN HATA: Firefox'un PiP'i tarayıcı arayüzü
 * özelliğidir ve sayfaya hiçbir API açmaz — orada yüzen pencere, kullanıcı
 * kaydırdığında oynamayı keser ve sayfa geri kaydırılana kadar düzelmez.
 */
const ayriPencerede = (video: HTMLVideoElement) => {
  const w = video as WebkitVideo;
  return (
    document.pictureInPictureElement === video ||
    document.fullscreenElement === video ||
    w.webkitPresentationMode === "picture-in-picture" ||
    w.webkitPresentationMode === "fullscreen" ||
    w.webkitDisplayingFullscreen === true
  );
};

const AYRI_PENCERE_OLAYLARI = [
  "leavepictureinpicture",
  "webkitendfullscreen",
  "webkitpresentationmodechanged",
] as const;

export default function VideoGorunurluk() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const izlenen = new WeakSet<HTMLVideoElement>();

    const gorunurlukGozlemcisi = new IntersectionObserver(
      (girisler) => {
        for (const giris of girisler) {
          const video = giris.target as HTMLVideoElement;
          if (ayriPencerede(video)) continue;

          if (giris.isIntersecting) {
            // Yalnızca kendiliğinden oynayanlar devam eder. `ended` kontrolü:
            // `loop`suz bir autoPlay video eklenirse her ekrana girişte başa
            // sarmasın.
            if (video.autoplay && video.paused && !video.ended) {
              // play() reddedilebilir (ör. güç tasarrufu modu) — sessizce geç.
              void video.play().catch(() => {});
            }
          } else if (!video.paused) {
            video.pause();
          }
        }
      },
      // threshold 0: öğenin son pikseli de ekrandan çıkınca durur.
      { threshold: 0 },
    );

    /*
     * 🔴 PiP/tam ekrandan ÇIKIŞ (denetimde yakalandı, ölçüldü: PiP'i açıp
     * kaydırıp sonra PiP'i kapatınca ekranda olmayan video SESLİ oynamaya
     * devam ediyordu — yani bileşenin önlemek için yazıldığı hatanın kendisi).
     *
     * Sebep: PiP açıkken kesişim gözlemcisi "görünmüyor" diye ateşledi ama
     * yukarıdaki istisna onu atladı. PiP kapanınca kesişim DEĞİŞMEDİĞİ için
     * gözlemci bir daha ateşlemez.
     *
     * Çözüm, konumu elle ölçmek DEĞİL — gözlemciye yeniden kaydetmek.
     * `observe()` her zaman taze bir gözlem kuyruğa alır ve o gözlem YERLEŞİM
     * SONRASI teslim edilir. Elle ölçüm, Chrome'un PiP penceresindeki "Sekmeye
     * dön" düğmesinde yanılırdı: tarayıcı videoyu görünüre kaydırmadan önce
     * ölçseydik "ekran dışı" görüp duraklatırdık — kullanıcı tam da videoya
     * dönmek istemişken. Böylece "görünür" tanımı da tek yerde kalıyor.
     */
    /** Taze bir gözlem kuyruğa alır. `unobserve` ŞART: yalnızca `observe`
     *  tekrarı, zaten izlenen öğede hiçbir geri çağrı üretmez (ölçüldü). */
    const yenidenGozle = (video: HTMLVideoElement) => {
      if (ayriPencerede(video)) return;
      gorunurlukGozlemcisi.unobserve(video);
      gorunurlukGozlemcisi.observe(video);
    };

    const ayriPencereKapandi = (olay: Event) =>
      yenidenGozle(olay.currentTarget as HTMLVideoElement);

    const izle = (video: HTMLVideoElement) => {
      if (izlenen.has(video)) return;
      izlenen.add(video);
      gorunurlukGozlemcisi.observe(video);
      for (const olay of AYRI_PENCERE_OLAYLARI) {
        video.addEventListener(olay, ayriPencereKapandi);
      }
    };

    const kaydet = (kok: ParentNode) =>
      kok.querySelectorAll<HTMLVideoElement>("video").forEach(izle);

    kaydet(document);

    /*
     * Yalnızca `addedNodes` izleniyor; `removedNodes` için `unobserve` YOK ve bu
     * bilinçli: IntersectionObserver hedeflerini zayıf tutar, DOM'dan çıkan
     * video çöp toplamayı engellemez. (Ölçüldü: sayfalar arasında gezinip zorla
     * çöp toplattıktan sonra kopuk <video> sayısı 0.)
     */
    const domGozlemcisi = new MutationObserver((kayitlar) => {
      for (const kayit of kayitlar) {
        for (const dugum of kayit.addedNodes) {
          if (dugum instanceof HTMLVideoElement) izle(dugum);
          else if (dugum instanceof Element) kaydet(dugum);
        }
      }
    });
    domGozlemcisi.observe(document.body, { childList: true, subtree: true });

    // W3C tam ekran çıkışı öğede değil BELGEDE duyurulur; öğe olayı gelmez.
    const tamEkranDegisti = () =>
      document
        .querySelectorAll<HTMLVideoElement>("video")
        .forEach(yenidenGozle);
    document.addEventListener("fullscreenchange", tamEkranDegisti);

    return () => {
      document.removeEventListener("fullscreenchange", tamEkranDegisti);
      domGozlemcisi.disconnect();
      gorunurlukGozlemcisi.disconnect();
      document.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
        for (const olay of AYRI_PENCERE_OLAYLARI) {
          video.removeEventListener(olay, ayriPencereKapandi);
        }
      });
    };
  }, []);

  return null;
}
