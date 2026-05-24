"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AdminNav } from "./admin-dashboard";
import { StatusBadge } from "./status-badge";
import { CommentsSection } from "./comments-section";
import { getThumbnailUrl } from "@/lib/images";
import { DESIGN_STATUSES, type Comment, type DesignStatus, type User } from "@/lib/types";

interface DesignRow {
  id: string;
  title: string;
  description: string;
  image_url: string;
  status: DesignStatus;
  user_id: string;
  boss_name: string | null;
  created_at: string;
}

export function DesignsManagement() {
  const [bosses, setBosses] = useState<User[]>([]);
  const [designs, setDesigns] = useState<DesignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState("");

  async function reloadData() {
    const [usersRes, designsRes] = await Promise.all([
      fetch("/api/users"),
      fetch("/api/designs?all=true"),
    ]);
    const usersData = await usersRes.json();
    const designsData = await designsRes.json();

    const bossList = (usersData.users ?? []).filter(
      (u: User) => u.role === "boss"
    );
    setBosses(bossList);
    setDesigns(designsData.designs ?? []);
    setUserId((current) => current || bossList[0]?.id || "");
    setLoading(false);
  }

  useEffect(() => {
    let active = true;

    (async () => {
      const [usersRes, designsRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/designs?all=true"),
      ]);
      const usersData = await usersRes.json();
      const designsData = await designsRes.json();
      if (!active) return;

      const bossList = (usersData.users ?? []).filter(
        (u: User) => u.role === "boss"
      );
      setBosses(bossList);
      setDesigns(designsData.designs ?? []);
      setUserId((current) => current || bossList[0]?.id || "");
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title || !userId) {
      setError("請填寫所有必填欄位");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("user_id", userId);

    try {
      const res = await fetch("/api/designs", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "上傳失敗");
        return;
      }

      setSuccess(`已上傳：${data.design.title}`);
      setFile(null);
      setTitle("");
      setDescription("");
      await reloadData();
    } finally {
      setUploading(false);
    }
  }

  async function updateStatus(id: string, status: DesignStatus) {
    const res = await fetch("/api/designs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    if (res.ok) {
      setDesigns((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status } : d))
      );
    }
  }

  async function toggleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(id);

    if (!commentsMap[id]) {
      const res = await fetch(`/api/comments?design_id=${id}`);
      const data = await res.json();
      setCommentsMap((prev) => ({ ...prev, [id]: data.comments ?? [] }));
    }
  }

  async function handleDelete(id: string, designTitle: string) {
    if (!confirm(`確定要刪除「${designTitle}」嗎？`)) return;

    const res = await fetch(`/api/designs?id=${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "刪除失敗");
      return;
    }

    setSuccess("設計圖已刪除");
    if (expandedId === id) setExpandedId(null);
    await reloadData();
  }

  return (
    <div className="min-h-screen">
      <AdminNav />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link
          href="/admin"
          className="mb-6 inline-block text-sm text-muted hover:text-foreground"
        >
          ← 返回管理面板
        </Link>

        <h2 className="mb-6 text-xl font-semibold">上傳與設計管理</h2>

        {(error || success) && (
          <div
            className={`mb-6 rounded-xl px-4 py-3 text-sm ${
              error
                ? "bg-red-50 text-red-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {error || success}
          </div>
        )}

        <section className="mb-10 rounded-2xl bg-card p-6 ring-1 ring-border">
          <h3 className="mb-4 font-medium">上傳設計圖</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-muted">圖片檔案（最大 10MB）</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-muted">標題</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-border px-4 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-muted">描述</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-border px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-muted">指派老闆</label>
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full rounded-lg border border-border px-4 py-2 text-sm"
                required
              >
                {bosses.length === 0 ? (
                  <option value="">請先新增老闆</option>
                ) : (
                  bosses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <button
              type="submit"
              disabled={uploading || bosses.length === 0}
              className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-40"
            >
              {uploading ? "上傳中…" : "上傳"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl bg-card ring-1 ring-border overflow-hidden">
          <div className="border-b border-border px-6 py-4">
            <h3 className="font-medium">全部設計圖</h3>
          </div>

          {loading ? (
            <p className="px-6 py-8 text-sm text-muted">載入中…</p>
          ) : designs.length === 0 ? (
            <p className="px-6 py-8 text-sm text-muted">尚無設計圖</p>
          ) : (
            <ul className="divide-y divide-border">
              {designs.map((design) => (
                <li key={design.id} className="px-6 py-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-accent-soft">
                      <Image
                        src={getThumbnailUrl(design.image_url, 200)}
                        alt={design.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <p className="font-medium">{design.title}</p>
                        <StatusBadge status={design.status} />
                      </div>
                      <p className="text-sm text-muted">
                        指派：{design.boss_name ?? "—"}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <select
                          value={design.status}
                          onChange={(e) =>
                            updateStatus(design.id, e.target.value as DesignStatus)
                          }
                          className="rounded-lg border border-border px-3 py-1.5 text-sm"
                        >
                          {DESIGN_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => toggleExpand(design.id)}
                          className="text-sm text-primary hover:underline"
                        >
                          {expandedId === design.id ? "收起評論" : "評論管理"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(design.id, design.title)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                  </div>

                  {expandedId === design.id && (
                    <div className="mt-4 rounded-xl bg-accent-soft p-4">
                      <CommentsSection
                        key={`${design.id}-${commentsMap[design.id]?.length ?? 0}`}
                        designId={design.id}
                        initialComments={commentsMap[design.id] ?? []}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
