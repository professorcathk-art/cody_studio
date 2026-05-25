import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { UsersManagement } from "@/components/users-management";

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session) redirect("/#portal");
  if (session.role !== "admin") redirect("/portal");

  return <UsersManagement />;
}
