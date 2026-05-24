"use client";

import Link from "next/link";
import Image from "next/image";
import { memo, useState } from "react";
import { StatusBadge } from "./status-badge";
import { DesignImageModal } from "./design-image-modal";
import { getFeedUrl } from "@/lib/images";
import type { DesignStatus } from "@/lib/types";

interface DesignFeedItemProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status: DesignStatus;
  isFavorited: boolean;
  priority?: boolean;
  onToggleFavorite: (id: string) => void;
  onStatusChange: (id: string, status: DesignStatus) => void;
  favoriting?: boolean;
  statusUpdating?: boolean;
}

export const DesignFeedItem = memo(function DesignFeedItem({
  id,
  title,
  description,
  imageUrl,
  status,
  isFavorited,
  priority,
  onToggleFavorite,
  onStatusChange,
  favoriting,
  statusUpdating,
}: DesignFeedItemProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const feedUrl = getFeedUrl(imageUrl);
  const isApproved = status === "已批准";

  function handleApprove() {
    if (!isApproved && !statusUpdating) {
      onStatusChange(id, "已批准");
    }
  }

  return (
    <>
      <article className="overflow-hidden rounded-2xl bg-white ring-1 ring-store-border shadow-sm [content-visibility:auto] [contain-intrinsic-size:0_320px]">
        <div className="flex items-start justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-store-muted">
              Cody Studio
            </p>
            <h3 className="mt-0.5 truncate text-sm font-semibold tracking-tight sm:text-base">
              {title}
            </h3>
            {description && (
              <p className="mt-0.5 line-clamp-1 text-xs text-store-muted sm:line-clamp-2 sm:text-sm">
                {description}
              </p>
            )}
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="relative aspect-[16/9] w-full bg-[#f5f5f5]">
          <Image
            src={feedUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            priority={priority}
            loading={priority ? undefined : "lazy"}
          />

          {/* 放大 */}
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute left-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl font-light text-store-foreground shadow-sm transition hover:bg-white sm:left-3 sm:top-3"
            aria-label="放大預覽"
          >
            +
          </button>

          {/* 收藏 */}
          <button
            type="button"
            onClick={() => onToggleFavorite(id)}
            disabled={favoriting}
            className={`absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition disabled:opacity-50 sm:right-3 sm:top-3 ${
              isFavorited
                ? "bg-rose-500/90 text-white shadow-sm"
                : "bg-white/90 text-zinc-600 shadow-sm hover:bg-white"
            }`}
            aria-label={isFavorited ? "取消收藏" : "收藏"}
          >
            <span className="text-base">{isFavorited ? "❤️" : "🤍"}</span>
          </button>

          {/* 批准 */}
          <button
            type="button"
            onClick={handleApprove}
            disabled={statusUpdating || isApproved}
            className={`absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition disabled:cursor-default sm:bottom-3 sm:right-3 ${
              isApproved
                ? "bg-emerald-500 text-white"
                : "bg-white/90 text-emerald-600 ring-1 ring-emerald-200 hover:bg-emerald-50"
            } disabled:opacity-100`}
            aria-label={isApproved ? "已批准" : "批准設計"}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>

        <div className="border-t border-store-border px-3 py-2.5 sm:px-4 sm:py-3">
          <Link
            href={`/design/${id}`}
            className="inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-store-bg text-sm text-store-foreground ring-1 ring-store-border transition hover:bg-white"
          >
            留言
          </Link>
        </div>
      </article>

      <DesignImageModal
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        imageUrl={imageUrl}
        title={title}
      />
    </>
  );
});
