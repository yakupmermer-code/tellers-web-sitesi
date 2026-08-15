import Link from "next/link";
import Image from "next/image";
import LiveClock from "@/components/LiveClock";
import NewsletterForm from "@/components/NewsletterForm";
import { NAV, SITE } from "@/content/site";

export default function Footer() {
  return (
    <footer className="bg-paper">
      {/* Newsletter — ekibin footer_newslatter tasarımının metin karşılığı */}
      <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-navy md:text-[96px]">
              Birlikte çalışalım?
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-navy/70">
              Sorularınız, iş birlikleri ve yeni projeler için{" "}
              <em className="font-didot text-navy">bir e-posta</em> uzağınızdayız.
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-navy/50">
              Gelen kutunuza saygı duyuyoruz. Spam yok,{" "}
              <em className="font-didot">hızlı ve doğrudan geri dönüş</em> var.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Alt bant — temadaki düzen */}
      <div className="border-t hairline">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 md:grid-cols-4 md:px-10">
          <div>
            <Image
              src="/assets/logo/tellers-logo.png"
              alt="tellers"
              width={120}
              height={34}
              className="h-8 w-auto"
            />
            <p className="mt-4 text-sm leading-relaxed text-navy/50">
              {SITE.slogan}
            </p>
          </div>

          <nav aria-label="Footer menü" className="flex flex-col gap-3">
            <span className="text-[11px] uppercase tracking-[0.2em] text-navy/40">
              Menü
            </span>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="link-grow w-max text-sm text-navy/70 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-navy"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <span className="text-[11px] uppercase tracking-[0.2em] text-navy/40">
              Hizmetler
            </span>
            {[
              "Performans Pazarlama",
              "Dijital Pazarlama",
              "Markalama",
              "Kreatif Tasarım Hizmetleri",
            ].map((s) => (
              <Link
                key={s}
                href="/hizmetlerimiz"
                className="link-grow w-max text-sm text-navy/70 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-navy"
              >
                {s}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[11px] uppercase tracking-[0.2em] text-navy/40">
              Bize Ulaşın
            </span>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="link-grow w-max text-sm text-navy/70 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-navy"
            >
              LinkedIn
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="link-grow w-max text-sm text-navy/70 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-navy"
            >
              Instagram
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="link-grow w-max text-sm text-navy/70 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-navy"
            >
              {SITE.email}
            </a>
          </div>
        </div>

        <div className="border-t hairline">
          <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-5 py-6 text-[12px] text-navy/40 md:flex-row md:px-10">
            {/* Ekip notu: bu alana metin yazılmadan sadece tarih-saat akışı */}
            <LiveClock />
            <span>© {new Date().getFullYear()} tellers — Tüm hakları saklıdır.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
