import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { DesignDetailView } from "@/components/design-detail-view";

export default async function DesignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/#portal");
  if (session.role === "admin") redirect("/admin");

  const { id } = await params;
  const supabase = createAdminClient();

  const { data: design, error } = await supabase
    .from("designs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !design) notFound();
  if (design.user_id !== session.userId) notFound();

  const { data: fav } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", session.userId)
    .eq("design_id", id)
    .maybeSingle();

  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("design_id", id)
    .order("created_at", { ascending: true });

  return (
    <DesignDetailView
      design={{
        id: design.id,
        title: design.title,
        description: design.description ?? "",
        image_url: design.image_url,
        status: design.status,
        is_favorited: !!fav,
      }}
      comments={comments ?? []}
    />
  );
}
