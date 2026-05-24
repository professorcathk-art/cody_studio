"use client";

import { useEffect, useState } from "react";
import { CommentsSection } from "./comments-section";
import type { Comment } from "@/lib/types";

interface DesignCommentsModalProps {
  open: boolean;
  onClose: () => void;
  designId: string;
  title: string;
}

function CommentsModalContent({ designId }: { designId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/comments?design_id=${encodeURIComponent(designId)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "載入失敗");
        if (!cancelled) setComments(data.comments ?? []);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "載入失敗");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [designId]);

  if (loading) {
    return <p className="py-8 text-center text-sm text-store-muted">載入留言中…</p>;
  }

  if (error) {
    return <p className="py-8 text-center text-sm text-red-600">{error}</p>;
  }

  return <CommentsSection designId={designId} initialComments={comments} />;
}

export function DesignCommentsModal({
  open,
  onClose,
  designId,
  title,
}: DesignCommentsModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`留言：${title}`}
      onClick={onClose}
    >
      <div
        className="flex max-h-[85dvh] w-full flex-col rounded-t-2xl bg-white shadow-xl ring-1 ring-store-border sm:max-h-[80vh] sm:max-w-lg sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-store-border px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-store-muted">
              留言
            </p>
            <h3 className="truncate text-base font-semibold">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-store-bg text-xl text-store-muted transition hover:bg-white hover:text-store-foreground"
            aria-label="關閉"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          <CommentsModalContent key={designId} designId={designId} />
        </div>
      </div>
    </div>
  );
}
