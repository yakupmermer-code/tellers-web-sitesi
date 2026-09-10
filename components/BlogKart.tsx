import Image from "next/image";
import Link from "next/link";
import MediaReveal from "@/components/MediaReveal";
import type { Blog } from "@/content/blogs";
import { ilkCumleler } from "@/lib/ozet";

/**
 * Blog kartı — master temanın (arpeggio.framer.website/journal) kart anatomisi.
 *
 * MASTER ÖLÇÜMÜ (1440px, Yakup'un tarayıcısında canlı):
 *   · geniş kart 1360x650 → oran 2,09 · ızgara kartı 668x650 → oran 1,03
 *   · ızgara: 2 sütun, x=40 ve x=732, 24px ara
 *   · kartın İÇİNDE, görselin üstünde:
 *       tarih 19px/500 (sol üst) · "Written by" + yazar 17px/400 (sağ üst)
 *       başlık 35px/500 · alt açıklama 19px/500 · ilk cümleler 17px/400
 *
 * Revize dökümanı: "Konu başlıkları bu şekilde eklenmeyecek, her konu başlığı
 * görsel üzerine tıkladığında detayları ile birlikte çıkacak." + "Yazan yerinde
 * tellers yazacak ve blogların eklenme tarihi yer alacak."
 *
 * NEDEN ORTAK BİLEŞEN: aynı anatomi hem ana sayfada (`BlogIkili`) hem blog
 * dizin sayfasında lazım. İki yere ayrı ayrı yazılsaydı biri değişip diğeri
 * unutulurdu.
 */
export default function BlogKart({
  blog: b,
  className = "",
  /** `false` → durağan hâlde başlık basılmaz (yalnız hover). Ana sayfa böyle. */
  buyuk = false,
}: {
  blog: Blog;
  className?: string;
  buyuk?: boolean;
}) {
  return (
    <Link
      href={`/blog/${b.slug}`}
      aria-label={`${b.title} — yazıyı oku`}
      /* Etiket artık İMLECİN kendisinde (master temadaki gibi), kartın
         köşesinde sabit rozet değil. Bkz. `components/Imlec.tsx`. */
      data-imlec="Oku"
      className={`group relative block overflow-hidden ${className}`}
    >
      {/* Kaydırmaya bağlı yaklaşma — sitenin her yerindeki `MediaReveal`,
          referans temanın paketinden birebir çıkarılmış hareket. */}
      <MediaReveal className="h-full w-full" amount={5} scaleTo={1.08}>
        <Image
          src={b.image}
          alt=""
          width={1360}
          height={650}
          sizes={
            buyuk
              ? "(min-width: 1440px) 1360px, 100vw"
              : "(min-width: 1440px) 668px, (min-width: 768px) 47vw, 100vw"
          }
          className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.03]"
        />
      </MediaReveal>

      {/* DURAĞAN HÂL — başlık + alt açıklama. Telefonda gösterilmez: orada
          hover yok, aşağıdaki bilgi katmanı zaten hep açık. */}
      <div className="pointer-events-none absolute inset-0 hidden transition-opacity duration-500 ease-[var(--ease-lux)] group-hover:opacity-0 group-focus-visible:opacity-0 md:block">
        <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-navy/85 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-7 md:px-8 md:pb-8">
          <p
            className={`font-medium leading-[1.2] tracking-[-0.02em] text-white ${
              buyuk
                ? "text-[24px] xl:text-[35px]"
                : "text-[19px] xl:text-[26px]"
            }`}
          >
            {b.title}
          </p>
          <p className="mt-2 line-clamp-2 text-[14px] leading-snug text-white/75 xl:text-[19px]">
            {b.excerpt}
          </p>
        </div>
      </div>

      {/* ÜZERİNE GELİNCE — dökümanın saydığı dört şey: tarih, konu başlığı,
          SEO kategorisi, içeriğin ilk cümleleri. Telefonda HEP AÇIK
          (dokunmatikte hover yok, kart bir <a>). */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-navy/85 p-5 opacity-100 transition-opacity duration-500 ease-[var(--ease-lux)] md:p-6 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 xl:p-8">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/70 md:text-[12px] xl:text-[13px]">
            {b.date}
          </p>
          {/* Döküman: "Yazan yerinde tellers yazacak." Master'da bu köşede
              "Written by [isim]" duruyor; bizde yazar hep ajansın kendisi. */}
          <p className="text-right text-[11px] font-medium text-white/70 md:text-[12px] xl:text-[13px]">
            Yazan: tellers
          </p>
        </div>

        <div>
          <p
            className={`font-medium leading-[1.2] tracking-[-0.02em] text-white ${
              buyuk
                ? "text-[20px] md:text-[24px] xl:text-[35px]"
                : "text-[17px] md:text-[19px] xl:text-[26px]"
            }`}
          >
            {b.title}
          </p>
          <p className="mt-2 text-[12px] font-medium leading-snug text-white/60 md:text-[13px] xl:text-[15px]">
            {b.kategori}
          </p>
          <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-white/75 md:line-clamp-2 md:text-[13px] xl:line-clamp-4 xl:text-[15px]">
            {ilkCumleler(b.body, b.excerpt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
