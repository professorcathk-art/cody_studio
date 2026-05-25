import Image from "next/image";
import {
  getShowcaseImageUrl,
  SHOWCASE_DESIGN_IDS,
} from "@/lib/landing-showcase";

interface LandingShowcaseProps {
  variant?: "strip" | "grid";
}

export function LandingShowcase({ variant = "grid" }: LandingShowcaseProps) {
  if (variant === "strip") {
    return (
      <div className="relative -mx-4 overflow-hidden sm:-mx-6">
        <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-none sm:gap-4 sm:px-6">
          {SHOWCASE_DESIGN_IDS.map((id) => (
            <ShowcaseCard key={id} id={id} compact />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {SHOWCASE_DESIGN_IDS.map((id) => (
        <ShowcaseCard key={id} id={id} />
      ))}
    </div>
  );
}

function ShowcaseCard({ id, compact }: { id: string; compact?: boolean }) {
  const src = getShowcaseImageUrl(id, compact ? 480 : 640);

  return (
    <figure
      className={`group overflow-hidden rounded-2xl bg-white ring-1 ring-store-border shadow-sm ${
        compact ? "w-[72vw] max-w-[280px] shrink-0 sm:w-[240px]" : ""
      }`}
    >
      <div className="relative aspect-[16/9] bg-[#f5f5f5]">
        <Image
          src={src}
          alt={`帽款設計 ${id}`}
          fill
          sizes={
            compact
              ? "(max-width: 640px) 72vw, 240px"
              : "(max-width: 640px) 50vw, 25vw"
          }
          className="object-contain transition duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <figcaption className="flex items-center justify-between px-3 py-2">
        <span className="text-xs font-medium text-store-foreground">
          設計 {id}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-store-muted">
          Design {id}
        </span>
      </figcaption>
    </figure>
  );
}
