-- 聯絡表單查詢紀錄（admin 後台查看、搜尋、備份）
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_contact TEXT NOT NULL,
  company TEXT NOT NULL,
  order_size TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'read', 'archived')),
  email_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at
  ON contact_inquiries(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status
  ON contact_inquiries(status);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_company
  ON contact_inquiries(company);

ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
-- 無公開 policy；僅 service role（API）可讀寫
