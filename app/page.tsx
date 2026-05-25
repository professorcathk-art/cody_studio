import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LuxuryHomepage } from "@/components/home/luxury-homepage";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Cody Cap Studio — Premium OEM/ODM Cap Solutions",
  description:
    "頂級帽款設計與製造解決方案。Premium OEM/ODM cap solutions from concept to global delivery.",
  openGraph: {
    title: "Cody Cap Studio",
    description: "Premium OEM/ODM Cap Solutions · 頂級帽款設計與製造解決方案",
    url: "https://codycapstudio.com",
  },
};

export default async function HomePage() {
  const session = await getSession();

  if (session?.role === "admin") {
    redirect("/admin");
  }

  if (session?.role === "boss") {
    redirect("/portal");
  }

  return <LuxuryHomepage />;
}
