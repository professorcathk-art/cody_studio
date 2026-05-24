import { StoreLogo } from "./store-brand";

export function StoreFooter() {
  return (
    <footer className="mt-12 border-t border-store-border bg-white/60 sm:mt-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <div className="flex items-center gap-3">
          <StoreLogo className="h-8 w-8 opacity-90" />
          <div>
            <p className="text-sm font-semibold tracking-tight">Cody Studio Cap Store</p>
            <p className="text-xs text-store-muted">帽子設計展示與管理</p>
          </div>
        </div>
        <p className="text-xs text-store-muted">
          © {new Date().getFullYear()} Cody Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
