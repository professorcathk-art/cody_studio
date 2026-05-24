import { createAdminClient } from "@/lib/supabase/admin";
import type { DesignStatus } from "@/lib/types";

export interface BossDesignItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  status: DesignStatus;
  created_at: string;
  is_favorited: boolean;
}

export async function getBossDesigns(userId: string): Promise<BossDesignItem[]> {
  const supabase = createAdminClient();

  const [{ data: designs, error }, { data: favorites }] = await Promise.all([
    supabase
      .from("designs")
      .select("id, title, description, image_url, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase.from("favorites").select("design_id").eq("user_id", userId),
  ]);

  if (error) throw error;

  const favoriteIds = new Set(favorites?.map((f) => f.design_id) ?? []);

  return (designs ?? []).map((d) => ({
    ...d,
    description: d.description ?? "",
    is_favorited: favoriteIds.has(d.id),
  }));
}
