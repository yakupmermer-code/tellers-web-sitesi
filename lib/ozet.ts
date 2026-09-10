/**
 * Blog gövdesinden ilk cümleleri çıkarır.
 *
 * NEDEN AYRI BİR "özet2" ALANI AÇILMADI: revize dökümanı "blog içeriğinin ilk
 * metinlerini direkt siteden çekebilirsiniz" diyor. Elle ikinci bir özet alanı
 * açmak aynı metni iki yerde tutmak olurdu — biri güncellenip diğeri unutulurdu.
 *
 * 🔴 NEDEN `lib/` ALTINDA, BİLEŞENİN İÇİNDE DEĞİL: bir tur `BlogIkili.tsx`
 * içinden export ediliyordu. O dosya `"use client"` taşıyor ve React Server
 * Components kuralı gereği böyle bir modülün TÜM export'ları sunucu tarafında
 * "client reference" proxy'sine dönüşür — yani bir sunucu bileşeni bu saf
 * fonksiyonu çağıramaz. Saf yardımcının yeri `lib/`. (Denetimde yakalandı,
 * 2026-09-10.)
 */

/** Cümleyi bitiren işaretler. Türkçede `?` ve `!` en az `.` kadar sık. */
const CUMLE_SONU = [". ", "? ", "! ", "… ", "; "];

export function ilkCumleler(govde: string, yedek = "", sinir = 190) {
  const paragraf =
    govde
      .split("\n")
      .map((s) => s.trim())
      .find(
        (s) =>
          s.length > 0 &&
          !s.startsWith("#") &&
          !s.startsWith("-") &&
          // "1." "2." gibi sıralı madde satırları da paragraf değildir
          !/^\d+\.\s/.test(s),
      ) ?? "";

  // Gövde başlıkla/listeyle başlıyorsa düz paragraf bulunamaz. Sessizce boş
  // dönüp kartta boş bir satır bırakmak yerine yazının kendi özetine düşülür.
  if (!paragraf) return yedek;
  if (paragraf.length <= sinir) return paragraf;

  const kesik = paragraf.slice(0, sinir);
  // Bir tur yalnız ". " ve "; " aranıyordu; sekiz yazının dördünde cümle sonu
  // bulunamayıp kelime ortasında kesiliyordu — ikinci yazıda 108. karakterde
  // tertemiz bir "?" varken 187. karakterde kesiyordu (denetimde ölçüldü).
  const nokta = Math.max(...CUMLE_SONU.map((i) => kesik.lastIndexOf(i)));
  if (nokta > sinir * 0.5) return kesik.slice(0, nokta + 1).trim();

  const bosluk = kesik.lastIndexOf(" ");
  return (bosluk > 0 ? kesik.slice(0, bosluk) : kesik) + "…";
}
