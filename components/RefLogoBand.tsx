import Image from "next/image";
import { REF_LOGOS } from "@/content/site";

/**
 * Referans logo bandı — temadaki gibi ince lacivert şerit, logolar küçük ve
 * sürekli kayan (marquee). Yakup notu (2026-08-14): "2 parmak genişliğinde
 * lacivert alan, logolar küçülsün, tek satırda 6 logo yan yana, sürekli dönsün."
 */
export default function RefLogoBand() {
  const logos = [...REF_LOGOS, ...REF_LOGOS]; // kesintisiz döngü için çift liste
  return (
    <section
      aria-label="Referanslarımız"
      className="overflow-hidden bg-navy py-8 md:py-10"
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
            className="h-8 w-auto max-w-[140px] flex-none object-contain opacity-90 brightness-0 invert md:h-10"
          />
        ))}
      </div>
    </section>
  );
}
