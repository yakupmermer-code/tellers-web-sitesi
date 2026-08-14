export type Brand = {
  slug: string;
  name: string;
  /** Portfolyo grid'indeki banner görseli */
  banner: string;
  /** Detay sayfası hero medyası (video ise poster: yüklenene kadar gösterilen kare) */
  hero: { type: "image" | "video"; src: string; poster?: string };
  /** Hero sağ altta sıralanan hizmetler */
  services: string[];
  /** Büyük puntolu başlık (+ opsiyonel alt açıklama) */
  headline: string;
  subheadline?: string;
  /** Başlığın sağındaki tanıtım metni */
  intro: string;
  meta: {
    musteri: string;
    tarih: string;
    sure: string;
    proje: string[];
  };
  /** Detay sayfası galeri blokları */
  gallery?: Array<
    | { kind: "image"; src: string; wide?: boolean }
    | { kind: "video"; src: string; poster?: string; wide?: boolean; vertical?: boolean }
    | {
        kind: "tri";
        left: { type: "image" | "video"; src: string };
        rightTop: string;
        rightBottom: string;
        /** true → uzun alan sağda (My Nova ikinci grid) */
        flip?: boolean;
      }
  >;
  /** Performance Results benzeri sayılar (yalnız My Nova) */
  results?: Array<{ value: string; label: string }>;
};

