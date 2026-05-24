-- Cody Studio: 帽子設計圖展示與管理系統
-- 在 Supabase SQL Editor 執行此腳本

-- 用戶表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  passcode CHAR(4) NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'boss')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 設計圖表
CREATE TABLE IF NOT EXISTS designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT '待審批'
    CHECK (status IN ('待審批', '已批准', '退稿')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, design_id)
);

-- 評論表
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'boss')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_designs_user_id ON designs(user_id);
CREATE INDEX IF NOT EXISTS idx_designs_status ON designs(status);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_design_id ON favorites(design_id);
CREATE INDEX IF NOT EXISTS idx_comments_design_id ON comments(design_id);

-- 預設管理員
INSERT INTO users (name, passcode, role)
VALUES ('Admin', '9999', 'admin')
ON CONFLICT (passcode) DO NOTHING;

-- Storage bucket（需在 Dashboard 建立 public bucket 名為 designs，或執行下方）
INSERT INTO storage.buckets (id, name, public)
VALUES ('designs', 'designs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage 政策：允許 service role 上傳；公開讀取
CREATE POLICY "Public read designs bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'designs');

CREATE POLICY "Service role upload designs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'designs');

CREATE POLICY "Service role update designs"
ON storage.objects FOR UPDATE
USING (bucket_id = 'designs');

CREATE POLICY "Service role delete designs"
ON storage.objects FOR DELETE
USING (bucket_id = 'designs');
