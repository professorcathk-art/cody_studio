import { getFeedUrl, getPublicObjectUrl } from "@/lib/images";

/** Boss A storage prefix — showcase designs 072–079 */
const BOSS_A_ID = "03b575af-1a6b-4e06-b2bb-96bc0cffb2a3";

export const SHOWCASE_DESIGN_IDS = [
  "072",
  "073",
  "074",
  "075",
  "076",
  "077",
  "078",
  "079",
] as const;

export function getShowcaseImageUrl(designId: string, width = 640): string {
  const objectUrl = getPublicObjectUrl(`${BOSS_A_ID}/${designId}.png`);
  return getFeedUrl(objectUrl, width);
}

export const LANDING_FEATURES = [
  {
    title: "專屬設計庫",
    caption: "Exclusive design library",
    description: "每季帽款設計集中管理，隨時預覽高清稿。",
  },
  {
    title: "即時審批",
    caption: "Real-time approval",
    description: "批准、退稿、收藏，一鍵完成審稿流程。",
  },
  {
    title: "批發協作",
    caption: "Wholesale collaboration",
    description: "設計師與客戶留言協作，加速打樣決策。",
  },
] as const;
