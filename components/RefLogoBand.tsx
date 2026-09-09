import Image from "next/image";
import { REF_LOGOS } from "@/content/site";

/**
 * Referans logo bandı — logolar küçük ve sürekli kayan (marquee).
 * Yakup notu (2026-08-14): "2 parmak genişliğinde lacivert alan, logolar
 * küçülsün, tek satırda 6 logo yan yana, sürekli dönsün."
 *
 * İKİ GÖRÜNÜM:
 *  · varsayılan (`bant`)  → kendi lacivert şeridi. Kariyer sayfası ve ana
 *    sayfanın üst bölümü bunu kullanıyor.
 *  · `serit` (üste bindirme) → kendi zemini YOK, saydam. Ekip görselinin alt
 *    boş alanına bindirmek için.
 *
 * NEDEN İKİNCİ GÖRÜNÜM (revize dökümanı, 2026-09-09): "Referans logolar alt
 * kısımda banner alanında verilmeyecek temadaki gibi yukarıdaki ekip
 * görselinin alt boş kısmında akan slider şeklinde dönecek."
 * Master temada (arpeggio.framer.website) ölçüldü: logolar ekip görselinin
 * ÜSTÜNE biniyor (görsel y=21322..22322, logo şeridi y=22065), 100x30
 * boyutunda ve 220px aralıkla akıyor; ayrı bir bant yok.
 */
export default function RefLogoBand({
  gorunum = "bant",
}: {
  gorunum?: "bant" | "serit";
}) {
  const logos = [...REF_LOGOS, ...REF_LOGOS]; // kesintisiz döngü için çift liste
  const serit = gorunum === "serit";
  return (
    <section
      aria-label="Referanslarımız"
      className={
        serit
          ? // Hafif saydam zemin: master temada logolar çıplak görselin değil,
            // ince bir saydam yüzeyin üstünde kayıyor (Yakup: "az şeffaflık
            // üzerine logolar kayıyor"). Tam saydam bırakılınca logolar
            // görselin desenine karışıyordu.
            "pointer-events-none overflow-hidden bg-navy/25 py-3 backdrop-blur-[3px]"
          : "overflow-hidden bg-navy py-8 md:py-10"
      }
    >
      <div className="animate-marquee flex w-max items-center gap-16 md:gap-20">
        {logos.map((logo, i) => (
          <Image
            key={`${logo.file}-${i}`}
            src={`/assets/ref-logos/${logo.file}.png`}
            alt={i < REF_LOGOS.length ? logo.name : ""}
            aria-hidden={i >= REF_LOGOS.length}
            width={200}
            height={80}
            className={`w-auto flex-none object-contain brightness-0 invert ${
              serit
                ? // md:h-8 — h-7'de ince/iki satırlı logolar (Fairmont, Konica
                  // Minolta, The London Clinic) okunmuyordu; denetimde yakalandı.
                  "h-6 max-w-[120px] opacity-85 md:h-8"
                : "h-8 max-w-[140px] opacity-90 md:h-10"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
