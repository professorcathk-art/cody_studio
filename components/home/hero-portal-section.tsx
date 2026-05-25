import { LoginForm } from "@/components/login-form";
import { FullBleedImage } from "@/components/home/full-bleed-image";
import { LuxuryEyebrow, LuxurySubtitle, LuxuryTitle } from "@/components/luxury/typography";
import { getShowcaseCoverUrl } from "@/lib/landing-showcase";

export function HeroPortalSection() {
  const heroSrc = getShowcaseCoverUrl("076", 1920, 1080);

  return (
    <section id="portal" className="relative h-screen w-full">
      <FullBleedImage
        src={heroSrc}
        priority
        overlay="dark"
        heightClass="h-screen min-h-[100dvh]"
      />

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 py-16 sm:px-8">
        <div className="mb-10 max-w-3xl text-center">
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
            className="mx-auto mt-8 max-w-xl"
            invert
            en="Enter your organisation passcode to access your exclusive design portfolio."
            zh="請輸入專屬通關密碼，進入您的企業設計專區。"
          />
        </div>

        <div className="w-full max-w-md">
          <div className="rounded-sm border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
            <p className="mb-6 text-center">
              <span className="font-display block text-lg tracking-wide text-white">
                Client Design Portal
              </span>
              <span className="mt-1 block text-xs tracking-[0.15em] text-white/60">
                客戶專屬設計入口
              </span>
            </p>
            <LoginForm variant="luxury" />
          </div>
          <p className="mt-6 text-center text-[10px] leading-relaxed tracking-wide text-white/45">
            <span className="block">僅限授權合作夥伴 · Authorised partners only</span>
          </p>
        </div>
      </div>
    </section>
  );
}
