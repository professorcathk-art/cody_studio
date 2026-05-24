import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { DesignsManagement } from "@/components/designs-management";

export default async function AdminDesignsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/");

  return <DesignsManagement />;
}
