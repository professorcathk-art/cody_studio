"use client";

import Image from "next/image";
import { useEffect } from "react";
import { getDetailUrl } from "@/lib/images";

interface DesignImageModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export function DesignImageModal({
  open,
  onClose,
  imageUrl,
  title,
}: DesignImageModalProps) {
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
        <div className="relative max-h-[80vh] w-full overflow-hidden rounded-xl bg-[#f5f5f5]">
          <Image
            src={detailUrl}
            alt={title}
            width={1200}
            height={900}
            sizes="100vw"
            className="mx-auto h-auto max-h-[80vh] w-full object-contain"
            style={{ width: "100%", height: "auto", maxHeight: "80vh" }}
            priority
          />
        </div>
      </div>
    </div>
  );
}
