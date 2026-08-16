export type Brand = {
  slug: string;
  name: string;
  /** Portfolyo grid'indeki banner görseli */
  banner: string;
  /** Portfolyo liste kartı altındaki kısa bilgi (temadaki work sayfası formatı) */
  listService: string;
  year: string;
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
    /**
     * Eşit kutulu grid — içerik dökümanı her marka için farklı sütun sayısı
     * istiyor (Atlantis 2'li, Sua Horeca 2'li, Utkan Yıldırım 3'lü).
     * Kutular aynı en-boy oranında olur, medya object-cover ile oturur.
     */
    | {
        kind: "grid";
        cols: 2 | 3;
        items: Array<{ type: "image" | "video"; src: string }>;
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
    listService: "Above The Line Üzerine Çalışmalar",
    year: "2016",
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
    listService: "Dijital Pazarlama",
    year: "2020-2022",
    hero: { type: "image", src: "/assets/brands/bardahl/slide.png" },
    services: [
      "Dijital Pazarlama",
      "Performans Pazarlama",
      "Kreatif Tasarım Hizmetleri",
      "Web Site Tasarımı",
    ],
    headline: "Bardahl Türkiye Marka Konumlandırması",
    intro:
      "Motor yağı sektörünün küresel liderlerinden Bardahl'ın Türkiye pazarına giriş, marka konumlandırması ve ürün satış adımlarını çizgi altı ve çizgi üstü, tüm mecralarda yönettik.",
    meta: {
      musteri: "Bardahl",
      tarih: "02.12.2020 - 07.05.2022",
      sure: "17 ay",
      proje: [
        "Dijital Pazarlama",
        "Performans Pazarlama",
        "Kreatif Tasarım Hizmetleri",
        "Web Site Tasarımı",
      ],
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
    listService: "Performans Pazarlama & Dijital Pazarlama",
    year: "2023-2025",
    hero: {
      // Döküman: YatayVideoMyNova_3.mp4
      type: "video",
      src: "/assets/brands/mynova/hero-yatay.mp4",
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
      // Döküman: bu üçlü alanın görselleri arasında Mannheim postu da var
      // ("linkteki görseller yukarıdaki 3'lü alanın ölçülerine göre").
      { kind: "image", src: "/assets/brands/mynova/mannheim.png" },
      {
        kind: "tri",
        left: { type: "image", src: "/assets/brands/mynova/darwin-chair.jpg" },
        rightTop: "/assets/brands/mynova/shakespeare.jpg",
        rightBottom: "/assets/brands/mynova/sherlock.jpg",
        flip: true,
      },
      // Döküman: 3 kreatif reels (Allen Eric Marshall / Theodor / Engin Yücetaş).
      // NOT: dökümanda bu blok Performance Results'ın ALTINDA; sayfa şablonunda
      // galeri her zaman results'tan önce geldiği için buraya alındı.
      {
        kind: "grid",
        cols: 3,
        items: [
          { type: "video", src: "/assets/brands/mynova/r1.mp4" },
          { type: "video", src: "/assets/brands/mynova/r2.mp4" },
          { type: "video", src: "/assets/brands/mynova/r3.mp4" },
        ],
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
    listService: "3D İçerik Üretimi & Dijital Pazarlama",
    year: "2022-2023",
    hero: {
      type: "video",
      src: "/assets/brands/savron/hero.mp4",
      poster: "/assets/brands/savron/banner.png",
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
    // Döküman: 3 story videosu (Akvaryum / Kaykay / Saat Kulesi)
    gallery: [
      // Ekip notu (2026-08-15): "Diğer Projeler"in üstündeki büyük görsel alanı
      { kind: "image", src: "/assets/brands/savron/banner.png", wide: true },
      {
        kind: "grid",
        cols: 3,
        items: [
          { type: "video", src: "/assets/brands/savron/g1.mp4" },
          { type: "video", src: "/assets/brands/savron/g2.mp4" },
          { type: "video", src: "/assets/brands/savron/g3.mp4" },
        ],
      },
    ],
  },
  {
    slug: "tyre-supply",
    name: "Tyre Supply",
    banner: "/assets/brands/tyresupply/banner.png",
    listService: "Performans Pazarlama & Dijital Pazarlama",
    year: "2024-2025",
    hero: { type: "image", src: "/assets/brands/tyresupply/hero.jpg" },
    services: ["Dijital Pazarlama", "Performans Pazarlama", "Kreatif Tasarım Hizmetleri"],
    headline: "Otomotiv Sektöründe Dijital Pazarlama",
    intro:
      "Otomotiv sektörünün büyük lastik tedarikçilerinden Tyre Supply ile marka konumlandırması, iletişim stratejisi ve dijital pazarlama operasyonlarında birlikte çalıştık. Reklam stratejileri doğrultusunda B2B ve B2C kampanya kurguları ve kreatif içerikler geliştirerek markamızın dijital reklam çalışmalarını hem Türkiye hem de Almanya pazarında yöneterek hedef kitle ile buluştuk. Bu hizmetlerin yanı sıra ATL (Çizgi Altı Reklamcılık) reklam çalışmalarının yönetim ve üretimlerini gerçekleştirdik.",
    meta: {
      musteri: "Tyre Supply",
      tarih: "14.06.2024 - 02.05.2025",
      sure: "11 ay",
      proje: ["Dijital Pazarlama", "Kreatif Tasarım Hizmetleri"],
    },
    // Döküman: "yan yana iki tane, 3 sıra" → 2 sütun × 3 satır
    gallery: [
      {
        kind: "grid",
        cols: 2,
        items: [
          { type: "video", src: "/assets/brands/tyresupply/g1.mp4" },
          { type: "image", src: "/assets/brands/tyresupply/g2.jpg" },
          { type: "image", src: "/assets/brands/tyresupply/g3.jpg" },
          { type: "image", src: "/assets/brands/tyresupply/g4.jpg" },
          { type: "image", src: "/assets/brands/tyresupply/g5.jpg" },
          { type: "image", src: "/assets/brands/tyresupply/g6.jpg" },
        ],
      },
    ],
  },
  {
    slug: "savronik",
    name: "Savronik",
    banner: "/assets/brands/savronik/banner.png",
    listService: "Yaratıcı Marka Tanıtım Filmi",
    year: "2022-2023",
    hero: { type: "image", src: "/assets/brands/savronik/banner.png" },
    services: ["Yaratıcı Marka Tanıtım Filmi", "Prodüksiyon", "Marka Konumlandırma"],
    headline:
      "Savunma Sektöründe Yaratıcı Marka Tanıtım Filmi",
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
    listService: "Performans Pazarlama & Dijital Pazarlama",
    year: "2024",
    hero: {
      type: "video",
      src: "/assets/brands/atlantis/hero.mp4",
      poster: "/assets/brands/atlantis/banner.png",
    },
    services: [
      "Dijital Pazarlama",
      "Performans Pazarlama",
      "Kreatif Tasarım Hizmetleri",
      "Web Site Tasarımı",
    ],
    headline:
      "Türkiye'nin İlk ve Tek Akıllı Sulama Sistemlerinde Dijital Pazarlama",
    intro:
      "Akıllı sulama sistemleri üreticisi Atlantis'in uluslararası pazardaki algısını güçlendirmek ve marka konumlandırmasını sağlamak adına sosyal medya stratejisini ve reklam kreatiflerini sıfırdan ele aldık. Markanın web site tasarım ve yazılımını ve görsel iletişim dilini küresel hedef kitlenin beklentilerine göre kurguladık. Veri odaklı performans pazarlama ve dijital pazarlama stratejilerimiz ile markanın global ölçekteki potansiyel alıcılardan nitelikli lead toplamasını sağladık ve uluslararası satış kanallarını doğrudan besledik.",
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
    // Döküman: "yan yana iki tane olacak şekilde 3 sıra" → 2 sütun × 3 satır
    gallery: [
      {
        kind: "grid",
        cols: 2,
        items: [
          { type: "image", src: "/assets/brands/atlantis/g1.jpg" },
          { type: "video", src: "/assets/brands/atlantis/g2.mp4" },
          { type: "video", src: "/assets/brands/atlantis/g3.mp4" },
          { type: "video", src: "/assets/brands/atlantis/g4.mp4" },
          { type: "video", src: "/assets/brands/atlantis/g5.mp4" },
          { type: "image", src: "/assets/brands/atlantis/g6.png" },
        ],
      },
    ],
  },
  {
    slug: "raymond-weil",
    name: "Raymond Weil",
    banner: "/assets/brands/raymondweil/banner.png",
    listService: "Post-Prodüksiyon",
    year: "2018",
    hero: { type: "image", src: "/assets/brands/raymondweil/banner.png" },
    services: [
      "Post-Prodüksiyon",
      "Yaratıcı Konsept Tasarımı",
    ],
    headline: "Statik Görselden Dinamik İçeriğe",
    intro:
      "Lüks saat sektörünün köklü markalarından Raymond Weil'in lüks, zamansız ve sofistike marka imajını konumlandırmak ve dijital mecralardaki varlığını güçlendirmek amacıyla gelişmiş dijital post-prodüksiyon teknikleri kullandık.\n\nBu çalışmayla yalnızca bir ürün görseli oluşturmak yerine, lüks saat markalarının dijital iletişiminde ihtiyaç duyduğu görsel deneyimi tasarladık. Marka estetiği ile güncel dijital içerik trendlerini bir araya getirerek, sosyal medya ve dijital platformlarda kullanılabilecek dikkat çekici kreatifler ortaya çıkardık.",
    meta: {
      musteri: "Raymond Weil",
      tarih: "2017",
      sure: "3 ay", // Ekipten bekleniyor (dökümanda XXXX)
      proje: [
        "Post-Prodüksiyon",
        "Yaratıcı Konsept Tasarımı",
      ],
    },
    // Döküman: "yan yana 3 tane olacak şekilde" → 3 sütun
    gallery: [
      {
        kind: "grid",
        cols: 3,
        items: [
          { type: "video", src: "/assets/brands/raymondweil/g1.mp4" },
          { type: "video", src: "/assets/brands/raymondweil/g2.mp4" },
          { type: "video", src: "/assets/brands/raymondweil/g3.mp4" },
        ],
      },
    ],
  },
  {
    slug: "bfit",
    name: "b-fit",
    banner: "/assets/brands/bfit/banner.jpg",
    listService: "Markalama & Performans Pazarlama",
    year: "2023-Devam ediyor",
    hero: {
      // Döküman: bfit_tanitim_yatay.mp4
      type: "video",
      src: "/assets/brands/bfit/hero.mp4",
      poster: "/assets/brands/bfit/banner.jpg",
    },
    services: ["Markalama", "Dijital Pazarlama", "Performans Pazarlama", "Kreatif Ajans Hizmetleri"],
    headline:
      "Türkiye\'nin En Büyük Spor Franchise Markasına Markalama",
    intro:
      "Türkiye'nin en büyük spor franchise markası olan b-fit'in 21. yılında; marka konumlandırmasını, imajını ve logosunu yeniledik. Ölçülebilir veri odaklı performans pazarlama operasyonumuz ile markamızın franchise satışları için lead akışı sağlıyor; dijital pazarlama operasyonumuz ve yaratıcı konsept tasarımlarımız ile marka konumlandırması ve tüm hedef kitle iletişimlerini yöneterek her gün daha fazla kadının hayatına dokunmaya devam ediyoruz.",
    meta: {
      musteri: "b-fit",
      tarih: "01.12.2024 - Devam Ediyor",
      sure: "Devam Ediyor",
      proje: ["Markalama", "Dijital Pazarlama", "Performans Pazarlama", "Kreatif Ajans Hizmetleri"],
    },
    // Döküman: "yan yana 2 tane, 4 satır aşağıya çoğalt = 8 banner"
    gallery: [
      {
        kind: "grid",
        cols: 2,
        items: [
          { type: "image", src: "/assets/brands/bfit/g1.jpg" },
          { type: "image", src: "/assets/brands/bfit/g2.jpg" },
          { type: "image", src: "/assets/brands/bfit/g3.jpg" },
          { type: "image", src: "/assets/brands/bfit/g4.jpg" },
          { type: "video", src: "/assets/brands/bfit/g5.mp4" },
          { type: "video", src: "/assets/brands/bfit/g6.mp4" },
          { type: "image", src: "/assets/brands/bfit/g7.jpg" },
          { type: "image", src: "/assets/brands/bfit/g8.jpg" },
        ],
      },
    ],
  },
  {
    slug: "sua-horeca",
    name: "Sua Horeca",
    banner: "/assets/brands/sua/banner.png",
    listService: "Markalama & Kreatif Tasarım Hizmetleri",
    year: "2025-2026",
    hero: { type: "image", src: "/assets/brands/sua/banner.png" },
    services: ["Markalama", "Dijital Pazarlama", "Kreatif Ajans Hizmetleri"],
    headline: "Doğal Kozmetik Sektöründe Markalama",
    intro:
      "Sua Horeca için markanın doğal, premium ve güven veren kimliğini güçlü bir marka deneyimine dönüştürdük. Projenin merkezine markalama, dijital pazarlama ve yaratıcı konsept geliştirme süreçlerini alarak, Sua Horeca'nın hedef kitlesiyle güçlü bir bağ kurmasını sağlayan bütünsel bir iletişim dili oluşturduk.\n\nDijital pazarlama operasyonumuz ile marka konumlandırmasını gerçekleştirerek marka bilinirliği yaratıp; topluluk iletişimi gerçekleştirdik.",
    meta: {
      musteri: "SUA HORECA",
      tarih: "01.06.2025 - 21.02.2026",
      sure: "9 ay",
      proje: ["Markalama", "Dijital Pazarlama", "Kreatif Ajans Hizmetleri"],
    },
    // Döküman: "yan yana 2 tane... 5 satır aşağıya çoğaltalım" → 2 sütun × 5 satır
    gallery: [
      {
        kind: "grid",
        cols: 2,
        items: [
          { type: "image", src: "/assets/brands/sua/g1.png" },
          { type: "video", src: "/assets/brands/sua/g2.mp4" },
          { type: "video", src: "/assets/brands/sua/g3.mp4" },
          { type: "video", src: "/assets/brands/sua/g4.mp4" },
          { type: "image", src: "/assets/brands/sua/g5.jpg" },
          { type: "image", src: "/assets/brands/sua/g6.jpg" },
          { type: "image", src: "/assets/brands/sua/g7.jpg" },
          { type: "video", src: "/assets/brands/sua/g8.mp4" },
          { type: "image", src: "/assets/brands/sua/g9.png" },
          { type: "image", src: "/assets/brands/sua/g10.jpg" },
        ],
      },
    ],
  },
  {
    slug: "premium-gym",
    name: "Premium Gym",
    banner: "/assets/brands/premiumgym/banner.jpg",
    listService: "Dijital Pazarlama & Kreatif Tasarım Hizmetleri",
    year: "2023-2024",
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
      "Premium Gym'in kurumsal kimliğini yeniden inşa ederek marka konumlandırması gerçekleştirdik.\n\nDijital iletişim stratejileri, yaratıcı konsept çalışmaları ve gerilla kampanya kurgularımızla bütünleşik bir marka deneyimi kurgulayarak marka sadakati inşa ettik ve topluluk iletişimi gerçekleştirdik.\n\nVeri odaklı performans pazarlama stratejilerimiz ile markamız için aylık ve yıllık üye kazanımı sağladık.",
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
    // Döküman 6 kutu diyor ama 8 içerik veriyor; 1'i (tasarım3.png) Drive'da paylaşıma kapalı → 7 gösteriliyor
    gallery: [
      {
        kind: "grid",
        cols: 2,
        items: [
          { type: "image", src: "/assets/brands/premiumgym/g1.jpg" },
          { type: "video", src: "/assets/brands/premiumgym/g2.mp4" },
          { type: "video", src: "/assets/brands/premiumgym/g3.mp4" },
          { type: "video", src: "/assets/brands/premiumgym/g4.mp4" },
          { type: "video", src: "/assets/brands/premiumgym/g6.mp4" },
          { type: "image", src: "/assets/brands/premiumgym/g7.jpg" },
          { type: "image", src: "/assets/brands/premiumgym/g8.jpg" },
          { type: "image", src: "/assets/brands/premiumgym/g9.jpg" },
        ],
      },
    ],
  },
  {
    slug: "dedebio",
    name: "Dedebio",
    banner: "/assets/brands/dedebio/banner.png",
    listService: "Markalama & Kreatif Tasarım Hizmetleri",
    year: "2023",
    hero: { type: "image", src: "/assets/brands/dedebio/hero.png" },
    services: ["Markalama", "Dijital Pazarlama", "Kreatif Tasarım Hizmetleri"],
    headline: "Organik Gıda Sektöründe Markalama",
    intro:
      "DEDEBIO markasının pazardaki konumunu güçlendirmek ve hedef kitlesiyle güncel bir iletişim dili yakalaması sağlamak amacıyla marka yenileme sürecini gerçekleştirdik. Yenilenen marka kimliği ile marka konumlandırmasını gerçekleştirip, stratejik dijital pazarlama operasyonlarımızla markanın dijitaldeki bilinirliğini, güvenilirliğini ve etkileşim oranlarını artırdık.",
    meta: {
      musteri: "DEDEBIO",
      tarih: "2023",
      sure: "8 Ay", // Ekipten bekleniyor (dökümanda XXXX)
      proje: ["Markalama", "Dijital Pazarlama", "Kreatif Tasarım Hizmetleri"],
    },
    // Döküman: "yan yana 2 tane"
    gallery: [
      {
        kind: "grid",
        cols: 2,
        items: [
          { type: "image", src: "/assets/brands/dedebio/g1.jpg" },
          { type: "image", src: "/assets/brands/dedebio/g2.jpg" },
        ],
      },
    ],
  },
  {
    slug: "bni",
    name: "BNI",
    banner: "/assets/brands/bni/banner.png",
    listService: "Performans Pazarlama",
    year: "2020-2022",
    hero: {
      type: "video",
      src: "/assets/brands/bni/hero.mp4",
      poster: "/assets/brands/bni/banner.png",
    },
    services: ["Dijital Pazarlama", "Performans Pazarlama", "Kreatif Tasarım Hizmetleri"],
    headline:
      "Dünyanın En Büyük Networking Markasına Dijital Pazarlama",
    intro:
      "Dünyanın en büyük iş yönlendirme organizasyonu olan BNI için geliştirdiğimiz iletişim stratejisi ve kreatif konsept ile markanın dijital konumlandırmasını sağlayıp, marka bilinirliğini artırdık. Bütüncül dijital pazarlama operasyonlarımız ile markanın dijital varlığını yaratıp; ülke genelindeki tüm BNI gruplarının bütüncül bir iletişim dili yürütmesini sağlarken yaratıcı konsept kurgularımız Amerika'da BNI'ın kurucusu Ivan Misner'e kadar uzandı.",
    meta: {
      musteri: "BNI",
      tarih: "2020 - 2022",
      sure: "2 yıl",
      proje: [
        "Dijital Pazarlama",
        "Kreatif Tasarım Hizmetleri",
      ],
    },
    // Döküman: "yan yana 2, altına yine ikili → 4'lü grid"
    gallery: [
      {
        kind: "grid",
        cols: 2,
        items: [
          { type: "image", src: "/assets/brands/bni/g1.jpg" },
          { type: "image", src: "/assets/brands/bni/g2.jpg" },
          { type: "video", src: "/assets/brands/bni/g3.mp4" },
          { type: "video", src: "/assets/brands/bni/g4.mp4" },
        ],
      },
    ],
  },
  {
    slug: "minousha",
    name: "Minousha",
    banner: "/assets/brands/minousha/banner.jpg",
    listService: "Post-Prodüksiyon & Prodüksiyon & Cast",
    year: "2018",
    hero: {
      // Döküman: media10.mp4
      type: "video",
      src: "/assets/brands/minousha/hero.mp4",
      poster: "/assets/brands/minousha/banner.jpg",
    },
    services: ["Post-Prodüksiyon", "Prodüksiyon", "Cast", "Kreatif Tasarım Hizmetleri"],
    headline:
      "El Yapımı Niş Kıyafetlerde Marka Konumlandırma",
    intro:
      "Minousha'nın dijital marka konumlandırmasını sağlamak adına yaratıcı konsept kurgularımız ile marka tanıtım filmi kurgulayıp; prodüksiyon ve post-prodüksiyon süreçlerini yürüttük.",
    meta: {
      musteri: "Minousha",
      tarih: "2017", // Ekip teyidi bekleniyor (dökümanda soru işaretli)
      sure: "3 Ay",
      proje: ["Post-Prodüksiyon", "Prodüksiyon", "Cast", "Kreatif Tasarım Hizmetleri"],
    },
    // Ekip notu (2026-08-15): "Diğer Projeler"in üstündeki büyük görsel alanı.
    // Döküman: "Bu büyük görsel alanına linkteki görsel eklenecek" (minousha.jpg)
    gallery: [
      { kind: "image", src: "/assets/brands/minousha/banner.jpg", wide: true },
    ],
  },
  {
    slug: "anatolian-stars",
    name: "Anatolian Stars",
    banner: "/assets/brands/anatolianstars/banner.jpg",
    listService: "Markalama & Dijital Pazarlama",
    year: "2020-2021",
    hero: { type: "image", src: "/assets/brands/anatolianstars/hero.png" },
    services: [
      "Markalama",
      "Kreatif Tasarım Hizmetleri",
      "Web Site Tasarımı",
    ],
    headline:
      "Uluslararası Gıda Taşımacılığında Markalama",
    intro:
      "Türkiye'de yetiştirilen taze meyve ve sebzelerin uluslararası pazarlara ihracatını gerçekleştiren Anatolian Stars için markalama ve yaratıcı konsept çalışmalarını üstlendik. Markanın Türkiye'nin güçlü tarım kültürünü, ürün kalitesini ve uluslararası ticaret vizyonunu yansıtan güvenilir ve güçlü bir marka kimliğine sahip olması için stratejik bir iletişim yaklaşımı geliştirdik.",
    meta: {
      musteri: "Anatolian Stars",
      tarih: "12.09.2020 - 02.04.2021",
      sure: "7 ay",
      proje: ["Markalama", "Dijital Pazarlama", "Kreatif Tasarım Hizmetleri", "Web Site Tasarımı"],
    },
    // Döküman: "yan yana 2 tane"
    gallery: [
      {
        kind: "grid",
        cols: 2,
        items: [
          { type: "image", src: "/assets/brands/anatolianstars/g1.jpg" },
          { type: "image", src: "/assets/brands/anatolianstars/g2.jpg" },
        ],
      },
    ],
  },
  {
    slug: "utkan-yildirim",
    name: "Utkan Yıldırım Design",
    banner: "/assets/brands/utkanyildirim/banner.jpg",
    listService: "Dijital Pazarlama & Performans Pazarlama",
    year: "2023",
    hero: { type: "image", src: "/assets/brands/utkanyildirim/banner.jpg" },
    services: ["Dijital Pazarlama", "Kreatif Tasarım Hizmetleri"],
    headline: "Mimarlık Sektöründe Dijital Pazarlama",
    intro:
      "Utkan Yıldırım Design markasının marka konumlandırmasını inşa etmek ve marka bilinirliğini artırmak amacıyla bütüncül bir dijital pazarlama kurgusu hayata geçirdik. Markanın estetik çizgisini yansıtan statik içerikler ve yüksek etkileşim odaklı Reels kurgularımız ile hedef kitleye doğrudan ulaşarak markaya nitelikli müşteri talepleri ve dönüşüm kazandırdık.",
    meta: {
      musteri: "Utkan Yıldırım Design",
      tarih: "2023",
      sure: "9 ay",
      proje: ["Dijital Pazarlama", "Kreatif Tasarım Hizmetleri"],
    },
    // Döküman: "yan yana 3 tane... her satırda 3'lü banner ile 9'lu grid"
    gallery: [
      {
        kind: "grid",
        cols: 3,
        items: [
          { type: "image", src: "/assets/brands/utkanyildirim/g1.png" },
          { type: "image", src: "/assets/brands/utkanyildirim/g2.jpg" },
          { type: "image", src: "/assets/brands/utkanyildirim/g3.jpg" },
          { type: "image", src: "/assets/brands/utkanyildirim/g4.jpg" },
          { type: "image", src: "/assets/brands/utkanyildirim/g5.png" },
          { type: "image", src: "/assets/brands/utkanyildirim/g6.jpg" },
          { type: "video", src: "/assets/brands/utkanyildirim/g7.mp4" },
          { type: "video", src: "/assets/brands/utkanyildirim/g8.mp4" },
          { type: "video", src: "/assets/brands/utkanyildirim/g9.mp4" },
        ],
      },
    ],
  },
  {
    slug: "qui-prive",
    name: "Qui Prive",
    banner: "/assets/brands/quiprive/banner.jpg",
    listService: "Post-Prodüksiyon & Marka Tanıtım Filmi",
    year: "2018",
    hero: { type: "image", src: "/assets/brands/quiprive/banner.jpg" },
    services: [
      "Prodüksiyon",
      "Post-Prodüksiyon",
      "Marka Tanıtım Filmi",
      "Dijital Pazarlama",
    ],
    headline:
      "Özel Tasarım Moda Sektöründe Marka Konumlandırma",
    intro:
      "Özel tasarım kıyafetleriyle özgün stil ve güçlü marka algısını bir araya getiren Qui Privé için, markanın dijital dünyadaki görünürlüğünü ve iletişim gücünü artırmaya yönelik uçtan uca kreatif çalışmalar gerçekleştirdik.\n\nProje kapsamında markanın estetik dünyasını ve tasarım anlayışını yansıtan yaratıcı dijital konsept kurguları geliştirdik; bu konseptleri profesyonel prodüksiyon ve post-prodüksiyon süreçleriyle görsel bir marka deneyimine dönüştürdük. Her içerikte kıyafetlerin tasarım detaylarını, koleksiyonun karakterini ve Qui Privé'nin özgün stilini ön plana çıkaran güçlü bir görsel dil oluşturduk.",
    meta: {
      musteri: "QUI prive",
      tarih: "2017", // Ekipten bekleniyor (dökümanda ??)
      sure: "8 Ay",
      proje: [
        "Prodüksiyon",
        "Post-Prodüksiyon",
        "Marka Tanıtım Filmi",
        "Dijital Pazarlama",
      ],
    },
    // Döküman: "yan yana 3 tane"
    gallery: [
      {
        kind: "grid",
        cols: 3,
        items: [
          { type: "video", src: "/assets/brands/quiprive/g1.mp4" },
          { type: "image", src: "/assets/brands/quiprive/g2.jpg" },
          { type: "video", src: "/assets/brands/quiprive/g3.mp4" },
        ],
      },
    ],
  },
];

export function getBrand(slug: string) {
  return BRANDS.find((b) => b.slug === slug);
}
