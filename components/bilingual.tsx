import { type ReactNode } from "react";

function cn(...parts: (string | undefined | false)[]) {
  return parts.filter(Boolean).join(" ");
}

export function BilingualEyebrow({
  zh,
  en,
  className,
}: {
  zh: string;
  en: string;
  className?: string;
}) {
  return (
    <p className={cn("text-xs font-semibold uppercase tracking-[0.28em] text-store-warm", className)}>
      <span className="block">{zh}</span>
      <span className="mt-1 block text-[10px] font-medium tracking-[0.22em] text-store-muted">
        {en}
      </span>
    </p>
  );
}

export function BilingualHeading({
  zh,
  en,
  as: Tag = "h2",
  className,
  enClassName,
}: {
  zh: string;
  en: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  enClassName?: string;
}) {
  return (
    <Tag className={className}>
      <span className="block">{zh}</span>
      <span
        className={cn(
          "mt-2 block text-base font-normal leading-snug text-store-muted sm:text-lg",
          enClassName
        )}
      >
        {en}
      </span>
    </Tag>
  );
}

export function BilingualBody({
  zh,
  en,
  className,
}: {
  zh: string;
  en: string;
  className?: string;
}) {
  return (
    <div className={cn("text-sm leading-relaxed text-store-muted sm:text-base", className)}>
      <p>{zh}</p>
      <p className="mt-2 text-xs leading-relaxed text-store-muted/90 sm:text-sm">{en}</p>
    </div>
  );
}

export function BilingualLabel({
  zh,
  en,
  htmlFor,
}: {
  zh: string;
  en: string;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-center">
      <span className="block text-sm font-medium text-store-foreground">{zh}</span>
      <span className="mt-1 block text-[10px] uppercase tracking-wider text-store-muted">
        {en}
      </span>
    </label>
  );
}

export function BilingualButtonText({
  zh,
  en,
  loading,
  loadingZh = "驗證中…",
  loadingEn = "Verifying…",
}: {
  zh: string;
  en: string;
  loading?: boolean;
  loadingZh?: string;
  loadingEn?: string;
}) {
  if (loading) {
    return (
      <span>
        <span className="block">{loadingZh}</span>
        <span className="mt-0.5 block text-[10px] font-normal uppercase tracking-wider opacity-80">
          {loadingEn}
        </span>
      </span>
    );
  }

  return (
    <span>
      <span className="block">{zh}</span>
      <span className="mt-0.5 block text-[10px] font-normal uppercase tracking-wider opacity-80">
        {en}
      </span>
    </span>
  );
}

export function BilingualError({ zh, en }: { zh: string; en: string }) {
  return (
    <p className="text-center text-sm text-red-600" role="alert">
      <span className="block">{zh}</span>
      <span className="mt-1 block text-xs text-red-500/90">{en}</span>
    </p>
  );
}

export function BilingualFooterLine({
  zh,
  en,
  className,
}: {
  zh: string;
  en: string;
  className?: string;
}) {
  return (
    <p className={className}>
      <span className="block">{zh}</span>
      <span className="mt-1 block text-xs opacity-70">{en}</span>
    </p>
  );
}

export function BilingualFeature({
  titleZh,
  titleEn,
  bodyZh,
  bodyEn,
}: {
  titleZh: string;
  titleEn: string;
  bodyZh: string;
  bodyEn: string;
}) {
  return (
    <div className="border-t border-store-border pt-6 sm:border-t-0 sm:pt-0 sm:ring-1 sm:ring-store-border sm:rounded-2xl sm:bg-white sm:p-6">
      <h3 className="text-base font-semibold text-store-foreground sm:text-lg">
        <span className="block">{titleZh}</span>
        <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-store-warm">
          {titleEn}
        </span>
      </h3>
      <BilingualBody zh={bodyZh} en={bodyEn} className="mt-4" />
    </div>
  );
}

export function BilingualInline({
  zh,
  en,
  children,
}: {
  zh: string;
  en: string;
  children?: ReactNode;
}) {
  return (
    <span>
      {zh}
      <span className="mx-1.5 text-store-muted/40">·</span>
      <span className="text-store-muted">{en}</span>
      {children}
    </span>
  );
}
