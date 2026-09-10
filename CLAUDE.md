# Tellers Web Sitesi — Proje Anayasası

> Global anayasa: `~/.claude/CLAUDE.md` (çelişkide o esastır).

## Proje Nedir

Tellers Creative Communications ajansının kurumsal web sitesi. Arpeggio (Framer) teması
referans alınarak sıfırdan Next.js ile yazılıyor. **İçeriğin tek doğru kaynağı:** ekibin
revize dökümanı (Google Doc `1Pxl1uNXg2pnKRPSlCQXFoB0e_ihyWW3Pg3AcO0iF5OA`) — dökümanda
2492. satırdaki "BİTTİ!" işaretinden sonrası ESKİ sürümdür, dikkate alınmaz.

## Marka Kuralları (değişmez)

- Kurumsal renk: `#0a0a47` (lacivert) — turuncu/kırmızı YOK
- Font: **TEK AİLE — Avenir Next LT Pro** (2026-09-09, Yakup: "Avenir next
  olsun tüm font"). Serif vurgu fontu KALDIRILDI.
  - Hâlâ `fonts.cdnfonts.com`'dan geliyor. Ticari bir Monotype fontu; bu CDN
    bir satıcı değil. Lisans riski Yakup tarafından kabul edildi (2026-08-13).
    AÇIK KONU: web lisansı alınacak mı, ücretsiz alternatife mi geçilecek?
  - CDN'de 9 gerçek italik kesim var (sayıldı) — italik vurgular sahte eğim
    değil.
  - Serif geçmişi: Didot istenmişti, cdnfonts'taki Didot'ta gerçek italik/bold
    yoktu; Bodoni Moda denendi (self-host, SIL OFL) ve 2026-09-09'da tamamen
    kaldırıldı. `.font-didot` sınıfı 31 yerde DURUYOR ama artık gövde fontunu
    gösteriyor; serif geri istenirse `app/globals.css`'teki `--font-didot`
    satırını değiştirmek yeterli. Bodoni .woff2 dosyaları `public/fonts/`
    altında duruyor, silinmedi.
- Logo: `tellers_logo` her yerde; `tellers_icon` ("t" amblemi) SADECE favicon
- Slogan: "Duyulan unutulur, anlaşılan kalır."
- Referans logo bandı: lacivert fon, beyaz logolar, çift genişlik

## Teknik

- Next.js (App Router) + TypeScript + Tailwind + framer-motion
- İçerik data-driven: `content/` altında TS dosyaları (markalar, bloglar, hizmetler)
- Statik üretim hedefi; şimdilik lokal, deploy kararı sonra
- Görseller `public/assets/` altında anlamlı isimlerle

## Eksik İçerikler (ekipten beklenen)

- Marka tanıtım videosu (ana slider) — yerine Higgsfield geçici videosu
- Marka videosu (ana sayfa slogan bandı) — yerine `slogan-banner.png` duruyor;
  gerçek video gelince onun yerini alacak (2026-09-02'de kaldırılan "İletişim;
  anlamın dolaşımı" bölümünde de geçici bir video vardı, o tamamen çıkarıldı)
- Raymond Weil, Minousha, Qui Prive operasyon tarihleri (XXXX/????)
- **Hizmet slide videoları en az 1920 genişlikte** (`public/assets/services/*.mp4`).
  Dördü de bugün **1280x854**. Ana sayfada kart 1440x800 ve `object-cover`
  videoyu zaten 1,125x büyütüyordu; 2026-09-10'da master temanın paralaksı
  eklenince (taban ölçek 1,26) toplam büyütme **1,42x**, retina ekranda
  ~2,8x oldu. Görünür yumuşama var. Bilinçli taviz: Yakup "efekt master
  temadaki ile birebir aynı olsun" dedi, alternatif paralaksı zayıflatmaktı.
  Yeni videolar gelince ayar değiştirmeye gerek yok, kendiliğinden düzelir.

## Runtime model

Bu projede AI runtime yok (statik site) — model tanımı gerekmez.

## SEO / GEO — bilinmesi zorunlu

**Site adresi tek kaynaktan gelir:** `lib/seo.ts` → `SITE_URL`.
Öncelik: `NEXT_PUBLIC_SITE_URL` → `RAILWAY_PUBLIC_DOMAIN` → `https://tellers.email`.
Adresi hiçbir dosyaya elle yazma; `mutlak()` / `SITE_URL` kullan.

**Üç değişken de DERLEME anında okunur** (sayfalar statik). Railway'de değeri
değiştirmek tek başına yetmez — **yeniden deploy** şart. Ayrıntı: `.env.example`.

- `NEXT_PUBLIC_SITE_URL` — gerçek alan adı bağlanınca ayarlanacak. Ayarlanmazsa
  canonical'lar geçici Railway adresini gösterir (Google onu asıl sayar).
- `NEXT_PUBLIC_NOINDEX=1` — önizleme kilidi. robots.txt yine `Allow: /` der;
  bu bilinçlidir (tarama kapalıysa bot noindex etiketini göremez).

**Yapısal veri:** `lib/seo.ts` şema üreticileri + `components/JsonLd.tsx`.
Kural: şemaya **uydurma veri yazılmaz**. Doğrulanamayan alan (tescilli unvan,
kuruluş tarihi, açık pozisyon ilanı) hiç basılmaz — yanlış beyan GEO'da en
pahalı hatadır. Açık pozisyon verisi olmadan `JobPosting` şeması kullanılamaz.

**robots.txt:** yasak yollar `app/robots.ts` içindeki `YASAK_YOLLAR` dizisine
yazılır. Doğrudan `*` grubuna yazma — adı geçen 13 AI botu kendi grubunu bulunca
`*` grubunu tamamen yok sayar, yasak onlara işlemez.
