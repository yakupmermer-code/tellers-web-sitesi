"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { BLOGS } from "@/content/blogs";

/**
 * Blog 4'lü yatay slider — ok YOK (ekip notu 2026-08-14: "aşağıda ok olduğu
 * çok sonra anlaşılıyor, hiç ok kullanmayalım"). Bunun yerine imleç konteyner
 * içinde sola/sağa yaklaştıkça otomatik, hıza göre yumuşak kayma yapar.
 */
export default function BlogSlider() {
  const track = useRef<HTMLDivElement>(null);
  const velocity = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;

    const loop = () => {
      if (velocity.current !== 0) {
        el.scrollLeft += velocity.current;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = track.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Yalnızca kenarlara yakın %22'lik bölgede kayma tetiklenir — ortada durgun okuma alanı kalır
    const edge = rect.width * 0.22;
    const x = e.clientX - rect.left;
    let v = 0;
    if (x < edge) {
      v = -((edge - x) / edge) * 14;
    } else if (x > rect.width - edge) {
      v = ((x - (rect.width - edge)) / edge) * 14;
    }
    velocity.current = v;
  }

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={() => (velocity.current = 0)}
      className="relative"
    >
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
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-navy/55">
              {b.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
