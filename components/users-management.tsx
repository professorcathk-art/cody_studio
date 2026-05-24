"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminNav } from "./admin-dashboard";
import type { User } from "@/lib/types";

export function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPasscode, setEditPasscode] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (!active) return;
      setUsers(data.users ?? []);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, passcode }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "新增失敗");
      return;
    }

    setSuccess(`已新增老闆：${data.user.name}`);
    setName("");
    setPasscode("");
    await reloadUsers();
  }

  async function handleUpdatePasscode(id: string) {
    if (!/^\d{4,6}$/.test(editPasscode)) {
      setError("密碼須為 4–6 位數字");
      return;
    }

    const res = await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, passcode: editPasscode }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "更新失敗");
      return;
    }

    setEditingId(null);
    setEditPasscode("");
    setSuccess("密碼已更新");
    await reloadUsers();
  }

  async function handleDelete(id: string, userName: string) {
    if (!confirm(`確定要刪除「${userName}」嗎？`)) return;

    const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "刪除失敗");
      return;
    }

    setSuccess("用戶已刪除");
    await reloadUsers();
  }

  async function reloadUsers() {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data.users ?? []);
  }

  const bosses = users.filter((u) => u.role === "boss");
  const admins = users.filter((u) => u.role === "admin");

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

        <h2 className="mb-6 text-xl font-semibold">密碼與用戶管理</h2>

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
          <h3 className="mb-4 font-medium">新增老闆</h3>
          <form onSubmit={handleCreate} className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-border px-4 py-2 text-sm"
              required
            />
            <input
              type="text"
              inputMode="numeric"
              placeholder="4 位數密碼"
              maxLength={4}
              value={passcode}
              onChange={(e) =>
                setPasscode(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              className="w-32 rounded-lg border border-border px-4 py-2 text-sm tracking-widest"
              required
            />
            <button
              type="submit"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              新增
            </button>
          </form>
        </section>

        <section className="rounded-2xl bg-card ring-1 ring-border overflow-hidden">
          <div className="border-b border-border px-6 py-4">
            <h3 className="font-medium">管理員</h3>
          </div>
          <ul className="divide-y divide-border">
            {admins.map((u) => (
              <li key={u.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-muted">密碼：{u.passcode}</p>
                </div>
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-muted">
                  管理員
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 rounded-2xl bg-card ring-1 ring-border overflow-hidden">
          <div className="border-b border-border px-6 py-4">
            <h3 className="font-medium">老闆列表</h3>
          </div>
          {loading ? (
            <p className="px-6 py-8 text-sm text-muted">載入中…</p>
          ) : bosses.length === 0 ? (
            <p className="px-6 py-8 text-sm text-muted">尚無老闆帳號</p>
          ) : (
            <ul className="divide-y divide-border">
              {bosses.map((u) => (
                <li key={u.id} className="px-6 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-sm text-muted">
                        密碼：{editingId === u.id ? "****" : u.passcode}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {editingId === u.id ? (
                        <>
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={4}
                            value={editPasscode}
                            onChange={(e) =>
                              setEditPasscode(
                                e.target.value.replace(/\D/g, "").slice(0, 4)
                              )
                            }
                            className="w-24 rounded-lg border border-border px-3 py-1.5 text-sm tracking-widest"
                            placeholder="新密碼"
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdatePasscode(u.id)}
                            className="rounded-lg bg-primary px-3 py-1.5 text-sm text-white"
                          >
                            儲存
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(null);
                              setEditPasscode("");
                            }}
                            className="rounded-lg px-3 py-1.5 text-sm text-muted"
                          >
                            取消
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(u.id);
                              setEditPasscode("");
                              setError("");
                              setSuccess("");
                            }}
                            className="rounded-lg bg-accent-soft px-3 py-1.5 text-sm hover:bg-zinc-200"
                          >
                            編輯密碼
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(u.id, u.name)}
                            className="rounded-lg px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                          >
                            刪除
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
