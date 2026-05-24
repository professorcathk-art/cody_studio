# Cody Studio

帽子設計圖展示與管理系統 — 老闆瀏覽端 + 管理員後台。

## 技術棧

- **Next.js 16** (App Router)
- **Tailwind CSS 4**
- **Supabase** (PostgreSQL + Storage + Image Transformation)
- **JWT Cookie** 通關密碼登入

## 快速開始

### 1. Supabase 設定

1. 建立新 Supabase 專案（獨立於其他專案）
2. 在 SQL Editor 執行 `supabase/migrations/001_init.sql`
3. 確認 Storage 已建立 public bucket `designs`
4. 在 Project Settings → API 取得 URL 與 keys

### 2. 環境變數

```bash
cp .env.local.example .env.local
```

填入：

| 變數 | 說明 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 專案 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key（僅伺服器端） |
| `SESSION_SECRET` | JWT 簽章密鑰（`openssl rand -base64 32`） |

### 3. 啟動

```bash
npm install
npm run dev
```

開啟 [http://localhost:3000/login](http://localhost:3000/login)

**預設管理員**：密碼 `9999`

## 路由

| 路徑 | 角色 | 功能 |
|------|------|------|
| `/login` | 公開 | 4 位數通關密碼登入 |
| `/` | 老闆 | 設計圖瀑布流、狀態篩選、收藏 |
| `/design/[id]` | 老闆 | 高清大圖、狀態、評論 |
| `/admin` | 管理員 | 後台導覽 |
| `/admin/users` | 管理員 | 老闆帳號管理 |
| `/admin/designs` | 管理員 | 上傳、指派、狀態、評論 |

## 圖片優化

- **列表縮圖**：`?width=400&quality=75&format=webp`
- **詳情大圖**：`?width=1200&quality=85&format=webp`
- 使用 Next.js `<Image>` + lazy loading，不載入原圖

## 專案結構

```
cody_studio/
├── app/
│   ├── api/          # REST API
│   ├── admin/        # 管理後台
│   ├── design/       # 設計詳情
│   └── login/        # 登入
├── components/       # UI 元件
├── lib/              # auth, supabase, images
├── middleware.ts     # 路由權限
└── supabase/migrations/
```

## Git

此專案擁有獨立的 git repository（`/Users/mickeylau/cody_studio/.git`），與上層 monorepo 分離。
