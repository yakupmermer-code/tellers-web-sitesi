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
            "pointer-events-none overflow-hidden bg-navy/25 py-4 backdrop-blur-[3px]"
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
                ? // Bir tık büyütüldü (2026-09-10, Yakup: "referans kısmı küçük
                  // olmuş... bir tık da büyük"): h-6/h-8 → h-8/h-10, yani artık
                  // bant görünümüyle aynı boyda; fark yalnızca zeminde ve
                  // opaklıkta. (Daha önce h-7'ye çıkarılmıştı çünkü ince ve iki
                  // satırlı logolar — Fairmont, Konica Minolta, The London
                  // Clinic — küçükken okunmuyordu; bu büyütme onu da pekiştirir.)
                  //
                  // 🔴 GENİŞLİK SINIRI 140/150 → 190/200 (2026-09-11).
                  // 35 logonun hepsi tek kırpma standardına (6 piksel pay)
                  // getirilince UZUN kelime işaretlerinin oranı genişledi ve
                  // sınıra takılmaya başladılar: 40 piksellik bantta ölçüldü,
                  // 15 logo takılıyordu ve Bausch+Lomb (oran 10,9) yalnızca
                  // 12,9 PİKSEL yüksekliğinde çiziliyordu — yanındaki kare
                  // logolar 40 pikselken okunmuyordu.
                  // Yeni sınırla takılan sayısı 8'e, en küçüğü 17,4 piksele
                  // indi. Sınır TAMAMEN kaldırılmadı çünkü kaldırılırsa
                  // Bausch+Lomb 436 piksel genişliğinde çizilip bandı tek
                  // başına domine ederdi — bant logoları OPTİK olarak eşitler,
                  // yalnız yüksekliği değil.
                  "h-8 max-w-[200px] opacity-85 md:h-10"
                : "h-8 max-w-[190px] opacity-90 md:h-10"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
