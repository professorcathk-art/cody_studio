import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { InquiriesManagement } from "@/components/inquiries-management";

export default async function AdminInquiriesPage() {
  const session = await getSession();
  if (!session) redirect("/#portal");
  if (session.role !== "admin") redirect("/portal");

  return <InquiriesManagement />;
}
