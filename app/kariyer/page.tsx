import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import KapanisSection from "@/components/KapanisSection";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Kariyer",
  description:
    "tellers ekibine katılın — anlam mimarisi kuran, veriyle düşünen bir ajansta kariyer.",
};

/* Ekip notu: Kariyer sayfası, İletişim sayfasının yapısını kullanır. */
export default function KariyerPage() {
  return (
    <>
      <section className="mx-auto max-w-[1440px] px-5 pb-24 pt-36 md:px-10 md:pt-48">
        <Reveal mask>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-navy md:text-6xl">
            Kariyer
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-navy/60 md:text-xl">
            Gürültünün içinde netlik üreten bir ekibin parçası olmak
            istiyorsanız — dinlemeye hazırız.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[900px] px-5 pb-24 md:px-10 md:pb-36">
        <Reveal>
          <ContactForm variant="kariyer" />
        </Reveal>
      </section>

      <KapanisSection />
    </>
  );
}
