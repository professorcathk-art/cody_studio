import { NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = "professor.cat.hk@gmail.com";

interface ContactPayload {
  name: string;
  contact: string;
  company: string;
  orderSize: string;
  message: string;
}

function isValidPayload(body: unknown): body is ContactPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    typeof b.contact === "string" &&
    typeof b.company === "string" &&
    typeof b.orderSize === "string" &&
    typeof b.message === "string"
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "郵件服務未設定", errorEn: "Email service is not configured." },
      { status: 503 }
    );
  }

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
  const contact = body.contact.trim();
  const company = body.company.trim();
  const orderSize = body.orderSize.trim();
  const message = body.message.trim();

  if (!name || !contact || !company || !orderSize || !message) {
    return NextResponse.json(
      { error: "請填寫所有欄位", errorEn: "Please complete all fields." },
      { status: 400 }
    );
  }

  const resend = new Resend(apiKey);
  // Resend free tier — default sender only
  const from = "onboarding@resend.dev";

  const replyTo = contact.includes("@") ? contact : undefined;

  const html = `
    <h2>New Project Inquiry — Cody Cap Studio</h2>
    <p><strong>Name / 姓名:</strong> ${escapeHtml(name)}</p>
    <p><strong>Contact / 聯絡方式:</strong> ${escapeHtml(contact)}</p>
    <p><strong>Company / 公司:</strong> ${escapeHtml(company)}</p>
    <p><strong>Order Size / 訂單數量:</strong> ${escapeHtml(orderSize)}</p>
    <hr />
    <p><strong>Message / 需求描述:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
  `;

  const { error } = await resend.emails.send({
    from,
    to: TO_EMAIL,
    replyTo,
    subject: `[Cody Cap Studio] New inquiry — ${name} (${company})`,
    html,
  });

  if (error) {
    return NextResponse.json(
      {
        error: "郵件傳送失敗，請直接來信 chris.lau@professor-cat.com",
        errorEn: "Failed to send. Please email chris.lau@professor-cat.com directly.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
