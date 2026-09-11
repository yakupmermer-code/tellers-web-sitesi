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
 * REFERANS LOGOLARI: geniş ekranda görselin İÇİNE (alt boş alana) biniyor,
 * `lg` altında görselin altında bant olarak veriliyor — gerekçe aşağıda.
 */
export default function ClosingCta({
  withRefLogos = true,
}: {
  withRefLogos?: boolean;
}) {
  return (
    <>
      {/* `data-imlec-koyu`: bu bölümün zemini KOYU BİR FOTOĞRAF. Özel imleç
          zemin parlaklığını CSS'ten okuyor ve fotoğraflarda okuyamıyor — işaret
          olmadan lacivert nokta karanlık görselde kayboluyordu. */}
      <section
        aria-label="Bizimle çalışın"
        data-imlec-koyu
        className="relative"
      >
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
                {/* ⚠️ HOVER'DA KUTU DEĞİL ÇİZGİ (2026-09-10, Yakup: "görüşme
                    planlayın ve whatsapp yazın kısmında önceden üzerine gelince
                    altında çizgi oluşuyordu, onu değiştirmişsin, düzelt").
                    Burada `hover:bg-white/10` vardı — yazının arkasını hafifçe
                    aydınlatan bir DİKDÖRTGEN. Revize dökümanı bunun tam tersini
                    istiyor: "rect içine alınmayacak, temadaki örnekteki gibi
                    çizgisel olarak kullanılacak."
                    🔴 `cizgi-alt`, `link-grow` DEĞİL. `link-grow`
                    `position: relative` veriyor ve buradaki `absolute` ile
                    çakışıyor; CSS sırasında `relative` kazanıp kutuyu normal
                    akışa düşürüyor, içi boş olduğu için de 0x0'a çöküyordu.
                    Canlıda ölçüldü: genişlik 0, yükseklik 0 — yani ne çizgi
                    görünüyordu NE DE BU İKİ LİNK TIKLANABİLİYORDU.
                    `cizgi-alt` aynı çizgiyi konumlandırmaya karışmadan verir.
                    `text-white` şart — çizgi `currentColor` kullanıyor ve bu
                    alanların içinde metin yok (yazı görselin İÇİNDE basılı).
                    KUTU YAZIYA TAM OTURTULDU — yatayda da: kutular bir tur
                    %32-49 ve %51-67 idi, oysa yazılar %33,8-47,1 ve %51,8-65,4.
                    Çizgi hover'da kutunun tamamına uzadığı için 1440px'lik
                    görselde her iki yandan ~26px taşıyordu (denetimde yakalandı).
                    Dikeyde: yazı görselin %75,0-77,8 aralığında;
                    çizgi `bottom: -4px`'te bittiği için kutu da %74,5-78,5
                    yapıldı, yoksa çizgi yazıdan ~20px aşağıda havada kalıyordu. */}
                {/* 🔴 `before:` İLE GENİŞLETİLMİŞ DOKUNMA HEDEFİ (2026-09-11).
                    Kutular görsele ORANSAL oturuyor (`h-[4%]`) — 1440px'lik
                    masaüstünde ~32 piksel, ama 390 piksellik telefonda görsel
                    küçüldüğü için SADECE 9 PİKSEL kalıyordu (canlıda ölçüldü:
                    52x9). Sitenin iki ana iletişim eylemi parmakla
                    tıklanamıyordu.
                    Yüzdeyi büyütmek ÇÖZÜM DEĞİL: kutu yazıya birebir
                    oturtulmuş ve alt çizgi ona bağlı, büyütülürse çizgi
                    yazıdan kopar. `::before` görünmez bir alan ekleyerek
                    tıklanabilir bölgeyi dikeyde ±18 piksel genişletiyor
                    (telefonda ~45 piksel) — çizgi ve kutu yerinde kalıyor.
                    Yatayda genişletilmedi: iki kutu yan yana, çakışırlardı. */}
                <a
                  href={`tel:${SITE.phone}`}
                  aria-label="Görüşme planlayın — bizi arayın"
                  className="cizgi-alt absolute left-[33.8%] top-[74.5%] h-[4%] w-[13.3%] text-white before:absolute before:inset-x-0 before:-bottom-[18px] before:-top-[18px] before:content-['']"
                />
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp'tan yazın"
                  className="cizgi-alt absolute left-[51.8%] top-[74.5%] h-[4%] w-[13.6%] text-white before:absolute before:inset-x-0 before:-bottom-[18px] before:-top-[18px] before:content-['']"
                />
              </>
            )}

            {/* ── REFERANS LOGOLARI — GÖRSELİN ALT BOŞ ALANINDA ──
                Revize dökümanı (2026-09-09): "Referans logolar alt kısımda
                banner alanında verilmeyecek temadaki gibi yukarıdaki ekip
                görselinin alt boş kısmında akan slider şeklinde dönecek."

                Master temada ölçüldü: logo şeridi ekip görselinin ÜSTÜNE
                biniyor, ayrı bir bant yok. Bizim görselde de alt ~%18'lik
                bölge boş lacivert — şerit oraya oturuyor.

                KONUM `bottom-0` (2026-09-10, Yakup: "kaydığı kısımda ilgili
                alanın altına sıfır olsun... görselin ortasında kayıyor gibi,
                görselin altına hizala"). Önce `bottom-[6%]` idi ve şerit
                görselin içinde havada asılı duruyordu; artık alt kenara
                yapışıyor.

                🔴 `md:` ŞART — TELEFONDA BİNDİRME YOK. Kusur şuydu: konum
                YÜZDE (`bottom-[6%]`) ama şeridin yüksekliği PİKSEL (~40px).
                Görsel ekranla küçüldükçe 40px oransal olarak büyüyor ve şerit
                yukarı tırmanıyor. Ölçüldü: 1440px'te şerit %89,6'da (temiz),
                390px'te %79,4, 360px'te %78,2 — oysa görselin İÇİNE basılı
                "görüşme planlayın. / whatsapp'tan yazın." yazısı %75,3-78,2
                aralığında. Yani 360px'lik telefonda logolar yazının üstüne
                biniyordu (denetimde piksel piksel ölçüldü). 360px Türkiye'de
                çok yaygın bir Android genişliği.
                Ayrıca mobilde logolar oransal olarak devleşiyordu (görselin
                %11'i — masaüstünde %2,6), başlıkla aynı ağırlığa çıkıyordu.
                Çözüm: `lg`'nin altında bindirme kapalı, şerit görselin ALTINDA
                normal bant olarak veriliyor. `md` DEĞİL `lg`: 768px'te şerit
                %81'de başlıyordu, yazının bittiği %78,2'ye yalnızca 12px
                kalıyordu — pay çok inceydi. 1024px'te açıklık 35px.

                `pointer-events-none` ŞART, süs değil: şerit masaüstünde bile
                tıklama alanlarına (%73-80) yakın duruyor; mobil ölçümde tam
                içlerine giriyordu. Kaldırılırsa tel/WhatsApp linkleri ölür. */}
            {withRefLogos && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden lg:block">
                <RefLogoBand gorunum="serit" />
              </div>
            )}
          </div>
        </Reveal>
      </section>
      {/* Telefon yedeği — gerekçe yukarıdaki blokta. */}
      {withRefLogos && (
        <div className="lg:hidden">
          <RefLogoBand />
        </div>
      )}
    </>
  );
}
