import Image from "next/image";
import Link from "next/link";

/**
 * Portfolyo ön izleme kartı — ana sayfada marka görselinin üstüne gelince
 * lacivert karartma iner ve markanın logosu ortada belirir.
 *
 * Revize dökümanı (2026-09-09): "Bu alanı portfolyo sayfasının ön görüntü
 * alanı olarak kullanacağız, mouse ile hafif dokunduğumuzda bizi lacivert
 * kurumsal rengimizin karartması oluşacak ve logo ortada çıkacak."
 *
 * Aynı davranış iki yerde isteniyor — üstteki yatay ikili ve aşağıdaki dikey
 * üçlü (Savronik / Atlantis / bfit) — o yüzden tek bileşen.
 *
 * LOGO YOKSA: markanın adı yazıyla gösterilir. `atlantis` için `ref-logos`
 * altında dosya YOK (kontrol edildi); ekipten gelene kadar yazıyla duruyor.
 * Logolar beyaz gösterim için `brightness-0 invert` ile çevriliyor —
 * referans logo bandındaki ile aynı yöntem.
 *
 * `next/image` ile `priority` VERİLMEZ: bu kartlar sayfanın ortasında,
 * ilk boyamada görünmüyorlar.
 */
export default function PortfolyoOnizleme({
  slug,
  gorsel,
  marka,
  aciklama,
  logo,
  genislik,
  yukseklik,
  sizes = "100vw",
  className = "",
  odak = "object-center",
}: {
  slug: string;
  gorsel: string;
  marka: string;
  /**
   * Görselin `alt` metnine marka adından SONRA eklenir ("MasterCard — Above
   * The Line kampanyaları"). `app/portfolyo/page.tsx`'teki kalıbın aynısı.
   * Verilmezse yalnız marka adı yazılır — kabul edilebilir ama zayıf.
   */
  aciklama?: string;
  /** `public/assets/ref-logos/<logo>.png` — yoksa marka adı yazıyla çıkar. */
  logo?: string;
  genislik: number;
  yukseklik: number;
  sizes?: string;
  className?: string;
  /**
   * Kırpma odağı (Tailwind `object-position` sınıfı). Kart oranı görselin
   * kendi oranından farklıysa `object-cover` kenarlardan keser; hangi bölgenin
   * korunacağını bu belirler. Yatay bir görseli dikey karta koyarken şart.
   */
  odak?: string;
}) {
  return (
    <Link
      href={`/portfolyo/${slug}`}
      aria-label={`${marka} çalışmasını görüntüle`}
      className={`group relative block overflow-hidden ${className}`}
    >
      <Image
        src={gorsel}
        alt={aciklama ? `${marka} — ${aciklama}` : marka}
        width={genislik}
        height={yukseklik}
        sizes={sizes}
        className={`h-full w-full object-cover ${odak} transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.03]`}
      />

      {/*
        Karartma + logo. `opacity` ile açılıyor (zemin rengini animasyonlamak
        yerine): tek bir katman iki özelliği birden taşıyınca geçiş daha
        yumuşak ve GPU'da daha ucuz oluyor.
        `pointer-events-none` — katman bağlantının tıklamasını yutmasın.
      */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-navy/70 opacity-0 transition-opacity duration-500 ease-[var(--ease-lux)] group-hover:opacity-100 group-focus-visible:opacity-100">
        {logo ? (
          <Image
            src={`/assets/ref-logos/${logo}.png`}
            alt=""
            width={200}
            height={80}
            className="h-10 w-auto max-w-[42%] object-contain brightness-0 invert md:h-14"
          />
        ) : (
          /*
            Logosuz marka: adı YAZIYLA çıkar. Punto logonun yüksekliğine
            (h-10 / h-14 = 40/56px) göre seçildi — burada sayfanın büyük başlık
            ölçeği (`t-orta`, 72px) kullanılırsa logolu komşularının yanında
            orantısız iri durur (denetimde yakalandı).
          */
          <span className="px-6 text-center text-[30px] font-medium leading-none text-white md:text-[42px]">
            {marka}
          </span>
        )}
      </div>
    </Link>
  );
}
