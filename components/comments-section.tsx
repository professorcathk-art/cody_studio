"use client";

import { useState } from "react";
import type { Comment, UserRole } from "@/lib/types";

interface CommentsSectionProps {
  designId: string;
  initialComments: Comment[];
  canComment?: boolean;
}

export function CommentsSection({
  designId,
  initialComments,
  canComment = true,
}: CommentsSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ design_id: designId, content }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "送出失敗");
        return;
      }

      setComments((prev) => [...prev, data.comment]);
      setContent("");
    } catch {
      setError("連線失敗");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
        評論紀錄
      </h3>

      <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <p className="text-sm text-muted">尚無評論</p>
        ) : (
          comments.map((c) => (
            <CommentItem key={c.id} comment={c} />
          ))
        )}
      </div>

      {canComment && (
        <form onSubmit={handleSubmit} className="space-y-3 border-t border-border pt-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="輸入您的留言…"
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm shadow-sm"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={!content.trim() || loading}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)] disabled:opacity-40"
          >
            {loading ? "送出中…" : "送出"}
          </button>
        </form>
      )}
    </div>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  const roleLabel: Record<UserRole, string> = {
    admin: "管理員",
    boss: "老闆",
  };

  const date = new Date(comment.created_at).toLocaleString("zh-TW", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-xl bg-accent-soft px-4 py-3">
      <div className="mb-1 flex items-center gap-2 text-xs text-muted">
        <span className="font-medium text-foreground">{comment.author_name}</span>
        <span className="rounded bg-white px-1.5 py-0.5 ring-1 ring-border">
          {roleLabel[comment.role]}
        </span>
        <span>{date}</span>
      </div>
      <p className="text-sm leading-relaxed">{comment.content}</p>
    </div>
  );
}
