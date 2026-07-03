import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/slugify";

const ALLOWED = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".pdf"];
const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Dosya çok büyük (max 20MB)" }, { status: 400 });
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED.includes(ext)) {
    return NextResponse.json(
      { error: `İzin verilmeyen dosya türü: ${ext}` },
      { status: 400 }
    );
  }

  const base = slugify(path.basename(file.name, ext)) || "dosya";
  const name = `${base}-${crypto.randomBytes(4).toString("hex")}${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(
    path.join(uploadDir, name),
    Buffer.from(await file.arrayBuffer())
  );

  return NextResponse.json({ url: `/uploads/${name}` });
}
