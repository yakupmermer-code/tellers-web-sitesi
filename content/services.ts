export type Service = {
  slug: string;
  eyebrow: string;
  titleEn: string;
  titleTr: string;
  summary: string;
  /** Hizmetler sayfası uzun tanıtım paragrafı */
  detail: string;
  /** Uzun tanıtım kısa sloganı */
  tagline: string;
  /** Sağdaki madde listesi */
  items: string[];
  /** Ana sayfa hizmet slide görseli */
  slide: string;
  /** Ana sayfadaki kısa tanım (2.png yanındaki liste) */
  homeBlurb: string;
};

export const SERVICES: Service[] = [
  {
    slug: "performans-pazarlama",
    eyebrow: "Veri Odaklı Büyüme",
    titleEn: "Performans Marketing",
    titleTr: "Performans Pazarlama",
    summary:
      "Reklam bütçenizi görünürlükten öteye taşıyor, ölçülebilir dönüşüm ve büyümeye dönüştürüyoruz.",
    tagline: "Ölçülebilir sonuçlar, sürdürülebilir büyüme.",
    detail:
      "Performans pazarlama hizmetimizle reklam bütçenizi yalnızca görünürlük için değil, ölçülebilir sonuçlar ve gerçek iş sonuçları için yönetiyoruz. Meta Ads, Google Ads ve diğer dijital reklam kanallarında hedef kitlenizi doğru analiz ederek; dönüşüm, lead, satış ve müşteri edinme odaklı kampanyalar oluşturuyoruz. Verileri sürekli analiz ediyor, reklam performansını optimize ediyor ve bütçenizin en yüksek geri dönüşü sağlaması için stratejimizi sürekli geliştiriyoruz. Performans odaklı dijital reklam yönetimiyle markanızın büyümesini tesadüflere bırakmıyor, veri uzmanlığı sunuyoruz.",
    items: [
      "Hedef Kitle Belirleme ve Segmentasyon",
      "Medya Stratejisi (Meta ve Google)",
      "Bütçe Optimizasyonu ve Ölçeklendirme",
      "Kampanya Performans Analizi",
      "Dönüşüm Oranı Optimizasyonu (CRO)",
      "Potansiyel Müşteri Oluşturma Sistemleri",
    ],
    slide: "/assets/services/performance-marketing-slide.png",
    homeBlurb:
      "Veriye odaklı stratejilerle markanızı doğru hedef kitleyle buluşturuyor, reklam yatırımlarınızı ölçülebilir verilerle en verimli şekilde yöneterek sürekli optimizasyon ve analitik raporlamalarla maksimum ROI ve nitelikli lead almanızı sağlıyoruz.",
  },
  {
    slug: "dijital-pazarlama",
    eyebrow: "Stratejik Büyüme",
    titleEn: "Digital Marketing",
    titleTr: "Dijital Pazarlama",
    summary:
      "Markanızı doğru strateji ve doğru kanallarla doğru kitleyle buluşturuyoruz.",
    tagline: "Markanızı doğru kanallarda, doğru hedef kitle ile buluşturuyoruz.",
    detail:
      "Dijital pazarlama hizmetimizle markanızın dijital dünyadaki tüm temas noktalarını tek bir strateji altında birleştiriyoruz. Hedef kitle ve pazar analizinden reklam yönetimine, içerik stratejisinden dijital marka iletişimine kadar uçtan uca dijital pazarlama çözümleri geliştiriyoruz. Amacımız yalnızca daha fazla kişiye ulaşmak değil; markanızla ilgilenen doğru kitleyi bulmak, güven oluşturmak ve bu ilgiyi ölçülebilir bir müşteri kazanımına dönüştürmek.",
    items: [
      "Sosyal Medya Yönetimi",
      "İçerik Stratejisi ve Metin Yazarlığı",
      "Hareket ve Etkileşim Tasarımı",
      "Topluluk Moderasyonu",
      "Influencer ve Etkinlik Yönetimi",
      "Dijital PR ve Kampanya Planlama",
    ],
    slide: "/assets/services/digital-marketing-slide.png",
    homeBlurb:
      "Sosyal medya, değişken pazar dinamiklerine uygun içerik kurguları ve dijital reklam çözümleriyle markanızın dijital dünyada sürdürülebilir büyümesini sağlıyor, marka sadakati yaratıp; markanız için sürdürülebilir varlık sağlıyoruz.",
  },
  {
    slug: "markalama",
    eyebrow: "Marka Kimliği & Konumlandırma",
    titleEn: "Branding",
    titleTr: "Markalama",
    summary:
      "Markanızın yalnızca nasıl göründüğünü değil, nasıl hatırlanacağını tasarlıyoruz.",
    tagline: "Güçlü bir marka, yalnızca görünmez; hatırlanır.",
    detail:
      "Markalama hizmetimizle markanızın yalnızca nasıl göründüğünü değil, insanlarda nasıl bir algı bıraktığını tasarlıyoruz. Marka stratejisi, konumlandırma, hedef kitle analizi, marka dili, görsel kimlik ve iletişim yaklaşımını bir bütün olarak ele alarak markanız için güçlü ve tutarlı bir marka deneyimi oluşturuyoruz. Böylece markanız rakipleri arasında yalnızca fark edilmekle kalmaz, doğru konumlandırılır, güven verir ve en önemlisi, akılda kalır.",
    items: [
      "Pazar ve Rakip Analizi",
      "Marka Stratejisi",
      "Marka Kimliği & İmajı ve İletişim Tonu",
      "Marka Hikayesi ve Slogan Yazımı",
      "Kurumsal Kimlik Tasarımı",
      "Marka Konumlandırma ve Kılavuz İlkeleri",
    ],
    slide: "/assets/services/branding-slide.png",
    homeBlurb:
      "Markanızı rakiplerinden ayrıştıran güçlü bir kimlik oluşturuyor, her temas noktasında tutarlı ve güven veren bir marka deneyimi sunuyoruz.",
  },
  {
    slug: "kreatif-tasarim",
    eyebrow: "Kreatif Tasarım",
    titleEn: "Creative Design",
    titleTr: "Kreatif Tasarım Hizmetleri",
    summary:
      "Markanızın mesajını dikkat çeken, özgün ve harekete geçiren yaratıcı deneyimlere dönüştürüyoruz.",
    tagline: "Fikri, dikkat çeken ve harekete geçiren bir deneyime dönüştürüyoruz.",
    detail:
      "Kreatif tasarım hizmetlerimizle markanızın mesajını görsel olarak güçlü, özgün ve hedef kitleniz üzerinde etki bırakacak şekilde anlatıyoruz. Sosyal medya tasarımları, reklam kreatifleri, kampanya görselleri, web tasarımları ve dijital içerikler için markanızın kimliğine uygun yaratıcı çözümler üretiyoruz. Çünkü iyi tasarım yalnızca estetik görünmez; doğru mesajı doğru kişiye aktarır, markayı güçlendirir ve kullanıcıyı harekete geçirir.",
    items: [
      "Görsel Kimlik Uygulaması",
      "Web ve Mobil Banner Arayüz Tasarımı",
      "Sunum ve Tanıtım Sunumu (Pitch Deck) Tasarımı",
      "Açık Hava ve Basılı Materyaller (OOH)",
      "Hareketli Grafikler ve Post-Prodüksiyon",
      "Kampanya Kreatif Yönetimi",
    ],
    slide: "/assets/services/creative-design-slide.png",
    homeBlurb:
      "Yaratıcılığı stratejiyle birleştirerek markanızı hem dijital hem de basılı mecralarda etkileyici tasarımlar ve özgün içeriklerle anlatıyoruz.",
  },
];
