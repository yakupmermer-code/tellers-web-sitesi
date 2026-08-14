"use client";

import { useState } from "react";
import { SITE } from "@/content/site";

/**
 * Newsletter alanı — backend olmadığı için e-posta istemcisine yönlendirir.
 * İleride bir form servisi bağlanırsa yalnızca handleSubmit değişir.
 */
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent("Yeni proje / iletişim talebi");
    const body = encodeURIComponent(
      `Merhaba tellers ekibi,\n\nİletişime geçmek istiyorum.\n\nE-posta: ${email}`
    );
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center gap-4">
      <label
        htmlFor="newsletter-email"
        className="text-[11px] uppercase tracking-[0.2em] text-navy/40"
      >
        E-posta adresiniz
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ornek@sirketiniz.com"
          className="w-full border-b border-navy/20 bg-transparent py-3 text-lg outline-none transition-colors duration-500 placeholder:text-navy/30 focus:border-navy"
        />
        <button
          type="submit"
          className="group flex w-max items-center gap-3 rounded-full bg-navy px-6 py-3 text-sm text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
        >
          Gönderin
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-px group-hover:translate-x-1">
            ↗
          </span>
        </button>
      </div>
      {submitted && (
        <p role="status" className="text-sm leading-relaxed text-navy/60">
          E-posta uygulamanız açılmadıysa bize doğrudan{" "}
          <a href={`mailto:${SITE.email}`} className="font-bold text-navy underline underline-offset-4">
            {SITE.email}
          </a>{" "}
          adresinden yazın.
        </p>
      )}
    </form>
  );
}
