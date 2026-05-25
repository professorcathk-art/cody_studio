import { FullBleedImage } from "@/components/home/full-bleed-image";
import { LuxuryBody, LuxuryEyebrow, LuxuryTitle } from "@/components/luxury/typography";
import { getShowcaseCoverUrl } from "@/lib/landing-showcase";

export function TrustSection() {
  const imageA = getShowcaseCoverUrl("077", 1600, 1200);
  const imageB = getShowcaseCoverUrl("078", 1600, 1200);

  return (
    <section className="bg-neutral-950 text-white">
      {/* Editorial block 1 — image full bleed */}
      <FullBleedImage
        src={imageA}
        overlay="dark"
        heightClass="h-[70vh] min-h-[480px]"
      />

      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-8 sm:py-32">
        <LuxuryEyebrow
          en="Trust & Heritage"
          zh="品牌信任與實力"
          invert
        />
        <LuxuryTitle
          en="Uncompromising Quality. Global Reach."
          zh="堅持極致工藝，服務佈局全球。"
          invert
          className="mx-auto"
        />
        <LuxuryBody
          className="mx-auto mt-12 max-w-3xl text-left sm:text-center"
          invert
          en="Backed by our dedicated R&D base and manufacturing facilities in Zhejiang, we are proud to serve as the premier partner for China's largest cap retailers. Our customized products are trusted and delivered to over 30 countries worldwide. Welcome to visit our facilities."
          zh="擁有位於浙江的專屬自家廠房與研發基地（歡迎預約參觀），我們是中國最大帽款零售商的指定合作夥伴。產品遠銷全球超過 30 個國家，為您的品牌提供最堅實的後盾。"
        />
      </div>

      {/* Editorial block 2 — offset image strip */}
      <div className="relative w-full">
        <FullBleedImage
          src={imageB}
          overlay="dark"
          heightClass="h-[55vh] min-h-[400px]"
        />
      </div>

      <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 text-center">
        {[
          { en: "30+", zh: "出口國家" },
          { en: "MOQ 1,000", zh: "批量起訂" },
          { en: "Zhejiang", zh: "浙江自有廠房" },
        ].map((stat) => (
          <div key={stat.en} className="px-4 py-12 sm:py-16">
            <p className="font-display text-2xl tracking-wide sm:text-3xl">{stat.en}</p>
            <p className="mt-2 text-xs tracking-[0.15em] text-white/50">{stat.zh}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
