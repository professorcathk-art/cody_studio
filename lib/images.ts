const BUCKET = "designs";

/** 從 storage path 或完整 URL 提取相對路徑 */
export function extractStoragePath(imageUrl: string): string {
  if (!imageUrl.includes("/storage/v1/")) {
    return imageUrl.replace(/^\/+/, "");
  }

  const publicMatch = imageUrl.match(/\/object\/public\/designs\/(.+?)(?:\?|$)/);
  if (publicMatch) return decodeURIComponent(publicMatch[1]);

  const renderMatch = imageUrl.match(/\/render\/image\/public\/designs\/(.+?)(?:\?|$)/);
  if (renderMatch) return decodeURIComponent(renderMatch[1]);

  return imageUrl;
}

/** Supabase Image Transformation — 列表縮圖 */
export function getThumbnailUrl(imageUrl: string, width = 400): string {
  return getTransformedUrl(imageUrl, { width, quality: 75, format: "webp" });
}

/** Supabase Image Transformation — 詳情高清圖 */
export function getDetailUrl(imageUrl: string, width = 1200): string {
  return getTransformedUrl(imageUrl, { width, quality: 85, format: "webp" });
}

export function getTransformedUrl(
  imageUrl: string,
  opts: { width: number; quality: number; format: "webp" | "origin" }
): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) return imageUrl;

  const path = extractStoragePath(imageUrl);
  const params = new URLSearchParams({
    width: String(opts.width),
    quality: String(opts.quality),
    format: opts.format,
  });

  return `${baseUrl}/storage/v1/render/image/public/${BUCKET}/${path}?${params}`;
}

/** 上傳後的公開 object URL（不含 transform） */
export function getPublicObjectUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) return path;
  return `${baseUrl}/storage/v1/object/public/${BUCKET}/${path}`;
}

export function getSupabaseHostname(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}
