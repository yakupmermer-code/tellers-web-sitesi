import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import KapanisSection from "@/components/KapanisSection";
import TriSlider from "@/components/TriSlider";
import MediaReveal from "@/components/MediaReveal";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "7 yılda, 3 kıta, 15 ülkede onlarca iletişim stratejisine imza atan tellers; anlam mimarisi yaklaşımıyla markaları anlaşılır kılar.",
};

const STATS = [
  {
    value: "7 Yıl Deneyim",
    label: "3 kıta ve 15 ülkede kesintisiz stratejik iletişim gücü.",
  },
  {
    value: "+32 Global Marka",
    label: "Sektör lideri ortaklarla yürütülen onlarca başarılı operasyon.",
  },
  {
    value: "+22.872.000$ Yönetilen Bütçe",
    label: "Veri ve ölçek odaklı, yüksek dönüşümlü medya ve strateji yönetimi.",
  },
  {
    value: "Aylık 2.000+ Lead Akışı",
    label:
      "Doğru hedef kitleye ulaşan, sürekli ve nitelikli potansiyel müşteri optimizasyonu.",
  },
  {
    value: "Meta Onaylı %50+ Reklam Performansı",
    label:
      "Yatırımınızın verimliliğini ve markanızın büyüme potansiyelini artırdığımızı onaylayan Meta destekli başarı göstergesi.",
  },
  {
    value: "3 Kıta & 15 Ülke",
    label: "Birleşik Krallık, Avrupa ve Ortadoğu'da aktif küresel operasyon ağı.",
  },
];

const PRATIK = [
  {
    t: "Oku",
    d: "Veriyi sezgisel olarak okur; markanın, pazarın ve hedef kitlenin altındaki anlamı çözeriz.",
  },
  {
    t: "Kur",
    d: "İletişimi sistematik olarak kurar; stratejiyi ölçülebilir bir yapıya dönüştürürüz.",
  },
  {
    t: "Uygula",
    d: "Tasarımı bilimsel doğrulukla uygular; her temas noktasında tutarlı bir deneyim üretiriz.",
  },
];

