# Tellers Web Sitesi — Proje Anayasası

> Global anayasa: `~/.claude/CLAUDE.md` (çelişkide o esastır).

## Proje Nedir

Tellers Creative Communications ajansının kurumsal web sitesi. Arpeggio (Framer) teması
referans alınarak sıfırdan Next.js ile yazılıyor. **İçeriğin tek doğru kaynağı:** ekibin
revize dökümanı (Google Doc `1Pxl1uNXg2pnKRPSlCQXFoB0e_ihyWW3Pg3AcO0iF5OA`) — dökümanda
2492. satırdaki "BİTTİ!" işaretinden sonrası ESKİ sürümdür, dikkate alınmaz.

## Marka Kuralları (değişmez)

- Kurumsal renk: `#0a0a47` (lacivert) — turuncu/kırmızı YOK
- Fontlar: Avenir Next (gövde/kurumsal) + serif vurgu fontu
  - **Avenir Next** — hâlâ `fonts.cdnfonts.com`'dan. Ticari bir Monotype fontu;
    bu CDN bir satıcı değil. Lisans riski Yakup tarafından kabul edildi
    (2026-08-13). AÇIK KONU: web lisansı alınacak mı, yoksa ücretsiz bir
    alternatife mi geçilecek?
  - **Serif vurgu — DENEME AŞAMASINDA (2026-08-31, art direktör onayı bekliyor):**
    Didot yerine **Bodoni Moda** kuruldu, `public/fonts/` altında self-host,
    SIL OFL. Gerekçe: revize dökümanı "Didot Italic (Bold)" istiyor ama
    cdnfonts'taki Didot yalnızca weight:400/style:normal sunuyordu — tüm
    italik ve boldlar tarayıcının uydurduğu sahte kesimlerdi (doğrulandı).
    Bodoni Moda gerçek italik + 400-900 aralık sunar.
    Onaylanmazsa geri alınır; onaylanırsa bu satır sadeleştirilecek.
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
