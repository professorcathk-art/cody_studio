import { LuxuryEyebrow, LuxuryTitle } from "@/components/luxury/typography";

const STEPS = [
  {
    step: "01",
    en: "Design & Concept",
    zh: "專屬概念設計",
    descEn: "Bespoke cap concepts tailored to your brand DNA and market positioning.",
    descZh: "依品牌定位量身打造專屬帽款概念與系列方向。",
  },
  {
    step: "02",
    en: "Confirmation & Quotation",
    zh: "方案與報價確認",
    descEn: "Refined proposals with transparent pricing and material specifications.",
    descZh: "精準方案與透明報價，確認材質、工藝與交期細節。",
  },
  {
    step: "03",
    en: "Prototyping (Demo)",
    zh: "精密樣品打版",
    descEn: "Precision sampling to validate fit, finish, and brand execution.",
    descZh: "精密打版驗證版型、工藝與品牌呈現效果。",
  },
  {
    step: "04",
    en: "Mass Production & Delivery",
    zh: "批量生產與交付",
    descEn: "Scalable manufacturing with rigorous QC. MOQ: 1,000 units.",
    descZh: "嚴格品管批量生產，穩定交付全球。MOQ：1,000 頂。",
  },
] as const;

export function ProcessSection() {
  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-3xl lg:mb-20">
          <LuxuryEyebrow en="End-to-End Process" zh="一站式服務流程" />
          <LuxuryTitle
            en="From Concept to Global Delivery"
            zh="從概念到全球交付的一站式服務"
          />
        </div>

        <div className="grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => (
            <article
              key={item.step}
              className="flex flex-col bg-white px-6 py-10 sm:px-8 sm:py-12"
            >
              <span className="font-display text-4xl text-neutral-200">
                {item.step}
              </span>
              <h3 className="mt-6">
                <span className="font-display block text-xl tracking-wide text-neutral-950">
                  {item.en}
                </span>
                <span className="mt-2 block text-sm tracking-wide text-neutral-500">
                  {item.zh}
                </span>
              </h3>
              <p className="mt-6 text-sm leading-relaxed text-neutral-600">
                {item.descEn}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-neutral-400">
                {item.descZh}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
