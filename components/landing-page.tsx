import { LoginForm } from "@/components/login-form";
import {
  LandingBannerRail,
  LandingBannerStack,
  LandingHeroBanner,
} from "@/components/landing-showcase";
import {
  BilingualBody,
  BilingualEyebrow,
  BilingualFeature,
  BilingualFooterLine,
  BilingualHeading,
} from "@/components/bilingual";
import { StoreLogo } from "@/components/store-brand";
import { LANDING_FEATURES, SHOWCASE_DESIGN_IDS } from "@/lib/landing-showcase";

export function LandingPage() {
  const stackAfterLogin = SHOWCASE_DESIGN_IDS.slice(5);

  return (
    <div className="safe-bottom min-h-[100dvh] bg-[#faf9f7]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-store-border/70 bg-[#faf9f7]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <StoreLogo className="h-10 w-10 shadow-sm sm:h-11 sm:w-11" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-store-muted">
                Cody Studio
              </p>
              <p className="text-sm font-semibold tracking-tight">
                Cap Store
              </p>
            </div>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-xs font-medium text-store-foreground">帽款批發設計平台</p>
            <p className="text-[10px] uppercase tracking-wider text-store-muted">
              Cap &amp; Hat Wholesale Portal
            </p>
          </div>
        </div>
      </header>

      <main>
        {/* Hero banner + intro overlay */}
        <section className="relative">
          <LandingHeroBanner />
          <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-8 sm:py-14">
            <BilingualEyebrow zh="批發設計預覽" en="Wholesale Design Preview" className="mb-5" />
            <BilingualHeading
              as="h1"
              zh="專業帽款設計批發"
              en="Cap & Hat Design for Wholesale Partners"
              className="text-3xl font-semibold leading-tight tracking-tight text-store-foreground sm:text-4xl lg:text-[2.75rem]"
              enClassName="text-lg sm:text-xl"
            />
            <BilingualBody
              className="mx-auto mt-6 max-w-2xl"
              zh="為品牌、批發商與採購團隊提供季節性帽款設計預覽。輸入組織通關密碼，進入專屬設計入口，審閱、批准與協作。"
              en="A seasonal cap design preview platform for brands, wholesalers, and buying teams. Enter your organisation passcode to access your private design portal for review, approval, and collaboration."
            />
          </div>
        </section>

        {/* Editorial rail */}
        <section className="border-y border-store-border/80 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
            <BilingualHeading
              as="h2"
              zh="本季系列"
              en="Season Collection"
              className="mb-6 text-center text-xl font-semibold tracking-tight sm:text-2xl"
              enClassName="text-sm sm:text-base"
            />
          </div>
          <LandingBannerRail />
        </section>

        {/* Passcode — page centre */}
        <section
          id="portal"
          className="relative border-b border-store-border/80 bg-[#faf9f7] px-4 py-14 sm:px-8 sm:py-20"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-store-warm/40 to-transparent" />

          <div className="mx-auto max-w-md">
            <div className="mb-8 text-center">
              <BilingualHeading
                as="h2"
                zh="進入設計入口"
                en="Enter Design Portal"
                className="text-2xl font-semibold tracking-tight sm:text-3xl"
                enClassName="text-sm sm:text-base"
              />
              <BilingualBody
                className="mt-5"
                zh="請輸入貴司專屬通關密碼，預覽完整設計系列。"
                en="Enter your organisation passcode to preview the full design collection."
              />
            </div>

            <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_24px_80px_-24px_rgba(44,40,36,0.18)] ring-1 ring-store-border sm:p-8">
              <LoginForm />
            </div>

            <p className="mt-6 text-center text-xs leading-relaxed text-store-muted">
              <span className="block">僅限授權合作夥伴使用</span>
              <span className="mt-1 block">For authorised wholesale partners only</span>
            </p>
          </div>
        </section>

        {/* Remaining editorial banners */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 text-center sm:px-8 sm:py-12">
            <BilingualHeading
              as="h2"
              zh="設計概覽"
              en="Design Overview"
              className="text-xl font-semibold tracking-tight sm:text-2xl"
              enClassName="text-sm sm:text-base"
            />
            <BilingualBody
              className="mx-auto mt-4 max-w-xl"
              zh="以下為本季帽款設計風格概覽，完整系列請登入後瀏覽。"
              en="A curated overview of this season's cap directions. Sign in to view the full collection."
            />
          </div>
          <LandingBannerStack ids={stackAfterLogin} />
        </section>

        {/* Features */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20">
          <div className="mb-10 text-center">
            <BilingualEyebrow zh="平台特色" en="Platform Highlights" className="mb-4" />
            <BilingualHeading
              as="h2"
              zh="為批發客戶而設"
              en="Built for Wholesale Buyers"
              className="text-xl font-semibold tracking-tight sm:text-2xl"
              enClassName="text-sm sm:text-base"
            />
          </div>
          <div className="grid gap-10 sm:grid-cols-3 sm:gap-6">
            {LANDING_FEATURES.map((feature) => (
              <BilingualFeature
                key={feature.titleZh}
                titleZh={feature.titleZh}
                titleEn={feature.titleEn}
                bodyZh={feature.bodyZh}
                bodyEn={feature.bodyEn}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-store-border bg-store-accent px-4 py-10 text-center text-white sm:px-8">
        <p className="text-sm font-medium tracking-wide">Cody Studio · Cap Store</p>
        <BilingualFooterLine
          className="mt-3 text-xs text-white/70"
          zh="帽款批發設計協作平台"
          en="Wholesale cap design collaboration portal"
        />
        <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-white/35">
          codycapstudio.com
        </p>
        <p className="mt-4 text-[10px] text-white/30">
          <span className="block">預覽圖片受版權保護，禁止下載與轉載</span>
          <span className="mt-1 block">Preview images are protected. Download and redistribution prohibited.</span>
        </p>
      </footer>
    </div>
  );
}
