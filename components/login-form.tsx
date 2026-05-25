"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "登入失敗");
        return;
      }

      router.push(data.role === "admin" ? "/admin" : "/");
      router.refresh();
    } catch {
      setError("連線失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="passcode"
          className="block text-center text-sm font-medium text-store-foreground"
        >
          組織通關密碼
        </label>
        <p className="text-center text-[10px] uppercase tracking-wider text-store-muted">
          Organisation passcode
        </p>
        <input
          id="passcode"
          type="password"
          inputMode="numeric"
          pattern="\d{4,6}"
          maxLength={6}
          value={passcode}
          onChange={(e) => setPasscode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="••••"
          className="min-h-14 w-full rounded-xl border border-store-border bg-store-bg/50 px-4 py-4 text-center text-xl tracking-[0.4em] shadow-sm transition focus:border-store-accent focus:bg-white sm:text-2xl sm:tracking-[0.5em]"
          autoComplete="off"
          autoFocus
        />
      </div>

      {error && (
        <p className="text-center text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={passcode.length < 4 || loading}
        className="min-h-12 w-full rounded-xl bg-store-accent py-3.5 text-sm font-medium text-white transition hover:bg-store-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "驗證中…" : "進入設計入口"}
      </button>
      <p className="text-center text-[10px] text-store-muted">
        Enter design portal
      </p>
    </form>
  );
}
