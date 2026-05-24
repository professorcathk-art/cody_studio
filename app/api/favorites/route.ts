import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "boss") {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { design_id } = await request.json();

  if (!design_id) {
    return NextResponse.json({ error: "缺少設計 ID" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: design } = await supabase
    .from("designs")
    .select("user_id")
    .eq("id", design_id)
    .single();

  if (!design || design.user_id !== session.userId) {
    return NextResponse.json({ error: "無權限" }, { status: 403 });
  }

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", session.userId)
    .eq("design_id", design_id)
    .maybeSingle();

  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    return NextResponse.json({ favorited: false });
  }

  const { error } = await supabase.from("favorites").insert({
    user_id: session.userId,
    design_id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ favorited: true });
}
