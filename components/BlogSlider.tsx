"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { BLOGS } from "@/content/blogs";

/**
 * Blog 4'lü yatay slider — ekip notu: "tek sıralamada 4 blog yan yana,
 * alan slider mantığında çalışsın, bloglar dönsün."
 */
export default function BlogSlider() {
  const track = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("a");
    const w = card ? card.getBoundingClientRect().width + 24 : 320;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-5 pb-4 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {BLOGS.map((b) => (
          <Link
            key={b.slug}
            href={`/blog/${b.slug}`}
            className="group w-[80vw] flex-none snap-start sm:w-[46vw] lg:w-[calc((100vw-160px)/4)] lg:max-w-[330px]"
          >
            <div className="overflow-hidden">
              <Image
                src={b.image}
                alt={b.title}
                width={640}
                height={480}
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 46vw, 80vw"
              />
            </div>
            <h3 className="mt-4 line-clamp-3 text-base font-bold leading-snug tracking-tight text-navy">
              {b.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/55">
              {b.excerpt}
            </p>
          </Link>
        ))}
      </div>
      <div className="mt-6 flex justify-end gap-3 px-5 md:px-10">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Önceki bloglar"
          className="flex h-11 w-11 items-center justify-center rounded-full border hairline text-navy transition-colors duration-500 hover:bg-navy hover:text-white"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Sonraki bloglar"
          className="flex h-11 w-11 items-center justify-center rounded-full border hairline text-navy transition-colors duration-500 hover:bg-navy hover:text-white"
        >
          →
        </button>
      </div>
    </div>
  );
}
