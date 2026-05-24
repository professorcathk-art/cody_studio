"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getDetailUrl } from "@/lib/images";

interface DesignImageModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

function downloadFilename(title: string) {
  const safe = title.trim().replace(/[^\w\u4e00-\u9fff-]+/g, "-") || "design";
  return `${safe}.webp`;
}

export function DesignImageModal({
  open,
  onClose,
  imageUrl,
  title,
}: DesignImageModalProps) {
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const detailUrl = getDetailUrl(imageUrl);

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch(detailUrl);
      if (!res.ok) throw new Error("download failed");
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = downloadFilename(title);
      link.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(detailUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`放大預覽：${title}`}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
        aria-label="關閉"
      >
        ×
      </button>
      <div
        className="relative flex max-h-[90vh] w-full max-w-5xl flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-3 max-w-full truncate text-center text-sm text-white/80">
          {title}
        </p>
        <div className="relative max-h-[70vh] w-full overflow-hidden rounded-xl bg-[#f5f5f5] sm:max-h-[75vh]">
          <Image
            src={detailUrl}
            alt={title}
            width={1200}
            height={900}
            sizes="100vw"
            className="mx-auto h-auto max-h-[70vh] w-full object-contain sm:max-h-[75vh]"
            style={{ width: "100%", height: "auto", maxHeight: "75vh" }}
            priority
          />
        </div>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-store-foreground shadow-lg transition hover:bg-white/90 disabled:opacity-60"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden
          >
            <path d="M12 3v12m0 0l4-4m-4 4l-4-4M4 21h16" />
          </svg>
          {downloading ? "下載中…" : "下載圖片"}
        </button>
      </div>
    </div>
  );
}
