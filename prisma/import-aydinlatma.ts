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

async function main() {
  // İç mekan sıralamasında mevcut kategorilerin sonuna eklenir
  const maxIc = await prisma.category.aggregate({
    where: { area: "ic-mekan" },
    _max: { sortOrder: true },
  });

  const category = await prisma.category.upsert({
    where: { slug: "aydinlatma" },
    update: {
      name: "Aydınlatma",
      area: "ic-mekan",
      imageUrl: "/uploads/kategori-aydinlatma.jpg",
      isActive: true,
    },
    create: {
      name: "Aydınlatma",
      slug: "aydinlatma",
      area: "ic-mekan",
      imageUrl: "/uploads/kategori-aydinlatma.jpg",
      sortOrder: (maxIc._max.sortOrder ?? -1) + 1,
      isActive: true,
    },
  });
  console.log(`✓ Kategori: ${category.name} (${category.slug})\n`);

  const products: ImportProduct[] = JSON.parse(
    readFileSync(join(__dirname, "data", "aydinlatma-urunler.json"), "utf-8")
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
    console.log(`✓ ${p.name} (${images.length} görsel)`);
  }

  const count = await prisma.product.count({
    where: { categoryId: category.id },
  });
  console.log(`\nTamamlandı. Aydınlatma kategorisinde ${count} ürün var.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
