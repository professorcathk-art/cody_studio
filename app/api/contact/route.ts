import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

const TO_EMAIL = "professor.cat.hk@gmail.com";

interface ContactPayload {
  name: string;
  email: string;
  phoneContact: string;
  company: string;
  orderSize: string;
  message: string;
}

function isValidPayload(body: unknown): body is ContactPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    typeof b.email === "string" &&
    typeof b.phoneContact === "string" &&
    typeof b.company === "string" &&
    typeof b.orderSize === "string" &&
    typeof b.message === "string"
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "無效的請求", errorEn: "Invalid request." },
      { status: 400 }
    );
  }

  if (!isValidPayload(body)) {
    return NextResponse.json(
      { error: "請填寫所有欄位", errorEn: "Please complete all fields." },
      { status: 400 }
    );
  }

  const name = body.name.trim();
  const email = body.email.trim();
  const phoneContact = body.phoneContact.trim();
  const company = body.company.trim();
  const orderSize = body.orderSize.trim();
  const message = body.message.trim();

  if (!name || !email || !phoneContact || !company || !orderSize || !message) {
    return NextResponse.json(
      { error: "請填寫所有欄位", errorEn: "Please complete all fields." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const { data: saved, error: dbError } = await supabase
    .from("contact_inquiries")
    .insert({
      name,
      email,
      phone_contact: phoneContact,
      company,
      order_size: orderSize,
      message,
      status: "new",
      email_sent: false,
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json(
      {
        error: "儲存失敗，請稍後再試或直接來信 chris.lau@professor-cat.com",
        errorEn: "Failed to save inquiry. Please email chris.lau@professor-cat.com directly.",
      },
      { status: 500 }
    );
  }

  let emailSent = false;
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    const resend = new Resend(apiKey);
    const html = `
      <h2>New Project Inquiry — Cody Cap Studio</h2>
      <p><strong>Name / 姓名:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email / 電郵:</strong> ${escapeHtml(email)}</p>
      <p><strong>WhatsApp / Other / 其他聯絡:</strong> ${escapeHtml(phoneContact)}</p>
      <p><strong>Company / 公司:</strong> ${escapeHtml(company)}</p>
      <p><strong>Order Size / 訂單數量:</strong> ${escapeHtml(orderSize)}</p>
      <hr />
      <p><strong>Message / 需求描述:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `;

    const { error: emailError } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: TO_EMAIL,
      replyTo: email,
      subject: `[Cody Cap Studio] New inquiry — ${name} (${company})`,
      html,
    });

    emailSent = !emailError;

    if (emailSent) {
      await supabase
        .from("contact_inquiries")
        .update({ email_sent: true })
        .eq("id", saved.id);
    }
  }

  return NextResponse.json({ success: true, emailSent });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
