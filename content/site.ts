/**
 * Adres bileşenleri — hem sayfada gösterilen metnin hem JSON-LD'deki
 * PostalAddress'in TEK kaynağı. Daha önce adres iki ayrı yerde (burada düz
 * metin, lib/seo.ts'te parçalı) tutuluyordu; biri değişince diğeri sessizce
 * eskiyordu (code-reviewer + security-auditor ortak bulgusu, 2026-08-26).
 */
const ADRES = {
  sokak:
    "Kalaba Mahallesi Kütükçü Alibey Cad. No: 2 Ankara Üniversitesi Teknokent A Blok Kat: 1 Ofis: 105/A",
  ilce: "Keçiören",
  il: "Ankara",
  ulkeKodu: "TR",
} as const;

export const SITE = {
  name: "tellers",
  title: "tellers | Creative Communications",
  slogan: "Duyulan unutulur, anlaşılan kalır.",
  description:
    "7 yılda, 3 kıta ve 15 ülkede; markaların yalnızca duyulmasını değil gerçekten anlaşılmasını sağlayan anlam mimarisi ajansı.",
  email: "hello@tellers.email",
  instagram: "https://www.instagram.com/tellersturkiye/",
  linkedin:
    "https://www.linkedin.com/company/v-v-creative-communication-agency/",
  phone: "+905308176337",
  phoneDisplay: "0530 817 63 37",
  whatsapp: "https://wa.me/905308176337",
  /** Parçalı adres — JSON-LD PostalAddress bunu kullanır. */
  adres: ADRES,
  /** Sayfada gösterilen tek satırlık adres (parçalardan üretilir). */
  address: `${ADRES.sokak} ${ADRES.ilce} / ${ADRES.il}`,
  /**
   * Footer'daki konum cümlesi (referanstaki "We are currently based in..."
   * satırının karşılığı). BİLİNÇLİ olarak şehir adı geçmiyor: app/layout.tsx'te
   * yazılı karar var — tellers yerel bir "Ankara ajansı" değil, ulusal ve
   * uluslararası konumlanıyor. Ofis adresi zaten footer'ın alt katında duruyor.
   * Kapsam sayıları (kıta/ülke) da bilinçli olarak burada tekrarlanmıyor;
   * sayılar sayfa metinlerinde geçiyor, iki yerde tutulup birinin eskimesi
   * istenmiyor.
   */
  konumCumlesi:
    "Türkiye merkezliyiz; markalarla uzaktan ve yerinde çalışıyoruz.",
  /** Footer alt bandındaki künye satırı. Ticari unvan/sicil bilgisi ekipten gelince genişletilecek. */
  kunyeCumlesi:
    "Marka iletişimi, performans pazarlaması, dijital pazarlama ve kreatif üretim hizmetleri tellers Creative Communications tarafından verilir.",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(
      "Ankara Üniversitesi Teknokent A Blok, Kalaba Mahallesi Kütükçü Alibey Caddesi No:2, Keçiören/Ankara",
    ),
} as const;

/** Numara ekipten geldi (2026-08-14) — tel/WhatsApp linkleri artık aktif. */
export const PHONE_READY = true;

export const NAV = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Portfolyo", href: "/portfolyo" },
  { label: "Hizmetlerimiz", href: "/hizmetlerimiz" },
  { label: "Blog", href: "/blog" },
  { label: "Kariyer", href: "/kariyer" },
  { label: "İletişim", href: "/iletisim" },
] as const;

/**
 * Sertifikalarımız ve partnerlik rozetlerimiz — footer'ın sağ alt alanında,
 * küçük ve sade (revize dökümanı: "Bu alana sertifikalarımızı ve partnerlik
 * logolarını ekleyeceğiz, sağ boş alt alana ekleyelim. Küçük ikonlar, minimal
 * gibi").
 *
 * 🔴 LİSTE BİLİNÇLİ OLARAK BOŞ. Dosyalar `public/assets/partners/` altına
 * konulunca buraya satır eklenecek ve footer'da kendiliğinden görünecek.
 * Boşken footer'daki blok hiç basılmaz.
 *
 * NEDEN OTOMATİK DOLDURULMADI: partnerlik rozeti şirket hakkında bir İDDİADIR.
 * Sahip olunmayan bir rozeti yayınlamak yanlış beyandır ve anayasadaki
 * "uydurma veri yazılmaz / doğrulanamayan alan basılmaz" kuralının kapsamına
 * girer. Yakup'un Drive'ında aday dosyalar bulundu (Google Partner, Google
 * Cloud Partner, Kommo Partner, TESİAD) ama hangilerinin gerçekten bize ait
 * olduğu teyit edilmeden basılmıyor.
 */
