import Image from "next/image";
import RefLogoBand from "@/components/RefLogoBand";
import Reveal from "@/components/Reveal";
import { SITE, PHONE_READY } from "@/content/site";

/**
 * Sayfa bitiş imajı — ekip fotoğrafı üzerinde iki tıklanabilir alan:
 * soldaki "görüşme planlayın." → arama, sağdaki "whatsapp'tan yazın." → WhatsApp.
 * Linkler görselin İÇİNE basılı yazıların üstüne konumlanır; bu yüzden hedefleri
 * KapanisSection'daki aynı iki cümleyle birebir aynı olmak zorunda.
 * AÇIK KARAR (2026-08-15): revize dökümanı "soldaki maile" diyor ama görselde
 * "görüşme planlayın." yazıyor — çelişki Yakup'a soruldu, cevap gelene kadar
 * mevcut (tel:) davranış korunuyor.
 * Ekip notu gereği referans logo bandı bu görselin hemen altında verilir.
 */
export default function ClosingCta({
  withRefLogos = true,
}: {
  withRefLogos?: boolean;
}) {
  return (
    <>
      <section aria-label="Bizimle çalışın" className="relative">
        <Reveal>
          <div className="relative">
            <Image
              src="/assets/shared/sayfa-bitis-imaji.png"
              alt="tellers ekibi — tellers markaları dönüştürür, sırada sizin başarınız var"
              width={1920}
              height={1080}
              className="h-auto w-full"
              sizes="100vw"
            />
            {/* Görselin altındaki iki CTA metni üzerine tıklanabilir alanlar.
                Telefon/WhatsApp numarası ekipten gelene kadar linkler basılmaz
                (kırık tel: linki kullanıcıya gitmesin). */}
            {PHONE_READY && (
              <>
                <a
                  href={`tel:${SITE.phone}`}
                  aria-label="Görüşme planlayın — bizi arayın"
                  className="absolute bottom-[14%] left-[30%] h-[10%] w-[18%] rounded-full transition-colors duration-500 hover:bg-white/10"
                />
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp'tan yazın"
                  className="absolute bottom-[14%] right-[30%] h-[10%] w-[18%] rounded-full transition-colors duration-500 hover:bg-white/10"
                />
              </>
            )}
          </div>
        </Reveal>
      </section>
      {withRefLogos && <RefLogoBand />}
    </>
  );
}
