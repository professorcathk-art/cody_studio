"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { StatusBadge } from "./status-badge";
import { CommentsSection } from "./comments-section";
import { LogoutButton } from "./logout-button";
import { getDetailUrl } from "@/lib/images";
import { DESIGN_STATUSES, type Comment, type DesignStatus } from "@/lib/types";

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
  const [status, setStatus] = useState(design.status);
  const [isFavorited, setIsFavorited] = useState(design.is_favorited);
  const [favoriting, setFavoriting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
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

  async function updateStatus(next: DesignStatus) {
    setStatusUpdating(true);
    try {
      const res = await fetch("/api/designs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: design.id, status: next }),
      });
      const data = await res.json();
      if (res.ok) setStatus(data.design.status);
    } finally {
      setStatusUpdating(false);
    }
  }

  return (
    <div className="safe-bottom min-h-[100dvh] bg-store-bg">
      <header className="sticky top-0 z-10 border-b border-store-border bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link
            href="/"
            className="flex min-h-11 items-center gap-2 text-sm text-store-muted transition hover:text-store-foreground"
          >
            <span aria-hidden>←</span>
            <span>返回精品店</span>
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-3 py-5 sm:px-6 sm:py-8">
        <div className="mb-4">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {design.title}
          </h1>
          {design.description && (
            <p className="mt-2 text-sm leading-relaxed text-store-muted">
              {design.description}
            </p>
          )}
        </div>

        <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#f5f5f5] ring-1 ring-store-border">
          <Image
            src={detailUrl}
            alt={design.title}
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-contain"
            priority
          />
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <StatusBadge status={status} />
          <button
            type="button"
            onClick={toggleFavorite}
            disabled={favoriting}
            className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ring-1 transition disabled:opacity-50 ${
              isFavorited
                ? "bg-rose-50 text-rose-700 ring-rose-200"
                : "bg-white text-store-muted ring-store-border hover:text-store-foreground"
            }`}
          >
            <span>{isFavorited ? "❤️" : "🤍"}</span>
            {isFavorited ? "已收藏" : "收藏"}
          </button>
        </div>

        <div className="mb-6 rounded-2xl bg-white p-4 ring-1 ring-store-border">
          <p className="mb-2 text-xs font-medium text-store-muted">更新狀態</p>
          <div className="flex flex-wrap gap-2">
            {DESIGN_STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                disabled={statusUpdating || status === s}
                onClick={() => updateStatus(s)}
                className={`min-h-10 rounded-full px-4 py-2 text-sm font-medium transition ${
                  status === s
                    ? "bg-store-accent text-white"
                    : "bg-store-bg ring-1 ring-store-border hover:bg-white disabled:opacity-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 ring-1 ring-store-border sm:p-6">
          <CommentsSection designId={design.id} initialComments={comments} />
        </div>
      </main>
    </div>
  );
}