export const BRANDS: Brand[] = [
  {
    slug: "mastercard",
    name: "MasterCard",
    banner: "/assets/brands/mastercard/banner.png",
    hero: { type: "image", src: "/assets/brands/mastercard/slider.png" },
    services: ["Above The Line (ATL)", "Kreatif Tasarım"],
    headline: "Above The Line (ATL) & Kreatif Tasarım",
    intro:
      "Küresel ödeme teknolojileri devi Mastercard'ın yerel pazara yönelik iletişim stratejileri doğrultusunda Above The Line (ATL) kampanyalarını kurguladık.\n\nKüresel marka standartlarını yerel pazarın kültürel kodları ve tüketici alışkanlıklarıyla harmanlayarak, markanın pazardaki duygusal bağını ve kitlesel erişimini güçlendiren projeler gerçekleştirdik.",
    meta: {
      musteri: "MasterCard",
      tarih: "03.05.2016",
      sure: "2 ay",
      proje: ["Çizgi Üstü Reklam Çalışmaları (ATL)"],
    },
    gallery: [
      { kind: "image", src: "/assets/brands/mastercard/banner.png", wide: true },
      { kind: "image", src: "/assets/brands/mastercard/detay-2.png", wide: true },
    ],
  },
  {
    slug: "bardahl",
    name: "Bardahl",
    banner: "/assets/brands/bardahl/banner.png",
    hero: { type: "image", src: "/assets/brands/bardahl/slide.png" },
    services: ["Dijital Pazarlama", "Kreatif Tasarım Hizmetleri", "Web Site Tasarımı"],
    headline: "Bardahl Türkiye Marka Konumlandırması",
    intro:
      "Motor yağı sektörünün küresel liderlerinden Bardahl'ın Türkiye pazarına giriş, marka konumlandırması ve ürün satış adımlarını çizgi altı ve çizgi üstü, tüm mecralarda yönettik.",
    meta: {
      musteri: "Bardahl",
      tarih: "02.12.2020 - 07.05.2022",
      sure: "17 ay",
      proje: ["Performans Pazarlama", "Dijital Pazarlama", "Kreatif Tasarım"],
    },
    gallery: [
      {
        kind: "video",
        src: "/assets/brands/bardahl/kurumsal-video.mp4",
        poster: "/assets/brands/bardahl/poster.jpg",
        wide: true,
      },
      { kind: "image", src: "/assets/brands/bardahl/dakar.png", wide: true },
      {
        kind: "tri",
        left: { type: "image", src: "/assets/brands/bardahl/imaj.png" },
        rightTop: "/assets/brands/bardahl/cizik-giderici.png",
        rightBottom: "/assets/brands/bardahl/rally.jpg",
      },
    ],
  },
  {
    slug: "my-nova",
    name: "My Nova Dental Clinic",
    banner: "/assets/brands/mynova/banner.png",
    hero: {
      type: "video",
      src: "/assets/brands/mynova/hero-video.mp4",
      poster: "/assets/brands/mynova/poster.jpg",
    },
    services: [
      "Performans Pazarlama",
      "Dijital Pazarlama",
      "Markalama",
      "Kreatif Tasarım Hizmetleri",
      "Web Site Tasarımı",
    ],
    headline: "Sağlık Turizmi",
    subheadline: "Aylık 1.500 adet lead akışı.",
    intro:
      "Ağız ve Diş Sağlığı Polikliniği olan ve sağlık turizmi sektöründe aksiyon alan markamız için hedef ülke bazlı pazarlama kurguları ve yüksek dönüşümlü web yazılım çözümleri ürettik. Yurt dışındaki potansiyel hastaları hedefleyen çok dilli dijital reklam, performans pazarlama ve sosyal medya operasyonlarımızla, kliniğe doğrudan form ve randevu talebi oluşturan ölçülebilir performans odaklı bir satış hunisi kurduk.",
    meta: {
      musteri: "My Nova Dental Clinic",
      tarih: "01.09.2023 - 03.01.2026",
      sure: "28 ay",
      proje: [
        "Performans Pazarlama",
        "Dijital Pazarlama",
        "Markalama",
        "Kreatif Tasarım Hizmetleri",
        "Web Site Tasarımı",
      ],
    },
    gallery: [
      { kind: "image", src: "/assets/brands/mynova/banner.png", wide: true },
      {
        kind: "tri",
        left: { type: "video", src: "/assets/brands/mynova/akim-ai-video.mp4" },
        rightTop: "/assets/brands/mynova/nova-ana-slide.png",
        rightBottom: "/assets/brands/mynova/gorsel-3.png",
      },
      {
        kind: "tri",
        left: { type: "image", src: "/assets/brands/mynova/darwin-chair.jpg" },
        rightTop: "/assets/brands/mynova/shakespeare.jpg",
        rightBottom: "/assets/brands/mynova/sherlock.jpg",
        flip: true,
      },
    ],
    results: [
      { value: "+ %50", label: "Meta tarafından doğrulanmış %50'nin üzerinde reklam performansı." },
      { value: "+1500", label: "Aylık +1500 adet lead" },
      { value: "13 Ülke", label: "13 ülkede reklam yönetimi." },
    ],
  },
  {
    slug: "savron-smart-media",
    name: "Savron Smart Medya",
    banner: "/assets/brands/savron/banner.png",
    hero: {
      type: "video",
      src: "/assets/brands/savron/kurumsal-video.mp4",
      poster: "/assets/brands/savron/poster.jpg",
    },
    services: [
      "Dijital Pazarlama",
      "3D İçerik Üretimi",
      "Kreatif Tasarım Hizmetleri",
      "Markalama",
    ],
    headline: "Türkiye'nin İlk 3D Küp Deneyimi",
    intro:
      "3D içerik üretimi, dijital lansman, konumlandırma, yaratıcı konsept ve sosyal medya yönetimi alanlarında birlikte çalıştığımız Savron Smart Media ile Türkiye'nin ilk çıplak gözle 3D küp deneyimini hayata geçirdik. Küplerde reklam veren Ata Sağlık, Atagöz, Otopratik, Saat&Saat, Domestos, Migros ve Nestlé gibi markalar için de 3D reklam içerikleri ürettik.",
    meta: {
      musteri: "Savron Smart Medya",
      tarih: "13.11.2022 - 17.12.2023",
      sure: "13 ay",
      proje: [
        "Dijital Pazarlama",
        "Kreatif Tasarım Hizmetleri",
        "3D İçerik Üretimi",
        "Markalama",
      ],
    },
  },
  {
    slug: "tyre-supply",
    name: "Tyre Supply",
    banner: "/assets/brands/tyresupply/banner.png",
    hero: { type: "image", src: "/assets/brands/tyresupply/banner.png" },
    services: ["Dijital Pazarlama", "Performans Pazarlama", "Kreatif Tasarım Hizmetleri"],
    headline: "Otomotiv Sektöründe Dijital Pazarlama",
    intro:
      "Tyre Supply'ın dijital pazarlama operasyonunu stratejik bir yaklaşımla yöneterek, hedef kitlesiyle etkin şekilde buluşmasını ve nitelikli müşteri taleplerinin artırılmasını hedefledik. Reklam stratejileri doğrultusunda kampanya kurguları ve kreatif içerikler geliştirerek dijital reklam çalışmalarını yönettik. Bunun yanı sıra mailing, e-posta imzası, kartvizit ve sipariş formları gibi kurumsal iletişim materyallerini hazırlayarak markanın dijital iletişim süreçlerini destekledik.",
    meta: {
      musteri: "Tyre Supply",
      tarih: "14.06.2024 - 02.05.2025",
      sure: "11 ay",
      proje: ["Dijital Pazarlama", "Kreatif Tasarım Hizmetleri"],
    },
  },
  {
    slug: "savronik",
    name: "Savronik",
    banner: "/assets/brands/savronik/banner.png",
    hero: { type: "image", src: "/assets/brands/savronik/banner.png" },
    services: ["Yaratıcı Marka Tanıtım Filmi", "Prodüksiyon", "Marka Konumlandırma"],
    headline: "Yaratıcı Marka Tanıtım Filmi",
    intro:
      "Savronik'in teknoloji ve mühendislikteki öncü gücünü, markanın vizyonunu yansıtan bütünleşik yaratıcı bir marka tanıtım filmiyle hayata geçirdik.",
    meta: {
      musteri: "Savronik",
      tarih: "03.02.2023 - 08.10.2023",
      sure: "8 ay",
      proje: ["Yaratıcı Marka Tanıtım Filmi", "Prodüksiyon", "Marka Konumlandırma"],
    },
  },
  {
    slug: "atlantis",
    name: "Atlantis Center Pivot",
    banner: "/assets/brands/atlantis/banner.png",
    hero: { type: "image", src: "/assets/brands/atlantis/banner.png" },
    services: [
      "Dijital Pazarlama",
      "Performans Pazarlama",
      "Kreatif Tasarım Hizmetleri",
      "Web Site Tasarımı",
    ],
    headline: "Akıllı Sulama Sistemlerinde Dijital Pazarlama",
    intro:
      "Akıllı sulama sistemleri üreticisi Atlantis'in uluslararası pazardaki algısını güçlendirmek adına sosyal medya stratejisini ve reklam kreatiflerini baştan sona yeniledik. Markanın web sitesi altyapısını ve görsel iletişim dilini küresel hedef kitlenin beklentilerine göre optimize ettik. Veri odaklı performans pazarlama ve yenilenen sosyal medya kurgularımız sayesinde, markanın global ölçekteki potansiyel alıcılardan nitelikli lead toplamasını sağladık ve uluslararası satış kanallarını doğrudan besledik.",
    meta: {
      musteri: "Atlantis Center Pivot & Lineer Sulama Sistemleri",
      tarih: "01.02.2024 - 01.11.2024",
      sure: "9 ay",
      proje: [
        "Dijital Pazarlama",
        "Performans Pazarlama",
        "Kreatif Tasarım Hizmetleri",
        "Web Site Tasarımı",
      ],
    },
  },
  {
    slug: "raymond-weil",
    name: "Raymond Weil",
    banner: "/assets/brands/raymondweil/banner.png",
    hero: { type: "image", src: "/assets/brands/raymondweil/banner.png" },
    services: ["Post-Prodüksiyon", "Motion Design"],
    headline: "Statik Görselden Dinamik İçeriğe",
    intro:
      "Lüks saat sektörünün köklü markalarından Raymond Weil'in dijital mecralardaki görsel algısını güçlendirmek amacıyla gelişmiş dijital post-prodüksiyon tekniklerimizi devreye soktuk. Markanın kaliteli ürün fotoğraflarını ve statik görsellerini akıcı, dinamik video içeriklerine dönüştürerek hedef kitle nezdinde yüksek dikkat çekicilik ve estetik bir dijital deneyim sunduk.",
    meta: {
      musteri: "Raymond Weil",
      tarih: "2017",
      sure: "—", // Ekipten bekleniyor (dökümanda XXXX)
      proje: ["Post-Prodüksiyon", "Motion Design"],
    },
  },
  {
    slug: "bfit",
    name: "bfit",
    banner: "/assets/brands/bfit/banner.jpg",
    hero: { type: "image", src: "/assets/brands/bfit/banner.jpg" },
    services: ["Markalama", "Dijital Pazarlama", "Performans Pazarlama", "Kreatif Ajans Hizmetleri"],
    headline: "Spor Sektöründe Yeniden Markalama",
    intro:
      "Türkiye'nin en büyük spor franchise markası olan bfit'in 21. yılında; marka konumlandırmasını, imajını ve logosunu yeniledik. Yenilenen marka imajımız ve dijital pazarlama operasyonlarımızla, her gün daha fazla kadının hayatına dokunmaya devam ediyoruz.",
    meta: {
      musteri: "bfit",
      tarih: "01.12.2024 - Devam Ediyor",
      sure: "Devam Ediyor",
      proje: ["Markalama", "Dijital Pazarlama", "Performans Pazarlama", "Kreatif Ajans Hizmetleri"],
    },
  },
  {
    slug: "sua-horeca",
    name: "Sua Horeca",
    banner: "/assets/brands/sua/banner.png",
    hero: { type: "image", src: "/assets/brands/sua/banner.png" },
    services: ["Markalama", "Dijital Pazarlama", "Performans Pazarlama", "Kreatif Ajans Hizmetleri"],
    headline: "Doğal Kozmetik Sektöründe Markalama",
    intro:
      "Doğal kozmetik markası SUA'nın pazardaki konumlandırmasını, marka kişiliğini, görsel imajını ve logo tasarımını yeniden kurgulayarak markayı rekabetçi bir segmentte hayata geçirdik.\n\nHedef kitle analizleri doğrultusunda geliştirdiğimiz iletişim stratejisi, kreatif tasarım dili ve bütünleşik dijital pazarlama operasyonlarımız sayesinde Sua'yı kısa sürede dinamik ve satış odaklı bir markaya dönüştürdük.",
    meta: {
      musteri: "SUA HORECA",
      tarih: "01.06.2025 - 21.02.2026",
      sure: "9 ay",
      proje: ["Markalama", "Dijital Pazarlama", "Performans Pazarlama", "Kreatif Ajans Hizmetleri"],
    },
  },
  {
    slug: "premium-gym",
    name: "Premium Gym",
    banner: "/assets/brands/premiumgym/banner.jpg",
    hero: { type: "image", src: "/assets/brands/premiumgym/banner.jpg" },
    services: [
      "Dijital Pazarlama",
      "Performans Pazarlama",
      "Gerilla Pazarlama",
      "Kreatif Ajans Hizmetleri",
      "Etkinlik & Organizasyon",
    ],
    headline: "Spor Sektöründe Performans Pazarlama",
    intro:
      "Premium Gym'in kurumsal kimliğini sıfırdan inşa ederek pazardaki konumunu güçlendirdik. Veri odaklı dijital reklam stratejileri, yaratıcı sosyal medya yönetimi ve gerilla pazarlama aksiyonlarıyla bütünleşik bir marka deneyimi sunarken, sürdürülebilir aylık ve yıllık üye kazanımı sağladık.",
    meta: {
      musteri: "PREMIUM GYM",
      tarih: "02.02.2023 - 23.08.2024",
      sure: "18 ay",
      proje: [
        "Dijital Pazarlama",
        "Performans Pazarlama",
        "Gerilla Pazarlama",
        "Kreatif Ajans Hizmetleri",
        "Etkinlik & Organizasyon",
      ],
    },
  },
  {
    slug: "dedebio",
    name: "Dedebio",
    banner: "/assets/brands/dedebio/banner.png",
    hero: { type: "image", src: "/assets/brands/dedebio/banner.png" },
    services: ["Markalama", "Dijital Pazarlama", "Kreatif Tasarım Hizmetleri"],
    headline: "Organik Gıda Sektöründe Markalama",
    intro:
      "DEDEBIO markasının pazardaki konumunu güçlendirmek ve hedef kitlesiyle güncel bir iletişim dili kurmak amacıyla marka yenileme sürecini gerçekleştirdik. Yenilenen marka kimliğini ve konumlandırmasını, stratejik sosyal medya operasyonlarımızla destekleyerek markanın dijitaldeki bilinirliğini, güvenilirliğini ve etkileşim oranlarını artırdık.",
    meta: {
      musteri: "DEDEBIO",
      tarih: "2023",
      sure: "—", // Ekipten bekleniyor (dökümanda XXXX)
      proje: ["Markalama", "Dijital Pazarlama", "Kreatif Tasarım Hizmetleri"],
    },
  },
  {
    slug: "bni",
    name: "BNI",
    banner: "/assets/brands/bni/banner.png",
    hero: { type: "image", src: "/assets/brands/bni/banner.png" },
    services: ["Dijital Pazarlama", "Performans Pazarlama", "Kreatif Tasarım Hizmetleri"],
    headline: "Networking Sektörü",
    intro:
      "Dünyanın en büyük iş yönlendirme organizasyonu olan markamız BNI için geliştirdiğimiz iletişim stratejisi ve kreatif konsept ile markanın dijital konumlandırmasını yeniledik. Performans odaklı sosyal medya operasyonumuz ile birlikte nitelikli üye kazanımı ve güçlü bir ağ etkileşimi elde ettik.",
    meta: {
      musteri: "BNI",
      tarih: "2020 - 2022",
      sure: "2 yıl",
      proje: ["Dijital Pazarlama", "Performans Pazarlama", "Kreatif Tasarım Hizmetleri"],
    },
  },
  {
    slug: "minousha",
    name: "Minousha",
    banner: "/assets/brands/minousha/banner.jpg",
    hero: { type: "image", src: "/assets/brands/minousha/banner.jpg" },
    services: ["Post-Prodüksiyon", "Prodüksiyon", "Cast", "Kreatif Tasarım Hizmetleri"],
    headline: "Moda Sektöründe Post Prodüksiyon",
    intro:
      "Minousha'nın dijital iletişiminde kullanılmak üzere kreatif tasarım, cast seçimi, prodüksiyon ve post-prodüksiyon süreçlerini yönettik. Gerçekleştirdiğimiz çekimleri kurgu ve post-prodüksiyon çalışmalarıyla tamamlayarak, markanın görsel dünyasını yansıtan özgün ve etkileyici video içerikleri ürettik.",
    meta: {
      musteri: "Minousha",
      tarih: "2018", // Ekip teyidi bekleniyor (dökümanda soru işaretli)
      sure: "—",
      proje: ["Post-Prodüksiyon", "Prodüksiyon", "Cast", "Kreatif Tasarım Hizmetleri"],
    },
  },
  {
    slug: "anatolian-stars",
    name: "Anatolian Stars",
    banner: "/assets/brands/anatolianstars/banner.jpg",
    hero: { type: "image", src: "/assets/brands/anatolianstars/banner.jpg" },
    services: ["Markalama", "Dijital Pazarlama", "Kreatif Tasarım Hizmetleri", "Web Site Tasarımı"],
    headline: "Uluslararası Gıda Taşımacılığı Markalama",
    intro:
      "Anatolian Stars için gerçekleştirdiğimiz markalama operasyonumuz ile markamız dünyaya açıldı ve Türkiye'nin eşsiz topraklarında yetişen meyve ve sebzeleri ihraç etmeye başladı.",
    meta: {
      musteri: "Anatolian Stars",
      tarih: "12.09.2020 - 02.04.2021",
      sure: "7 ay",
      proje: ["Markalama", "Dijital Pazarlama", "Kreatif Tasarım Hizmetleri", "Web Site Tasarımı"],
    },
  },
  {
    slug: "utkan-yildirim",
    name: "Utkan Yıldırım Design",
    banner: "/assets/brands/utkanyildirim/banner.jpg",
    hero: { type: "image", src: "/assets/brands/utkanyildirim/banner.jpg" },
    services: ["Dijital Pazarlama", "Performans Pazarlama", "Kreatif Tasarım Hizmetleri"],
    headline: "Mimarlık Sektöründe Dijital Pazarlama",
    intro:
      "Utkan Yıldırım Design markasının dijitaldeki pazar payını ve marka bilinirliğini artırmak amacıyla bütüncül bir dijital pazarlama kurgusu hayata geçirdik. Markanın estetik çizgisini yansıtan statik içerikler ve yüksek etkileşim odaklı Reels videolarından oluşan aylık sosyal medya içerik takvimlerini yönetirken; performans pazarlama operasyonlarımızla hedef kitleye doğrudan ulaşarak markaya nitelikli müşteri talepleri ve dönüşüm kazandırdık.",
    meta: {
      musteri: "Utkan Yıldırım Design",
      tarih: "2023",
      sure: "3 ay",
      proje: ["Dijital Pazarlama", "Performans Pazarlama", "Kreatif Tasarım Hizmetleri"],
    },
  },
  {
    slug: "qui-prive",
    name: "Qui Prive",
    banner: "/assets/brands/quiprive/banner.jpg",
    hero: { type: "image", src: "/assets/brands/quiprive/banner.jpg" },
    services: ["Prodüksiyon", "Post-Prodüksiyon", "Marka Tanıtım Filmi"],
    headline: "Marka Tanıtım Filmi ve Post-Prodüksiyon",
    intro:
      "QUI Prive markasının pazar segmentasyonunu ve prestijini güçlendirmek adına uçtan uca prodüksiyon ve post-prodüksiyon süreçlerini üstlendik. Markanın hikayesini ve premium çizgisini hedef kitleye etkileyici bir görsel dille aktaran marka tanıtım filmlerini kurgulayarak, markanın dijital ve kurumsal mecralardaki imajını en üst seviyeye taşıdık.",
    meta: {
      musteri: "QUI prive",
      tarih: "—", // Ekipten bekleniyor (dökümanda ??)
      sure: "—",
      proje: ["Prodüksiyon", "Post-Prodüksiyon", "Marka Tanıtım Filmi"],
    },
  },
];

export function getBrand(slug: string) {
  return BRANDS.find((b) => b.slug === slug);
}
