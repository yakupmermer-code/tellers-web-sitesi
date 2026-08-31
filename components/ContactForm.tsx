"use client";

import { useState } from "react";
import { SITE } from "@/content/site";

const SERVICES_OPT = [
  "Performans Pazarlama",
  "Dijital Pazarlama",
  "Markalama",
  "Kreatif Tasarım Hizmetleri",
  "Diğer",
];

const BUDGET_OPT = [
  "5.000 € altı",
  "5.000 – 15.000 €",
  "15.000 – 50.000 €",
  "50.000 € üzeri",
  "Henüz belirsiz",
];

/**
 * İletişim formu — ekip notu: "doldurulabilir bir form olduğu anlaşılmalı,
 * temanın orjinalindeki gibi ara çizgili".
 * Backend olmadığı için gönderim e-posta istemcisi üzerinden yapılır;
 * form verisi hiçbir sunucuda saklanmaz (KVKK).
 */
export default function ContactForm({
  variant = "iletisim",
}: {
  variant?: "iletisim" | "kariyer";
}) {
  const [data, setData] = useState({
    hizmet: "",
    butce: "",
    isim: "",
    email: "",
    telefon: "",
    /** Kariyer: LinkedIn / Behance / Portfolyo linki */
    link: "",
    /** Kariyer: seçilen CV dosyasının adı (dosyanın kendisi mailto ile gönderilemez) */
    cvAd: "",
    mesaj: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const isKariyer = variant === "kariyer";

  function set<K extends keyof typeof data>(key: K, value: string) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(
      isKariyer ? `Kariyer başvurusu — ${data.isim}` : `Yeni proje talebi — ${data.isim}`
    );
    const lines = isKariyer
      ? [
          `İsim: ${data.isim}`,
          `E-posta: ${data.email}`,
          `Telefon: ${data.telefon}`,
          `Başvurulan pozisyon: ${data.hizmet}`,
          `LinkedIn / Behance / Portfolyo: ${data.link || "—"}`,
          data.cvAd
            ? `CV: ${data.cvAd} — LÜTFEN BU DOSYAYI E-POSTAYA EKLEYİN`
            : "CV: eklenmedi",
          "",
          data.mesaj,
        ]
      : [
          `İsim: ${data.isim}`,
          `E-posta: ${data.email}`,
          `Telefon: ${data.telefon}`,
          `Hizmet: ${data.hizmet}`,
          `Bütçe: ${data.butce}`,
          "",
          data.mesaj,
        ];
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${encodeURIComponent(lines.join("\n"))}`;
    setSubmitted(true);
  }

  const rowCls =
    "grid gap-2 border-b border-navy/15 py-6 md:grid-cols-[220px_1fr] md:items-center";
  const labelCls = "text-[12px] uppercase tracking-[0.18em] text-navy/40";
  const inputCls =
    "w-full bg-transparent text-lg text-navy outline-none placeholder:text-navy/30";

  return (
    <form onSubmit={handleSubmit} aria-label={isKariyer ? "Başvuru formu" : "İletişim formu"}>
      <div className={rowCls}>
        <label htmlFor="cf-isim" className={labelCls}>
          Ad Soyad *
        </label>
        <input
          id="cf-isim"
          required
          value={data.isim}
          onChange={(e) => set("isim", e.target.value)}
          placeholder="Adınız Soyadınız"
          className={inputCls}
        />
      </div>
      <div className={rowCls}>
        <label htmlFor="cf-email" className={labelCls}>
          E-posta *
        </label>
        <input
          id="cf-email"
          type="email"
          required
          value={data.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="ornek@sirketiniz.com"
          className={inputCls}
        />
      </div>
      <div className={rowCls}>
        <label htmlFor="cf-telefon" className={labelCls}>
          Telefon
        </label>
        <input
          id="cf-telefon"
          type="tel"
          value={data.telefon}
          onChange={(e) => set("telefon", e.target.value)}
          placeholder="+90 ..."
          className={inputCls}
        />
      </div>
      <div className={rowCls}>
        <label htmlFor="cf-hizmet" className={labelCls}>
          {isKariyer
            ? "Başvurmak İstediğin Pozisyon *"
            : "İhtiyacınız Olan Hizmet *"}
        </label>
        {isKariyer ? (
          <input
            id="cf-hizmet"
            required
            value={data.hizmet}
            onChange={(e) => set("hizmet", e.target.value)}
            placeholder="Örn. Performans Pazarlama Uzmanı"
            className={inputCls}
          />
        ) : (
          <select
            id="cf-hizmet"
            required
            value={data.hizmet}
            onChange={(e) => set("hizmet", e.target.value)}
            className={`${inputCls} appearance-none`}
          >
            <option value="" disabled>
              Seçiniz
            </option>
            {SERVICES_OPT.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}
      </div>
      {!isKariyer && (
        <div className={rowCls}>
          <label htmlFor="cf-butce" className={labelCls}>
            Bütçe Aralığı
          </label>
          <select
            id="cf-butce"
            value={data.butce}
            onChange={(e) => set("butce", e.target.value)}
            className={`${inputCls} appearance-none`}
          >
            <option value="" disabled>
              Seçiniz
            </option>
            {BUDGET_OPT.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}
      {isKariyer && (
        <>
          <div className={rowCls}>
            <label htmlFor="cf-link" className={labelCls}>
              LinkedIn / Behance / Portfolyo Linki
            </label>
            <input
              id="cf-link"
              type="url"
              value={data.link}
              onChange={(e) => set("link", e.target.value)}
              placeholder="https://..."
              className={inputCls}
            />
          </div>
          <div className={rowCls}>
            <label htmlFor="cf-cv" className={labelCls}>
              CV Yükle
            </label>
            <div>
              <input
                id="cf-cv"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => set("cvAd", e.target.files?.[0]?.name ?? "")}
                className="w-full text-base text-navy file:mr-4 file:cursor-pointer file:rounded-full file:border file:border-navy/20 file:bg-transparent file:px-5 file:py-2 file:text-[12px] file:uppercase file:tracking-[0.18em] file:text-navy/70"
              />
              {/* Sitede backend yok: dosya sunucuya yüklenmez, başvuru
                  e-posta istemcisi üzerinden gider. Kullanıcıya açıkça söyle. */}
              <p className="mt-2 text-[12px] leading-relaxed text-navy/45">
                {data.cvAd
                  ? `“${data.cvAd}” seçildi — gönder’e bastığınızda açılan e-postaya bu dosyayı ekleyin.`
                  : "Dosyanızı seçin; açılan e-posta penceresine ek olarak eklemeniz gerekir."}
              </p>
            </div>
          </div>
        </>
      )}
      <div className={rowCls}>
        <label htmlFor="cf-mesaj" className={labelCls}>
          {isKariyer ? "Kendinden Kısaca Bahset *" : "Projenizden Bahsedin *"}
        </label>
        <textarea
          id="cf-mesaj"
          required
          rows={4}
          value={data.mesaj}
          onChange={(e) => set("mesaj", e.target.value)}
          placeholder={
            isKariyer
              ? "Deneyiminiz, portfolyonuz ve motivasyonunuz..."
              : "Hedefleriniz, zaman planınız ve beklentileriniz..."
          }
          className={`${inputCls} resize-none`}
        />
      </div>
      <button
        type="submit"
        className="group mt-10 flex items-center gap-3 rounded-full bg-navy px-8 py-4 text-sm text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98]"
      >
        {isKariyer ? "Başvurunuzu Gönderin" : "Gönderin"}
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-px group-hover:translate-x-1">
          ↗
        </span>
      </button>
      {submitted && (
        <p role="status" className="mt-6 text-sm leading-relaxed text-navy/60">
          E-posta uygulamanız açıldıysa mesajınızı oradan gönderebilirsiniz.
          Açılmadıysa bize doğrudan{" "}
          <a href={`mailto:${SITE.email}`} className="font-bold text-navy underline underline-offset-4">
            {SITE.email}
          </a>{" "}
          adresinden yazın.
        </p>
      )}
    </form>
  );
}
