"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV, SITE } from "@/content/site";
import { EASE } from "./motion";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Rota değişince mobil menüyü kapat (render sırasında state ayarlama deseni)
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Escape ile menüyü kapat (erişilebilirlik)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Ana sayfa hero'su lacivert: en üstteyken menü/logo beyaz olmalı
  const onDarkHero = pathname === "/" && !scrolled && !open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-700 ease-[var(--ease-lux)] ${
          scrolled || open
            ? "bg-white/85 backdrop-blur-xl shadow-[0_1px_0_rgba(10,10,71,0.08)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-24 max-w-[1440px] items-center justify-between px-5 md:px-10">
          <Link
            href="/"
            aria-label="tellers ana sayfa"
            className="relative z-50"
          >
            {/*
              BOŞLUKSUZ LOGO (2026-09-01, Yakup: "header da düzeltilsin
              footer'daki gibi"). Eski dosya 850x850 KARE ve kelime işareti
              karenin yalnızca %26'sını kaplıyordu (ölçüldü: 775x225 @ 40,305);
              72px'lik kutuda ekranda görünen yazı ~19 PİKSEL kalıyordu.
              h-7/h-8 artık GERÇEKTEN 28/32px'lik kelime işareti demek.

              VEKTÖRE GEÇİŞ (2026-09-02): footer'daki dev kullanım için üretilen
              SVG burada da kullanılıyor. Ölçüldü: header PNG'yi retinada 5.239
              bayt olarak indiriyordu; SVG'yi footer zaten HER SAYFADA indiriyor,
              yani bu değişiklik bir isteği ve ~5 KB'yi tamamen siliyor.

              next/image DEĞİL <img>: Next'in görsel iyileştiricisi SVG'yi
              `dangerouslyAllowSVG` kapalıyken 400 ile reddediyor (canlıda
              denendi). Vektörü yeniden boyutlandırmanın zaten anlamı yok.
              `brightness-0 invert` filtresi SVG'de de aynı çalışıyor —
              lacivert hero'da logo yine beyaza dönüyor.
            */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo/tellers-logo.svg"
              alt="tellers"
              width={775}
              height={225}
              fetchPriority="high"
              decoding="async"
              className={`h-7 w-auto md:h-8 transition-[filter] duration-500 ${
                onDarkHero ? "brightness-0 invert" : ""
              }`}
            />
          </Link>

          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Ana menü"
          >
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group/nav relative text-[13px] tracking-[0.08em] uppercase transition-colors duration-500 ease-[var(--ease-lux)] ${
                    onDarkHero
                      ? active
                        ? "text-white"
                        : "text-white/70 hover:text-white"
                      : active
                        ? "text-navy"
                        : "text-navy/60 hover:text-navy"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px transition-all duration-500 ease-[var(--ease-lux)] ${
                      onDarkHero ? "bg-white" : "bg-navy"
                    } ${active ? "w-full" : "w-0 group-hover/nav:w-full"}`}
                  />
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            className="relative z-50 flex h-11 w-11 items-center justify-center lg:hidden"
          >
            <span
              className={`absolute h-px w-6 transition-transform duration-500 ease-[var(--ease-lux)] ${
                onDarkHero ? "bg-white" : "bg-navy"
              } ${open ? "rotate-45" : "-translate-y-[4px]"}`}
            />
            <span
              className={`absolute h-px w-6 transition-transform duration-500 ease-[var(--ease-lux)] ${
                onDarkHero ? "bg-white" : "bg-navy"
              } ${open ? "-rotate-45" : "translate-y-[4px]"}`}
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Site menüsü"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed inset-0 z-30 bg-white/95 backdrop-blur-md lg:hidden"
          >
            <nav
              aria-label="Mobil menü"
              className="flex h-full flex-col justify-center gap-2 overflow-y-auto px-8 py-28"
            >
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ y: 48, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.06 * i }}
                >
                  <Link
                    href={item.href}
                    className="font-didot block py-2 text-4xl text-navy"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ y: 48, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
                className="mt-10 flex gap-6 text-[12px] uppercase tracking-[0.2em] text-navy/50"
              >
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
                <a
                  href={SITE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
                <a href={`mailto:${SITE.email}`}>E-Posta</a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
