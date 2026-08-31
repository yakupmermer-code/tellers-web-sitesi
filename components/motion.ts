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
