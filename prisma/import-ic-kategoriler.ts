// scrape-ic-kategoriler.ts çıktısını (data/*.json) veritabanına aktarır:
// Vitrin/Konsol, iç mekan Sandalye/Tabure, iç mekan Keyif Ürünleri ve Puf.
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

type ImportProduct = {
  name: string;
  slug: string;
  sortOrder: number;
  description: string | null;
  images: { file: string; alt: string }[];
};

const categories: { slug: string; jsonFile: string }[] = [
  { slug: "vitrin-konsol", jsonFile: "vitrin-konsol-urunler.json" },
  { slug: "ic-sandalye-tabure", jsonFile: "ic-sandalye-tabure-urunler.json" },
  { slug: "ic-keyif-urunleri", jsonFile: "ic-keyif-urunleri-urunler.json" },
  { slug: "puf", jsonFile: "puf-urunler.json" },
];

async function main() {
  for (const c of categories) {
    const category = await prisma.category.findUnique({ where: { slug: c.slug } });
    if (!category)
      throw new Error(`'${c.slug}' kategorisi bulunamadı. Önce kategori importunu çalıştırın.`);

    const products: ImportProduct[] = JSON.parse(
      readFileSync(join(__dirname, "data", c.jsonFile), "utf-8")
    );

    for (const p of products) {
      const images = p.images.map((img, i) => ({
        url: `/uploads/${img.file}`,
        alt: img.alt,
        sortOrder: i,
      }));
      await prisma.product.upsert({
        where: { slug: p.slug },
        update: {
          name: p.name,
          description: p.description,
          sortOrder: p.sortOrder,
          categoryId: category.id,
          images: { deleteMany: {}, create: images },
        },
        create: {
          name: p.name,
          slug: p.slug,
          description: p.description,
          sortOrder: p.sortOrder,
          categoryId: category.id,
          images: { create: images },
        },
      });
      console.log(`✓ [${c.slug}] ${p.name} (${images.length} görsel)`);
    }

    const count = await prisma.product.count({ where: { categoryId: category.id } });
    console.log(`→ ${c.slug} kategorisinde ${count} ürün var.\n`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
