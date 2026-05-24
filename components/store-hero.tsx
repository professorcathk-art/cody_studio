interface StoreHeroProps {
  totalDesigns: number;
  favoritedCount: number;
}

export function StoreHero({ totalDesigns, favoritedCount }: StoreHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-store-accent px-5 py-8 text-white sm:rounded-3xl sm:px-10 sm:py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl sm:h-56 sm:w-56" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-store-warm/30 blur-3xl" />

      <div className="relative max-w-xl">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide backdrop-blur-sm">
          <span>🎩</span>
          <span>專屬設計系列 · Private Collection</span>
        </p>
        <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-4xl">
          探索您的
          <br />
          帽子設計精品店
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75 sm:mt-4 sm:text-base">
          Cody Studio 為您精選每一款帽型設計，從初稿審批到打版生產，一站式追蹤您的專屬系列。
        </p>

        <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
          <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-2xl font-semibold tabular-nums">{totalDesigns}</p>
            <p className="text-xs text-white/70">款設計</p>
          </div>
          <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-2xl font-semibold tabular-nums">{favoritedCount}</p>
            <p className="text-xs text-white/70">已收藏</p>
          </div>
          <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-2xl font-semibold">✦</p>
            <p className="text-xs text-white/70">精品策展</p>
          </div>
        </div>
      </div>
    </section>
  );
}
