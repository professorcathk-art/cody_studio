import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

const navItems = [
  {
    href: "/admin/users",
    title: "密碼與用戶管理",
    description: "新增老闆、編輯通關密碼、刪除用戶",
    icon: "👤",
  },
  {
    href: "/admin/designs",
    title: "上傳與設計管理",
    description: "上傳設計圖、指派老闆、管理狀態與評論",
    icon: "🎩",
  },
];

export function AdminNav() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            Cody Studio
          </p>
          <h1 className="truncate text-base font-semibold sm:text-lg">管理後台</h1>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}

export function AdminDashboard() {
  return (
    <div className="safe-bottom min-h-[100dvh]">
      <AdminNav />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <p className="mb-6 text-muted sm:mb-8">選擇管理功能</p>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group block rounded-xl bg-card p-5 ring-1 ring-border transition active:scale-[0.99] hover:shadow-md hover:ring-zinc-300 sm:rounded-2xl sm:p-6"
            >
              <span className="mb-4 block text-3xl">{item.icon}</span>
              <h2 className="mb-2 text-lg font-semibold group-hover:text-primary">
                {item.title}
              </h2>
              <p className="text-sm text-muted">{item.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
