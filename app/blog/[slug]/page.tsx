import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import KapanisSection from "@/components/KapanisSection";
import { BLOGS, getBlog } from "@/content/blogs";

export function generateStaticParams() {
  return BLOGS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const blog = getBlog((await params).slug);
  if (!blog) return {};
  return { title: blog.title, description: blog.excerpt };
}

/** İçerik gövdesini basit markdown kurallarıyla bloklara çevirir. */
function renderBody(body: string) {
  const blocks = body.split(/\n\n+/);
  return blocks.map((block, i) => {
    const t = block.trim();
    if (t.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="mt-12 text-2xl font-bold tracking-tight text-navy md:text-3xl"
        >
          {t.slice(3)}
        </h2>
      );
    }
    if (t.startsWith("- ")) {
      return (
        <ul key={i} className="flex list-disc flex-col gap-3 pl-5">
          {t.split("\n").map((li, j) => (
            <li key={j} className="leading-relaxed">
              {li.replace(/^- /, "")}
            </li>
          ))}
        </ul>
      );
    }
    if (/^\d+\. /.test(t)) {
      return (
        <ol key={i} className="flex list-decimal flex-col gap-3 pl-5">
          {t.split("\n").map((li, j) => (
            <li key={j} className="leading-relaxed">
              {li.replace(/^\d+\. /, "")}
            </li>
          ))}
        </ol>
      );
    }
    return (
      <p key={i} className="leading-relaxed">
        {t}
      </p>
    );
  });
}

export default async function BlogDetayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const blog = getBlog((await params).slug);
  if (!blog) notFound();

  // Mevcut yazıdan sonraki 3 yazı (dairesel) — her sayfada farklı öneri çıkar
  const idx = BLOGS.findIndex((b) => b.slug === blog.slug);
  const others = Array.from(
    { length: 3 },
    (_, i) => BLOGS[(idx + 1 + i) % BLOGS.length]
  );

  return (
    <>
      <article className="mx-auto max-w-[900px] px-5 pb-24 pt-36 md:px-10 md:pt-44">
        <Reveal>
          <h1 className="text-3xl font-bold leading-[1.12] tracking-tight text-navy md:text-5xl">
            {blog.title}
          </h1>
        </Reveal>
        <Reveal delay={0.08} className="mt-12">
          <Image
            src={blog.image}
            alt={blog.title}
            width={1600}
            height={1000}
            priority
            className="h-auto w-full"
            sizes="(min-width: 900px) 900px, 100vw"
          />
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-12 flex flex-col gap-6 text-lg text-ink/75">
            {renderBody(blog.body)}
          </div>
          <Link
            href={blog.cta.href}
            className="group mt-12 flex w-max items-center gap-3 rounded-full bg-navy px-7 py-3.5 text-sm text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
          >
            {blog.cta.label}
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-px group-hover:translate-x-1">
              ↗
            </span>
          </Link>
        </Reveal>
      </article>

      {/* Diğer yazılar */}
      <section className="mx-auto max-w-[1440px] border-t hairline px-5 py-24 md:px-10">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight text-navy md:text-4xl">
            Diğer Yazılar
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-3">
          {others.map((b, i) => (
            <Reveal key={b.slug} delay={0.05 * i}>
              <Link href={`/blog/${b.slug}`} className="group block">
                <div className="overflow-hidden">
                  <Image
                    src={b.image}
                    alt={b.title}
                    width={640}
                    height={480}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
                    sizes="(min-width: 640px) 33vw, 100vw"
                  />
                </div>
                <h3 className="mt-4 line-clamp-2 text-base font-bold leading-snug text-navy">
                  {b.title}
                </h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <KapanisSection />
    </>
  );
}
