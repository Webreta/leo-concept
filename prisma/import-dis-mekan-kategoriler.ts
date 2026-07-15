import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

// leoconcept.com.tr/kesfet/1001/dis-mekan.aspx sayfasındaki ana kategoriler.
// "tekli-koltuk" ve "koltuk-takimi-kanepe" iç mekanla çakıştığı için "dis-" önekli.
const categories = [
  { name: "Tekli Koltuk", slug: "dis-tekli-koltuk", image: "kategori-dis-tekli-koltuk.jpg" },
  { name: "Masa Takımı", slug: "masa-takimi", image: "kategori-masa-takimi.jpg" },
  { name: "Koltuk Takımı / Kanepe", slug: "dis-koltuk-takimi-kanepe", image: "kategori-dis-koltuk-takimi-kanepe.jpg" },
  { name: "Sandalye / Tabure", slug: "sandalye-tabure", image: "kategori-sandalye-tabure.jpg" },
  { name: "Masa", slug: "masa", image: "kategori-masa.jpg" },
  { name: "Aksesuar / Tamamlayıcılar", slug: "aksesuar-tamamlayicilar", image: "kategori-aksesuar-tamamlayicilar.jpg" },
  { name: "Şezlong", slug: "sezlong", image: "kategori-sezlong.jpg" },
  { name: "Şemsiye / Gölgelendirme", slug: "semsiye-golgelendirme", image: "kategori-semsiye-golgelendirme.jpg" },
  { name: "Keyif Ürünleri", slug: "keyif-urunleri", image: "kategori-keyif-urunleri.jpg" },
  { name: "Kırlent", slug: "kirlent", image: "kategori-kirlent.png" },
];

async function main() {
  // Dış mekan sıralaması iç mekan kategorilerinden sonra başlasın
  const maxIc = await prisma.category.aggregate({
    where: { area: "ic-mekan" },
    _max: { sortOrder: true },
  });
  let sort = (maxIc._max.sortOrder ?? -1) + 1;

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        area: "dis-mekan",
        imageUrl: `/uploads/${c.image}`,
        sortOrder: sort,
        isActive: true,
      },
      create: {
        name: c.name,
        slug: c.slug,
        area: "dis-mekan",
        imageUrl: `/uploads/${c.image}`,
        sortOrder: sort,
        isActive: true,
      },
    });
    console.log(`✓ ${c.name} (${c.slug})`);
    sort++;
  }

  const count = await prisma.category.count({ where: { area: "dis-mekan" } });
  console.log(`\nTamamlandı. Dış mekanda ${count} kategori var.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
