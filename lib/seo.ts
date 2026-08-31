import type { Metadata } from "next";
import { SITE } from "@/content/site";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SEO / GEO altyapısı — tek doğru kaynak.
 * ─────────────────────────────────────────────────────────────────────────────
 * Sitenin kök adresi buradan türer; canonical, sitemap, robots, OG ve JSON-LD
 * hepsi bu tek değeri kullanır.
 *
 * NEDEN: adres daha önce 3 ayrı dosyaya (layout / robots / sitemap) elle
 * yazılmıştı ve hepsi "https://tellers.email" diyordu — oysa site Railway
 * adresinde yayındaydı. Sonuç: sitemap'teki hiçbir URL çalışmıyor, OG
 * görselleri 404 veriyordu. Tek kaynağa indirildi (2026-08-26).
 *
 * Öncelik sırası:
 *   1) NEXT_PUBLIC_SITE_URL   → alan adı bağlanınca Railway'de bu ayarlanır
 *   2) RAILWAY_PUBLIC_DOMAIN  → Railway otomatik verir (şu anki geçici adres)
 *   3) https://tellers.email  → son çare
 */
function cozSiteUrl(): string {
  const acik = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (acik) return acik.replace(/\/+$/, "");

  const railway = process.env.RAILWAY_PUBLIC_DOMAIN?.trim();

  // Sessiz düşüş, SEO'da geri dönüşü en pahalı hatalardan biri: yanlış adrese
  // bakan canonical'lar. Bu yüzden production derlemesinde açık değer yoksa
  // derleme günlüğüne GÖRÜNÜR uyarı bırakılır (code-reviewer bulgusu Y-1).
  if (process.env.NODE_ENV === "production") {
    console.warn(
      railway
        ? `[seo] NEXT_PUBLIC_SITE_URL tanımlı değil — geçici adres kullanılıyor: https://${railway}\n` +
            `      Gerçek alan adı bağlanınca bu değişkeni ayarla, yoksa canonical'lar geçici adresi gösterir.`
        : `[seo] UYARI: NEXT_PUBLIC_SITE_URL ve RAILWAY_PUBLIC_DOMAIN'in İKİSİ DE yok.\n` +
            `      Tüm canonical / sitemap / OG adresleri https://tellers.email'e düşecek —\n` +
            `      o alan adı web olarak YAYINDA DEĞİL, yani site indekslenemez.`
    );
  }

  if (railway) return `https://${railway.replace(/\/+$/, "")}`;
  return "https://tellers.email";
}

export const SITE_URL = cozSiteUrl();

/**
 * Arama motorlarına kapatma anahtarı (staging/önizleme için).
 * VARSAYILAN: KAPALI — yani site indekslenebilir. Geçici Railway adresinin
 * Google'a girmesi istenmiyorsa Railway'de NEXT_PUBLIC_NOINDEX=1 yapılır.
 */
export const NOINDEX = process.env.NEXT_PUBLIC_NOINDEX === "1";

/**
 * Göreli yolu tam adrese çevirir: "/blog" → "https://…/blog".
 * Kök için sondaki eğik çizgi ATILIR; yoksa JSON-LD "…/" derken canonical
 * "…" diyor ve aynı sayfa için iki farklı adres beyan edilmiş oluyordu.
 */
function mutlak(yol: string): string {
  if (yol === "/" || yol === "") return SITE_URL;
  return `${SITE_URL}${yol.startsWith("/") ? yol : `/${yol}`}`;
}

/* ─── Tarih yardımcıları ─────────────────────────────────────────────────── */

const TR_AYLAR: Record<string, string> = {
  ocak: "01", şubat: "02", mart: "03", nisan: "04", mayıs: "05", haziran: "06",
  temmuz: "07", ağustos: "08", eylül: "09", ekim: "10", kasım: "11", aralık: "12",
};

/**
 * "14 Ağustos 2026, Cuma" → "2026-08-14" (schema.org ISO 8601 ister).
 *
 * Ay adı tanınmazsa VEYA tarih takvimde gerçekten yoksa undefined döner —
 * uydurma tarih asla basılmaz. Takvim kontrolü şart: "31 Şubat 2026" gibi bir
 * yazım hatası, Date nesnesi tarafından sessizce 3 Mart'a kaydırılıyor ve
 * sitemap'e yanlış lastmod olarak giriyordu (code-reviewer bulgusu).
 */
