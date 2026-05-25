"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AdminNav } from "./admin-dashboard";
import {
  CONTACT_INQUIRY_STATUSES,
  type ContactInquiry,
  type ContactInquiryStatus,
} from "@/lib/types";

const STATUS_LABEL: Record<ContactInquiryStatus, string> = {
  new: "新查詢",
  read: "已讀",
  archived: "已封存",
};

export function InquiriesManagement() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadInquiries = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (statusFilter !== "all") params.set("status", statusFilter);

    try {
      const res = await fetch(`/api/contact-inquiries?${params}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "載入失敗");
        setInquiries([]);
        return;
      }
      setInquiries(data.inquiries ?? []);
    } catch {
      setError("連線失敗");
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  }, [query, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadInquiries();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadInquiries]);

  async function updateStatus(id: string, status: ContactInquiryStatus) {
    const res = await fetch("/api/contact-inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "更新失敗");
      return;
    }
    setInquiries((prev) =>
      prev.map((item) => (item.id === id ? data.inquiry : item))
    );
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("zh-TW", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="safe-bottom min-h-[100dvh]">
      <AdminNav />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-2 inline-flex text-sm text-muted transition hover:text-foreground"
            >
              ← 返回後台
            </Link>
            <h2 className="text-lg font-semibold sm:text-xl">聯絡查詢管理</h2>
            <p className="mt-1 text-sm text-muted">
              查看、搜尋與管理網站聯絡表單紀錄
            </p>
          </div>
          <p className="text-sm text-muted">
            共 {inquiries.length} 筆
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜尋姓名、公司、電郵、訊息…"
            className="min-h-11 flex-1 rounded-xl border border-border bg-white px-4 py-2 text-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-h-11 rounded-xl border border-border bg-white px-4 py-2 text-sm"
          >
            <option value="all">全部狀態</option>
            {CONTACT_INQUIRY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <p className="py-12 text-center text-muted">載入中…</p>
        ) : inquiries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="text-muted">尚無查詢紀錄</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {inquiries.map((item) => {
              const expanded = expandedId === item.id;
              return (
                <li
                  key={item.id}
                  className="rounded-2xl bg-white p-4 ring-1 ring-border sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(expanded ? null : item.id)
                      }
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{item.name}</span>
                        <span className="text-sm text-muted">{item.company}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                            item.status === "new"
                              ? "bg-amber-100 text-amber-800"
                              : item.status === "read"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {STATUS_LABEL[item.status]}
                        </span>
                        {!item.email_sent && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] text-red-700">
                            郵件未送
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        {formatDate(item.created_at)} · {item.email}
                      </p>
                    </button>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      {CONTACT_INQUIRY_STATUSES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          disabled={item.status === s}
                          onClick={() => updateStatus(item.id, s)}
                          className="min-h-9 rounded-lg px-3 py-1.5 text-xs ring-1 ring-border transition hover:bg-accent-soft disabled:opacity-40"
                        >
                          {STATUS_LABEL[s]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {expanded && (
                    <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                      <p>
                        <span className="text-muted">電郵：</span>
                        <a
                          href={`mailto:${item.email}`}
                          className="text-primary hover:underline"
                        >
                          {item.email}
                        </a>
                      </p>
                      <p>
                        <span className="text-muted">WhatsApp / 其他：</span>
                        {item.phone_contact}
                      </p>
                      <p>
                        <span className="text-muted">預估訂量：</span>
                        {item.order_size}
                      </p>
                      <p className="whitespace-pre-wrap leading-relaxed">
                        <span className="text-muted">需求描述：</span>
                        {item.message}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
