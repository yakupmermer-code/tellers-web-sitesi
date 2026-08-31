import * as fs from "node:fs";
import * as path from "node:path";

/**
 * Bir görselin GERÇEK piksel ölçüsünü derleme (build) anında dosyadan okur.
 *
 * NEDEN GEREKLİ: galeri blokları görsellere sabit bir en-boy oranı dayatıyordu
 * (örn. sağdaki kutular 16:9). İçerik ise büyük ölçüde sosyal medya görseli —
 * 1080x1080 kare ya da 0.71 dikey. object-cover bunları kırpıyor ve görselin
 * İÇİNDEKİ YAZI kesiliyordu: Bardahl'da %42, My Nova'da %60'a varan kayıp
 * (Yakup bildirdi, 2026-08-31: "alana tam sığdırılmamış, yazı okunmuyor").
 *
 * Gerçek ölçü bilinince kutu görsele uyuyor; kırpma da, boş bant da olmuyor.
 *
 * Sadece PNG ve JPEG destekleniyor — projedeki tüm galeri görselleri bu iki
 * formatta. Okunamayan dosyada güvenli varsayılan (16:9) döner ve derleme
 * kırılmaz; ölçü yanlış olur ama sayfa çalışır.
 */

const VARSAYILAN = { width: 1600, height: 900 };
const onbellek = new Map<string, { width: number; height: number }>();

function pngOlcu(b: Buffer) {
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function jpegOlcu(b: Buffer) {
  let i = 2; // SOI atlanır
  while (i < b.length) {
    if (b[i] !== 0xff) {
      i++;
      continue;
    }
    const isaret = b[i + 1];
    // SOF0-SOF15 kare boyutunu taşır; DHT(c4)/JPG(c8)/DAC(cc) hariç
    if (
      isaret >= 0xc0 &&
      isaret <= 0xcf &&
      isaret !== 0xc4 &&
      isaret !== 0xc8 &&
      isaret !== 0xcc
    ) {
      return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
    }
    if (isaret === 0xd8 || (isaret >= 0xd0 && isaret <= 0xd9)) {
      i += 2;
      continue;
    }
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
}

/**
 * "/assets/x/y.png" → { width, height } (public/ altından okunur).
 *
 * Video verilirse yanındaki poster karesinden okur ("y.mp4" → "y-poster.jpg").
 * mp4 kutularını TypeScript'te ayrıştırmak yerine bu yol seçildi: poster
 * zaten ffmpeg ile üretiliyor ve videonun ölçüsünü birebir taşıyor. Poster
 * yoksa varsayılana düşer.
 */
export function gorselOlcu(src: string): { width: number; height: number } {
  const onbelleklenmis = onbellek.get(src);
  if (onbelleklenmis) return onbelleklenmis;

  const hedef = src.endsWith(".mp4")
    ? src.replace(/\.mp4$/, "-poster.jpg")
    : src;

  let sonuc = VARSAYILAN;
  try {
    const tam = path.join(process.cwd(), "public", hedef);
    const b = fs.readFileSync(tam);
    const uzanti = path.extname(hedef).toLowerCase();
    if (uzanti === ".png" && b.length > 24) sonuc = pngOlcu(b);
    else if (uzanti === ".jpg" || uzanti === ".jpeg") sonuc = jpegOlcu(b) ?? VARSAYILAN;
  } catch {
    // Dosya yoksa/okunamıyorsa varsayılanla devam — derleme kırılmaz.
  }

  onbellek.set(src, sonuc);
  return sonuc;
}
