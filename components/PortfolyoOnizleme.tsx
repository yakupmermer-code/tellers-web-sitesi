import Image from "next/image";
import Link from "next/link";
import MediaReveal from "@/components/MediaReveal";

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
  ortu = true,
  bilgi,
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
  /**
   * Üzerine gelince lacivert karartma + logo çıksın mı?
   *
   * `false` (2026-09-09, Yakup): "bunların üzerine gelince master temada üstüne
   * renk gelmiyor, olduğu gibi kalıyor, görselde hafif bir oynama var. Senin bu
   * yaptığın işlem sadece altında yaptığın 3'lü grupta var."
   * Yani karartma YALNIZCA dökümanın "portfolyo ön görüntüleme alanı" dediği
   * dikey üçlüde olacak; üstteki yatay ikilide görsel olduğu gibi kalıp sadece
   * hafifçe büyüyecek.
   */
  ortu?: boolean;
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
  /**
   * Master temanın portfolyo kartı bilgi bloğu (arpeggio.framer.website/work'te
   * ölçüldü, 2026-09-10): kartın İÇİNDE, görselin üstünde duruyor —
   *   üstte  : açıklama cümlesi        35px/500
   *   sol alt: müşteri adı 19px/500 + hizmet 21px/500
   *   sağ alt: tarih                   17px/400
   * Verilmezse hiç basılmaz (yatay ikili bunu kullanmıyor).
   */
  bilgi?: { baslik: string; musteri: string; hizmet: string; yil: string };
}) {
  return (
    <Link
      href={`/portfolyo/${slug}`}
      aria-label={`${marka} çalışmasını görüntüle`}
      data-imlec="Ziyaret Et"
      className={`group relative block overflow-hidden ${className}`}
    >
      {/* KAYDIRMAYA BAĞLI YAKLAŞMA (2026-09-10, Yakup: "ana temadaki gibi
          aşağı kayarken ki yaklaşma animasyonları oynasın mutlaka").
          Master temada bu kartların görselleri kaplarından BÜYÜK (427'lik kabın
          içinde 555px'lik görsel) ve kaydırdıkça kap içinde kayıyorlar — üçlünün
          "kademeli" görünmesinin sebebi de buydu.
          Yeni bir şey yazılmadı: `MediaReveal` bu davranışı referans temanın
          paketinden birebir çıkarılmış hâliyle zaten taşıyor
          (scrollYProgress, y: -%amount → +%amount, scale: taban → scaleTo →
          taban). Genlik burada 5: kartlar dar olduğu için 6 fazla geliyordu.

          Bilgi ve karartma katmanları BİLEREK dışarıda: içeri alınsalardı
          yazılar da görselle birlikte kayardı. */}
      <MediaReveal className="h-full w-full" amount={5} scaleTo={1.08}>
        <Image
          src={gorsel}
          alt={aciklama ? `${marka} — ${aciklama}` : marka}
          width={genislik}
          height={yukseklik}
          sizes={sizes}
          className={`h-full w-full object-cover ${odak} transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.03]`}
        />
      </MediaReveal>

      {/* Kart içi bilgi bloğu — master temanın /work kartlarındaki yerleşim.
          Okunurluk için üstten ve alttan yumuşak lacivert degrade; görselin
          kendi tonu ne olursa olsun beyaz yazı okunuyor.
          Üzerine gelince SÖNÜYOR: yerini karartma + logo alıyor, iki katman
          üst üste binmesin. */}
      {bilgi && (
        <div className="pointer-events-none absolute inset-0 opacity-100 transition-opacity duration-500 ease-[var(--ease-lux)] group-hover:opacity-0 group-focus-visible:opacity-0">
          {/* Perde yüksekliği 45→55: degrade KART YÜKSEKLİĞİNİN yüzdesi, başlık
              ise sabit piksel. Kart daralınca degrade küçülüyor ama başlık satır
              sayısı artarak BÜYÜYOR — ters yönde hareket ediyorlardı. 768px'te
              Atlantis başlığı 4 satıra çıkıp degradenin dışına taşıyordu; son
              satırda alfa 0,09'a düşüyor ve beyaz laptop görselinin üstünde
              kontrast 1,21'e iniyordu (denetimde 13 ekran genişliğinde ölçüldü).
              Punto kademesi de aşağıda düzeltildi — iki taraftan birden. */}
          <div className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-navy/75 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-navy/80 to-transparent" />
          {/* `md:` tek başına yetmiyordu: 767→768'de kart 2,15 kat KÜÇÜLÜRKEN
              punto 1,4 kat BÜYÜYOR, yani yazı/kart oranı üçe katlanıyordu.
              Ara kademeler eklendi. */}
          <p className="absolute inset-x-0 top-0 px-5 pt-6 text-[17px] font-medium leading-[1.15] tracking-[-0.03em] text-white md:px-7 md:pt-7 md:text-[18px] lg:text-[20px] xl:text-[23px]">
            {bilgi.baslik}
          </p>
          {/* Punto hiyerarşisi master temadan: müşteri 19/500, HİZMET 21/500 —
              yani hizmet müşteriden BÜYÜK (arpeggio /work'te ölçüldü). Bir ara
              hizmet 17/400 yazılmıştı, hiyerarşi ters dönüyordu. */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-5 pb-6 md:px-7 md:pb-7">
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-white/80 md:text-[14px] lg:text-[16px]">
                {bilgi.musteri}
              </p>
              <p className="mt-0.5 text-[14px] font-medium text-white md:text-[15px] lg:text-[18px]">
                {bilgi.hizmet}
              </p>
            </div>
            {bilgi.yil && (
              <p className="shrink-0 text-[11px] text-white/70 md:text-[12px] lg:text-[14px]">
                {bilgi.yil}
              </p>
            )}
          </div>
        </div>
      )}

      {/*
        Karartma + logo. `opacity` ile açılıyor (zemin rengini animasyonlamak
        yerine): tek bir katman iki özelliği birden taşıyınca geçiş daha
        yumuşak ve GPU'da daha ucuz oluyor.
        `pointer-events-none` — katman bağlantının tıklamasını yutmasın.
      */}
      {ortu && (
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
      )}
    </Link>
  );
}
