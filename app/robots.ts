import type { MetadataRoute } from "next";
import { SITE_URL, NOINDEX } from "@/lib/seo";

/**
 * Yapay zeka / cevap motoru botları.
 *
 * "User-agent: *  Allow: /" zaten hepsini kapsıyor; bu listenin amacı NİYETİ
 * AÇIKÇA BEYAN ETMEK. Bazı botlar kendi adlarına özel kural bulamazsa
 * muhafazakâr davranıyor; ayrıca ileride bir bot varsayılanını değiştirirse
 * bizim açık iznimiz geçerli kalır. GEO (yapay zekada görünürlük) için
 * tavsiye edilen kurulum budur.
 *
 * ⚠️ TUZAK (security-auditor O-3): robots.txt'te bir bot KENDİ ADINA grup
 * bulursa "*" grubunu TAMAMEN yok sayar. Yani ileride "*" altına bir Disallow
 * eklenirse bu 13 bot onu GÖRMEZ. Bu yüzden yasaklar tek yerde (YASAK_YOLLAR)
 * tutulur ve HER gruba birden uygulanır — yeni yasak eklerken sadece o diziye
 * yazmak yeterlidir.
 */
const YASAK_YOLLAR: string[] = [];

const AI_BOTLARI = [
  "GPTBot", // OpenAI — model eğitimi
  "OAI-SearchBot", // OpenAI — ChatGPT arama indeksi
  "ChatGPT-User", // OpenAI — kullanıcı isteğiyle anlık getirme
  "ClaudeBot", // Anthropic — indeks
  "Claude-User", // Anthropic — kullanıcı isteğiyle anlık getirme
  "Claude-SearchBot", // Anthropic — arama
  "PerplexityBot", // Perplexity — indeks
  "Perplexity-User", // Perplexity — anlık getirme
  "Google-Extended", // Google Gemini / Vertex AI temellendirme
  "Applebot-Extended", // Apple Intelligence
  "meta-externalagent", // Meta AI
  "Amazonbot", // Amazon / Alexa
  "CCBot", // Common Crawl (birçok modelin veri kaynağı)
];

export default function robots(): MetadataRoute.Robots {
  /**
   * Önizleme/staging kilidi — Railway'de NEXT_PUBLIC_NOINDEX=1 ise.
   *
   * DİKKAT: burada BİLEREK "Disallow: /" yazmıyoruz (security-auditor Y-2).
   * Tarama engellenirse bot sayfayı indiremez, dolayısıyla noindex etiketini
   * de GÖREMEZ; URL dışarıdan bir linkle duyulursa "başlıksız sonuç" olarak
   * yine indekslenebilir. Doğru kurgu: TARAMA SERBEST + noindex. noindex iki
   * yerden birden veriliyor: app/layout.tsx'teki meta ve next.config.ts'teki
   * X-Robots-Tag başlığı. Sitemap de duyurulmaz.
   */
  if (NOINDEX) {
    return { rules: { userAgent: "*", allow: "/" } };
  }

  const yasak = YASAK_YOLLAR.length ? { disallow: YASAK_YOLLAR } : {};

  return {
    rules: [
      { userAgent: "*", allow: "/", ...yasak },
      ...AI_BOTLARI.map((userAgent) => ({ userAgent, allow: "/", ...yasak })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
