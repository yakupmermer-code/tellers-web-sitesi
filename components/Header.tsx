"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV, SITE } from "@/content/site";

const EASE = [0.32, 0.72, 0, 1] as const;

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
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          scrolled || open
            ? "bg-white/85 backdrop-blur-xl shadow-[0_1px_0_rgba(10,10,71,0.08)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-24 max-w-[1440px] items-center justify-between px-5 md:px-10">
          <Link href="/" aria-label="tellers ana sayfa" className="relative z-50">
            <Image
              src="/assets/logo/tellers-logo.png"
              alt="tellers"
              width={128}
              height={36}
              priority
              className={`h-[72px] w-auto md:h-[81px] transition-[filter] duration-500 ${
                onDarkHero ? "brightness-0 invert" : ""
              }`}
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Ana menü">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group/nav relative text-[13px] tracking-[0.08em] uppercase transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    onDarkHero
                      ? active
                        ? "text-white"
                        : "text-white/70 hover:text-white"
                      : active
                        ? "text-navy"
                        : "text-ink/60 hover:text-navy"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
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
              className={`absolute h-px w-6 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              onDarkHero ? "bg-white" : "bg-navy"
            } ${
                open ? "rotate-45" : "-translate-y-[4px]"
              }`}
            />
            <span
              className={`absolute h-px w-6 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              onDarkHero ? "bg-white" : "bg-navy"
            } ${
                open ? "-rotate-45" : "translate-y-[4px]"
              }`}
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
              className="flex h-full flex-col justify-center gap-2 px-8 pt-24"
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
                className="mt-10 flex gap-6 text-[12px] uppercase tracking-[0.2em] text-ink/50"
              >
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
                <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
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
