import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Admin kullanıcı
  const email = process.env.ADMIN_EMAIL ?? "admin@leoconcept.com.tr";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash: await bcrypt.hash(password, 10),
      name: "Admin",
    },
  });

  // Site ayarları
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: "LEO Concept",
      phone: "+90 232 445 72 77",
      email: "info@leoconcept.com.tr",
      address: "Hürriyet Mh. Süleyman Demirel Cd. No:16 Menderes / İzmir",
      footerText:
        "LEO Concept — yaşam alanlarınıza zarafet katan mobilya tasarımları.",
      metaTitle: "LEO Concept | Mobilya & Tasarım",
      metaDescription:
        "LEO Concept, iç ve dış mekan mobilyalarında özgün tasarımlar sunar.",
    },
  });

  // Hero slide
  if ((await prisma.heroSlide.count()) === 0) {
    await prisma.heroSlide.create({
      data: {
        title: "Keşfetmekten Vazgeçmeyenlere",
        subtitle: "Yaşam alanlarınıza yeni bir soluk getiren tasarımlar",
        imageUrl: "/uploads/placeholder-hero.svg",
        buttonText: "Kategorileri İncele",
        buttonUrl: "/kategoriler",
        sortOrder: 0,
      },
    });
  }

  // Kategoriler
  const categories = [
    { name: "Tekli Koltuk", slug: "tekli-koltuk", area: "ic-mekan" },
    { name: "Sehpa", slug: "sehpa", area: "ic-mekan" },
    {
      name: "Koltuk Takımı / Kanepe",
      slug: "koltuk-takimi-kanepe",
      area: "ic-mekan",
    },
    { name: "Vitrin / Konsol", slug: "vitrin-konsol", area: "ic-mekan" },
    { name: "Bahçe Oturma Grubu", slug: "bahce-oturma-grubu", area: "dis-mekan" },
    { name: "Şezlong", slug: "sezlong", area: "dis-mekan" },
  ];
  for (const [i, c] of categories.entries()) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { ...c, sortOrder: i },
    });
  }

  // Koleksiyonlar
  const collections = [
    { name: "Örnek Koleksiyon 1", slug: "ornek-koleksiyon-1" },
    { name: "Örnek Koleksiyon 2", slug: "ornek-koleksiyon-2" },
    { name: "Örnek Koleksiyon 3", slug: "ornek-koleksiyon-3" },
    { name: "Örnek Koleksiyon 4", slug: "ornek-koleksiyon-4" },
  ];
  for (const [i, c] of collections.entries()) {
    await prisma.collection.upsert({
      where: { slug: c.slug },
      update: {},
      create: { ...c, sortOrder: i },
    });
  }

  // Mağaza
  if ((await prisma.store.count()) === 0) {
    await prisma.store.create({
      data: {
        name: "LEO Concept Menderes",
        address: "Hürriyet Mh. Süleyman Demirel Cd. No:16 Menderes / İzmir",
        phone: "+90 232 445 72 77",
      },
    });
  }

  // SSS
  if ((await prisma.faq.count()) === 0) {
    await prisma.faq.createMany({
      data: [
        {
          question: "Ürünleriniz için fiyat bilgisini nasıl alabilirim?",
          answer:
            "İletişim sayfamızdan veya mağazalarımızdan bize ulaşarak teklif alabilirsiniz.",
          sortOrder: 0,
        },
        {
          question: "Özel tasarım hizmeti veriyor musunuz?",
          answer:
            "Evet, yaşam alanınıza özel ölçü ve tasarımda üretim yapıyoruz.",
          sortOrder: 1,
        },
      ],
    });
  }

  console.log("Seed tamamlandı.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
