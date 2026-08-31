import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/content/site";
import {
  SITE_URL,
  NOINDEX,
  grafik,
  kurulusSemasi,
  websiteSemasi,
} from "@/lib/seo";

export const metadata: Metadata = {
  // Adres artık lib/seo.ts'ten geliyor: NEXT_PUBLIC_SITE_URL > Railway alan
  // adı > tellers.email. Böylece canonical / sitemap / OG hepsi aynı köke bakar.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.title,
    template: "%s | tellers",
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: "Tellers Creative Communications", url: SITE_URL }],
  creator: "Tellers Creative Communications",
  publisher: "Tellers Creative Communications",
  keywords: [
    "reklam ajansı",
    "marka iletişimi",
    "performans pazarlama",
    "dijital pazarlama",
    "markalama",
    "kreatif tasarım",
    "Ankara reklam ajansı",
    "tellers",
  ],
  // Arama motoru direktifleri. max-snippet:-1 ve max-image-preview:large hem
  // zengin sonuçlar hem de yapay zeka özetleri için belirleyicidir:
  // sınırlandırılmış snippet, modelin alıntılayabileceği metni kısar.
  // TAKAS (Yakup onayına açık): sınırsız alıntı görünürlüğü artırır ama tam
  // metnin arama sonucunda gösterilmesine ve tıklama kaybına da izin verir.
  robots: NOINDEX
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-snippet": -1,
          "max-image-preview": "large",
          "max-video-preview": -1,
        },
      },
  openGraph: {
    title: SITE.title,
    description: SITE.slogan,
    siteName: SITE.title,
    url: SITE_URL,
    locale: "tr_TR",
    type: "website",
    // 1920x540 = dosyanın GERÇEK ölçüsü (önce 545 yazıyordu, yanlıştı).
    images: [
      {
        url: "/assets/home/imaj-bolucu.png",
        width: 1920,
        height: 540,
        alt: SITE.slogan,
      },
    ],
  },
  formatDetection: { telephone: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-scroll-behavior: Next 16'da rota geçişlerinde smooth scroll'un
    // doğru yönetilmesi için gerekli (yoksa geçişte sayfa yavaşça kayar)
    <html lang="tr" data-scroll-behavior="smooth">
      <body className="min-h-[100dvh] flex flex-col">
        {/* Klavye kullanıcıları için: menüyü atlayıp içeriğe git (WCAG 2.4.1) */}
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-full focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
        >
          İçeriğe atla
        </a>
        {/* Font CDN'ine erken bağlantı (render blokajını kısaltır) */}
        <link rel="preconnect" href="https://fonts.cdnfonts.com" crossOrigin="" />
        {/* JS kapalıysa animasyonla gizlenen bölümleri görünür kıl */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important}`}</style>
        </noscript>
        {/* Kuruluş + site kimliği (schema.org). Tüm sayfalarda aynı @id ile
            durur; sayfaya özel düğümler (WebPage/Article/CreativeWork) bu
            düğümlere @id ile bağlanır. Yapay zeka motorları "tellers kimdir,
            ne yapar, nerede" sorusunu bu grafikten cevaplar. */}
        <JsonLd data={grafik(kurulusSemasi(), websiteSemasi())} />
        <SmoothScroll />
        <Header />
        {/* NOT (2026-08-15): temanın "footer altından çıkar" efekti (Arpeggio
            section 19) burada UYGULANMADI. O efekt sabitlenen alanın ekran
            yüksekliğine sığmasını gerektiriyor; bizim footer 1457px (ekran
            814px) olduğu için `sticky bottom-0` denendiğinde footer'ın üst
            643px'i (logo + slogan) kalıcı olarak kırpıldı. Doğru karşılığı
            kapanış görselini sabitlemek ama o görselin içindeki tıklama
            alanları yüzdeyle konumlandığı için kırpma onları kaydırıyor.
            KARAR (Yakup, 2026-08-15): footer kısaltılmayacak, bu efekt
            UYGULANMAYACAK — sayfa mevcut hâliyle doğru çalışıyor.
            Yeniden açılırsa tek yol footer'ı ~750px'e indirmek. */}
        <main id="icerik" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
