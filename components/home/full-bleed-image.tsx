"use client";

import Image from "next/image";

interface FullBleedImageProps {
  src: string;
  alt?: string;
  priority?: boolean;
  overlay?: "dark" | "light" | "none";
  className?: string;
  heightClass?: string;
  /** 手機版偏向顯示圖片右側（帽款常見構圖） */
  focusRightOnMobile?: boolean;
}

export function FullBleedImage({
  src,
  alt = "Cap design",
  priority,
  overlay = "none",
  className,
  heightClass = "h-screen min-h-[600px]",
  focusRightOnMobile = true,
}: FullBleedImageProps) {
  function blockSave(e: React.SyntheticEvent) {
    e.preventDefault();
  }

  const overlayClass =
    overlay === "dark"
      ? "bg-black/50"
      : overlay === "light"
        ? "bg-white/20"
        : "";

  const objectClass = focusRightOnMobile
    ? "object-cover object-[72%_center] sm:object-[68%_center] md:object-center"
    : "object-cover object-center";

  return (
    <div
      className={`protected-banner relative w-full overflow-hidden ${heightClass} ${className ?? ""}`}
      onContextMenu={blockSave}
      onDragStart={blockSave}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        draggable={false}
        className={`protected-media ${objectClass}`}
      />
      {overlay !== "none" && (
        <div className={`absolute inset-0 ${overlayClass}`} aria-hidden />
      )}
      <div
        className="absolute inset-0 z-10"
        aria-hidden
        onContextMenu={blockSave}
        onDragStart={blockSave}
      />
    </div>
  );
}