export function trTarihISO(tarih: string): string | undefined {
  const m = tarih.match(/(\d{1,2})\s+(\p{L}+)\s+(\d{4})/u);
  if (!m) return undefined;
  const ay = TR_AYLAR[m[2].toLocaleLowerCase("tr-TR")];
  if (!ay) return undefined;
  const iso = `${m[3]}-${ay}-${m[1].padStart(2, "0")}`;
  // Gerçekten var olan bir gün mü? (UTC ile kur ki yerel saat dilimi kaydırmasın)
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== iso
    ? undefined
    : iso;
}

/** "2023-2025" / "2023-Devam ediyor" / "2016" → "2016" (yoksa undefined). */
function ilkYil(deger: string): string | undefined {
  return deger.match(/\d{4}/)?.[0];
}

/* ─── schema.org düğümleri ───────────────────────────────────────────────── */

type Dugum = Record<string, unknown>;

const KURULUS_ID = `${SITE_URL}/#kurulus`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const LOGO_ID = `${SITE_URL}/#logo`;

/**
 * Ajansın kimlik kartı. Yapay zeka motorları ("tellers kimdir, ne yapar,
 * nerede, kiminle çalıştı") bu düğümden cevap üretir — GEO'nun temeli budur.
 * Kural: burada UYDURMA veri olmaz; her alan content/site.ts'ten gelir.
 */
export function kurulusSemasi(): Dugum {
  return {
    "@type": ["Organization", "AdvertisingAgency"],
    "@id": KURULUS_ID,
    name: SITE.name,
    // legalName BİLEREK yazılmıyor: schema.org'da TESCİLLİ ticaret unvanı
    // demektir ve resmî unvanı doğrulayamıyoruz. Yanlış beyan, GEO'da en pahalı
    // hatadır (security-auditor O-2). alternateName ise sadece "bilinen ad".
    alternateName: "Tellers Creative Communications",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      "@id": LOGO_ID,
      url: mutlak("/assets/logo/tellers-logo.png"),
      contentUrl: mutlak("/assets/logo/tellers-logo.png"),
      width: 850,
      height: 850,
      caption: "tellers",
    },
    image: { "@id": LOGO_ID },
    description: SITE.description,
    slogan: SITE.slogan,
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.adres.sokak,
      addressLocality: SITE.adres.ilce,
      addressRegion: SITE.adres.il,
      addressCountry: SITE.adres.ulkeKodu,
    },
    sameAs: [SITE.instagram, SITE.linkedin],
    knowsAbout: [
      "Performans Pazarlama",
      "Dijital Pazarlama",
      "Markalama",
      "Kreatif Tasarım",
      "Marka İletişimi",
      "Reklam Stratejisi",
    ],
    areaServed: [
      { "@type": "Country", name: "Türkiye" },
      { "@type": "Country", name: "Birleşik Krallık" },
      { "@type": "Place", name: "Avrupa" },
      { "@type": "Place", name: "Orta Doğu" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: SITE.email,
      telephone: SITE.phone,
      availableLanguage: ["tr", "en"],
    },
  };
}

/** Sitenin kendisi — yayıncı olarak kuruluşa bağlanır. */
export function websiteSemasi(): Dugum {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE.title,
    description: SITE.description,
    publisher: { "@id": KURULUS_ID },
    inLanguage: "tr-TR",
  };
}

/** Sayfa düğümü — her alt sayfada bir tane. */
export function sayfaSemasi(opts: {
  tip?: string;
  yol: string;
  ad: string;
  aciklama: string;
  gorsel?: string;
}): Dugum {
  const url = mutlak(opts.yol);
  return {
    "@type": opts.tip ?? "WebPage",
    "@id": `${url}#sayfa`,
    url,
    name: opts.ad,
    description: opts.aciklama,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": KURULUS_ID },
    inLanguage: "tr-TR",
    ...(opts.gorsel ? { primaryImageOfPage: { "@type": "ImageObject", url: mutlak(opts.gorsel) } } : {}),
  };
}

/** Kırıntı navigasyonu — Google sonuçlarında yol çizgisi olarak görünür. */
export function kirintiSemasi(
  adimlar: Array<{ ad: string; yol: string }>
): Dugum | undefined {
  if (adimlar.length === 0) return undefined; // grafik() zaten eler
  return {
    "@type": "BreadcrumbList",
    "@id": `${mutlak(adimlar[adimlar.length - 1].yol)}#kirinti`,
    itemListElement: adimlar.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.ad,
      item: mutlak(a.yol),
    })),
  };
}

