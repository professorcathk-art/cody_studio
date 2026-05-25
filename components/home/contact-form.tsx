"use client";

import { useState } from "react";
import { LuxuryFieldLabel } from "@/components/luxury/typography";

const INITIAL = {
  name: "",
  email: "",
  phoneContact: "",
  company: "",
  orderSize: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState({ zh: "", en: "" });

  function update(field: keyof typeof INITIAL, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setErrorMsg({ zh: "", en: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg({
          zh: data.error ?? "傳送失敗",
          en: data.errorEn ?? "Failed to send message.",
        });
        return;
      }

      setStatus("success");
      setForm(INITIAL);
    } catch {
      setStatus("error");
      setErrorMsg({
        zh: "連線失敗，請直接來信 chris.lau@professor-cat.com",
        en: "Connection failed. Please email chris.lau@professor-cat.com directly.",
      });
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    {
      id: "name",
      en: "Name",
      zh: "姓名",
      value: form.name,
      type: "text",
    },
    {
      id: "email",
      en: "Email",
      zh: "電郵",
      value: form.email,
      type: "email",
    },
    {
      id: "phoneContact",
      en: "WhatsApp / Other Contact",
      zh: "WhatsApp 或其他聯絡方式",
      value: form.phoneContact,
      type: "text",
    },
    {
      id: "company",
      en: "Company Name",
      zh: "公司名稱",
      value: form.company,
      type: "text",
    },
    {
      id: "orderSize",
      en: "Estimated Order Size",
      zh: "預估訂單數量",
      value: form.orderSize,
      type: "text",
    },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {fields.map((field) => (
        <div key={field.id} className="space-y-3">
          <LuxuryFieldLabel
            htmlFor={field.id}
            en={field.en}
            zh={field.zh}
          />
          <input
            id={field.id}
            type={field.type}
            required
            value={field.value}
            onChange={(e) => update(field.id, e.target.value)}
            className="w-full border-0 border-b border-neutral-300 bg-transparent py-3 text-sm text-neutral-900 transition placeholder:text-neutral-300 focus:border-neutral-900 focus:outline-none"
          />
        </div>
      ))}

      <div className="space-y-3">
        <LuxuryFieldLabel en="Message" zh="需求描述" htmlFor="message" />
        <textarea
          id="message"
          required
          rows={4}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className="w-full resize-none border border-neutral-200 bg-transparent px-0 py-3 text-sm text-neutral-900 transition placeholder:text-neutral-300 focus:border-neutral-900 focus:outline-none sm:px-3"
        />
      </div>

      {status === "success" && (
        <div className="border border-neutral-200 bg-neutral-50 px-4 py-4 text-sm">
          <p className="text-neutral-800">訊息已送出，我們將盡快與您聯繫。</p>
          <p className="mt-1 text-xs text-neutral-500">
            Message sent. We will be in touch shortly.
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800">
          <p>{errorMsg.zh}</p>
          <p className="mt-1 text-xs text-red-600">{errorMsg.en}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="min-h-12 w-full border border-neutral-950 bg-neutral-950 px-8 py-3 text-[11px] font-medium uppercase tracking-[0.25em] text-white transition hover:bg-neutral-800 disabled:opacity-50 sm:w-auto"
      >
        {loading ? "Sending… / 傳送中" : "Submit Inquiry / 提交查詢"}
      </button>
    </form>
  );
}
