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
      whatsapp: "902324457277",
      email: "info@leoconcept.com.tr",
      address: "Hürriyet Mh. Süleyman Demirel Cd. No:16 Menderes / İzmir",
      footerText:
        "LEO Concept — yaşam alanlarınıza zarafet katan mobilya tasarımları.",
      metaTitle: "LEO Concept | Mobilya & Tasarım",
      metaDescription:
        "LEO Concept, iç ve dış mekan mobilyalarında özgün tasarımlar sunar.",
    },
  });
  // Mevcut kurulumlarda boşsa WhatsApp numarasını doldur
  await prisma.siteSettings.updateMany({
    where: { id: 1, whatsapp: null },
    data: { whatsapp: "902324457277" },
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

  // Örnek ürün: Tuti Koltuk
  const tekliKoltuk = await prisma.category.findUnique({
    where: { slug: "tekli-koltuk" },
  });
  const tutiFeatures = [
    "Ölçüler | 102 × 88 × 70 cm",
    "Kumaş | Leke tutmaz, yıkanabilir kumaş",
    "Gövde | İskeletsiz, yüksek yoğunluklu sünger",
    "Renk | Krem (farklı renk seçenekleri mevcut)",
    "Garanti | 2 yıl üretici garantisi",
    "Teslimat | Kurulum gerektirmez",
  ].join("\n");
  if (tekliKoltuk) {
    await prisma.product.upsert({
      where: { slug: "tuti-koltuk" },
      update: { features: tutiFeatures },
      create: {
        name: "Tuti Koltuk",
        slug: "tuti-koltuk",
        description:
          "Yumuşak hatları ve katmanlı dokusuyla öne çıkan Tuti, oturduğunuz anda sizi saran ergonomik bir konfor sunar.\n\nİskeletsiz, tamamı yüksek yoğunluklu sünger gövdesi sayesinde hem hafif hem de dayanıklıdır. Krem rengi kumaşı, iç mekanlarınıza sıcak ve modern bir dokunuş katar. Dilerseniz puf ile birlikte kombinleyebilirsiniz.",
        features: tutiFeatures,
        categoryId: tekliKoltuk.id,
        isFeatured: true,
        images: {
          create: [
            { url: "/uploads/tuti-koltuk-1.png", alt: "Tuti Koltuk", sortOrder: 0 },
            { url: "/uploads/tuti-koltuk-2.jpg", alt: "Tuti Koltuk ve puf, şömine başında", sortOrder: 1 },
            { url: "/uploads/tuti-koltuk-3.jpg", alt: "Tuti Koltuk ve puf, üstten görünüm", sortOrder: 2 },
          ],
        },
      },
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
