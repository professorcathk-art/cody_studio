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

export function LoginForm() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<{ zh: string; en: string } | null>(null);
  const [loading, setLoading] = useState(false);

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

      router.push(data.role === "admin" ? "/admin" : "/");
      router.refresh();
    } catch {
      setError(ERROR_MESSAGES.network);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="space-y-3">
        <BilingualLabel
          htmlFor="passcode"
          zh="組織通關密碼"
          en="Organisation Passcode"
        />
        <input
          id="passcode"
          type="password"
          inputMode="numeric"
          pattern="\d{4,6}"
          maxLength={6}
          value={passcode}
          onChange={(e) => setPasscode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="••••"
          className="min-h-14 w-full rounded-xl border border-store-border bg-store-bg/40 px-4 py-4 text-center text-xl tracking-[0.4em] shadow-sm transition focus:border-store-accent focus:bg-white sm:text-2xl sm:tracking-[0.5em]"
          autoComplete="off"
          autoFocus
        />
        <p className="text-center text-[10px] text-store-muted">
          <span className="block">4–6 位數字</span>
          <span className="mt-0.5 block">4–6 digit code</span>
        </p>
      </div>

      {error && <BilingualError zh={error.zh} en={error.en} />}

      <button
        type="submit"
        disabled={passcode.length < 4 || loading}
        className="min-h-[3.25rem] w-full rounded-xl bg-store-accent py-3.5 text-sm font-medium text-white transition hover:bg-store-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <BilingualButtonText
          zh="進入設計入口"
          en="Enter Design Portal"
          loading={loading}
        />
      </button>
    </form>
  );
}
