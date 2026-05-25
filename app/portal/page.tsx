import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getBossDesigns } from "@/lib/designs";
import { BossHome } from "@/components/boss-home";

export default async function PortalPage() {
  const session = await getSession();

  if (!session) {
    redirect("/#portal");
  }

  if (session.role === "admin") {
    redirect("/admin");
  }

  const initialDesigns = await getBossDesigns(session.userId);

  return <BossHome userName={session.name} initialDesigns={initialDesigns} />;
}
