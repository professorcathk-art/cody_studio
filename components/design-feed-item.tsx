"use client";

import Link from "next/link";
import Image from "next/image";
import { memo } from "react";
import { StatusBadge } from "./status-badge";
import { getFeedUrl } from "@/lib/images";
import { DESIGN_STATUSES, type DesignStatus } from "@/lib/types";

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
  const feedUrl = getFeedUrl(imageUrl);

  return (
    <article
      className="overflow-hidden rounded-2xl bg-white ring-1 ring-store-border shadow-sm [content-visibility:auto] [contain-intrinsic-size:0_420px]"
    >
      {/* 標題列 */}
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

      {/* 16:9 畫布 — 完整顯示、不裁切 */}
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
      </div>

      {/* 快速更新狀態 — 緊接 16:9 畫布下方 */}
      <div className="space-y-3 px-3 py-3 sm:px-4 sm:py-4">
        <div>
          <p className="mb-2 text-xs font-medium text-store-muted">快速更新狀態</p>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {DESIGN_STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                disabled={statusUpdating || status === s}
                onClick={() => onStatusChange(id, s)}
                className={`min-h-10 rounded-full px-3 py-2 text-xs font-medium transition disabled:cursor-default sm:text-sm ${
                  status === s
                    ? "bg-store-accent text-white shadow-sm"
                    : "bg-[#f5f5f5] text-store-foreground ring-1 ring-store-border hover:bg-white disabled:opacity-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-store-border pt-3">
          <select
            value={status}
            disabled={statusUpdating}
            onChange={(e) => onStatusChange(id, e.target.value as DesignStatus)}
            className="min-h-10 flex-1 rounded-lg border border-store-border bg-white px-3 py-2 text-sm sm:flex-none"
          >
            {DESIGN_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Link
            href={`/design/${id}`}
            className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg bg-store-bg px-4 py-2 text-sm text-store-foreground ring-1 ring-store-border transition hover:bg-white sm:flex-none"
          >
            留言
          </Link>
        </div>
      </div>
    </article>
  );
});
