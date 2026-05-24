import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPublicObjectUrl } from "@/lib/images";
import type { DesignStatus } from "@/lib/types";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const all = searchParams.get("all") === "true";

  const supabase = createAdminClient();

  let query = supabase
    .from("designs")
    .select("*, users(name)")
    .order("created_at", { ascending: false });

  if (session.role === "boss") {
    query = query.eq("user_id", session.userId);
  } else if (!all) {
    const userId = searchParams.get("user_id");
    if (userId) query = query.eq("user_id", userId);
  }

  if (status && status !== "全部") {
    query = query.eq("status", status);
  }

  const { data: designs, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let favoriteIds = new Set<string>();
  if (session.role === "boss") {
    const { data: favorites } = await supabase
      .from("favorites")
      .select("design_id")
      .eq("user_id", session.userId);

    favoriteIds = new Set(favorites?.map((f) => f.design_id) ?? []);
  }

  const result = designs?.map((d) => ({
    ...d,
    boss_name: d.users?.name ?? null,
    is_favorited: favoriteIds.has(d.id),
    users: undefined,
  }));

  return NextResponse.json({ designs: result ?? [] });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() ?? "";
  const userId = formData.get("user_id") as string;

  if (!file || !title || !userId) {
    return NextResponse.json({ error: "請填寫所有必填欄位" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "僅支援圖片格式" }, { status: 400 });
  }

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json({ error: "檔案大小不可超過 10MB" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const filePath = `${userId}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from("designs")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const imageUrl = getPublicObjectUrl(filePath);

  const { data, error } = await supabase
    .from("designs")
    .insert({
      user_id: userId,
      title,
      description,
      image_url: imageUrl,
      status: "待審批" as DesignStatus,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ design: data });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const { id, status } = await request.json();

  if (!id || !status) {
    return NextResponse.json({ error: "缺少必要參數" }, { status: 400 });
  }

  const validStatuses = ["待審批", "已批准", "打版中", "生產中", "退稿"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "無效的狀態" }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (session.role === "boss") {
    const { data: design } = await supabase
      .from("designs")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!design || design.user_id !== session.userId) {
      return NextResponse.json({ error: "無權限" }, { status: 403 });
    }
  } else if (session.role !== "admin") {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("designs")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ design: data });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "缺少設計 ID" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: design } = await supabase
    .from("designs")
    .select("image_url")
    .eq("id", id)
    .single();

  if (design?.image_url) {
    const pathMatch = design.image_url.match(/\/designs\/(.+?)(?:\?|$)/);
    if (pathMatch) {
      await supabase.storage.from("designs").remove([pathMatch[1]]);
    }
  }

  const { error } = await supabase.from("designs").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
