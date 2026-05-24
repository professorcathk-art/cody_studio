import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createAdminClient();

  const { data: design, error } = await supabase
    .from("designs")
    .select("*, users(name)")
    .eq("id", id)
    .single();

  if (error || !design) {
    return NextResponse.json({ error: "找不到設計圖" }, { status: 404 });
  }

  if (session.role === "boss" && design.user_id !== session.userId) {
    return NextResponse.json({ error: "無權限查看" }, { status: 403 });
  }

  let is_favorited = false;
  if (session.role === "boss") {
    const { data: fav } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", session.userId)
      .eq("design_id", id)
      .maybeSingle();
    is_favorited = !!fav;
  }

  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("design_id", id)
    .order("created_at", { ascending: true });

  return NextResponse.json({
    design: {
      ...design,
      boss_name: design.users?.name ?? null,
      is_favorited,
      users: undefined,
    },
    comments: comments ?? [],
  });
}
