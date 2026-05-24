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
    <div className="min-h-screen">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="text-sm text-muted transition hover:text-foreground"
          >
            ← 返回列表
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-accent-soft ring-1 ring-border">
            <Image
              src={detailUrl}
              alt={design.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">
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
              className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ring-1 transition disabled:opacity-50 ${
                isFavorited
                  ? "bg-rose-50 text-rose-700 ring-rose-200"
                  : "bg-card text-muted ring-border hover:text-foreground"
              }`}
            >
              <span>{isFavorited ? "❤️" : "🤍"}</span>
              {isFavorited ? "已收藏" : "收藏"}
            </button>

            <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
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
