import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { grafik, sayfaSemasi, kirintiSemasi, paylasim } from "@/lib/seo";
import Image from "next/image";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import { Stagger, StaggerItem } from "@/components/Stagger";
import { gorselOlcu } from "@/lib/gorsel";
import KapanisSection from "@/components/KapanisSection";
import TriSlider from "@/components/TriSlider";
import YakinAcilis from "@/components/YakinAcilis";

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
    /* Sayaç YOK: CountUp yalnızca İLK sayıyı animasyonlar; "3" sayarken "15"
       hareketsiz kalıyor ve efekt yarım görünüyordu (code-reviewer, 2026-09-02). */
    sayac: false,
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
      {/* ── ANA SLIDE — MASTER TEMANIN "ABOUT US" KALIBI (2026-09-11) ────
          Yakup: "o kısım sayfanın içine tam otursun... arkadaşların referans
          aldıkları nokta master tema about us kısmı, bunu göz önünde bulundur."

          MASTER ÖLÇÜMÜ — `arpeggio.framer.website/about`, canlı:
            hero bloğu   genişlik tam · yükseklik **%70 ekran** (900px ekranda
                         630, 700px ekranda 490, 390x844 telefonda 591 — üç
                         ölçüde de tam 0,70 çıktı, yani sabit piksel değil)
            konum        sayfanın EN ÜSTÜ (y=0); 70px'lik bar SAYDAM ve
                         görselin ÜZERİNDE duruyor, üstünde beyaz şerit yok
            görsel       `object-fit: cover`, blokta `overflow: hidden`
            giriş        `scale(2)` + `opacity: 0` → 1 / 1

          ÖNCEKİ HÂLİN ÜÇ HATASI (üçünü de Yakup bildirdi, ölçülerek doğrulandı):
            · `mt-24` üstte 96 piksel beyaz şerit bırakıyordu (bar 70 piksel)
              → "header alanındaki beyaz kısım az yüksek"
            · video 1440x720'de bitip ekranın altında 84 piksel bırakıyordu ve
              alttaki bölüm oraya sızıyordu → "video tam oturmuyor"
            · `h-auto` yüksekliği MEDYADAN alıyordu: poster gelene kadar bölüm
              **150 piksel**, sonra birden 720 piksel. "Global devlerin tercihi"
              sloganı önce ekranın ortasında belirip 570 piksel aşağı itiliyordu
              → "ilk kez girince önce alttaki slogan gelir gibi oluyor, sonra
              video geliyor". Yükseklik artık medyadan bağımsız, kayma bitti.

          🔴 TELEFON/TABLETTE %70 DEĞİL, VİDEONUN KENDİ 2:1 ORANI. Master burada
          da %70 kullanıyor ama onun hero'su düz bir fotoğraf; bizim videomuzda
          kareyi neredeyse boydan boya dolduran DAİRESEL bir yazı halkası var
          ("tellers yaratıcı reklam ajansı · the creative agency"). Bu sayfada
          kırpma bir kez zaten sorun olmuştu (Yakup 2026-09-02: "hakkımızda
          kısmı ekrana tam oturmuyor", yazı iki yandan kesikti).
          ⚠️ Eski yorum bu videonun içinde "BAŞARI TESADÜF DEĞİLDİR" yazdığını
          söylüyordu; 15 saniyelik videodan 4 kare örneklendi (0,1 · 5,3 · 10,5
          · 14,3 sn) ve o yazı GÖRÜLMEDİ — o metin `hakkimizda-imaj-1`de.
          Masaüstündeki %13 dikey kırpma halkayı kesmiyor, gözle doğrulandı
          (`object-contain` ile yan yana karşılaştırıldı).
          Hesap: kutu oranı = genişlik / (0,70 x yükseklik). Yazının kesilmemesi
          için kutunun 2,0'dan geniş olması, yani EKRAN oranının 1,4'ten büyük
          olması gerekiyor. 1440x900 = 1,6 ✓ (yalnız %12,5 dikey kırpma, yazı
          ortada, güvenli) · 768x1024 tablet = 0,75 ✗ (%46 yatay kırpma) ·
          390x844 telefon = 0,46 ✗ (%67). Bu yüzden %70 yalnız `lg:` üstünde;
          altında video kendi oranıyla tam görünüyor ve yükseklik yine medyadan
          bağımsız olduğu için kayma da yok.
          🔴 KIRILIM GENİŞLİK DEĞİL **ORAN** (denetimde yakalandı, 2026-09-11):
          önce `lg:` (1024 piksel genişlik) yazılmıştı ama kuralın kendisi oran
          cinsinden. iPad Pro 12.9" DİKEY 1024x1366 (oran 0,75) genişlik eşiğini
          geçiyor, kutu 1024x956 oluyor ve %46 yatay kırpma yiyordu — yorumun
          "✗" diye işaretlediği durumun ta kendisi. Artık kuralı birebir ifade
          eden `.hero-oranli` sınıfı kullanılıyor (`app/globals.css`,
          `min-aspect-ratio: 7/5` = 1,4). Kod ile yorum bir daha ayrışmaz.
          ⚠️ Video değişirse (döküman yeni bir slider gif'i istiyor) buradaki
          `aspect-[2/1]` yeni dosyanın oranına göre güncellenmeli. */}
      <section
        data-koyu-bolum
        data-imlec-koyu
        /* Sayfanın EN ÜSTÜNDEKİ koyu hero — üst bar daha ilk boyamada saydam
           açılsın diye. Bkz. `app/globals.css` → "ÜST BAR AÇILIŞ RENGİ". */
        data-koyu-acilis
        className="hero-oranli relative aspect-[2/1] overflow-hidden bg-navy"
      >
        {/* Master'ın giriş hareketi: scale 2'den 1'e + soluk açılış.
            `hemen` → görünür alan beklenmiyor; ilk ekranda gecikme olmaz. */}
        <YakinAcilis hemen olcek={2} className="h-full w-full">
          <video
            src="/assets/about/hero.mp4"
            poster="/assets/about/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="tellers hakkında"
            className="h-full w-full object-cover"
          />
        </YakinAcilis>
      </section>

      {/* ── Global devlerin tercihi ── */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24">
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
        <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24">
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
          MASTER'IN GİRİŞ HAREKETİ — görsel scale 1.4'ten 1'e oturur + soluk
          açılır (master'ın About sayfasındaki beş iç görselinde bu değer
          ölçüldü). Kaydırmaya bağlı sürekli paralaksın yerini aldı: master'da
          görsel oturduktan sonra sarmalayıcıda hiç dönüşüm kalmıyor.
          İçinde YAZI olan görsellerde DURAN HÂLDE güvenli: hareket ölçek 1'de
          bitiyor, yani yerine oturduğunda hiçbir şey kırpılmıyor — eski `sabit`
          kısıtının sebebi olan KALICI büyütme ortadan kalktı.
          🟠 AMA GİRİŞ SIRASINDA KIRPIYOR (denetimde ölçüldü, 2026-09-11): bu
          sayfadaki yazılı medyaların metni kenara dayanıyor
          (`hakkimizda-imaj-1-yerlesik.mp4`te "TESADÜF" tam x=0'dan başlıyor).
          1.4 ölçekle her kenardan kesilen pay: 0 sn'de %14,3 · 0,08 sn'de %10,7
          · 0,21 sn'de %6,0 · 0,38 sn'de %2,4. Yani ilk ~0,3 saniye harflerin
          uçları görünmüyor, sonra oturuyor. Bu, İSTENEN efektin kendisi (master
          böyle yapıyor, Yakup "birebir aynı olsun" dedi) — hata değil, bilinçli
          taviz. Kabul edilmezse yazılı medyalarda `olcek={1.15}` kesmiyor. */}
      <YakinAcilis>
        <Image
          src="/assets/about/hakkimizda-metni.png"
          alt="Bilginin saniyelerle çoğaldığı çağda yüzyılın iletişim standartı netlik olacaktır — tellers bu soruya cevap üretmek için doğdu"
          width={1920}
          height={1080}
          className="h-auto w-full"
          sizes="100vw"
        />
      </YakinAcilis>

      {/* ── Dinozor ajanslara veda + kreatif görsel ──
          Görsel ölçüleri gorselOlcu ile DOSYADAN okunuyor: kodda 1-creative
          için 960x960 (kare), 5-creative için 960x1100 yazıyordu; gerçekte
          1500x340 ve 1120x545. Yanlış oran, görsel yüklenmeden önce yanlış
          yer ayırtıp sayfayı zıplatıyordu (2026-09-01).

          DİKKAT: JSX etiketinin ATTRIBUTE ARASINA blok yorumu yazma —
          Turbopack derlemeyi asıyor. Ayrıca bu JSX yorumunun İÇİNE de blok
          yorum kapatma dizisi yazma, yorumu erken kapatır. Bugün her iki
          tuzağa da düşüldü. */}
      <section className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-20 md:grid-cols-2 md:gap-20 md:px-10 md:py-24">
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
      <section className="mx-auto max-w-[1440px] px-5 pb-20 md:px-10 md:pb-24">
        <Reveal mask>
          <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-navy md:text-[96px]">
            Yakın gelecekte tellers.
          </h2>
          <p className="mt-1 text-base text-navy/50">Vizyonumuz.</p>
        </Reveal>
        <Stagger className="mt-8 max-w-3xl">
          <StaggerItem>
            <p className="text-xl font-bold leading-relaxed text-navy">
              “Bilim, strateji ve kültür üzerine inşa edilmiş iletişimin,
              referans temsilcilerinden bir tanesi olmak.”
            </p>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-6 text-lg leading-relaxed text-navy/80">
              Geleceğin en etkili sesine sahip markalar, şüphesiz en çok bağıran
              değil <em className="font-didot italic">en net konuşanlar</em>{" "}
              olacaktır. tellers, küresel ölçekte markaların iletişim
              berraklığını sağlayan, yaratıcılığı bilimsel doğrulukla
              birleştiren ve her temas noktasını ölçülebilir bir anlam sistemine
              dönüştüren öncü iletişim mimarı olmayı hedefler.
            </p>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-6 text-lg leading-relaxed text-navy/80">
              Vizyonumuz, iletişimin yalnızca duygu ya da estetik değil, aynı
              zamanda stratejik netlik üzerine kurulduğu bir ekosistem
              yaratmaktır. Bu ekosistemde her marka, kendi anlamını inşa eder;
              biz ise bu anlamın doğru zamanda, doğru kişiye, doğru biçimde
              ulaşmasını sağlarız.
            </p>
          </StaggerItem>
        </Stagger>
        {/* Eskiden burada `Reveal` (opaklık + kayma) vardı; `YakinAcilis` zaten
            soluk açıyor, üstüne `template.tsx` sayfa geçişi de bindiğinde üç
            opaklık çarpılıyordu (denetimde yakalandı). Kutu kalsın diye düz div. */}
        <div className="mt-12">
          <YakinAcilis>
            <Image
              src="/assets/about/vizyon.png"
              alt="tellers vizyonu"
              width={1920}
              height={900}
              className="h-auto w-full"
              sizes="100vw"
            />
          </YakinAcilis>
        </div>
      </section>

      {/* ── Misyon ──
          Gri fon (ekip notu 2026-08-14): hemen üstündeki Vizyon metin
          alanından ayrılsın — iki uzun metin bloğu üst üste gelmesin. */}
      <div className="bg-mist">
        <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24">
          <Reveal mask>
            <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-navy md:text-[96px]">
              Bugün tellers.
            </h2>
            <p className="mt-1 text-base text-navy/50">
              Misyonumuz / Bugün ne yapıyoruz?
            </p>
          </Reveal>
          <Stagger className="mt-8 max-w-3xl">
            <StaggerItem>
              <p className="text-xl font-bold leading-relaxed text-navy">
                “İletişimin gürültüye dönüştüğü 21. yüzyılda, markaların
                yalnızca görünür değil anlaşılır olmasını da sağlamak.”
              </p>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-6 text-lg leading-relaxed text-navy/80">
                Amacımız basit ama radikaldir:{" "}
                <em className="font-didot italic">
                  “İletişimi, yüzyılın ses yarışından çıkarıp, anlam ilişkisine
                  dönüştürmek.”
                </em>{" "}
                Misyonumuz, tellers&apos;ı karmaşayı netliğe dönüştüren,
                iletişimi anlam mimarisine çeviren ve yaratıcılığı ölçülebilir
                etkiye dayandıran stratejik bir iletişim ortağı haline getirir.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-6 text-lg leading-relaxed text-navy/80">
                Her kampanya, sosyolojik içgörü, psikolojik sezgi ve veri
                biliminin kesişiminde şekillenir; yazılı, görsel, deneyimsel her
                mesaj, hedef kitle davranışına dair veri toplayabileceğiniz ve
                hedef kitle davranışına etki edebileceğiniz anlam sistemlerine
                dönüşür.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-6 text-lg leading-relaxed text-navy/80">
                Böylece markalar tesadüfe değil,{" "}
                <em className="font-didot italic">tekrarlanabilir etkiye</em>{" "}
                sahip olurlar.
              </p>
            </StaggerItem>
          </Stagger>
        </section>
      </div>

      {/* ── Referans işler 3'lü slider: Bardahl, MasterCard, Savron ──
          pt: üstteki gri Misyon bandının kenarına yapışmasın. */}
      <section className="pb-20 pt-20 md:pb-24 md:pt-24">
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
      <section className="mx-auto max-w-[1440px] border-t hairline px-5 py-20 md:px-10 md:py-24">
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

      {/* ── İmaj 1 (gif alanı) — ekipten gelen gerçek video ──
          -yerlesik: özgün videonun ilk 1.3 saniyesinde yazı ("BAŞARI TESADÜF
          DEĞİLDİR") sağdan ve soldan kayarak giriyor. Bu blok sayfanın
          ORTASINDA ve sürekli döngüde olduğu için yazı her turda yeniden
          kayıyor, bozuk gibi duruyordu (Yakup bildirdi, 2026-09-02).
          Video yazının yerleştiği andan başlatıldı; özgün dosya SİLİNMEDİ.
          NOT: aynı giriş animasyonu 5 hero videosunda da var ama onlar sayfa
          başında olduğu için kasıtlı durabilir — ekip kararına bırakıldı. */}
      <YakinAcilis>
        <video
          src="/assets/about/hakkimizda-imaj-1-yerlesik.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="tellers ekibinden bir kare"
          className="h-auto w-full"
        />
      </YakinAcilis>

      {/* ── Recognition & Impact ── */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24">
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
                7 yıl, 3 kıta ve 15 ülkede;{" "}
                <em className="font-didot italic">
                  sağlık, savunma, otomotiv, tarım, spor
                </em>{" "}
                ve <em className="font-didot italic">kozmetik</em> sektörlerinde
                küresel iletişimi somut verilerle yönlendiriyoruz.
              </p>
            </Reveal>
            {/* İlk 3 istatistik solda.
                SAYAÇ (2026-09-02): bu altı rakam ("7 Yıl", "+32 Global Marka",
                "+22.872.000$", "2.000+ Lead") sabit metindi. CountUp bileşeni
                sitede vardı ama yalnızca ana sayfada ve portfolyo detayında
                kullanılıyordu — sayfanın en güçlü kanıt bloğu hareketsiz
                duruyordu. Hareket azaltma tercihinde sayaç devre dışı kalır. */}
            <div className="mt-14 flex flex-col gap-10">
              {STATS.slice(0, 3).map((s, i) => (
                <Reveal key={s.value} delay={0.05 * i}>
                  <div className="border-t hairline pt-6">
                    <h3 className="text-xl font-bold tracking-tight text-navy md:text-[28px]">
                      {s.sayac === false ? (
                        s.value
                      ) : (
                        <CountUp value={s.value} />
                      )}
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
                      {s.sayac === false ? (
                        s.value
                      ) : (
                        <CountUp value={s.value} />
                      )}
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
      <YakinAcilis>
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
      </YakinAcilis>

      {/* ── Kapanış + referans logolar ── */}
      <KapanisSection />
    </>
  );
}
