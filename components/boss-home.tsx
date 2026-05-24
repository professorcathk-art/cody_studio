"use client";

import { useMemo, useState } from "react";
import { DesignFeedItem } from "./design-feed-item";
import { StoreHeader } from "./store-header";
import { StoreHero } from "./store-hero";
import { StoreFooter } from "./store-footer";
import { DESIGN_STATUSES, type DesignStatus } from "@/lib/types";
import type { BossDesignItem } from "@/lib/designs";

type StatusFilter = "全部" | DesignStatus;

interface BossHomeProps {
  userName: string;
  initialDesigns: BossDesignItem[];
}

export function BossHome({ userName, initialDesigns }: BossHomeProps) {
  const [designs, setDesigns] = useState(initialDesigns);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("全部");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favoritingId, setFavoritingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const visibleDesigns = useMemo(() => {
    return designs.filter((d) => {
      if (favoritesOnly && !d.is_favorited) return false;
      if (statusFilter !== "全部" && d.status !== statusFilter) return false;
      return true;
    });
  }, [designs, statusFilter, favoritesOnly]);

  const favoritedCount = designs.filter((d) => d.is_favorited).length;

  async function toggleFavorite(designId: string) {
    setFavoritingId(designId);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ design_id: designId }),
      });
      const data = await res.json();
      if (res.ok) {
        setDesigns((prev) =>
          prev.map((d) =>
            d.id === designId ? { ...d, is_favorited: data.favorited } : d
          )
        );
      }
    } finally {
      setFavoritingId(null);
    }
  }

  async function updateStatus(designId: string, status: DesignStatus) {
    setUpdatingId(designId);
    try {
      const res = await fetch("/api/designs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: designId, status }),
      });
      const data = await res.json();
      if (res.ok) {
        setDesigns((prev) =>
          prev.map((d) =>
            d.id === designId ? { ...d, status: data.design.status } : d
          )
        );
      }
    } finally {
      setUpdatingId(null);
    }
  }

  const statusFilters: StatusFilter[] = ["全部", ...DESIGN_STATUSES];

  return (
    <div className="safe-bottom min-h-[100dvh] bg-store-bg">
      <StoreHeader userName={userName} />

      <main className="mx-auto max-w-6xl px-3 py-5 sm:px-6 sm:py-8">
        <StoreHero totalDesigns={designs.length} favoritedCount={favoritedCount} />

        <section className="mt-8 sm:mt-12">
          <div className="mb-5 flex flex-col gap-1 sm:mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-store-muted">
              Collection
            </p>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              本季設計系列
            </h2>
            <p className="text-sm text-store-muted">
              向下捲動即可預覽完整設計圖，無需點進詳情頁
            </p>
          </div>

          <div className="-mx-3 mb-4 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:px-0">
            <button
              type="button"
              onClick={() => setFavoritesOnly((v) => !v)}
              className={`min-h-10 shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                favoritesOnly
                  ? "bg-rose-500 text-white shadow-sm"
                  : "bg-white text-store-muted ring-1 ring-store-border hover:text-store-foreground"
              }`}
            >
              ❤️ 收藏{favoritedCount > 0 ? ` (${favoritedCount})` : ""}
            </button>
          </div>

          <div className="-mx-3 mb-6 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            {statusFilters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setStatusFilter(f)}
                className={`min-h-10 shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                  statusFilter === f
                    ? "bg-store-accent text-white shadow-sm"
                    : "bg-white text-store-muted ring-1 ring-store-border hover:text-store-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {visibleDesigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-store-border bg-white/80 px-6 py-20 text-center">
              <span className="mb-4 text-4xl">{favoritesOnly ? "🤍" : "🧢"}</span>
              <p className="font-medium">
                {favoritesOnly ? "尚無收藏的設計" : "沒有符合條件的設計"}
              </p>
              <p className="mt-1 text-sm text-store-muted">
                {favoritesOnly
                  ? "點擊設計圖上的愛心即可加入收藏"
                  : "試試其他篩選條件"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4 lg:gap-6">
              {visibleDesigns.map((design, index) => (
                <DesignFeedItem
                  key={design.id}
                  id={design.id}
                  title={design.title}
                  description={design.description}
                  imageUrl={design.image_url}
                  status={design.status}
                  isFavorited={design.is_favorited}
                  priority={index < 2}
                  onToggleFavorite={toggleFavorite}
                  onStatusChange={updateStatus}
                  favoriting={favoritingId === design.id}
                  statusUpdating={updatingId === design.id}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
