/**
 * JSON-LD yapısal veri etiketi.
 *
 * GÜVENLİK: JSON içine düşen "<" karakteri tarayıcıda </script> olarak
 * yorumlanıp etiketi erken kapatabilir (script enjeksiyonu). Bu yüzden "<"
 * ve JavaScript'te satır ayracı sayılan U+2028 / U+2029 kaçırılarak basılır —
 * içerik kendi dosyalarımızdan gelse bile bu kaçış zorunlu uygulamadır.
 *
 * NOT: kaçırılacak karakterler fromCharCode ile üretilir; kaynak dosyaya
 * görünmez karakter yazmamak için (editörde/diff'te fark edilmez).
 *
 * CSP notu (düzeltme, security-auditor O-6): ld+json etiketinin çalışması
 * 'unsafe-inline'a BAĞLI DEĞİL. HTML spesifikasyonunda ld+json bir "veri
 * bloğu"dur; tarayıcı onu hiç çalıştırmadığı için CSP'nin satır içi script
 * kontrolüne uğramaz. Politikadaki 'unsafe-inline'ı zorunlu kılan, Next.js'in
 * kendi RSC bootstrap script'leridir. Yani CSP nonce'a sıkılaştırılırsa burası
 * kırılmaz — sıkılaştırma önündeki engel bu dosya değil.
 */
const SATIR_AYRAC = String.fromCharCode(0x2028);
const PARAGRAF_AYRAC = String.fromCharCode(0x2029);

export default function JsonLd({ data }: { data: unknown }) {
  // Boş veri gelirse etiket hiç basılmaz. JSON.stringify(undefined) string
  // değil undefined döner ve zincirdeki .split() derlemeyi çökertirdi.
  if (data === undefined || data === null) return null;

  const json = JSON.stringify(data)
    .split("<")
    .join("\\u003c")
    .split(SATIR_AYRAC)
    .join("\\u2028")
    .split(PARAGRAF_AYRAC)
    .join("\\u2029");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
