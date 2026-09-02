import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { grafik, sayfaSemasi, kirintiSemasi, paylasim } from "@/lib/seo";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { gorselOlcu } from "@/lib/gorsel";
import KapanisSection from "@/components/KapanisSection";
import TriSlider from "@/components/TriSlider";
import MediaReveal from "@/components/MediaReveal";

const ACIKLAMA =
  "Mastercard, Konica Minolta ve Fairmont'un tercih ettiği ajans. 7 yılda 3 kıta, 15 ülkede marka iletişimi, markalama ve performans pazarlama.";

export const metadata: Metadata = {
  title: "Hakkımızda — Anlam Mimarisi ile Marka İletişimi",
  description: ACIKLAMA,
  alternates: { canonical: "/hakkimizda" },
  ...paylasim({
    baslik: "Hakkımızda | tellers",
    aciklama: ACIKLAMA,
    gorsel: "/assets/og/hakkimizda.jpg",
    yol: "/hakkimizda",
  }),
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
    label:
      "Birleşik Krallık, Avrupa ve Ortadoğu'da aktif küresel operasyon ağı.",
  },
];

const PRATIK = [
  {
    t: "Tek Cümle Testi",
    d: "Bu marka bugün kimin ne davranışını neden değiştirecek?",
  },
  {
    t: "Bağlam Testi",
    d: "Mesaj, gerçek kültürel/saha verisine yaslanıyor mu?",
  },
  {
    t: "Tutarlılık Testi",
    d: "Tasarım, dil ve deneyim aynı hikâyeyi mi anlatıyor?",
  },
  {
    t: "Kanıt Testi",
    d: "Başarı metriği, niyetle doğrusal mı?",
  },
  {
    t: "Gerekçe Testi",
    d: "Her görsel/kelime için “neden burada?” cevabı net mi?",
  },
];

