import type { Metadata } from "next";
import Link from "next/link";

/**
 * 404 sayfası. Next zaten kendi <meta name="robots" content="noindex"> etiketini
 * basıyor; ama layout'tan miras gelen "index, follow" da basıldığı için sayfada
 * ÇELİŞEN iki robots etiketi oluşuyordu. En kısıtlayıcı kural geçerli olduğundan
 * davranış zaten doğruydu, yine de çelişki burada açıkça kapatılıyor.
 */
export const metadata: Metadata = {
  title: "Sayfa bulunamadı",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="flex min-h-[70dvh] flex-col items-center justify-center px-5 pt-28 text-center">
      <p className="font-didot text-lg italic text-navy/50">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy md:text-[64px]">
        Aradığınız sayfa{" "}
        <em className="font-didot font-normal italic">anlamını</em> yitirmiş.
      </h1>
      <p className="mt-4 max-w-md text-base text-navy/60">
        Bu bağlantı taşınmış ya da hiç var olmamış olabilir.
      </p>
      <Link
        href="/"
        className="link-grow inline-block w-max font-medium transition-opacity duration-500 hover:opacity-70 mt-10 text-[18px] text-navy md:text-[24px]"
      >
        Ana Sayfaya Dönün
      </Link>
    </section>
  );
}
