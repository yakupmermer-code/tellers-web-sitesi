import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  // TODO: canlı alan adı netleşince güncellenecek (OG görselleri için gerekli)
  metadataBase: new URL("https://tellers.email"),
  title: {
    default: SITE.title,
    template: "%s | tellers",
  },
  description: SITE.description,
  openGraph: {
    title: SITE.title,
    description: SITE.slogan,
    locale: "tr_TR",
    type: "website",
    images: [{ url: "/assets/home/imaj-bolucu.png", width: 1920, height: 545 }],
  },
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
