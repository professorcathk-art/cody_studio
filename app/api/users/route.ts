import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, name, passcode, role, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { name, passcode } = await request.json();

  if (!name?.trim()) {
    return NextResponse.json({ error: "請輸入姓名" }, { status: 400 });
  }
  if (!passcode || !/^\d{4,6}$/.test(passcode)) {
    return NextResponse.json({ error: "密碼須為 4–6 位數字" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("users")
    .insert({ name: name.trim(), passcode, role: "boss" })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "此密碼已被使用" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: data });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { id, passcode, name } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "缺少用戶 ID" }, { status: 400 });
  }

  const updates: Record<string, string> = {};
  if (name?.trim()) updates.name = name.trim();
  if (passcode) {
    if (!/^\d{4,6}$/.test(passcode)) {
      return NextResponse.json({ error: "密碼須為 4–6 位數字" }, { status: 400 });
    }
    updates.passcode = passcode;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "無更新內容" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "此密碼已被使用" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: data });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "缺少用戶 ID" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: user } = await supabase
    .from("users")
    .select("role")
    .eq("id", id)
    .single();

  if (user?.role === "admin") {
    return NextResponse.json({ error: "無法刪除管理員帳號" }, { status: 400 });
  }

  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
