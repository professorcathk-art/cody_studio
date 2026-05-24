-- 支援 4–6 位數組織通關密碼（如 12345）
ALTER TABLE users ALTER COLUMN passcode TYPE VARCHAR(10);
