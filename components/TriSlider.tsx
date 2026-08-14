"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

type Item = { src: string; alt: string; href?: string };

/** 3'lü grid mantığında dönen yatay slider (Hakkımızda referans işleri). */
export default function TriSlider({ items }: { items: Item[] }) {
  const track = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const w = card ? card.getBoundingClientRect().width + 24 : 400;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  }

  return (
    <div>
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-5 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const img = (
            <Image
              src={item.src}
              alt={item.alt}
              width={900}
              height={680}
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
              sizes="(min-width: 768px) 33vw, 85vw"
            />
          );
          return item.href ? (
            <Link
              key={item.src}
              href={item.href}
              data-card
              className="group w-[85vw] flex-none snap-start overflow-hidden md:w-[calc((100%-48px)/3)]"
            >
              {img}
            </Link>
          ) : (
            <div
              key={item.src}
              data-card
              className="group w-[85vw] flex-none snap-start overflow-hidden md:w-[calc((100%-48px)/3)]"
            >
              {img}
            </div>
          );
        })}
      </div>
      {/* Mobilde tek kart görünür → oklar hep lazım; masaüstünde 3'ten fazlaysa */}
      {items.length > 1 && (
        <div
          className={`mt-6 flex justify-end gap-3 px-5 md:px-10 ${
            items.length <= 3 ? "md:hidden" : ""
          }`}
        >
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Önceki"
            className="flex h-11 w-11 items-center justify-center rounded-full border hairline text-navy transition-colors duration-500 hover:bg-navy hover:text-white"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Sonraki"
            className="flex h-11 w-11 items-center justify-center rounded-full border hairline text-navy transition-colors duration-500 hover:bg-navy hover:text-white"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
