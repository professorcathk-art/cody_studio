import { LoginForm } from "@/components/login-form";
import { LandingShowcase } from "@/components/landing-showcase";
import { StoreLogo } from "@/components/store-brand";
import { LANDING_FEATURES } from "@/lib/landing-showcase";

export function LandingPage() {
  return (
    <div className="safe-bottom min-h-[100dvh] bg-store-bg">
      {/* Hero */}
      <header className="border-b border-store-border/80 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <StoreLogo className="h-11 w-11 shadow-md" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-store-muted">
                Cody Studio
              </p>
              <p className="text-sm font-semibold tracking-tight sm:text-base">
                Cap Store
              </p>
            </div>
          </div>
          <p className="hidden text-right text-xs text-store-muted sm:block">
            <span className="block font-medium text-store-foreground">
              帽款批發設計平台
            </span>
            Cap &amp; Hat Wholesale Portal
          </p>
        </div>
      </header>

      <main>
        {/* Intro */}
        <section className="mx-auto max-w-6xl px-4 pb-8 pt-10 text-center sm:px-6 sm:pt-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-store-warm">
            Wholesale Design Preview
          </p>
          <h1 className="mx-auto max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-store-foreground sm:text-4xl lg:text-5xl">
            專業帽款設計批發
            <span className="mt-2 block text-xl font-normal text-store-muted sm:text-2xl">
              Cap &amp; Hat Design for Wholesale Partners
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-store-muted sm:text-base">
            為品牌、批發商與採購團隊提供季節性帽款設計預覽。
            輸入組織通關密碼，即可進入專屬設計入口，審閱、批准與協作。
          </p>
        </section>

        {/* Showcase strip */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                本季設計精選
              </h2>
              <p className="text-xs uppercase tracking-wider text-store-muted">
                Season Collection · Designs 072–079
              </p>
            </div>
          </div>
          <LandingShowcase variant="strip" />
        </section>

        {/* Passcode — center of page */}
        <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-64 -translate-y-1/2 bg-gradient-to-r from-transparent via-store-warm/10 to-transparent blur-2xl" />

          <div className="mx-auto max-w-md">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                進入設計入口
              </h2>
              <p className="mt-1 text-xs uppercase tracking-wider text-store-muted">
                Enter your organisation passcode
              </p>
              <p className="mt-3 text-sm text-store-muted">
                請輸入貴司專屬通關密碼，預覽完整設計系列
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-store-border sm:p-8">
              <LoginForm />
            </div>
          </div>
        </section>

        {/* Full grid showcase */}
        <section className="border-t border-store-border bg-white/50 px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                帽款設計展示
              </h2>
              <p className="mt-1 text-xs uppercase tracking-wider text-store-muted">
                Cap design showcase for wholesale buyers
              </p>
            </div>
            <LandingShowcase variant="grid" />
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
            {LANDING_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-white p-5 ring-1 ring-store-border sm:p-6"
              >
                <h3 className="font-semibold text-store-foreground">
                  {feature.title}
                </h3>
                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-store-warm">
                  {feature.caption}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-store-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-store-border bg-store-accent px-4 py-8 text-center text-white sm:px-6">
        <p className="text-sm font-medium">Cody Studio · Cap Store</p>
        <p className="mt-1 text-xs text-white/60">
          帽款批發設計協作平台 · Wholesale cap design portal
        </p>
        <p className="mt-4 text-xs text-white/40">codycapstudio.com</p>
      </footer>
    </div>
  );
}
