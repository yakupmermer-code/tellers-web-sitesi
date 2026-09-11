# Tellers Web Sitesi — Proje Anayasası

> Global anayasa: `~/.claude/CLAUDE.md` (çelişkide o esastır).

## Proje Nedir

Tellers Creative Communications ajansının kurumsal web sitesi. Arpeggio (Framer) teması
referans alınarak sıfırdan Next.js ile yazılıyor. **İçeriğin tek doğru kaynağı:** ekibin
revize dökümanı (Google Doc `1Pxl1uNXg2pnKRPSlCQXFoB0e_ihyWW3Pg3AcO0iF5OA`) — dökümanda
2492. satırdaki "BİTTİ!" işaretinden sonrası ESKİ sürümdür, dikkate alınmaz.

## Marka Kuralları (değişmez)

- Kurumsal renk: `#0a0a47` (lacivert) — turuncu/kırmızı YOK
- Font: **İKİ AİLE — Avenir Next LT Pro (gövde) + Bodoni Moda (serif vurgu)**.
  Karar iki kez döndü: 2026-09-09'da Yakup "Avenir next olsun tüm font" deyince
  serif kaldırılmıştı; **2026-09-11'de geri geldi** (Yakup: "didot sorusunu da
  dökümanda ne şekilde söylendiyse o şekilde uygula" — ekibin 11 Eylül revize
  dökümanı "Sitede metinler didot ve avenir fontunda olmalı" diyor).
  - Hâlâ `fonts.cdnfonts.com`'dan geliyor. Ticari bir Monotype fontu; bu CDN
    bir satıcı değil. Lisans riski Yakup tarafından kabul edildi (2026-08-13).
    AÇIK KONU: web lisansı alınacak mı, ücretsiz alternatife mi geçilecek?
  - CDN'de 9 gerçek italik kesim var (sayıldı) — italik vurgular sahte eğim
    değil.
  - **Serif = Bodoni Moda, gerçek "Didot" DEĞİL.** Gerçek Didot ticari bir font;
    cdnfonts'taki sürümünde gerçek italik/bold kesim yoktu (denendi). Bodoni
    Moda aynı neoklasik aileden, **SIL OFL** lisanslı ve kendi sunucumuzda
    (`public/fonts/`, 4 kesim + `OFL.txt`). Ekip "didot" derken bu görünümü
    kastediyor.
  - Tek kaynak `app/globals.css` → `--font-didot`. `.font-didot` sınıfı 31
    yerde geçiyor; yön değişirse **yalnız o bir satır** değişir, sınıflara
    dokunulmaz. (2026-09-09'da "sınıfı silme" kararı verilmişti; 2026-09-11'de
    serif geri gelince 31 yerin hiçbirine dokunmadan çalıştı.)
  - Yedek zincir bilerek `Georgia, serif` — `Didot`/`Bodoni 72` YAZILMAZ: ikisi
    de macOS'ta kurulu, zincire konursa font yüklenemediğinde hata Mac'te
    görünmez olur.
  - Ön yükleme yalnız **italik latin + latin-ext**: `ğ Ğ ş Ş İ` sadece
    latin-ext'te ve footer sloganı ("anlaşılan") her sayfada. Düz kesim üç
    yerde geçtiği için ön yüklenmiyor.
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
- ~~Raymond Weil, Minousha, Qui Prive operasyon tarihleri~~ — **TAMAMLANDI**
  (2026-09-11 doğrulandı): 17 markanın operasyon tarihi ve süresi içerik
  dökümanıyla BİREBİR tutuyor, hiçbirinde yer tutucu kalmadı.
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
