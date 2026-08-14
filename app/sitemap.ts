import type { MetadataRoute } from "next";
import { BRANDS } from "@/content/brands";
import { BLOGS } from "@/content/blogs";

// TODO: canlı alan adı netleşince güncellenecek
const BASE = "https://tellers.email";

export default function sitemap(): MetadataRoute.Sitemap {
  const statik = [
    "",
    "/hakkimizda",
    "/portfolyo",
    "/hizmetlerimiz",
    "/blog",
    "/kariyer",
    "/iletisim",
  ].map((p) => ({ url: `${BASE}${p}`, changeFrequency: "monthly" as const }));

  const markalar = BRANDS.map((b) => ({
    url: `${BASE}/portfolyo/${b.slug}`,
    changeFrequency: "yearly" as const,
  }));

  const yazilar = BLOGS.map((b) => ({
    url: `${BASE}/blog/${b.slug}`,
    changeFrequency: "yearly" as const,
  }));

  return [...statik, ...markalar, ...yazilar];
}
