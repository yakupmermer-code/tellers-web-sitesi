import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
    <html lang="tr">
      <body className="min-h-[100dvh] flex flex-col">
        {/* Font CDN'ine erken bağlantı (render blokajını kısaltır) */}
        <link rel="preconnect" href="https://fonts.cdnfonts.com" crossOrigin="" />
        {/* JS kapalıysa Reveal ile gizlenen bölümleri görünür kıl */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
