import { FullBleedImage } from "@/components/home/full-bleed-image";
import { getShowcaseCoverUrl, SHOWCASE_DESIGN_IDS } from "@/lib/landing-showcase";

/** 編輯式全螢幕 banner 序列 — 無標籤、滿版 cover */
export function EditorialGallerySection() {
  const ids = SHOWCASE_DESIGN_IDS.slice(0, 4);

  return (
    <section aria-label="Design showcase" className="w-full">
      {ids.map((id, index) => (
        <FullBleedImage
          key={id}
          src={getShowcaseCoverUrl(id, 1920, index % 2 === 0 ? 1080 : 900)}
          overlay={index % 2 === 0 ? "dark" : "none"}
          heightClass={
            index % 2 === 0
              ? "h-screen min-h-[100dvh]"
              : "h-[85vh] min-h-[560px]"
          }
        />
      ))}
    </section>
  );
}
