import Link from "next/link";
import Image from "next/image";
import LiveClock from "@/components/LiveClock";
import NewsletterForm from "@/components/NewsletterForm";
import { NAV, SITE } from "@/content/site";

export default function Footer() {
  return (
    <footer className="bg-paper">
      {/* Newsletter — ekibin footer_newslatter tasarımının metin karşılığı */}
      <div className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-32">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-navy md:text-[96px]">
              Birlikte çalışalım?
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-navy/75">
              Sorularınız, iş birlikleri ve yeni projeler için{" "}
              <em className="font-didot text-navy">bir e-posta</em>{" "}
              uzağınızdayız.
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-navy/60">
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
            {/* BOŞLUKSUZ LOGO (2026-09-01, Yakup: "footer'daki logo ve yazılar
                alanda kayboluyor"). Sebep: tellers-logo.png 850x850 KARE ve
                kelime işareti karenin yalnızca %26'sını kaplıyor (ölçüldü:
                775x225 @ 40,305). h-8 kutuda görünen yazı 8 piksel kalıyordu.
                Bu sürüm şeffaf kenarlardan kırpıldı; h-10 artık gerçekten
                40px'lik bir kelime işareti demek.
                NOT: aynı sorun Header'da da var (72px kutu -> 19px yazı) ama
                orası bilinçli bir tasarım tercihi olabilir, dokunulmadı. */}
            <Image
              src="/assets/logo/tellers-logo-tight.png"
              alt="tellers"
              width={775}
              height={225}
              className="h-10 w-auto md:h-12"
            />
            <p className="mt-5 text-[16px] leading-relaxed text-navy/60">
              {SITE.slogan}
            </p>
          </div>

          <nav aria-label="Footer menü" className="flex flex-col gap-3">
            <span className="text-[13px] uppercase tracking-[0.2em] text-navy/50">
              Menü
            </span>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="link-grow w-max text-[16px] text-navy/70 transition-colors duration-500 ease-[var(--ease-lux)] hover:text-navy"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <span className="text-[13px] uppercase tracking-[0.2em] text-navy/50">
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
                className="link-grow w-max text-[16px] text-navy/70 transition-colors duration-500 ease-[var(--ease-lux)] hover:text-navy"
              >
                {s}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[13px] uppercase tracking-[0.2em] text-navy/50">
              Bize Ulaşın
            </span>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="link-grow w-max text-[16px] text-navy/70 transition-colors duration-500 ease-[var(--ease-lux)] hover:text-navy"
            >
              LinkedIn
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="link-grow w-max text-[16px] text-navy/70 transition-colors duration-500 ease-[var(--ease-lux)] hover:text-navy"
            >
              Instagram
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="link-grow w-max text-[16px] text-navy/70 transition-colors duration-500 ease-[var(--ease-lux)] hover:text-navy"
            >
              {SITE.email}
            </a>
          </div>
        </div>

        <div className="border-t hairline">
          <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-5 py-7 text-[13px] text-navy/50 md:flex-row md:px-10">
            {/* Ekip notu: bu alana metin yazılmadan sadece tarih-saat akışı */}
            <LiveClock />
            <span>
              © {new Date().getFullYear()} tellers — Tüm hakları saklıdır.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
