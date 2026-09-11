"use client";

import { usePathname } from "next/navigation";

/**
 * AÇILIŞ PERDESİ — referans temanın (arpeggio.framer.website) imza girişi.
 *
 * Ekranı kaplayan 10 dikey şerit, soldan sağa kademeli olarak yukarı sıyrılıp
 * sayfayı açığa çıkarır. Referanstan ölçülerek alındı (headless Chrome + CDP,
 * `transform` değerleri 40ms aralıkla örneklendi):
 *
 *   · 10 şerit, her biri ekran genişliğinin 1/10'u, tam ekran yüksekliği
 *   · şerit başına ~65ms gecikme (soldan sağa)
 *   · şerit başına ~1.5s süre, sonlara doğru güçlü yavaşlama
 *   · YALNIZCA TAM SAYFA YÜKLEMESİNDE — iç sayfa geçişlerinde OYNAMAZ
 *     (referansta da öyle: /work linkine tıklandığında perde hiç görünmedi)
 *
 * İç geçişte oynamaması bedava geliyor: bu bileşen kök layout'ta duruyor ve
 * Next App Router'da kök layout istemci gezinmelerinde YENİDEN BAĞLANMAZ.
 *
 * 🔴 NEDEN SAF CSS, framer-motion DEĞİL: perde ekranın tamamını kapatıyor.
 * JavaScript yüklenmezse ya da hata verirse (ağ kesintisi, eski tarayıcı,
 * bir paketin patlaması) JS'e bağlı bir perde EKRANDA KALIR ve site tamamen
 * görünmez olur.
 *
 * Ama saf CSS tek başına yetmiyor: şeritlerin TABAN DURUMU da "açık" olmalı.
 * İlk sürümde taban kapalıydı ve animasyon çalışmazsa perde ekranda kalıyordu
 * (denetimde yakalandı, `animation:none` enjekte edilerek ölçüldü). Gerekçe ve
 * düzeltme `app/globals.css`'teki `.acilis-perdesi span` bloğunda.
 *
 * Renk: referansta saf siyah; bizde kurumsal lacivert (Yakup: "renkler ve
 * kurumsal font harici" birebir). Beyaz zeminli sayfalarda (blog, portfolyo,
 * hizmetler) güçlü okunur; lacivert hero'lu ana sayfada daha sessiz kalır.
 */
export default function AcilisPerdesi() {
  /*
   * 🔴 YALNIZ ANA SAYFADA (2026-09-11, Yakup: "My Nova sayfası açılırken ana
   * ekrandaki animasyon oynuyor hâlâ").
   * Perde `app/layout.tsx`te duruyor, yani HER TAM SAYFA YÜKLEMESİNDE
   * oynuyordu — bir iç sayfayı doğrudan açan ya da yenileyen kullanıcı, ana
   * sayfaya ait sandığı bu şeritli girişi orada da görüyordu.
   * `usePathname` ilk yüklemedeki yolu veriyor; kök layout istemci
   * gezinmelerinde yeniden bağlanmadığı için bu kontrol yalnızca tam sayfa
   * yüklemesinde çalışır — yani zaten perdenin oynadığı tek durumda.
   */
  const yol = usePathname();
  if (yol !== "/") return null;

  return (
    <div className="acilis-perdesi" aria-hidden="true">
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} style={{ "--serit": i } as React.CSSProperties} />
      ))}
    </div>
  );
}
