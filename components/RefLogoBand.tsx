import Image from "next/image";
import { REF_LOGOS } from "@/content/site";

/**
 * Referans logo bandı — lacivert fon, beyaz BÜYÜK logolar.
 * Yakup notu (2026-08-13): logolar KAYMAZ (sabit grid), büyük görünür,
 * tüm referanslar sığana kadar satır eklenir.
 */
export default function RefLogoBand() {
  return (
    <section aria-label="Referanslarımız" className="bg-navy py-16 md:py-24">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 items-center gap-x-10 gap-y-14 px-6 sm:grid-cols-3 md:gap-x-16 md:gap-y-20 md:px-12 lg:grid-cols-4">
        {REF_LOGOS.map((logo) => (
          <div key={logo.file} className="flex items-center justify-center">
            <Image
              src={`/assets/ref-logos/${logo.file}.png`}
              alt={logo.name}
              width={400}
              height={200}
              className="h-auto max-h-[76px] w-auto max-w-[66%] object-contain opacity-95 brightness-0 invert md:max-h-[102px]"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
