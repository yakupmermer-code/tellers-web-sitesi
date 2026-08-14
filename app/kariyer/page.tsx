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
        <Reveal>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-navy md:text-6xl">
            Kariyer
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/60 md:text-xl">
            Gürültünün içinde netlik üreten bir ekibin parçası olmak
            istiyorsanız — dinlemeye hazırız.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-16 px-5 pb-24 md:grid-cols-[1fr_1.4fr] md:gap-24 md:px-10 md:pb-36">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight text-navy md:text-3xl">
            Neden tellers?
          </h2>
          <ul className="mt-8 flex flex-col gap-4 text-base leading-relaxed text-ink/65">
            <li>3 kıta ve 15 ülkede global markalarla çalışma deneyimi.</li>
            <li>Veriyle düşünen, gerekçesiz iş yapmayan bir kültür.</li>
            <li>Uzaktan çalışma modeli, esnek operasyon.</li>
            <li>Stratejiden uygulamaya öğrenmeye açık tek ekip.</li>
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <ContactForm variant="kariyer" />
        </Reveal>
      </section>

      <KapanisSection />
    </>
  );
}