export const PARTNER_LOGOLARI: {
  file: string;
  name: string;
  /** Kırpılmış dosyanın GERÇEK ölçüsü. Sabit 200x80 verilince tarayıcı beş
      rozete de aynı yeri ayırıyor, dosyalar gelince şerit sağa kayıyordu
      (denetimde ölçüldü: 70px yer ayrılıyor, gerçek genişlikler 26-110px). */
  w: number;
  h: number;
}[] = [
  /*
   * Ekibin Drive klasöründen indirildi (2026-09-11, Yakup linki verdi):
   * 11 Eylül revize dökümanı → FOOTER ALANI, "sertifikalarımızı ve partnerlik
   * logolarını ekleyeceğiz, sağ boş alt alana. Küçük ikonlar, minimal gibi."
   * Beş dosya da 1920x1080 geldi, yani logonun etrafı boştu; footer'da 24-28
   * piksel yükseklikte basıldıkları için boşluk kırpıldı (aksi hâlde logo
   * görünmeyecek kadar küçülüyordu).
   * ⚠️ Bunlar BİR İDDİADIR: rozet basmak "bu kurumla resmî ortağız" demektir.
   * Listeyi ekip verdi, doğruluğu onların beyanına dayanıyor.
   */
  { file: "google-partner", name: "Google Partner" , w: 733, h: 729 },
  { file: "google-cloud-partner", name: "Google Cloud Partner" , w: 505, h: 553 },
  { file: "kommo-partner", name: "Kommo Partner" , w: 1059, h: 407 },
  { file: "teknokent", name: "Ankara Üniversitesi Teknokent" , w: 1155, h: 275 },
  { file: "teknogirisim-rozeti", name: "Teknogirişim Rozeti" , w: 1137, h: 409 },
];

/** Lacivert bant üzerindeki referans logoları (beyaz gösterim, dosya + okunur ad). */
export const REF_LOGOS = [
  { file: "airbus", name: "Airbus" },
  { file: "atasaglik", name: "Ata Sağlık" },
  { file: "bardahl", name: "Bardahl" },
  { file: "baush", name: "Bausch + Lomb" },
  { file: "bensecerim", name: "Ben Seçerim" },
  { file: "bfit", name: "bfit" },
  { file: "bni", name: "BNI" },
  { file: "crowneplaza", name: "Crowne Plaza" },
  { file: "dedebio", name: "Dedebio" },
  { file: "dentakay", name: "Dentakay" },
  { file: "dimer", name: "Dimer" },
  { file: "fairmont", name: "Fairmont Hotels" },
  { file: "hippodromecasino", name: "The Hippodrome Casino" },
  { file: "hospidatent", name: "Hospitadent" },
  { file: "inuovo", name: "Inuovo" },
  { file: "isbir", name: "İşbir" },
  { file: "konica", name: "Konica Minolta" },
  { file: "loccitane", name: "L'Occitane" },
  { file: "londonclinic", name: "The London Clinic" },
  { file: "losante", name: "Lösante Hastanesi" },
  { file: "mastercard", name: "Mastercard" },
  { file: "mediterra", name: "Mediterra" },
  { file: "mynova", name: "My Nova" },
  { file: "otopratik", name: "Otopratik" },
  { file: "premiumgym", name: "Premium Gym" },
  { file: "raymondveil", name: "Raymond Weil" },
  { file: "savron", name: "Savron" },
  { file: "savronik", name: "Savronik" },
  { file: "thelifeco", name: "TheLifeCo" },
  { file: "tyresupply", name: "Tyre Supply" },
  { file: "ugfarma", name: "UG Farma" },
  { file: "yildirim", name: "Yıldırım" },
] as const;
