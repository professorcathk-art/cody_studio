"use client";

import { useEffect, useState } from "react";
import { DesignCard } from "./design-card";
import { LogoutButton } from "./logout-button";
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

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-border bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted">
              Cody Studio
            </p>
            <h1 className="text-lg font-semibold">歡迎，{userName}</h1>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setLoading(true);
                setFilter(f);
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filter === f
                  ? "bg-accent text-white"
                  : "bg-card text-muted ring-1 ring-border hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] animate-pulse rounded-2xl bg-accent-soft"
              />
            ))}
          </div>
        ) : designs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-muted">目前沒有設計圖</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
      </main>
    </div>
  );
}
