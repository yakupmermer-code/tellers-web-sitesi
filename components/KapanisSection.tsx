import RefLogoBand from "@/components/RefLogoBand";
import Reveal from "@/components/Reveal";
import { SITE, PHONE_READY } from "@/content/site";

/**
 * "Duyulan unutulur, anlaşılan kalır." kapanış alanı (ekibin 6.png tasarımının
 * metin karşılığı) — iki CTA: görüşme planlayın (tel) / whatsapp'tan yazın.
 * Marka detay sayfalarında withRefLogos=false (ekip notu: banner verilmeyecek).
 */
export default function KapanisSection({
  withRefLogos = true,
}: {
  withRefLogos?: boolean;
}) {
  return (
    <>
      <section className="bg-paper py-28 md:py-40">
        <div className="mx-auto max-w-[1100px] px-5 text-center md:px-10">
          <Reveal mask>
            <h2 className="text-4xl font-bold leading-[1.08] tracking-tight text-navy md:text-[112px]">
              Duyulan unutulur,{" "}
              <em className="font-didot font-normal italic">anlaşılan</em>{" "}
              kalır.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-navy/60 md:text-lg">
              Sorularınız, işbirlikleri ve yeni projeler için proje
              koordinatörlerimiz ile birebir görüşme sağlayabilirsiniz.
            </p>
            <div className="mt-10 flex items-center justify-center gap-10">
              {PHONE_READY ? (
                <>
                  <a
                    href={`tel:${SITE.phone}`}
                    className="link-grow text-sm font-bold text-navy"
                  >
                    görüşme planlayın.
                  </a>
                  <a
                    href={SITE.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-grow text-sm font-bold text-navy"
                  >
                    whatsapp&apos;tan yazın.
                  </a>
                </>
              ) : (
                /* Numara gelene kadar tıklanabilir olmayan tek CTA: e-posta */
                <a
                  href={`mailto:${SITE.email}`}
                  className="link-grow text-sm font-bold text-navy"
                >
                  bize yazın: {SITE.email}
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </section>
      {withRefLogos && <RefLogoBand />}
    </>
  );
}
