-- 簡化設計狀態為三種：待審批、已批准、退稿
-- 先將舊狀態迁移至新狀態
UPDATE designs SET status = '已批准' WHERE status IN ('打版中', '生產中');

ALTER TABLE designs DROP CONSTRAINT IF EXISTS designs_status_check;
ALTER TABLE designs ADD CONSTRAINT designs_status_check
  CHECK (status IN ('待審批', '已批准', '退稿'));
