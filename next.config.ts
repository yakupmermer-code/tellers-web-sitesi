import type { NextConfig } from "next";

/**
 * Güvenlik başlıkları (security-auditor bulgusu, 2026-08-13).
 * DİKKAT: İleride `output: "export"` (statik export) açılırsa headers() SESSİZCE
 * çalışmaz — o durumda bu başlıklar host tarafında (Vercel/nginx) tanımlanmalı.
 */
// Dev modunda React eval() ister; production CSP'sinde ASLA unsafe-eval olmaz.
const scriptSrc =
  process.env.NODE_ENV === "development"
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
    : "script-src 'self' 'unsafe-inline'; ";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              scriptSrc +
              "style-src 'self' 'unsafe-inline' https://fonts.cdnfonts.com; " +
              "font-src 'self' https://fonts.cdnfonts.com data:; " +
              "img-src 'self' data: blob:; media-src 'self'; " +
              "connect-src 'self'; frame-ancestors 'none'; " +
              "base-uri 'self'; object-src 'none'; upgrade-insecure-requests",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
