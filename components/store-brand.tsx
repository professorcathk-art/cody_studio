export function StoreLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="48" height="48" rx="12" className="fill-store-accent" />
      <path
        d="M8 26c0-6 6.5-11 16-11s16 5 16 11v2H8v-2z"
        className="fill-white/95"
      />
      <path
        d="M12 28h24v3c0 2.2-5.4 4-12 4s-12-1.8-12-4v-3z"
        className="fill-white/80"
      />
      <ellipse cx="24" cy="15" rx="10" ry="3" className="fill-white/60" />
      <path
        d="M30 18c2 1 4 3 4 6"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="opacity-70"
      />
    </svg>
  );
}

export function StoreWordmark({ subtitle }: { subtitle?: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-store-muted sm:text-xs">
        Cody Studio
      </p>
      <p className="text-sm font-semibold tracking-tight text-store-foreground sm:text-base">
        Cap Store
      </p>
      {subtitle && (
        <p className="mt-0.5 truncate text-xs text-store-muted">{subtitle}</p>
      )}
    </div>
  );
}
