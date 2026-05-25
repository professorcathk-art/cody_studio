"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BilingualButtonText,
  BilingualError,
  BilingualLabel,
} from "@/components/bilingual";

const ERROR_MESSAGES: Record<string, { zh: string; en: string }> = {
  default: { zh: "登入失敗", en: "Login failed. Please check your passcode." },
  network: { zh: "連線失敗，請稍後再試", en: "Connection failed. Please try again later." },
  invalid: { zh: "通關密碼錯誤", en: "Incorrect passcode." },
};

interface LoginFormProps {
  variant?: "default" | "luxury";
}

export function LoginForm({ variant = "default" }: LoginFormProps) {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<{ zh: string; en: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const isLuxury = variant === "luxury";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.error ?? "";
        if (msg.includes("密碼") || msg.includes("passcode") || msg.includes("錯誤")) {
          setError(ERROR_MESSAGES.invalid);
        } else {
          setError({ zh: msg || ERROR_MESSAGES.default.zh, en: ERROR_MESSAGES.default.en });
        }
        return;
      }

      router.push(data.role === "admin" ? "/admin" : "/portal");
      router.refresh();
    } catch {
      setError(ERROR_MESSAGES.network);
    } finally {
      setLoading(false);
    }
  }

  const inputClass = isLuxury
    ? "min-h-14 w-full border-0 border-b border-white/30 bg-transparent px-2 py-4 text-center text-xl tracking-[0.45em] text-white transition placeholder:text-white/25 focus:border-white focus:outline-none sm:text-2xl"
    : "min-h-14 w-full rounded-xl border border-store-border bg-store-bg/40 px-4 py-4 text-center text-xl tracking-[0.4em] shadow-sm transition focus:border-store-accent focus:bg-white sm:text-2xl sm:tracking-[0.5em]";

  const buttonClass = isLuxury
    ? "min-h-[3.25rem] w-full border border-white/40 bg-white/10 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
    : "min-h-[3.25rem] w-full rounded-xl bg-store-accent py-3.5 text-sm font-medium text-white transition hover:bg-store-accent/90 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="space-y-3">
        {isLuxury ? (
          <label htmlFor="passcode" className="block text-center">
            <span className="block text-[11px] font-medium uppercase tracking-[0.22em] text-white/80">
              Organisation Passcode
            </span>
            <span className="mt-1 block text-xs tracking-wide text-white/50">
              組織通關密碼
            </span>
          </label>
        ) : (
          <BilingualLabel
            htmlFor="passcode"
            zh="組織通關密碼"
            en="Organisation Passcode"
          />
        )}
        <input
          id="passcode"
          type="password"
          inputMode="numeric"
          pattern="\d{4,6}"
          maxLength={6}
          value={passcode}
          onChange={(e) => setPasscode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="••••"
          className={inputClass}
          autoComplete="off"
          autoFocus
        />
        <p
          className={`text-center text-[10px] ${isLuxury ? "text-white/40" : "text-store-muted"}`}
        >
          <span className="block">4–6 位數字</span>
          <span className="mt-0.5 block">4–6 digit code</span>
        </p>
      </div>

      {error && (
        isLuxury ? (
          <div className="text-center text-sm text-red-300" role="alert">
            <p>{error.zh}</p>
            <p className="mt-1 text-xs text-red-200/80">{error.en}</p>
          </div>
        ) : (
          <BilingualError zh={error.zh} en={error.en} />
        )
      )}

      <button
        type="submit"
        disabled={passcode.length < 4 || loading}
        className={buttonClass}
      >
        {isLuxury ? (
          loading ? (
            <span>
              <span className="block">驗證中…</span>
              <span className="mt-0.5 block text-[10px] uppercase tracking-wider opacity-80">
                Verifying…
              </span>
            </span>
          ) : (
            <span>
              <span className="block">進入設計入口</span>
              <span className="mt-0.5 block text-[10px] uppercase tracking-wider opacity-80">
                Enter Design Portal
              </span>
            </span>
          )
        ) : (
          <BilingualButtonText
            zh="進入設計入口"
            en="Enter Design Portal"
            loading={loading}
          />
        )}
      </button>
    </form>
  );
}
