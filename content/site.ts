export const SITE = {
  name: "tellers",
  title: "tellers | Creative Communications",
  slogan: "Duyulan unutulur, anlaşılan kalır.",
  description:
    "7 yılda, 3 kıta ve 15 ülkede; markaların yalnızca duyulmasını değil gerçekten anlaşılmasını sağlayan anlam mimarisi ajansı.",
  email: "hello@tellers.email",
  instagram: "https://www.instagram.com/tellersturkiye/",
  linkedin: "https://www.linkedin.com/company/v-v-creative-communication-agency/",
  // TODO: Telefon ve WhatsApp numarası ekipten gelecek — gelince tek yerden güncellenir.
  phone: "+90XXXXXXXXXX",
  whatsapp: "https://wa.me/90XXXXXXXXXX",
} as const;

/** Numara henüz placeholder ise tel/WhatsApp linkleri basılmaz (kırık link gitmesin). */
export const PHONE_READY = !SITE.phone.includes("X");

export const NAV = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Portfolyo", href: "/portfolyo" },
  { label: "Hizmetlerimiz", href: "/hizmetlerimiz" },
  { label: "Blog", href: "/blog" },
  { label: "Kariyer", href: "/kariyer" },
  { label: "İletişim", href: "/iletisim" },
] as const;

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
