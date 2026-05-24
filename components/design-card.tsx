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
    <article className="group relative overflow-hidden rounded-2xl bg-card ring-1 ring-border shadow-sm transition hover:shadow-md">
      <Link href={`/design/${id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-accent-soft">
          <Image
            src={thumbUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-sm font-semibold tracking-tight">
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
        className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition ${
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
