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
                {/* Konumlar görselin İÇİNE basılı yazılara göre ölçüldü
                    (sayfa_bitiş_imajı.png 1920x1080, 2. döküman sürümü):
                    "görüşme planlayın."  x %33.8-47.1 · y %75.0-77.8
                    "whatsapp'tan yazın." x %51.8-65.4 · y %75.0-77.8
                    Görsel değişirse bu yüzdeler yeniden ölçülmeli. */}
                <a
                  href={`tel:${SITE.phone}`}
                  aria-label="Görüşme planlayın — bizi arayın"
                  className="absolute left-[32%] top-[73%] h-[7%] w-[17%] rounded-full transition-colors duration-500 hover:bg-white/10"
                />
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp'tan yazın"
                  className="absolute left-[51%] top-[73%] h-[7%] w-[16%] rounded-full transition-colors duration-500 hover:bg-white/10"
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