export default function HakkimizdaPage() {
  return (
    <>
      {/* ── Daraltılmış ana slide ── */}
      <section className="relative mt-24 overflow-hidden">
        <MediaReveal parallax>
          <Image
            src="/assets/about/hero.png"
            alt="tellers hakkında"
            width={1920}
            height={760}
            priority
            className="max-h-[64dvh] w-full object-cover"
            sizes="100vw"
          />
        </MediaReveal>
      </section>

      {/* ── Global devlerin tercihi ── */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
        <Reveal>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-navy md:text-6xl">
            Global devlerin tercihi, tellers.
          </h1>
          <p className="mt-4 text-lg text-navy/70 md:text-xl">
            Mastercard, Konica Minolta, Bardahl ve Fairmont Hotels.
          </p>
        </Reveal>
      </section>

      {/* ── 3 konumlu metin yerleşimi (temanın orijinal düzeni) ── */}
      <section className="mx-auto max-w-[1440px] border-t hairline px-5 py-24 md:px-10 md:py-36">
        <Reveal>
          <p className="max-w-5xl text-2xl font-bold leading-snug tracking-tight text-navy md:text-4xl">
            7 yılda, 3 kıta, 15 ülkede Sağlık, Tarım, Savunma, Otomotiv, Spor ve
            Kozmetik sektörlerindeki ortaklarıyla onlarca iletişim stratejisi ve
            kampanyaya imza atan tellers, Birleşik Krallık, Avrupa ve Ortadoğu
            pazarlarındaki markalarıyla iletişim faaliyetlerini devam
            ettirmektedir.
          </p>
        </Reveal>
        <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-20">
          <Reveal delay={0.05}>
            <p className="text-lg leading-relaxed text-ink/75">
              Tellers&apos;ın amacı, markaların yalnızca duyulmasını değil
              gerçekten anlaşılmasını sağlamaktır. Çünkü iletişim, bir ses
              değil; bir anlam ilişkisidir. Anlam ilişkisi kurabilen her kampanya
              ise sosyolojik bir iç görünün, psikolojik bir sezginin ve
              ölçülebilir verilerin kesişiminde şekillenir.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-ink/75">
              Bu yaklaşım, tellers&apos;ı klasik ajans anlayışının ötesine
              taşır. Yaratıcılığı ölçülebilir, stratejiyi ise duygusal hale
              getirir: veriyi sezgisel olarak okur, iletişimi sistematik olarak
              kurar ve tasarımı bilimsel doğrulukla uygular. Böylece ortaya
              çıkan her proje, sadece estetik bir ifade değil, ölçülebilir bir
              &ldquo;anlam&rdquo; sistemidir.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Manifesto görseli (netlik) ── */}
      <MediaReveal parallax>
        <Image
          src="/assets/about/hakkimizda-metni.png"
          alt="Bilginin saniyelerle çoğaldığı çağda yüzyılın iletişim standartı netlik olacaktır — tellers bu soruya cevap üretmek için doğdu"
          width={1920}
          height={1080}
          className="h-auto w-full"
          sizes="100vw"
        />
      </MediaReveal>

      {/* ── Dinozor ajanslara veda + kreatif görsel ── */}
      <section className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-24 md:grid-cols-2 md:gap-20 md:px-10 md:py-36">
        <Reveal>
          <h2 className="text-3xl font-bold leading-[1.12] tracking-tight text-navy md:text-5xl">
            Eski kafalı dinozor ajanslara veda edin.
            <br />
            <em className="font-didot font-normal italic">
              Global devlerin tercihi
            </em>{" "}
            tellers ile tanışın.
          </h2>
          <p className="mt-4 text-base text-ink/50">
            tellers, gerçek bir ajans deneyimi.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Image
            src="/assets/about/1-creative.png"
            alt="tellers kreatif çalışması"
            width={960}
            height={960}
            className="h-auto w-full"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </Reveal>
      </section>

      {/* ── Vizyon ── */}
      <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10 md:pb-36">
        <Reveal>
          <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-navy md:text-6xl">
            Yakın gelecekte tellers.
          </h2>
          <p className="mt-2 text-base text-ink/50">Vizyonumuz.</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-12">
          <MediaReveal>
            <Image
              src="/assets/about/vizyon.png"
              alt="tellers vizyonu"
              width={1920}
              height={900}
              className="h-auto w-full"
              sizes="100vw"
            />
          </MediaReveal>
        </Reveal>
      </section>

      {/* ── Misyon ── */}
      <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10 md:pb-36">
        <Reveal>
          <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-navy md:text-6xl">
            Bugün tellers.
          </h2>
          <p className="mt-2 text-base text-ink/50">
            Misyonumuz / Bugün ne yapıyoruz?
          </p>
        </Reveal>
      </section>

      {/* ── Referans işler 3'lü slider: Bardahl, MasterCard, Savron ── */}
      <section className="pb-24 md:pb-36">
        <TriSlider
          items={[
            {
              src: "/assets/about/slider-bardahl.png",
              alt: "Bardahl referans çalışması",
              href: "/portfolyo/bardahl",
            },
            {
              src: "/assets/about/slider-mastercard.png",
              alt: "MasterCard referans çalışması",
              href: "/portfolyo/mastercard",
            },
            {
              src: "/assets/about/slider-savron.png",
              alt: "Savron referans çalışması",
              href: "/portfolyo/savron-smart-media",
            },
          ]}
        />
      </section>

      {/* ── tellers'ın Pratik Testleri ── */}
      <section className="mx-auto max-w-[1440px] border-t hairline px-5 py-24 md:px-10 md:py-36">
        <Reveal>
          <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-navy md:text-6xl">
            tellers&apos;ın Pratik Testleri
          </h2>
          <p className="mt-4 text-lg text-ink/60 md:text-xl">
            Anlamı bulur, netliği kurar, planı yapar, deneyimi tasarlar,{" "}
            <em className="font-didot italic text-navy">sonucu kanıtlarız</em>.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {PRATIK.map((p, i) => (
            <Reveal key={p.t} delay={0.06 * i}>
              <span className="font-didot text-lg text-navy/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              {/* Ekip notu: puntolar büyütüldü */}
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-navy md:text-3xl">
                {p.t}
              </h3>
              <p className="mt-3 text-lg leading-relaxed text-ink/65">{p.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── İmaj 1 (gif alanı) — kaynak dosya statik PNG olduğundan
          sürekli yavaş zoom (Ken Burns) ile hareket verildi ── */}
      <MediaReveal kenburns>
        <Image
          src="/assets/about/hakkimizda-imaj-1.png"
          alt="tellers ekibinden bir kare"
          width={1920}
          height={900}
          className="h-auto w-full"
          sizes="100vw"
        />
      </MediaReveal>

      {/* ── Recognition & Impact ── */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <Reveal>
              <h2 className="text-4xl font-bold leading-[1.08] tracking-tight text-navy md:text-6xl">
                Veriyle şekillenen{" "}
                <em className="font-didot font-normal italic">küresel</em> etki.
              </h2>
              <p className="mt-4 text-lg text-ink/60">
                Veriyi yorumlar, sistematik düşünür; sonuç odaklı net çözümler
                üretiriz.
              </p>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ink/60">
                7 yıl, 3 kıta ve 12 ülkede;{" "}
                <em className="font-didot italic">
                  sağlık, savunma, otomotiv, tarım, spor
                </em>{" "}
                ve <em className="font-didot italic">kozmetik</em> sektörlerinde
                küresel iletişimi somut verilerle yönlendiriyoruz.
              </p>
            </Reveal>
            {/* İlk 3 istatistik solda */}
            <div className="mt-14 flex flex-col gap-10">
              {STATS.slice(0, 3).map((s, i) => (
                <Reveal key={s.value} delay={0.05 * i}>
                  <div className="border-t hairline pt-6">
                    <h3 className="text-xl font-bold tracking-tight text-navy md:text-2xl">
                      {s.value}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-ink/60">
                      {s.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <div>
            <Reveal delay={0.1}>
              <Image
                src="/assets/about/5-creative.png"
                alt="tellers küresel işlerinden bir kare"
                width={960}
                height={1100}
                className="h-auto w-full"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </Reveal>
            {/* Son 3 istatistik sağdaki görselin altında */}
            <div className="mt-14 flex flex-col gap-10">
              {STATS.slice(3).map((s, i) => (
                <Reveal key={s.value} delay={0.05 * i}>
                  <div className="border-t hairline pt-6">
                    <h3 className="text-xl font-bold tracking-tight text-navy md:text-2xl">
                      {s.value}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-ink/60">
                      {s.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── İmaj 2 ── */}
      <MediaReveal parallax>
        <Image
          src="/assets/about/hakkimizda-imaj-2.png"
          alt="tellers stüdyosundan bir kare"
          width={1920}
          height={900}
          className="h-auto w-full"
          sizes="100vw"
        />
      </MediaReveal>

      {/* ── Kapanış + referans logolar ── */}
      <KapanisSection />
    </>
  );
}
