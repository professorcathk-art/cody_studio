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
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            Cody Studio
          </p>
          <h1 className="text-lg font-semibold">管理後台</h1>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}

export function AdminDashboard() {
  return (
    <div className="min-h-screen">
      <AdminNav />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <p className="mb-8 text-muted">選擇管理功能</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-2xl bg-card p-6 ring-1 ring-border transition hover:shadow-md hover:ring-zinc-300"
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
