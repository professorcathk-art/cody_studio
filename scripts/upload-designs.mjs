/**
 * 批量上傳本地 designs/ 資料夾圖片至 Supabase Storage + designs 資料表
 * Usage: node scripts/upload-designs.mjs [--boss "Boss A"] [--passcode 12345]
 */
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DESIGNS_DIR = path.join(ROOT, "designs");
const BUCKET = "designs";

function loadEnv() {
  const envPath = path.join(ROOT, ".env.local");
  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

function getPublicUrl(supabaseUrl, filePath) {
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${filePath}`;
}

function mimeFor(file) {
  const ext = path.extname(file).toLowerCase();
  const map = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
  };
  return map[ext] ?? "application/octet-stream";
}

async function main() {
  loadEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars in .env.local");

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 取得 Boss A（依名稱或 passcode）
  const bossNameArg = process.argv.includes("--boss")
    ? process.argv[process.argv.indexOf("--boss") + 1]
    : "Boss A";
  const passcode = process.argv.includes("--passcode")
    ? process.argv[process.argv.indexOf("--passcode") + 1]
    : "12345";

  let { data: boss } = await supabase
    .from("users")
    .select("id, name, passcode")
    .eq("name", bossNameArg)
    .eq("role", "boss")
    .maybeSingle();

  if (!boss) {
    const res = await supabase
      .from("users")
      .select("id, name, passcode")
      .eq("passcode", passcode)
      .maybeSingle();
    boss = res.data;
  }

  if (!boss) {
    const { data, error } = await supabase
      .from("users")
      .insert({ name: bossNameArg, passcode, role: "boss" })
      .select()
      .single();
    if (error) {
      console.error("Failed to create boss user:", error.message);
      console.error("\nRun this SQL in Supabase if passcode column is CHAR(4):");
      console.error("  ALTER TABLE users ALTER COLUMN passcode TYPE VARCHAR(10);");
      process.exit(1);
    }
    boss = data;
    console.log(`Created boss: ${boss.name} (passcode ${passcode})`);
  } else {
    console.log(`Using existing boss: ${boss.name} (${boss.id})`);
  }

  const files = fs
    .readdirSync(DESIGNS_DIR)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .sort();

  console.log(`Found ${files.length} images in designs/\n`);

  let uploaded = 0;
  let skipped = 0;

  for (const filename of files) {
    const localPath = path.join(DESIGNS_DIR, filename);
    const storagePath = `${boss.id}/${filename}`;

    // 跳過已存在的
    const { data: existing } = await supabase
      .from("designs")
      .select("id")
      .eq("user_id", boss.id)
      .like("image_url", `%${filename}`)
      .maybeSingle();

    if (existing) {
      console.log(`  skip  ${filename} (already in DB)`);
      skipped++;
      continue;
    }

    const buffer = fs.readFileSync(localPath);
    const contentType = mimeFor(filename);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, { contentType, upsert: true });

    if (uploadError) {
      console.error(`  FAIL  ${filename}: ${uploadError.message}`);
      continue;
    }

    const imageUrl = getPublicUrl(url, storagePath);
    const title = `設計 ${path.parse(filename).name}`;

    const { error: insertError } = await supabase.from("designs").insert({
      user_id: boss.id,
      title,
      description: "",
      image_url: imageUrl,
      status: "待審批",
    });

    if (insertError) {
      console.error(`  FAIL DB ${filename}: ${insertError.message}`);
      continue;
    }

    console.log(`  ok    ${filename} (${(buffer.length / 1024 / 1024).toFixed(1)} MB)`);
    uploaded++;
  }

  console.log(`\nDone: ${uploaded} uploaded, ${skipped} skipped, ${files.length - uploaded - skipped} failed`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
