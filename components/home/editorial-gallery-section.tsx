import { FullBleedImage } from "@/components/home/full-bleed-image";
import { getShowcaseCoverUrl, LANDING_GALLERY_IDS } from "@/lib/landing-showcase";

/** 編輯式全螢幕 banner — 083/084，無標籤、滿版 cover */
export function EditorialGallerySection() {
  // Hero 已使用 083，此區展示 084（若未來擴展可 iterate LANDING_GALLERY_IDS）
  const ids = LANDING_GALLERY_IDS.filter((id) => id !== "083");

  return (
    <section aria-label="Design showcase" className="w-full">
      {ids.map((id, index) => (
        <FullBleedImage
          key={id}
          src={getShowcaseCoverUrl(id, 1920, index % 2 === 0 ? 1080 : 900)}
          overlay={index % 2 === 0 ? "none" : "dark"}
          focusRightOnMobile
          heightClass={
            index % 2 === 0
              ? "h-[85vh] min-h-[520px] sm:h-screen sm:min-h-[100dvh]"
              : "h-[70vh] min-h-[440px] sm:h-[85vh] sm:min-h-[560px]"
          }
        />
      ))}
    </section>
  );
}
