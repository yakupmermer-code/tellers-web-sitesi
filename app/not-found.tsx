import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70dvh] flex-col items-center justify-center px-5 pt-24 text-center">
      <p className="font-didot text-lg italic text-navy/50">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy md:text-5xl">
        Aradığınız sayfa <em className="font-didot font-normal italic">anlamını</em>{" "}
        yitirmiş.
      </h1>
      <p className="mt-4 max-w-md text-base text-ink/60">
        Bu bağlantı taşınmış ya da hiç var olmamış olabilir.
      </p>
      <Link
        href="/"
        className="group mt-10 flex items-center gap-3 rounded-full bg-navy px-7 py-3.5 text-sm text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
      >
        Ana Sayfaya Dönün
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-px group-hover:translate-x-1">
          ↗
        </span>
      </Link>
    </section>
  );
}
