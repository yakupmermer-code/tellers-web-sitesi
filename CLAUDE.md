# Tellers Web Sitesi — Proje Anayasası

> Global anayasa: `~/.claude/CLAUDE.md` (çelişkide o esastır).

## Proje Nedir

Tellers Creative Communications ajansının kurumsal web sitesi. Arpeggio (Framer) teması
referans alınarak sıfırdan Next.js ile yazılıyor. **İçeriğin tek doğru kaynağı:** ekibin
revize dökümanı (Google Doc `1Pxl1uNXg2pnKRPSlCQXFoB0e_ihyWW3Pg3AcO0iF5OA`) — dökümanda
2492. satırdaki "BİTTİ!" işaretinden sonrası ESKİ sürümdür, dikkate alınmaz.

## Marka Kuralları (değişmez)

- Kurumsal renk: `#0a0a47` (lacivert) — turuncu/kırmızı YOK
- Fontlar: Avenir Next (gövde/kurumsal) + Didot (serif vurgu) — CDN'den (lisans riski
  Yakup tarafından kabul edildi, 2026-08-13)
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
- Raymond Weil, Minousha, Qui Prive operasyon tarihleri (XXXX/????)

## Runtime model

Bu projede AI runtime yok (statik site) — model tanımı gerekmez.
