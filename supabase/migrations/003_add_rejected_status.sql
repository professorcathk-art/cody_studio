-- 新增「退稿」狀態
ALTER TABLE designs DROP CONSTRAINT IF EXISTS designs_status_check;
ALTER TABLE designs ADD CONSTRAINT designs_status_check
  CHECK (status IN ('待審批', '已批准', '打版中', '生產中', '退稿'));
