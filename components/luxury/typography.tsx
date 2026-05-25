import { type ReactNode } from "react";

function cn(...parts: (string | undefined | false)[]) {
  return parts.filter(Boolean).join(" ");
}

/** 英文大標 + 中文小標 — 精品對照 */
export function LuxuryTitle({
  en,
  zh,
  as: Tag = "h2",
  className,
  invert,
}: {
  en: string;
  zh: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  invert?: boolean;
}) {
  return (
    <Tag className={className}>
      <span
        className={cn(
          "font-display block text-3xl font-medium leading-[1.15] tracking-wide sm:text-4xl lg:text-5xl",
          invert ? "text-white" : "text-neutral-950"
        )}
      >
        {en}
      </span>
      <span
        className={cn(
          "mt-3 block text-sm font-normal tracking-[0.12em] sm:text-base",
          invert ? "text-white/75" : "text-neutral-500"
        )}
      >
        {zh}
      </span>
    </Tag>
  );
}

export function LuxurySubtitle({
  en,
  zh,
  className,
  invert,
}: {
  en: string;
  zh: string;
  className?: string;
  invert?: boolean;
}) {
  return (
    <div className={className}>
      <p
        className={cn(
          "font-display text-lg leading-relaxed sm:text-xl",
          invert ? "text-white/90" : "text-neutral-700"
        )}
      >
        {en}
      </p>
      <p
        className={cn(
          "mt-2 text-sm leading-relaxed tracking-wide",
          invert ? "text-white/65" : "text-neutral-500"
        )}
      >
        {zh}
      </p>
    </div>
  );
}

export function LuxuryEyebrow({
  en,
  zh,
  invert,
}: {
  en: string;
  zh: string;
  invert?: boolean;
}) {
  return (
    <p
      className={cn(
        "mb-6 text-[10px] font-medium uppercase tracking-[0.35em]",
        invert ? "text-white/55" : "text-neutral-400"
      )}
    >
      <span className="block">{en}</span>
      <span className="mt-1 block tracking-[0.2em]">{zh}</span>
    </p>
  );
}

export function LuxuryBody({
  en,
  zh,
  className,
  invert,
}: {
  en: string;
  zh: string;
  className?: string;
  invert?: boolean;
}) {
  return (
    <div className={className}>
      <p
        className={cn(
          "text-base leading-[1.85] sm:text-lg",
          invert ? "text-white/85" : "text-neutral-600"
        )}
      >
        {en}
      </p>
      <p
        className={cn(
          "mt-4 text-sm leading-[1.9] tracking-wide",
          invert ? "text-white/60" : "text-neutral-500"
        )}
      >
        {zh}
      </p>
    </div>
  );
}

export function LuxuryFieldLabel({
  en,
  zh,
  htmlFor,
  invert,
}: {
  en: string;
  zh: string;
  htmlFor?: string;
  invert?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span
        className={cn(
          "block text-[11px] font-medium uppercase tracking-[0.22em]",
          invert ? "text-white/80" : "text-neutral-800"
        )}
      >
        {en}
      </span>
      <span
        className={cn(
          "mt-1 block text-xs tracking-wide",
          invert ? "text-white/50" : "text-neutral-400"
        )}
      >
        {zh}
      </span>
    </label>
  );
}

export function LuxurySection({
  id,
  children,
  className,
  dark,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        dark ? "bg-neutral-950 text-white" : "bg-white text-neutral-950",
        className
      )}
    >
      {children}
    </section>
  );
}
