// İç/dış mekan kategorilerini kapaklarıyla birlikte upsert eder.
// Kapak dosyaları public/uploads altında hazırdır ve elle seçilmiş
// "ortam çekimi" fotoğraflardır — bu script dosya indirmez/ezmez.
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

type Cat = {
  name: string;
  slug: string;
  area: "ic-mekan" | "dis-mekan";
  sortOrder: number;
  file: string;
};

const categories: Cat[] = [
  // ---- İç Mekan ----
  { name: "Tekli Koltuk", slug: "tekli-koltuk", area: "ic-mekan", sortOrder: 0, file: "kategori-tekli-koltuk-v2.jpg" },
  { name: "Vitrin / Konsol", slug: "vitrin-konsol", area: "ic-mekan", sortOrder: 1, file: "kategori-vitrin-konsol-v2.jpg" },
  { name: "Sehpa", slug: "sehpa", area: "ic-mekan", sortOrder: 2, file: "kategori-sehpa-v2.webp" },
  { name: "Sandalye / Tabure", slug: "ic-sandalye-tabure", area: "ic-mekan", sortOrder: 3, file: "kategori-ic-sandalye-tabure-v2.jpg" },
  { name: "Koltuk Takımı / Kanepe", slug: "koltuk-takimi-kanepe", area: "ic-mekan", sortOrder: 4, file: "kategori-koltuk-takimi-kanepe-v2.jpg" },
  { name: "Aydınlatma", slug: "aydinlatma", area: "ic-mekan", sortOrder: 5, file: "kategori-aydinlatma-v2.jpg" },
  { name: "Aksesuar / Tamamlayıcılar", slug: "ic-aksesuar-tamamlayicilar", area: "ic-mekan", sortOrder: 6, file: "kategori-ic-aksesuar-tamamlayicilar-v2.jpg" },
  { name: "Keyif Ürünleri", slug: "ic-keyif-urunleri", area: "ic-mekan", sortOrder: 7, file: "kategori-ic-keyif-urunleri-v2.jpg" },
  { name: "Puf", slug: "puf", area: "ic-mekan", sortOrder: 8, file: "kategori-puf-v2.jpg" },
  { name: "Karyola / Başlık", slug: "karyola-baslik", area: "ic-mekan", sortOrder: 9, file: "kategori-karyola-baslik-v2.jpg" },
  // ---- Dış Mekan ----
  { name: "Tekli Koltuk", slug: "dis-tekli-koltuk", area: "dis-mekan", sortOrder: 10, file: "kategori-dis-tekli-koltuk-v2.jpg" },
  { name: "Masa Takımı", slug: "masa-takimi", area: "dis-mekan", sortOrder: 11, file: "kategori-masa-takimi-v2.jpg" },
  { name: "Koltuk Takımı / Kanepe", slug: "dis-koltuk-takimi-kanepe", area: "dis-mekan", sortOrder: 12, file: "kategori-dis-koltuk-takimi-kanepe-v2.jpg" },
  { name: "Sandalye / Tabure", slug: "sandalye-tabure", area: "dis-mekan", sortOrder: 13, file: "kategori-sandalye-tabure-v2.jpg" },
  { name: "Masa", slug: "masa", area: "dis-mekan", sortOrder: 14, file: "kategori-masa-v2.jpg" },
  { name: "Aksesuar / Tamamlayıcılar", slug: "aksesuar-tamamlayicilar", area: "dis-mekan", sortOrder: 15, file: "kategori-aksesuar-tamamlayicilar-v2.jpg" },
  { name: "Şezlong", slug: "sezlong", area: "dis-mekan", sortOrder: 16, file: "kategori-sezlong-v2.jpg" },
  { name: "Şemsiye / Gölgelendirme", slug: "semsiye-golgelendirme", area: "dis-mekan", sortOrder: 17, file: "kategori-semsiye-golgelendirme-v2.jpg" },
  { name: "Keyif Ürünleri", slug: "keyif-urunleri", area: "dis-mekan", sortOrder: 18, file: "kategori-keyif-urunleri-v3.jpg" },
  { name: "Kırlent", slug: "kirlent", area: "dis-mekan", sortOrder: 19, file: "kategori-kirlent-v3.jpg" },
];

async function main() {
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        area: c.area,
        imageUrl: `/uploads/${c.file}`,
        sortOrder: c.sortOrder,
        isActive: true,
      },
      create: {
        name: c.name,
        slug: c.slug,
        area: c.area,
        imageUrl: `/uploads/${c.file}`,
        sortOrder: c.sortOrder,
        isActive: true,
      },
    });
    console.log(`✓ [${c.area}] ${c.name} → ${c.file}`);
  }

  // Canlı sitede olmayan, ürünsüz ve kapaksız eski kategori: pasif kalsın
  await prisma.category.updateMany({
    where: { slug: "bahce-oturma-grubu" },
    data: { isActive: false },
  });

  const [ic, dis] = await Promise.all([
    prisma.category.count({ where: { area: "ic-mekan", isActive: true } }),
    prisma.category.count({ where: { area: "dis-mekan", isActive: true } }),
  ]);
  console.log(`\nTamamlandı. Aktif: iç mekan ${ic}, dış mekan ${dis} kategori.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
