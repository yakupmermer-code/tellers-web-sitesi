"use client";

import { useId, useState } from "react";
import { SITE } from "@/content/site";

/**
 * Footer bülten formu — backend olmadığı için e-posta istemcisine yönlendirir.
 * Bir form servisi bağlanırsa yalnızca handleSubmit değişir.
 *
 * NOT (2026-09-02): eskiden iki görünümü vardı (büyük "Gönderin" butonlu form +
 * bu dar satır). Footer yeniden kurulunca büyük görünümü kullanan tek yer
 * kalmadı; ölü dal silindi (git geçmişinde duruyor). İletişim sayfasının kendi
 * formu ayrı bir bileşen: components/ContactForm.tsx.
 */
export default function NewsletterForm() {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent("Yeni proje / iletişim talebi");
    const body = encodeURIComponent(
      `Merhaba tellers ekibi,\n\nİletişime geçmek istiyorum.\n\nE-posta: ${email}`,
    );
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="flex items-center border-b border-navy/20 transition-colors duration-500 focus-within:border-navy">
        <label htmlFor={emailId} className="sr-only">
          E-posta adresiniz
        </label>
        <input
          id={emailId}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta adresiniz"
          className="w-full bg-transparent py-3 text-[16px] outline-none placeholder:text-navy/35"
        />
        <button
          type="submit"
          aria-label="Bültene abone olun"
          className="arrow-link p-2 text-navy"
        >
          <span className="arrow text-[20px] leading-none">→</span>
        </button>
      </div>
      {submitted && (
        <p role="status" className="mt-3 text-sm leading-relaxed text-navy/60">
          E-posta uygulamanız açılmadıysa bize doğrudan{" "}
          <a
            href={`mailto:${SITE.email}`}
            className="font-bold text-navy underline underline-offset-4"
          >
            {SITE.email}
          </a>{" "}
          adresinden yazın.
        </p>
      )}
    </form>
  );
}
