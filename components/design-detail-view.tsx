"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { StatusBadge } from "./status-badge";
import { CommentsSection } from "./comments-section";
import { LogoutButton } from "./logout-button";
import { getDetailUrl } from "@/lib/images";
import type { Comment, DesignStatus } from "@/lib/types";

interface DesignDetailProps {
  design: {
    id: string;
    title: string;
    description: string;
    image_url: string;
    status: DesignStatus;
    is_favorited: boolean;
  };
  comments: Comment[];
}

export function DesignDetailView({ design, comments }: DesignDetailProps) {
  const [isFavorited, setIsFavorited] = useState(design.is_favorited);
  const [favoriting, setFavoriting] = useState(false);
  const detailUrl = getDetailUrl(design.image_url);

  async function toggleFavorite() {
    setFavoriting(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ design_id: design.id }),
      });
      const data = await res.json();
      if (res.ok) setIsFavorited(data.favorited);
    } finally {
      setFavoriting(false);
    }
  }

  return (
    <div className="safe-bottom min-h-[100dvh] bg-store-bg">
      <header className="sticky top-0 z-10 border-b border-store-border bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link
            href="/"
            className="flex min-h-11 min-w-11 items-center gap-2 text-sm text-store-muted transition hover:text-store-foreground"
          >
            <span aria-hidden>←</span>
            <span className="hidden sm:inline">返回精品店</span>
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-3 py-5 sm:px-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="relative aspect-[4/5] max-h-[70vh] w-full overflow-hidden rounded-xl bg-accent-soft ring-1 ring-border sm:max-h-none sm:rounded-2xl lg:aspect-[4/5]">
            <Image
              src={detailUrl}
              alt={design.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </div>

          <div className="flex flex-col gap-5 sm:gap-6">
            <div>
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {design.title}
                </h1>
                <StatusBadge status={design.status} />
              </div>
              {design.description && (
                <p className="text-sm leading-relaxed text-muted">
                  {design.description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={toggleFavorite}
              disabled={favoriting}
              className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium ring-1 transition disabled:opacity-50 sm:w-fit ${
                isFavorited
                  ? "bg-rose-50 text-rose-700 ring-rose-200"
                  : "bg-card text-muted ring-border hover:text-foreground"
              }`}
            >
              <span>{isFavorited ? "❤️" : "🤍"}</span>
              {isFavorited ? "已收藏" : "收藏"}
            </button>

            <div className="rounded-xl bg-card p-4 ring-1 ring-border sm:rounded-2xl sm:p-6">
              <CommentsSection
                designId={design.id}
                initialComments={comments}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