/** Basit liste (portfolyo / blog dizini) — sıralı öğeler + adresleri. */
export function listeSemasi(opts: {
  yol: string;
  ad: string;
  ogeler: Array<{ ad: string; yol: string }>;
}): Dugum {
  return {
    "@type": "ItemList",
    "@id": `${mutlak(opts.yol)}#liste`,
    name: opts.ad,
    numberOfItems: opts.ogeler.length,
    itemListElement: opts.ogeler.map((o, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: o.ad,
      url: mutlak(o.yol),
    })),
  };
}

/**
 * Hizmet kataloğu. "tellers hangi hizmetleri veriyor" sorusunun yapay zeka
 * tarafındaki kaynağı budur; hizmetlerin ayrı sayfası olmadığı için Service
 * düğümleri doğrudan listenin içine gömülür.
 */
export function hizmetListesiSemasi(
  hizmetler: Array<{ ad: string; aciklama: string }>,
  yol: string
): Dugum {
  return {
    "@type": "ItemList",
    "@id": `${mutlak(yol)}#hizmetler`,
    name: "tellers hizmetleri",
    numberOfItems: hizmetler.length,
    itemListElement: hizmetler.map((h, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: h.ad,
        description: h.aciklama,
        serviceType: h.ad,
        provider: { "@id": KURULUS_ID },
        areaServed: [
          { "@type": "Country", name: "Türkiye" },
          { "@type": "Place", name: "Avrupa" },
        ],
      },
    })),
  };
}

/** Blog dizini — yazılar detay sayfalarıyla aynı @id'yi kullanır (birleşirler). */
export function blogDiziniSemasi(
  yazilar: Array<{ slug: string; title: string; date: string; image: string }>
): Dugum {
  return {
    "@type": "Blog",
    "@id": `${mutlak("/blog")}#blog`,
    url: mutlak("/blog"),
    name: "tellers Blog",
    description:
      "Pazarlama, markalama ve anlam mimarisi üzerine tellers'ın güncel yazıları.",
    publisher: { "@id": KURULUS_ID },
    inLanguage: "tr-TR",
    blogPost: yazilar.map((y) => {
      const iso = trTarihISO(y.date);
      return {
        "@type": "BlogPosting",
        "@id": `${mutlak(`/blog/${y.slug}`)}#yazi`,
        headline: y.title,
        url: mutlak(`/blog/${y.slug}`),
        image: mutlak(y.image),
        // author/publisher olmadan Google bu düğümleri "eksik alanlı Article"
        // sayıp Search Console'da uyarı üretir; @id referansı yeterlidir.
        author: { "@id": KURULUS_ID },
        publisher: { "@id": KURULUS_ID },
        ...(iso ? { datePublished: iso } : {}),
      };
    }),
  };
}

/** Meta açıklaması için güvenli kısaltma (kelime ortasından kesmez). */
export function kisalt(metin: string, uzunluk = 160): string {
  const temiz = metin.replace(/\s+/g, " ").trim();
  if (temiz.length <= uzunluk) return temiz;
  const kesik = temiz.slice(0, uzunluk);
  const bosluk = kesik.lastIndexOf(" ");
  // Boşluk yoksa (tek uzun kelime) ya da çok erkendeyse kelime sınırı aramayı
  // bırak; yoksa açıklama birkaç karaktere düşüyordu (code-reviewer bulgusu).
  return `${bosluk > uzunluk * 0.5 ? kesik.slice(0, bosluk) : kesik}…`;
}

/**
 * Marka işi (portfolyo detayı) → CreativeWork.
 * "about" alanı müşteri kurumu işaret eder; böylece arama/yapay zeka tarafında
 * "tellers hangi markalarla çalıştı" ilişkisi kurulur.
 */
export function markaSemasi(marka: {
  slug: string;
  name: string;
  headline: string;
  intro: string;
  banner: string;
  services: string[];
  year: string;
  meta: { musteri: string };
}): Dugum {
  const yol = `/portfolyo/${marka.slug}`;
  const url = mutlak(yol);
  const yil = ilkYil(marka.year);
  return {
    "@type": "CreativeWork",
    "@id": `${url}#is`,
    url,
    name: `${marka.name} — ${marka.headline}`,
    headline: marka.headline,
    // intro cok satirli; sema alaninda tek satira indirilir
    description: marka.intro.replace(/\s+/g, " ").trim(),
    image: mutlak(marka.banner),
    creator: { "@id": KURULUS_ID },
    provider: { "@id": KURULUS_ID },
    about: { "@type": "Organization", name: marka.meta.musteri },
    keywords: marka.services.join(", "),
    inLanguage: "tr-TR",
    isPartOf: { "@id": WEBSITE_ID },
    // temporalCoverage BASILMIYOR: "2023-Devam ediyor" gibi serbest metin
    // makine tarafında ISO aralık sanılıp yanlış okunuyor. Temiz olan yıl
    // dateCreated'da zaten var.
    ...(yil ? { dateCreated: yil } : {}),
  };
}

