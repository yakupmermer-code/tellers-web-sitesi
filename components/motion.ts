/**
 * Ortak hareket sabitleri.
 *
 * EASE referans temanın (arpeggio-ashen.vercel.app) JS paketinden birebir
 * çıkarıldı: [.22, 1, .36, 1]. Sitenin "hissi" büyük ölçüde bu eğriden gelir —
 * bizde önceden [.32, .72, 0, 1] vardı ve hareket daha sert duruyordu.
 * Tek yerden yönetilir; bir bileşen kendi eğrisini yazmaz.
 */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Referanstaki süreler (saniye) — hepsi ölçülerek alındı. */
export const SURE = {
  reveal: 0.9,
  maske: 0.95,
  stagger: 0.85,
  heroZoom: 1.1,
} as const;

/** Satır/öğe arası gecikmeler. */
export const ARALIK = {
  maskeSatir: 0.09,
  staggerOge: 0.08,
} as const;

/**
 * 🔴 GÖRÜNÜR ALAN TETİKLEYİCİSİ — tüm bileşenler bunu kullanır.
 *
 * NEDEN `amount` DEĞİL `margin`: framer'ın `viewport.amount` değeri doğrudan
 * IntersectionObserver eşiğine gider ve ELEMANIN KENDİ alanının yüzdesidir.
 * Eleman ekrandan 1/amount kat uzunsa eşik MATEMATİKSEL OLARAK sağlanamaz,
 * gözlemci HİÇ ateşlemez, içerik KALICI `opacity: 0` kalır — sayfa görünmez olur.
 *
 * Bu canlıda iki kez yaşandı:
 *  · 2026-09-07 · telefonda (390x640) blog gövdesi 3607px; amount .25 için 902px
 *    görünmesi gerekiyordu, ekran 640px. 8 blog yazısının METNİ mobilde yoktu.
 *  · 2026-08-31 · portfolyo ızgarası 5488px / iPhone 812px = 0.148 < 0.15.
 *
 * `margin` ise rootMargin'e gider: "elemanın üstü ekranın altından %10 yukarı
 * geçince başla" demektir ve ELEMAN BOYUNDAN BAĞIMSIZDIR.
 *
 * ⚠️ YENİ KISIT: ekranın ALT %10'unda KALICI duran bir öğe (bottom-0'a çakılı
 * overlay, sticky alt çubuk) `once: true` ile ASLA tetiklenmez. Böyle bir öğe
 * eklerken bu sabiti kullanma, ya da alt boşluğunu koru.
 *
 * KURAL: bileşenlerde bir daha `amount` yazma, bu sabiti kullan.
 */
export const GORUNUR = {
  once: true,
  margin: "0px 0px -10% 0px",
} as const;
