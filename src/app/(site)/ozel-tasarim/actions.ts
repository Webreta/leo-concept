"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

const requestSchema = z.object({
  name: z.string().min(2, "Adınızı girin"),
  email: z.string().email("Geçerli bir e-posta girin"),
  phone: z.string().optional(),
  area: z.string().optional(),
  message: z.string().min(10, "Projenizi en az 10 karakterle anlatın"),
});

const ALLOWED = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf"];
const MAX_FILE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 3;

export type DesignFormState = {
  success?: boolean;
  error?: string;
};

// Özel tasarım talepleri de ContactMessage tablosunda tutulur;
// admin panelinde ayırt edilebilmesi için mesaj başına etiket eklenir.
// Eklenen dosyalar public/uploads'a kaydedilir, linkleri mesaja yazılır.
export async function sendDesignRequest(
  _prev: DesignFormState,
  formData: FormData
): Promise<DesignFormState> {
  const parsed = requestSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    area: formData.get("area") || undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length > MAX_FILES) {
    return { error: `En fazla ${MAX_FILES} dosya yükleyebilirsiniz` };
  }
  for (const file of files) {
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED.includes(ext)) {
      return { error: `İzin verilmeyen dosya türü: ${ext || file.name}` };
    }
    if (file.size > MAX_FILE) {
      return { error: `${file.name} çok büyük (en fazla 10MB)` };
    }
  }

  const urls: string[] = [];
  if (files.length > 0) {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    for (const file of files) {
      const ext = path.extname(file.name).toLowerCase();
      const base = slugify(path.basename(file.name, ext)) || "dosya";
      const name = `talep-${base}-${crypto.randomBytes(4).toString("hex")}${ext}`;
      await writeFile(
        path.join(uploadDir, name),
        Buffer.from(await file.arrayBuffer())
      );
      urls.push(`/uploads/${name}`);
    }
  }

  const { name, email, phone, area, message } = parsed.data;
  const attachments =
    urls.length > 0 ? `\n\nEkler:\n${urls.join("\n")}` : "";
  await prisma.contactMessage.create({
    data: {
      name,
      email,
      phone,
      message: `[Özel Tasarım${area ? ` — ${area}` : ""}]\n${message}${attachments}`,
    },
  });
  return { success: true };
}
