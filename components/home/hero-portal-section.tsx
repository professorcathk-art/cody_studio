import Image from "next/image";
import { LoginForm } from "@/components/login-form";
import { LuxurySubtitle, LuxuryTitle } from "@/components/luxury/typography";
import { getShowcaseCoverUrl, HERO_DESIGN_ID } from "@/lib/landing-showcase";

export function HeroPortalSection() {
  const heroSrc = getShowcaseCoverUrl(HERO_DESIGN_ID, 1920, 1080);

  return (
    <section id="portal" className="grid w-full">
      {/* Layer 1 — full-bleed background photo + dark scrim */}
      <div className="relative col-start-1 row-start-1 min-h-[100dvh] w-full overflow-hidden bg-neutral-900">
        <Image
          src={heroSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          draggable={false}
          className="object-cover object-[72%_center] sm:object-[68%_center] md:object-center"
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden />
      </div>

      {/* Layer 2 — text + passcode portal (same grid cell, stacked on photo) */}
      <div className="relative z-10 col-start-1 row-start-1 flex min-h-[100dvh] w-full flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 w-full max-w-3xl text-center sm:mb-10">
          <LuxuryTitle
            as="h1"
            en="Cody Cap Studio"
            zh="Premium OEM/ODM Cap Solutions"
            invert
            className="mx-auto"
          />
          <LuxurySubtitle
            className="mx-auto mt-6 max-w-xl sm:mt-8"
            invert
            en="Enter your organisation passcode to access your exclusive design portfolio."
            zh="請輸入專屬密碼，進入您的企業設計專區。"
          />
        </div>

        <div className="w-full max-w-[min(100%,28rem)]">
          <div className="rounded-sm border border-white/25 bg-black/45 p-6 shadow-2xl backdrop-blur-md sm:p-8 lg:p-10">
            <p className="mb-5 text-center sm:mb-6">
              <span className="font-display block text-base tracking-wide text-white sm:text-lg">
                Existing Clients Enter Here
              </span>
              <span className="mt-1 block text-xs tracking-[0.12em] text-white/70 sm:text-sm">
                現有企業客戶由此進入
              </span>
            </p>
            <LoginForm variant="luxury" />
          </div>
          <p className="mt-5 text-center text-[10px] leading-relaxed tracking-wide text-white/60 sm:mt-6">
            <span className="block">僅限授權合作夥伴 · Authorised partners only</span>
          </p>
        </div>
      </div>
    </section>
  );
}
