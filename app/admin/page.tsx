import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminDashboard } from "@/components/admin-dashboard";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/#portal");
  if (session.role !== "admin") redirect("/portal");

  return <AdminDashboard />;
}
