import { getFeedUrl, getPublicObjectUrl, getTransformedUrl } from "@/lib/images";

/** Boss A storage prefix */
const BOSS_A_ID = "03b575af-1a6b-4e06-b2bb-96bc0cffb2a3";

/** 首屏 hero 背景 */
export const HERO_DESIGN_ID = "083";

/** 首頁編輯式 banner（083 用於 hero，084 等用於下方展示） */
export const LANDING_GALLERY_IDS = ["083", "084"] as const;

/** 舊 showcase 列表（保留供其他用途） */
export const SHOWCASE_DESIGN_IDS = [
  "072",
  "073",
  "074",
  "075",
  "076",
  "077",
  "078",
  "079",
  "083",
  "084",
] as const;

export function getShowcaseImageUrl(designId: string, width = 640): string {
  const objectUrl = getPublicObjectUrl(`${BOSS_A_ID}/${designId}.png`);
  return getFeedUrl(objectUrl, width);
}

/** 全螢幕 cover 用 — 無白邊 */
export function getShowcaseCoverUrl(
  designId: string,
  width = 1920,
  height = 1080
): string {
  const objectUrl = getPublicObjectUrl(`${BOSS_A_ID}/${designId}.png`);
  return getTransformedUrl(objectUrl, {
    width,
    height,
    quality: 82,
    format: "webp",
    resize: "cover",
  });
}

export const LANDING_FEATURES = [
  {
    titleZh: "專屬設計庫",
    titleEn: "Exclusive Design Library",
    bodyZh: "每季帽款設計集中管理，隨時預覽高清稿件。",
    bodyEn: "Seasonal cap designs in one private library with high-resolution previews.",
  },
  {
    titleZh: "即時審批",
    titleEn: "Real-Time Approval",
    bodyZh: "批准、退稿、收藏，一鍵完成審稿流程。",
    bodyEn: "Approve, reject, or save favorites — streamlined review in one click.",
  },
  {
    titleZh: "批發協作",
    titleEn: "Wholesale Collaboration",
    bodyZh: "設計師與客戶留言協作，加速打樣與採購決策。",
    bodyEn: "Comment threads between designers and buyers to speed sampling decisions.",
  },
] as const;
