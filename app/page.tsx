import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { BossHome } from "@/components/boss-home";

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role === "admin") {
    redirect("/admin");
  }

  return <BossHome userName={session.name} />;
}
