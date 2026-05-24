import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createSessionToken, COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { passcode } = await request.json();

    if (!passcode || !/^\d{4,6}$/.test(passcode)) {
      return NextResponse.json(
        { error: "請輸入 4–6 位數通關密碼" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, role")
      .eq("passcode", passcode)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "密碼錯誤，請重新輸入" },
        { status: 401 }
      );
    }

    const token = await createSessionToken({
      userId: user.id,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      role: user.role,
      name: user.name,
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "登入失敗" }, { status: 500 });
  }
}
