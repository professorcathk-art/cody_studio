"use client";

import { useRouter } from "next/navigation";

export function LogoutButton({ label = "登出" }: { label?: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-lg px-3 py-1.5 text-sm text-muted transition hover:bg-accent-soft hover:text-foreground"
    >
      {label}
    </button>
  );
}
