// Merak Edilenler (SSS) içeriği: mevcut kayıtları temizleyip
// 10 soruluk güncel listeyi sortOrder sırasıyla yükler.
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

const faqs: { question: string; answer: string }[] = [
  {
    question: "Ürünleriniz için fiyat bilgisini nasıl alabilirim?",
    answer:
      "İlgilendiğiniz ürünün sayfasındaki WhatsApp hattımızdan, iletişim formumuzdan veya mağazalarımızı ziyaret ederek güncel fiyat ve stok bilgisi alabilirsiniz.",
  },
  {
    question: "Özel tasarım hizmeti veriyor musunuz?",
    answer:
      "Evet. Yaşam alanınızın ölçülerine, tarzınıza ve ihtiyaçlarınıza özel tasarım ve üretim yapıyoruz. Özel Tasarım sayfamızdaki formu doldurun; keşif, tasarım, üretim ve teslim sürecini birlikte planlayalım.",
  },
  {
    question: "Teslimat süreniz ne kadar?",
    answer:
      "Stoktaki ürünlerde teslimat birkaç gün içinde planlanır; özel üretim ve özel tasarım siparişlerinde süre projeye göre değişir. Net teslim tarihi sipariş onayı sırasında sizinle paylaşılır.",
  },
  {
    question: "Türkiye'nin her yerine gönderim yapıyor musunuz?",
    answer:
      "Evet, anlaşmalı nakliye ağımızla tüm Türkiye'ye gönderim yapıyoruz. Büyük ürünler özenli ambalajlama ile taşınır.",
  },
  {
    question: "Teak mobilyaların bakımı nasıl yapılmalı?",
    answer:
      "Doğal teak, dış mekanda zamanla zarif bir gümüş-gri patina alır; bu bir kusur değil malzemenin doğasıdır. Yılda bir iki kez yumuşak fırça ve sabunlu suyla temizlemeniz yeterlidir; ilk günkü rengi korumak isterseniz teak yağı uygulanabilir.",
  },
  {
    question: "Rattan ve doğal dokuma ürünler dış mekanda kullanılabilir mi?",
    answer:
      "Doğal rattan ve dokuma ürünleri iç mekan ve kapalı teraslar için öneririz. Dış mekan koleksiyonlarımızda ise UV dayanımlı sentetik rattan ve dış mekan ipleri kullanılır; her ürünün sayfasında malzeme bilgisi belirtilir.",
  },
  {
    question: "Minder ve kumaşlar güneşe ve suya dayanıklı mı?",
    answer:
      "Dış mekan koleksiyonlarımızda solmaya karşı UV dayanımlı ve su itici özel dokuma kumaşlar kullanıyoruz. Minder kılıfları çıkarılabilir ve temizlenebilir.",
  },
  {
    question: "Ürünleri yerinde görebileceğim bir mağazanız var mı?",
    answer:
      "Evet; Çeşme, Bodrum ve Menderes şubelerimizde koleksiyonlarımızı yakından inceleyebilirsiniz. Adres ve çalışma saatleri için Mağazalar sayfamıza göz atın.",
  },
  {
    question: "Kurulum ve montaj hizmeti sunuyor musunuz?",
    answer:
      "Evet, montaj gerektiren ürünlerde teslimatla birlikte kurulum desteği sağlıyoruz. Detaylar sipariş sırasında planlanır.",
  },
  {
    question: "Otel, restoran ve mimari projeler için çalışıyor musunuz?",
    answer:
      "Evet. Otel, restoran, cafe ve konut projeleri için proje bazlı üretim ve tedarik yapıyoruz. Projenizi iletişim sayfamızdan veya mağazalarımızdan bize aktarmanız yeterli.",
  },
];

async function main() {
  await prisma.faq.deleteMany({});
  for (let i = 0; i < faqs.length; i++) {
    await prisma.faq.create({
      data: { ...faqs[i], sortOrder: i, isActive: true },
    });
    console.log(`✓ ${faqs[i].question}`);
  }
  console.log(`\nTamamlandı. ${faqs.length} soru yüklendi.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
