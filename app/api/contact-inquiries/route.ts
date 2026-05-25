import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ContactInquiryStatus } from "@/lib/types";

const VALID_STATUSES: ContactInquiryStatus[] = ["new", "read", "archived"];

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const status = searchParams.get("status")?.trim() ?? "all";

  const supabase = createAdminClient();
  let query = supabase
    .from("contact_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (status !== "all" && VALID_STATUSES.includes(status as ContactInquiryStatus)) {
    query = query.eq("status", status);
  }

  if (q) {
    const safe = q.replace(/,/g, " ").trim();
    query = query.or(
      `name.ilike.%${safe}%,email.ilike.%${safe}%,phone_contact.ilike.%${safe}%,company.ilike.%${safe}%,order_size.ilike.%${safe}%,message.ilike.%${safe}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ inquiries: data ?? [] });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "未授權" }, { status: 403 });
  }

  const { id, status } = await request.json();

  if (!id || !status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "無效的參數" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("contact_inquiries")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ inquiry: data });
}
