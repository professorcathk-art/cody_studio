import {
  getShowcaseImageUrl,
  SHOWCASE_DESIGN_IDS,
} from "@/lib/landing-showcase";
import { ProtectedBanner } from "@/components/protected-banner";

const GENERIC_ALT = "Season cap design preview";

/** 首屏主視覺 */
export function LandingHeroBanner() {
  const src = getShowcaseImageUrl(SHOWCASE_DESIGN_IDS[0], 1400);

  return (
    <div className="relative w-full">
      <ProtectedBanner src={src} alt={GENERIC_ALT} priority aspect="hero" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5" />
    </div>
  );
}

/** 編輯式全寬 banner 列表（無編號、無標籤） */
export function LandingBannerStack({
  ids,
  startPriority = false,
}: {
  ids: readonly string[];
  startPriority?: boolean;
}) {
  return (
    <div className="flex flex-col">
      {ids.map((id, index) => {
        const isWide = index % 3 !== 1;
        const src = getShowcaseImageUrl(id, isWide ? 1200 : 900);

        return (
          <div
            key={id}
            className={
              index > 0 ? "border-t border-store-border/60" : undefined
            }
          >
            <ProtectedBanner
              src={src}
              alt={GENERIC_ALT}
              priority={startPriority && index === 0}
              aspect={isWide ? "wide" : "tall"}
              sizes="100vw"
            />
          </div>
        );
      })}
    </div>
  );
}

/** 上方 preview 帶 — 無標籤橫向 scroll */
export function LandingBannerRail() {
  const ids = SHOWCASE_DESIGN_IDS.slice(1, 5);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex snap-x snap-mandatory gap-0 overflow-x-auto scrollbar-none">
        {ids.map((id) => (
          <div
            key={id}
            className="w-[85vw] shrink-0 snap-center border-r border-store-border/40 sm:w-[45vw] lg:w-[32vw]"
          >
            <ProtectedBanner
              src={getShowcaseImageUrl(id, 960)}
              alt={GENERIC_ALT}
              aspect="wide"
              sizes="(max-width: 640px) 85vw, 32vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
