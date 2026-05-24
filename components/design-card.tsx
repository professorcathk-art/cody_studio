"use client";

import Link from "next/link";
import Image from "next/image";
import { StatusBadge } from "./status-badge";
import { getThumbnailUrl } from "@/lib/images";
import type { DesignStatus } from "@/lib/types";

interface DesignCardProps {
  id: string;
  title: string;
  imageUrl: string;
  status: DesignStatus;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
  favoriting?: boolean;
}

export function DesignCard({
  id,
  title,
  imageUrl,
  status,
  isFavorited,
  onToggleFavorite,
  favoriting,
}: DesignCardProps) {
  const thumbUrl = getThumbnailUrl(imageUrl);

  return (
    <article className="group relative overflow-hidden rounded-xl bg-white ring-1 ring-store-border shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:rounded-2xl">
      <Link href={`/design/${id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-store-bg">
          <Image
            src={thumbUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-store-foreground opacity-0 shadow-sm transition group-hover:opacity-100">
            查看設計
          </span>
        </div>
        <div className="p-3 sm:p-4">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-store-muted">
            Cody Studio
          </p>
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
            <h3 className="line-clamp-2 text-xs font-semibold tracking-tight sm:text-sm">
              {title}
            </h3>
            <StatusBadge status={status} />
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onToggleFavorite(id);
        }}
        disabled={favoriting}
        className={`absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition sm:right-3 sm:top-3 sm:h-9 sm:w-9 ${
          isFavorited
            ? "bg-rose-500/90 text-white shadow-sm"
            : "bg-white/90 text-zinc-600 shadow-sm hover:bg-white"
        } disabled:opacity-50`}
        aria-label={isFavorited ? "取消收藏" : "收藏"}
      >
        <span className="text-base">{isFavorited ? "❤️" : "🤍"}</span>
      </button>
    </article>
  );
}