export default function HakkimizdaPage() {
  return (
    <>
      <JsonLd
        data={grafik(
          sayfaSemasi({
            tip: "AboutPage",
            yol: "/hakkimizda",
            ad: "Hakkımızda",
            aciklama: ACIKLAMA,
          }),
          kirintiSemasi([
            { ad: "Ana Sayfa", yol: "/" },
            { ad: "Hakkımızda", yol: "/hakkimizda" },
          ]),
        )}
      />
      {/* ── Ana slide ──
          sabit + h-auto: videonun İÇİNDE "BAŞARI TESADÜF DEĞİLDİR" yazısı var
          ve kareyi dolduruyor; her kırpma yazıyı kesiyordu (Yakup bildirdi,
          2026-09-02: iki yandan kesik görünüyordu). İki kırpma kaynağı vardı:
          MediaReveal'ın %12 paralaks büyütmesi (yandan) ve
          max-h-[64dvh]+object-cover (üstten-alttan). İkisi de kaldırıldı;
          video 1600x800 doğal oranıyla tam görünüyor. */}
      <section className="relative mt-24 overflow-hidden">
        <MediaReveal sabit>
          <video
            src="/assets/about/hero.mp4"
            poster="/assets/about/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="tellers hakkında"
            className="h-auto w-full"
          />
        </MediaReveal>
      </section>

      {/* ── Global devlerin tercihi ── */}
      <section className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-40">
        <Reveal mask>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-navy md:text-[96px]">
            Global devlerin tercihi, tellers.
          </h1>
          <p className="mt-1.5 text-lg text-navy/70 md:text-[22px]">
            Mastercard, Konica Minolta, Bardahl ve Fairmont Hotels.
          </p>
        </Reveal>
      </section>

      {/* ── 3 konumlu metin yerleşimi (temanın orijinal düzeni) ──
          Gri fon (ekip notu 2026-08-14): hemen üstündeki "Global devlerin
          tercihi" başlık alanından ayrılsın; gri fon ayıracın kendisi olduğu
          için üstteki ince çizgi kaldırıldı. */}
      <div className="bg-mist">
        <section className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-40">
          <Reveal>
            <p className="max-w-5xl text-2xl font-bold leading-snug tracking-tight text-navy md:text-[48px]">
              7 yılda, 3 kıta, 15 ülkede Sağlık, Tarım, Savunma, Otomotiv, Spor
              ve Kozmetik sektörlerindeki ortaklarıyla onlarca iletişim
              stratejisi ve kampanyaya imza atan tellers, Birleşik Krallık,
              Avrupa ve Ortadoğu pazarlarındaki markalarıyla iletişim
              faaliyetlerini devam ettirmektedir.
            </p>
          </Reveal>
          <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-20">
            <Reveal delay={0.05}>
              <p className="text-lg leading-relaxed text-navy/75">
                tellers&apos;ın amacı, markaların yalnızca duyulmasını değil
                gerçekten anlaşılmasını sağlamaktır. Çünkü iletişim, bir ses
                değil; bir anlam ilişkisidir. Anlam ilişkisi kurabilen her
                kampanya ise sosyolojik bir iç görünün, psikolojik bir sezginin
                ve ölçülebilir verilerin kesişiminde şekillenir.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-navy/75">
                Bu yaklaşım, tellers&apos;ı klasik ajans anlayışının ötesine
                taşır. Yaratıcılığı ölçülebilir, stratejiyi ise duygusal hale
                getirir: veriyi sezgisel olarak okur, iletişimi sistematik
                olarak kurar ve tasarımı bilimsel doğrulukla uygular. Böylece
                ortaya çıkan her proje, sadece estetik bir ifade değil,
                ölçülebilir bir &ldquo;anlam&rdquo; sistemidir.
              </p>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ── Manifesto görseli (netlik) ──
          sabit: içinde YAZI var; paralaks büyütüp kaydırdığı için kenardaki
          metin kesiliyordu (Yakup bildirdi 2026-09-01). */}
      <MediaReveal sabit>
        <Image
          src="/assets/about/hakkimizda-metni.png"
          alt="Bilginin saniyelerle çoğaldığı çağda yüzyılın iletişim standartı netlik olacaktır — tellers bu soruya cevap üretmek için doğdu"
          width={1920}
          height={1080}
          className="h-auto w-full"
          sizes="100vw"
        />
      </MediaReveal>

      {/* ── Dinozor ajanslara veda + kreatif görsel ──
          Görsel ölçüleri gorselOlcu ile DOSYADAN okunuyor: kodda 1-creative
          için 960x960 (kare), 5-creative için 960x1100 yazıyordu; gerçekte
          1500x340 ve 1120x545. Yanlış oran, görsel yüklenmeden önce yanlış
          yer ayırtıp sayfayı zıplatıyordu (2026-09-01).

          DİKKAT: JSX etiketinin ATTRIBUTE ARASINA blok yorumu yazma —
          Turbopack derlemeyi asıyor. Ayrıca bu JSX yorumunun İÇİNE de blok
          yorum kapatma dizisi yazma, yorumu erken kapatır. Bugün her iki
          tuzağa da düşüldü. */}
      <section className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-28 md:grid-cols-2 md:gap-20 md:px-10 md:py-40">
        <Reveal mask>
          <h2 className="text-3xl font-bold leading-[1.12] tracking-tight text-navy md:text-[64px]">
            Eski kafalı dinozor ajanslara veda edin.
            <br />
            <em className="font-didot font-normal italic">
              Global devlerin tercihi
            </em>{" "}
            tellers ile tanışın.
          </h2>
          <p className="mt-4 text-base text-navy/50">
            tellers, gerçek bir ajans deneyimi.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Image
            src="/assets/about/1-creative.png"
            alt="tellers kreatif çalışması"
            width={gorselOlcu("/assets/about/1-creative.png").width}
            height={gorselOlcu("/assets/about/1-creative.png").height}
            className="h-auto w-full"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </Reveal>
      </section>

      {/* ── Vizyon ── */}
      <section className="mx-auto max-w-[1440px] px-5 pb-28 md:px-10 md:pb-40">
        <Reveal mask>
          <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-navy md:text-[96px]">
            Yakın gelecekte tellers.
          </h2>
          <p className="mt-1 text-base text-navy/50">Vizyonumuz.</p>
        </Reveal>
        <Reveal delay={0.05} className="mt-8 max-w-3xl">
          <p className="text-xl font-bold leading-relaxed text-navy">
            “Bilim, strateji ve kültür üzerine inşa edilmiş iletişimin, referans
            temsilcilerinden bir tanesi olmak.”
          </p>
          <p className="mt-6 text-lg leading-relaxed text-navy/80">
            Geleceğin en etkili sesine sahip markalar, şüphesiz en çok bağıran
            değil <em className="font-didot italic">en net konuşanlar</em>{" "}
            olacaktır. tellers, küresel ölçekte markaların iletişim berraklığını
            sağlayan, yaratıcılığı bilimsel doğrulukla birleştiren ve her temas
            noktasını ölçülebilir bir anlam sistemine dönüştüren öncü iletişim
            mimarı olmayı hedefler.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-navy/80">
            Vizyonumuz, iletişimin yalnızca duygu ya da estetik değil, aynı
            zamanda stratejik netlik üzerine kurulduğu bir ekosistem
            yaratmaktır. Bu ekosistemde her marka, kendi anlamını inşa eder; biz
            ise bu anlamın doğru zamanda, doğru kişiye, doğru biçimde ulaşmasını
            sağlarız.
          </p>
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

      {/* ── Misyon ──
          Gri fon (ekip notu 2026-08-14): hemen üstündeki Vizyon metin
          alanından ayrılsın — iki uzun metin bloğu üst üste gelmesin. */}
      <div className="bg-mist">
        <section className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-40">
          <Reveal mask>
            <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-navy md:text-[96px]">
              Bugün tellers.
            </h2>
            <p className="mt-1 text-base text-navy/50">
              Misyonumuz / Bugün ne yapıyoruz?
            </p>
          </Reveal>
          <Reveal delay={0.05} className="mt-8 max-w-3xl">
            <p className="text-xl font-bold leading-relaxed text-navy">
              “İletişimin gürültüye dönüştüğü 21. yüzyılda, markaların yalnızca
              görünür değil anlaşılır olmasını da sağlamak.”
            </p>
            <p className="mt-6 text-lg leading-relaxed text-navy/80">
              Amacımız basit ama radikaldir:{" "}
              <em className="font-didot italic">
                “İletişimi, yüzyılın ses yarışından çıkarıp, anlam ilişkisine
                dönüştürmek.”
              </em>{" "}
              Misyonumuz, tellers&apos;ı karmaşayı netliğe dönüştüren, iletişimi
              anlam mimarisine çeviren ve yaratıcılığı ölçülebilir etkiye
              dayandıran stratejik bir iletişim ortağı haline getirir.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-navy/80">
              Her kampanya, sosyolojik içgörü, psikolojik sezgi ve veri
              biliminin kesişiminde şekillenir; yazılı, görsel, deneyimsel her
              mesaj, hedef kitle davranışına dair veri toplayabileceğiniz ve
              hedef kitle davranışına etki edebileceğiniz anlam sistemlerine
              dönüşür.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-navy/80">
              Böylece markalar tesadüfe değil,{" "}
              <em className="font-didot italic">tekrarlanabilir etkiye</em>{" "}
              sahip olurlar.
            </p>
          </Reveal>
        </section>
      </div>

      {/* ── Referans işler 3'lü slider: Bardahl, MasterCard, Savron ──
          pt: üstteki gri Misyon bandının kenarına yapışmasın. */}
      <section className="pb-28 pt-28 md:pb-40 md:pt-40">
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
      <section className="mx-auto max-w-[1440px] border-t hairline px-5 py-28 md:px-10 md:py-40">
        <Reveal mask>
          <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-navy md:text-[96px]">
            tellers&apos;ın Pratik Testleri
          </h2>
          <p className="mt-4 text-lg text-navy/60 md:text-[22px]">
            Anlamı bulur, netliği kurar, planı yapar, deneyimi tasarlar,{" "}
            <em className="font-didot italic text-navy">sonucu kanıtlarız</em>.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-x-16 gap-y-10 md:grid-cols-2">
          {PRATIK.map((p, i) => (
            <Reveal key={p.t} delay={0.05 * i}>
              <div className="flex gap-5 border-t hairline pt-6">
                <span className="font-didot text-lg text-navy/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-didot text-xl italic text-navy md:text-[28px]">
                    {p.t}
                  </h3>
                  <p className="mt-2 text-lg leading-relaxed text-navy/70">
                    {p.d}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── İmaj 1 (gif alanı) — ekipten gelen gerçek video ── */}
      <MediaReveal>
        <video
          src="/assets/about/hakkimizda-imaj-1.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="tellers ekibinden bir kare"
          className="h-auto w-full"
        />
      </MediaReveal>

      {/* ── Recognition & Impact ── */}
      <section className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-40">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <Reveal mask>
              <h2 className="text-4xl font-bold leading-[1.08] tracking-tight text-navy md:text-[96px]">
                Veriyle şekillenen{" "}
                <em className="font-didot font-normal italic">küresel</em> etki.
              </h2>
              <p className="mt-4 text-lg text-navy/60">
                Veriyi yorumlar, sistematik düşünür; sonuç odaklı net çözümler
                üretiriz.
              </p>
              <p className="mt-6 max-w-md text-base leading-relaxed text-navy/60">
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
                    <h3 className="text-xl font-bold tracking-tight text-navy md:text-[28px]">
                      {s.value}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-navy/60">
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
                width={gorselOlcu("/assets/about/5-creative.png").width}
                height={gorselOlcu("/assets/about/5-creative.png").height}
                className="h-auto w-full"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </Reveal>
            {/* Son 3 istatistik sağdaki görselin altında */}
            <div className="mt-14 flex flex-col gap-10">
              {STATS.slice(3).map((s, i) => (
                <Reveal key={s.value} delay={0.05 * i}>
                  <div className="border-t hairline pt-6">
                    <h3 className="text-xl font-bold tracking-tight text-navy md:text-[28px]">
                      {s.value}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-navy/60">
                      {s.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── İmaj 2 — ekipten gelen gerçek video ── */}
      <MediaReveal>
        <video
          src="/assets/about/hakkimizda-imaj-2.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="tellers stüdyosundan bir kare"
          className="h-auto w-full"
        />
      </MediaReveal>

      {/* ── Kapanış + referans logolar ── */}
      <KapanisSection />
    </>
  );
}
