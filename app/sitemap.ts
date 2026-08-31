import type { MetadataRoute } from "next";
import { BRANDS } from "@/content/brands";
import { BLOGS } from "@/content/blogs";
import { SITE_URL, trTarihISO } from "@/lib/seo";

/**
 * Site haritası. Adres artık lib/seo.ts'ten geliyor (elle yazılı alan adı
 * yüzünden tüm URL'ler yanlış domaine bakıyordu — 2026-08-26'da düzeltildi).
 *
 * lastModified: blog yazılarında GERÇEK yayın tarihi kullanılır; diğer
 * sayfalarda derleme (build) anı — içerik değişince yeni derleme çıktığı için
 * bu doğru bir yaklaşımdır.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const derlemeAni = new Date();

  const statik: MetadataRoute.Sitemap = [
    { yol: "", oncelik: 1.0 },
    { yol: "/hakkimizda", oncelik: 0.8 },
    { yol: "/portfolyo", oncelik: 0.9 },
    { yol: "/hizmetlerimiz", oncelik: 0.9 },
    { yol: "/blog", oncelik: 0.8 },
    { yol: "/kariyer", oncelik: 0.5 },
    { yol: "/iletisim", oncelik: 0.7 },
  ].map(({ yol, oncelik }) => ({
    url: `${SITE_URL}${yol}`,
    lastModified: derlemeAni,
    changeFrequency: "monthly" as const,
    priority: oncelik,
  }));

  const markalar: MetadataRoute.Sitemap = BRANDS.map((b) => ({
    url: `${SITE_URL}/portfolyo/${b.slug}`,
    lastModified: derlemeAni,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const yazilar: MetadataRoute.Sitemap = BLOGS.map((b) => {
    const iso = trTarihISO(b.date);
    return {
      url: `${SITE_URL}/blog/${b.slug}`,
      lastModified: iso ? new Date(iso) : derlemeAni,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    };
  });

  return [...statik, ...markalar, ...yazilar];
}