/**
 * Blog yazısı → BlogPosting.
 * articleBody BİLEREK basılmaz: tüm gövdeyi JSON'a kopyalamak HTML'i ikiye
 * katlar ve sayfanın metin/HTML oranını bozar (bizim en güçlü olduğumuz metrik).
 * author olarak kurum verilir — yazıların isimli yazarı yok, uydurulmaz.
 */
export function yaziSemasi(yazi: {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  body: string;
}): Dugum {
  const yol = `/blog/${yazi.slug}`;
  const url = mutlak(yol);
  const iso = trTarihISO(yazi.date);
  return {
    "@type": "BlogPosting",
    "@id": `${url}#yazi`,
    url,
    headline: yazi.title,
    description: yazi.excerpt,
    image: mutlak(yazi.image),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${url}#sayfa` },
    author: { "@id": KURULUS_ID },
    publisher: { "@id": KURULUS_ID },
    isPartOf: { "@id": `${mutlak("/blog")}#blog` },
    inLanguage: "tr-TR",
    wordCount: yazi.body.trim().split(/\s+/).length,
    ...(iso ? { datePublished: iso, dateModified: iso } : {}),
  };
}

/**
 * Sayfa bazlı sosyal paylaşım etiketleri (Open Graph + Twitter).
 *
 * NEDEN GEREKLİ: Next.js'te alt sayfa `openGraph` tanımlarsa üstteki layout
 * nesnesini KOMPLE ezer — siteName/locale/image ölçüleri kaybolur. Tanımlamazsa
 * da layout'un sabit başlığı kalır, yani her sayfa aynı başlıkla paylaşılır.
 * İkisi de yanlış; bu yardımcı her sayfaya EKSİKSİZ ve DOĞRU set üretir.
 *
 * twitter:* BİLEREK yazılmaz — Next.js bunları openGraph'tan otomatik türetiyor
 * ve türettiğinde görsel en/boy bilgisini de ekliyor. Elle yazmak o bilgiyi
 * kaybettiriyordu (doğrulandı: canlı sitede 6 twitter etiketi vardı, elle
 * yazınca 4'e düştü). Tek kaynak openGraph olsun.
 */
const VARSAYILAN_GORSEL = "/assets/home/imaj-bolucu.png";
/** imaj-bolucu.png dosyasının GERÇEK ölçüsü (eskiden 545 yazıyordu, yanlıştı). */
const VARSAYILAN_OLCU = { width: 1920, height: 540 };

export function paylasim(opts: {
  baslik: string;
  aciklama: string;
  yol: string;
  gorsel?: string;
  gorselAlt?: string;
  makale?: boolean;
  yayinTarihi?: string;
}): Pick<Metadata, "openGraph"> {
  const gorsel = opts.gorsel ?? VARSAYILAN_GORSEL;
  const alt = opts.gorselAlt ?? opts.baslik;
  // Ölçü yalnızca varsayılan görsel için bilinir; Facebook/LinkedIn kartı
  // görseli indirmeden çizebilsin diye verilir. Sayfaya özel görsellerde
  // ölçü kodda tutulmuyor — platform kendisi ölçer.
  const olcu = opts.gorsel ? {} : VARSAYILAN_OLCU;
  const ortak = {
    title: opts.baslik,
    description: opts.aciklama,
    url: opts.yol,
    siteName: SITE.name,
    locale: "tr_TR",
    images: [{ url: gorsel, alt, ...olcu }],
  };

  const openGraph: NonNullable<Metadata["openGraph"]> = opts.makale
    ? {
        ...ortak,
        type: "article",
        ...(opts.yayinTarihi
          ? { publishedTime: opts.yayinTarihi, modifiedTime: opts.yayinTarihi }
          : {}),
      }
    : { ...ortak, type: "website" };

  return { openGraph };
}

/** Düğümleri tek bir @graph içine sarar; boş/undefined olanları eler. */
export function grafik(...dugumler: Array<Dugum | undefined | false>) {
  return {
    "@context": "https://schema.org",
    "@graph": dugumler.filter(Boolean),
  };
}
