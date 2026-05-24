"use client";

import { useEffect, useState } from "react";
import { DesignCard } from "./design-card";
import { StoreHeader } from "./store-header";
import { StoreHero } from "./store-hero";
import { StoreFooter } from "./store-footer";
import { DESIGN_STATUSES, type DesignStatus } from "@/lib/types";

type FilterOption = "全部" | DesignStatus;

interface DesignItem {
  id: string;
  title: string;
  image_url: string;
  status: DesignStatus;
  is_favorited: boolean;
}

interface BossHomeProps {
  userName: string;
}

export function BossHome({ userName }: BossHomeProps) {
  const [filter, setFilter] = useState<FilterOption>("全部");
  const [designs, setDesigns] = useState<DesignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoritingId, setFavoritingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      const params =
        filter !== "全部" ? `?status=${encodeURIComponent(filter)}` : "";
      const res = await fetch(`/api/designs${params}`);
      const data = await res.json();
      if (!active) return;
      setDesigns(data.designs ?? []);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [filter]);

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

  const filters: FilterOption[] = ["全部", ...DESIGN_STATUSES];
  const favoritedCount = designs.filter((d) => d.is_favorited).length;

  return (
    <div className="safe-bottom min-h-[100dvh] bg-store-bg">
      <StoreHeader userName={userName} />

      <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8">
        <StoreHero
          totalDesigns={loading ? 0 : designs.length}
          favoritedCount={favoritedCount}
        />

        <section className="mt-8 sm:mt-12">
          <div className="mb-5 flex flex-col gap-1 sm:mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-store-muted">
              Collection
            </p>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              本季設計系列
            </h2>
            <p className="text-sm text-store-muted">
              瀏覽、收藏並追蹤每一款帽型設計進度
            </p>
          </div>

          <div className="-mx-3 mb-6 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setLoading(true);
                  setFilter(f);
                }}
                className={`min-h-10 shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                  filter === f
                    ? "bg-store-accent text-white shadow-sm"
                    : "bg-white text-store-muted ring-1 ring-store-border hover:text-store-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] animate-pulse rounded-2xl bg-store-border/40"
                />
              ))}
            </div>
          ) : designs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-store-border bg-white/80 px-6 py-20 text-center">
              <span className="mb-4 text-4xl">🧢</span>
              <p className="font-medium">系列尚未上架</p>
              <p className="mt-1 text-sm text-store-muted">
                管理員上傳設計後，將在此展示您的專屬系列
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {designs.map((design) => (
                <DesignCard
                  key={design.id}
                  id={design.id}
                  title={design.title}
                  imageUrl={design.image_url}
                  status={design.status}
                  isFavorited={design.is_favorited}
                  onToggleFavorite={toggleFavorite}
                  favoriting={favoritingId === design.id}
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
