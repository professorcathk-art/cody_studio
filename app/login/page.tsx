import type { Metadata } from "next";
import { LandingPage } from "@/components/landing-page";

export const metadata: Metadata = {
  title: "Cody Studio — 帽款批發設計平台",
  description:
    "專業帽款設計批發入口。輸入組織通關密碼，預覽季節性帽款設計、審批與協作。Cap & hat wholesale design portal.",
};

export default function LoginPage() {
  return <LandingPage />;
}
