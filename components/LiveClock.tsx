"use client";

import { useEffect, useState } from "react";

/**
 * Footer'daki canlı saat/tarih.
 *
 * SAAT DİLİMİ (2026-09-02): gösterilen an ZİYARETÇİNİN cihaz saatinden alınır,
 * `timeZone: "Europe/Istanbul"` ile İstanbul saat dilimine ÇEVRİLİR. Yani
 * ziyaretçinin bilgisayarı 10 dakika geriyse burada da 10 dakika geri görünür —
 * backend olmadığı için başka yolu yok. Yine de doğru karar: yanındaki "GMT+3"
 * etiketi ziyaretçinin kendi saat dilimiyle basılsaydı Londra'daki bir müşteriye
 * doğrudan yanlış bilgi verirdi.
 *
 * HYDRATION: `now` başlangıçta null; sunucuda ve ilk hydration'da her zaman
 * boşluk basılır, gerçek saat yalnızca effect çalıştıktan sonra gelir. Statik
 * üretilen bir sitede saati sunucuda basmak DERLEME anındaki saati dondururdu.
 *
 * `bicim`:
 *  - "saat"  → 14:32:05 (iri gösterim)
 *  - "tarih" → 2 Eylül 2026 Salı (iri saatin altındaki satır)
 *
 * Ekip notu "bu alana metin yazılmadan sadece tarih-saat akışı" istiyordu; bu
 * akış artık alt bantta minik bir satır değil, footer'ın sağ üst bloğu.
 */
export default function LiveClock({ bicim }: { bicim: "saat" | "tarih" }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Tarih çıktısı günde bir kez değişiyor; saniyelik timer boşuna render'dı.
    const aralik = bicim === "tarih" ? 30_000 : 1_000;
    const raf = requestAnimationFrame(() => setNow(new Date()));
    const t = setInterval(() => setNow(new Date()), aralik);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(t);
    };
  }, [bicim]);

  if (!now) return <span className="tabular-nums">&nbsp;</span>;

  if (bicim === "tarih") {
    return (
      <span>
        {now.toLocaleDateString("tr-TR", {
          timeZone: "Europe/Istanbul",
          day: "numeric",
          month: "long",
          year: "numeric",
          weekday: "long",
        })}
      </span>
    );
  }

  return (
    <span className="tabular-nums">
      {now.toLocaleTimeString("tr-TR", {
        timeZone: "Europe/Istanbul",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}
    </span>
  );
}
