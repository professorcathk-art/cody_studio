"use client";

import Image from "next/image";

interface ProtectedBannerProps {
  src: string;
  alt: string;
  priority?: boolean;
  aspect?: "hero" | "wide" | "tall";
  sizes?: string;
}

const aspectClass = {
  hero: "aspect-[16/9] sm:aspect-[21/9]",
  wide: "aspect-[16/9]",
  tall: "aspect-[4/5] sm:aspect-[3/4]",
};

export function ProtectedBanner({
  src,
  alt,
  priority,
  aspect = "wide",
  sizes = "100vw",
}: ProtectedBannerProps) {
  function blockSave(e: React.SyntheticEvent) {
    e.preventDefault();
  }

  return (
    <div
      className="protected-banner group relative w-full overflow-hidden bg-[#f0eeea]"
      onContextMenu={blockSave}
      onDragStart={blockSave}
    >
      <div className={`relative w-full ${aspectClass[aspect]}`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          draggable={false}
          className="protected-media object-contain transition duration-700 group-hover:scale-[1.01]"
        />
        {/* 透明遮罩：阻擋右鍵與拖曳 */}
        <div
          className="absolute inset-0 z-10"
          aria-hidden
          onContextMenu={blockSave}
          onDragStart={blockSave}
        />
      </div>
    </div>
  );
}
