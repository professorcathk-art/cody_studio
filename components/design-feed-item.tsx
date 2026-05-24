"use client";

import Image from "next/image";
import { memo, useState } from "react";
import { StatusBadge } from "./status-badge";
import { DesignImageModal } from "./design-image-modal";
import { DesignCommentsModal } from "./design-comments-modal";
import { ConfirmDialog } from "./confirm-dialog";
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
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [unapproveOpen, setUnapproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [unrejectOpen, setUnrejectOpen] = useState(false);
  const feedUrl = getFeedUrl(imageUrl);
  const isApproved = status === "已批准";
  const isRejected = status === "退稿";

  function confirmApprove() {
    onStatusChange(id, "已批准");
    setApproveOpen(false);
  }

  function confirmUnapprove() {
    onStatusChange(id, "待審批");
    setUnapproveOpen(false);
  }

  function confirmReject() {
    onStatusChange(id, "退稿");
    setRejectOpen(false);
  }

  function confirmUnreject() {
    onStatusChange(id, "待審批");
    setUnrejectOpen(false);
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

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute left-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl font-light text-store-foreground shadow-sm transition hover:bg-white sm:left-3 sm:top-3"
            aria-label="放大預覽"
          >
            +
          </button>

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

          {/* 退稿 / 撤銷退稿 */}
          <button
            type="button"
            onClick={() => (isRejected ? setUnrejectOpen(true) : setRejectOpen(true))}
            disabled={statusUpdating}
            className={`absolute bottom-2 left-2 flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition disabled:opacity-50 sm:bottom-3 sm:left-3 ${
              isRejected
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-white/90 text-red-600 ring-1 ring-red-200 hover:bg-red-50"
            }`}
            aria-label={isRejected ? "撤銷退稿" : "退稿"}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="h-5 w-5"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {/* 批准 / 撤銷批准 */}
          <button
            type="button"
            onClick={() => (isApproved ? setUnapproveOpen(true) : setApproveOpen(true))}
            disabled={statusUpdating}
            className={`absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition disabled:opacity-50 sm:bottom-3 sm:right-3 ${
              isApproved
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "bg-white/90 text-emerald-600 ring-1 ring-emerald-200 hover:bg-emerald-50"
            }`}
            aria-label={isApproved ? "撤銷批准" : "批准設計"}
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
          <button
            type="button"
            onClick={() => setCommentsOpen(true)}
            className="inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-store-bg text-sm text-store-foreground ring-1 ring-store-border transition hover:bg-white"
          >
            留言
          </button>
        </div>
      </article>

      <DesignImageModal
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        imageUrl={imageUrl}
        title={title}
      />

      <ConfirmDialog
        open={approveOpen}
        title="確認批准"
        message={`確定要批准「${title}」嗎？批准後狀態將更新為「已批准」。`}
        confirmLabel="確認批准"
        cancelLabel="取消"
        variant="success"
        loading={statusUpdating}
        onConfirm={confirmApprove}
        onCancel={() => setApproveOpen(false)}
      />

      <ConfirmDialog
        open={rejectOpen}
        title="確認退稿"
        message={`確定要退稿「${title}」嗎？退稿後將移至退稿資料夾。`}
        confirmLabel="確認退稿"
        cancelLabel="取消"
        variant="danger"
        loading={statusUpdating}
        onConfirm={confirmReject}
        onCancel={() => setRejectOpen(false)}
      />

      <ConfirmDialog
        open={unapproveOpen}
        title="撤銷批准"
        message={`確定要撤銷「${title}」的批准嗎？狀態將回到「待審批」。`}
        confirmLabel="確認撤銷"
        cancelLabel="取消"
        variant="default"
        loading={statusUpdating}
        onConfirm={confirmUnapprove}
        onCancel={() => setUnapproveOpen(false)}
      />

      <ConfirmDialog
        open={unrejectOpen}
        title="撤銷退稿"
        message={`確定要撤銷「${title}」的退稿嗎？狀態將回到「待審批」。`}
        confirmLabel="確認撤銷"
        cancelLabel="取消"
        variant="default"
        loading={statusUpdating}
        onConfirm={confirmUnreject}
        onCancel={() => setUnrejectOpen(false)}
      />

      <DesignCommentsModal
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        designId={id}
        title={title}
      />
    </>
  );
});
