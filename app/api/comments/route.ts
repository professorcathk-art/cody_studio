import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const designId = searchParams.get("design_id");

  if (!designId) {
    return NextResponse.json({ error: "缺少 design_id" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: design } = await supabase
    .from("designs")
    .select("user_id")
    .eq("id", designId)
    .single();

  if (!design) {
    return NextResponse.json({ error: "找不到設計圖" }, { status: 404 });
  }

  if (session.role === "boss" && design.user_id !== session.userId) {
    return NextResponse.json({ error: "無權限" }, { status: 403 });
  }

  const { data: comments, error } = await supabase
    .from("comments")
    .select("*")
    .eq("design_id", designId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comments: comments ?? [] });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const { design_id, content } = await request.json();

  if (!design_id || !content?.trim()) {
    return NextResponse.json({ error: "請輸入評論內容" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: design } = await supabase
    .from("designs")
    .select("user_id")
    .eq("id", design_id)
    .single();

  if (!design) {
    return NextResponse.json({ error: "找不到設計圖" }, { status: 404 });
  }

  if (session.role === "boss" && design.user_id !== session.userId) {
    return NextResponse.json({ error: "無權限" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      design_id,
      author_name: session.name,
      role: session.role,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comment: data });
}
