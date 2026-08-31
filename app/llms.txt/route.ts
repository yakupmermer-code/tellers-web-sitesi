import { BRANDS } from "@/content/brands";
import { BLOGS } from "@/content/blogs";
import { SERVICES } from "@/content/services";
import { SITE } from "@/content/site";
import { SITE_URL, NOINDEX } from "@/lib/seo";

/**
 * /llms.txt — yapay zeka motorları için sade içerik haritası (llmstxt.org).
 *
 * NEDEN: robots.txt "nereye girebilirsin"i söyler, sitemap.xml "hangi adresler
 * var"ı. İkisi de sayfaların NE ANLATTIĞINI söylemez. llms.txt bunu düz metin
 * olarak verir; model 32 sayfayı tek tek indirmeden "tellers kimdir, ne yapar,
 * hangi markalarla çalıştı" sorusunu tek dosyadan cevaplayabilir.
 *
 * DÜRÜSTLÜK NOTU: llms.txt henüz resmî bir standart DEĞİL, yayılmakta olan bir
 * öneri. Maliyeti sıfıra yakın ve zararı yok; benimsenirse doğrudan kazanç.
 * sitemap.xml ve JSON-LD asıl kaynak olmayı sürdürür — bu onların yerine
 * geçmez, üstüne eklenir.
 *
 * İçerik content/ altındaki dosyalardan üretilir; elle güncellenmez.
 */
export const dynamic = "force-static";

export function GET() {
  const satirlar: string[] = [
    `# ${SITE.name} — Tellers Creative Communications`,
    "",
    `> ${SITE.description}`,
    "",
    `Slogan: "${SITE.slogan}"`,
    `Konum: ${SITE.adres.ilce} / ${SITE.adres.il}, Türkiye`,
    `İletişim: ${SITE.email}`,
    "",
    "## Hizmetler",
    "",
    ...SERVICES.map(
      (s) => `- **${s.titleTr}**: ${s.summary} (${SITE_URL}/hizmetlerimiz)`
    ),
    "",
    "## Portfolyo — markalar ve yapılan işler",
    "",
    // Dönem yalnızca EKİP TEYİTLİ markalarda yazılır; teyitsiz tarihi yapay
    // zekaya gerçek diye vermek uydurma veri yayınlamaktır (2026-08-31).
    ...BRANDS.map(
      (b) =>
        `- [${b.name}](${SITE_URL}/portfolyo/${b.slug}) — ${b.headline}. ` +
        `Hizmetler: ${b.services.join(", ")}.` +
        (b.tarihTeyitsiz ? "" : ` Dönem: ${b.year}.`)
    ),
    "",
    "## Blog yazıları",
    "",
    ...BLOGS.map(
      (b) => `- [${b.title}](${SITE_URL}/blog/${b.slug}) — ${b.excerpt}`
    ),
    "",
    "## Diğer sayfalar",
    "",
    `- [Ana sayfa](${SITE_URL}/) — ajansın genel tanıtımı`,
    `- [Hakkımızda](${SITE_URL}/hakkimizda) — ajansın yaklaşımı ve ekibi`,
    `- [Hizmetlerimiz](${SITE_URL}/hizmetlerimiz) — hizmetlerin ayrıntılı anlatımı`,
    `- [Portfolyo](${SITE_URL}/portfolyo) — tüm markaların listesi`,
    `- [Blog](${SITE_URL}/blog) — tüm yazıların listesi`,
    `- [Kariyer](${SITE_URL}/kariyer) — ekibe katılma`,
    `- [İletişim](${SITE_URL}/iletisim) — adres, telefon, form`,
    "",
    "## Notlar",
    "",
    "- Site dili Türkçe'dir.",
    `- Yapısal veri (schema.org JSON-LD) her sayfada gömülüdür.`,
    `- Tam adres listesi: ${SITE_URL}/sitemap.xml`,
    ...(NOINDEX ? ["- Bu kopya bir ÖNİZLEMEDİR; indekslenmemelidir."] : []),
    "",
  ];

  return new Response(satirlar.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
