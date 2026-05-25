"use client";

import Image from "next/image";

interface FullBleedImageProps {
  src: string;
  alt?: string;
  priority?: boolean;
  overlay?: "dark" | "light" | "none";
  className?: string;
  heightClass?: string;
}

export function FullBleedImage({
  src,
  alt = "Cap design",
  priority,
  overlay = "none",
  className,
  heightClass = "h-screen min-h-[600px]",
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
        className="protected-media object-cover object-center"
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
