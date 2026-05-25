import { LoginForm } from "@/components/login-form";
import { FullBleedImage } from "@/components/home/full-bleed-image";
import { LuxuryEyebrow, LuxurySubtitle, LuxuryTitle } from "@/components/luxury/typography";
import { getShowcaseCoverUrl, HERO_DESIGN_ID } from "@/lib/landing-showcase";

export function HeroPortalSection() {
  const heroSrc = getShowcaseCoverUrl(HERO_DESIGN_ID, 1920, 1080);

  return (
    <section id="portal" className="relative min-h-[100dvh] w-full">
      <FullBleedImage
        src={heroSrc}
        priority
        overlay="dark"
        heightClass="absolute inset-0 h-full min-h-[100dvh]"
        focusRightOnMobile
      />

      <div className="relative z-20 flex min-h-[100dvh] flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 w-full max-w-3xl text-center sm:mb-10">
          <LuxuryEyebrow
            en="Client Design Portal"
            zh="客戶專屬設計入口"
            invert
          />
          <LuxuryTitle
            as="h1"
            en="Premium OEM/ODM Cap Solutions"
            zh="頂級帽款設計與製造解決方案"
            invert
            className="mx-auto"
          />
          <LuxurySubtitle
            className="mx-auto mt-6 max-w-xl sm:mt-8"
            invert
            en="Enter your organisation passcode to access your exclusive design portfolio."
            zh="請輸入專屬通關密碼，進入您的企業設計專區。"
          />
        </div>

        <div className="w-full max-w-[min(100%,28rem)]">
          <div className="rounded-sm border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10">
            <p className="mb-5 text-center sm:mb-6">
              <span className="font-display block text-base tracking-wide text-white sm:text-lg">
                Client Design Portal
              </span>
              <span className="mt-1 block text-[10px] tracking-[0.15em] text-white/60 sm:text-xs">
                客戶專屬設計入口
              </span>
            </p>
            <LoginForm variant="luxury" />
          </div>
          <p className="mt-5 text-center text-[10px] leading-relaxed tracking-wide text-white/45 sm:mt-6">
            <span className="block">僅限授權合作夥伴 · Authorised partners only</span>
          </p>
        </div>
      </div>
    </section>
  );
}
