"use client";

import Link from "next/link";
import Image from "next/image";
import { StatusBadge } from "./status-badge";
import { getFeedUrl } from "@/lib/images";
import { DESIGN_STATUSES, type DesignStatus } from "@/lib/types";

const QUICK_STATUSES: DesignStatus[] = ["已批准", "打版中", "生產中"];

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

export function DesignFeedItem({
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
    <article className="overflow-hidden rounded-2xl bg-white ring-1 ring-store-border shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-store-border px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-store-muted">
            Cody Studio
          </p>
          <h3 className="mt-0.5 font-semibold tracking-tight">{title}</h3>
          {description && (
            <p className="mt-1 line-clamp-2 text-sm text-store-muted">{description}</p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <StatusBadge status={status} />
          <button
            type="button"
            onClick={() => onToggleFavorite(id)}
            disabled={favoriting}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition disabled:opacity-50 ${
              isFavorited
                ? "bg-rose-50 text-rose-600 ring-1 ring-rose-200"
                : "bg-store-bg text-store-muted ring-1 ring-store-border hover:text-store-foreground"
            }`}
            aria-label={isFavorited ? "取消收藏" : "收藏"}
          >
            <span>{isFavorited ? "❤️" : "🤍"}</span>
          </button>
        </div>
      </div>

      <div className="bg-[#f3f1ee]">
        <Image
          src={feedUrl}
          alt={title}
          width={900}
          height={1200}
          sizes="(max-width: 768px) 100vw, 720px"
          className="h-auto w-full object-contain"
          style={{ width: "100%", height: "auto" }}
          priority={priority}
          loading={priority ? undefined : "lazy"}
        />
      </div>

      <div className="space-y-3 px-4 py-3">
        <div>
          <p className="mb-2 text-xs font-medium text-store-muted">快速更新狀態</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                disabled={statusUpdating || status === s}
                onClick={() => onStatusChange(id, s)}
                className={`min-h-10 rounded-full px-3 py-1.5 text-xs font-medium transition disabled:cursor-default sm:text-sm ${
                  status === s
                    ? "bg-store-accent text-white shadow-sm"
                    : "bg-store-bg text-store-foreground ring-1 ring-store-border hover:bg-white disabled:opacity-100"
                }`}
              >
                {s}
              </button>
            ))}
            {status === "待審批" && (
              <span className="flex min-h-10 items-center rounded-full bg-amber-50 px-3 text-xs text-amber-800 ring-1 ring-amber-200">
                待審批
              </span>
            )}
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
            className="inline-flex min-h-10 items-center rounded-lg bg-store-bg px-4 py-2 text-sm text-store-foreground ring-1 ring-store-border transition hover:bg-white"
          >
            留言
          </Link>
        </div>
      </div>
    </article>
  );
}
